const i = require('AnalyticsUtilities').AnalyticsUtilities
cc.Class({
  extends: cc.Component,
  properties: {
    retryCostEnergyLabel: cc.Label
  },

  onEnable: function () {
    this.retryCostEnergyLabel.active = false
    const e = this

    setTimeout(function () {
      e.retryCostEnergyLabel.active = true
    }, 2e3)

    facade.getComponent('LevelModel').costEnergy
    this.retryCostEnergyLabel.string = '消耗1体力重玩'
    i.logEvent('进入体力不足界面')
  },

  doClose: function () {
    this.node.active = false
  }
})
