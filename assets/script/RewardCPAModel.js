let i

function o (e, t, n) {
  return t in e
    ? Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    })
    : e[t] = n, e
}
const ModuleEventEnum = require('ModuleEventEnum')
const Network = require('Network')

cc.Class((o(i = {
  extends: cc.Component,
  properties: {
    isCPA: false,
    maxCarTerm: 0,
    cpaGameTime: 0,
    boxGameTime: 0,
    resourceMarkup: 0,
    carMarkup: 0,
    cpaRecord: [],
    boxReward: null
  },
  navigateToGame: function (e, t) {
    const n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2]
    const i = e.link
    let o = e.link_params
    const a = e.link_game_id
    const s = e.game_id
    if (wx.navigateToMiniProgram) {
      this.callback = t
      o = 'pages/index/index?' + o
      console.log('lc 游戏跳转 : appId=', i, ', path=', o, ' extraData = ', e)
      const c = this
      wx.navigateToMiniProgram({
        appId: i,
        extraData: {
          info: e
        },
        path: o,
        envVersion: n ? 'develop' : 'release',
        success: function () {
          console.log('lc 游戏跳转 : 成功')
          c.sendTravelGame(a, s)
          t && t.success()
          c.isCPA = true
        },
        fail: function () {
          t && t.failure()
          console.log('lc 游戏跳转 : 失败')
          popUp.getComponent('Pop').getPopByName('FakeInterUI') || popUp.getComponent('Pop').addPopByName('FakeInterUI', null, true)
        },
        complete: function () {}
      })
    }
  },
  sendTravelGame: function (e, t) {
    console.log('lc 跳转游戏-- 上报 webSocket', e, t)
    const n = {
      game_id: window.facade.GameId,
      to_game_id: e,
      final_to_game_id: t,
      token: window.facade.getComponent('PlayerModel').token
    }
    window.net.getComponent('Net').httpRequest(window.net.NavigateOut, n)
    console.log('lc 跳转游戏-- 上报 行行行 ', t)
    window.net.getComponent('Net').appLinkReport(t)
  },
  onLoad: function () {
    cc.systemEvent.on(ModuleEventEnum.GAMESENE_ENTERED, this.loadingEnd.bind(this))
    cc.systemEvent.on(ModuleEventEnum.RELOGIN_SUCCESS, this.reLoginSuccess.bind(this))
    cc.systemEvent.on(ModuleEventEnum.SERVER_RESPONSE, this.onServerResponse.bind(this))
    this.monitorWXLifeCycle()
  },
  monitorWXLifeCycle: function () {
    if (facade.isMiniGame) {
      const e = this
      wx.onShow(function () {
        setTimeout(function () {
          cc.director.getScene().name == 'Game' && window.net.getComponent('Net').inConnecting ? (console.log('lc cpa-- wx.onShow 检测奖励', window.net.getComponent('Net').inConnecting), e.getCPAReward()) : console.log('lc cpa-- wx.onShow 不满足领取条件')
        }, 200)
      })
    }
  },
  loadingEnd: function () {
    const e = this
    setTimeout(function () {
      cc.director.getScene().name == 'Game' && window.net.getComponent('Net').inConnecting && (console.log('lc cpa 加载完成 领取奖励'), e.getCPAReward())
    }, 200)
  },
  reLoginSuccess: function () {
    cc.director.getScene().name == 'Game' && window.net.getComponent('Net').inConnecting && (console.log('lc cpa 重连成功 检测奖励'), this.getCPAReward())
  },
  onServerResponse: function (e) {
    const t = e.detail
    switch (t.messageName) {
      case 'Message_reward.SCResLinkRewardFetchMessage':
        console.log('lc cpa -- 领取盒子奖励 ', t.linkGameId)
        var n = {
          type: 3,
          content: this.boxReward.content
        }
        window.popUp.getComponent('Pop').addPopByName('Prop', [n], true)
        break
      case 'Message_reward.SCResLinkRewardFetchedInfoMessage':
        console.log('lc cpa -- 已经领取信息 ', t.linkGameIds), this.callback.success(t.linkGameIds)
    }
  },
  receiveCPAReward: function (e, t, n) {
    const i = this
    if ((e = parseInt(e)) == 5) this.getBoxGameReward(t)
    else {
      if (e == 1) {
        const o = t
        facade.getComponent('GameModel').requestUpGradeACar(o, 1)
        window.facade.getComponent('RewardBoxModel').carId = 0
        console.log('lc cpa-- 开箱子', e, t)
      } else e == 2 ? (window.facade.getComponent('RewardOnlineModel').requestOpenEgg(1), console.log('lc cpa-- 开箱子', e, t)) : e == 3 ? window.facade.getComponent('RewardSubsidyModel').freeMoneyFetch(1) : e == 4 && cc.systemEvent.emit(ModuleEventEnum.CAN_FREE_BUY_CAR, t)
      window.facade.getComponent('RewardCPAModel').getBoxGameRewardInfo({
        success: function (e) {
          for (var t = false, o = 0; o < e.length; o++) {
            if (e[o] == n) {
              t = true
              break
            }
          } t == 0
            ? setTimeout(function () {
              i.getBoxGameReward(n), console.log('lc cpa 盒子中 没有领取过')
            }, 100)
            : console.log('lc cpa 盒子中 已经领取过')
        }
      })
    }
    this.removeCPAReward()
  },
  saveCPAReward: function (e, t, n) {
    cc.sys.localStorage.setItem('cpaGame', n)
    cc.sys.localStorage.setItem('cpaTime', this.clientTimeStamp())
    cc.sys.localStorage.setItem('cpaType', e)
    t != null && cc.sys.localStorage.setItem('cpaContent', t)
    console.log('lc cpa-- 保存奖励', e, t)
  },
  getCPAReward: function () {
    const e = cc.sys.localStorage.getItem('cpaGame')
    const t = cc.sys.localStorage.getItem('cpaTime')
    const n = cc.sys.localStorage.getItem('cpaType')
    const i = cc.sys.localStorage.getItem('cpaContent');
    (console.log('lc cpa-- 获取奖励', t, n, i), t && t != '') ? (console.log('lc cpa 有奖励'), this.clientTimeStamp() - t < 1e3 * (n != 5 ? this.cpaGameTime : this.boxGameTime) ? (console.log('lc cpa 没有达到时间要求'), this.removeCPAReward()) : (console.log('lc cpa 达到时间要求, 领取奖励'), this.receiveCPAReward(n, i, e))) : (console.log('lc cpa 没有奖励'), this.removeCPAReward())
  },
  getBoxGameRewardInfo: function (e) {
    this.callback = e
    console.log('lc cpa 查询盒子奖励')
  },
  getBoxGameReward: function (e) {
    console.log('lc cpa 领取盒子奖励')
  },
  removeCPAReward: function () {
    cc.sys.localStorage.removeItem('cpaGame')
    cc.sys.localStorage.removeItem('cpaTime')
    cc.sys.localStorage.removeItem('cpaType')
    cc.sys.localStorage.removeItem('cpaContent')
    console.log('lc cap 移除奖励')
  },
  clientTimeStamp: function () {
    return (new Date()).getTime()
  }
}, 'clientTimeStamp', function () {
  return (new Date()).getTime()
}),

o(i, 'requestCPAGame', function (e) {
  const t = window.facade.httpServerAdress + window.net.RecommendGame
  const n = {
    game_id: window.facade.GameId,
    token: window.facade.getComponent('PlayerModel').token
  }
  const i = this
  Network.postReq(t, n, {
    success: function (t) {
      const n = i.setupRecommendList(t.recommend_info)
      e.success(n)
    },
    failure: function (t) {
      e.success(null)
    }
  })
}),

o(i, 'setupRecommendList', function (e) {
  for (var t = [], n = 0; n < e.length; n++) {
    const i = e[n]
    parseInt(i.group) == 5 && t.push(i)
  }
  t = t.sort(function (e, t) {
    return parseInt(e.weight) < parseInt(t.weight) ? 1 : parseInt(e.weight) > parseInt(t.weight) ? -1 : 0
  })
  for (var o = [], a = [], s = 0; s < t.length; s++) {
    const c = t[s]
    parseInt(c.navout_cnt) <= 0 ? o.push(c) : a.push(c)
  }
  if (console.log('lc cpa recommendList =', o, a), o.length > 0) {
    var r = parseInt(Math.random() * o.length)
    return console.log('lc cpa random showParams = ', r, o.length), o[r]
  }
  r = parseInt(Math.random() * a.length)
  return console.log('lc cpa random clickParams = ', r, a.length), a[r]
}),

o(i, 'initConfig', function () {
  this.globalDB = cc.loader.getRes('config/GlobalDB')
  for (const e in this.globalDB) {
    if (e == '47104') {
      const t = this.globalDB[e].value.split('|')
      this.headOrderIds = t[0].split(':')[1].split(',')
      this.loopOrderIds = t[0].split(':')[1].split(',')
    }
    if (e == '47201' && (this.maxCarTerm = parseInt(this.globalDB[e].value), console.log('lc cpa-- maxCarTerm = ', this.maxCarTerm)), e == '47202' && (this.cpaGameTime = parseInt(this.globalDB[e].value), console.log('lc cpa-- cpaGameTime = ', this.cpaGameTime)), e == '47203' && (this.resourceMarkup = parseInt(this.globalDB[e].value), console.log('lc cpa-- resourceMarkup = ', this.resourceMarkup)), e == '47204' && (this.carMarkup = parseInt(this.globalDB[e].value), console.log('lc cpa-- carMarkup = ', this.carMarkup)), e == '47301') {
      const n = this.globalDB[e].value
      this.boxReward = {}
      this.boxReward.type = n.split(':')[0]
      this.boxReward.content = n.split(':')[1]
      console.log('lc cpa-- boxReward = ', this.boxReward)
    }
    e == '47302' && (this.boxGameTime = parseInt(this.globalDB[e].value), console.log('lc cpa-- boxGameTime = ', this.boxGameTime))
  }
}), i))
