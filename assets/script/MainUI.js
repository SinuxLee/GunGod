const i = require('ModuleEventEnum')
const o = require('AnalyticsUtilities').AnalyticsUtilities
cc.Class({
  extends: cc.Component,
  properties: {
    mainUI: cc.Node,
    cashLabel: cc.Node,
    moreGameBtn: cc.Node,
    bottomBar: cc.Node,
    buttonClassic: cc.Node,
    characterShow: cc.Node,
    soundButton: cc.Node,
    cashBar: cc.Node,
    energyBar: cc.Node,
    titleLogo: cc.Node,
    recommendBar: cc.Node,
    totalStar: cc.Node,
    btnNextGift: cc.Node,
    btnContent: cc.Node,
    moreGame: cc.Node
  },
  onLoad: function () {
    cc.systemEvent.on(i.INIT_ROLEINFO_COMPLETED, this.initUI, this), cc.systemEvent.on(i.WX_REGISTERED, this.onGameEntered, this), cc.systemEvent.on(i.FUNCOPEN_UPDATE, this.onFuncOpen.bind(this)), cc.systemEvent.on(i.LEVEL_SELECT, this.onGoLevelSelected, this), cc.systemEvent.on(i.LEVEL_ADDED, this.onGoLevel, this), cc.systemEvent.on(i.LEVEL_ONE_SHOT_ADD, this.onShotGoLevel, this), cc.systemEvent.on(i.BACK_MAIN, this.onBackMain, this), cc.systemEvent.on(i.SAVE_MODE_CHANGE, this.onSaveModeChange, this), this.btnNextGift.active = !1
  },
  start: function () {
    window.facade.isMiniGame = window.net.platformName != '', facade.isMiniGame && (window.wx = window[window.net.platformName], wx.hideLoading()), o.logEvent('进入游戏主界面'), window.audio.getComponent('SoundManager').setBGM('Bgm'), this.moreGameBtn.active = !facade.SAVE_MODE, this.recommendBar.active = !facade.SAVE_MODE, this.soundButton.zIndex = 100, this.cashBar.zIndex = 100, this.energyBar.zIndex = 100, facade.needShowSign && this.initUI()
  },
  initUI: function () {
    this.btnNextGift.active = !window.facade.getComponent('GameModel').gotNextReward
    let e = facade.getComponent('GameModel').lastFetchSignInTime;
    (e = e == null ? 0 : Math.floor(e / 864e5)) < Math.floor(facade.getComponent('GameModel').getLocalTime() / 86400 / 1e3) && !popUp.getComponent('Pop').getPopByName('BackEnergyView') && popUp.getComponent('Pop').addPopByName('SignIn', null, !0)
  },
  onFuncOpen: function () {
    facade.getComponent('PlayerModel').isLoginInterOpen() && facade.getComponent('InterstitialADModel').showFakeInterAD()
  },
  onGameEntered: function () {
    facade.isMiniGame && window.facade.getComponent('PlayerModel').wxAdaptor.wxGetUserInfo()
  },
  onClickEarnRes: function (e, t) {
    popUp.getComponent('Pop').addPopByName('EntranceUI', t, !0)
  },
  onClickCollect: function () {
    window.wx && popUp.getComponent('Pop').addPopByName('CollectGift', null, !0, !0)
  },
  update: function (e) {
    this.totalStar.getComponent('TextureLabel').setText(String(window.facade.getComponent('LevelModel').getTotalStar())), this.cashLabel.getComponent('TextureLabel').setText(String(window.facade.getComponent('GameModel').cash)), this.align(), this.checkAddEnergy(), this.updateCharater()
  },
  align: function () {
    if (!this.reAligned) {
      const e = this.node.getChildren()
      if (window.facade.Screenratio && window.facade.Screenratio < 0.47) {
        for (let t = 0; t < e.length; t++) e[t].getComponent(cc.Widget) && (e[t].getComponent(cc.Widget).top += 50, e[t].getComponent(cc.Widget).updateAlignment())
        this.reAligned = !0
      }
    }
  },
  checkAddEnergy: function () {
    facade.SAVE_MODE || window.facade.getComponent('GameModel')._offLineEnergy && window.facade.getComponent('GameModel')._offLineEnergy != 0 && (popUp.getComponent('Pop').addPopByName('BackEnergyView', window.facade.getComponent('GameModel')._offLineEnergy, !0, !1), window.facade.getComponent('GameModel')._offLineEnergy = 0)
  },
  updateCharater: function () {
    cc.loader.getRes('roles', cc.SpriteAtlas) && (facade.getComponent('GameModel').charaterConfig[String(facade.getComponent('GameModel').characterId)] || facade.getComponent('GameModel').onRoleSelected(1), this.characterShow.getChildByName('role').getComponent(cc.Sprite).spriteFrame = cc.loader.getRes('roles', cc.SpriteAtlas).getSpriteFrame('MrBullet_Role_Body_0' + facade.getComponent('GameModel').characterId), this.characterShow.getChildByName('role').getChildByName('hand').getComponent(cc.Sprite).spriteFrame = cc.loader.getRes('roles', cc.SpriteAtlas).getSpriteFrame('MrBullet_Role_AimArm_0' + facade.getComponent('GameModel').characterId))
  },
  onGoLevelSelected: function (e) {
    if (this.inUILoading != 1) {
      if (this.bottomBar.active = !1, this.moreGameBtn.active = !1, this.btnContent.active = this.moreGameBtn.active, this.buttonClassic.active = !1, this.characterShow.active = !1, this.mainUI.active = !0, this.selectPanel) this.selectPanel.active = !0
      else {
        if (this._selectPanelPre = cc.loader.getRes('ui/levelSelects', cc.Prefab), this._selectPanelPre) return this.selectPanel = cc.instantiate(this._selectPanelPre), this.selectPanel.name = 'selectPanel', this.mainUI.addChild(this.selectPanel), void (this.mainUI.active = !0)
        this.inUILoading = !0, cc.loader.loadRes('ui/levelSelects', cc.Prefab, this.onSelectLoaded.bind(this))
      }
    }
  },
  onGoLevel: function () {
    this.selectPanel && (this.selectPanel.active = !1, this.mainUI.active = !1, this.addLevelUI()), this.recommendBar.zIndex = 1e4
  },
  onShotGoLevel: function () {
    this.mainUI.active = !1, this.addShotLevelUI(), this.recommendBar.zIndex = 1e3
  },
  onSaveModeChange: function () {
    this.moreGameBtn.active = !facade.SAVE_MODE
  },
  onSelectLoaded: function (e, t) {
    this.inUILoading = !1, console.log('onSelectLoaded...', t), this._selectPanelPre = t, this.selectPanel = cc.instantiate(this._selectPanelPre), this.selectPanel.name = 'selectPanel', this.mainUI.active = !0, this.mainUI.addChild(this.selectPanel)
  },
  onGoSkin: function () {
    if (this.inUILoading != 1) {
      if (this.mainUI.active = !0, this.skinPanel) return this.skinPanel.active = !0, this.bottomBar.active = !1, this.moreGameBtn.active = !1, this.btnContent.active = this.moreGameBtn.active, this.buttonClassic.active = !1, this.characterShow.active = !1, this.titleLogo.stopAllActions(), void this.titleLogo.runAction(cc.fadeOut(0.3))
      if (this._skinPanelPre = cc.loader.getRes('ui/skinSelects', cc.Prefab), this._skinPanelPre) return this.skinPanel = cc.instantiate(this._skinPanelPre), this.skinPanel.name = 'skinPanel', this.mainUI.addChild(this.skinPanel), this.bottomBar.active = !1, this.moreGameBtn.active = !1, this.btnContent.active = this.moreGameBtn.active, this.buttonClassic.active = !1, this.characterShow.active = !1, this.titleLogo.stopAllActions(), void this.titleLogo.runAction(cc.fadeOut(0.3))
      this.inUILoading = !0, cc.loader.loadRes('ui/skinSelects', cc.Prefab, this.onSkinLoaded.bind(this))
    }
  },
  onSkinLoaded: function (e, t) {
    this.inUILoading = !1, console.log('onSkinLoaded...', t), this._skinPanelPre = t, this.skinPanel = cc.instantiate(this._skinPanelPre), this.skinPanel.name = 'skinPanel', this.mainUI.active = !0, this.mainUI.addChild(this.skinPanel), this.bottomBar.active = !1, this.moreGameBtn.active = !1, this.btnContent.active = this.moreGameBtn.active, this.buttonClassic.active = !1, this.characterShow.active = !1, this.titleLogo.stopAllActions(), this.titleLogo.runAction(cc.fadeOut(0.3))
  },
  onClickBanner: function () {
    const t = require('VirBannerCtrl')
    facade.getComponent('RewardCPAModel').navigateToGame(t.gameInfo, {
      success: function () {
        t.hideVirBanner()
      },
      failure: function (e) {
        console.log('跳转失败: ', e)
      }
    }, !1)
  },
  addShotLevelUI: function () {
    return this.levelShotUI ? (this.levelShotUI.active = !0, this.levelShotUI.zIndex = this.node.getChildByName('levelPlay').zIndex + 1, void this.levelShotUI.getComponent('OneShotUI').init()) : (this.bottomBar.active = !1, this.moreGameBtn.active = !1, this.btnContent.active = this.moreGameBtn.active, this.buttonClassic.active = !1, this.characterShow.active = !1, this._levelShotUIPre = cc.loader.getRes('ui/OneShotUI', cc.Prefab), this._levelShotUIPre ? (this.levelShotUI = cc.instantiate(this._levelShotUIPre), this.levelShotUI.name = 'levelShotUI', this.node.addChild(this.levelShotUI), void (this.levelShotUI.zIndex = this.node.getChildByName('levelPlay').zIndex + 1)) : void cc.loader.loadRes('ui/OneShotUI', cc.Prefab, this.onLevelShotUILoaded.bind(this)))
  },
  onLevelShotUILoaded: function (e, t) {
    console.log('onLevelshotUILoaded...'), this._levelShotUIPre = t, this.levelShotUI = cc.instantiate(this._levelShotUIPre), this.levelShotUI.name = 'levelShotUI', this.node.addChild(this.levelShotUI), this.levelShotUI.zIndex = this.node.getChildByName('levelPlay').zIndex + 1
  },
  addLevelUI: function () {
    return this.levelUI ? (this.levelUI.active = !0, this.levelUI.zIndex = this.node.getChildByName('levelPlay').zIndex + 1, void this.levelUI.getComponent('LevelUI').init()) : (this.bottomBar.active = !1, this.moreGameBtn.active = !1, this.btnContent.active = this.moreGameBtn.active, this.buttonClassic.active = !1, this.characterShow.active = !1, this._levelUIPre = cc.loader.getRes('ui/levelUI', cc.Prefab), this._levelUIPre ? (this.levelUI = cc.instantiate(this._levelUIPre), this.levelUI.name = 'levelUI', this.node.addChild(this.levelUI), this.levelUI.getComponent('LevelUI').init(), void (this.levelUI.zIndex = this.node.getChildByName('levelPlay').zIndex + 1)) : void cc.loader.loadRes('ui/levelUI', cc.Prefab, this.onLevelUILoaded.bind(this)))
  },
  onLevelUILoaded: function (e, t) {
    console.log('onLevelUILoaded...'), this._levelUIPre = t, this.levelUI = cc.instantiate(this._levelUIPre), this.levelUI.name = 'levelUI', this.node.addChild(this.levelUI), this.levelUI.getComponent('LevelUI').init(), this.levelUI.zIndex = this.node.getChildByName('levelPlay').zIndex + 1
  },
  onBackMain: function () {
    this.levelShotUI ? this.levelShotUI.active ? (this.levelShotUI.active = !1, window.facade.getComponent('LevelModel').oneShotLevel = !1) : this.levelUI.active && (this.levelUI.active = !1) : this.levelUI.active = !1, this.node.getChildByName('levelPlay').removeFromParent(), window.facade.getComponent('BannerModel').hideBanner(), this.mainUI.active = !0, this.bottomBar.active = !0, this.moreGameBtn.active = !0, this.moreGameBtn.active = !facade.SAVE_MODE, this.btnContent.active = this.moreGameBtn.active, this.buttonClassic.active = !0, this.characterShow.active = !0, this.titleLogo.stopAllActions(), this.titleLogo.runAction(cc.fadeIn(0.3)), window.audio.getComponent('SoundManager').resumeBGM(), this.recommendBar.zIndex = 1
    this.moreGame.getComponent('MoreGame').openHandler()
  },
  onShowMore: function () {
    window.popUp.getComponent('Pop').addPopByName('MoreGame', this, !0, !0, !1)
  },
  onShowRank: function () {
    window.popUp.getComponent('Pop').addPopByName('Rank', this, !0, !1, !1)
  },
  onShowNext: function () {
    window.popUp.getComponent('Pop').addPopByName('NextLoginView', null, !0, !0)
  },
  hideSelectPanel: function () {
    this.selectPanel.active = !1, this.bottomBar.active = !0, this.moreGameBtn.active = !0, this.moreGameBtn.active = !facade.SAVE_MODE, this.btnContent.active = this.moreGameBtn.active, this.buttonClassic.active = !0, this.characterShow.active = !0
  },
  hideSkinPanel: function () {
    this.skinPanel.active = !1, this.bottomBar.active = !0, this.moreGameBtn.active = !0, this.moreGameBtn.active = !facade.SAVE_MODE, this.btnContent.active = this.moreGameBtn.active, this.buttonClassic.active = !0, this.characterShow.active = !0, this.titleLogo.stopAllActions(), this.titleLogo.runAction(cc.fadeIn(0.3))
  },
  onGotLoginInfo: function () {}
})
