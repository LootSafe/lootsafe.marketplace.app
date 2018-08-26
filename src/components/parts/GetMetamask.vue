<template>
  <div>
    <div class="popupmask"></div>
    <div id="get_metamask">
      <h1>You're missing a wallet!</h1>
      <p>(or you're not logged in)</p>
      <img height="150" src="https://avatars1.githubusercontent.com/u/11744586?s=200&v=4" alt="">
      <p>Metamask is an awesome free wallet!</p>
      <a href="https://metamask.io/" target="_blank">
        <button class="default" v-on:click="$root.cancelWeb3Poll(); document.window.open('https://metamask.io/','_blank');">Get Metamask</button>
      </a>
        <button class="info" v-on:click="$root.cancelWeb3Poll()">Maybe Later</button>
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
