<template>
  <div>
    <GetMetamask v-if="$root.$data.web3status === 'missing'" />
    <txDialog v-if="$root.$data.showTxDialog"></txDialog>
    <txCancelledDialog v-if="$root.$data.showTxCancelledDialog"></txCancelledDialog>
    <ViewListing v-if="$root.$data.viewListing"></ViewListing>
    <ActionRequired v-if="$root.$data.actionRequired"></ActionRequired>
    <Header />
    <Sidebar />
    <Chat />
    <div id="main_content">
      <div id="vault">
        <h1 style="color: #fff;"><i class="fal fa-history" style="color: #fff;"></i> Transaction History</h1>
        <p>View your history on the marketplace, this includes fulfilling, selling, and cancelling listings as well as other important events.</p>
        <hr>
        <div class="history_scroll">
          <table class="listings">
            <thead>
              <th align="left">Type</th>
              <th align="left">At</th>
              <th align="left">Description</th>
              <th align="left">View Listing</th>
            </thead>
            <tbody>
              <tr v-for="event in history" v-bind:key="event._id">
                <td>{{ event.type }}</td>
                <td>{{ new Date(event.date * 1000).toLocaleString() }}</td>
                <td v-if="$root.$data.tokens[event.ref.asset]">
                  <span v-if="event.type === 'ListingFulfilled' && event.ref.merchant.toLowerCase() === $root.$data.account.toLowerCase()">
                    You sold {{ (event.ref.amount / Math.pow(10, $root.$data.tokens[event.ref.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} {{ $root.$data.tokens[event.ref.asset].name }} for {{ (event.ref.value / Math.pow(10, 18))}}
                  </span>
                  <span v-if="event.type === 'ListingFulfilled' && event.ref.merchant.toLowerCase() !== $root.$data.account.toLowerCase()">
                    You bought {{ (event.ref.amount / Math.pow(10, $root.$data.tokens[event.ref.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} {{ $root.$data.tokens[event.ref.asset].name }} for {{ (event.ref.value / Math.pow(10, 18))}}
                  </span>
                  <span v-else-if="event.type === 'ListingCancelled'">
                    You cancelled a listing of {{ (event.ref.amount / Math.pow(10, $root.$data.tokens[event.ref.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} {{ $root.$data.tokens[event.ref.asset].name }} for {{ (event.ref.value / Math.pow(10, 18))}}
                  </span>
                  <span v-else-if="event.type === 'ListingCreated'">
                    You created a listing of {{ (event.ref.amount / Math.pow(10, $root.$data.tokens[event.ref.asset].decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} {{ $root.$data.tokens[event.ref.asset].name }} for {{ (event.ref.value / Math.pow(10, 18))}}
                  </span>
                </td>
                <td v-else>
                  <i class="fal fa-spin fa-spinner-third"></i>
                </td>
                <td>
                  <button class="detail" v-on:click="$root.$data.selectedListing = event.ref; $root.$data.viewListing = true"><i class="far fa-eye"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global web3 */
import { apiAddress } from '@/config'
import { BigNumber } from 'bignumber.js'

import Header from '@/components/parts/Header'
import Sidebar from '@/components/parts/Sidebar'
import Chat from '@/components/parts/Chat'
import MyListings from '@/components/parts/MyListings'
import GetMetamask from '@/components/parts/GetMetamask'
import ActionRequired from '@/components/parts/ActionRequired'
import ViewListing from '@/components/parts/ViewListing'

import getJazzicon from '@/components/logic/global/methods/getJazzicon'

import txDialog from '@/components/parts/txDialog'
import txCancelledDialog from '@/components/parts/txCancelledDialog'

export default {
  name: 'History',
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
  mounted () {
    this.getHistory()
  },
  methods: {
    calculateCost: function () {
      if (this.assetAmount > 0 && this.assetCost > 0) {
        const assetCost = new BigNumber(this.assetCost).multipliedBy(this.assetAmount)
        this.calculatedAssetCost = assetCost.toString()
      }
    },
    getJazzicon,
    getHistory: function () {
      fetch(`${apiAddress}/market/history?address=${web3.toChecksumAddress(this.$root.$data.account)}`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          this.history = json.data
          let tokens = []
          this.history.map(event => {
            if (!tokens[event.ref.asset]) {
              tokens.push(event.ref.asset)
            }
          })
          tokens.map(token => {
            this.$root.getToken(token)
          })
        })
    }
  },
  data () {
    return {
      history: []
    }
  }
}
</script>
