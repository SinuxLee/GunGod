const CommonFunc = require('CommonFunc')
cc.Class({
  extends: cc.Component,
  properties: {
    energyLabel: cc.Node,
    energyCD: cc.Node
  },

  onLoad: function () {
    this.frameCount = 0
  },

  update: function (e) {
    this.energyLabel.getComponent('TextureLabel').setText(String(window.facade.getComponent('GameModel').energy))
    this.energyCD.active = !window.facade.getComponent('GameModel').isEnergyFull()
    this.frameCount++

    if (this.frameCount % 30 == 0) {
      const t = window.facade.getComponent('GameModel').getNextEnergyTime()
      const n = (new Date()).getTime()
      const o = Math.round((t - n) / 1e3)
      const a = String(CommonFunc.changeNumToTime(o))
      this.energyCD.getComponent('TextureLabel').setText(a)
    }
  }
})
