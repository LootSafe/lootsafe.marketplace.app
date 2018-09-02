import { pubnub } from '@/config'
import PubNub from 'pubnub'

export default {
  pubnub: new PubNub({
    publishKey: pubnub.publishKey,
    subscribeKey: pubnub.subscribeKey
  }),
  online: false,
  activeUsers: 0
}
