cc.Class({
  extends: cc.Component,
  properties: {
    tipNode: cc.Node,
    content: cc.Node,
    backBtn: cc.Node,
    getBtn: cc.Node
  },
  start: function () {
    let e = facade.getComponent('GameModel').lastFetchColectTime
    e || (e = 0), this.getBtn.active = e == 0
  },
  viewDidAppear: function () {
    this.updatePos()
    const e = cc.moveBy(0.3, cc.v2(0, -100))
    const t = cc.repeatForever(cc.sequence(e, e.reverse()))
    this.tipNode.runAction(t)
  },
  updatePos: function () {
    const e = facade.getComponent('PlayerModel').wxAdaptor.getMenuPos()
    e != null && (this.tipNode.x = e.x * facade.screenWidth - this.tipNode.width / 2, this.tipNode.y = e.y * facade.screenHeight - this.tipNode.height / 2, this.backBtn.y = this.tipNode.y + 20, this.content.y = this.tipNode.y - 30, this.content.scale = 0.87)
  },
  onClickBack: function () {
    popUp.getComponent('Pop').removeTop()
  },
  onClickGet: function () {
    facade.getComponent('PlayerModel').wxAdaptor.checkCollectCondi() ? (facade.getComponent('GameModel').getCollectReward(), popUp.getComponent('Pop').removeTop()) : popUp.getComponent('FloatTip').showTip('请从我的小程序进入游戏！')
  }
})
