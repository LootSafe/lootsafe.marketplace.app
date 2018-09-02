import { defaultTokens } from '@/config'
export default {
  error: false,
  getTokensInterval: null,
  syncing: false,
  selectedAsset: '',
  viewListing: false,
  selectedListing: {},
  calculatedAssetCost: 0,
  assetCost: null,
  assetAmount: null,
  tokens: false,
  defaultTokens: (localStorage.getItem('custom_tokens')) ? defaultTokens.concat(JSON.parse(localStorage.getItem('custom_tokens'))) : defaultTokens
}
