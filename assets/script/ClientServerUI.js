cc.Class({
  extends: cc.Component,

  start: function () {
    facade.getComponent('GameModel').checkClientRewardShow()
  },

  onClickBack: function () {
    popUp.getComponent('Pop').removeByName('ClientServerUI')
  },

  onClickReward: function () {
    window.wx && facade.getComponent('PlayerModel').wxAdaptor.getClientReward()
  }
})
