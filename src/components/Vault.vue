<template>
  <div>
    <GetMetamask v-if="web3status === 'missing'" />
    <Header />
    <Sidebar />
    <Chat />
    <div id="main_content">
      <Vault />
    </div>
  </div>
</template>

<script>
import Header from '@/components/parts/Header'
import Sidebar from '@/components/parts/Sidebar'
import Chat from '@/components/parts/Chat'
import Listings from '@/components/parts/Listings'
import GetMetamask from '@/components/parts/GetMetamask'
import Vault from '@/components/parts/Vault'
import { provider } from '../config'

import Eth from 'ethjs'
import marketABI from '../../contracts/erc20/build/contracts/Market.json'

const eth = new Eth(new Eth.HttpProvider(provider))

export default {
  name: 'HelloWorld',
  components: {
    Header,
    Sidebar,
    Chat,
    Listings,
    GetMetamask,
    Vault
  },
  created () {
    this.checkWeb3()
    this.getVault()
  },
  methods: {
    checkWeb3: function () {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        this.web3status = 'connected'
        this.injectedw3 = new Eth(web3.currentProvider)
      } else {
        this.web3status = 'missing'
      }
    },
    getVault: function () {
      const marketAddress = this.market.address
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)

      contract.vaults.call(web3.eth.coinbase, (err, resp) => {
        if (err) console.warn('Error getting vault address', err)
        this.vault = resp
      })
    },
    createVault: function () {
      const marketAddress = this.market.address
      const marketplace = marketABI.abi

      web3.eth.sendTransaction({
        from: web3.eth.coinbase,
        to: marketAddress,
        value: 0,
        data: '0x0a'
      }, (err, resp) => {
        this.createTx = resp
        this.pollVault()
      })
    },
    pollVault: function () {
      this.vaultCheck = setInterval(() => {
        this.getVault()
        if (this.vault !== '0x0000000000000000000000000000000000000000') {
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
      web3status: 'pending',
      msg: 'Welcome to Your Vue.js App',
      injectedw3: null,
      market: {
        '_id': '5b654c17910a780b70365fd5',
        'name': 'LootSafe',
        'address': '0x7A5aC300d71fe143b31e8f05D8816155570a7a74',
        'token_type': 'ERC20'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
