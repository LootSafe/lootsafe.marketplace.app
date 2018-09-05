<template>
  <div>
    <Loader v-if="fetching" />
    <div class="listings_wrapper my_listings">
      <table class="listings">
        <thead>
        <th>SELLER</th>
        <th></th>
        <th>ASSET</th>
          <th align="left">NAME</th>
          <th align="left">QUANTITY</th>
          <th align="left">COST PER UNIT</th>
          <th align="left">TOTAL COST</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="listing in $root.$data.listings" v-bind:key="JSON.stringify(listing)" :class="listing.flash ? 'animated fadeIn' : ''">
              <td class="small_td">
              <div class="asset_circle" v-html="getJazzicon(listing.merchant).outerHTML"></div>
            </td>
            <td class="small_td center">
              <i class="fa fa-exchange"></i>
            </td>
            <td class="small_td">
              <div class="asset_circle" v-html="getJazzicon(listing.asset).outerHTML"></div>
            </td>
            <td>
              <span class="asset_name" :title="listing.asset">
                <span v-if="$root.$data.tokens[listing.asset]">{{ $root.$data.tokens[listing.asset].name }}</span>
                <span v-else>
                  <i class="fa fa-spin fa-spinner-third"></i> Fetching from chain...
                </span>
              </span>
            </td>
            <td>
              <span class="asset_quantity" v-if="$root.$data.tokens[listing.asset]">
                {{ (listing.amount / Math.pow(10, $root.$data.tokens[listing.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </span>
              <span v-else>
                <i class="fa fa-spin fa-spinner-third"></i>
              </span>
            </td>
            <td>
              <span class="asset_cost" v-if="$root.$data.tokens[listing.asset]">
                <img height="10" src="/static/img/logo_purple.png" /> {{ ((listing.value / Math.pow(10, 18)).toFixed(2) / (listing.amount / Math.pow(10, $root.$data.tokens[listing.asset].decimals)).toFixed(2)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </span>
              <span v-else>
                <i class="fa fa-spin fa-spinner-third"></i>
              </span>
            </td>
            <td>
              <span class="asset_cost">
                <img height="10" src="/static/img/logo_purple.png" /> {{ (listing.value / Math.pow(10, 18)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </span>
            </td>
            <td class="controls">
              <button class="danger" v-if="$root.$data.web3status === 'connected' && $root.$data.vault !== '0x0000000000000000000000000000000000000000' && listing.status === 0" v-on:click="$root.cancelListing(listing)">CANCEL</button>
              <button v-else class="disabled">CLOSED</button>
              <button class="detail" v-on:click="$root.$data.selectedListing = listing; $root.$data.viewListing = true"><i class="far fa-eye"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import Loader from '@/components/parts/Loader'

import getJazzicon from '@/components/logic/global/methods/getJazzicon'
import getListings from '@/components/logic/myListings/methods/getListings'
import data from '@/components/logic/myListings/data'

export default {
  name: 'Listings',
  components: {
    Loader
  },
  data () {
    return data
  },
  created () {
    this.getListings('')
    // TODO: poll listings
  },
  methods: {
    getJazzicon,
    getListings
  }
}
</script>
