cc.Class({
  extends: cc.Component,
  properties: {
    handGun: cc.Node,
    muzzel: cc.Node,
    line: cc.Node,
    bulletPre: cc.Prefab,
    smoke: cc.ParticleSystem,
    isInUI: false,
    isSuffer: false
  },

  onLoad: function () {
    if (this.isInUI || this.isSuffer) return

    this.aim = new cc.Node()
    this.aim.addComponent(cc.Sprite)
    this.aim.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes('roles', cc.SpriteAtlas).getSpriteFrame('aim')
    this.handGun.addChild(this.aim, 999)
    this.aim.active = false
    this.aim.scale = 0.5
    this.aim.y = 10
  },

  start: function () {
    this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
  },

  onEnable: function () {
    this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
  },

  onDisable: function () {
    this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
  },

  onDestroy: function () {
    this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
  },

  onTouchStart: function (e) {
    const t = e.getLocation()
    this._inTouch = true
    if (!this.isInUI) {
      this.line.active = true
      this.line.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5))))
    }
    this.gunPos = this.handGun.convertToWorldSpaceAR(cc.v2())
    this.gunDir = t.sub(this.gunPos)

    const n = this.gunDir.signAngle(cc.v2(1, 0))
    this.handGun.angle = -n / Math.PI * 180
  },

  onTouchMove: function (e) {
    const t = e.getLocation()
    if (this._inTouch) {
      this.gunPos = this.handGun.convertToWorldSpaceAR(cc.v2())
      this.gunDir = t.sub(this.gunPos)
      const n = this.gunDir.signAngle(cc.v2(1, 0))
      this.handGun.angle = -n / Math.PI * 180
      this.aim && (this.aim.active = true, this.aim.x = this.gunDir.mag())
    }
  },

  onTouchEnd: function (e) {
    this.isInUI ? this.createAbullet() : (this.aim && (this.aim.active = false), window.facade.getComponent('Facade').levelPassed || (facade.getComponent('LevelModel').shotedBullets >= facade.getComponent('LevelModel').bulletFilled ? window.audio.getComponent('SoundManager').playEffect('empty') : (this.createAbullet(), window.facade.getComponent('LevelModel').shotABullet())))
  },

  createAbullet: function () {
    const e = cc.instantiate(this.bulletPre)
    e.position = this.node.parent.convertToNodeSpaceAR(this.muzzel.convertToWorldSpaceAR(cc.v2()))
    const t = this.gunDir.normalizeSelf()
    e.getComponent(cc.RigidBody).linearVelocity = t.mulSelf(2e3)
    e.angle = this.handGun.angle
    e.master = this.node.name
    this.node.parent.addChild(e)
    window.audio.getComponent('SoundManager').playEffect('shoot')
    this._inTouch = false
    this.smoke.resetSystem()
    this.line.stopAllActions()
    this.line.active = false
  },

  onTouchCancel: function (e) {
    e.getLocation()
    this._inTouch = false
    this.line.stopAllActions()
    this.line.active = false
    this.handGun.angle = -90
  }
})
