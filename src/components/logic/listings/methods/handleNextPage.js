export default function () {
  if (this.listings.length === 15) {
    this.skip += 15
    this.getListings(this.keyword)
  }
}
