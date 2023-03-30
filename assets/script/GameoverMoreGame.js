const MoreGameManager = require('MoreGameManager')

cc.Class({
  extends: cc.Component,
  properties: {
    itemNodeArr: [cc.Node]
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

  showMoreGameList: function () {
    for (let e = 0; e < this.itemNodeArr.length; e++) {
      this.itemNodeArr[e].getComponent('MoreGameItemOne').setupItemData(this.boxList[e])
    }
  }
})
