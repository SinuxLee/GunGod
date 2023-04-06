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

  onLoad () {
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

    for (const platform in this.platformList) {
      const arr = this.platformList[platform].split(',')
      const name = arr[0]
      if (window['' + name] != null) {
        window.net.platformName = name
        window.net.checkName = arr[1]
        console.log('当前平台： ', window.net.platformName)
        break
      }
    }

    cc.view.enableRetina(true)
    cc.view.enableAntiAlias(false)

    cc.game.addPersistRootNode(this.facade)
    cc.game.addPersistRootNode(this.soundInstance)
    cc.game.addPersistRootNode(this.net)
    cc.game.addPersistRootNode(this.popUp)
    cc.game.addPersistRootNode(this.texturemanager)

    window.pool = require('Pool')
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

  doStart () {
    cc.director.setClearColor((new cc.Color()).fromHEX('#758F89'))
    this.initModules()

    this.node.runAction(cc.sequence(cc.fadeOut(0.05), cc.callFunc(this.gogame.bind(this))))
  },

  gogame () {
    const t = require('ModuleEventEnum')
    cc.systemEvent.emit(t.GO_GAME)
  },

  initModules () {
    window.facade.modules = {}
    const config = require('MConfig')
    for (const item in config) {
      const name = config[item].key
      const module = require(name)
      module.init()
      window.facade.modules[name] = module
    }
  }
})
