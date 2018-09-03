import {autoRefreshInterval} from '@/config'

export default function () {
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
        this.$root.$data.messages.push(Object.assign({}, response.messages[i].entry, { time: response.messages[i].timetoken, timestamp: new Date().toLocaleTimeString() }))
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
      this.messages.push(Object.assign({}, msg.message, { time: msg.timetoken, timestamp: new Date().toLocaleTimeString() }))
      setTimeout(() => {
        const container = this.$el.querySelector('#chat_container')
        container.scrollTop = container.scrollHeight
      }, 50)
    }
  })
}
