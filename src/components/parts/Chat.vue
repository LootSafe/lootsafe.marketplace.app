<template>
  <div id="chat">
    <div id="chat_stats" >
      <h3 class="title">Trade Chat</h3>
      <p>
        <i :style="$root.$data.online ? 'color:#00b894;' : 'color:#d63031;'" class="fa fa-circle"></i>
        <span class="subtle">Users Online:</span>
        {{ $root.$data.activeUsers }}
      </p>
    </div>

    <div id="chat_container" ref="message_container">
      <div class="message" v-for="message in $root.$data.messages" :key="message.time + message.account">
        <div class="left">
          <div v-if="message.account" class="chat_circle" v-html="getJazzicon(message.account).outerHTML"></div>
        </div>
        <div class="right">
          <p class="name">{{ generateUsername(message.account) }}</p>
          <p class="time">{{ message.timestamp }}</p>
          <p class="body" v-html="messageParser(message.content).msg" v-on:click="viewListing(messageParser(message.content).listing)"></p>
        </div>
      </div>
    </div>

    <div id="chat_compose">
      <input type="text" placeholder="hello world..." ref="chat_input" v-on:keyup.enter="sendMesage($refs.chat_input.value)"/>
      <button class="circle_button" v-on:click="sendMesage($refs.chat_input.value)">
        <i class="far fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { pubnub, provider } from '../../config'
import PubNub from 'pubnub'
import jazzicon from 'jazzicon'
import randomname from 'node-random-name'
import emojione from 'emojione'

import Eth from 'ethjs'

import marketABI from '../../../contracts/erc20/build/contracts/Market.json'

const eth = new Eth(new Eth.HttpProvider(provider)) // eslint-disable-line no-unused-vars

export default {
  name: 'Chat',
  data () {
    return {
      pubnub: new PubNub({
        publishKey: pubnub.publishKey,
        subscribeKey: pubnub.subscribeKey
      }),
      online: false,
      activeUsers: 0
    }
  },
  created () {
  },
  methods: {
    viewListing: function (id) {
      if (id) {
        const marketAddress = this.$root.$data.market.address
        const marketplace = marketABI.abi
        const contract = eth.contract(marketplace).at(marketAddress)

        contract.listings(id).then(resp => {
          if (resp[2] !== '0x') {
            const listing = {
              'id': resp[0],
              'date': resp[1],
              'merchant': resp[2],
              'asset': resp[3],
              'amount': resp[4],
              'value': resp[5],
              'status': resp[6]
            }
            this.$root.getToken(listing.asset)
            this.$root.$data.selectedListing = listing
            this.$root.$data.viewListing = true
          }
        })
      }
    },
    messageParser: function (message) {
      let msg = message
      msg = emojione.shortnameToImage(msg)
      const linkResponse = this.linkBuilder(msg)
      return { msg: linkResponse.message, listing: linkResponse.listing }
    },
    generateUsername: function (seed) {
      return randomname({ seed })
    },
    getJazzicon: (seed, size = 30) => {
      const addr = seed.slice(2, 10)
      return jazzicon(size, parseInt(addr, 16))
    },
    sendMesage: function (message) {
      this.$refs.chat_input.value = ''
      const publishConfig = {
        channel: 'trade_chat',
        message: {
          account: this.$root.$data.account,
          content: message
        }
      }
      this.pubnub.publish(publishConfig, function (status, response) {
        console.log(status, response)
      })
    },
    listingLinkBuilder: function (listingId) {
      return ` <span class="chatlink"><a href="#" data-listingid="${listingId}"><i class="far fa-ticket"></i> Listing ${listingId}</a></span> `
    },
    linkBuilder: function (message) {
      const startIndex = message.indexOf('[')
      const content = message.match(/\[(.*)\]/)
      const originalMessage = message.replace(/ *\[[^\]]*]/, '')

      if (content) {
        const messageObject = {
          type: null,
          data: null,
          originalMessage: message,
          message: originalMessage,
          startIndex
        }
        if (content != null) {
          var data = content.pop().split(':')
          if (data != null) {
            if (data.length === 2) {
              messageObject['type'] = data[0]
              messageObject['data'] = data[1]
              messageObject['message'] = originalMessage
              messageObject['startIndex'] = startIndex
            }
          }
        }
        const cleanMessage = messageObject.message
        const replacemntPayload = this.listingLinkBuilder(messageObject.data)
        return {
          message: cleanMessage.substr(0, startIndex) + replacemntPayload + cleanMessage.substr(startIndex),
          listing: messageObject.data
        }
      } else {
        return { message, listing: false }
      }
    }
  }
}
</script>
