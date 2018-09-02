<template>
  <header>
    <img src="/static/img/logo.png" class="logo" /><br />
    <p class="tagline">MARKETPLACE</p>
    <div class="navi navi_one">
      <ul v-if="$root.$data.web3status === 'connected'">
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
        <li id="market_selector">
          <span class="market_select">MARKET</span>
          <a href="#" v-on:click="toggleMarketSelectDropdown(); showAccount = false">
            {{ $root.$data.market.name.toUpperCase() }}
            <i class="fa fa-sort-down"></i>
          </a>
          <div v-if="showMarketSelect" class="market-dropdown">
            <ul v-for="market in markets" v-bind:key="market._id">
              <li v-on:click="setMarket(market)"><i class="far fa-plus"> </i> Use {{ market.name }}</li>
            </ul>
          </div>
        </li>
        <li style="margin-right: 0;">
          <a href="#" v-on:click="toggleAccountDropdown(); showMarketSelect = false" >
            <div class="profile_icon" v-html="getProfileIcon().outerHTML"></div>
            ACCOUNT <i class="fa fa-sort-down"></i>
          </a>
          <div v-if="showAccount" class="account-dropdown">
            <ul>
              <li>
                <a class="account" :href="etherscan + 'address/' + $root.$data.account" target="_blank"><fa class="far fa-eye"></fa> &nbsp;View Address</a>
              </li>
              <li>
                <a href="#" class="account"><fa class="far fa-file-contract"></fa>  &nbsp; View Contracts</a>
              </li>
            </ul>
          </div>
        </li>
        <li class="help">
          <a href="#" v-on:click="restartTour()">
            <i class="fa fa-question-circle"></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="navi_center">
      <span class="volume"><img src="/static/img/logo_purple.png" /> VOLUME: {{ (dailyVolume / Math.pow(10, 18)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
    </div>
  </header>
</template>

<script>
import { apiAddress, etherscan } from '../../config'
import jazzicon from 'jazzicon'

export default {
  name: 'Header',
  created () {
    this.getMarkets()
    this.getDailyVolume()
  },
  methods: {
    restartTour: function () {
      localStorage.setItem('tour-opt-out', 'false')
      this.$router.push('/')
      this.$parent.restartTour()
    },
    getProfileIcon: function () {
      const addr = this.$root.$data.account.slice(2, 10)
      const seed = parseInt(addr, 16)
      return jazzicon(25, seed)
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
      this.$root.$data.market = market
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
      showAccount: false,
      etherscan,
      activeLink: '/',
      dailyVolume: 0,
      showMarketSelect: false,
      markets: []
    }
  }
}
</script>
