<template>
  <header>
    <img src="/static/img/logo.png" class="logo" /><br />
    <p class="tagline">MARKETPLACE</p>
    <div class="navi navi_one">
      <ul v-if="$parent.web3status === 'connected'">
        <li :class="$parent.$parent.activeLink === '/' ? 'active' : ''" v-on:click="setActiveLink('/')">
          <a href="#">BUY</a>
        </li>
        <li :class="$parent.$parent.activeLink === '/listing/create' ? 'active' : ''">
          <a href="#" v-on:click="setActiveLink('/listing/create')">SELL</a>
        </li>
      </ul>
    </div>
    <div class="navi navi_two">
      <ul>
        <li>
          <span class="market_select">MARKET</span>
          <a href="#" v-on:click="toggleMarketSelectDropdown(); showAccount = false">
            {{ $parent.market.name.toUpperCase() }}
            <i class="fa fa-sort-down"></i>
          </a>
          <div v-if="showMarketSelect" class="market-dropdown">
            <ul v-for="market in markets" v-bind:key="market._id">
              <li v-on:click="setMarket(market)"><i class="far fa-plus"> </i> Use {{ market.name }}</li>
            </ul>
          </div>
        </li>
        <li style="margin-right: 0;">
          <a href="#" v-on:click="toggleAccountDropdown(); showMarketSelect = false">
            <img class="profile_icon" :src="getProfileIcon()" alt="" />
            ACCOUNT <i class="fa fa-sort-down"></i>
          </a>
          <div v-if="showAccount" class="account-dropdown">
            <ul>
              <li>{{ coinbase }}</li>
            </ul>
          </div>
        </li>
        <li class="help">
          <a href="#">
            <i class="fa fa-question-circle"></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="navi_center">
      <span class="volume"><img src="/static/img/logo_purple.png" /> {{ dailyVolume }}</span>
    </div>
  </header>
</template>

<script>
/* global web3 */
import { apiAddress } from '../../config'
import blockies from 'ethereum-blockies-png'

export default {
  name: 'Header',
  created () {
    this.getMarkets()
    this.getDailyVolume()
  },
  methods: {
    getProfileIcon: () => {
      return blockies.createDataURL({ seed: web3.eth.coinbase })
    },
    setActiveLink: function (route) {
      this.$parent.$parent.activeLink = route
      this.$router.push(route)
    },
    toggleMarketSelectDropdown: function () {
      this.showMarketSelect = !this.showMarketSelect
    },
    toggleAccountDropdown: function () {
      this.showAccount = !this.showAccount
    },
    setMarket: function (market) {
      this.$parent.market = market
      this.showMarketSelect = false
    },
    getDailyVolume: function () {
      fetch(`${apiAddress}/market/volume`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          this.dailyVolume = json.data
        })
    },
    getMarkets: function () {
      fetch(`${apiAddress}/market/list`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          this.markets = json.data
        })
    }
  },
  data () {
    return {
      coinbase: typeof web3 !== 'undefined' ? web3.eth.coinbase : '0x0000000000000000000000000000000000000000',
      showAccount: false,
      activeLink: '/',
      dailyVolume: 0,
      showMarketSelect: false,
      markets: []
    }
  }
}
</script>
