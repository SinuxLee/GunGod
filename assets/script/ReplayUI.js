require('ModuleEventEnum')
const i = require('AnalyticsUtilities').AnalyticsUtilities
cc.Class({
  extends: cc.Component,
  properties: {
    retryCostEnergyLabel: cc.Label
  },
  onLoad: function () {},
  onEnable: function () {
    this.retryCostEnergyLabel.active = !1
    const e = this
    setTimeout(function () {
      e.retryCostEnergyLabel.active = !0
    }, 2e3)
    facade.getComponent('LevelModel').costEnergy
    this.retryCostEnergyLabel.string = '消耗1体力重玩', i.logEvent('进入体力不足界面')
  },
  onDisable: function () {},
  doClose: function () {
    this.node.active = !1
  }
})
