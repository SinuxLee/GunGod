require('MathUtils');
cc.Class({
    extends: cc.Component,
    properties: {
        handGun: cc.Node,
        muzzel: cc.Node,
        line: cc.Node,
        bulletPre: cc.Prefab,
        smoke: cc.ParticleSystem,
        isInUI: !1,
        isSuffer: !1
    },
    onLoad: function() {
        this.isInUI || this.isSuffer || (this.aim = new cc.Node, this.aim.addComponent(cc.Sprite), this.aim.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("roles", cc.SpriteAtlas).getSpriteFrame("aim"), this.handGun.addChild(this.aim, 999), this.aim.active = !1, this.aim.scale = .5, this.aim.y = 10)
    },
    start: function() {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this), this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this), this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this), this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    },
    onEnable: function() {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this), this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this), this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this), this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    },
    onDisable: function() {
        this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this), this.node.parent.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this), this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this), this.node.parent.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    },
    onDestroy: function() {
        this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this), this.node.parent.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this), this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this), this.node.parent.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    },
    onTouchStart: function(e) {
        var t = e.getLocation();
        this._inTouch = !0, this.isInUI || (this.line.active = !0, this.line.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(.5), cc.fadeOut(.5))))), this.gunPos = this.handGun.convertToWorldSpaceAR(cc.v2()), this.gunDir = t.sub(this.gunPos);
        var n = this.gunDir.signAngle(cc.v2(1, 0));
        this.handGun.angle = -n / Math.PI * 180
    },
    onTouchMove: function(e) {
        var t = e.getLocation();
        if (this._inTouch) {
            this.gunPos = this.handGun.convertToWorldSpaceAR(cc.v2()), this.gunDir = t.sub(this.gunPos);
            var n = this.gunDir.signAngle(cc.v2(1, 0));
            this.handGun.angle = -n / Math.PI * 180, this.aim && (this.aim.active = !0, this.aim.x = this.gunDir.mag())
        }
    },
    onTouchEnd: function(e) {
        this.isInUI ? this.createAbullet() : (this.aim && (this.aim.active = !1), window.facade.getComponent("Facade").levelPassed || (facade.getComponent("LevelModel").shotedBullets >= facade.getComponent("LevelModel").bulletFilled ? window.audio.getComponent("SoundManager").playEffect("empty") : (this.createAbullet(), window.facade.getComponent("LevelModel").shotABullet())))
    },
    createAbullet: function() {
        var e = cc.instantiate(this.bulletPre);
        e.position = this.node.parent.convertToNodeSpaceAR(this.muzzel.convertToWorldSpaceAR(cc.v2()));
        var t = this.gunDir.normalizeSelf();
        e.getComponent(cc.RigidBody).linearVelocity = t.mulSelf(2e3), e.angle = this.handGun.angle, e.master = this.node.name, this.node.parent.addChild(e), window.audio.getComponent("SoundManager").playEffect("shoot"), this._inTouch = !1, this.smoke.resetSystem(), this.line.stopAllActions(), this.line.active = !1
    },
    onTouchCancel: function(e) {
        e.getLocation();
        this._inTouch = !1, this.line.stopAllActions(), this.line.active = !1, this.handGun.angle = -90
    },
    update: function(e) {}
})