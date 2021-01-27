require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        target: cc.Node
    },
    onLoad: function() {},
    start: function() {},
    trigger: function() {
        this.target && (this.target.active = !0), this.node.removeFromParent()
    },
    update: function(e) {}
})