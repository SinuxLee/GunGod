cc.Class({
  extends: cc.Component,
  properties: {
    target: cc.Node
  },

  start: function () {
    this.offSKin = this.node.getComponent(cc.Sprite).spriteFrame.name
    this.onSKin = this.offSKin.replace('01', '02')
    cc.loader.getRes('roles', cc.SpriteAtlas) ? this.rolesAtlas = cc.loader.getRes('roles', cc.SpriteAtlas) : cc.loader.loadRes('roles', cc.SpriteAtlas)
  },
  onBeginContact: function (e, t, n) {
    this.rolesAtlas || (this.rolesAtlas = cc.loader.getRes('roles', cc.SpriteAtlas)), t.node.group == 'switch' && n.node.group != 'border' && (e.disabled = true, this.node.getComponent(cc.Sprite).spriteFrame = this.rolesAtlas.getSpriteFrame(this.onSKin), this.trigger(n.node))
  },
  trigger: function (e) {
    this.trigged != 1 && (this.trigged = true, this.target.group == 'boom' ? this.target.getComponent('Boom').explosive() : this.target.group == 'magic' && this.target.getComponent('Magic').trigger())
  },
  onPreSolve: function (e, t, n) {}
})
