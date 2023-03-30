const ModuleEventEnum = require('ModuleEventEnum')
const o = require('AnalyticsUtilities').AnalyticsUtilities

cc.Class({
  extends: cc.Component,
  properties: {
    star: cc.Label,
    locked: cc.Node,
    unlockNeed: cc.Label,
    starItemIcon: cc.Node
  },

  start: function () {
    this.isLocked = true
    this.type = this.node.name.split('_')[1]
    this.type == 'classic' && (this.isLocked = false)
  },

  onClick: function () {
    if (o.logEvent('点击开始游戏'), this.isLocked) {
      const e = facade.getComponent('LevelModel')[this.type + 'StarNeed']
      return e ? this.type == 'injury' && facade.getComponent('GameModel').gotNextReward <= 0 ? void window.popUp.getComponent('Pop').addPopByName('NextLoginView', null, true, true) : void popUp.getComponent('FloatTip').showTip('收集满' + e + '颗星星再来吧！') : void popUp.getComponent('FloatTip').showTip('新的玩法，敬请期待！')
    }
    facade.selectedLevelType = this.type
    facade.getComponent('LevelModel').setLevelTypeStr(this.type)
    cc.systemEvent.emit(ModuleEventEnum.LEVEL_SELECT, this.type)
  },

  update: function (e) {
    if (this.type == 'classic');
    else {
      const t = facade.getComponent('LevelModel')[this.type + 'StarNeed']
      const n = facade.getComponent('LevelModel').getTotalStar()
      t ? n >= t ? (this.isLocked = false, this.unlockNeed.node.active = false, this.starItemIcon.active = true, this.star.node.active = true) : this.type == 'injury' && facade.getComponent('GameModel').gotNextReward >= 1 ? (this.isLocked = false, this.unlockNeed.node.active = false, this.starItemIcon.active = true, this.star.node.active = true) : this.type == 'vip' && facade.getComponent('GameModel').gotAdvanceReward >= 1 ? (this.isLocked = false, this.unlockNeed.node.active = false, this.starItemIcon.active = true, this.star.node.active = true) : (this.isLocked = true, this.unlockNeed.node.active = true, this.unlockNeed.string = '差' + (t - n) + '星解锁', this.starItemIcon.active = false, this.star.node.active = false) : (this.isLocked = true, this.unlockNeed.node.active = false), this.locked.active = this.isLocked
    }
    this.star.string = facade.getComponent('LevelModel').getStarByLevelType(this.type)
  }
})
