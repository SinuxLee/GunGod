cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function() {
        var t = require('ModuleEventEnum');
        cc.systemEvent.once(t.OPEN_VIDEO, this.hideFloat.bind(this))
    },
    start: function() {},
    showTip: function(e) {
        null == this.floatNode ? cc.loader.loadRes("pfb/FloatTip", function(t, n) {
            this.floatNode = cc.instantiate(n), this.floatNode.getChildByName("Label").getComponent(cc.Label).string = e, cc.director.getScene().getChildByName("Canvas").addChild(this.floatNode, window.facade.FloatOrder), this.runFloat()
        }.bind(this)) : (this.floatNode.getChildByName("Label").getComponent(cc.Label).string = e, this.floatNode.stopAllActions(), this.floatNode.opacity = 255, this.floatNode.setPosition(0, 50), this.runFloat())
    },
    runFloat: function() {
        this.floatNode.opacity = 255, this.floatNode.runAction(cc.sequence(cc.delayTime(1), cc.spawn(cc.moveBy(1, cc.v2(0, 50)), cc.fadeOut(1)), cc.callFunc(this.hideFloat, this)))
    },
    hideFloat: function() {
        this.floatNode && (this.floatNode.removeFromParent(), this.floatNode = null)
    }
})