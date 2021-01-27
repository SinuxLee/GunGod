var i = require('MoreGameManager');
cc.Class({
    extends: cc.Component,
    properties: {
        itemNodeArr: [cc.Node]
    },
    initData: function() {
        var e = this;
        i.requestMoreGameList(function(t) {
            e.boxList = t, e.showMoreGameList()
        })
    },
    onLoad: function() {
        this.initData()
    },
    onEnable: function() {},
    showMoreGameList: function() {
        for (var e = 0; e < this.itemNodeArr.length; e++) {
            this.itemNodeArr[e].getComponent("MoreGameItemOne").setupItemData(this.boxList[e])
        }
    }
})