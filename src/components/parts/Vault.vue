<template>
  <div id="vault">
    <h1><i class="fal fa-piggy-bank"></i> Vault</h1>
    <p>Your vault holds everything you want to trade in the marketplace, to start trading create a vault and deposit assets you wish to trade.</p>
    <hr>
    <div v-if="$root.$data.vault !== '0x0000000000000000000000000000000000000000'">
      <h3>Your Vault</h3>
      <p>Your Vault address is where you deposit your tokens that you want to trade.</p>
      <input id="vault_address" class="full_input" type="text" readonly="true" :value="$root.$data.vault" ref="clipboard"/>
      <button class="default" v-on:click="copyDepositAddr($event)" style="width: 12.5rem;"> {{copyStrText}}</button>
    </div>
    <div v-else>
      <p>You don't have a vault yet!</p>
      <button class="default" v-on:click="$parent.createVault()"><i class="far fa-plus"></i> Create Vault</button>
    </div>
    <hr>
    <h3 v-if="$root.$data.vault !== '0x0000000000000000000000000000000000000000'">Balances
      <button v-if="$root.$data.vault !== '0x0000000000000000000000000000000000000000'" class="default small" v-on:click="openPopup($event)">
        <i class="far fa-plus"></i> Track New Token
      </button>
      <button class="default small" v-on:click="$root.getTokens()">
        <i :class="$root.$data.syncing ? 'fal fa-spin fa-sync' : 'fal fa-sync'"></i>
      </button>
    </h3>
    <div class="token-balances">
      <table class="listings" v-if="$root.$data.vault !== '0x0000000000000000000000000000000000000000'"  style="margin-top: 1rem;">
        <thead>
          <th align="left">Icon</th>
          <th align="left">Name</th>
          <th align="left">Address</th>
          <th align="right">Available</th>
          <th align="right">Locked</th>
          <th align="center"></th>
        </thead>
        <tbody>
          <tr v-for="token in Object.values($root.$data.tokens).sort((a, b) => b.balance - a.balance)" v-bind:key="token.address" v-if="$root.$data.defaultTokens.indexOf(token.address) > -1">
            <td><div v-html="getJazzicon(token.address, 30).outerHTML"></div></td>
            <td><strong>{{ token.name }}</strong></td>
            <td><a :href="etherscan + 'token/' + token.address" target="_blank">{{ token.address }}</a></td>
            <td class="rightAlign">
              {{ (token.balance.sub(token.locked) / Math.pow(10, token.decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
            </td>
            <td class="rightAlign">
              <i class="far fa-lock-alt" style="cursor: help;" title="Locked assets are not available for withdraw, locked assets are assets currently held in listings."></i> {{ (token.locked / Math.pow(10, token.decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
            </td>
            <td class="rightAlign">
              <button class="default small" v-on:click="withdrawDialog = token">
                <i class="far fa-angle-double-right"></i> Withdraw
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showAddToken !== false">
      <div class="popupmask"></div>
      <div id="get_metamask">
        <h2>Track New Token</h2>
        <br />
        <input id="validate_address" class="full_input" type="text" placeholder="0x0000000000000000000000000000000000000000" ref="checkme"/>
        <br />
        <br>
        <button class="half" v-on:click="addValToken($event)"> Add</button>
        <button class="info half" v-on:click="closePopup($event)"> Cancel</button>
        <p v-if="invalidAddress !== false" style="color:red"> Invalid Address</p>
      </div>
    </div>
  </div>
</template>

<script>
import copyDepositAddr from '@/components/logic/vault/methods/copyDepositAddr'
import addValToken from '@/components/logic/vault/methods/addValToken'
import getJazzicon from '@/components/logic/global/methods/getJazzicon'
import data from '@/components/logic/vault/data'

export default {
  name: 'Vault',
  methods: {
    getJazzicon,
    copyDepositAddr,
    addValToken,
    openPopup () {
      this.showAddToken = true
    },
    closePopup () {
      this.showAddToken = false
    }
  },
  data () {
    return data
  }
}
</script>
