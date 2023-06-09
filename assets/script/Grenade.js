const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {
    crateBoomPre: cc.Prefab
  },
  onLoad: function () {
    this._first = true
    this._kills = {}
    this.frameCount = 0
    this.reflectCount = 0
  },

  findSuffer: function () {
    const e = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').getChildren()
    const t = this.node.position
    for (let n = 0; n < e.length; n++) {
      if (e[n].name.match('suffer') || e[n].name.match('vip')) {
        const i = e[n].getChildByName('body_1').convertToWorldSpaceAR(cc.v2())
        if (e[n].parent.convertToNodeSpaceAR(i).sub(t).mag() < 200) {
          const o = e[n]
          this.killSuffer(o)
        }
      }
    }
  },

  killSuffer: function (e) {
    const t = e.position.sub(this.node.position).normalizeSelf()
    for (let n = 0; n < e.getChildren().length; n++) {
      const o = e.getChildren()[n]
      const a = o.getComponent(cc.RigidBody)
      if (o.group == 'body' && a) {
        const s = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').convertToNodeSpaceAR(o.convertToWorldSpaceAR(cc.v2()))
        a.applyLinearImpulse(t.mulSelf(1.8), s)
        const c = cc.instantiate(e.getChildByName('blood'))
        c.active = true, c.getComponent(cc.ParticleSystem).resetSystem()
        c.parent = o
      }
    }
    cc.systemEvent.emit(ModuleEventEnum.KILLED, e.name)
  },
  findProp: function () {
    const e = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').getChildren()
    const t = this.node.position
    for (let n = 0; n < e.length; n++) {
      if (e[n].group == 'prop' || e[n].group == 'crossprop') {
        var i = e[n].convertToWorldSpaceAR(cc.v2())
        e[n].parent.convertToNodeSpaceAR(i).sub(t).mag() < 200 && this.applyToProp(e[n])
      } else if (e[n].group == 'box') {
        i = e[n].convertToWorldSpaceAR(cc.v2())
        e[n].parent.convertToNodeSpaceAR(i).sub(t).mag() < 200 && this.applyToBox(e[n])
      } else if (e[n].group == 'boom') {
        i = e[n].convertToWorldSpaceAR(cc.v2())
        e[n].parent.convertToNodeSpaceAR(i).sub(t).mag() < 200 && this.applyToBoom(e[n])
      }
    }
  },
  applyToProp: function (e) {
    const t = e.position.sub(this.node.position).normalizeSelf()
    e.getComponent(cc.RigidBody).applyForceToCenter(t.mulSelf(1e4))
  },
  applyToBox: function (e) {
    const t = cc.instantiate(this.crateBoomPre)
    t.position = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').convertToNodeSpaceAR(e.convertToWorldSpaceAR(cc.v2()))
    t.getComponent(cc.ParticleSystem).autoRemoveOnFinish = true
    t.getComponent(cc.ParticleSystem).resetSystem()
    cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').addChild(t)
    e.removeFromParent()
  },
  applyToBoom: function (e) {
    e.getComponent('Boom').explosive()
  },
  explosive: function () {
    this.findSuffer(), this.findProp()
    const e = cc.instantiate(this.crateBoomPre)
    e.position = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2()))
    e.getComponent(cc.ParticleSystem).autoRemoveOnFinish = true
    e.getComponent(cc.ParticleSystem).resetSystem()
    cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').addChild(e)
    window.audio.getComponent('SoundManager').playEffect('bomb')
    this.node.removeFromParent()
  },
  update: function (e) {
    this.frameCount++
    this.frameCount == 180 && (this.explosive(), window.facade.getComponent('LevelModel').useABullet())
  }
})
