const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {
    cc.systemEvent.on(i.GOT_HTTP_RES, this.httpResDeal.bind(this))
  },
  httpResDeal: function (e) {
    const t = e.data
    t && t.nick_name ? (this.selfdata = t, cc.systemEvent.emit(i.PLAYER_RANK_DATA, this.selfdata)) : t && t[0] && t[0].best_score ? (this.ranks = t, cc.systemEvent.emit(i.RANK_LIST, this.ranks)) : t && t[0] && t[0].today_best_score && (this.ranks = t, cc.systemEvent.emit(i.RANK_LIST, this.ranks))
  },
  requestRankList: function (e) {
    let t = 1
    e == 2 ? t = 3 : e == 1 && (t = 1)
    const n = {
      game_id: window.facade.GameId,
      token: window.facade.getComponent('PlayerModel').token,
      rank_type: t,
      score_type: e,
      region_id: 1,
      page_count: 300,
      page_num: 1
    }
    window.net.getComponent('Net').httpRequest(window.net.RankList, n)
  },
  requestSelfRank: function (e) {
    let t = 1
    e == 2 ? t = 3 : e == 1 && (t = 1)
    const n = {
      game_id: window.facade.GameId,
      token: window.facade.getComponent('PlayerModel').token,
      rank_type: t,
      score_type: e
    }
    window.net.getComponent('Net').httpRequest(window.net.SelfRankData, n)
  }
})
