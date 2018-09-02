/* global web3 */

import BigNumber from 'bignumber.js'
import marketABI from '../../../../../contracts/erc20/build/contracts/Market.json'

export default function () {
  if (this.selectedAsset && this.assetCost > 0 && this.assetAmount > 0) {
    const assetCost = new BigNumber(this.assetCost).multipliedBy(this.assetAmount).multipliedBy(new BigNumber(10).pow(18))
    const assetAmount = new BigNumber(this.assetAmount).multipliedBy(new BigNumber(10).pow(this.$root.$data.tokens[this.selectedAsset].decimals))

    if (assetAmount.gt(this.$root.$data.tokens[this.selectedAsset].balance.sub(this.$root.$data.tokens[this.selectedAsset].locked))) {
      this.error = 'You don\'t have ' + this.assetAmount + ' ' + this.$root.$data.tokens[this.selectedAsset].name + ' to sell!'
    } else {
      const marketAddress = this.$root.$data.market.address
      const marketplace = marketABI.abi
      const contract = web3.eth.contract(marketplace).at(marketAddress)
      this.$root.$data.actionRequired = true
      contract.create_listing(this.selectedAsset, assetAmount.toString(), assetCost.toString(), { from: web3.eth.coinbase }, (err, tx) => {
        this.$root.$data.actionRequired = false
        if (err) {
          this.$root.$data.showTxCancelledDialog = true
        } else {
          this.selectedAsset = ''
          this.assetCost = null
          this.assetAmount = null
          this.$root.$data.showTxDialog = tx
        }
      })
      this.error = false
    }
  } else {
    this.error = 'Missing required information to create listing!'
  }
}
