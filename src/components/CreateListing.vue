<template>
  <div>
    <GetMetamask v-if="$root.$data.web3status === 'missing'" />
    <ActionRequired v-if="$root.$data.actionRequired"></ActionRequired>
    <Header />
    <Sidebar />
    <Chat />
    <div id="main_content">
      <ViewListing v-if="viewListing"></ViewListing>
      <txDialog v-if="showTxDialog"></txDialog>
      <txCancelledDialog v-if="showTxCancelledDialog"></txCancelledDialog>
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
              ({{ ($root.$data.tokens[token].balance / Math.pow(10, $root.$data.tokens[token].decimals)).toFixed(2) }})
              - {{ token }}
            </option>
          </select>
          <br>
          <br />
          <div class="half">
            <!-- TODO: Add logic to automatically add decimals to number -->
            <label for="amount">Amount for Sale</label><br /><br />
            <input id="amount" class="full_input" style="width: calc(100% - 2rem);" type="number" placeholder="Enter the amount you wish to sell" v-model="assetAmount"/>
          </div>
          <div class="half">
            <!-- TODO: Add logic to automatically add decimals to number -->
            <label for="cost">Cost for Item</label><br /><br />
            <input id="cost" class="full_input" type="number" placeholder="Enter the cost for the item(s)" v-model="assetCost" />
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <div class="half">&nbsp;</div>
          <div class="half">
            <div class="half">&nbsp;</div>
            <div class="half">
              <button class="full" v-on:click="createListing()">Create</button>
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
import ViewListing from '@/components/parts/ViewListing'
import GetMetamask from '@/components/parts/GetMetamask'
import ActionRequired from '@/components/parts/ActionRequired'

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
    GetMetamask,
    txDialog,
    MyListings,
    txCancelledDialog,
    ActionRequired
  },
  methods: {
    createListing: function () {
      if (this.selectedAsset && this.assetCost > 0 && this.assetAmount > 0) {
        const assetCost = new BigNumber(this.assetCost).multipliedBy(new BigNumber(10).pow(18))
        const assetAmount = new BigNumber(this.assetAmount).multipliedBy(new BigNumber(10).pow(this.$root.$data.tokens[this.selectedAsset].decimals))

        if (assetAmount.gt(this.$root.$data.tokens[this.selectedAsset].balance)) {
          this.error = 'You don\'t have ' + this.assetAmount + ' ' + this.$root.$data.tokens[this.selectedAsset].name + ' to sell!'
        } else {
          const marketAddress = this.$root.$data.market.address
          const marketplace = marketABI.abi
          const contract = web3.eth.contract(marketplace).at(marketAddress)
          this.$root.$data.actionRequired = true
          contract.create_listing(this.selectedAsset, assetAmount.toString(), assetCost.toString(), { from: web3.eth.coinbase }, (err, tx) => {
            this.$root.$data.actionRequired = false
            if (err) {
              this.showTxCancelledDialog = true
            } else {
              this.selectedAsset = ''
              this.assetCost = null
              this.assetAmount = null
              this.showTxDialog = tx
            }
          })
          this.error = false
        }
      } else {
        this.error = 'Missing required information to create listing!'
      }
    }
  },
  data () {
    return {
      error: false,
      getTokensInterval: null,
      syncing: false,
      showTxDialog: false,
      showTxCancelledDialog: false,
      selectedAsset: '',
      viewListing: false,
      selectedListing: {},
      assetCost: null,
      assetAmount: null,
      tokens: false,
      defaultTokens: (localStorage.getItem('custom_tokens')) ? defaultTokens.concat(JSON.parse(localStorage.getItem('custom_tokens'))) : defaultTokens
    }
  }
}
</script>
