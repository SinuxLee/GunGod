cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {},
  start: function () {
    this.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(2, 0.9), cc.scaleTo(2, 1.6))))
    this.node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(1, 0), cc.fadeTo(1, 80))))
  },
  update: function (e) {
    this.node.angle += 200 * e
  }
})
