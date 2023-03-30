cc.Class({
  extends: cc.Component,
  properties: {
    itemNode: cc.Node,
    scrollView: cc.Node,
    itemNodes: []
  },
  onDisable: function () {
    console.log('recommend onDisable')
    cc.systemEvent.off(ME.RECOMMEND_GAME)
    this.scrollView.getComponent('ListViewCtrl').close()
  },
  onEnable: function () {
    console.log('')
    this.scrollView.getComponent('ListViewCtrl').initialize()
  },
  onLoad: function () {},
  requestRecommend: function () {
    facade.isMiniGame && (window.facade.SAVE_MODE || (cc.systemEvent.on(ME.RECOMMEND_GAME, this.showRecommendGameList.bind(this)), window.facade.getComponent('RecommendGameModel').requestRecommendGame()))
  },
  showRecommendGameList: function (e) {
    this.node.active = true
    const t = e
    this.scrollView.getComponent('ListViewCtrl').setList(t, false, null)
  },
  btnToMoreGameOnClick: function () {
    window.popUp.getComponent('Pop').addPopByName('MoreGame', this, true, true, false)
  }
})
