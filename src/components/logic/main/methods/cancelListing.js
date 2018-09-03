/* global web3 */
import marketABI from '../../../../../contracts/erc20/build/contracts/Market.json'

export default function (listing) {
  const marketAddress = this.$root.$data.market.address
  const listingId = listing.id
  const marketplace = marketABI.abi
  const contract = web3.eth.contract(marketplace).at(marketAddress)
  this.actionRequired = true
  contract.cancel_listing(listingId, { from: web3.eth.coinbase }, (err, tx) => {
    this.actionRequired = false
    if (err) {
      this.showTxCancelledDialog = true
    } else {
      this.showTxDialog = tx
    }
  })
}
