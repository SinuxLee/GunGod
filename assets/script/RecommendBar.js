const MoreGameManager = require('MoreGameManager')

cc.Class({
  extends: cc.Component,
  properties: {
    itemPrefab: cc.Prefab,
    content: cc.Node
  },
  onLoad: function () {
    this.itemId = 1
    this.node.opacity = 0
    this.dir = -1
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true)
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true)
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true)
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true)
  },
  start: function () {
    this.delayRequest()
  },
  delayRequest: function () {
    const e = this
    MoreGameManager.requestMoreGameList(function (t) {
      e.showRecommendGameList(t)
    })
  },
  showRecommendGameList: function (e) {
    this.node.opacity = 255
    this.node.active = true
    this.content.x = 0
    this.content.removeAllChildren()
    if (e && !(e.length <= 5)) {
      this.datas = e
      for (var t = [], n = 8, i = 0; i < n; i++) {
        let o = this.itemId - 5 + i
        o < 0 ? o = this.datas.length + o : o >= this.datas.length && (o -= this.datas.length), t[i] = this.datas[o]
      }
      n = Math.min(t.length, n)
      for (i = 0; i < n; i++) {
        const a = cc.instantiate(this.itemPrefab)
        a.data = i
        a.getComponent('RecommendGameItem').setupItemData(t[i])
        a.x = 134 * i - 400
        this.content.addChild(a)
      }
      this.updateContent()
    }
  },
  updateContent: function () {
    this.content.width = 134 * this.content.getChildren().length
  },
  insertToRight: function (e) {
    const t = this.content.getChildren()
    const n = t[t.length - 1]
    let i = n.data + 1
    i > this.datas.length - 1 && (i = 0)
    e.data = i
    e.getComponent('RecommendGameItem').setupItemData(this.datas[i])
    e.x = n.x + 134
  },
  insertToLeft: function (e) {
    const t = this.content.getChildren()[0]
    let n = t.data - 1
    n < 0 && (n = this.datas.length - 1)
    e.data = n
    e.getComponent('RecommendGameItem').setupItemData(this.datas[n])
    e.x = t.x - 134
  },
  autoRoll: function () {
    this.deltaMove = cc.v2(this.dir, 0)
    this.content.x += this.deltaMove.x
  },
  _onTouchBegan: function (e, t) {
    const n = e.touch
    this._startTouch = n.getLocation().clone()
    this._startContentX = this.content.x
  },
  _onTouchMoved: function (e, t) {
    const n = e.touch
    this.deltaMove = n.getLocation().sub(n.getStartLocation())
    this._touchMoved ? this.content.x = this._startContentX + this.deltaMove.x : this.deltaMove.mag() > 7 && (this.content.x = this._startContentX + this.deltaMove.x, this._touchMoved = true), this.rollType || (this.content.x >= (this.content.width - this.node.width) / 2 - 60 && (this.content.x = (this.content.width - this.node.width) / 2 - 60), this.content.x <= -(this.content.width - this.node.width) / 2 + 60 && (this.content.x = -(this.content.width - this.node.width) / 2 + 60))
  },
  _onTouchEnded: function (e, t) {
    e.touch
    this._touchMoved && e.stopPropagation()
    this._touchMoved && (this._touchMoved = false)
  },
  _onTouchCancelled: function (e, t) {
    this._touchMoved = false
  },
  update: function (e) {
    this.rollType == 1 ? (this.dir = -1, this.rollOneSide()) : this.rollReverse()
  },
  rollReverse: function () {
    if (this._touchMoved) return
    this.dir == -1 ? this.content.x-- : this.content.x++
    this.content.x >= (this.content.width - this.node.width) / 2 - 60 && (this.dir = -1)
    this.content.x <= -(this.content.width - this.node.width) / 2 + 60 && (this.dir = 1)
    this.autoRoll()
  },
  rollOneSide: function () {
    this._touchMoved || this.autoRoll()
    for (var e = this.content.getChildren(), t = 0; t < e.length; t++) {
      const n = e[t]
      const i = n.convertToWorldSpaceAR(cc.v2(100, 0))
      if (i.x < 0 && this.deltaMove.x < 0) {
        this.insertToRight(n), this.dir = -1
        break
      }
      if (i.x > 840 && this.deltaMove.x > 0) {
        this.insertToLeft(n), this.dir = 1
        break
      }
    }
    e.sort(function (e, t) {
      return e.x < t.x ? -1 : 1
    })
  }
})
