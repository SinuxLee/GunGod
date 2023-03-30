cc.Class({
  extends: cc.Component,
  properties: {
    itemPre: cc.Prefab,
    gird: cc.Node,
    mask: cc.Node,
    bg: cc.Sprite
  },
  onLoad: function () {},
  start: function () {
    this._data = this.node.data, this.currentLevel = window.facade.getComponent('LevelModel').getUnlockedLevelByType(facade.selectedLevelType), this._data[0].Level > this.currentLevel && (this.locked = !0, this.mask.active = !0)
    for (let e = 0; e < this._data.length; e++) {
      const t = cc.instantiate(this.itemPre)
      t.config = this._data[e], t.currentLevel = this.currentLevel, this.gird.addChild(t)
    }
    this.chapterId = Math.floor(this._data[0].Level / 15) + 1, this.bgSkinUrl = 'scene/Scene_BG_' + this.chapterId, cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame) ? this.bg.spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame) : cc.loader.loadRes(this.bgSkinUrl, cc.SpriteFrame, this.onSkinLoaded.bind(this))
  },
  onSkinLoaded: function (e, t) {
    this.bg.spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame)
  },
  update: function (e) {}
})
