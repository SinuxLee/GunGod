const ModuleEventEnum = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,

  initConfig () {},
  onLoad () {
    if (facade.isMiniGame) {
      this.userObject = null
      this.rewardTplId = null
      this.inviteTypeId = null
      this.node.addComponent('WxAdaptor')
      this.wxAdaptor = this.node.getComponent('WxAdaptor')
      this.wxAdaptor.init(this)
      cc.systemEvent.on(ModuleEventEnum.GOT_HTTP_RES, this.httpResDeal.bind(this))
      cc.systemEvent.on(ModuleEventEnum.WX_REGISTERED, this.onGotToken.bind(this))
      cc.systemEvent.on(ModuleEventEnum.INIT_ROLEINFO_COMPLETED, this.onRoleInfo, this)
    }
  },

  onGotToken () {
    const e = {
      game_id: window.facade.GameId,
      token: this.token
    }
    window.net.getComponent('Net').httpRequest(window.net.Setting, e)
    this.checkFuncOpen()
  },
  onRoleInfo: function () {
    this.wxAdaptor.checkBroadcastReward()
  },
  httpResDeal: function (e) {
    if (e && e.data) {
      const t = e.data
      t.extra_config && t.extra_config.online_version && this.checkVersion(t.extra_config.online_version)
      t[0] && t[0].func_id && (this.addFuncOpenList(t), window.facade.getFunc = true)
    }
  },
  checkFuncOpen: function () {
    const e = {}
    e.game_id = window.facade.GameId
    e.token = this.token
    window.net.getComponent('Net').httpRequest(window.net.CheckFuncOpen, e)
  },
  gotServerData: function (e) {
    this.servers = e
    cc.systemEvent.emit(ModuleEventEnum.GOT_SERVER_INFO)
  },
  checkVersion: function (e) {
    this.verisonValue = Number(e)
    this.verisonValue < facade.VERSION ? facade.SAVE_MODE = true : facade.SAVE_MODE = false
    cc.systemEvent.emit(ModuleEventEnum.SAVE_MODE_CHANGE)
  },
  addNoticeData: function (e) {
    this.noticeImgs = e
  },
  addFuncOpenList: function (e) {
    console.log('func opens:', e)
    this.funcList = {}
    this.funcParams = {}
    for (const t in e) {
      this.funcList[e[t].func_id] = e[t].is_open
      this.funcParams[e[t].func_id] = e[t].func_params
    }

    cc.systemEvent.emit(ModuleEventEnum.FUNCOPEN_UPDATE)
  },
  isIntersADOpen: function () {
    return !!this.funcList && !(!this.funcList[11] || this.funcList[11] != '1')
  },
  isIconRandomOrder: function (e) {
    let t = 17
    switch (e) {
      case 'result':
        t = 15
        break
      case 'interstitial':
        t = 16
        break
      case 'bottom':
        t = 17
        break
      case 'banner':
        t = 18
    }
    return !!this.funcList && !(!this.funcList[t] || this.funcList[t] != '1')
  },
  checkVirBannerShow: function (e) {
    if (!facade.SAVE_MODE) {
      if (!this.funcList || !this.funcList[10] || this.funcList[10] != '1') return false
      const t = this.funcParams[10].split(',')
      for (const n in t) { if (t[n] === String(facade.uiNames[e])) return true }
      return false
    }
  },
  getRecommondType: function () {
    return !!this.funcList && !(!this.funcList[12] || this.funcList[12] != '1')
  },
  getRecommondCount: function () {
    return this.funcParams && this.funcParams[12] ? Number(this.funcParams[12]) : 19
  },
  getBottomRecommondRandomCount: function () {
    return this.funcParams && this.funcParams[17] ? Number(this.funcParams[17]) : 0
  },
  getInterstiRecommondRandomCount: function () {
    return this.funcParams && this.funcParams[16] ? Number(this.funcParams[16]) : 0
  },
  getResultRecommondRandomCount: function () {
    return this.funcParams && this.funcParams[15] ? Number(this.funcParams[15]) : 0
  },
  getBannerRecommondRandomCount: function (e) {
    if (!this.funcParams || !this.funcParams[18]) return 0
    this.virBannerList == null && (this.virBannerList = this.funcParams[18].split(','))
    let t = []
    t = t.concat(e)
    for (var n = 0; n != this.virBannerList.length;) {
      const i = parseInt(this.virBannerList[n])
      const o = t.splice(0, i)
      if (this.checkItem(o), console.log('checklist is : ', o), n++, o.length != 0) return o
    }
    return parseInt(this.virBannerList[n - 1])
  },
  checkItem: function (e) {
    for (let t = 0; t != e.length;) e[t].navout_cnt > 0 ? e.splice(t, 1) : t++
  },
  isClickCountLimit: function (e) {
    if (!this.funcParams) return false
    if (!this.funcParams[14]) return false
    for (let t = this.funcParams[14].split(','), n = 0; n < t.length; n++) { if (t[n] == String(e)) return true }
    return false
  },
  isLoginInterOpen: function () {
    if (!this.funcParams) return false
    if (!this.funcParams[13]) return false

    const e = this.funcParams[13].split(',')
    const t = facade.channel_id + '_' + facade.channel_sub
    for (let n = 0; n < e.length; n++) { if (t == e[n]) return true }
    return false
  },
  connectGameServer: function (e) {
    e == 0 && facade.isMiniGame && window.facade.VERSION > this.verisonValue && (e = facade.SERVER_ID_BETA, facade.SAVE_MODE = true), this.currentServer = this.servers[e], this.serverAddresss = this.servers[e].websocket, window.net.getComponent('Net').connect(this.serverAddresss)
  },
  onConnected: function () {
    console.log('onConnected...1')
    if (facade.isMiniGame || window.facade.inQQ) {
      console.log('onConnected...2')
      this._adultType = 3
      this._osType = window.facade.PhoneInfo.system.match('iOS') == null ? 1 : 2
      let e = String(this.userId)
      e = this.serverAddresss.match('wss://') ? String(this.userId) : String(this.privateUid)
      this.loginGameServer(e)
    } else {
      this._adultType = 3
      this._osType = 3
      cc.systemEvent.emit(ModuleEventEnum.NEED_INPUT_ID)
    }
  },
  loginGameServer: function (e) {
    let t = 1
    let n = this.wxAdaptor.getAdScource()
    console.log('got adSource:', n), n && n != 0 && n.chanId && (n = n.chanId + '_' + n.subCid, this.wxAdaptor.chanId = null)
    const i = this.currentServer.id
    facade.isMiniGame ? (t = 1, window.net.getComponent('Net').behaveReport(window.facade.BEHAVE_LOGIN)) : window.facade.inQQ && (t = window.facade.PhoneInfo.system.match('iOS') ? 3 : 2)
    const o = new Message_login.CGReqUserLoginMessage()
    o.ctor(e, t, this._osType, i, n, this._adultType)
    window.net.getComponent('Net').send(o)
  },
  getTargetRoleInfo: function (e) {
    const t = new Message_role.CSReqViewTargetProfileMessage()
    t.ctor(e)
    window.net.getComponent('Net').send(t)
  },
  recordRoleProfile: function () {
    if (this.platUserInfo) {
      const e = {
        game_id: window.facade.GameId,
        token: this.token,
        wx_data: this.wxAdaptor.wxEncryptedData,
        wx_iv: this.wxAdaptor.wxIv
      }
      window.net.getComponent('Net').httpRequest(window.net.RefreshUserInfo, e)
    }
  },
  parseRoleData: function (e) {
    for (var t = e, n = 0; n < e.attrList.length; n++) {
      var i = e.attrList[n]
      t[window.facade.PlayerAtrriKeys[i.type]] = i.value
    }
    for (n = 0; n < e.resList.length; n++) {
      i = e.resList[n]
      t[window.facade.PlayerAtrriKeys['res' + i.type]] = i.value
    }
    return t
  },
  updateRoleData: function (e) {
    const t = {}
    let n = 0
    let o = 0
    if (this.roleInfo && (o = this.roleInfo.level), e.resList) {
      for (var a = 0; a < e.resList.length; a++) {
        var s = e.resList[a]
        t[window.facade.PlayerAtrriKeys['res' + s.type]] = s.value
      }
    }
    if (e.attrList) {
      for (a = 0; a < e.attrList.length; a++) {
        s = e.attrList[a]
        t[window.facade.PlayerAtrriKeys[s.type]] = s.value
      }
    }
    if (this.roleInfo) {
      let c = false
      for (const r in t) {
        this.roleInfo[r] = t[r]
        r == 'energyLastRev' && true
        r == 'level' && (n = t[r])
        r == 'vip' && t[r] > 0 && true
        r != 'province' && r != 'city' || true
        r != 'midAutumnShop' && r != 'midAutumnRank' || (c = true)
      }
      c && cc.systemEvent.emit(ModuleEventEnum.TITLE_MIDAUTUMNPOINT)
      n && n != 0 && window.facade.getComponent('RankModel').saveScore(n)
      this.levelChange = this.roleInfo.level - o
      cc.systemEvent.emit(ModuleEventEnum.ROLE_INFO_UPDATED)
    }
  }
})
