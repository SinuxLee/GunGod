var i = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        item: cc.Prefab,
        content: cc.Node
    },
    onLoad: function() {
        cc.systemEvent.on(i.MORE_GAME, this.initContent, this), facade.getComponent("MoreGameModel").requestMoreGameList()
    },
    initData: function(e) {
        this.mainDatas = e
    },
    initContent: function() {
        var e, t = [];
        if ((t = t.concat(facade.getComponent("MoreGameModel").boxList[0])).sort(function(e, t) {
                return parseInt(e.sort) > parseInt(t.sort) ? -1 : 1
            }), window.facade.getComponent("PlayerModel").isClickCountLimit(2))
            for (var n = 0; n != t.length;) {
                var i = t[n].navout_max_cnt;
                parseInt(i) && "" != parseInt(i) && 0 != parseInt(i) && t[n].navout_cnt >= parseInt(i) ? t.splice(n, 1) : n++
            }
        if (facade.getComponent("PlayerModel").isIconRandomOrder("interstitial")) {
            var o = facade.getComponent("PlayerModel").getInterstiRecommondRandomCount(),
                a = t.slice(0, o),
                s = t.slice(o, t.length);
            a && a.length > 1 && a.sort(function() {
                return .5 - Math.random()
            }), t = [], t = a.concat(s)
        } else t.sort(function(e, t) {
            return Number(e.weight) > Number(t.weight) ? -1 : 1
        });
        for (var c in e = t.length > 9 ? t.splice(0, 9) : t) {
            var r = cc.instantiate(this.item);
            r.getComponent("RecommendGameItem").setupItemData(e[c]), r.parent = this.content;
            var l = new cc.Node,
                d = l.addComponent(cc.Label);
            d.string = e[c].game_name, d.fontSize = 22, r.addChild(l), l.y = -20 - r.height / 2, l.color = cc.Color.GRAY
        }
    },
    onClickClose: function() {
        popUp.getComponent("Pop").removeTop()
    }
})