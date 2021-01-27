var i = require('MoreGameManager'),
    o = require('AnalyticsUtilities').AnalyticsUtilities;
cc.Class({
    extends: cc.Component,
    properties: {
        iconImg: cc.Sprite,
        nameL: cc.Label,
        countL: cc.Label,
        startC: 0,
        endC: 0,
        count: 0,
        pointL: cc.Label,
        getNode: cc.Node
    },
    onLoad: function() {},
    setupItemData: function(e) {
        if (this.data = e, e && e.name) {
            this.node.active = !0;
            var t = e.name;
            if (void 0 != t && (this.nameL.string = t), e.icon && 0 == e.icon.indexOf("http")) {
                var n = this;
                cc.loader.load({
                    url: e.icon,
                    type: "png"
                }, function(e, t) {
                    n.iconImg && t && (n.iconImg.spriteFrame = new cc.SpriteFrame(t))
                })
            }
        } else this.node.active = !1
    },
    update: function() {},
    btnGoGameOnClick: function(e) {
        1 == e && o.logEvent("主界面_更多游戏", {
            appId: this.data.appId
        });
        var t = this.data.appId,
            n = this.data.extra;
        t && i.navigateToMiniProgram(t, n)
    }
})