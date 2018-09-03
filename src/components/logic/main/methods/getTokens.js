export default function () {
  this.syncing = true
  setTimeout(() => { this.syncing = false }, 500)
  this.defaultTokens.map(asset => {
    this.getToken(asset)
  })
}
