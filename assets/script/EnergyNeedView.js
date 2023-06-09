cc.Class({
  extends: cc.Component,
  properties: {
    btn: cc.Sprite,
    shareSkin: cc.SpriteFrame,
    videoSkin: cc.SpriteFrame,
    title: cc.Label
  },

  onLoad: function () {
    this.frameCount = 0
  },

  start: function () {
    this.rewardType = window.facade.getComponent('ShareADModel').getShareADType()
    this.rewardType != 2 ? (this.btn.spriteFrame = this.videoSkin, this.title.string = '观看视频获得') : (this.btn.spriteFrame = this.shareSkin, this.title.string = '分享给朋友们获得')
  },

  close: function () {
    window.popUp.getComponent('Pop').removeTop()
  },

  onDisable: function () {
    window.facade.getComponent('BannerModel').hideBanner()
  },

  comfirm: function () {
    if (!facade.isMiniGame) {
      window.facade.getComponent('GameModel').rewardEnergy(5)
      popUp.getComponent('FloatTip').showTip('收获体力 x 5')
      window.popUp.getComponent('Pop').removeTop()
      return
    }

    const e = {
      inviteId: 1526,
      videoId: 21101,
      assistId: 0,
      interstitalId: 31101
    }

    window.facade.getComponent('ShareADModel').showShareAD(e, {
      succ: function (e) {
        console.log('体力分享成功:', e)
        window.facade.getComponent('GameModel').rewardEnergy(5)
        popUp.getComponent('FloatTip').showTip('收获体力 x 5')
        window.popUp.getComponent('Pop').removeTop()
      },
      fail: function (e, t) {
        popUp.getComponent('FloatTip').showTip(e)
      }
    })
  },

  update: function (e) {
    this.frameCount++
  }
})
