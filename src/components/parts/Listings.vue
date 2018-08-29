<template>
  <div>
    <Search :keyword="keyword"/>
    <ViewListing v-if="viewListing"></ViewListing>
    <txDialog v-if="showTxDialog"></txDialog>
    <txCancelledDialog v-if="showTxCancelledDialog"></txCancelledDialog>
    <div class="listings_wrapper">
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
              <img :src="generateBlockies(listing.merchant)" alt="Merchant Icon" :title="listing.merchant" class="asset_circle">
            </td>
            <td class="small_td center">
              <i class="fa fa-exchange"></i>
            </td>
            <td class="small_td">
              <img :src="generateBlockies(listing.asset)" alt="Asset Icon" :title="listing.asset" class="asset_circle">
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
              <button v-if="listing.merchant.toLowerCase() !== $root.$data.account.toLowerCase() && $root.$data.web3status === 'connected' && $root.$data.vault !== '0x0000000000000000000000000000000000000000'" v-on:click="fulfill(listing)">FULFILL</button>
              <button v-else-if="listing.merchant.toLowerCase() !== $root.$data.account.toLowerCase()" class="disabled">FULFILL</button>
              <button class="danger" v-else v-on:click="cancelListing(listing)">CANCEL</button>
              <button class="detail" v-on:click="selectedListing = listing; viewListing = true"><i class="far fa-eye"></i></button>
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
import txDialog from '@/components/parts/txDialog'
import txCancelledDialog from '@/components/parts/txCancelledDialog'
import Loader from '@/components/parts/Loader'

import { apiAddress } from '../../config'
import blockies from 'ethereum-blockies-png'

import marketABI from '../../../contracts/erc20/build/contracts/Market.json'

export default {
  name: 'Listings',
  components: {
    Search,
    ViewListing,
    txDialog,
    txCancelledDialog,
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
      keyword: '',
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
    generateBlockies: seed => {
      return blockies.createDataURL({ seed })
    },
    setSearchString: function (type, str) {
      this.keyword = type === 'raw' ? str : type + ':' + str
      this.getListings(this.keyword)
    },
    getListings: function (keywords) {
      let payload = {
        market_address: this.$root.$data.market.address,
        status: 0
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
            if (!this.$root.$data.tokens[listing.asset]) {
              this.$root.getToken(listing.asset)
            }
          })

          this.fetching = false
        })
    },
    fulfill: function (listing) {
      const marketAddress = this.$root.$data.market.address
      const listingId = listing.id
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)
      this.$root.$data.actionRequired = true
      contract.fulfill_listing(listingId, { from: web3.eth.coinbase }, (err, tx) => {
        // TODO: Listing fulfilled popup
        this.$root.$data.actionRequired = false
        if (err) {
          this.showTxCancelledDialog = true
        } else {
          this.showTxDialog = tx
        }
      })
    },
    cancelListing: function (listing) {
      const marketAddress = this.$root.$data.market.address
      const listingId = listing.id
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)
      this.$root.$data.actionRequired = true
      contract.cancel_listing(listingId, { from: web3.eth.coinbase }, (err, tx) => {
        this.$root.$data.actionRequired = false
        // TODO: Listing fulfilled popup
        if (err) {
          this.showTxCancelledDialog = true
        } else {
          this.showTxDialog = tx
        }
      })
    }
  }
}
</script>
