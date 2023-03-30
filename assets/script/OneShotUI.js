const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {
    result: cc.Node,
    levelLabel: cc.Label,
    backBtn: cc.Node,
    cupLabel: cc.Node
  },
  onLoad: function () {
    cc.systemEvent.on(i.BULLET_SHOTED, this.bulletShoted, this), cc.systemEvent.on(i.LEVEL_SHOT_BULLET_USE, this.bulletUsed, this), cc.systemEvent.on(i.LEVEL_SHOT_PASSED, this.onLevelShotPassed, this), cc.systemEvent.on(i.SHOT_NOW_OVER_SHOW, this.levelShotShowTotal, this)
  },
  start: function () {
    this.init(), cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e3
  },
  init: function () {
    this.passed = !1, this.failed = !1, console.log('levelUI init...'), this.result.active = !1, this.cupLabel.getComponent('TextureLabel').setText(String(window.facade.getComponent('GameModel').cupNumData)), this.levelLabel.string = '第' + window.facade.getComponent('GameModel').oneShotLevel + '关'
  },
  onGuideClosed: function () {
    if (facade.selectedLevelType == 'classic') {
      this.finger = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').getChildByName('finger'), this.finger.active = !0
      const e = cc.rotateTo(0.8, -30)
      const t = cc.rotateTo(0.8, 0)
      e.easing(cc.easeSineOut()), t.easing(cc.easeSineIn()), this.finger.runAction(cc.sequence(cc.repeat(cc.sequence(e, t), 3), cc.fadeOut(0.5)))
    }
  },
  checkGuide: function () {
    window.facade.getComponent('LevelModel').playingLevel > 1 || window.facade.getComponent('LevelModel').isNewLevel() && popUp.getComponent('Pop').addPopByName('Guide' + facade.selectedLevelType, null, !0, !0)
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
    for (let e = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').getChildren(), t = 0; t < e.length; t++) { if (e[t].name.match('bullet')) return !0 }
    return !1
  },
  backMain: function () {
    this.isBulletFlying() || cc.systemEvent.emit(i.BACK_MAIN)
  },
  retry: function () {
    window.facade.getComponent('LevelModel').resetLevel(), cc.systemEvent.emit(i.RELOAD_LEVEL)
  },
  onFailureKill: function () {
    this.node.stopAllActions(), this.failure(!0)
  },
  failure: function (e) {
    cc.director.getScene().getChildByName('Canvas').getComponent('GameLogic').hasPassed && !e || this.failed || (window.facade.getComponent('GameModel').oneShotLevel != 20 ? (cc.systemEvent.emit(i.FAILURE), window.facade.getComponent('LevelModel').resultLevel = window.facade.getComponent('LevelModel').playingLevel, this.failed = !0, this.showResult(!1)) : this.levelShotShowTotal())
  },
  onLevelShotPassed: function (e) {
    this.node.stopAllActions(), this.passed = !0
    popUp.getComponent('FloatTip').showTip('挑战胜利')
  },
  levelShotShowTotal: function () {
    this.showResult(!0)
  },
  showResult: function (e) {
    this.backBtn.active = !0, cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1, e != 0 && (e = !0), this.result.active = !0, this.result.getComponent('ResultShotOne').init(e)
  },
  getThreeStarOrJumpResult: function (e) {
    e != 2 && (this.backBtn.active = !0, cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1, this.result.active = !0, this.result.getComponent('ResultPanel').take3StarGet())
  },
  showSkip: function () {
    this.skipBtn.active = !1, this.retryBtn.active = !1, this.skipPanel.active = !0, this.skipPanel.opacity = 0, this.skipPanel.runAction(cc.fadeIn(0.2)), this.skipPanel.getComponent('SkipPanel').init()
  },
  hideSkip: function () {
    this.skipBtn.active = !0, this.retryBtn.active = !0, this.skipPanel.active = !1, this.bulletsBox.getChildren().length <= 0 && this.retry()
  },
  update: function (e) {
    this.align()
  },
  align: function () {
    if (!this.reAligned) {
      const e = this.node.getChildren()
      if (window.facade.Screenratio && window.facade.Screenratio < 0.47) {
        for (let t = 0; t < e.length; t++) e[t].name != 'resultPanel' && e[t].name != 'skipPanel' && e[t].getComponent(cc.Widget) && (e[t].getComponent(cc.Widget).top += 50, e[t].getComponent(cc.Widget).updateAlignment())
        this.reAligned = !0
      }
    }
  }
})
