cc.Class({
  extends: cc.Component,
  properties: {
    pressedScale: 1.1,
    transDuration: 0.24
  },
  onLoad: function () {
    const e = this

    function t (t) {
      this.getComponent(cc.Button).interactable != 0 && e.pressedScale != 1 && (this.stopAllActions(), this.runAction(e.scaleUpAction))
    }
    e.initScale = this.node.scale, e.button = e.getComponent(cc.Button), e.scaleDownAction = cc.scaleTo(e.transDuration, e.pressedScale), e.scaleUpAction = cc.scaleTo(e.transDuration, e.initScale), this.node.on('touchstart', function (t) {
      this.getComponent(cc.Button).interactable != 0 && (e.pressedScale != 1 && (this.stopAllActions(), this.runAction(e.scaleDownAction)), window.audio.getComponent('SoundManager').playEffect('click'))
    }, this.node), this.node.on('touchend', t, this.node), this.node.on('touchcancel', t, this.node)
  }
})
