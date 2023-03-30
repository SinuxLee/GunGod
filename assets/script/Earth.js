const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {},
  start: function () {},
  onBeginContact: function (e, t, n) {
    t.node.group == 'border' && n.node.group == 'body' && (cc.v2(n.body._b2Body.m_linearVelocity.x, n.body._b2Body.m_linearVelocity.y).mag() > 2 && this.killSuffer(n.node))
  },
  onPreSolve: function (e, t, n) {},
  onPostSolve: function (e, t, n) {},
  killSuffer: function (e) {
    if (!this.suffer) {
      this.suffer = e.parent
      const t = cc.instantiate(this.suffer.getChildByName('blood'))
      t.active = !0, t.getComponent(cc.ParticleSystem).resetSystem(), t.parent = e, cc.systemEvent.emit(i.KILLED, this.suffer.name)
    }
  }
})