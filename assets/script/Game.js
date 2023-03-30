const ModuleEventEnum = require('ModuleEventEnum')

module.exports = {
  init: function () {
    cc.systemEvent.on(ModuleEventEnum.GO_GAME, this.onGoGame.bind(this))
    cc.systemEvent.on(ModuleEventEnum.ENERGY_NEEDED, this.onEnergyNeeded.bind(this))
  },

  onGoGame: function (e, t) {
    window.facade.CurrentScene = 'Game'
    cc.director.loadScene(window.facade.CurrentScene, function () {
      cc.director.getScene().name = window.facade.CurrentScene
      facade.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
        cc.systemEvent.emit(ModuleEventEnum.GAMESENE_ENTERED)
      })))
    })
  },

  onEnergyNeeded: function () {
    facade.SAVE_MODE ? popUp.getComponent('FloatTip').showTip('啊偶，已经没有体力啦！') : facade.getComponent('GameModel').isRewardEnergyLimited() ? popUp.getComponent('FloatTip').showTip('啊偶，已经没有体力啦！') : popUp.getComponent('Pop').addPopByName('EnergyNeedView', null, true, true)
  },
  tag: 'game...'
}
