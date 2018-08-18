<template>
  <div id="vault">
    <h1><i class="fal fa-wallet"></i> Vault</h1>
    <p>Your vault holds everything you want to trade in the marketplace, to start trading create a vault and deposit assets you wish to trade.</p>
    <hr>
    <div v-if="$parent.vault !== '0x0000000000000000000000000000000000000000'">
      <h3>Your Vault</h3>
      <p>Your Vault address is where you deposit your tokens that you want to trade.</p>
      <input id="vault_address" class="full_input" type="text" readonly="true" :value="$parent.vault" ref="clipboard"/>
      <button class="default" v-on:click="copyDepositAddr($event)" style="width: 12.5rem;"> {{copyStrText}}</button>
    </div>
    <div v-else>
      <p>You don't have a vault yet!</p>
      <button class="default" v-on:click="$parent.createVault()"><i class="far fa-plus"></i> Create Vault</button>
      <p v-if="$parent.createTx"><i class="fa fa-spin fa-spinner"></i> Your transaction has been created {{ $parent.createTx }}, please wait for it to be mined...</p>
    </div>
    <hr>
    <h3 v-if="$parent.vault !== '0x0000000000000000000000000000000000000000'">Balances</h3>
    <table v-if="$parent.vault !== '0x0000000000000000000000000000000000000000'" id="balances" style="margin-top: 1rem;">
      <thead>
        <th>Name</th>
        <th>Address</th>
        <th>Balance</th>
      </thead>
      <tbody>
        <tr v-for="token in Object.keys(tokens)" v-bind:key="token">
          <td>{{ tokens[token].name }}</td>
          <td>{{ token }}</td>
          <td>{{ (tokens[token].balance / Math.pow(10, tokens[token].decimals)).toFixed(2) }}</td>
        </tr>
        <tr>
          <td>
            <button v-if="$parent.vault !== '0x0000000000000000000000000000000000000000'" class="default" v-on:click="openPopup($event)"> Add Token</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showAddToken !== false">
      <div class="popupmask"></div>
      <div id="get_metamask">
        <h1>Add Token & Validate</h1>
        <input id="validate_address" class="full_input" type="text" placeholder="0x0000000000000000000000000000000000000000" ref="checkme"/>
        <button class="default" v-on:click="addValToken($event)"> Validate Address</button>
        <button class="default" v-on:click="closePopup($event)"> Close</button>
        <p v-if="invalidAddress !== false" style="color:red"> Invalid Address</p>
      </div>
    </div>
  </div>
</template>

<script>
import ERC20ABI from '../../../contracts/erc20/build/contracts/EIP20.json'
import { provider, defaultTokens } from '../../config'
import ethereumAddress from 'ethereum-address'

import Eth from 'ethjs'

const eth = new Eth(new Eth.HttpProvider(provider)) // eslint-disable-line no-unused-vars

export default {
  name: 'Vault',
  methods: {
    getTokenBalances: function () {
      this.defaultTokens.map(token => {
        const tokenContract = eth.contract(ERC20ABI.abi).at(token)

        tokenContract.name().then(name => {
          tokenContract.decimals().then(decimals => {
            const owner = this.$parent.vault
            tokenContract.balances(owner).then(balance => {
              this.tokens = Object.assign({}, this.tokens, {
                [token]: {
                  name: name[0],
                  balance: balance[0].toString(),
                  decimals: decimals[0]
                }
              })
            })
          })
        })
      })
    },
    copyDepositAddr (event) {
      const buttonDefStr = 'Copy Deposit Address'
      const copiedStr = 'Copied!'

      this.$refs.clipboard.select()
      document.execCommand('copy')

      this.copyStrText = copiedStr

      setTimeout(function () {
        this.copyStrText = buttonDefStr
      }.bind(this), 5000)
    },
    addValToken (event) {
      var addAlreadyExists = false

      if (this.$refs.checkme.value in this.tokens) {
        addAlreadyExists = true
      }

      if (this.$refs.checkme.value in JSON.parse(localStorage.getItem('custom_tokens'))) {
        addAlreadyExists = true
      }

      if (ethereumAddress.isAddress(this.$refs.checkme.value) && !addAlreadyExists) {
        this.closePopup()

        var toke

        if (localStorage.getItem('custom_tokens') == null) {
          toke = [this.$refs.checkme.value]
          localStorage.setItem('custom_tokens', JSON.stringify(toke))
        } else {
          toke = JSON.parse(localStorage.getItem('custom_tokens'))
          toke.push(this.$refs.checkme.value)
          localStorage.setItem('custom_tokens', JSON.stringify(toke))
        }

        defaultTokens.push(this.$refs.checkme.value)
        this.getTokenBalances()
      } else {
        this.invalidAddress = true

        setTimeout(function () {
          this.invalidAddress = false
        }.bind(this), 3500)
      }
    },
    openPopup (event) {
      this.showAddToken = true
    },
    closePopup (event) {
      this.showAddToken = false
    }
  },
  created () {
    if (localStorage.getItem('custom_tokens') != null) {
      var lockens = JSON.parse(localStorage.getItem('custom_tokens'))
      for (var i = 0; i < lockens.length; i++) {
        defaultTokens.push(lockens[i])
      }
    }
    this.getTokenBalances()
  },
  data () {
    return {
      defaultTokens,
      tokens: {},
      copyStrText: 'Copy Deposit Address',
      showAddToken: false,
      showValidationStatus: false,
      invalidAddress: false
    }
  }
}
</script>
