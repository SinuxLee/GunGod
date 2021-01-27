require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        takeBtn: cc.Node,
        tipBtn: cc.Node
    },
    onLoad: function() {},
    start: function() {
        var e = window.facade.getComponent("GameModel").firstLoginTime1,
            t = window.facade.getComponent("GameModel").gotNextReward;
        !t && (new Date).getTime() - e > 864e5 ? (this.takeBtn.active = !0, this.tipBtn.active = !1) : (this.takeBtn.active = !1, this.tipBtn.active = !0), t && (this.takeBtn.active = !1)
    },
    initData: function() {},
    takeAward: function() {
        window.facade.getComponent("GameModel").takeNextReward(), popUp.getComponent("Pop").removeTop()
    }
})