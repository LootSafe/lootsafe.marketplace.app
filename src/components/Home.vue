<template>
  <div>
    <Header />
    <Sidebar />
    <Chat />
    <div id="main_content">
      <Listings />
    </div>
  </div>
</template>

<script>
import Header from '@/components/parts/Header'
import Sidebar from '@/components/parts/Sidebar'
import Chat from '@/components/parts/Chat'
import Listings from '@/components/parts/Listings'

export default {
  name: 'HelloWorld',
  components: {
    Header,
    Sidebar,
    Chat,
    Listings
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
