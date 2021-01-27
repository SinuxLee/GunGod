cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function() {},
    start: function() {
        this.node.active = !1
    },
    update: function(e) {
        this.node.angle += 10
    }
})