<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing">
      <h2>Search Tips</h2>
      <p>You can search using many keywords, for example: <br>
        <strong>asset:&lt;address&gt;</strong> - Search for assets by address <br>
        <strong>merchant:&lt;address&gt;</strong> - Search for assets by merchant <br>
        <strongs>Some Name</strongs> - Search for assets by name
      </p>
      <button style="width: 100%;" v-on:click="$parent.searchTips = false">Okay</button>
    </div>
  </div>

</template>

<script>
export default {
  name: 'SearchHelp',
  data () {
    return {}
  }
}
</script>
