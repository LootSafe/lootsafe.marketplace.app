<template>
  <div>
    <Mining v-if="$root.$data.waitingForTx"></Mining>
    <GetMetamask v-if="$root.$data.web3status === 'missing'" />
    <ActionRequired v-if="$root.$data.actionRequired"></ActionRequired>
    <Withdraw v-if="$root.$data.withdrawAsset"></Withdraw>
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
import Withdraw from '@/components/parts/Withdraw'
import Chat from '@/components/parts/Chat'
import Listings from '@/components/parts/Listings'
import GetMetamask from '@/components/parts/GetMetamask'
import Vault from '@/components/parts/Vault'
import ActionRequired from '@/components/parts/ActionRequired'
import Mining from '@/components/parts/Mining'

import pollVault from '@/components/logic/vault/methods/pollVault'
import createVault from '@/components/logic/vault/methods/createVault'
import getVault from '@/components/logic/vault/methods/getVault'

import { defaultMarket } from '../config'

export default {
  name: 'HelloWorld',
  components: {
    Header,
    Sidebar,
    Chat,
    Mining,
    Listings,
    GetMetamask,
    Vault,
    ActionRequired,
    Withdraw
  },
  methods: {
    getVault,
    createVault,
    pollVault
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
