const i = require('Network')
cc.Class({
  extends: cc.Component,
  properties: {
    recommendList: []
  },
  uploadNavigateOut: function (e, t, n) {
    const i = {
      game_id: window.facade.GameId,
      to_game_id: t,
      final_to_game_id: n,
      token: window.facade.getComponent('PlayerModel').token
    }
    window.net.getComponent('Net').httpRequest(window.net.NavigateOut, i), e == 1 ? this.requestHomeRecommend() : (this.requestRecommendGame(), this.requestHomeRecommend())
  },
  showRecommendGameList: function (e) {
    this.node.opacity = 255, this.node.active = !0, this.content.x = 0, this.content.removeAllChildren()
    for (let t = 0; t < e.length; t++) {
      let n = null;
      (n = cc.instantiate(this.itemPrefab)).x = 134 * t + 67, n.active = !0, n.getComponent('RecommendGameItem').setupItemData(e[t]), this.content.addChild(n)
    }
    this.content.width = 134 * e.length, this.content.width <= this.node.width - 40 ? this.isOpen = !1 : (this.isOpen = !0, this.isLeft = !0)
  },
  requestHomeRecommend: function () {
    const e = this
    const t = window.facade.httpServerAdress + window.net.RecommendGame
    const n = {
      game_id: window.facade.GameId,
      token: window.facade.getComponent('PlayerModel').token
    }
    i.postRequest(t, n, {
      success: function (t) {
        const n = facade.getComponent('PlayerModel').getRecommondCount()
        const i = e.setupRecommendList(t.recommend_info, n, 3, [])
        cc.systemEvent.emit(ME.HOME_RECOMMEND, i)
      },
      failure: function (e) {}
    })
  },
  requestResultRecommend: function () {
    const e = this
    const t = window.facade.httpServerAdress + window.net.RecommendGame
    const n = {
      game_id: window.facade.GameId,
      token: window.facade.getComponent('PlayerModel').token
    }
    i.postRequest(t, n, {
      success: function (t) {
        const n = e.setupRecommendList(t.recommend_info, 50, 5, [])
        cc.systemEvent.emit(ME.RESULT_RECOMMEND, n)
      },
      failure: function (e) {}
    })
  },
  requestRecommendGame: function () {
    const e = this
    const t = window.facade.httpServerAdress + window.net.RecommendGame
    const n = {
      game_id: window.facade.GameId,
      token: window.facade.getComponent('PlayerModel').token
    }
    i.postRequest(t, n, {
      success: function (t) {
        const n = e.setupRecommendList(t.recommend_info, 4, 4, [])
        cc.systemEvent.emit(ME.RECOMMEND_GAME, n)
      },
      failure: function (e) {}
    })
  },
  setupRecommendList: function (e, t, n, i) {
    for (var o = [], a = 0; a < e.length; a++) {
      const s = e[a]
      parseInt(s.group) == n && o.push(s)
    }
    o = o.sort(function (e, t) {
      return parseInt(e.weight) < parseInt(t.weight) ? 1 : parseInt(e.weight) > parseInt(t.weight) ? -1 : 0
    })
    for (var c = [], r = [], l = 0; l < o.length; l++) {
      const d = o[l]
      parseInt(d.navout_cnt) <= 0 ? c.push(d) : r.push(d)
    }
    let h = []
    h = o.length <= t ? o : c.length > t ? c.slice(0, t) : c.length < t ? c.concat(r.slice(0, t - c.length)) : c
    for (let u = 0; u < h.length; u++) {
      const p = h[u]
      h[u].status = 2
      for (let m = 0; m < i.length; m++) {
        const g = i[m]
        p.game_id == g && (h[u].status = 1)
      }
    }
    return this.recommendList = h, console.log('this.recommendList3 =', h), h
  }
})
