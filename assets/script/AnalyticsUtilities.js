const n = module.exports = {}

Object.defineProperty(n, '__esModule', {
  value: true
})
const i = (function () {
  function e () {}
  return e.logEvent = function (e, t) {
    return void 0 === t && (t = null), __awaiter(this, void 0, void 0, function () {
      let n
      return __generator(this, function (i) {
        return n = null, cc.sys.platform === cc.sys.WECHAT_GAME && window.wx.aldSendEvent && (window.wx.aldSendEvent(e, t), n = 'wx'), console.info('打点' + n + ': event = ' + e + ', bundle = ' + JSON.stringify(t)), [2]
      })
    })
  }, e
}())
n.AnalyticsUtilities = i
