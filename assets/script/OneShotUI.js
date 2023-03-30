const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {
    result: cc.Node,
    levelLabel: cc.Label,
    backBtn: cc.Node,
    cupLabel: cc.Node
  },
  onLoad: function () {
    cc.systemEvent.on(ModuleEventEnum.BULLET_SHOTED, this.bulletShoted, this)
    cc.systemEvent.on(ModuleEventEnum.LEVEL_SHOT_BULLET_USE, this.bulletUsed, this)
    cc.systemEvent.on(ModuleEventEnum.LEVEL_SHOT_PASSED, this.onLevelShotPassed, this)
    cc.systemEvent.on(ModuleEventEnum.SHOT_NOW_OVER_SHOW, this.levelShotShowTotal, this)
  },
  start: function () {
    this.init(), cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e3
  },
  init: function () {
    this.passed = false
    this.failed = false
    console.log('levelUI init...')
    this.result.active = false
    this.cupLabel.getComponent('TextureLabel').setText(String(window.facade.getComponent('GameModel').cupNumData))
    this.levelLabel.string = '第' + window.facade.getComponent('GameModel').oneShotLevel + '关'
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
    window.audio.getComponent('SoundManager').playEffect('empty')
  },
  bulletUsed: function () {
    if (window.facade.getComponent('LevelModel').lastBullets <= 0) {
      if (this.passed) return
      this.failure()
    }
  },
  isBulletFlying: function () {
    const e = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').getChildren()
    for (let t = 0; t < e.length; t++) {
      if (e[t].name.match('bullet')) return true
    }
    return false
  },
  backMain: function () {
    this.isBulletFlying() || cc.systemEvent.emit(ModuleEventEnum.BACK_MAIN)
  },
  retry: function () {
    window.facade.getComponent('LevelModel').resetLevel()
    cc.systemEvent.emit(ModuleEventEnum.RELOAD_LEVEL)
  },
  onFailureKill: function () {
    this.node.stopAllActions()
    this.failure(true)
  },
  failure: function (e) {
    cc.director.getScene().getChildByName('Canvas').getComponent('GameLogic').hasPassed && !e || this.failed || (window.facade.getComponent('GameModel').oneShotLevel != 20 ? (cc.systemEvent.emit(ModuleEventEnum.FAILURE), window.facade.getComponent('LevelModel').resultLevel = window.facade.getComponent('LevelModel').playingLevel, this.failed = true, this.showResult(false)) : this.levelShotShowTotal())
  },
  onLevelShotPassed: function (e) {
    this.node.stopAllActions(), this.passed = true
    popUp.getComponent('FloatTip').showTip('挑战胜利')
  },
  levelShotShowTotal: function () {
    this.showResult(true)
  },
  showResult: function (e) {
    this.backBtn.active = true
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1
    e != 0 && (e = true)
    this.result.active = true
    this.result.getComponent('ResultShotOne').init(e)
  },
  getThreeStarOrJumpResult: function (e) {
    if (e != 2) {
      this.backBtn.active = true
      cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1
      this.result.active = true
      this.result.getComponent('ResultPanel').take3StarGet()
    }
  },
  showSkip: function () {
    this.skipBtn.active = false
    this.retryBtn.active = false
    this.skipPanel.active = true
    this.skipPanel.opacity = 0
    this.skipPanel.runAction(cc.fadeIn(0.2))
    this.skipPanel.getComponent('SkipPanel').init()
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
  }
})
