<template>
  <div>
    <div class="searchbg">
      <Search :keyword="keyword"/>
    </div>
    <div class="listings_wrapper">
      <div class="paginator">
        <button :class="(skip === 0) ? 'small info' : 'small default'" v-on:click="handlePrevPage()">
          <i class="far fa-angle-double-left"></i> Prev
        </button>
        <span class="small">
          {{  (skip === 0) ? '0 - 15' : (skip > 0) ? `${skip} - ${skip + listings.length}` : `0 - ${skip}` }}
        </span>
        <button :class="(listings.length < 15) ? 'small info' : 'small default'" v-on:click="handleNextPage()">
          Next <i class="far fa-angle-double-right"></i>
        </button>
      </div>
      <table class="listings">
        <thead>
        <th>SELLER</th>
        <th></th>
        <th>ASSET</th>
          <th align="left">NAME</th>
          <th align="left">QUANTITY</th>
          <th align="left">COST</th>
          <th align="left">COST PER UNIT</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="listing in listings" v-bind:key="listing.id">
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
              <span class="asset_cost">
                <img height="10" src="/static/img/logo_purple.png" /> {{ (listing.value / Math.pow(10, 18)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
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
            <td class="controls">
              <button v-if="listing.merchant.toLowerCase() !== $root.$data.account.toLowerCase() && $root.$data.web3status === 'connected' && $root.$data.vault !== '0x0000000000000000000000000000000000000000'" v-on:click="$root.fulfill(listing)">FULFILL</button>
              <button v-else-if="listing.merchant.toLowerCase() !== $root.$data.account.toLowerCase()" class="disabled">FULFILL</button>
              <button class="danger" v-else v-on:click="$root.cancelListing(listing)">CANCEL</button>
              <button class="detail" v-on:click="$root.$data.selectedListing = listing; $root.$data.viewListing = true"><i class="far fa-eye"></i></button>
              <button class="default" v-on:click="setSearchString('asset', listing.asset)" title="Search for more of these items">FIND MORE</button>
              <button class="info" v-on:click="setSearchString('merchant', listing.merchant)" title="Search by merchant"><i class="far fa-user-tag"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <Loader v-if="fetching" />
    </div>
  </div>
</template>

<script>
import Search from '@/components/parts/Search'
import ViewListing from '@/components/parts/ViewListing'
import Loader from '@/components/parts/Loader'
import data from '@/components/logic/listings/data'
import handleNextPage from '@/components/logic/listings/methods/handleNextPage'
import handlePrevPage from '@/components/logic/listings/methods/handlePrevPage'
import getListings from '@/components/logic/listings/methods/getListings'
import setSearchString from '@/components/logic/listings/methods/setSearchString'
import getJazzicon from '@/components/logic/global/methods/getJazzicon'

export default {
  name: 'Listings',
  components: {
    Search,
    ViewListing,
    Loader
  },
  data () {
    return data
  },
  created () {
    this.getListings('')
  },
  methods: {
    handleNextPage,
    handlePrevPage,
    getJazzicon,
    setSearchString,
    getListings: getListings
  }
}
</script>
