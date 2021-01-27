var i = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        crateBoomPre: cc.Prefab
    },
    onLoad: function() {
        this._first = !0, this._kills = {}, this.frameCount = 0, this.reflectCount = 0
    },
    start: function() {},
    onBeginContact: function(e, t, n) {},
    onPreSolve: function(e, t, n) {},
    onPostSolve: function(e, t, n) {},
    findSuffer: function() {
        for (var e = cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").getChildren(), t = this.node.position, n = 0; n < e.length; n++)
            if (e[n].name.match("suffer") || e[n].name.match("vip")) {
                var i = e[n].getChildByName("body_1").convertToWorldSpaceAR(cc.v2());
                if (e[n].parent.convertToNodeSpaceAR(i).sub(t).mag() < 200) {
                    var o = e[n];
                    this.killSuffer(o)
                }
            }
    },
    killSuffer: function(e) {
        for (var t = e.position.sub(this.node.position).normalizeSelf(), n = 0; n < e.getChildren().length; n++) {
            var o = e.getChildren()[n],
                a = o.getComponent(cc.RigidBody);
            if ("body" == o.group && a) {
                var s = cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").convertToNodeSpaceAR(o.convertToWorldSpaceAR(cc.v2()));
                a.applyLinearImpulse(t.mulSelf(1.8), s);
                var c = cc.instantiate(e.getChildByName("blood"));
                c.active = !0, c.getComponent(cc.ParticleSystem).resetSystem(), c.parent = o
            }
        }
        cc.systemEvent.emit(i.KILLED, e.name)
    },
    findProp: function() {
        for (var e = cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").getChildren(), t = this.node.position, n = 0; n < e.length; n++)
            if ("prop" == e[n].group || "crossprop" == e[n].group) {
                var i = e[n].convertToWorldSpaceAR(cc.v2());
                e[n].parent.convertToNodeSpaceAR(i).sub(t).mag() < 200 && this.applyToProp(e[n])
            } else if ("box" == e[n].group) {
            i = e[n].convertToWorldSpaceAR(cc.v2());
            e[n].parent.convertToNodeSpaceAR(i).sub(t).mag() < 200 && this.applyToBox(e[n])
        } else if ("boom" == e[n].group) {
            i = e[n].convertToWorldSpaceAR(cc.v2());
            e[n].parent.convertToNodeSpaceAR(i).sub(t).mag() < 200 && this.applyToBoom(e[n])
        }
    },
    applyToProp: function(e) {
        var t = e.position.sub(this.node.position).normalizeSelf();
        e.getComponent(cc.RigidBody).applyForceToCenter(t.mulSelf(1e4))
    },
    applyToBox: function(e) {
        var t = cc.instantiate(this.crateBoomPre);
        t.position = cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").convertToNodeSpaceAR(e.convertToWorldSpaceAR(cc.v2())), t.getComponent(cc.ParticleSystem).autoRemoveOnFinish = !0, t.getComponent(cc.ParticleSystem).resetSystem(), cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").addChild(t), e.removeFromParent()
    },
    applyToBoom: function(e) {
        e.getComponent("Boom").explosive()
    },
    explosive: function() {
        this.findSuffer(), this.findProp();
        var e = cc.instantiate(this.crateBoomPre);
        e.position = cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2())), e.getComponent(cc.ParticleSystem).autoRemoveOnFinish = !0, e.getComponent(cc.ParticleSystem).resetSystem(), cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").addChild(e), window.audio.getComponent("SoundManager").playEffect("bomb"), this.node.removeFromParent()
    },
    update: function(e) {
        this.frameCount++, 180 == this.frameCount && (this.explosive(), window.facade.getComponent("LevelModel").useABullet())
    }
})