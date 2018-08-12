<template>
  <div id="vault">
    <h1>Vault</h1>
    <p>Your vault holds everything you want to trade in the marketplace, to start trading create a vault and deposit assets you wish to trade.</p>
    <hr>
    <div v-if="$parent.vault !== '0x0000000000000000000000000000000000000000'">
      <label for="vault_address">Your Vault</label>
      <input id="vault_address" class="full_input" type="text" :value="$parent.vault"/>
    </div>
    <div v-else>
      <p>You don't have a vault yet!</p>
      <button class="default" v-on:click="$parent.createVault()"><i class="far fa-plus"></i> Create Vault</button>
      <p v-if="$parent.createTx"><i class="fa fa-spin fa-spinner"></i> Your transaction has been created {{ $parent.createTx }}, please wait for it to be mined...</p>
    </div>
    <hr>

  </div>
</template>

<script>
export default {
  name: 'Vault',
  data () {
    return {
    }
  }
}
</script>
