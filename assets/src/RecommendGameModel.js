var i = require('Network');
cc.Class({
    extends: cc.Component,
    properties: {
        recommendList: []
    },
    uploadNavigateOut: function(e, t, n) {
        var i = {
            game_id: window.facade.GameId,
            to_game_id: t,
            final_to_game_id: n,
            token: window.facade.getComponent("PlayerModel").token
        };
        window.net.getComponent("Net").httpRequest(window.net.NavigateOut, i), 1 == e ? this.requestHomeRecommend() : (this.requestRecommendGame(), this.requestHomeRecommend())
    },
    showRecommendGameList: function(e) {
        this.node.opacity = 255, this.node.active = !0, this.content.x = 0, this.content.removeAllChildren();
        for (var t = 0; t < e.length; t++) {
            var n = null;
            (n = cc.instantiate(this.itemPrefab)).x = 134 * t + 67, n.active = !0, n.getComponent("RecommendGameItem").setupItemData(e[t]), this.content.addChild(n)
        }
        this.content.width = 134 * e.length, this.content.width <= this.node.width - 40 ? this.isOpen = !1 : (this.isOpen = !0, this.isLeft = !0)
    },
    requestHomeRecommend: function() {
        var e = this,
            t = window.facade.httpServerAdress + window.net.RecommendGame,
            n = {
                game_id: window.facade.GameId,
                token: window.facade.getComponent("PlayerModel").token
            };
        i.postRequest(t, n, {
            success: function(t) {
                var n = facade.getComponent("PlayerModel").getRecommondCount(),
                    i = e.setupRecommendList(t.recommend_info, n, 3, []);
                cc.systemEvent.emit(ME.HOME_RECOMMEND, i)
            },
            failure: function(e) {}
        })
    },
    requestResultRecommend: function() {
        var e = this,
            t = window.facade.httpServerAdress + window.net.RecommendGame,
            n = {
                game_id: window.facade.GameId,
                token: window.facade.getComponent("PlayerModel").token
            };
        i.postRequest(t, n, {
            success: function(t) {
                var n = e.setupRecommendList(t.recommend_info, 50, 5, []);
                cc.systemEvent.emit(ME.RESULT_RECOMMEND, n)
            },
            failure: function(e) {}
        })
    },
    requestRecommendGame: function() {
        var e = this,
            t = window.facade.httpServerAdress + window.net.RecommendGame,
            n = {
                game_id: window.facade.GameId,
                token: window.facade.getComponent("PlayerModel").token
            };
        i.postRequest(t, n, {
            success: function(t) {
                var n = e.setupRecommendList(t.recommend_info, 4, 4, []);
                cc.systemEvent.emit(ME.RECOMMEND_GAME, n)
            },
            failure: function(e) {}
        })
    },
    setupRecommendList: function(e, t, n, i) {
        for (var o = [], a = 0; a < e.length; a++) {
            var s = e[a];
            parseInt(s.group) == n && o.push(s)
        }
        o = o.sort(function(e, t) {
            return parseInt(e.weight) < parseInt(t.weight) ? 1 : parseInt(e.weight) > parseInt(t.weight) ? -1 : 0
        });
        for (var c = [], r = [], l = 0; l < o.length; l++) {
            var d = o[l];
            parseInt(d.navout_cnt) <= 0 ? c.push(d) : r.push(d)
        }
        var h = [];
        h = o.length <= t ? o : c.length > t ? c.slice(0, t) : c.length < t ? c.concat(r.slice(0, t - c.length)) : c;
        for (var u = 0; u < h.length; u++) {
            var p = h[u];
            h[u].status = 2;
            for (var m = 0; m < i.length; m++) {
                var g = i[m];
                p.game_id == g && (h[u].status = 1)
            }
        }
        return this.recommendList = h, console.log("this.recommendList3 =", h), h
    }
})