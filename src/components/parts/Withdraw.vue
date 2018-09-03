<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing" class="action_required">
      <h1 style="text-align: center;">
        <i class="fal fa-external-link-square" style="font-size: 45pt; color: #ffeaa7;"></i>
      </h1>
      <br>
      <h2 style="text-align: center;">Withdraw {{ $root.$data.withdrawAsset.name }}</h2>
      <p>How much would you like to withdraw?<br/> (Assets will be sent to your merchant account)</p>
      <br>
      <input type="number" placeholder="Amount to withdraw..." ref="amount" class="full_input" v-model="withdrawAmount">
      <br>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      <br>
      <button class="default" v-on:click="checkWithdraw()" v-if="!success">
        Withdraw
      </button>
      <button v-else class="default" v-on:click="$root.$data.withdrawAsset = false">
        Okay
      </button>
    </div>
  </div>

</template>

<script>
/* global web3 */

import BigNumber from 'bignumber.js'
import vaultABI from '../../../contracts/erc20/build/contracts/Vault'

import Eth from 'ethjs'
import {provider} from '@/config'

const eth = new Eth(new Eth.HttpProvider(provider)) // eslint-disable-line no-unused-vars

export default {
  name: 'ActionRequired',
  methods: {
    checkWithdraw: function () {
      const amount = new BigNumber(this.withdrawAmount).multipliedBy(new BigNumber(10).pow(this.$root.$data.tokens[this.$root.$data.withdrawAsset.address].decimals))
      console.log('amount', amount.toString())
      console.log('amount', this.$root.$data.tokens[this.$root.$data.withdrawAsset.address].balance.sub(this.$root.$data.tokens[this.$root.$data.withdrawAsset.address].locked).toString())
      if (amount.gt(this.$root.$data.tokens[this.$root.$data.withdrawAsset.address].balance.sub(this.$root.$data.tokens[this.$root.$data.withdrawAsset.address].locked))) {
        this.error = `You do not ${this.withdrawAmount} ${this.$root.$data.withdrawAsset.name}. Please select a lower amount.`
      } else {
        this.error = false
        const vaultContract = web3.eth.contract(vaultABI.abi).at(this.$root.$data.vault)
        vaultContract.withdrawal(this.$root.$data.withdrawAsset.address, amount.toString(), { from: web3.eth.coinbase }, (err, tx) => {
          this.$root.getToken(this.$root.$data.withdrawAsset.address)
          this.success = 'Your withdraw has started, your balances should update as soon as the transaction is confirmed.'
        })
      }
    }
  },
  data () {
    return {
      error: false,
      success: false,
      withdrawAmount: false
    }
  }
}
</script>
