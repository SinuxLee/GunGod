let i

function o (e, t, n) {
  return t in e
    ? Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    })
    : e[t] = n, e
}
const MoreGameManager = require('MoreGameManager')

cc.Class((o(i = {
  extends: cc.Component,
  properties: {
    scrollView: cc.Node,
    itemNode: cc.Node,
    listNode: cc.Node,
    bg: cc.Node
  },
  initData: function () {
    const e = this
    MoreGameManager.requestMoreGameList(function (t) {
      e.boxList = t
      e.showMoreGameList()
    })
  },
  onLoad: function () {
    this.initData()
  },
  onDisable: function () {},
  onEnable: function () {
    this.node.active = true
  }
}, 'onDisable', function () {
  this.node.active = false
}),
o(i, 'showMoreGameList', function () {
  this.listNode.active = true
  this.node.width
  for (let e = 0; e < this.boxList.length; e++) {
    const t = cc.instantiate(this.itemNode)
    t.active = true
    t.getComponent('MoreGameItemOne').setupItemData(this.boxList[e])
    this.scrollView.addChild(t)
  }
}),
o(i, 'closeHandler', function () {
  this.node.active = false
}),
o(i, 'openHandler', function () {
  this.node.active = !this.node.active
}), i))
