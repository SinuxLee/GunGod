const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,

  onLoad: function () {
    cc.systemEvent.on(ModuleEventEnum.LEVEL_ADDED, this.onLevelAdded, this)
    cc.systemEvent.on(ModuleEventEnum.LEVEL_ONE_SHOT_ADD, this.onLevelAdded, this)
    cc.systemEvent.on(ModuleEventEnum.KILLED, this.onKilled, this)
    cc.systemEvent.on(ModuleEventEnum.SKIP, this.onSkip, this)
    cc.systemEvent.on(ModuleEventEnum.FAILURE, this.onFailure, this)
  },

  rich1111: function () {
    window.facade.getComponent('GameModel').gainEnergy11111()
  },

  onLevelAdded: function (e) {
    this.failure = false
    this.hasPassed = false
    this.levelData = e
    this.level = e.node
    this.killed = []
    this.suffers = {}
    this.vips = {}
    for (let t = this.level.getChildren(), n = 0; n < t.length; n++) t[n].name.match('suffer') ? this.suffers[t[n].name] = false : t[n].name.match('vip') ? this.vips[t[n].name] = false : t[n].name.match('role') && e.levelType == 'injury' && (this.vips[t[n].name] = false)
  },

  onKilled: function (e) {
    if (!(this.failure || window.facade.getComponent('LevelModel').lastBullets < 0 || this.suffers[e] == 1 || this.vips[e] == 1)) {
      window.audio.getComponent('SoundManager').playEffect('kill')
      if (this.vips[e] != null) return this.vips[e] = true, cc.systemEvent.emit(ModuleEventEnum.FAILURE_BUY_KILL), void (this.levelData.isDebug && window.popUp.getComponent('FloatTip').showTip('测试信息：失败了'))
      for (const t in this.suffers[e] != null && (this.suffers[e] = true), this.suffers) { if (this.suffers[t] == 0) return }
      this.passed()
    }
  },

  onSkip: function () {
    window.facade.getComponent('LevelModel').shotedBullets = 99999
    this.passed(true)
  },

  passed: function (e) {
    if (!e) {
      if (this.failure) return
      if (this.waitingForPass) return
      if (this.levelData.levelType == 'vip' || this.levelData.levelType == 'injury') {
        for (let t = this.level.getChildren(), n = 0; n < t.length; n++) { if (t[n].name.match('bullet')) return void (this.waitingForPass = true) }
      }
    }
    this.hasPassed || (this.hasPassed = true, window.facade.getComponent('LevelModel').oneShotLevel ? cc.systemEvent.emit(ModuleEventEnum.LEVEL_SHOT_PASSED, e) : cc.systemEvent.emit(ModuleEventEnum.LEVEL_PASSED, e), this.levelData.isDebug && window.popUp.getComponent('FloatTip').showTip('测试信息：过关了'), this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
      window.audio.getComponent('SoundManager').playEffect('whisper')
    }))))
  },

  onFailure: function () {
    this.failure = true
  },

  update: function (e) {
    if (this.waitingForPass) {
      for (let t = this.level.getChildren(), n = 0; n < t.length; n++) { if (t[n].name.match('bullet')) return }
      this.waitingForPass = false
      this.passed()
    }
  }
})
