// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueTour from 'vue-tour'
import Eth from 'ethjs'
import Notifications from 'vue-notification'

/* global web3 */
import {
  provider
} from './config'

import created from '@/components/logic/main/created'
import data from '@/components/logic/main/data'
import fulfill from '@/components/logic/main/methods/fulfill'
import cancelListing from '@/components/logic/main/methods/cancelListing'
import getToken from '@/components/logic/main/methods/getToken'
import getTokens from '@/components/logic/main/methods/getTokens'
import getVault from '@/components/logic/main/methods/getVault'

require('vue-tour/dist/vue-tour.css')

const eth = new Eth(new Eth.HttpProvider(provider)) // eslint-disable-line no-unused-vars

Vue.config.productionTip = false

Vue.use(VueTour)
Vue.use(Notifications)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  created,
  methods: {
    cancelWeb3Poll: function () {
      this.web3status = 'opt-out'
      clearInterval(this.web3poll)
    },
    checkWeb3: function () {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined' && web3.eth.coinbase !== null) {
        this.web3status = 'connected'
        this.account = web3.eth.coinbase
      } else if (this.pollInterval > 200) {
        this.web3status = 'missing'
      }
    },
    fulfill,
    cancelListing,
    getVault,
    getToken,
    getTokens
  },
  data () {
    return data
  },
  template: '<App/>'
})
