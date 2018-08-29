<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing">
      <h2>View Listing</h2>
      <p>
        <strong>Asset: </strong>
        <span v-html="$parent.getJazzicon($parent.selectedListing.asset, 10).outerHTML" alt="Asset Icon" class="asset_circle_small"></span>
        <a :href="etherscan + 'token/' + $parent.selectedListing.asset" target="_blank">{{ $parent.selectedListing.asset }}</a>
      </p>
      <p><strong>Cost: </strong> {{ ($parent.selectedListing.value / Math.pow(10, 18)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} <img height="10" src="/static/img/logo_purple.png" /></p>
      <p><strong>Amount: </strong> {{ ($parent.selectedListing.amount / Math.pow(10, $root.$data.tokens[$parent.selectedListing.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} {{ $root.$data.tokens[$parent.selectedListing.asset].name }}(s)</p>
      <p>
        <strong>Merchant: </strong>
        <span v-html="$parent.getJazzicon($parent.selectedListing.merchant, 10).outerHTML" alt="Asset Icon" class="asset_circle_small"></span>
        <a :href="etherscan + 'address/' + $parent.selectedListing.merchant" target="_blank">{{ $parent.selectedListing.merchant }}</a>
      </p>
      <p><strong>Status: </strong> {{ $parent.selectedListing.status }} ({{ translateStatus($parent.selectedListing.status) }})</p>
      <p><strong>ID: </strong> {{ $parent.selectedListing.id }}</p>
      <p><strong>Created: </strong> {{ getTime($parent.selectedListing.date) }}</p>
      <button style="margin-left: 0;" v-if="$root.$data.web3status === 'connected' && $root.$data.vault !== '0x0000000000000000000000000000000000000000' && $parent.selectedListing.merchant.toLowerCase() !== $root.$data.account.toLowerCase()" v-on:click="$parent.fulfill($parent.selectedListing); $parent.viewListing = false">Fulfill</button><button style="margin-left: 0;" class="danger" v-else v-on:click="cancelListing($parent.selectedListing)">CANCEL LISTING</button><button style="margin-right: 0;" class="info" v-on:click="$parent.viewListing = false">Cancel</button>
    </div>
  </div>

</template>

<script>
/* global web3 */
import blockies from 'ethereum-blockies-png'
import { etherscan } from '../../config'
import marketABI from '../../../contracts/erc20/build/contracts/Market.json'

export default {
  name: 'ViewListing',
  methods: {
    generateBlockies: seed => {
      return blockies.createDataURL({ seed })
    },
    translateStatus: status => {
      const statuses = ['Active', 'Fulfilled', 'Cancelled']
      return statuses[status]
    },
    getTime: time => {
      const d = new Date()
      d.setTime(time * 1000)
      return d.toISOString()
    },
    cancelListing: function (listing) {
      const marketAddress = this.$root.$data.market.address
      const listingId = listing.id
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)
      this.$root.$data.actionRequired = true
      contract.cancel_listing(listingId, { from: web3.eth.coinbase }, (err, tx) => {
        // TODO: Listing fulfilled popup
        this.$root.$data.actionRequired = false
        if (err) {
          this.showTxCancelledDialog = true
        } else {
          this.showTxDialog = tx
        }
      })
    }
  },
  data () {
    return {
      etherscan
    }
  }
}
</script>
