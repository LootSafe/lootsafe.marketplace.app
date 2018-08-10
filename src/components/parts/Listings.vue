<template>
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
              <span v-else>{{ listing.asset }}</span>
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
            <button>FULFILL</button>
            <button class="default">FIND MORE</button>
            <button class="info"><i class="far fa-user-tag"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { apiAddress, provider } from '../../config'
import blockies from 'ethereum-blockies-png'

import ETH from 'ethjs'
import { abi } from '../../../contracts/erc20/build/contracts/EIP20.json'

const eth = new ETH(new ETH.HttpProvider(provider))

export default {
  name: 'Listings',
  data () {
    return {
      loading: true,
      listings: [],
      tokenNames: {}
    }
  },
  created () {
    // Make request for listings and then update this.loading = falce this.listings = listings
    // TODO: Make market address correlate to market dropdown
    fetch(`${apiAddress}/market/listings?market_address=0x7A5aC300d71fe143b31e8f05D8816155570a7a74`)
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
              console.log(name)
              console.log(this)
            })
          }
        })
      })
  },

  methods: {
    generateBlockies: seed => {
      return blockies.createDataURL({ seed })
    }
  }
}
</script>
