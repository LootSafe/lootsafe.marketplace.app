<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing">
      <h2>Tx Cancelled</h2>
      <p>Your transaction has been cancelled.</p>
      <button style="width: 100%;" v-on:click="$parent.showTxCancelledDialog = false">Okay</button>
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
