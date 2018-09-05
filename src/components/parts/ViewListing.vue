<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing" class="double_wide" v-if="$root.$data.tokens[$root.$data.selectedListing.asset]">
      <div class="half_container">
        <div>
          <h2>View Listing</h2>
          <p>
            <strong>Asset: </strong>
            <span v-html="$parent.getJazzicon($root.$data.selectedListing.asset, 10).outerHTML" alt="Asset Icon" class="asset_circle_small"></span>
            <a :href="etherscan + 'token/' + $root.$data.selectedListing.asset" target="_blank">{{ $root.$data.selectedListing.asset }}</a>
          </p>
          <p><strong>Cost: </strong> {{ ($root.$data.selectedListing.value / Math.pow(10, 18)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} <img height="10" src="/static/img/logo_purple.png" /></p>
          <p><strong>Amount: </strong> {{ ($root.$data.selectedListing.amount / Math.pow(10, $root.$data.tokens[$root.$data.selectedListing.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} {{ $root.$data.tokens[$root.$data.selectedListing.asset].name }}(s)</p>
          <p>
            <strong>Merchant: </strong>
            <span v-html="$parent.getJazzicon($root.$data.selectedListing.merchant, 10).outerHTML" alt="Asset Icon" class="asset_circle_small"></span>
            <a :href="etherscan + 'address/' + $root.$data.selectedListing.merchant" target="_blank">{{ $root.$data.selectedListing.merchant }}</a>
          </p>
          <p><strong>Status: </strong> {{ $root.$data.selectedListing.status }} ({{ translateStatus($root.$data.selectedListing.status) }})</p>
          <p><strong>ID: </strong> {{ $root.$data.selectedListing.id }}</p>
          <p><strong>Created: </strong> {{ getTime($root.$data.selectedListing.date) }}</p>
          <button style="margin-left: 0;" v-if="$root.$data.web3status === 'connected' && $root.$data.vault !== '0x0000000000000000000000000000000000000000' && $root.$data.selectedListing.merchant.toLowerCase() !== $root.$data.account.toLowerCase()" v-on:click="$root.fulfill($root.$data.selectedListing); $root.$data.viewListing = false">Fulfill</button><button style="margin-left: 0;" class="danger" v-else v-on:click="$root.cancelListing($root.$data.selectedListing)">CANCEL LISTING</button><button style="margin-right: 0;" class="info" v-on:click="$root.$data.viewListing = false">Cancel</button>
        </div>
      </div>
      <div class="half_container">
        <div class="divider"></div>
        <div class="half">
          <h2>Last Price</h2>
          <h1 v-if="lastSell">
            {{ (lastSell / Math.pow(10, $root.$data.tokens[$root.$data.selectedListing.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
            <img src="/static/img/logo_purple.png" height="15" />
          </h1>
          <h1 v-else><i class="fa fa-spin fa-spinner-third"></i></h1>
        </div>
        <div class="half">
          <h2>Lowest Ask</h2>
          <h1 v-if="lowestAsk">
            {{ (lowestAsk / Math.pow(10, $root.$data.tokens[$root.$data.selectedListing.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
            <img src="/static/img/logo_purple.png" height="15" />
          </h1>
          <h1 v-else><i class="fa fa-spin fa-spinner-third"></i></h1>
        </div>
        <br style="clear: both;">
        <br style="clear: both;">
        <hr style="clear: both;"/>
        <h2>Last 10 Trades</h2>
        <br>
        <Chart :height="150" />
      </div>
    </div>
  </div>
</template>

<script>
/* global web3 */
import { etherscan, apiAddress } from '@/config'
import Chart from '@/components/parts/Chart'

export default {
  name: 'ViewListing',
  components: {
    Chart
  },
  mounted () {
    fetch(`${apiAddress}/market/lastsell?asset=${web3.toChecksumAddress(this.$root.$data.selectedListing.asset)}`)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.lastSell = json.data.value / (json.data.amount / Math.pow(10, this.$root.$data.tokens[this.$root.$data.selectedListing.asset].decimals))
      })
    fetch(`${apiAddress}/market/lowestask?asset=${web3.toChecksumAddress(this.$root.$data.selectedListing.asset)}`)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.lowestAskListing = json.data
        this.lowestAsk = json.data.per
      })
  },
  methods: {
    translateStatus: status => {
      const statuses = ['Active', 'Fulfilled', 'Cancelled']
      return statuses[status]
    },
    getTime: time => {
      const d = new Date()
      d.setTime(time * 1000)
      return d.toISOString()
    }
  },
  data () {
    return {
      lowestAskListing: false,
      lowestAsk: false,
      lastSell: false,
      etherscan
    }
  }
}
</script>
