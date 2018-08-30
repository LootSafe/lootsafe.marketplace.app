<template>
  <div>
    <div class="popupmask"></div>
    <div id="view_listing" class="action_required">
      <h1 style="text-align: center;">
        <i class="far fa-search" style="font-size: 45pt; color: #ffeaa7;"></i>
      </h1>
      <br>
      <h2 style="text-align: center">Search Tips</h2>
      <p>You can search using many keywords, for example: <br>
        <strong>asset:&lt;address&gt;</strong> - Search for assets by address <br>
        <strong>merchant:&lt;address&gt;</strong> - Search for assets by merchant <br>
        <strongs>Some Name</strongs> - Search for assets by name
      </p>
      <button v-on:click="$parent.searchTips = false">Okay</button>
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
