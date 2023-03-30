const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {
    cc.systemEvent.on(i.LEVEL_ADDED, this.onLevelAdded, this), cc.systemEvent.on(i.LEVEL_ONE_SHOT_ADD, this.onLevelAdded, this), cc.systemEvent.on(i.KILLED, this.onKilled, this), cc.systemEvent.on(i.SKIP, this.onSkip, this), cc.systemEvent.on(i.FAILURE, this.onFailure, this)
  },
  start: function () {},
  rich1111: function () {
    window.facade.getComponent('GameModel').gainEnergy11111()
  },
  onLevelAdded: function (e) {
    this.failure = !1, this.hasPassed = !1, this.levelData = e, this.level = e.node, this.killed = [], this.suffers = {}, this.vips = {}
    for (let t = this.level.getChildren(), n = 0; n < t.length; n++) t[n].name.match('suffer') ? this.suffers[t[n].name] = !1 : t[n].name.match('vip') ? this.vips[t[n].name] = !1 : t[n].name.match('role') && e.levelType == 'injury' && (this.vips[t[n].name] = !1)
  },
  onKilled: function (e) {
    if (!(this.failure || window.facade.getComponent('LevelModel').lastBullets < 0 || this.suffers[e] == 1 || this.vips[e] == 1)) {
      if (window.audio.getComponent('SoundManager').playEffect('kill'), this.vips[e] != null) return this.vips[e] = !0, cc.systemEvent.emit(i.FAILURE_BUY_KILL), void (this.levelData.isDebug && window.popUp.getComponent('FloatTip').showTip('测试信息：失败了'))
      for (const t in this.suffers[e] != null && (this.suffers[e] = !0), this.suffers) { if (this.suffers[t] == 0) return }
      this.passed()
    }
  },
  onSkip: function () {
    window.facade.getComponent('LevelModel').shotedBullets = 99999, this.passed(!0)
  },
  passed: function (e) {
    if (!e) {
      if (this.failure) return
      if (this.waitingForPass) return
      if (this.levelData.levelType == 'vip' || this.levelData.levelType == 'injury') {
        for (let t = this.level.getChildren(), n = 0; n < t.length; n++) { if (t[n].name.match('bullet')) return void (this.waitingForPass = !0) }
      }
    }
    this.hasPassed || (this.hasPassed = !0, window.facade.getComponent('LevelModel').oneShotLevel ? cc.systemEvent.emit(i.LEVEL_SHOT_PASSED, e) : cc.systemEvent.emit(i.LEVEL_PASSED, e), this.levelData.isDebug && window.popUp.getComponent('FloatTip').showTip('测试信息：过关了'), this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
      window.audio.getComponent('SoundManager').playEffect('whisper')
    }))))
  },
  onFailure: function () {
    this.failure = !0
  },
  update: function (e) {
    if (this.waitingForPass) {
      for (let t = this.level.getChildren(), n = 0; n < t.length; n++) { if (t[n].name.match('bullet')) return }
      this.waitingForPass = !1, this.passed()
    }
  }
})
