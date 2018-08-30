<template>
  <div>
    <v-tour name="myTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
    <txDialog v-if="$root.$data.showTxDialog"></txDialog>
    <txCancelledDialog v-if="$root.$data.showTxCancelledDialog"></txCancelledDialog>
    <ViewListing v-if="$root.$data.viewListing"></ViewListing>
    <ActionRequired v-if="$root.$data.actionRequired"></ActionRequired>
    <div :class="tourRunning ? 'tour-disable' : ''">
      <SearchHelp v-if="searchTips"></SearchHelp>
      <GetMetamask v-if="$root.$data.web3status === 'missing'" />
      <Header />
      <Sidebar />
      <Chat />
      <div id="main_content">
        <Listings />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/parts/Header'
import Sidebar from '@/components/parts/Sidebar'
import Chat from '@/components/parts/Chat'
import Listings from '@/components/parts/Listings'
import SearchHelp from '@/components/parts/SearchHelp'
import ActionRequired from '@/components/parts/ActionRequired'
import GetMetamask from '@/components/parts/GetMetamask'
import txDialog from '@/components/parts/txDialog'
import txCancelledDialog from '@/components/parts/txCancelledDialog'
import ViewListing from '@/components/parts/ViewListing'
import jazzicon from 'jazzicon'

import { defaultMarket } from '../config'

export default {
  name: 'HelloWorld',
  components: {
    SearchHelp,
    Header,
    Sidebar,
    Chat,
    Listings,
    GetMetamask,
    ViewListing,
    ActionRequired,
    txDialog,
    txCancelledDialog
  },
  mounted: function () {
    if (!localStorage.getItem('tour-opt-out') || localStorage.getItem('tour-opt-out') === 'false') {
      this.$tours['myTour'].start()
      this.tourRunning = true
    }
  },
  methods: {
    endTour: function () {
      this.tourRunning = false
      localStorage.setItem('tour-opt-out', 'true')
    },
    restartTour: function () {
      this.$tours['myTour'].start()
      this.tourRunning = true
    },
    getJazzicon: (seed, size = 35) => {
      const addr = seed.slice(2, 10)
      return jazzicon(size, parseInt(addr, 16))
    }
  },
  data () {
    return {
      vault: '0x0000000000000000000000000000000000000000',
      account: '0x0000000000000000000000000000000000000000',
      web3poll: null,
      tourRunning: false,
      searchTips: false,
      pollInterval: 10,
      web3status: 'pending',
      msg: 'Welcome to Your Vue.js App',
      market: defaultMarket,
      tourCallbacks: {
        onStop: this.endTour
      },
      steps: [
        {
          target: 'header',
          content: `<div><h3>Welcome to our Marketplace!</h3><br><img src="/static/img/trade.png" alt="" height="300" /><br>Would you like to take the tour?</div>`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '.listings',
          content: `<div>These are listings! Listings are items people are selling on the market.</div>`,
          params: {
            placement: 'right'
          }
        },
        {
          target: '.listings .controls',
          content: `<div>You can either fulfill the listings, find more like it, or check out more from the merchant.</div>`,
          params: {
            placement: 'right'
          }
        },
        {
          target: '.main-search',
          content: `<div>Looking for something more? Here you can search the marketplace for more listings.</div>`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#market_selector',
          content: `<div>At any time you can switch to another marketplace</div>`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#listing_create',
          content: `<div>If you'd like to sell something, you can do so here!</div>`,
          params: {
            placement: 'right'
          }
        },
        {
          target: '#vault',
          content: `<div>One last thing! You need to setup your vault before you can do anything! Head over here as soon as you're ready to get started!</div>`,
          params: {
            placement: 'right'
          }
        },
        {
          target: '.help',
          content: `<div>You can take the tour again at any point by clicking the help icon.</div>`,
          params: {
            placement: 'left'
          }
        }
      ]
    }
  }
}
</script>
