const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,

  onBeginContact (contact, self, other) {
    if(self.node.group == 'prop' && other.node.group == 'body') {
      const x = self.body._b2Body.m_linearVelocity.x - other.body._b2Body.m_linearVelocity.x
      const y = self.body._b2Body.m_linearVelocity.y - -other.body._b2Body.m_linearVelocity.y

      if(cc.v2(x, y).mag() > 2) this.killSuffer(other.node)
    }
  },

  killSuffer (node) {
    if (!this.suffer || this.suffer != node.parent) {
      this.suffer = node.parent
      
      const blood = cc.instantiate(this.suffer.getChildByName('blood'))
      blood.active = true
      blood.getComponent(cc.ParticleSystem).resetSystem()
      blood.parent = node

      cc.systemEvent.emit(ModuleEventEnum.KILLED, this.suffer.name)
    }
  }
})
