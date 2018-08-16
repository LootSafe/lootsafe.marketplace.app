<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing">
      <h2>Tx Created</h2>
      <p>Your transaction has been created, once mined your funds will be sent to the address you used to create your vault!</p>
      <p>The item you purchased may still display on the market until the transaction is mined successfully.</p>
      <button style="width: 100%;" v-on:click="$parent.showTxDialog = false">Okay</button>
    </div>
  </div>

</template>

<script>
export default {
  name: 'txDialog',
  data () {
    return {}
  }
}
</script>
