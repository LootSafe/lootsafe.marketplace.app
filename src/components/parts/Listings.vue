<template>
  <div>
    <Search :keyword="keyword"/>
    <div class="listings_wrapper">
      <table class="listings">
        <thead>
        <th>SELLER</th>
        <th></th>
        <th>ASSET</th>
          <th align="left">NAME</th>
          <th align="left">QUANTITY</th>
          <th align="left">COST</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="listing in listings" v-bind:key="listing.id">
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
                <span v-if="tokenNames[listing.asset]">{{ tokenNames[listing.asset] }}</span>
                <span v-else>{{ listing.asset }} <i class="fas fa-spin fa-spinner"></i></span>
              </span>
            </td>
            <td>
              <span class="asset_quantity">
                {{ listing.amount }}
              </span>
            </td>
            <td>
              <span class="asset_cost">
                <img height="10" src="/static/img/logo_purple.png" /> {{ listing.value }}
              </span>
            </td>
            <td class="controls">
              <button v-if="$parent.web3status === 'connected' && $parent.vault !== '0x0000000000000000000000000000000000000000'" v-on:click="fulfill(listing)">FULFILL</button>
              <button v-else class="disabled">FULFILL</button>
              <button class="default" v-on:click="setSearchString('asset', listing.asset)" >FIND MORE</button>
              <button class="info" v-on:click="setSearchString('merchant', listing.merchant)"><i class="far fa-user-tag"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Search from '@/components/parts/Search'
import ethereumAddress from 'ethereum-address'

import { apiAddress, provider } from '../../config'
import blockies from 'ethereum-blockies-png'

import ETH from 'ethjs'
import { abi } from '../../../contracts/erc20/build/contracts/EIP20.json'
import marketABI from '../../../contracts/erc20/build/contracts/Market.json'

const eth = new ETH(new ETH.HttpProvider(provider))

export default {
  name: 'Listings',
  components: {
    Search
  },
  data () {
    return {
      loading: true,
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
    generateBlockies: seed => {
      return blockies.createDataURL({ seed })
    },
    setSearchString: function (type, str) {
      this.keyword = type === 'raw' ? str : type + ':' + str
      this.getListings(this.keyword)
    },
    getListings: function (keywords) {
      let payload = {
        market_address: this.$parent.market.address,
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
          this.listings = json.data

          this.listings.map(listing => {
            const token = eth.contract(abi).at(listing.asset)
            if (!this.tokenNames[listing.asset]) {
              token.name().then(name => {
                this.tokenNames = Object.assign({}, this.tokenNames, {
                  [listing.asset]: name[0]
                })
              })
            }
          })
        })
    },
    fulfill: function (listing) {
      const marketAddress = this.$parent.market.address
      const listingId = listing.id
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)
      contract.fulfill_listing(listingId, { from: web3.eth.coinbase }, function (resp) {
        // TODO: Listing fulfilled popup
        console.log(resp)
      })
    }
  }
}
</script>
