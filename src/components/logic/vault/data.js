import { defaultTokens, etherscan } from '@/config'
export default {
  defaultTokens: (localStorage.getItem('custom_tokens')) ? defaultTokens.concat(JSON.parse(localStorage.getItem('custom_tokens'))) : defaultTokens,
  tokens: {},
  withdrawDialog: false,
  etherscan,
  copyStrText: 'Copy Deposit Address',
  showAddToken: false,
  showValidationStatus: false,
  invalidAddress: false
}
