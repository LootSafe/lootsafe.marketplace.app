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
          <th align="left">COST</th>
          <th align="left">COST PER UNIT</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="listing in listings" v-bind:key="listing.id" v-if="$root.$data.tokens[listing.asset]">
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
                <span>{{ $root.$data.tokens[listing.asset].name }}</span>
              </span>
            </td>
            <td>
              <span class="asset_quantity">
                {{ (listing.amount / Math.pow(10, $root.$data.tokens[listing.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </span>
            </td>
            <td>
              <span class="asset_cost">
                <img height="10" src="/static/img/logo_purple.png" /> {{ (listing.value / Math.pow(10, 18)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </span>
            </td>
            <td>
              <span class="asset_cost">
                <img height="10" src="/static/img/logo_purple.png" /> {{ ((listing.value / Math.pow(10, 18)).toFixed(2) / (listing.amount / Math.pow(10, $root.$data.tokens[listing.asset].decimals)).toFixed(2)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </span>
            </td>
            <td class="controls">
              <button class="danger" v-if="$root.$data.web3status === 'connected' && $root.$data.vault !== '0x0000000000000000000000000000000000000000' && listing.status === 0" v-on:click="$root.cancelListing(listing)">CANCEL</button>
              <button v-else class="disabled">CANCEL</button>
              <button class="detail" v-on:click="$root.$data.selectedListing = listing; $root.$data.viewListing = true"><i class="far fa-eye"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
/* global web3 */
import Loader from '@/components/parts/Loader'
import { apiAddress } from '../../config'
import jazzicon from 'jazzicon'

export default {
  name: 'Listings',
  components: {
    Loader
  },
  data () {
    return {
      fetching: true,
      loading: true,
      showTxDialog: false,
      showTxCancelledDialog: false,
      listings: [],
      tokenNames: {},
      keyword: ''
    }
  },
  created () {
    this.getListings('')
    // TODO: poll listings
  },
  methods: {
    getJazzicon: (seed, size = 35) => {
      const addr = seed.slice(2, 10)
      return jazzicon(size, parseInt(addr, 16))
    },
    setSearchString: function (type, str) {
      this.keyword = type === 'raw' ? str : type + ':' + str
      this.getListings(this.keyword)
    },
    getListings: function (keywords) {
      let payload = {
        market_address: this.$root.$data.market.address,
        merchant: web3.toChecksumAddress(web3.eth.coinbase)
      }
      // TODO: Make market address correlate to market dropdown
      fetch(`${apiAddress}/market/listings/filtered`,
        {
          method: 'post',
          'Content-Type': 'application/json',
          body: JSON.stringify(payload)
        })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          this.listings = json.data.reverse()

          this.listings.map(listing => {
            if (!this.tokenNames[listing.asset]) {
              this.$root.getToken(listing.asset)
            }
          })

          this.fetching = false
        })
    }
  }
}
</script>
