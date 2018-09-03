import {abi} from '../../../../../contracts/erc20/build/contracts/EIP20'
import vaultABI from '../../../../../contracts/erc20/build/contracts/Vault'

import Eth from 'ethjs'
import {provider} from '@/config'

const eth = new Eth(new Eth.HttpProvider(provider)) // eslint-disable-line no-unused-vars

export default function (asset) {
  const token = eth.contract(abi).at(asset)
  const vaultContract = eth.contract(vaultABI.abi).at(this.vault)
  token.name().then(name => {
    token.decimals().then(decimals => {
      const owner = this.$root.$data.vault
      token.balances(owner).then(balance => {
        vaultContract.locked_assets(asset).then(lockedAssets => {
          this.tokens = Object.assign({}, this.tokens, {
            [asset]: {
              name: name[0],
              decimals: decimals[0],
              balance: balance[0],
              address: asset,
              locked: lockedAssets[0]
            }
          })
        })
      })
    })
  })
}
