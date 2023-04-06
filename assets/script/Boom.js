const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {
    boomPre: cc.Prefab
  },

  onBeginContact (contact, self, other) {
    if (self.node.group != 'boom') return
    switch (other.node.group) {
      case 'bullet':
        this.explosive()
        break
      case 'body':
      case 'boom':
        const x = self.body._b2Body.m_linearVelocity.x - other.body._b2Body.m_linearVelocity.x
        const y = self.body._b2Body.m_linearVelocity.y - -other.body._b2Body.m_linearVelocity.y
        if (cc.v2(x, y).mag() > 2) this.explosive()
        break
    }
  },

  // 爆炸物
  explosive () {
    this.expolosiveAnimate()
    this.findSuffer()
    this.node.removeFromParent()
    window.audio.getComponent('SoundManager').playEffect('bomb')
  },

  findSuffer () {
    const levelType = window.facade.selectedLevelType
    let newType = 'other'
    levelType == 'vip' && (newType = 'vip')
    levelType == 'injury' && (newType = 'role')

    const nodes = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').getChildren()
    const pos = this.node.position

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].name.match('suffer') || nodes[i].name.match(newType)) {
        if (nodes[i].position.sub(pos).mag() < 2 * this.node.width) {
          this.killSuffer(nodes[i])
        }
      }
    }
  },

  killSuffer (node) {
    const vec = node.position.sub(this.node.position).normalizeSelf()
    for (let i = 0; i < node.getChildren().length; i++) {
      const childNode = node.getChildren()[i]
      const rigidBody = childNode.getComponent(cc.RigidBody)
      if (childNode.group == 'body' && rigidBody) {
        const point = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').convertToNodeSpaceAR(childNode.convertToWorldSpaceAR(cc.v2()))
        rigidBody.applyLinearImpulse(vec.mulSelf(1.8), point)

        const blood = cc.instantiate(node.getChildByName('blood'))
        blood.active = true
        blood.getComponent(cc.ParticleSystem).resetSystem()
        blood.parent = childNode
      }
    }
    cc.systemEvent.emit(ModuleEventEnum.KILLED, node.name)
  },

  expolosiveAnimate () {
    const boomNode = cc.instantiate(this.boomPre)
    boomNode.position = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2()))
    boomNode.getComponent(cc.ParticleSystem).autoRemoveOnFinish = true
    boomNode.getComponent(cc.ParticleSystem).resetSystem()
    cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').addChild(boomNode)
  }
})
