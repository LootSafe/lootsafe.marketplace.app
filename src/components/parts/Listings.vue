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
/* global web3 */
import Search from '@/components/parts/Search'
import ethereumAddress from 'ethereum-address'
import ViewListing from '@/components/parts/ViewListing'
import Loader from '@/components/parts/Loader'

import { apiAddress } from '../../config'
import blockies from 'ethereum-blockies-png'
import jazzicon from 'jazzicon'

export default {
  name: 'Listings',
  components: {
    Search,
    ViewListing,
    Loader
  },
  data () {
    return {
      fetching: true,
      loading: true,
      listings: [],
      tokenNames: {},
      keyword: '',
      skip: 0,
      viewListing: false,
      selectedListing: {}
    }
  },
  created () {
    this.getListings('')
    // TODO: poll listings
    // TODO: Subscribe to websocket server and update listings on new listing events
  },
  methods: {
    handleNextPage: function () {
      if (this.listings.length === 15) {
        this.skip += 15
        this.getListings(this.keyword)
      }
    },
    handlePrevPage: function () {
      if (this.skip > 0) {
        this.skip -= 15
        this.getListings(this.keyword)
      }
    },
    generateBlockies: seed => {
      return blockies.createDataURL({ seed })
    },
    getJazzicon: (seed, size = 35) => {
      const addr = seed.slice(2, 10)
      return jazzicon(size, parseInt(addr, 16))
    },
    setSearchString: function (type, str) {
      this.keyword = type === 'raw' ? str : type + ':' + str
      this.getListings(this.keyword)
      this.skip = 0
    },
    getListings: function (keywords) {
      let payload = {
        market_address: this.$root.$data.market.address,
        status: 0,
        skip: this.skip
      }

      let parts = keywords.split(',')

      parts.map(part => {
        const trimmed = part.trim()
        if (trimmed.includes('asset:') && trimmed.split(':')[0] === 'asset' && ethereumAddress.isAddress(trimmed.split(':')[1])) {
          payload.asset = trimmed.split(':')[1]
        }
        if (trimmed.includes('merchant:') && trimmed.split(':')[0] === 'merchant' && ethereumAddress.isAddress(trimmed.split(':')[1])) {
          payload.merchant = trimmed.split(':')[1]
        }
      })

      if (!keywords || keywords.indexOf(':') > 1) {
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
            this.listings = json.data

            this.listings.map(listing => {
              if (!this.$root.$data.tokens[listing.asset]) {
                this.$root.getToken(listing.asset)
              }
            })

            this.fetching = false
          })
      } else {
        fetch(`${apiAddress}/market/listings?keyword=${keywords}`)
          .then((response) => {
            return response.json()
          })
          .then((json) => {
            this.listings = json.data

            this.listings.map(listing => {
              if (!this.$root.$data.tokens[listing.asset]) {
                this.$root.getToken(listing.asset)
              }
            })

            this.fetching = false
          })
      }
    }
  }
}
</script>
