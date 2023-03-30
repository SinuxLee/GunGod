const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {
    this.init()
  },
  start: function () {},
  init: function () {
    this.node.TIME_ZONE_OFFSET = -28800, this.inSocketErr = !1, this.inConnecting = !1, this._httpConnector = this.node.getComponent('HttpConnector'), setInterval(this.sendHeart.bind(this), 3e4)
  },
  fakeLogin: function () {
    this.node.getComponent('FakeInfoLogic') || (this.node.addComponent('FakeInfoLogic'), this.node.getComponent('FakeInfoLogic').init()), this.node.getComponent('FakeInfoLogic').fakeLogin()
  },
  connect: function (e) {
    this._connector.connect(e)
  },
  send: function (e) {
    this._connector.send(e)
  },
  close: function () {
    this.inConnecting = !1, this._connector.close()
  },
  onConnected: function () {
    console.log('server connect...'), this.inError = !1, this.inConnecting = !0, cc.systemEvent.emit(i.SERVER_CONNECTED)
  },
  updateServerTime: function (e) {
    this.serverTimeSec = e.currTs, this.serverTimeMs = e.currMs, this.serverLaunchMs = e.runTs, this._timeUpdateFlag = (new Date()).getTime(), this._canSendHeart = !0
  },
  getServerLaunchMs: function () {
    const e = (new Date()).getTime() - this._timeUpdateFlag
    return this.serverLaunchMs + e
  },
  getServerTimeSec: function () {
    const e = (new Date()).getTime() - this._timeUpdateFlag
    return Math.floor(this.serverTimeSec + e / 1e3)
  },
  getServerToday0Clock: function () {
    const e = new Date(1e3 * window.net.getComponent('Net').getServerTimeSec())
    return e.setHours(0, 0, 0, 0), Math.floor(e.getTime() / 1e3)
  },
  onResponse: function (e) {
    switch (console.log('onResponse:', JSON.stringify(e)), e.messageName = e.GetMessageName(), e.messageName) {
      case 'Message_login.GCResHeartMessage':
        this.updateServerTime(e)
    }
    cc.systemEvent.emit(i.SERVER_RESPONSE, e)
  },
  sendHeart: function () {
    if (console.log('sendHeart...'), this._canSendHeart) {
      const e = new Message_login.CGReqHeartMessage()
      e.ctor(this.getServerLaunchMs()), window.net.getComponent('Net').send(e)
    }
  },
  httpRequest: function (e, t) {
    t.hasOwnProperty('token') && void 0 == t.token || this._httpConnector.request(e, t)
  },
  requestQQApi: function (e, t) {
    t || (t = {}), t.appid = window.facade.qqAppId, t.openid = window.facade.openId, t.openkey = window.facade.openKey, t.pf = window.facade.pF, t.format = 'json', this._httpConnector.requestQQApi(e, t)
  },
  behaveReport: function (e) {
    this._httpConnector.behaveReport(e)
  },
  appLinkReport: function (e) {
    this._httpConnector.appLinkReport(e)
  },
  requestUrl: function (e, t, n, i, o) {
    this._httpConnector.requestUrl(e, t, n, i, o)
  },
  socketErrorDeal: function () {
    this.inConnecting = !1, this.inError = !0, this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(this.alertNetError, this)))
  },
  alertNetError: function () {
    window.facade.CurrentScene != 'Title' && this.inError && window.popUp.getComponent('Pop').addAlert('网络好像出问题了哦！点“确认”重新登录试试吧~', function () {
      window.facade.reEnter = !0, window.popUp.getComponent('Pop').reset(), cc.systemEvent.emit(i.RE_ENTERED, !0)
    }, !1)
  }
})
