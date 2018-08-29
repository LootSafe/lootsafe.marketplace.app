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
      <p v-if="$parent.createTx"><i class="fa fa-spin fa-spinner"></i> Your transaction has been created {{ $parent.createTx }}, please wait for it to be mined...</p>
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
          <th align="right">Balance</th>
          <th align="center"></th>
        </thead>
        <tbody>
          <tr v-for="token in Object.values($root.$data.tokens).sort((a, b) => b.balance - a.balance)" v-bind:key="token" v-if="$root.$data.defaultTokens.indexOf(token.address) > -1">
            <td><div v-html="getJazzicon(token.address, 30).outerHTML"></div></td>
            <td><strong>{{ token.name }}</strong></td>
            <td><a :href="etherscan + 'token/' + token.address" target="_blank">{{ token.address }}</a></td>
            <td class="rightAlign">{{ (token.balance / Math.pow(10, token.decimals)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
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
import { defaultTokens, etherscan } from '../../config'
import ethereumAddress from 'ethereum-address'
import jazzicon from 'jazzicon'

export default {
  name: 'Vault',
  methods: {
    getJazzicon: (seed, size = 35) => {
      const addr = seed.slice(2, 10)
      return jazzicon(size, parseInt(addr, 16))
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
    addValToken () {
      let addAlreadyExists = false

      if (this.$refs.checkme.value in this.$root.$data.tokens) {
        addAlreadyExists = true
      }

      if (localStorage.getItem('custom_tokens') && this.$refs.checkme.value in JSON.parse(localStorage.getItem('custom_tokens'))) {
        addAlreadyExists = true
      }

      if (ethereumAddress.isAddress(this.$refs.checkme.value) && !addAlreadyExists) {
        this.closePopup()

        let toke

        if (localStorage.getItem('custom_tokens') == null) {
          toke = [this.$refs.checkme.value]
          localStorage.setItem('custom_tokens', JSON.stringify(toke))
        } else {
          toke = JSON.parse(localStorage.getItem('custom_tokens'))
          toke.push(this.$refs.checkme.value)
          localStorage.setItem('custom_tokens', JSON.stringify(toke))
        }

        defaultTokens.push(this.$refs.checkme.value)
      } else {
        this.invalidAddress = true

        setTimeout(function () {
          this.invalidAddress = false
        }.bind(this), 3500)
      }
    },
    openPopup () {
      this.showAddToken = true
    },
    closePopup () {
      this.showAddToken = false
    }
  },
  data () {
    return {
      defaultTokens: (localStorage.getItem('custom_tokens')) ? defaultTokens.concat(JSON.parse(localStorage.getItem('custom_tokens'))) : defaultTokens,
      tokens: {},
      withdrawDialog: false,
      etherscan,
      copyStrText: 'Copy Deposit Address',
      showAddToken: false,
      showValidationStatus: false,
      invalidAddress: false
    }
  }
}
</script>
