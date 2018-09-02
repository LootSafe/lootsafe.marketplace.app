import { defaultTokens } from '@/config'
import ethereumAddress from 'ethereum-address'

export default function () {
  let addAlreadyExists = false

  if (this.$refs.checkme.value in this.$root.$data.tokens) {
    addAlreadyExists = true
  }

  if (localStorage.getItem('custom_tokens') && this.$refs.checkme.value in JSON.parse(localStorage.getItem('custom_tokens'))) {
    addAlreadyExists = true
  }

  if (ethereumAddress.isAddress(this.$refs.checkme.value) && !addAlreadyExists) {
    this.closePopup()

    let toke

    if (localStorage.getItem('custom_tokens') == null) {
      toke = [this.$refs.checkme.value]
      localStorage.setItem('custom_tokens', JSON.stringify(toke))
    } else {
      toke = JSON.parse(localStorage.getItem('custom_tokens'))
      toke.push(this.$refs.checkme.value)
      localStorage.setItem('custom_tokens', JSON.stringify(toke))
    }

    defaultTokens.push(this.$refs.checkme.value)
  } else {
    this.invalidAddress = true

    setTimeout(function () {
      this.invalidAddress = false
    }.bind(this), 3500)
  }
}
