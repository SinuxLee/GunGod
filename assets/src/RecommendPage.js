var i = require('MoreGameManager');
cc.Class({
    extends: cc.Component,
    properties: {
        itemPrefab: cc.Prefab,
        content: cc.Node,
        gameRun: cc.Node
    },
    show: function() {
        this.content.y = 0, this.node.active = !0
    },
    onEnable: function() {
        this.initData()
    },
    initData: function() {
        var e = this;
        i.requestMoreGameList(function(t) {
            e.showRecommendGameList(t)
        })
    },
    showRecommendGameList: function(e) {
        if (this.content.removeAllChildren(), e && 0 != e.length) {
            for (var t = 0; t < e.length; t++) {
                var n = cc.instantiate(this.itemPrefab),
                    i = JSON.parse(JSON.stringify(e[t]));
                i.icon = i.previewUrl, n.getComponent("RecommendGameItem").setupItemData(i), this.content.addChild(n)
            }
            this.content.height = 252 * e.length / 2
        }
    },
    start: function() {},
    scrollEvent: function(e, t) {},
    close: function() {
        this.node.active = !1
    }
})