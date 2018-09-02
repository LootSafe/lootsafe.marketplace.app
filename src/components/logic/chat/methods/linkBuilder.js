export default function (message) {
  const startIndex = message.indexOf('[')
  const content = message.match(/\[(.*)\]/)
  const originalMessage = message.replace(/ *\[[^\]]*]/, '')

  if (content) {
    const messageObject = {
      type: null,
      data: null,
      originalMessage: message,
      message: originalMessage,
      startIndex
    }
    if (content != null) {
      var data = content.pop().split(':')
      if (data != null) {
        if (data.length === 2) {
          messageObject['type'] = data[0]
          messageObject['data'] = data[1]
          messageObject['message'] = originalMessage
          messageObject['startIndex'] = startIndex
        }
      }
    }
    const cleanMessage = messageObject.message
    const replacemntPayload = this.listingLinkBuilder(messageObject.data)
    return {
      message: cleanMessage.substr(0, startIndex) + replacemntPayload + cleanMessage.substr(startIndex),
      listing: messageObject.data
    }
  } else {
    return { message, listing: false }
  }
}
