const i = require('SpriteFrameSet')
cc.Class({
  extends: cc.Component,
  editor: {
    executeInEditMode: !0,
    inspector: 'packages://i18n/inspector/localized-sprite.js',
    menu: 'i18n/LocalizedSprite'
  },
  properties: {
    spriteFrameSet: {
      default: [],
      type: i
    }
  },
  onLoad: function () {
    this.fetchRender()
  },
  fetchRender: function () {
    const e = this.getComponent(cc.Sprite)
    if (e) return this.sprite = e, void this.updateSprite(window.i18n.curLang)
  },
  getSpriteFrameByLang: function (e) {
    for (let t = 0; t < this.spriteFrameSet.length; ++t) { if (this.spriteFrameSet[t].language === e) return this.spriteFrameSet[t].spriteFrame }
  },
  updateSprite: function (e) {
    if (this.sprite) {
      let t = this.getSpriteFrameByLang(e)
      !t && this.spriteFrameSet[0] && (t = this.spriteFrameSet[0].spriteFrame), this.sprite.spriteFrame = t
    } else cc.error('Failed to update localized sprite, sprite component is invalid!')
  }
})
