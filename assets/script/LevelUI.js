const ModuleEventEnum = require('ModuleEventEnum')
const o = require('AnalyticsUtilities').AnalyticsUtilities

cc.Class({
  extends: cc.Component,
  properties: {
    bulletsBox: cc.Node,
    result: cc.Node,
    skipBtn: cc.Node,
    retryBtn: cc.Node,
    skipPanel: cc.Node,
    cashLabel: cc.Node,
    backBtn: cc.Node,
    replayUI: cc.Node
  },
  onLoad: function () {
    cc.systemEvent.on(ModuleEventEnum.BULLET_SHOTED, this.bulletShoted, this)
    cc.systemEvent.on(ModuleEventEnum.BULLET_USED, this.bulletUsed, this)
    cc.systemEvent.on(ModuleEventEnum.LEVEL_PASSED, this.onLevelPassed, this)
    cc.systemEvent.on(ModuleEventEnum.FAILURE_BUY_KILL, this.onFailureKill, this)
    cc.systemEvent.on(ModuleEventEnum.GUIDE_CLOSED, this.onGuideClosed, this)
    cc.systemEvent.on(ModuleEventEnum.STAR_JUMP_CHANGE, this.getThreeStarOrJumpResult, this)
  },
  onEnable: function () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e4
  },
  init: function () {
    (this.passed = false, this.failed = false, this.replayUI.active = false, console.log('levelUI init...'), window.facade.getComponent('LevelModel').isNewLevel() && !facade.SAVE_MODE) ? this.skipBtn.active = true : (this.skipBtn.active = false, window.facade.getComponent('LevelModel').getLevelStar(facade.selectedLevelType + '_' + window.facade.getComponent('LevelModel').playingLevel) < 3 && popUp.getComponent('Pop').addPopByName('GetTreeStarView', 1, true, true, false))
    window.facade.getComponent('BannerModel').hideBanner()
    window.facade.getComponent('GameModel').levelRetryTouch ? window.facade.getComponent('GameModel').levelRetryTouch = false : window.facade.getComponent('GameModel').loseEnergy()
    this.retryBtn.active = true
    this.bulletsBox.active = true
    this.result.active = false
    this.skipPanel.active = false
    this.backBtn.active = true
    this.config = window.facade.getComponent('LevelModel').playingLevelConfig
    this.bulletsBox.removeAllChildren()
    this.lastBullets = window.facade.getComponent('LevelModel').lastBullets
    this.bestScoreLimit = window.facade.getComponent('LevelModel').starNeeds[0]
    for (let e = 0; e < this.lastBullets; e++) {
      const t = new cc.Node()
      this.bulletsBox.addChild(t)
      this.lastBullets - e <= this.bestScoreLimit ? t.addComponent(cc.Sprite).spriteFrame = cc.loader.getRes('uis', cc.SpriteAtlas).getSpriteFrame('bullet_light') : t.addComponent(cc.Sprite).spriteFrame = cc.loader.getRes('uis', cc.SpriteAtlas).getSpriteFrame('bullet_dark')
    }
    window.audio.getComponent('SoundManager').playEffect('begin_' + (1 + Math.floor(3 * Math.random())), false, 50), this.checkGuide()
  },
  onGuideClosed: function () {
    if (facade.selectedLevelType == 'classic') {
      this.finger = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').getChildByName('finger')
      this.finger.active = true
      const e = cc.rotateTo(0.8, -30)
      const t = cc.rotateTo(0.8, 0)
      e.easing(cc.easeSineOut())
      t.easing(cc.easeSineIn())
      this.finger.runAction(cc.sequence(cc.repeat(cc.sequence(e, t), 3), cc.fadeOut(0.5)))
    }
  },
  checkGuide: function () {
    window.facade.getComponent('LevelModel').playingLevel > 1 || window.facade.getComponent('LevelModel').isNewLevel() && popUp.getComponent('Pop').addPopByName('Guide' + facade.selectedLevelType, null, true, true)
  },
  bulletShoted: function () {
    const e = this.bulletsBox.getChildren()
    e.length <= 0 ? window.audio.getComponent('SoundManager').playEffect('empty') : e[e.length - 1].removeFromParent()
  },
  bulletUsed: function () {
    if (this.bulletsBox.getChildren().length <= 0) {
      if (this.passed) return
      this.failure()
    }
  },
  isBulletFlying: function () {
    for (let e = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').getChildren(), t = 0; t < e.length; t++) { if (e[t].name.match('bullet')) return true }
    return false
  },
  backMain: function () {
    this.isBulletFlying() && !this.result.active || (cc.systemEvent.emit(ModuleEventEnum.BACK_MAIN), o.logEvent('左上角返回这界面按钮'))
  },
  retryLabelHandler: function () {
    this.replayUI.active = true
  },
  retry: function () {
    window.facade.getComponent('LevelModel').resetLevel()
    this.result.active = false
    cc.systemEvent.emit(ModuleEventEnum.RELOAD_LEVEL)
  },
  retryCostEnergy: function () {
    const e = facade.getComponent('LevelModel').costEnergy
    facade.getComponent('GameModel').energy < e ? cc.systemEvent.emit(ModuleEventEnum.ENERGY_NEEDED) : (facade.getComponent('GameModel').loseEnergy(), window.facade.getComponent('LevelModel').resetLevel(), this.result.active = false, cc.systemEvent.emit(ModuleEventEnum.RELOAD_LEVEL))
  },
  onFailureKill: function () {
    this.node.stopAllActions(), this.failure(true)
  },
  failure: function (e) {
    cc.director.getScene().getChildByName('Canvas').getComponent('GameLogic').hasPassed && !e || this.failed || (window.audio.getComponent('SoundManager').playEffect('lose'), cc.systemEvent.emit(ModuleEventEnum.FAILURE), window.facade.getComponent('LevelModel').resultLevel = window.facade.getComponent('LevelModel').playingLevel, this.failed = true, e ? this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(this.showResult2, this))) : this.showResult(false))
  },
  onLevelPassed: function (e) {
    this.node.stopAllActions()
    this.passed = true
    this.skipBtn.active = false
    this.retryBtn.active = false
    this.bulletsBox.active = false
    this.backBtn.active = false
    window.facade.getComponent('LevelModel').resultLevel = window.facade.getComponent('LevelModel').playingLevel
    e ? this.showResult() : this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(this.showResult, this)))
  },
  showResult2: function () {
    this.showResult(false)
  },
  showResult: function (e) {
    this.backBtn.active = true
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1
    window.facade.getComponent('LevelModel').resultLevel == window.facade.getComponent('LevelModel').playingLevel && (e != 0 && (e = true), this.result.active = true, this.result.getComponent('ResultPanel').init(e))
  },
  getThreeStarOrJumpResult: function (e) {
    e != 2 && (this.backBtn.active = true, cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1, this.result.active = true, this.result.getComponent('ResultPanel').take3StarGet())
  },
  showSkip: function () {
    this.skipBtn.active = false
    this.retryBtn.active = false
    this.skipPanel.active = true
    this.skipPanel.opacity = 0
    this.skipPanel.runAction(cc.fadeIn(0.2)), this.skipPanel.getComponent('SkipPanel').init()
  },
  hideSkip: function () {
    this.skipBtn.active = true
    this.retryBtn.active = true
    this.skipPanel.active = false
    this.bulletsBox.getChildren().length <= 0 && this.retry()
  },
  update: function (e) {
    this.align()
  },
  align: function () {
    if (!this.reAligned) {
      const e = this.node.getChildren()
      if (window.facade.Screenratio && window.facade.Screenratio < 0.47) {
        for (let t = 0; t < e.length; t++) e[t].name != 'resultPanel' && e[t].name != 'skipPanel' && e[t].getComponent(cc.Widget) && (e[t].getComponent(cc.Widget).top += 50, e[t].getComponent(cc.Widget).updateAlignment())
        this.reAligned = true
      }
    }
  },
  postRequest: function (e, t, n) {
    const i = new XMLHttpRequest()
    i.onreadystatechange = function (e) {
      if (i.readyState == 4 && i.status >= 200 && i.status < 300) {
        const t = JSON.parse(i.responseText)
        t.code != 0 ? n && n.failure && n.failure(t.code) : n && n.success && n.success(t.data)
      }
    }
    i.onerror = function (e) {
      n && n.failure && n.failure(e)
    }
    i.open('POST', e, false)
    i.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    i.send(t)
  }
})
