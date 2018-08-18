<template>
  <div>
    <GetMetamask v-if="$root.$data.web3status === 'missing'" />
    <Header />
    <Sidebar />
    <Chat />
    <div id="main_content">
      <Listings />
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

import { defaultMarket } from '../config'

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
  data () {
    return {
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
