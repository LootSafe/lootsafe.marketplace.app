import jazzicon from 'jazzicon'

export default function () {
  const addr = this.$root.$data.account.slice(2, 10)
  const seed = parseInt(addr, 16)
  return jazzicon(25, seed)
}
