<template>
  <header>
    <img src="/static/img/logo.png" class="logo" /><br />
    <p class="tagline">MARKETPLACE</p>
    <div class="navi navi_one">
      <ul>
        <li class="active">
          <a href="#">BUY</a>
        </li>
        <li>
          <a href="#">SELL</a>
        </li>
      </ul>
    </div>
    <div class="navi navi_two">
      <ul>
        <li>
          <span class="market_select">MARKET</span>
          <a href="#" v-on:click="toggleMarketSelectDropdown()">
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
          <a href="#">
            <img class="profile_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADoElEQVR4Xu3dsY0VMRRG4VkRINEBhVABAQ3QBikRATEpET3QAAGiBiQyCiDadCUCtIiM2MeSdfU+8uvx+33mXM9bv+Huxaefj9fgfx9+/T46+7fPnx69fr34HQBahABo+eVqBmgRMkDL72KAGGAtZ4CWIAO0/Bgg5pfLGaBFyAAtPwaI+eVyBmgRMkDLjwFifrmcAVqEDNDyY4CYXy5ngBYhA7T8GCDml8sZoEXIAC2/+QZ4d//96HmAL5+fpSV49foh1dfi6fO/A0BDAAAtv2t6gNPnzwA3DjAAAGATWBjQAkp612UPcPgpRgu4cYABAAB7gMKAPUBJzx7gOv1NphZw4wADAAD2AIUBe4CSnj2APcD0O2j6/I8fCKknek7/OHP6/AEQWxgAbjxAAAAgJXC6hWkBafmuiwFuPEAAACAloAXE17ydDpABEv/zeygAAJASOG0wTwFp+eYbDAAAOPuu4Ok9dPr8GYABGKAwwAAlvWv+Jmo8ANN/Hh75O17uVHB8QcTxFYwTAAAAIkKtfPyx8Pbxz1czAAMcpZABjsZ/ORZej1UfXr98eS1AC8gQlQG0gJLehloGYIANGK0PwQDr2W2pZAAG2ALS6iAMsJrcpjoGYIBNKK0NwwBruW2rYgAG2AbTykDHj4TVO+D0N4nT5w+AldvmvxoA3HiAAABASuB0C9MC0vL1P+cCIL4u/XSAWsCN30EAAEBK4LTB7AHS8tkDxPjmB6gFRASmBzh9/lrAjQMMAACc/Xn4dIVOnz8DMAADFAbGG6C+H+Dlxyclv1z79c2fPEYZYPrnz0fCpgdQFv9f7fTPD4BIAAC0gIhQK68tkAFa/lrAdAXG9QcAAGY/BWkBUQHTbwAAAKD938HT74C4/vYAALAHqDdRqq/Pwenivgmc/1UoAO7tAQoE01ugp4Cy+lqAFjDeAN/e/3gsN0HdhJ3+YUT57Dtq64GSCuAdAHYs4/oYAPCKmHV6NuxBGCDF34sZgAESRfYAKb7zxQzAAIlCBkjxnS9mAAZIFDJAiu98MQMwQKKQAVJ854sZgAEShQyQ4jtfzAAMkChkgBTf+eLjBqjvB6gROg/wUCNM9flIWLr6dV0AAEBlaHR9bQH1wzNATTDWA8BTQESolTNAyy9XMwADZIjKAAxQ0ttQywAMsAGj9SEYYD27LZUMwABbQFodhAFWk9tUxwAMsAmltWEYYC23bVUMwADbYFoZiAFWUttYc9oAfwFXV++OOZX/CQAAAABJRU5ErkJggg==" alt="" />
            ACCOUNT <i class="fa fa-sort-down"></i>
          </a>
        </li>
        <li class="help">
          <a href="#">
            <i class="fa fa-question-circle"></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="navi_center">
      <span class="volume"><img src="/static/img/logo_purple.png" /> 1,200,345.12</span>
    </div>
  </header>
</template>

<script>
import { apiAddress } from '../../config'

export default {
  name: 'Header',
  created () {
    this.getMarkets()
  },
  methods: {
    toggleMarketSelectDropdown: function () {
      this.showMarketSelect = !this.showMarketSelect
    },
    setMarket: function (market) {
      this.$parent.market = market
      this.showMarketSelect = false
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
      showMarketSelect: false,
      markets: []
    }
  }
}
</script>
