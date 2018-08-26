<template>
  <div id="search">
    <p>Search the Market</p>
    <input class="main-search" type="text" placeholder="My Next Item..." :value="keyword" ref="searchInput" v-on:keyup.enter="$parent.setSearchString('raw', $refs.searchInput.value)"/>
    <button class="default" v-on:click="$parent.setSearchString('raw', $refs.searchInput.value)">Search</button>
    <button class="info" v-on:click="$parent.$parent.searchTips = true">
      <i class="far fa-question-circle"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: ['keyword'],
  data () {
    return {
    }
  },
  methods: {
    updateSearch: function (keyword) {
      this.keyword = keyword
    }
  }
}
</script>
