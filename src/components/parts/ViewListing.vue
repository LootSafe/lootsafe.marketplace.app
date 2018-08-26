<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing">
      <h2>View Listing</h2>
      <p>
        <strong>Asset: </strong>
        <img :src="generateBlockies($parent.selectedListing.asset)" alt="Asset Icon" class="asset_circle_small">
        <a :href="etherscan + 'token/' + $parent.selectedListing.asset" target="_blank">{{ $parent.selectedListing.asset }}</a>
      </p>
      <p><strong>Cost: </strong> {{ ($parent.selectedListing.value / Math.pow(10, 18)).toFixed(2) }} <img height="10" src="/static/img/logo_purple.png" /></p>
      <p><strong>Amount: </strong> {{ ($parent.selectedListing.amount / Math.pow(10, $root.$data.tokens[$parent.selectedListing.asset].decimals)).toFixed(2) }} {{ $root.$data.tokens[$parent.selectedListing.asset].name }}(s)</p>
      <p>
        <strong>Merchant: </strong>
        <img :src="generateBlockies($parent.selectedListing.merchant)" alt="Asset Icon" class="asset_circle_small">
        <a :href="etherscan + 'address/' + $parent.selectedListing.merchant" target="_blank">{{ $parent.selectedListing.merchant }}</a>
      </p>
      <p><strong>Status: </strong> {{ $parent.selectedListing.status }} ({{ translateStatus($parent.selectedListing.status) }})</p>
      <p><strong>ID: </strong> {{ $parent.selectedListing.id }}</p>
      <p><strong>Created: </strong> {{ getTime($parent.selectedListing.date) }}</p>
      <button style="margin-left: 0;" v-if="$root.$data.web3status === 'connected' && $root.$data.vault !== '0x0000000000000000000000000000000000000000'" v-on:click="$parent.fulfill($parent.selectedListing); $parent.viewListing = false">Fulfill</button><button style="margin-right: 0;" class="info" v-on:click="$parent.viewListing = false">Cancel</button>
    </div>
  </div>

</template>

<script>
import blockies from 'ethereum-blockies-png'
import { etherscan } from '../../config'

export default {
  name: 'ViewListing',
  methods: {
    generateBlockies: seed => {
      return blockies.createDataURL({ seed })
    },
    translateStatus: status => {
      const statuses = ['Active', 'Cancelled', 'Fulfilled']
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
      etherscan
    }
  }
}
</script>
