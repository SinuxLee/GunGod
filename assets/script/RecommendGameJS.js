cc.Class({
  extends: cc.Component,
  properties: {
    itemNode: cc.Node,
    scrollView: cc.Node,
    itemNodes: []
  },

  onDisable () {
    console.log('recommend onDisable')
    cc.systemEvent.off(ME.RECOMMEND_GAME)
    this.scrollView.getComponent('ListViewCtrl').close()
  },

  onEnable () {
    console.log('')
    this.scrollView.getComponent('ListViewCtrl').initialize()
  },

  requestRecommend () {
    facade.isMiniGame && (window.facade.SAVE_MODE || (cc.systemEvent.on(ME.RECOMMEND_GAME, this.showRecommendGameList.bind(this)), window.facade.getComponent('RecommendGameModel').requestRecommendGame()))
  },

  showRecommendGameList (e) {
    this.node.active = true
    const t = e
    this.scrollView.getComponent('ListViewCtrl').setList(t, false, null)
  },

  btnToMoreGameOnClick () {
    window.popUp.getComponent('Pop').addPopByName('MoreGame', this, true, true, false)
  }
})
