const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {
    this.isFake = !1, this.canShowInterstital = !0, this.canShow = !0, facade.isMiniGame && (cc.systemEvent.on(i.WX_REGISTERED, this.onGotToken.bind(this)), cc.systemEvent.on(i.FUNCOPEN_UPDATE, this.onGotToken.bind(this)))
  },
  onGotToken: function () {
    const e = facade.getComponent('ShareADModel').GameConfig.Fake_Screen
    this.showIdCyc = e.Value.split('|'), this.cycId = -1, this.initInterstitialAd()
  },
  initInterstitialAd: function () {
    this.canShow = facade.getComponent('PlayerModel').wxAdaptor.checkInterstitialAd(), this.canShow
      ? facade.getComponent('PlayerModel').isIntersADOpen()
        ? (this.interAd = facade.getComponent('PlayerModel').wxAdaptor.createInterstitialAd({
            adUnitId: 'adunit-dda940b072af5cf3'
          }), this.interAd
            ? (console.log('----- 创建插屏广告 success---'), this.interAd.onLoad(function (e) {
                console.log('插屏广告加载中...')
              }), this.interAd.onError(function (e) {
                this.canShow = !1, console.log(' 插屏广告出错： ', e.errCode)
              }), this.interAd.onClose(this.callBack.bind(this)))
            : (this.canShow = !1, console.log('创建插屏广告失败')))
        : this.canShow = !1
      : console.log('基础库小于2.6.0， 无法创建插屏广告...')
  },
  showInterstitialAd: function (e, t) {
    this.cycId++, this.cycId >= this.showIdCyc.length && (this.cycId = 0)
    const n = this
    if (this.type = e, !this.canShow) return this.canShowInterstital = !1, void (e.videoId == 0 && e.inviteId == 0 ? this.showFakeInterAD() : facade.getComponent('ShareADModel').showShareAD(n.type, t))
    if (this.canShowInterstital = !0, this.showId = e.interstitalId, this.callFunc = t, this.showIdCyc[this.cycId] != '0') {
      const i = this.interAd.show()
      i.then(function (e) {
        console.log('report 插屏埋点：', n.showId), n.sendBehaveReport(1)
      }), i.catch(function (e) {
        e.errCode && (console.log('插屏广告 显示失败 ,errCode: ', e.errCode), n.canShowInterstital = !1, n.sendBehaveReport(2), n.type.videoId == 0 && n.type.inviteId == 0 && n.showFakeInterAD())
      })
    } else this.showFakeInterAD()
  },
  showADAfterShare: function () {
    this.canShow && (this.interAd.show(), this.showId = facade.INTERSTIAL_AFTER_SHARE, this.sendBehaveReport(1))
  },
  sendBehaveReport: function (e) {},
  callBack: function () {
    console.log('callback is : ', this.callFunc), this.callFunc && this.callFunc.succ(), this.sendBehaveReport(3)
  },
  showAfterProp: function () {
    this.interAd.show(), this.showId = facade.INTERSTIAL_AFTER_PROP, this.sendBehaveReport(1)
  },
  showFakeInterAD: function () {
    facade.SAVE_MODE || popUp.getComponent('Pop').addPopByName('FakeInterUI', this.showIdCyc[this.cycId], !0)
  }
})
