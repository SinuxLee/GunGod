require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        target: cc.Node
    },
    onLoad: function() {},
    start: function() {
        this.offSKin = this.node.getComponent(cc.Sprite).spriteFrame.name, this.onSKin = this.offSKin.replace("01", "02"), cc.loader.getRes("roles", cc.SpriteAtlas) ? this.rolesAtlas = cc.loader.getRes("roles", cc.SpriteAtlas) : cc.loader.loadRes("roles", cc.SpriteAtlas)
    },
    onBeginContact: function(e, t, n) {
        this.rolesAtlas || (this.rolesAtlas = cc.loader.getRes("roles", cc.SpriteAtlas)), "switch" == t.node.group && "border" != n.node.group && (e.disabled = !0, this.node.getComponent(cc.Sprite).spriteFrame = this.rolesAtlas.getSpriteFrame(this.onSKin), this.trigger(n.node))
    },
    trigger: function(e) {
        1 != this.trigged && (this.trigged = !0, "boom" == this.target.group ? this.target.getComponent("Boom").explosive() : "magic" == this.target.group && this.target.getComponent("Magic").trigger())
    },
    onPreSolve: function(e, t, n) {},
    update: function(e) {}
})