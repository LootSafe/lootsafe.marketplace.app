<template>
  <div>
    <div class="popupmask"></div>
    <div id="get_metamask">
      <h1>You're missing a wallet!</h1>
      <p>(or you're not logged in)</p>
      <img height="150" src="https://avatars1.githubusercontent.com/u/11744586?s=200&v=4" alt="">
      <p>Metamask is an awesome free wallet!</p>
      <button class="default" v-on:click="$parent.web3status = 'opt-out'; window.open('https://metamask.io/','_blank');">Get Metamask</button><button class="info" v-on:click="$parent.web3status = 'opt-out'">Maybe Later</button>
    </div>
  </div>

</template>

<script>
export default {
  name: 'GetMetamask',
  data () {
    return {}
  }
}
</script>
