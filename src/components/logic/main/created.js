import {autoRefreshInterval, cacherWSServer, provider} from '@/config'
import marketABI from '../../../../contracts/erc20/build/contracts/Market'
import Eth from 'ethjs'
import _ from 'lodash'
const eth = new Eth(new Eth.HttpProvider(provider))

export default function () {
  const ws = new WebSocket(cacherWSServer)
  const getListing = (listingId) => {
    return new Promise(resolve => {
      const marketAddress = this.market.address
      const marketplace = marketABI.abi
      const contract = eth.contract(marketplace).at(marketAddress)
      contract.listings(listingId).then(resp => {
        if (resp[2] !== '0x') {
          const listing = {
            'id': parseInt(resp[0]),
            'date': resp[1],
            'merchant': resp[2],
            'asset': resp[3],
            'amount': resp[4],
            'value': resp[5],
            'status': parseInt(resp[6]),
            'flash': true
          }
          resolve(listing)
        }
      })
    })
  }

  ws.onmessage = event => {
    if (JSON.parse(event.data).type === 'listing_created') {
      getListing(JSON.parse(event.data).data).then(listing => {
        this.listings.unshift(listing)
        this.listings.splice(-1, 1)

        if (!this.tokens[listing.asset]) {
          this.getToken(listing.asset)
        }

        if (listing.merchant === this.account) {
          this.$notify({
            group: 'info',
            position: 'bottom right',
            title: 'Listing Created',
            text: `Your listing ${JSON.parse(event.data).data} has made it to the chain!`
          })
        }
      })
    } else if (JSON.parse(event.data).type === 'listing_fulfilled') {
      getListing(JSON.parse(event.data).data).then(listing => {
        const index = _.findIndex(this.listings, {id: JSON.parse(event.data).data})
        this.listings.splice(index, 1, Object.assign({}, this.listings[index], {status: 1, flash: true}))
        if (listing.merchant === this.account) {
          this.$notify({
            group: 'success',
            position: 'bottom right',
            title: 'Listing Fulfilled',
            text: `Your listing ${JSON.parse(event.data).data} has been fulfilled!`
          })
        }
      })
    } else if (JSON.parse(event.data).type === 'listing_cancelled') {
      getListing(JSON.parse(event.data).data).then(listing => {
        const index = _.findIndex(this.listings, {id: JSON.parse(event.data).data})
        this.listings.splice(index, 1, Object.assign({}, this.listings[index], {status: 2, flash: true}))
        if (listing.merchant === this.account) {
          this.$notify({
            group: 'error',
            position: 'bottom right',
            title: 'Listing Cancelled',
            text: `Your listing ${JSON.parse(event.data).data} has been cancelled.`
          })
        }
      })
    }
  }
  this.checkWeb3()
  setInterval(() => {
    this.getTokens()
  }, autoRefreshInterval)
  this.web3poll = setInterval(() => {
    this.checkWeb3()
    if (this.web3status === 'connected' || this.web3status === 'opt-out') {
      clearInterval(this.web3poll)
      this.getVault()
      this.getTokens()
    }
    this.pollInterval += 100
  }, this.pollInterval)
  this.getVault()
  this.pubnub.history(
    {
      channel: 'trade_chat',
      count: 15 // how many items to fetch
    },
    (status, response) => {
      // handle status, response
      for (let i = 0; i < response.messages.length; i++) {
        this.$root.$data.messages.push(Object.assign({}, response.messages[i].entry, { time: response.messages[i].timetoken }))
      }
      setTimeout(() => {
        const container = this.$el.querySelector('#chat_container')
        container.scrollTop = container.scrollHeight
      }, 50)
    }
  )
  this.pubnub.subscribe({
    channels: ['trade_chat'],
    withPresence: true,
    here_now_refresh: true
  })
  this.pubnub.addListener({
    status: (statusEvent) => {
      if (statusEvent.category === 'PNConnectedCategory') {
        this.online = true
        this.pubnub.hereNow(
          {
            channels: ['trade_chat']
          },
          (status, response) => {
            // handle status, response
            this.activeUsers = response.totalOccupancy
          }
        )
      }
    },
    message: (msg) => {
      this.messages.push(Object.assign({}, msg.message, { time: msg.timetoken }))
      setTimeout(() => {
        const container = this.$el.querySelector('#chat_container')
        container.scrollTop = container.scrollHeight
      }, 50)
    }
  })
}
