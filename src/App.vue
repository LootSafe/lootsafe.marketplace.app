<template>
  <div id="app">
    <link rel="stylesheet" href="/static/lootsafe.css">
    <link rel="stylesheet" href="/static/fontawesome/css/all.css">
    <router-view />
    <notifications group="info" position="bottom right" classes="vue-notification info" />
    <notifications group="success" position="bottom right" classes="vue-notification success" />
    <notifications group="error" position="bottom right" classes="vue-notification error" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
