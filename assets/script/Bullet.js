const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {
    crateBoomPre: cc.Prefab
  },
  onLoad: function () {
    this._first = !0, this._kills = {}, this.frameCount = 0, this.reflectCount = 0
  },
  start: function () {
    this.node.master.match('suffer') && (this.node.getChildByName('tail').getComponent(cc.MotionStreak).color = cc.color(255, 255, 255))
  },
  onBeginContact: function (e, t, n) {
    if (t.node.group == 'bullet' && n.node.group == 'body') {
      if (this._kills[n.node.parent.name]);
      else {
        if (this.reflectCount <= 0 && n.node.parent.name == 'role') return
        if (this._hitman = n.node.parent, this.hit = !0, this.out = !1, this._hitman && this._hitman.getChildByName('blood')) {
          const o = cc.instantiate(this._hitman.getChildByName('blood'))
          o.active = !0, o.getComponent(cc.ParticleSystem).resetSystem(), o.parent = n.node
        }
      }
      return this._kills[n.node.parent.name] = !0, void cc.systemEvent.emit(i.KILLED, n.node.parent.name)
    }
    if (t.node.group == 'bullet' && this._first && (n.node.group == 'border' || n.node.group == 'prop')) {
      const a = cc.instantiate(cc.director.getScene().getChildByName('Canvas').getChildByName('hitEarth'))
      a.position = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').convertToNodeSpaceAR(t.node.convertToWorldSpaceAR(cc.v2())), a.getComponent(cc.ParticleSystem).autoRemoveOnFinish = !0, a.getComponent(cc.ParticleSystem).resetSystem(), cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').addChild(a), this._first = !1
    }
    this.reflectCount++, window.audio.getComponent('SoundManager').playEffect('reflect'), this.reflectCount > 20 && (window.facade.getComponent('LevelModel').useABullet(), this.node.removeFromParent())
  },
  onPreSolve: function (e, t, n) {
    if (t.node.group == 'bullet' && n.node.group == 'body') return this.out ? void (e.disabled = !0) : (e.disabled = !0, void n.node.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(1e4, 1e4)))
    if (t.body.isCross = !1, t.node.group == 'bullet' && n.node.group == 'box') {
      const i = cc.instantiate(this.crateBoomPre)
      i.position = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').convertToNodeSpaceAR(n.node.convertToWorldSpaceAR(cc.v2())), i.getComponent(cc.ParticleSystem).autoRemoveOnFinish = !0, i.getComponent(cc.ParticleSystem).resetSystem(), cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay').addChild(i), n.node.removeFromParent()
    }
  },
  onPostSolve: function (e, t, n) {
    t.node.group == 'bullet' && n.node.group == 'body' && (e.disabled = !0, this.out = !0), t.body.isCross = !1
  },
  update: function (e) {
    this.frameCount++
    const t = this.node.convertToWorldSpaceAR(cc.v2());
    (t.x < -500 || t.x > 1300 || t.y <= -500 || t.y > 2e3) && (window.facade.getComponent('LevelModel').useABullet(), this.node.removeFromParent())
  }
})
