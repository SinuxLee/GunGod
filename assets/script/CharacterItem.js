const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {
    man: cc.Sprite,
    frame: cc.Sprite,
    frameSkin1: cc.SpriteFrame,
    frameSkin2: cc.SpriteFrame,
    effect: cc.Node,
    freeIcon: cc.Node
  },
  onLoad: function () {
    this.node.opacity = 0, cc.systemEvent.on(i.CHARACTER_GOT, this.characterGot, this)
  },
  start: function () {
    this.init()
  },
  init: function () {
    cc.loader.getRes('roles', cc.SpriteAtlas) ? this.initSkins() : cc.loader.loadRes('roles', cc.SpriteAtlas, this.onAtlasLoad.bind(this)), this.config = window.facade.getComponent('GameModel').charaterConfig[String(this.node.data)], facade.getComponent('GameModel').isCharacterLocked(this.node.data) ? this.freeIcon.active = this.config.CostType == 2 : this.freeIcon.active = !1
  },
  onAtlasLoad: function () {
    this.initSkins()
  },
  initSkins: function () {
    this.node.runAction(cc.fadeIn(0.2))
    const e = cc.loader.getRes('roles', cc.SpriteAtlas)
    this.man.spriteFrame = e.getSpriteFrame('Role_0' + this.node.data + '_head')
  },
  characterGot: function (e) {
    e == this.node.data && (this.effect.active = !0, this.effect.getComponent(cc.ParticleSystem).resetSystem())
  },
  onClick: function () {
    console.log('click...', this.node.data)
  },
  update: function (e) {
    !this.node.selection || this.node.selection <= 1.2 ? this.frame.spriteFrame = this.frameSkin1 : this.frame.spriteFrame = this.frameSkin2
  }
})
