export default function () {
  if (this.$root.$data.listings.length === 15) {
    this.skip += 15
    this.getListings(this.keyword)
  }
}
