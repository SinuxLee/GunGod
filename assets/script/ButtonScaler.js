cc.Class({
  extends: cc.Component,
  properties: {
    pressedScale: 1.1,
    transDuration: 0.24
  },

  onLoad () {
    this.initScale = this.node.scale
    this.button = this.getComponent(cc.Button)
    this.scaleDownAction = cc.scaleTo(this.transDuration, this.pressedScale)
    this.scaleUpAction = cc.scaleTo(this.transDuration, this.initScale)

    this.node.on('touchstart', this.touchStart, this)
    this.node.on('touchend', this.touchEnd, this)
    this.node.on('touchcancel', this.touchEnd, this)
  },

  touchStart () {
    if (this.node.getComponent(cc.Button).interactable != 0) {
      window.audio.getComponent('SoundManager').playEffect('click')

      if (this.pressedScale != 1) {
        this.node.stopAllActions()
        this.node.runAction(this.scaleDownAction)
      }
    }
  },

  touchEnd () {
    if (this.node.getComponent(cc.Button).interactable != 0 && this.pressedScale != 1) {
      this.node.stopAllActions()
      this.node.runAction(this.scaleUpAction)
    }
  }
})
