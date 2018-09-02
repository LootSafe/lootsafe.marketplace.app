export default function () {
  const buttonDefStr = 'Copy Deposit Address'
  const copiedStr = 'Copied!'

  this.$refs.clipboard.select()
  document.execCommand('copy')

  this.copyStrText = copiedStr

  setTimeout(function () {
    this.copyStrText = buttonDefStr
  }.bind(this), 5000)
}
