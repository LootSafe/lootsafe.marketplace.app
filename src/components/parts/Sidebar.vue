<template>
  <div id="side_menu">
    <ul>
      <li v-on:click="setActiveLink('/')" id="v-step-0" title="Home">
        <i :class="$parent.$parent.activeLink === '/' ? 'fal fa-home active' : 'fal fa-home'"></i>
      </li>
      <li v-if="$root.$data.web3status === 'connected'" v-on:click="setActiveLink('/vault')" id="vault" title="Vault">
        <i :class="$parent.$parent.activeLink === '/vault' ? 'fal fa-piggy-bank active' : $root.$data.vault === '0x0000000000000000000000000000000000000000' ? 'fal fa-piggy-bank pulse' : 'fal fa-piggy-bank'"></i>
      </li>
      <li v-if="$root.$data.web3status === 'connected'" v-on:click="setActiveLink('/listing/create')" id="listing_create" title="Create / Manage Listings">
        <i :class="$parent.$parent.activeLink === '/listing/create' ? 'fal fa-plus-square active' : 'fal fa-plus-square'"></i>
      </li>
      <li v-if="$root.$data.web3status === 'connected'" v-on:click="setActiveLink('/history')" id="history" title="History">
        <i :class="$parent.$parent.activeLink === '/history' ? 'fal fa-history active' : 'fal fa-history'"></i>
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
