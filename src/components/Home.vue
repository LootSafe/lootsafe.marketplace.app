<template>
  <div>
    <SearchHelp v-if="searchTips"></SearchHelp>
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
import SearchHelp from '@/components/parts/SearchHelp'
import GetMetamask from '@/components/parts/GetMetamask'

import { defaultMarket } from '../config'

import marketABI from '../../contracts/erc20/build/contracts/Market.json'

import Eth from 'ethjs'

export default {
  name: 'HelloWorld',
  components: {
    SearchHelp,
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
      searchTips: false,
      pollInterval: 10,
      web3status: 'pending',
      msg: 'Welcome to Your Vue.js App',
      market: defaultMarket
    }
  }
}
</script>

