/* global web3 */
import marketABI from '../../../../../contracts/erc20/build/contracts/Market.json'
export default function () {
  const marketAddress = this.market.address
  const marketplace = marketABI.abi
  const contract = web3.eth.contract(marketplace).at(marketAddress)

  contract.vaults.call(web3.eth.coinbase, (err, resp) => {
    if (err) console.warn('Error getting vault address', err)
    this.$root.$data.vault = resp
  })
}
