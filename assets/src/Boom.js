var i = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        boomPre: cc.Prefab
    },
    onLoad: function() {},
    start: function() {},
    onBeginContact: function(e, t, n) {
        if ("boom" == t.node.group && "bullet" == n.node.group) this.explosive();
        else if ("boom" == t.node.group && "body" == n.node.group) {
            cc.v2(t.body._b2Body.m_linearVelocity.x - n.body._b2Body.m_linearVelocity.x, t.body._b2Body.m_linearVelocity.y - -n.body._b2Body.m_linearVelocity.y).mag() > 2 && this.explosive()
        } else if ("boom" == t.node.group && "boom" == n.node.group) {
            cc.v2(t.body._b2Body.m_linearVelocity.x - n.body._b2Body.m_linearVelocity.x, t.body._b2Body.m_linearVelocity.y - -n.body._b2Body.m_linearVelocity.y).mag() > 2 && this.explosive()
        }
    },
    explosive: function() {
        this.expolosiveAnimate(), this.findSuffer(), this.node.removeFromParent(), window.audio.getComponent("SoundManager").playEffect("bomb")
    },
    onPreSolve: function(e, t, n) {},
    findSuffer: function() {
        var e = window.facade.selectedLevelType,
            t = "other";
        "vip" == e && (t = "vip"), "injury" == e && (t = "role");
        for (var n = cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").getChildren(), i = this.node.position, o = 0; o < n.length; o++) {
            if (n[o].name.match("suffer") || n[o].name.match(t))
                if (n[o].position.sub(i).mag() < 2 * this.node.width) {
                    var a = n[o];
                    this.killSuffer(a)
                }
        }
    },
    onPostSolve: function(e, t, n) {},
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
    expolosiveAnimate: function() {
        var e = cc.instantiate(this.boomPre);
        e.position = cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2())), e.getComponent(cc.ParticleSystem).autoRemoveOnFinish = !0, e.getComponent(cc.ParticleSystem).resetSystem(), cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").addChild(e)
    },
    update: function(e) {}
})