import { apiAddress } from '@//config'

export default function (keywords) {
  let payload = {
    market_address: this.$root.$data.market.address,
    status: 0,
    skip: this.skip
  }

  let parts = keywords.split(',')

  parts.map(part => {
    const trimmed = part.trim()
    if (trimmed.includes('asset:') && trimmed.split(':')[0] === 'asset' && ethereumAddress.isAddress(trimmed.split(':')[1])) {
      payload.asset = trimmed.split(':')[1]
    }
    if (trimmed.includes('merchant:') && trimmed.split(':')[0] === 'merchant' && ethereumAddress.isAddress(trimmed.split(':')[1])) {
      payload.merchant = trimmed.split(':')[1]
    }
  })

  if (!keywords || keywords.indexOf(':') > 1) {
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
        this.listings = json.data

        this.listings.map(listing => {
          if (!this.$root.$data.tokens[listing.asset]) {
            this.$root.getToken(listing.asset)
          }
        })

        this.fetching = false
      })
  } else {
    fetch(`${apiAddress}/market/listings?keyword=${keywords}`)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.listings = json.data

        this.listings.map(listing => {
          if (!this.$root.$data.tokens[listing.asset]) {
            this.$root.getToken(listing.asset)
          }
        })

        this.fetching = false
      })
  }
}
