const i = require('ModuleEventEnum')
const o = require('AnalyticsUtilities').AnalyticsUtilities
cc.Class({
  extends: cc.Component,
  properties: {
    star: cc.Label,
    locked: cc.Node,
    unlockNeed: cc.Label,
    starItemIcon: cc.Node
  },
  onLoad: function () {},
  start: function () {
    this.isLocked = !0, this.type = this.node.name.split('_')[1], this.type == 'classic' && (this.isLocked = !1)
  },
  onClick: function () {
    if (o.logEvent('点击开始游戏'), this.isLocked) {
      const e = facade.getComponent('LevelModel')[this.type + 'StarNeed']
      return e ? this.type == 'injury' && facade.getComponent('GameModel').gotNextReward <= 0 ? void window.popUp.getComponent('Pop').addPopByName('NextLoginView', null, !0, !0) : void popUp.getComponent('FloatTip').showTip('收集满' + e + '颗星星再来吧！') : void popUp.getComponent('FloatTip').showTip('新的玩法，敬请期待！')
    }
    facade.selectedLevelType = this.type, facade.getComponent('LevelModel').setLevelTypeStr(this.type), cc.systemEvent.emit(i.LEVEL_SELECT, this.type)
  },
  update: function (e) {
    if (this.type == 'classic');
    else {
      const t = facade.getComponent('LevelModel')[this.type + 'StarNeed']
      const n = facade.getComponent('LevelModel').getTotalStar()
      t ? n >= t ? (this.isLocked = !1, this.unlockNeed.node.active = !1, this.starItemIcon.active = !0, this.star.node.active = !0) : this.type == 'injury' && facade.getComponent('GameModel').gotNextReward >= 1 ? (this.isLocked = !1, this.unlockNeed.node.active = !1, this.starItemIcon.active = !0, this.star.node.active = !0) : this.type == 'vip' && facade.getComponent('GameModel').gotAdvanceReward >= 1 ? (this.isLocked = !1, this.unlockNeed.node.active = !1, this.starItemIcon.active = !0, this.star.node.active = !0) : (this.isLocked = !0, this.unlockNeed.node.active = !0, this.unlockNeed.string = '差' + (t - n) + '星解锁', this.starItemIcon.active = !1, this.star.node.active = !1) : (this.isLocked = !0, this.unlockNeed.node.active = !1), this.locked.active = this.isLocked
    }
    this.star.string = facade.getComponent('LevelModel').getStarByLevelType(this.type)
  }
})