const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,

  onLoad: function () {
    cc.systemEvent.on(ModuleEventEnum.GOT_HTTP_RES, this.httpResDeal.bind(this))
  },

  httpResDeal (res) {
    const t = res.data
    t && t.nick_name ? (this.selfdata = t, cc.systemEvent.emit(ModuleEventEnum.PLAYER_RANK_DATA, this.selfdata)) : t && t[0] && t[0].best_score ? (this.ranks = t, cc.systemEvent.emit(ModuleEventEnum.RANK_LIST, this.ranks)) : t && t[0] && t[0].today_best_score && (this.ranks = t, cc.systemEvent.emit(ModuleEventEnum.RANK_LIST, this.ranks))
  },

  requestRankList (e) {
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

  requestSelfRank (e) {
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
