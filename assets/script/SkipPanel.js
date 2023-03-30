const ModuleEventEnum = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {
    skipButton: cc.Sprite,
    skipByShareSkin: cc.SpriteFrame,
    skipByVedioSkin: cc.SpriteFrame,
    recommendPre: cc.Prefab
  },

  onEnable: function () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e4
  },
  initRecommond: function () {},
  init: function () {
    this.rewardType = window.facade.getComponent('ShareADModel').getShareADType()
    this.rewardType != 2 ? this.skipButton.spriteFrame = this.skipByVedioSkin : this.skipButton.spriteFrame = this.skipByShareSkin, this.initRecommond()
  },
  hide: function () {
    this.node.parent.getComponent('LevelUI').hideSkip()
  },
  onDisable: function () {
    this.inited = false
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').active = true
  },
  skip: function () {
    if (!facade.isMiniGame) {
      this.hide()
      cc.systemEvent.emit(ModuleEventEnum.SKIP)
      return
    }
    if (this.rewardType > 2) popUp.getComponent('FloatTip').showTip('已经超出今天的跳关上限啦！')
    else {
      const e = {
        inviteId: 1528,
        videoId: 21102,
        assistId: 0,
        interstitalId: 31102
      }
      window.facade.getComponent('ShareADModel').showShareAD(e, {
        succ: function (e) {
          console.log('跳关分享成功:', e)
          this.hide()
          cc.systemEvent.emit(ModuleEventEnum.SKIP)
        }.bind(this),
        fail: function (e, t) {
          popUp.getComponent('FloatTip').showTip(e)
        }
      })
    }
  }
})
