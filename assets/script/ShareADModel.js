const i = require('ModuleEventEnum')
require('Network'), require('AlertTool')
cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {
    this.dayId = 1, this.shareCount = 0, this.videoCount = 0, this.loginCount = 1, this.dayShareADCount = 0, this.dayShareCount = 0, this.dayADCount = 0, this.lastLoginTime = this.getLocalTime(), this.shareInterval = 500, this.shareOpen = !0, this.initConfig(), facade.isMiniGame && (cc.systemEvent.on(i.WX_REGISTERED, this.onWxRegistered, this), cc.systemEvent.on(i.GOT_HTTP_RES, this.httpResDeal2.bind(this)), cc.systemEvent.on(i.WX_SHOW, this.onWxShow.bind(this)), cc.systemEvent.on(i.WX_HIDE, this.onWxHide.bind(this)))
  },
  initConfig: function () {
    cc.loader.loadResArray(['config/ASOrderConfig', 'config/ASRuleConfig', 'config/GameConfig'], cc.JsonAsset, this.configLoaded.bind(this))
  },
  httpResDeal2: function (e) {
    let t;
    (e = e.data) && e.invite_newbie && (this.newerCount = e.invite_newbie.length, this.newbieList = e.invite_newbie, this.newbieList && this.newbieList.length > 1 && (t = this.sortList(this.newbieList, 'newbieFetchList')), this.generateOrder(), cc.systemEvent.emit(i.GAME_OPEN_NEWBIE_INVITE, t))
    e && e.invite_alive && (this.activityCount = e.invite_alive.length, this.activityList = e.invite_alive, this.generateOrder(), cc.systemEvent.emit(i.GAME_OPEN_DAILY_INVITE, this.activityList))
  },
  httpResDeal: function (e) {
    if (e && e.record) {
      const t = JSON.parse(e.record)
      console.log('ShareADModel data:', t), this.dayCheck(t), this.saveRecord()
    }
  },
  sortList: function (e, t) {
    for (var n = [], i = facade.getComponent('GameModel')[t], o = 0; o < e.length; o++) {
      for (let a = 0; a < i.length && i[a].user_id != e[o].user_id; a++);
      n.push(e[o])
    }
    return n.sort(function (e, t) {
      return e.add_ts > t.add_ts ? 1 : -1
    }), n
  },
  getLocalTime: function () {
    const e = new Date()
    return e.getTime() - 6e4 * e.getTimezoneOffset()
  },
  dayCheck: function (e) {
    this.lastLoginTime = Number(e.lastLoginTime), this.dayId = Number(e.dayId), this.loginCount = Number(e.loginCount), this.dayADCount = Number(e.dayADCount), this.dayShareCount = Number(e.dayShareCount), this.dayShareADCount = Number(e.dayShareADCount), this.shareCount = Number(e.shareCount), this.videoCount = Number(e.videoCount)
    const t = this.getLocalTime()
    const n = Math.floor(this.lastLoginTime / 86400 / 1e3)
    const o = Math.floor(t / 86400 / 1e3)
    const a = new Date(86400 * o * 1e3)
    const s = new Date(86400 * n * 1e3)
    console.log('lastDay:', s.toString()), console.log('today:', a.toString()), console.log('day check:', n, '----------', o), n < o && (this.dayId++, this.dayADCount = 0, this.dayShareCount = 0, this.dayShareADCount = 0), this.lastLoginTime = t, this.loginCount++, this.generateOrder(), cc.systemEvent.emit(i.LOGININFO_GOT)
  },
  generateOrder: function () {
    if (this.GameConfig) {
      this.activityCount || (this.activityCount = 0), this.newerCount || (this.newerCount = 0)
      let e = this.dayId - 1
      if (e < 1 && (e = 1), this.videoFactor = this.videoCount / e, this.newerFactor = this.newerCount / e, this.activityFactor = this.activityCount / e, this.shareFactor = this.newerFactor * Number(this.GameConfig.NewerValue.Value) / 100 + this.activityFactor * Number(this.GameConfig.OnlineValue.Value) / 100, this.dayId == 1) this.headOrderIds = this.GameConfig['Day_' + this.dayId + '_AS_Order'].Value.split(':')[0].split(','), this.loopOrderIds = this.GameConfig['Day_' + this.dayId + '_AS_Order'].Value.split(':')[1].split(',')
      else if (this.dayId <= 3) {
        const t = this.GameConfig['Day_' + this.dayId + '_AS_Order'].Value.split('|')[0]
        const n = this.GameConfig['Day_' + this.dayId + '_AS_Order'].Value.split('|')[1]
        const i = t.split(':')[0]
        const o = t.split(':')[1]
        if (this.newerFactor == Number(i) && this.shareCount / e < Number(o) && (this.headOrderIds = n.split(':')[0].split(',')), this.loopOrderIds = n.split(':')[1].split(','), this.videoFactor < 1) {
          for (var a = 0; a < this.headOrderIds.length; a++) this.headOrderIds[a] == '2' && (this.headOrderIds[a] = '4')
          for (a = 0; a < this.loopOrderIds.length; a++) this.loopOrderIds[a] == '2' && (this.loopOrderIds[a] = '4')
        }
      } else {
        const s = this.GameConfig.Day_4_AS_OrderA.Value.split('|')[0]
        const c = this.GameConfig.Day_4_AS_OrderB.Value.split('|')[0]
        if (this.loginCount / e < Number(s)) this.headOrderIds = this.GameConfig.Day_4_AS_OrderA.Value.split('|')[1].split(',')
        else if (this.newerCount < Number(c)) this.headOrderIds = this.GameConfig.Day_4_AS_OrderB.Value.split('|')[1].split(',')
        else {
          const r = this.getRulesId(1, e)
          this.headOrderIds = this.ASOrderConfig[r].Value
        }
        const l = this.getRulesId(2, e)
        this.loopOrderIds = this.ASOrderConfig[l].Value
      }
    }
  },
  getRulesId: function (e, t) {
    for (var n = [], i = 1; i <= 3; i++) {
      for (var o = this.asRules['type_' + i], a = 0, s = 0; s < o.length; s++) {
        let c = 0
        i == 1 ? c = this.shareCount / t : i == 2 ? c = this.videoFactor : i == 3 && (c = this.shareFactor), c >= o[s].value && (a = o[s].id)
      }
      n.push(a)
    }
    let r = e + ''
    for (i = 0; i < n.length; i++) r += '_' + n[i]
    return r
  },
  saveRecord: function () {
    if (facade.CurrentScene != 'SkipPage') {
      const e = {}
      e.dayId = this.dayId, e.loginCount = this.loginCount, e.lastLoginTime = this.lastLoginTime, e.shareCount = this.shareCount, e.videoCount = this.videoCount, e.dayShareADCount = this.dayShareADCount, e.dayShareCount = this.dayShareCount, e.dayADCount = this.dayADCount, console.log('save shareModel data:', e)
      const t = {
        game_id: window.facade.GameId,
        token: window.facade.getComponent('PlayerModel').token,
        record_type: 3,
        record: JSON.stringify(e)
      }
      window.net.getComponent('Net').httpRequest(window.net.SaveRecord, t)
    }
  },
  configLoaded: function (e, t) {
    for (let n = 0; n < t.length; n++) t[n].name == 'ASOrderConfig' ? this.ASOrderConfig = t[n].json : t[n].name == 'ASRuleConfig' ? this.ASRuleConfig = t[n].json : t[n].name == 'GameConfig' && (this.GameConfig = t[n].json)
    if (this.GameConfig && (this.headOrderIds = this.GameConfig.Day_1_AS_Order.Value.split(':')[0].split(','), this.loopOrderIds = this.GameConfig.Day_1_AS_Order.Value.split(':')[1].split(','), this.maxADCount = Number(this.GameConfig.VideoLimit.Value), this.maxShareCount = Number(this.GameConfig.ShareLimit.Value), facade.getComponent('LevelModel').vipStarNeed = Number(this.GameConfig.VipUnlockLevel.Value), facade.getComponent('LevelModel').injuryStarNeed = Number(this.GameConfig.InjuryUnlockLevel.Value), facade.getComponent('LevelModel').gndStarNeed = Number(this.GameConfig.GrenadegrUnlockLevel.Value)), this.ASRuleConfig) {
      for (const i in this.asRules = {}, this.ASRuleConfig) {
        const o = this.ASRuleConfig[i]
        this.asRules['type_' + String(o.Type)] || (this.asRules['type_' + String(o.Type)] = [])
        const a = {}
        a.id = o.ID, a.value = o.ValueType == 1 ? o.Value : o.Value / 1e4, this.asRules['type_' + String(o.Type)].push(a)
      }
    }
    this.generateOrder()
  },
  getShareADType: function () {
    console.log('lc shareAD-- 分享次数 = ', this.dayShareCount), console.log('lc shareAD-- 视频次数 = ', this.dayADCount), console.log('lc shareAD-- 分享视频合体 次数 =', this.dayShareADCount)
    let e = void 0
    if (this.dayShareADCount < this.headOrderIds.length) e = Number(this.headOrderIds[this.dayShareADCount]), console.log('lc shareAD--  初始序列: 类型= ', parseInt(e) == 1 ? '视频' : '分享')
    else {
      const t = this.dayShareADCount % this.loopOrderIds.length
      e = Number(this.loopOrderIds[t]), console.log('lc shareAD--  循环序列: 类型= ', parseInt(e) == 1 ? '视频' : '分享')
    }
    return e == 1 ? this.dayADCount < this.maxADCount ? (console.log('lc shareAD-- type 随机：看视频', this.dayADCount, this.maxADCount), 1) : this.dayShareCount < this.maxShareCount ? (console.log('lc shareAD-- type 随机： 视频看完 去分享', this.dayShareCount, this.maxShareCount), 2) : (console.log('lc shareAD-- type 随机： 视频看完 分享超过次数', this.dayShareCount, this.dayADCount), 3) : e == 2 ? this.dayShareCount < this.maxShareCount ? (console.log('lc shareAD-- type 随机： 去分享', this.dayShareCount, this.maxShareCount), 2) : this.dayADCount < this.maxADCount ? (console.log('lc shareAD-- type 随机：分享次数完成 去看视频', this.dayADCount, this.maxADCount), 1) : (console.log('lc shareAD-- type 随机：分享超过次数， 视频看完 ', this.dayShareCount, this.dayADCount), 3) : e
  },
  clientTimeStamp: function () {
    return (new Date()).getTime()
  },
  showShareAD: function (e, t) {
    (this.callback = t, this.type = e, facade.isMiniGame) ? this.setupShareInfo(t) : t.succ(e)
  },
  setupVideoInfo: function () {
    const e = this
    this.gameVideo == null
      ? (console.log('lc shareAD--  初始化 gameVideo'), this.sendMggfBehaveReport(1, 1), this.gameVideo = wx.createRewardedVideoAd({
          adUnitId: 'adunit-5b4582e3072248c3'
        }), this.gameVideo.onError(function (t) {
          e.sendMggfBehaveReport(4, 1), console.log('lc shareAD--  视频加载失败 = ', t.errMsg), e.setupShareInfo(null)
        }), this.gameVideo.onClose(function (t) {
          t.isEnded ? (console.log('lc shareAD-- 观看完成 关闭 = '), e.callback && (e.callback.succ(e.type), e.callback = null), e.sendMggfBehaveReport(3, 1)) : (console.log('lc shareAD--  观看未完成 关闭 = '), e.callback && (e.callback.fail('还没有看完视频,没法领取奖励哦~', e.type), e.callback = null))
        }))
      : console.log('lc shareAD--  已经创建 gameVideo'), this.gameVideo.load().then(function () {
      e.gameVideo.show().then(function () {
        e.sendMggfBehaveReport(2, 1), console.log('lc shareAD--  显示成功, 上报')
      })
    }).catch(function (t) {
      e.sendMggfBehaveReport(4, 1), console.log('lc shareAD--  load 看视频失败 去分享', t), e.setupShareInfo(null)
    }), this.dayADCount++, this.videoCount++, this.dayShareADCount++, this.saveRecord()
  },
  setupShareInfo: function () {
    const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null
    let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ''
    let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ''
    const i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : ''
    this.shareDataArr = facade.getComponent('GameModel').shareConfig
    const o = this
    const a = this.shareDataArr[c(0, this.shareDataArr.length)]
    t == '' && (t = a.title, n = a.img), this.shareTime = (new Date()).getTime()

    function s (t) {
      if (e) {
        let n = void 0
        t
          ? ((n = c(0, 3) - 1) < 0 && (n = 0), wx.showToast({
              title: [' 分享成功', '分享成功'][n]
            }))
          : ((n = c(0, 4) - 1) < 0 && (n = 0), wx.showToast({
              title: ['分享失败', '分享失败', '分享失败'][n]
            }))
      }
    }

    function c (e, t) {
      return Math.random() * (t - e) + e << 0
    }
    wx.onShow(function a () {
      const c = this
      e && (setTimeout(function () {
        if ((new Date()).getTime() - o.shareTime >= 3e3) Math.random() > 0.1 ? (e && e.succ(), s(!0)) : (e && e.fail(), s(!1))
        else if (Math.random() > 0.8) e && e.succ(), s(!0)
        else {
          if (o.shareTimes == 1) return e && e.fail(), s(!1), void (o.shareTimes = 0)
          s(!1), e && setTimeout(function () {
            wx.showModal({
              title: '提示',
              content: '获取失败，换换其他的好友试试吧',
              showCancel: !0,
              cancelText: '知道了',
              confirmText: '重新获取',
              success: function (a) {
                a.confirm ? (o.shareTimes++, o.share(t, n, i, e)) : a.cancel && console.log('用户点击确定')
              }
            })
          }, c, 1e3)
        }
      }, 1e3), wx.offShow(a))
    }), wx.shareAppMessage({
      title: t,
      imageUrl: n,
      query: (function (e) {
        if (!e) return ''
        let t = ''
        for (const n in e) t += n + '=' + e[n] + '&'
        return t
      }(i)),
      cancel: function (e) {}
    }), this.dayShareCount++, this.shareCount++, this.dayShareADCount++, this.saveRecord()
  },
  onWxRegistered: function () {
    this.initDefaultShare(), this.requestOnlineInfo(), this.reportInviteInfo(), this.requestInvitee(), this.saveRecord(), cc.systemEvent.emit(i.LOGININFO_GOT)
  },
  requestInvitee: function () {
    const e = {
      game_id: window.facade.GameId,
      token: window.facade.getComponent('PlayerModel').token
    }
    window.net.getComponent('Net').httpRequest(window.net.InviteeList, e)
  },
  requestOnlineInfo: function () {
    const e = {
      game_id: window.facade.GameId,
      token: window.facade.getComponent('PlayerModel').token,
      record_type: 3
    }
    let t = ''
    let n = 0
    for (const i in e) n > 0 && (t += '&'), n++, t += i + '=' + e[i]
    const o = window.facade.httpServerAdress + window.net.GetRecord
    const a = new XMLHttpRequest()
    a.onreadystatechange = function () {
      a.readyState == 4 && a.status == 200 && this.httpResDeal(JSON.parse(a.responseText).data)
    }.bind(this), a.onerror = function (e) {}, a.open('POST', o, !0), a.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'), a.send(t)
  },
  reportInviteInfo: function () {
    const e = window.facade.getComponent('PlayerModel').wxAdaptor.getinviteRid()
    const t = window.facade.getComponent('PlayerModel').wxAdaptor.getinviteType()
    const n = {
      game_id: window.facade.GameId,
      token: window.facade.getComponent('PlayerModel').token,
      invite_type: t,
      inviter_uid: e
    }
    window.net.getComponent('Net').httpRequest(window.net.AcceptInvite, n)
  },
  countWhetherShare: function () {
    return !0
  },
  getShareConfig: function (e) {
    this.shareConfig = [{
      count: 1,
      random: 0
    }, {
      count: 2,
      random: 500
    }, {
      count: 3,
      random: 1e3
    }, {
      count: 4,
      random: 1500
    }, {
      count: 5,
      random: 8e3
    }]
    for (let t = 0; t < this.shareConfig.length; t++) {
      const n = this.shareConfig[t]
      if (n.count == e) return console.log('lc shareAD-- config =  ', n), n
    }
    return console.log('lc shareAD-- config1 =  ', {
      count: 2,
      random: 1500
    }), {
      count: 6,
      random: 1e4
    }
  },
  getShareCount: function () {
    let e = cc.sys.localStorage.getItem('ShareFailCount')
    return e || (e = 0), console.log('lc shareAD-- getShareErrCount = ', e), e
  },
  saveShareFailCount: function (e) {
    if (e == 0) cc.sys.localStorage.setItem('ShareFailCount', 0)
    else {
      let t = cc.sys.localStorage.getItem('ShareFailCount')
      t || (t = 0), t += 1, console.log('lc shareAD-- saveShareErrCount = ', t), cc.sys.localStorage.setItem('ShareFailCount', t)
    }
  },
  initDefaultShare: function () {
    wx.onShareAppMessage(function () {
      return {
        title: '开局一条命一把98K，你能闯多少关',
        imageUrl: 'https://gcdn.qdos.com/game/common/file/201911061730043511/ab12312.png'
      }
    }), wx.showShareMenu({
      withShareTicket: !0
    })
  },
  defaultShareParamsInit: function (e, t, n) {
    const i = this
    console.log('defaultShareParamsInit...', e, t, n), this.defaultShareText = e, this.defaultShareImge = t, this.defaultShareQuery = n, wx.onShareAppMessage(function () {
      return console.log('defaultShare...'), i.shareCount++, i.dayShareADCount++, i.dayShareCount++, window.net.getComponent('Net').behaveReport(window.facade.BEHAVE_SHARE), {
        title: i.defaultShareText,
        imageUrl: i.defaultShareImge,
        query: i.defaultShareQuery
      }
    })
  },
  sendMggfBehaveReport: function (e, t) {
    const n = {}
    n.da_action = e, n.da_position = void 0 == this.showId ? 0 : this.showId, n.da_type = t, n.game_id = facade.GameId, n.user_id = window.facade.getComponent('PlayerModel').privateUid, n.time = Math.floor((new Date()).getTime() / 1e3)
    const i = this.getMggfSign(n)
    n.sign = i
    const o = window.facade.httpServerAdress + 'log/collectorDa'
    const a = new XMLHttpRequest()
    a.onreadystatechange = function (e) {}, a.onerror = function (e) {}, a.open('POST', o, !1), a.send(n)
  },
  getMggfSign: function (e) {
    const t = 'da_action=' + e.da_action + '&da_position=' + e.da_position + '&da_type=' + e.da_type + '&game_id=' + e.game_id + '&time=' + e.time + '&user_id=' + e.user_id + '|' + facade.Client_Secret
    return console.log('lc getMggfSign =', t, cc.md5Encode(t).toLowerCase()), cc.md5Encode(t).toLowerCase()
  },
  onWxShow: function () {},
  onWxHide: function () {},
  onShowInterstital: function () {
    const e = {
      inviteId: 0,
      videoId: 0,
      assistId: 0,
      interstitalId: 31107
    }
    this.showShareAD(e, {
      succ: function (e) {},
      fail: function (e, t) {}
    })
  }
})
