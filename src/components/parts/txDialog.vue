<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing">
      <h2>Tx Created</h2>
      <p>Your transaction has been created, once mined your funds will be sent to the address you used to create your vault!</p>
      <p>The item you purchased may still display on the market until the transaction is mined successfully.</p>
      <p style="color: #ffeaa7">NOTICE: When you purchase items, or sell items, token are sent straight to your wallet to save you fees.</p>
      <p>Tx: <a :href="etherscan + 'tx/' + $parent.showTxDialog" target="_blank" class="smallLink">{{ $parent.showTxDialog }}</a></p>
      <button style="width: 100%;" v-on:click="$parent.showTxDialog = false">Okay</button>
    </div>
  </div>

</template>

<script>
import { etherscan } from '../../config'
export default {
  name: 'txDialog',
  data () {
    return {
      etherscan
    }
  }
}
</script>
