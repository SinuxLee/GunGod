const GameConfig = require('GameConfig')
cc.Class({
  extends: cc.Component,
  properties: {
    platformList: {
      default: [],
      type: cc.String
    },
    facade: cc.Node,
    soundInstance: cc.Node,
    net: cc.Node,
    popUp: cc.Node,
    texturemanager: cc.Node,
    guidemanager: cc.Node
  },
  onLoad: function () {
    GameConfig.PLATFORM == 'wx' && wx.showLoading({
      title: '游戏加载中',
      mask: true
    })
    cc.director.getPhysicsManager().enabled = true
    cc.director.getPhysicsManager().gravity = cc.v2(0, -300)
    window.facade = this.facade
    window.audio = this.soundInstance
    window.net = this.net
    window.textureManager = this.texturemanager
    window.popUp = this.popUp
    window.net.platformName = ''
    window.net.checkName = ''
    window.facade.isMiniGame = !(GameConfig.PLATFORM != 'wx')
    for (const t in this.platformList) {
      const n = this.platformList[t].split(',')
      const o = n[0]
      if (window['' + o] != null) {
        window.net.platformName = o
        window.net.checkName = n[1]
        console.log('当前平台： ', window.net.platformName)
        break
      }
    }
    cc.view.enableRetina(true)
    cc.view.enableAntiAlias(false)
    window.pool = require('Pool')
    cc.game.addPersistRootNode(this.facade)
    cc.game.addPersistRootNode(this.soundInstance)
    cc.game.addPersistRootNode(this.net)
    cc.game.addPersistRootNode(this.popUp)
    cc.game.addPersistRootNode(this.texturemanager)
    window.facade.addComponent('GameModel')
    window.facade.addComponent('LevelModel')
    window.facade.addComponent('PlayerModel')
    window.facade.addComponent('RecommendGameModel')
    window.facade.addComponent('RewardCPAModel')
    window.facade.addComponent('ShareADModel')
    window.facade.addComponent('BannerModel')
    window.facade.addComponent('RankModel')
    window.facade.addComponent('InterstitialADModel')
    this.doStart()
  },
  doStart: function () {
    cc.director.setClearColor((new cc.Color()).fromHEX('#758F89'))
    this.initModules()
    const e = cc.sequence(cc.fadeOut(0.05), cc.callFunc(this.gogame.bind(this)))
    this.node.runAction(e)
  },
  gogame: function () {
    const t = require('ModuleEventEnum')
    cc.systemEvent.emit(t.GO_GAME)
  },
  initModules: function () {
    window.facade.modules = {}
    const t = require('MConfig')
    for (const n in t) {
      const i = t[n].key
      const o = require(i)
      o.init()
      window.facade.modules[i] = o
    }
  }
})
