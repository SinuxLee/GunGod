require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {
    takeBtn: cc.Node,
    tipBtn: cc.Node
  },

  start: function () {
    const e = window.facade.getComponent('GameModel').firstLoginTime1
    const t = window.facade.getComponent('GameModel').gotNextReward
    !t && (new Date()).getTime() - e > 864e5 ? (this.takeBtn.active = true, this.tipBtn.active = false) : (this.takeBtn.active = false, this.tipBtn.active = true)
    t && (this.takeBtn.active = false)
  },
  initData: function () {},
  takeAward: function () {
    window.facade.getComponent('GameModel').takeNextReward()
    popUp.getComponent('Pop').removeTop()
  }
})
