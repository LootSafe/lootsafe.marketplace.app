import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Vault from '@/components/Vault'
import CreateListing from '@/components/CreateListing'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LootSafe Marketplace - Home',
      component: Home
    },
    {
      path: '/vault',
      name: 'LootSafe Marketplace - Vault',
      component: Vault
    },
    {
      path: '/listing/create',
      name: 'LootSafe Marketplace - Create Listing',
      component: CreateListing
    }
  ]
})
