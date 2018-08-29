<template>
  <div>
    <GetMetamask v-if="$root.$data.web3status === 'missing'" />
    <ActionRequired v-if="$root.$data.actionRequired"></ActionRequired>
    <Header />
    <Sidebar />
    <Chat />
    <div id="main_content">
      <Vault />
    </div>
  </div>
</template>

<script>
/* global web3 */
import Header from '@/components/parts/Header'
import Sidebar from '@/components/parts/Sidebar'
import Chat from '@/components/parts/Chat'
import Listings from '@/components/parts/Listings'
import GetMetamask from '@/components/parts/GetMetamask'
import Vault from '@/components/parts/Vault'
import ActionRequired from '@/components/parts/ActionRequired'

import { defaultMarket } from '../config'

import marketABI from '../../contracts/erc20/build/contracts/Market.json'

export default {
  name: 'HelloWorld',
  components: {
    Header,
    Sidebar,
    Chat,
    Listings,
    GetMetamask,
    Vault,
    ActionRequired
  },
  methods: {
    getVault: function () {
      const marketAddress = this.market.address
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)

      contract.vaults.call(web3.eth.coinbase, (err, resp) => {
        if (err) console.warn('Error getting vault address', err)
        this.$root.$data.vault = resp
      })
    },
    createVault: function () {
      const marketAddress = this.market.address
      this.$root.$data.actionRequired = true
      web3.eth.sendTransaction({
        from: web3.eth.coinbase,
        to: marketAddress,
        value: 0,
        data: '0x0a'
      }, (err, resp) => {
        this.$root.$data.actionRequired = false
        if (err) console.warn('err creating vault', err)
        this.createTx = resp
        this.pollVault()
      })
    },
    pollVault: function () {
      this.vaultCheck = setInterval(() => {
        this.getVault()
        if (this.$root.$data.vault !== '0x0000000000000000000000000000000000000000') {
          clearInterval(this.vaultCheck)
        }
      }, 5000)
    }
  },
  data () {
    return {
      vaultCheck: false,
      createTx: false,
      vault: '0x0000000000000000000000000000000000000000',
      account: '0x0000000000000000000000000000000000000000',
      web3poll: null,
      pollInterval: 10,
      web3status: 'pending',
      msg: 'Welcome to Your Vue.js App',
      market: defaultMarket
    }
  }
}
</script>
