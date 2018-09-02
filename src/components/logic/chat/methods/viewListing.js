import { provider } from '@/config'
import Eth from 'ethjs'
import marketABI from '../../../../../contracts/erc20/build/contracts/Market.json'
const eth = new Eth(new Eth.HttpProvider(provider))
export default function (id) {
  if (id) {
    const marketAddress = this.$root.$data.market.address
    const marketplace = marketABI.abi
    const contract = eth.contract(marketplace).at(marketAddress)

    contract.listings(id).then(resp => {
      if (resp[2] !== '0x') {
        const listing = {
          'id': resp[0],
          'date': resp[1],
          'merchant': resp[2],
          'asset': resp[3],
          'amount': resp[4],
          'value': resp[5],
          'status': resp[6]
        }
        this.$root.getToken(listing.asset)
        this.$root.$data.selectedListing = listing
        this.$root.$data.viewListing = true
      }
    })
  }
}
