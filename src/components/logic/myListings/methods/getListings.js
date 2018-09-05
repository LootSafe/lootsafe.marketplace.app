/* global web3 */
import { apiAddress } from '@/config'

export default function () {
  let payload = {
    market_address: this.$root.$data.market.address,
    merchant: web3.toChecksumAddress(web3.eth.coinbase)
  }
  // TODO: Make market address correlate to market dropdown
  fetch(`${apiAddress}/market/listings/filtered`,
    {
      method: 'post',
      'Content-Type': 'application/json',
      body: JSON.stringify(payload)
    })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      this.$root.$data.listings = json.data

      this.$root.$data.listings.map(listing => {
        if (!this.$root.$data.tokens[listing.asset]) {
          this.$root.getToken(listing.asset)
        }
      })

      this.fetching = false
    })
}
