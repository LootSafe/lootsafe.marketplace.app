import {defaultMarket, defaultTokens, pubnub} from '@/config'
import PubNub from 'pubnub'

export default {
  vault: '0x0000000000000000000000000000000000000000',
  account: '0x0000000000000000000000000000000000000000',
  web3poll: null,
  actionRequired: false,
  viewListing: false,
  waitingForTx: false,
  messages: [],
  activeUsers: 0,
  online: false,
  listings: [],
  selectedListing: false,
  showTxDialog: false,
  showTxCancelledDialog: false,
  syncing: false,
  tokens: {},
  pollInterval: 10,
  web3status: 'pending',
  withdrawAsset: false,
  market: defaultMarket,
  defaultTokens: (localStorage.getItem('custom_tokens')) ? defaultTokens.concat(JSON.parse(localStorage.getItem('custom_tokens'))) : defaultTokens,
  pubnub: new PubNub({
    publishKey: pubnub.publishKey,
    subscribeKey: pubnub.subscribeKey
  })
}
