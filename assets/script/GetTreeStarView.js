let i

function o (e, t, n) {
  return t in e
    ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    })
    : e[t] = n, e
}
const a = require('ModuleEventEnum')
require('CommonFunc')
cc.Class((o(i = {
  extends: cc.Component,
  properties: {
    btn: cc.Sprite,
    shareSkin: cc.SpriteFrame,
    videoSkin: cc.SpriteFrame,
    aimLabel: cc.Sprite,
    threeStarLabel: cc.SpriteFrame,
    jumpLevelLabel: cc.SpriteFrame,
    titleLabel: cc.Sprite,
    threeStarTitle: cc.SpriteFrame,
    jumpLevelTitle: cc.SpriteFrame
  },
  onLoad: function () {
    this.frameCount = 0
  },
  initData: function (e) {
    this.titleLabelFlag = e, this.addValue = 20
  },
  start: function () {
    this.rewardType = window.facade.getComponent('ShareADModel').getShareADType(), this.rewardType != 2 ? this.btn.spriteFrame = this.videoSkin : this.btn.spriteFrame = this.shareSkin, this.titleLabelFlag != 2 ? (this.titleLabel.spriteFrame = this.threeStarTitle, this.aimLabel.spriteFrame = this.threeStarLabel) : (this.titleLabel.spriteFrame = this.jumpLevelTitle, this.aimLabel.spriteFrame = this.jumpLevelLabel)
  },
  onEnable: function () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e5
  },
  onDisable: function () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1
  },
  close: function () {
    window.popUp.getComponent('Pop').removeTop()
  }
}, 'onDisable', function () {
  cc.systemEvent.emit(a.BACK_ENERGY_CLOSED)
}), o(i, 'comfirm', function () {
  const e = {
    inviteId: 1529,
    videoId: 21104,
    assistId: 0,
    interstitalId: 31103
  }
  window.facade.getComponent('ShareADModel').showShareAD(e, {
    succ: function (e) {
      cc.systemEvent.emit(a.STAR_JUMP_CHANGE, this.titleLabelFlag), window.popUp.getComponent('Pop').removeTop()
    }.bind(this),
    fail: function (e, t) {
      popUp.getComponent('FloatTip').showTip(e)
    }
  })
}), o(i, 'update', function (e) {
  this.frameCount++
}), i))
