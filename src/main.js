// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/* global web3 */
import {
  defaultMarket,
  defaultTokens,
  provider,
  autoRefreshInterval
} from './config'

import Eth from 'ethjs'

import marketABI from '../contracts/erc20/build/contracts/Market.json'
import { abi } from '../contracts/erc20/build/contracts/EIP20.json'

const eth = new Eth(new Eth.HttpProvider(provider)) // eslint-disable-line no-unused-vars

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  created () {
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
        console.log('resp', resp)
        if (err) console.warn('Error getting vault address', err)
        this.vault = resp
      })
    },
    getTokens: function () {
      this.syncing = true
      setTimeout(() => { this.syncing = false }, 500)
      this.defaultTokens.map(asset => {
        const token = eth.contract(abi).at(asset)
        token.name().then(name => {
          token.decimals().then(decimals => {
            const owner = this.$root.$data.vault
            token.balances(owner).then(balance => {
              this.tokens = Object.assign({}, this.tokens, {
                [asset]: {
                  name: name[0],
                  decimals: decimals[0],
                  balance: balance[0]
                }
              })
            })
          })
        })
      })
    }
  },
  data () {
    return {
      vault: '0x0000000000000000000000000000000000000000',
      account: '0x0000000000000000000000000000000000000000',
      web3poll: null,
      syncing: false,
      tokens: false,
      pollInterval: 10,
      web3status: 'pending',
      market: defaultMarket,
      defaultTokens: (localStorage.getItem('custom_tokens')) ? defaultTokens.concat(JSON.parse(localStorage.getItem('custom_tokens'))) : defaultTokens
    }
  },
  template: '<App/>'
})
