<template>
  <div id="side_menu">
    <ul>
      <li v-on:click="setActiveLink('/')">
        <i :class="$parent.$parent.activeLink === '/' ? 'fal fa-home active' : 'fal fa-home'"></i>
      </li>
      <li v-if="$root.$data.web3status === 'connected'" v-on:click="setActiveLink('/vault')">
        <i :class="$parent.$parent.activeLink === '/vault' ? 'fal fa-wallet active' : $root.$data.vault === '0x0000000000000000000000000000000000000000' ? 'fal fa-wallet pulse' : 'fal fa-wallet'"></i>
      </li>
      <li v-if="$root.$data.web3status === 'connected'" v-on:click="setActiveLink('/listing/create')">
        <i :class="$parent.$parent.activeLink === '/listing/create' ? 'fal fa-ticket active' : 'fal fa-ticket'"></i>
      </li>
      <li class="soon">
        <i class="fal fa-stopwatch"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  methods: {
    setActiveLink: function (route) {
      this.$parent.$parent.activeLink = route
      this.$router.push(route)
    }
  },
  data () {
    return {
      flashVault: false,
      activeLink: '/'
    }
  }
}
</script>
