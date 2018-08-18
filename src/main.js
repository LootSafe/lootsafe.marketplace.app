// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/* global web3 */
import { defaultMarket } from './config'

import marketABI from '../contracts/erc20/build/contracts/Market.json'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  created () {
    this.checkWeb3()
    this.web3poll = setInterval(() => {
      this.checkWeb3()
      if (this.web3status === 'connected') {
        clearInterval(this.web3poll)
      }
      this.pollInterval += 100
    }, this.pollInterval)
    this.getVault()
  },
  methods: {
    checkWeb3: function () {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined' && web3.eth.coinbase !== null) {
        this.web3status = 'connected'
        this.account = web3.eth.coinbase
      } else {
        this.web3status = 'missing'
      }
    },
    getVault: function () {
      const marketAddress = this.market.address
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)

      contract.vaults.call(web3.eth.coinbase, (err, resp) => {
        if (err) console.warn('Error getting vault address', err)
        this.vault = resp
      })
    }
  },
  data () {
    return {
      vault: '0x0000000000000000000000000000000000000000',
      account: '0x0000000000000000000000000000000000000000',
      web3poll: null,
      pollInterval: 10,
      web3status: 'pending',
      market: defaultMarket
    }
  },
  template: '<App/>'
})
