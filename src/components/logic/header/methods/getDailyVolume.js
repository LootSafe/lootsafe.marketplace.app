import { apiAddress } from '@/config'

export default function () {
  fetch(`${apiAddress}/market/volume`)
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      this.dailyVolume = json.data
    })
}
