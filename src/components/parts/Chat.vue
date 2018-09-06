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
          <div v-if="message.account" class="chat_circle" v-html="getJazzicon(message.account, 30).outerHTML"></div>
        </div>
        <div class="right">
          <p class="name">{{ generateUsername(message.account) }}</p>
          <p class="time">{{ new Date(message.timestamp).toLocaleTimeString() }}</p>
          <p class="body" v-html="messageParser(message.content).msg" v-on:click="viewListing(messageParser(message.content).listing)"></p>
        </div>
      </div>
    </div>

    <div id="chat_compose">
      <input type="text" placeholder="hello world..." ref="chat_input" v-on:keyup.enter="sendMessage($refs.chat_input.value)"/>
      <button class="circle_button" v-on:click="sendMessage($refs.chat_input.value)">
        <i class="far fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script>
import randomname from 'node-random-name'

import data from '@/components/logic/chat/data'
import viewListing from '@/components/logic/chat/methods/viewListing'
import messageParser from '@/components/logic/chat/methods/messageParser'
import sendMessage from '@/components/logic/chat/methods/sendMessage'
import linkBuilder from '@/components/logic/chat/methods/linkBuilder'
import getJazzicon from '@/components/logic/global/methods/getJazzicon'

export default {
  name: 'Chat',
  data () {
    return data
  },
  methods: {
    updated: function () {
      const container = this.$el.querySelector('#chat_container')
      container.scrollTop = container.scrollHeight
    },
    viewListing,
    messageParser,
    generateUsername: function (seed) {
      return randomname({ seed })
    },
    getJazzicon,
    sendMessage,
    listingLinkBuilder: function (listingId) {
      return ` <span class="chatlink"><a href="#" data-listingid="${listingId}"><i class="far fa-ticket"></i> Listing ${listingId}</a></span> `
    },
    linkBuilder
  }
}
</script>
