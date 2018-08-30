<template>
  <div id="chat">
    <div id="chat_stats" >
      <h3 class="title">Trade Chat</h3>
      <p>
        <i :style="online ? 'color:#00b894;' : 'color:#d63031;'" class="fa fa-circle"></i>
        <span class="subtle">Users Online:</span>
        {{ activeUsers }}
      </p>
    </div>

    <div id="chat_container" ref="message_container">
      <div class="message" v-for="message in messages" :key="message.time + message.account">
        <div class="left">
          <div v-if="message.account" class="chat_circle" v-html="getJazzicon(message.account).outerHTML"></div>
        </div>
        <div class="right">
          <p class="name">{{ generateUsername(message.account) }}</p>
          <p class="time">{{ message.timestamp }}</p>
          <p class="body" v-html="messageParser(message.content)"></p>
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
import { pubnub } from '../../config'
import PubNub from 'pubnub'
import jazzicon from 'jazzicon'
import randomname from 'node-random-name'
import emojione from 'emojione'

export default {
  name: 'Chat',
  data () {
    return {
      pubnub: new PubNub({
        publishKey: pubnub.publishKey,
        subscribeKey: pubnub.subscribeKey
      }),
      online: false,
      messages: [],
      activeUsers: 0
    }
  },
  created () {
    this.pubnub.subscribe({
      channels: ['trade_chat'],
      withPresence: true,
      here_now_refresh: true
    })
    this.pubnub.history(
      {
        channel: 'trade_chat',
        count: 15 // how many items to fetch
      },
      (status, response) => {
        // handle status, response
        for (let i = 0; i < response.messages.length; i++) {
          this.messages.push(Object.assign({}, response.messages[i].entry, { time: response.messages[i].timetoken, timestamp: new Date().toLocaleTimeString() }))
        }
        setTimeout(() => {
          const container = this.$el.querySelector('#chat_container')
          container.scrollTop = container.scrollHeight
        }, 50)
      }
    )
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
        console.log(msg)
        setTimeout(() => {
          const container = this.$el.querySelector('#chat_container')
          container.scrollTop = container.scrollHeight
        }, 50)
      }
    })
  },
  methods: {
    messageParser: function (message) {
      let msg = message
      msg = emojione.shortnameToImage(msg)
      return msg
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
    }
  }
}
</script>
