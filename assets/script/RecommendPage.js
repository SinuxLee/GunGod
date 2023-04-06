const MoreGameManager = require('MoreGameManager')
cc.Class({
  extends: cc.Component,
  properties: {
    itemPrefab: cc.Prefab,
    content: cc.Node,
    gameRun: cc.Node
  },

  show () {
    this.content.y = 0
    this.node.active = true
  },
  onEnable () {
    this.initData()
  },

  initData () {
    MoreGameManager.requestMoreGameList((t) => {
      this.showRecommendGameList(t)
    })
  },

  showRecommendGameList (e) {
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

  scrollEvent (e, t) {},

  close () {
    this.node.active = false
  }
})
