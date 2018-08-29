// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueTour from 'vue-tour'
import Eth from 'ethjs'
/* global web3 */
import {
  defaultMarket,
  defaultTokens,
  provider,
  autoRefreshInterval
} from './config'

import marketABI from '../contracts/erc20/build/contracts/Market.json'
import { abi } from '../contracts/erc20/build/contracts/EIP20.json'
require('vue-tour/dist/vue-tour.css')

const eth = new Eth(new Eth.HttpProvider(provider)) // eslint-disable-line no-unused-vars

Vue.config.productionTip = false

Vue.use(VueTour)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  created () {
    this.listenToSockets()
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
  },
  methods: {
    listenToSockets: function () {
      // const wsClient = new WebSocket('ws://0.0.0.0:8283')
      // console.log('csfasdf')
      // wsClient.onmessage = msg => {
      //   console.log('websocket message', msg)
      // }
    },
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
    getVault: function () {
      const marketAddress = this.market.address
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)

      contract.vaults.call(web3.eth.coinbase, (err, resp) => {
        if (err) console.warn('Error getting vault address', err)
        this.vault = resp
      })
    },
    getToken: function (asset) {
      const token = eth.contract(abi).at(asset)
      token.name().then(name => {
        token.decimals().then(decimals => {
          const owner = this.$root.$data.vault
          token.balances(owner).then(balance => {
            this.tokens = Object.assign({}, this.tokens, {
              [asset]: {
                name: name[0],
                decimals: decimals[0],
                balance: balance[0],
                address: asset
              }
            })
          })
        })
      })
    },
    getTokens: function () {
      this.syncing = true
      setTimeout(() => { this.syncing = false }, 500)
      this.defaultTokens.map(asset => {
        this.getToken(asset)
      })
    }
  },
  data () {
    return {
      vault: '0x0000000000000000000000000000000000000000',
      account: '0x0000000000000000000000000000000000000000',
      web3poll: null,
      actionRequired: false,
      syncing: false,
      tokens: {},
      pollInterval: 10,
      web3status: 'pending',
      market: defaultMarket,
      defaultTokens: (localStorage.getItem('custom_tokens')) ? defaultTokens.concat(JSON.parse(localStorage.getItem('custom_tokens'))) : defaultTokens
    }
  },
  template: '<App/>'
})
