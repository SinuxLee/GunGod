const Analytics = require('AnalyticsUtilities').AnalyticsUtilities

cc.Class({
  extends: cc.Component,
  properties: {
    retryCostEnergyLabel: cc.Label
  },

  onEnable () {
    this.retryCostEnergyLabel.active = false
    setTimeout(() => {
      this.retryCostEnergyLabel.active = true
    }, 2000)

    facade.getComponent('LevelModel').costEnergy
    this.retryCostEnergyLabel.string = '消耗1体力重玩'
    Analytics.logEvent('进入体力不足界面')
  },

  doClose () {
    this.node.active = false
  }
})
