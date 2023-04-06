cc.Class({
  extends: cc.Component,
  properties: {
    target: cc.Node
  },

  start () {
    this.offSKin = this.node.getComponent(cc.Sprite).spriteFrame.name
    this.onSKin = this.offSKin.replace('01', '02')

    const res = cc.loader.getRes('roles', cc.SpriteAtlas)
    if (res) this.rolesAtlas = res
    else cc.loader.loadRes('roles', cc.SpriteAtlas)
  },

  onBeginContact (contact, self, other) {
    if (this.rolesAtlas == null) this.rolesAtlas = cc.loader.getRes('roles', cc.SpriteAtlas)

    if (self.node.group == 'switch' && other.node.group != 'border') {
      contact.disabled = true
      this.node.getComponent(cc.Sprite).spriteFrame = this.rolesAtlas.getSpriteFrame(this.onSKin)
      this.trigger(other.node)
    }
  },

  trigger (node) {
    if (this.trigged == false) {
      this.trigged = true
      if (this.target.group == 'boom') this.target.getComponent('Boom').explosive()
      else if (this.target.group == 'magic') this.target.getComponent('Magic').trigger()
    }
  }
})
