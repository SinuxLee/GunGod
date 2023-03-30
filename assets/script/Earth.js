const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,

  onBeginContact: function (e, t, n) {
    t.node.group == 'border' && n.node.group == 'body' && (cc.v2(n.body._b2Body.m_linearVelocity.x, n.body._b2Body.m_linearVelocity.y).mag() > 2 && this.killSuffer(n.node))
  },

  killSuffer: function (e) {
    if (!this.suffer) {
      this.suffer = e.parent
      const t = cc.instantiate(this.suffer.getChildByName('blood'))
      t.active = true
      t.getComponent(cc.ParticleSystem).resetSystem()
      t.parent = e
      cc.systemEvent.emit(ModuleEventEnum.KILLED, this.suffer.name)
    }
  }
})
