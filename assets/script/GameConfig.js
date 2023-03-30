const n = module.exports = {}
const t = module

window.gameVersion = '201901010000'

const i = n.GameConfig = {
  gameVersion: window.gameVersion,
  isOpen: 1,
  adId: 1111,
  PLATFORM: '',
  SHARE_IMAGE_URL: '',
  SHARE_STR: '！',
  clientSecret: '',
  videoID: '',
  bannerID: '',
  gameId: 61,
  userId: 0,
  channelId: 0,
  channelSub: 0,
  boxId: 0,
  boxGid: 0,
  boxUid: 0,
  stDifference: null,
  GAME_DATA: 400,
  serverTimeStamp: function () {
    const e = Date.parse(new Date()).toString().substr(0, 10)
    return parseInt(e) + parseInt(this.stDifference)
  },
  clientTimeStamp: function () {
    return Date.parse(new Date()).toString().substr(0, 10)
  }
}

typeof gmbox !== 'undefined' ? i.PLATFORM = 'viso' : cc.sys.platform === cc.sys.WECHAT_GAME ? i.PLATFORM = 'wx' : i.PLATFORM = ''
t.exports = i
