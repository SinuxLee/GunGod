const n = module.exports = {}
const t = module

const i = require('Network')
const o = (require('GameConfig'), {
  requestMoreGameList: function (e) {},
  navigateToMiniProgram: function (e) {
    const t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ''
    wx.getSystemInfo({
      success: function (n) {
        if (e) {
          const o = {
            appId: 'wxf88c93d96e079e42',
            devModel: n.model,
            devBrand: n.brand,
            gameVersion: window.gameVersion,
            WXVersion: n.version,
            SDKVersion: n.SDKVersion,
            system: n.system,
            benchmarkLevel: n.benchmarkLevel,
            lan: n.language,
            tAppId: e,
            uId: window.facade.getComponent('PlayerModel').userId
          }
          wx.navigateToMiniProgram({
            appId: e,
            path: t,
            success: function () {
              o.result = 1, i.postRequest('https://games.qdos.com/open/api/record', 'p=' + JSON.stringify(o), {
                success: function (e) {},
                failure: function (e) {}
              })
            },
            fail: function (e) {
              o.result = 2, o.errMsg = e, i.postRequest('https://games.qdos.com/open/api/record', 'p=' + JSON.stringify(o), {
                success: function (e) {},
                failure: function (e) {}
              })
            }
          })
        }
      }
    })
  },
  initRecommendItems: function (e) {
    this.requestMoreGameList(function (t) {
      for (let n = 0; n < e.length; n++) {
        e[n].getComponent('RecommendGameItem').setupItemData(JSON.parse(JSON.stringify(t[n])))
      }
    })
  },
  updateRecommendItems: function (e) {
    this.requestMoreGameList(function (t) {
      for (let n = 0; n < e.length; n++) {
        for (let i = 0; i < t.length; i++) {
          const o = e[n]
          const a = t[i]
          if (!o.getComponent('RecommendGameItem').isInHistory(a)) return void o.getComponent('RecommendGameItem').setupItemData(a)
        }
      }
    })
  },
  getData: function () {
    return this._data
  }
})
t.exports = o
