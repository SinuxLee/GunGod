const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {
    boomPre: cc.Prefab
  },

  onBeginContact: function (e, t, n) {
    if (t.node.group == 'boom' && n.node.group == 'bullet') this.explosive()
    else if (t.node.group == 'boom' && n.node.group == 'body') {
      cc.v2(t.body._b2Body.m_linearVelocity.x - n.body._b2Body.m_linearVelocity.x, t.body._b2Body.m_linearVelocity.y - -n.body._b2Body.m_linearVelocity.y).mag() > 2 && this.explosive()
    } else if (t.node.group == 'boom' && n.node.group == 'boom') {
      cc.v2(t.body._b2Body.m_linearVelocity.x - n.body._b2Body.m_linearVelocity.x, t.body._b2Body.m_linearVelocity.y - -n.body._b2Body.m_linearVelocity.y).mag() > 2 && this.explosive()
    }
  },

  explosive: function () {
    this.expolosiveAnimate()
    this.findSuffer()
    this.node.removeFromParent()
    window.audio.getComponent('SoundManager').playEffect('bomb')
  },

  findSuffer: function () {
    const e = window.facade.selectedLevelType
    let t = 'other'
    e == 'vip' && (t = 'vip'), e == 'injury' && (t = 'role')
    for (let n = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').getChildren(), i = this.node.position, o = 0; o < n.length; o++) {
      if (n[o].name.match('suffer') || n[o].name.match(t)) {
        if (n[o].position.sub(i).mag() < 2 * this.node.width) {
          const a = n[o]
          this.killSuffer(a)
        }
      }
    }
  },

  killSuffer: function (e) {
    for (let t = e.position.sub(this.node.position).normalizeSelf(), n = 0; n < e.getChildren().length; n++) {
      const o = e.getChildren()[n]
      const a = o.getComponent(cc.RigidBody)
      if (o.group == 'body' && a) {
        const s = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').convertToNodeSpaceAR(o.convertToWorldSpaceAR(cc.v2()))
        a.applyLinearImpulse(t.mulSelf(1.8), s)
        const c = cc.instantiate(e.getChildByName('blood'))
        c.active = true
        c.getComponent(cc.ParticleSystem).resetSystem()
        c.parent = o
      }
    }
    cc.systemEvent.emit(ModuleEventEnum.KILLED, e.name)
  },

  expolosiveAnimate: function () {
    const e = cc.instantiate(this.boomPre)
    e.position = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2()))
    e.getComponent(cc.ParticleSystem).autoRemoveOnFinish = true
    e.getComponent(cc.ParticleSystem).resetSystem()
    cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').addChild(e)
  }
})
