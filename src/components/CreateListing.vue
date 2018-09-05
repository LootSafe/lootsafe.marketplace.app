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
        <h1 style="color: #fff;"><i class="fal fa-plus-square" style="color: #fff;"></i> Create Listings</h1>
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
          <h2>Your Recent Listings</h2>
          <hr>
          <MyListings v-if="$root.$data.web3status === 'connected'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from 'bignumber.js'

import Header from '@/components/parts/Header'
import Sidebar from '@/components/parts/Sidebar'
import Chat from '@/components/parts/Chat'
import MyListings from '@/components/parts/MyListings'
import GetMetamask from '@/components/parts/GetMetamask'
import ActionRequired from '@/components/parts/ActionRequired'
import ViewListing from '@/components/parts/ViewListing'

import getJazzicon from '@/components/logic/global/methods/getJazzicon'
import createListing from '@/components/logic/createListing/methods/createListing'
import data from '@/components/logic/createListing/data'

import txDialog from '@/components/parts/txDialog'
import txCancelledDialog from '@/components/parts/txCancelledDialog'

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
    createListing,
    getJazzicon
  },
  data () {
    return data
  }
}
</script>
