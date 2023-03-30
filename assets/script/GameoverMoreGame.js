const i = require('MoreGameManager')
cc.Class({
  extends: cc.Component,
  properties: {
    itemNodeArr: [cc.Node]
  },
  initData: function () {
    const e = this
    i.requestMoreGameList(function (t) {
      e.boxList = t, e.showMoreGameList()
    })
  },
  onLoad: function () {
    this.initData()
  },
  onEnable: function () {},
  showMoreGameList: function () {
    for (let e = 0; e < this.itemNodeArr.length; e++) {
      this.itemNodeArr[e].getComponent('MoreGameItemOne').setupItemData(this.boxList[e])
    }
  }
})
