var i = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function() {
        cc.systemEvent.on(i.GOT_HTTP_RES, this.httpResDeal.bind(this))
    },
    httpResDeal: function(e) {
        var t = e.data;
        t && t.nick_name ? (this.selfdata = t, cc.systemEvent.emit(i.PLAYER_RANK_DATA, this.selfdata)) : t && t[0] && t[0].best_score ? (this.ranks = t, cc.systemEvent.emit(i.RANK_LIST, this.ranks)) : t && t[0] && t[0].today_best_score && (this.ranks = t, cc.systemEvent.emit(i.RANK_LIST, this.ranks))
    },
    requestRankList: function(e) {
        var t = 1;
        2 == e ? t = 3 : 1 == e && (t = 1);
        var n = {
            game_id: window.facade.GameId,
            token: window.facade.getComponent("PlayerModel").token,
            rank_type: t,
            score_type: e,
            region_id: 1,
            page_count: 300,
            page_num: 1
        };
        window.net.getComponent("Net").httpRequest(window.net.RankList, n)
    },
    requestSelfRank: function(e) {
        var t = 1;
        2 == e ? t = 3 : 1 == e && (t = 1);
        var n = {
            game_id: window.facade.GameId,
            token: window.facade.getComponent("PlayerModel").token,
            rank_type: t,
            score_type: e
        };
        window.net.getComponent("Net").httpRequest(window.net.SelfRankData, n)
    }
})