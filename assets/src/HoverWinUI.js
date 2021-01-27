cc.Class({
    extends: cc.Component,
    properties: {
        backBtn: cc.Node,
        title: cc.Node,
        titleLine: cc.Node,
        showSp1: cc.Node,
        showSp2: cc.Node
    },
    onLoad: function() {
        this.closeActTime = .2
    },
    start: function() {
        if (window.wx) {
            var t = require('ModuleEventEnum');
            cc.systemEvent.once(t.UPDATE_HOVER_SHOW, this.onClickBack, this), facade.getComponent("PlayerModel").wxAdaptor.reigsterWXFunc(function() {
                facade.getComponent("PlayerModel").wxAdaptor.checkHoverWinShow() && (console.log("aaaaa   check  领奖啦啦啦啦啦啦"), facade.getComponent("GameModel").applyHoverWinReward())
            }, !0)
        }
    },
    viewDidAppear: function() {
        this.backBtn.active = !0, this.title.active = !0, this.titleLine.active = !0, this.showSp1.active = !0, this.showSp2.active = !0;
        var e = cc.moveBy(.3, cc.v2(0, -200)).easing(cc.easeBackOut());
        this.backBtn.runAction(e);
        var t = cc.moveBy(.3, cc.v2(-300, 0)).easing(cc.easeBackOut());
        this.title.runAction(t);
        var n = cc.moveBy(.3, cc.v2(500, 0)).easing(cc.easeBackOut());
        this.titleLine.runAction(n);
        var i = cc.scaleTo(.3, .9).easing(cc.easeBackOut());
        this.count = 1, this.actId = setInterval(function() {
            3 != this.count ? (this["showSp" + this.count].runAction(i.clone()), this.count++) : clearInterval(this.actId)
        }.bind(this), 300)
    },
    doClose: function() {
        var e = cc.scaleTo(.2, 1.1);
        this.title.runAction(e.clone()), this.titleLine.runAction(e.clone()), this.backBtn.runAction(e.clone()), this.showSp1.runAction(e.clone()), this.showSp2.runAction(e.clone())
    },
    onClickBack: function() {
        popUp.getComponent("Pop").removeByName("HoverWinUI")
    }
})