cc.Class({
  extends: cc.Component,
  properties: {
    target: cc.Node
  },

  trigger: function () {
    this.target && (this.target.active = true), this.node.removeFromParent()
  }
})
