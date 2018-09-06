export default function (message) {
  this.$refs.chat_input.value = ''
  const publishConfig = {
    channel: 'trade_chat',
    message: {
      account: this.$root.$data.account,
      content: message,
      timestamp: Date.now()
    }
  }
  this.pubnub.publish(publishConfig, function (status, response) {
    console.log(status, response)
  })
}
