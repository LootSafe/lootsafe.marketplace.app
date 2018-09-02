import { apiAddress } from '@/config'

export default function () {
  fetch(`${apiAddress}/market/list`)
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      this.markets = json.data
    })
}
