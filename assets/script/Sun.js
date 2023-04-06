cc.Class({
  extends: cc.Component,

  start: function () {
    this.node.active = false
  },

  update: function (e) {
    this.node.angle += 10
  }
})
