import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Vault from '@/components/Vault'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LootSafe Marketplace',
      component: Home
    },
    {
      path: '/vault',
      name: 'LootSafe Marketplace',
      component: Vault
    }
  ]
})
