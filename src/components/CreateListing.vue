<template>
  <div>
    <GetMetamask v-if="$root.$data.web3status === 'missing'" />
    <ViewListing v-if="viewListing"></ViewListing>
    <txDialog v-if="$root.$data.showTxDialog"></txDialog>
    <txCancelledDialog v-if="$root.$data.showTxCancelledDialog"></txCancelledDialog>
    <ViewListing v-if="$root.$data.viewListing"></ViewListing>
    <ActionRequired v-if="$root.$data.actionRequired"></ActionRequired>
    <Header />
    <Sidebar />
    <Chat />
    <div id="main_content">
      <div id="vault">
        <h1><i class="fal fa-ticket"></i> Listing Managment</h1>
        <p>Here you can create and view listings. To create a listing insure you've deposited the item into your vault prior to attempting to sell.</p>
        <hr>
        <div class="lightBG">
          <!-- TODO: Add drop-down to select asset from list of assets in vault -->
          <label for="asset">Asset for Sale</label><br /><br />
          <select name="asset" id="asset" class="full_input select" style="width: calc(100% - 0.5rem);" v-model="selectedAsset">
            <option value="" selected disabled hidden>Choose a token...</option>
            <option v-for="token in defaultTokens" :value="token" v-bind:key="token" v-if="$root.$data.tokens[token] && $root.$data.tokens[token].balance > 0">
              {{ $root.$data.tokens[token].name }}
              ({{ ($root.$data.tokens[token].balance.sub($root.$data.tokens[token].locked) / Math.pow(10, $root.$data.tokens[token].decimals)).toFixed(2) }})
              - {{ token }}
            </option>
          </select>
          <br>
          <br />
          <div class="half">
            <!-- TODO: Add logic to automatically add decimals to number -->
            <label for="amount">Amount for Sale</label><br /><br />
            <input id="amount" class="full_input" style="width: calc(100% - 2rem);" type="number" placeholder="Enter the amount you wish to sell" v-model="assetAmount" v-on:keyup="calculateCost()"/>
          </div>
          <div class="half">
            <!-- TODO: Add logic to automatically add decimals to number -->
            <label for="cost">Cost Per Item - ( {{ calculatedAssetCost }} <img src="/static/img/logo_purple.png" width="25" /> Total Listing Cost ) </label><br /><br />
            <input id="cost" class="full_input" type="number" placeholder="Enter the cost for the item(s)" v-model="assetCost" v-on:keyup="calculateCost()" />
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <div class="half">&nbsp;</div>
          <div class="half">
            <div class="half">&nbsp;</div>
            <div class="half">
              <button class="full" v-on:click="createListing()">Create Listing</button>
            </div>
          </div>
          <hr>
          <h2>Your Listings</h2>
          <hr>
          <MyListings v-if="$root.$data.web3status === 'connected'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global web3 */

import { BigNumber } from 'bignumber.js'

import Header from '@/components/parts/Header'
import Sidebar from '@/components/parts/Sidebar'
import Chat from '@/components/parts/Chat'
import MyListings from '@/components/parts/MyListings'
import GetMetamask from '@/components/parts/GetMetamask'
import ActionRequired from '@/components/parts/ActionRequired'
import ViewListing from '@/components/parts/ViewListing'
import jazzicon from 'jazzicon'

import { provider, defaultTokens } from '../config'

import txDialog from '@/components/parts/txDialog'
import txCancelledDialog from '@/components/parts/txCancelledDialog'

import Eth from 'ethjs'

import marketABI from '../../contracts/erc20/build/contracts/Market.json'

const eth = new Eth(new Eth.HttpProvider(provider)) // eslint-disable-line no-unused-vars

export default {
  name: 'CreateListing',
  components: {
    Header,
    Sidebar,
    ViewListing,
    Chat,
    txCancelledDialog,
    txDialog,
    GetMetamask,
    MyListings,
    ActionRequired
  },
  methods: {
    calculateCost: function () {
      if (this.assetAmount > 0 && this.assetCost > 0) {
        const assetCost = new BigNumber(this.assetCost).multipliedBy(this.assetAmount)
        this.calculatedAssetCost = assetCost.toString()
      }
    },
    createListing: function () {
      if (this.selectedAsset && this.assetCost > 0 && this.assetAmount > 0) {
        const assetCost = new BigNumber(this.assetCost).multipliedBy(this.assetAmount).multipliedBy(new BigNumber(10).pow(18))
        const assetAmount = new BigNumber(this.assetAmount).multipliedBy(new BigNumber(10).pow(this.$root.$data.tokens[this.selectedAsset].decimals))

        if (assetAmount.gt(this.$root.$data.tokens[this.selectedAsset].balance.sub(this.$root.$data.tokens[this.selectedAsset].locked))) {
          this.error = 'You don\'t have ' + this.assetAmount + ' ' + this.$root.$data.tokens[this.selectedAsset].name + ' to sell!'
        } else {
          const marketAddress = this.$root.$data.market.address
          const marketplace = marketABI.abi
          const contract = web3.eth.contract(marketplace).at(marketAddress)
          this.$root.$data.actionRequired = true
          contract.create_listing(this.selectedAsset, assetAmount.toString(), assetCost.toString(), { from: web3.eth.coinbase }, (err, tx) => {
            this.$root.$data.actionRequired = false
            if (err) {
              this.$root.$data.showTxCancelledDialog = true
            } else {
              this.selectedAsset = ''
              this.assetCost = null
              this.assetAmount = null
              this.$root.$data.showTxDialog = tx
            }
          })
          this.error = false
        }
      } else {
        this.error = 'Missing required information to create listing!'
      }
    },
    getJazzicon: (seed, size = 35) => {
      const addr = seed.slice(2, 10)
      return jazzicon(size, parseInt(addr, 16))
    }
  },
  data () {
    return {
      error: false,
      getTokensInterval: null,
      syncing: false,
      selectedAsset: '',
      viewListing: false,
      selectedListing: {},
      calculatedAssetCost: 0,
      assetCost: null,
      assetAmount: null,
      tokens: false,
      defaultTokens: (localStorage.getItem('custom_tokens')) ? defaultTokens.concat(JSON.parse(localStorage.getItem('custom_tokens'))) : defaultTokens
    }
  }
}
</script>
