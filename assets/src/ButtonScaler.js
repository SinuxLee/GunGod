cc.Class({
    extends: cc.Component,
    properties: {
        pressedScale: 1.1,
        transDuration: .24
    },
    onLoad: function() {
        var e = this;

        function t(t) {
            0 != this.getComponent(cc.Button).interactable && 1 != e.pressedScale && (this.stopAllActions(), this.runAction(e.scaleUpAction))
        }
        e.initScale = this.node.scale, e.button = e.getComponent(cc.Button), e.scaleDownAction = cc.scaleTo(e.transDuration, e.pressedScale), e.scaleUpAction = cc.scaleTo(e.transDuration, e.initScale), this.node.on("touchstart", function(t) {
            0 != this.getComponent(cc.Button).interactable && (1 != e.pressedScale && (this.stopAllActions(), this.runAction(e.scaleDownAction)), window.audio.getComponent("SoundManager").playEffect("click"))
        }, this.node), this.node.on("touchend", t, this.node), this.node.on("touchcancel", t, this.node)
    }
})