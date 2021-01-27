require('MathUtils');
cc.Class({
    extends: cc.Component,
    properties: {
        handGun: cc.Node,
        grenadePre: cc.Prefab,
        powerLine: cc.Node,
        powerPoint: cc.Node,
        grenadeInHand: cc.Node,
        isInUI: !1,
        hand: cc.Node
    },
    onLoad: function() {
        this.isInUI || (this.aim = new cc.Node, this.aim.addComponent(cc.Sprite), this.aim.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("roles", cc.SpriteAtlas).getSpriteFrame("aim"), this.handGun.addChild(this.aim, 999), this.aim.active = !1, this.aim.scale = .5, this.aim.y = 10)
    },
    start: function() {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this), this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this), this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this), this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this), this.powerPoints = []
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
        this._inTouch = !0, this.gunPos = this.handGun.convertToWorldSpaceAR(cc.v2()), this.gunDir = t.sub(this.gunPos);
        var n = this.gunDir.signAngle(cc.v2(1, 0));
        this.handGun.angle = -n / Math.PI * 180, this.powerLine && (this.powerLine.active = !0)
    },
    onTouchMove: function(e) {
        var t = e.getLocation();
        if (this._inTouch) {
            this.gunPos = this.handGun.convertToWorldSpaceAR(cc.v2()), this.gunDir = t.sub(this.gunPos), this.gunDis = this.gunDir.mag();
            var n = this.gunDir.signAngle(cc.v2(1, 0));
            this.handGun.angle = -n / Math.PI * 180, this.aim && (this.aim.active = !0, this.aim.x = this.gunDis);
            for (var i = 0; i < this.powerPoints.length; i++) this.powerPoints[i].removeFromParent();
            this.powerPoints = [];
            var o = (this.gunDis - 150) / 30;
            o > 12 && (o = 12);
            for (i = 0; i < o; i++) {
                var a = cc.instantiate(this.powerPoint);
                this.powerLine.addChild(a), this.powerPoints.push(a), a.scale = 1 + .25 * i
            }
        }
    },
    onTouchEnd: function(e) {
        this.isInUI ? this.createAGrenade() : (this.aim && (this.aim.active = !1), window.facade.getComponent("Facade").levelPassed || (facade.getComponent("LevelModel").shotedBullets >= facade.getComponent("LevelModel").bulletFilled ? window.audio.getComponent("SoundManager").playEffect("empty") : (this.createAGrenade(), window.facade.getComponent("LevelModel").shotABullet(), this.powerLine && (this.powerLine.active = !1), this.pitchAction())))
    },
    pitchAction: function() {
        this.grenadeInHand.active = !1;
        var e = cc.rotateBy(.5, 360);
        e.easing(cc.easeSineOut()), this.handGun.runAction(cc.sequence(e, cc.callFunc(function() {
            this.grenadeInHand.active = !0
        }, this)))
    },
    createAGrenade: function() {
        var e = cc.instantiate(this.grenadePre);
        e.position = this.node.parent.convertToNodeSpaceAR(this.hand.convertToWorldSpaceAR(cc.v2()));
        var t = this.gunDir.normalizeSelf();
        this.node.parent.addChild(e), e.getComponent(cc.RigidBody).applyForceToCenter(t.mulSelf(300 * this.powerPoints.length)), this._inTouch = !1
    },
    onTouchCancel: function(e) {
        e.getLocation();
        this._inTouch = !1, this.handGun.angle = -90, this.powerLine && (this.powerLine.active = !1), this.aim && (this.aim.active = !1)
    },
    update: function(e) {}
})