<template>
  <div>
    <GetMetamask v-if="web3status === 'missing'" />
    <Header />
    <Sidebar />
    <Chat />
    <div id="main_content">
      <Listings />
    </div>
  </div>
</template>

<script>
import Header from '@/components/parts/Header'
import Sidebar from '@/components/parts/Sidebar'
import Chat from '@/components/parts/Chat'
import Listings from '@/components/parts/Listings'
import GetMetamask from '@/components/parts/GetMetamask'

import marketABI from '../../contracts/erc20/build/contracts/Market.json'

import Eth from 'ethjs'

export default {
  name: 'HelloWorld',
  components: {
    Header,
    Sidebar,
    Chat,
    Listings,
    GetMetamask
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
    }
  },
  data () {
    return {
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
