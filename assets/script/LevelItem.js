const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {
    lock: cc.SpriteFrame,
    unlock: cc.SpriteFrame,
    bg: cc.Sprite,
    light: cc.Node,
    stars: cc.Node,
    label: cc.Node,
    lockByStar: cc.Node,
    levelCondition: cc.Sprite
  },

  onLoad: function () {},
  start: function () {
    this._config = this.node.config
    for (var e = 1; e <= 3; e++) this.stars.getChildByName('star' + e).active = false
    const t = window.facade.getComponent('LevelModel').getLevelStar(facade.selectedLevelType + '_' + this._config.Level)
    const n = facade.getComponent('LevelModel').getTotalStar()
    for (e = 1; e <= t; e++) this.stars.getChildByName('star' + e).active = true
    this.light.active = false
    this.levelCondition.node.active = false
    const i = this._config.BonusType
    if (i > 0) {
      const o = cc.loader.getRes('uis', cc.SpriteAtlas)
      this.levelCondition.spriteFrame = o.getSpriteFrame('level_label' + i)
    }
    this._config.Level == this.node.currentLevel ? (this.light.active = true, this.bg.spriteFrame = this.unlock, this.stars.active = false, this._config.Star > n && (this.label.active = false, this.lockByStar.active = true), i > 0 && (this.levelCondition.node.active = true)) : this._config.Level < this.node.currentLevel ? (this._config.BonusType = 0, this.bg.spriteFrame = this.unlock, this.label.y = 20, this.stars.active = true) : (this.locked = true, this.stars.active = false, this.bg.spriteFrame = this.lock, i > 0 && (this.levelCondition.node.active = true)), this.label.getComponent('TextureLabel').setText(String(this._config.Level))
  },
  goLevel: function () {
    if (!this.locked) {
      if (window.facade.getComponent('LevelModel').getLevelVideo(facade.selectedLevelType + '_' + this._config.Level) > 0) {
        if (this._config.BonusType == 3) window.facade.getComponent('LevelModel').getLevelStar(facade.selectedLevelType + '_' + this._config.Level) < 3 && (this._config.Reward = 2 * this._config.Reward)
      } else if (this._config.Level == this.node.currentLevel && this._config.BonusType > 0) return void this.watchVideo()
      const e = facade.getComponent('LevelModel').costEnergy
      if (facade.getComponent('GameModel').energy < e) cc.systemEvent.emit(ModuleEventEnum.ENERGY_NEEDED)
      else {
        const t = facade.getComponent('LevelModel').getTotalStar()
        this._config.Star > t ? popUp.getComponent('FloatTip').showTip('收集' + this._config.Star + '颗星星解锁') : cc.systemEvent.emit(ModuleEventEnum.GO_LEVEL, this._config.Level)
      }
    }
  },
  watchVideo: function () {
    const e = {
      inviteId: 0,
      videoId: 21111,
      assistId: 0,
      interstitalId: 31106
    }
    window.facade.getComponent('ShareADModel').showShareAD(e, {
      succ: function (e) {
        console.log('关卡视频:', e)
        this.jumpToLevlUi()
      }.bind(this),
      fail: function (e, t) {
        popUp.getComponent('FloatTip').showTip(e)
      }
    })
  },
  jumpToLevlUi: function () {
    window.facade.getComponent('LevelModel').setOverVideo(this.node.currentLevel)
    facade.getComponent('LevelModel').costEnergy = 1
    if (this._config.BonusType == 1) {
      facade.getComponent('LevelModel').costEnergy = 0
      const e = facade.getComponent('LevelModel').costEnergy
      if (facade.getComponent('GameModel').energy < e) return void cc.systemEvent.emit(ModuleEventEnum.ENERGY_NEEDED)
    }
    this._config.BonusType == 2 && (this._config.LuckyPoint = 2 * this._config.LuckyPoint), this._config.BonusType == 3 && (this._config.Reward = 2 * this._config.Reward)
    const t = facade.getComponent('LevelModel').getTotalStar()
    this._config.Star > t ? popUp.getComponent('FloatTip').showTip('收集' + this._config.Star + '颗星星解锁') : cc.systemEvent.emit(ModuleEventEnum.GO_LEVEL, this._config.Level)
  }
})
