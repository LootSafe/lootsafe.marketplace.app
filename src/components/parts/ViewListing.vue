<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing">
      <h2>View Listing</h2>
      <p><strong>Asset: </strong> <img :src="generateBlockies($parent.selectedListing.asset)" alt="Asset Icon" class="asset_circle_small"> {{ $parent.selectedListing.asset }}</p>
      <p><strong>Cost: </strong> {{ $parent.selectedListing.value }}</p>
      <p><strong>Amount: </strong> {{ $parent.selectedListing.amount }}</p>
      <p><strong>Merchant: </strong> <img :src="generateBlockies($parent.selectedListing.merchant)" alt="Asset Icon" class="asset_circle_small"> {{ $parent.selectedListing.merchant }}</p>
      <p><strong>Status: </strong> {{ $parent.selectedListing.status }}</p>
      <p><strong>ID: </strong> {{ $parent.selectedListing.id }}</p>
      <p><strong>Created: </strong> {{ $parent.selectedListing.date }}</p>
      <button v-on:click="$parent.fulfill($parent.selectedListing); $parent.viewListing = false">Fulfill</button><button class="info" v-on:click="$parent.viewListing = false">Cancel</button>
    </div>
  </div>

</template>

<script>
import blockies from 'ethereum-blockies-png'

export default {
  name: 'ViewListing',
  methods: {
    generateBlockies: seed => {
      return blockies.createDataURL({ seed })
    }
  },
  data () {
    return {}
  }
}
</script>
