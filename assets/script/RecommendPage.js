const MoreGameManager = require('MoreGameManager')
cc.Class({
  extends: cc.Component,
  properties: {
    itemPrefab: cc.Prefab,
    content: cc.Node,
    gameRun: cc.Node
  },
  show: function () {
    this.content.y = 0, this.node.active = true
  },
  onEnable: function () {
    this.initData()
  },
  initData: function () {
    const e = this
    MoreGameManager.requestMoreGameList(function (t) {
      e.showRecommendGameList(t)
    })
  },
  showRecommendGameList: function (e) {
    if (this.content.removeAllChildren(), e && e.length != 0) {
      for (let t = 0; t < e.length; t++) {
        const n = cc.instantiate(this.itemPrefab)
        const i = JSON.parse(JSON.stringify(e[t]))
        i.icon = i.previewUrl
        n.getComponent('RecommendGameItem').setupItemData(i)
        this.content.addChild(n)
      }
      this.content.height = 252 * e.length / 2
    }
  },
  scrollEvent: function (e, t) {},
  close: function () {
    this.node.active = false
  }
})
