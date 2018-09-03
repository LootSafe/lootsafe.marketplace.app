<template>
  <div>
    <v-tour name="myTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
    <txDialog v-if="$root.$data.showTxDialog"></txDialog>
    <txCancelledDialog v-if="$root.$data.showTxCancelledDialog"></txCancelledDialog>
    <ViewListing v-if="$root.$data.viewListing"></ViewListing>
    <ActionRequired v-if="$root.$data.actionRequired"></ActionRequired>
    <div :class="tourRunning ? 'tour-disable' : ''">
      <SearchHelp v-if="searchTips"></SearchHelp>
      <GetMetamask v-if="$root.$data.web3status === 'missing'" />
      <Header />
      <Sidebar />
      <Chat />
      <div id="main_content">
        <Listings />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/parts/Header'
import Sidebar from '@/components/parts/Sidebar'
import Chat from '@/components/parts/Chat'
import Listings from '@/components/parts/Listings'
import SearchHelp from '@/components/parts/SearchHelp'
import ActionRequired from '@/components/parts/ActionRequired'
import GetMetamask from '@/components/parts/GetMetamask'
import txDialog from '@/components/parts/txDialog'
import txCancelledDialog from '@/components/parts/txCancelledDialog'
import ViewListing from '@/components/parts/ViewListing'
import data from '@/components/logic/home/data'
import endTour from '@/components/logic/home/methods/endTour'
import restartTour from '@/components/logic/home/methods/restartTour'
import getJazzicon from '@/components/logic/global/methods/getJazzicon'

export default {
  name: 'HelloWorld',
  components: {
    SearchHelp,
    Header,
    Sidebar,
    Chat,
    Listings,
    GetMetamask,
    ViewListing,
    ActionRequired,
    txDialog,
    txCancelledDialog
  },
  mounted: function () {
    if (!localStorage.getItem('tour-opt-out') || localStorage.getItem('tour-opt-out') === 'false') {
      this.$tours['myTour'].start()
      this.tourRunning = true
    }
  },
  methods: {
    endTour,
    restartTour,
    getJazzicon
  },
  data () {
    return Object.assign({}, data, {
      tourCallbacks: {
        onStop: this.endTour
      }
    })
  }
}
</script>
