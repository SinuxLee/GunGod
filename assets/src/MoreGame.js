var i;

function o(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e
}
var a = require('MoreGameManager');
cc.Class((o(i = {
    extends: cc.Component,
    properties: {
        scrollView: cc.Node,
        itemNode: cc.Node,
        listNode: cc.Node,
        bg: cc.Node
    },
    initData: function() {
        var e = this;
        a.requestMoreGameList(function(t) {
            e.boxList = t, e.showMoreGameList()
        })
    },
    onLoad: function() {
        this.initData()
    },
    onDisable: function() {},
    onEnable: function() {
        this.node.active = !0
    }
}, "onDisable", function() {
    this.node.active = !1
}), o(i, "showMoreGameList", function() {
    this.listNode.active = !0;
    this.node.width;
    for (var e = 0; e < this.boxList.length; e++) {
        var t = cc.instantiate(this.itemNode);
        t.active = !0, t.getComponent("MoreGameItemOne").setupItemData(this.boxList[e]), this.scrollView.addChild(t)
    }
}), o(i, "closeHandler", function() {
    this.node.active = !1
}), o(i, "openHandler", function() {
    this.node.active = !this.node.active
}), i))