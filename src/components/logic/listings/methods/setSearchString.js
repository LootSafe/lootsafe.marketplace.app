export default function (type, str) {
  this.keyword = type === 'raw' ? str : type + ':' + str
  this.getListings(this.keyword)
  this.skip = 0
}
