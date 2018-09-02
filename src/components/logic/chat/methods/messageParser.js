import emojione from 'emojione'
export default function (message) {
  let msg = message
  msg = emojione.shortnameToImage(msg)
  const linkResponse = this.linkBuilder(msg)
  return { msg: linkResponse.message, listing: linkResponse.listing }
}
