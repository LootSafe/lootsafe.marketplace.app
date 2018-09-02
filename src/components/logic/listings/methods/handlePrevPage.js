export default function () {
  if (this.skip > 0) {
    this.skip -= 15
    this.getListings(this.keyword)
  }
}
