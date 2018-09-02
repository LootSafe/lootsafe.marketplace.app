export default function () {
  this.vaultCheck = setInterval(() => {
    this.getVault()
    if (this.$root.$data.vault !== '0x0000000000000000000000000000000000000000') {
      this.$root.$data.waitingForTx = false
      clearInterval(this.vaultCheck)
    }
  }, 5000)
}
