const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,

  onBeginContact (contact, self, other) {
    if (self.node.group == 'border' && other.node.group == 'body') {
      cc.v2(other.body._b2Body.m_linearVelocity.x, other.body._b2Body.m_linearVelocity.y).mag() > 2 && this.killSuffer(other.node)
    }
  },

  killSuffer (node) {
    if (!this.suffer) {
      this.suffer = node.parent

      const blood = cc.instantiate(this.suffer.getChildByName('blood'))
      blood.active = true
      blood.getComponent(cc.ParticleSystem).resetSystem()
      blood.parent = node

      cc.systemEvent.emit(ModuleEventEnum.KILLED, this.suffer.name)
    }
  }
})
