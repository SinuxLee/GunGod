const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,

  onLoad: function () {
    this.node.WxRegister = this.node.checkName + '/checkCode'
    this.node.WxServerDelivery = 'weixin/shopBuy'
    this.node.ServerInfo = 'gameServer/userData'
    this.node.ServerInfoTest = 'test/cargodServerInfo'
    this.node.BoardCastImage = 'test/ipartGameNotice'
    this.node.RefreshUserInfo = 'weixin/refreshUserInfo'
    this.node.CheckFuncOpen = 'game/funcList'
    this.node.GetRecord = 'saveRecord/getUserGameRecord'
    this.node.SaveRecord = 'saveRecord/saveRecord'
    this.node.Setting = 'game/getSettingInfo'
    this.node.AcceptInvite = 'game/inviteAccept'
    this.node.InviteeList = 'game/inviteeList'
    this.node.CollectorDa = 'log/collectorDa'
    this.node.SaveScore = 'rank/saveScore'
    this.node.RankList = 'rank/getRankList'
    this.node.SelfRankData = 'rank/getSelfRankOrder'
    this.node.QQLogin = 'qzone/login'
    this.node.QQBuy = 'qzone/shopBuy'
    this.node.QQUserInfo = '/v3/user/get_info'
    this.node.QQGetUionid = '/v3/user/get_unionid'
    this.node.QQGetFriends = '/v3/relation/get_app_friends'
    this.node.QQGetMultiInfo = '/v3/user/get_multi_info'
    this.node.QQGetUserInfo = '/v3/user/get_playzone_userinfo'
    this.node.RecommendGame = 'game/recommendData'
    this.node.NavigateOut = 'game/navigateOut'
    this.node.MoreGame = 'game/boxData'
    this.node.CityList = 'game/funcList'
  },
  start: function () {},
  dealResponseAb: function (e) {},
  dealResponseJson: function (e) {
    console.log('dealResponseJson:', e)
    cc.systemEvent.emit(ModuleEventEnum.GOT_HTTP_RES, e)
  },
  refineReport: function (e) {},
  appLinkReport: function (e) {
    if (facade.isMiniGame) {
      this.reqData = null
      this.reqData = window.facade.getComponent('PlayerModel').wxAdaptor.getAppLinkParams()
      this.reqData.objGmId = e
      const t = Date.parse(new Date())
      this.reqData.timeStr = t / 1e3
      console.log('====behaveReport:', this.reqData)
      const n = {
        gmId: this.reqData.gmId,
        objGmId: this.reqData.objGmId,
        openid: this.reqData.openid,
        chan: this.reqData.chan,
        subChan: this.reqData.subChan,
        timeStr: this.reqData.timeStr
      }
      this.reqData.sign = this.createSign(this.objKeySort(n))
      let i = ''
      let o = 0
      for (const a in this.reqData) o > 0 && (i += '&'), o++, i += a + '=' + this.reqData[a]
      const s = window.facade.appLinkReportAdress
      this.requestUrl(s, i, true)
    }
  },
  behaveReport: function (e) {},
  objKeySort: function (e) {
    for (var t = Object.keys(e).sort().reverse(), n = {}, i = 0; i < t.length; i++) n[t[i]] = e[t[i]]
    return n
  },
  createSign: function (e) {
    for (var t = Object.keys(e), n = '', i = 0; i < t.length; i++) i && (n += '_'), n += e[t[i]]
    return cc.md5Encode(n).toLowerCase()
  },
  request: function (e, t) {
    let n = ''
    let i = 0
    for (const o in t) i > 0 && (n += '&'), i++, n += o + '=' + t[o]
    this.requestUrl(e, n, true)
  },
  urlencode: function (e) {
    let t = encodeURIComponent(e)
    return t = t.replace(/[^0-9a-zA-Z\-_\.%]/g, function (e) {
      return '%' + e.charCodeAt(0).toString(16).toUpperCase()
    })
  },
  requestQQApi: function (e, t) {
    const n = window.facade.openapiUrl + e
    const i = []
    for (const o in t) i.push(o + '=' + t[o])
    i.sort(function (e, t) {
      return e > t ? 1 : e < t ? -1 : 0
    })
    let a = i.join('&')
    const s = ['GET', this.urlencode(e), this.urlencode(i.join('&'))].join('&')
    const c = CryptoJS.HmacSHA1(s, window.facade.qqAppKey + '&').toString(CryptoJS.enc.Base64)
    a += '&sig=' + this.urlencode(c), this.requestUrl(n, a, false)
  },
  requestUrl: function (e, t, n, i, o) {
    if (e != null && e != '') {
      let a
      a = t && !n ? e + '?' + t : e
      const s = new XMLHttpRequest()
      console.log('requestUrl', e)
      n ? (s.open('POST', e, true), s.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')) : s.open('GET', a, true), s.onerror = function () {
        i != null && s.readyState == 1 && s.status
      }, s.onreadystatechange = function () {
        s.readyState == 4 && (s.status == 200 ? o == 'arraybuffer' ? (s.responseType = o, this.dealResponseAb(s.response)) : this.dealResponseJson(JSON.parse(s.responseText)) : i && i(s.status))
      }.bind(this), facade.isMiniGame && (s.timeout = 5e3), t == null || t == '' ? s.send() : s.send(t)
    }
  },
  getParamString: function (e) {
    let t = ''
    for (const n in e) t += '{0}={1}&'.format(n, e[n])
    console.log('params---------\x3e', t)
    return t.substr(0, t.length - 1)
  }
})
