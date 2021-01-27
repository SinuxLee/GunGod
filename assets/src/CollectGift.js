cc.Class({
    extends: cc.Component,
    properties: {
        tipNode: cc.Node,
        content: cc.Node,
        backBtn: cc.Node,
        getBtn: cc.Node
    },
    start: function() {
        var e = facade.getComponent("GameModel").lastFetchColectTime;
        e || (e = 0), this.getBtn.active = 0 == e
    },
    viewDidAppear: function() {
        this.updatePos();
        var e = cc.moveBy(.3, cc.v2(0, -100)),
            t = cc.repeatForever(cc.sequence(e, e.reverse()));
        this.tipNode.runAction(t)
    },
    updatePos: function() {
        var e = facade.getComponent("PlayerModel").wxAdaptor.getMenuPos();
        null != e && (this.tipNode.x = e.x * facade.screenWidth - this.tipNode.width / 2, this.tipNode.y = e.y * facade.screenHeight - this.tipNode.height / 2, this.backBtn.y = this.tipNode.y + 20, this.content.y = this.tipNode.y - 30, this.content.scale = .87)
    },
    onClickBack: function() {
        popUp.getComponent("Pop").removeTop()
    },
    onClickGet: function() {
        facade.getComponent("PlayerModel").wxAdaptor.checkCollectCondi() ? (facade.getComponent("GameModel").getCollectReward(), popUp.getComponent("Pop").removeTop()) : popUp.getComponent("FloatTip").showTip("请从我的小程序进入游戏！")
    }
})