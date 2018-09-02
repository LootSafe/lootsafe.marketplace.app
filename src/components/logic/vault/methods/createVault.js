/* global web3 */

export default function () {
  const marketAddress = this.market.address
  this.$root.$data.actionRequired = true
  web3.eth.sendTransaction({
    from: web3.eth.coinbase,
    to: marketAddress,
    value: 0,
    data: '0x0a'
  }, (err, resp) => {
    this.$root.$data.actionRequired = false
    if (err) console.warn('err creating vault', err)
    this.$root.$data.waitingForTx = true
    this.createTx = resp
    this.pollVault()
  })
}
