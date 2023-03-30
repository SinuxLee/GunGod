cc.Class({
  extends: cc.Component,
  properties: {
    handGun: cc.Node,
    grenadePre: cc.Prefab,
    powerLine: cc.Node,
    powerPoint: cc.Node,
    grenadeInHand: cc.Node,
    isInUI: false,
    hand: cc.Node
  },
  onLoad: function () {
    if (this.isInUI) return
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
    this.powerPoints = []
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
    this.gunPos = this.handGun.convertToWorldSpaceAR(cc.v2())
    this.gunDir = t.sub(this.gunPos)
    const n = this.gunDir.signAngle(cc.v2(1, 0))
    this.handGun.angle = -n / Math.PI * 180
    this.powerLine && (this.powerLine.active = true)
  },
  onTouchMove: function (e) {
    const t = e.getLocation()
    if (this._inTouch) {
      this.gunPos = this.handGun.convertToWorldSpaceAR(cc.v2())
      this.gunDir = t.sub(this.gunPos)
      this.gunDis = this.gunDir.mag()
      const n = this.gunDir.signAngle(cc.v2(1, 0))
      this.handGun.angle = -n / Math.PI * 180
      this.aim && (this.aim.active = true, this.aim.x = this.gunDis)
      for (var i = 0; i < this.powerPoints.length; i++) this.powerPoints[i].removeFromParent()
      this.powerPoints = []
      let o = (this.gunDis - 150) / 30
      o > 12 && (o = 12)
      for (i = 0; i < o; i++) {
        const a = cc.instantiate(this.powerPoint)
        this.powerLine.addChild(a)
        this.powerPoints.push(a)
        a.scale = 1 + 0.25 * i
      }
    }
  },
  onTouchEnd: function (e) {
    this.isInUI ? this.createAGrenade() : (this.aim && (this.aim.active = false), window.facade.getComponent('Facade').levelPassed || (facade.getComponent('LevelModel').shotedBullets >= facade.getComponent('LevelModel').bulletFilled ? window.audio.getComponent('SoundManager').playEffect('empty') : (this.createAGrenade(), window.facade.getComponent('LevelModel').shotABullet(), this.powerLine && (this.powerLine.active = false), this.pitchAction())))
  },
  pitchAction: function () {
    this.grenadeInHand.active = false
    const e = cc.rotateBy(0.5, 360)
    e.easing(cc.easeSineOut()), this.handGun.runAction(cc.sequence(e, cc.callFunc(function () {
      this.grenadeInHand.active = true
    }, this)))
  },
  createAGrenade: function () {
    const e = cc.instantiate(this.grenadePre)
    e.position = this.node.parent.convertToNodeSpaceAR(this.hand.convertToWorldSpaceAR(cc.v2()))
    const t = this.gunDir.normalizeSelf()
    this.node.parent.addChild(e)
    e.getComponent(cc.RigidBody).applyForceToCenter(t.mulSelf(300 * this.powerPoints.length))
    this._inTouch = false
  },
  onTouchCancel: function (e) {
    e.getLocation()
    this._inTouch = false
    this.handGun.angle = -90
    this.powerLine && (this.powerLine.active = false)
    this.aim && (this.aim.active = false)
  }
})
