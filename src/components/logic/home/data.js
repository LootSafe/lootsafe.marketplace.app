import { defaultMarket } from '@/config'

export default {
  vault: '0x0000000000000000000000000000000000000000',
  account: '0x0000000000000000000000000000000000000000',
  web3poll: null,
  tourRunning: false,
  searchTips: false,
  pollInterval: 10,
  web3status: 'pending',
  msg: 'Welcome to Your Vue.js App',
  market: defaultMarket,
  steps: [
    {
      target: 'header',
      content: `<div><h3>Welcome to our Marketplace!</h3><br><img src="/static/img/trade.png" alt="" height="300" /><br>Would you like to take the tour?</div>`,
      params: {
        placement: 'bottom'
      }
    },
    {
      target: '.listings',
      content: `<div>These are listings! Listings are items people are selling on the market.</div>`,
      params: {
        placement: 'right'
      }
    },
    {
      target: '.listings .controls',
      content: `<div>You can either fulfill the listings, find more like it, or check out more from the merchant.</div>`,
      params: {
        placement: 'right'
      }
    },
    {
      target: '.main-search',
      content: `<div>Looking for something more? Here you can search the marketplace for more listings.</div>`,
      params: {
        placement: 'bottom'
      }
    },
    {
      target: '#market_selector',
      content: `<div>At any time you can switch to another marketplace</div>`,
      params: {
        placement: 'bottom'
      }
    },
    {
      target: '#listing_create',
      content: `<div>If you'd like to sell something, you can do so here!</div>`,
      params: {
        placement: 'right'
      }
    },
    {
      target: '#vault',
      content: `<div>One last thing! You need to setup your vault before you can do anything! Head over here as soon as you're ready to get started!</div>`,
      params: {
        placement: 'right'
      }
    },
    {
      target: '.help',
      content: `<div>You can take the tour again at any point by clicking the help icon.</div>`,
      params: {
        placement: 'left'
      }
    }
  ]
}
