<template>
  <div id="side_menu">
    <ul>
      <li v-on:click="setActiveLink('/')">
        <i :class="$parent.$parent.activeLink === '/' ? 'fal fa-home active' : 'fal fa-home'"></i>
      </li>
      <li v-on:click="setActiveLink('vault')">
        <i :class="$parent.$parent.activeLink === 'vault' ? 'fal fa-wallet active' : flashVault ? 'fal fa-wallet pulse' : 'fal fa-wallet'"></i>
      </li>
      <li>
        <i class="fal fa-ticket"></i>
      </li>
      <li class="soon">
        <i class="fal fa-stopwatch"></i>
      </li>
    </ul>
  </div>
</template>

<script>
/* global web3 */
import marketABI from '../../../contracts/erc20/build/contracts/Market.json'

export default {
  name: 'Sidebar',
  methods: {
    setActiveLink: function (route) {
      this.$parent.$parent.activeLink = route
      this.$router.push(route)
    },
    getVault: function () {
      const marketAddress = this.$parent.market.address
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)

      contract.vaults.call(web3.eth.coinbase, (err, resp) => {
        if (err) console.warn('Error getting vault address', err)
        if (resp === '0x0000000000000000000000000000000000000000') {
          this.flashVault = true
        }
      })
    }
  },
  created () {
    this.getVault()
  },
  data () {
    return {
      flashVault: false,
      activeLink: '/'
    }
  }
}
</script>
