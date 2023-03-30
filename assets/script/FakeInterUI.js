const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {
    item: cc.Prefab,
    content: cc.Node
  },

  onLoad: function () {
    cc.systemEvent.on(ModuleEventEnum.MORE_GAME, this.initContent, this)
    facade.getComponent('MoreGameModel').requestMoreGameList()
  },

  initData: function (e) {
    this.mainDatas = e
  },

  initContent: function () {
    let e
    let t = []
    t = t.concat(facade.getComponent('MoreGameModel').boxList[0])
    t.sort(function (e, t) {
      return parseInt(e.sort) > parseInt(t.sort) ? -1 : 1
    })

    if (window.facade.getComponent('PlayerModel').isClickCountLimit(2)) {
      for (let n = 0; n != t.length;) {
        const i = t[n].navout_max_cnt
        parseInt(i) && parseInt(i) != '' && parseInt(i) != 0 && t[n].navout_cnt >= parseInt(i) ? t.splice(n, 1) : n++
      }
    }

    if (facade.getComponent('PlayerModel').isIconRandomOrder('interstitial')) {
      const o = facade.getComponent('PlayerModel').getInterstiRecommondRandomCount()
      const a = t.slice(0, o)
      const s = t.slice(o, t.length)
      a && a.length > 1 && a.sort(function () {
        return 0.5 - Math.random()
      }), t = [], t = a.concat(s)
    } else {
      t.sort(function (e, t) {
        return Number(e.weight) > Number(t.weight) ? -1 : 1
      })
    }

    for (const c in e = t.length > 9 ? t.splice(0, 9) : t) {
      const r = cc.instantiate(this.item)
      r.getComponent('RecommendGameItem').setupItemData(e[c])
      r.parent = this.content
      const l = new cc.Node()
      const d = l.addComponent(cc.Label)
      d.string = e[c].game_name
      d.fontSize = 22
      r.addChild(l)
      l.y = -20 - r.height / 2
      l.color = cc.Color.GRAY
    }
  },

  onClickClose: function () {
    popUp.getComponent('Pop').removeTop()
  }
})
