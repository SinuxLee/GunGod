cc.Class({
  extends: cc.Component,
  properties: {
    takeBtn: cc.Node,
    iconType: cc.Sprite,
    iconVideoFrame: cc.SpriteFrame,
    iconShareFrame: cc.SpriteFrame
  },

  start () {
    this.rewardType = window.facade.getComponent('ShareADModel').getShareADType()
    if (this.rewardType != 2) {
      this.iconType.spriteFrame = this.iconVideoFrame
      this.type = 'Video'
    } else {
      this.iconType.spriteFrame = this.iconShareFrame
      this.type = 'Share'
    }
  },

  doClose () {
    window.facade.getComponent('GameModel').newerRewardCancelCount++
    window.facade.getComponent('GameModel').passLevelCount = 0
  },

  takeAward: function () {
    const e = {
      inviteId: 1536,
      videoId: 21108,
      assistId: 0,
      interstitalId: 31110
    }
    window.facade.getComponent('ShareADModel').showShareAD(e, {
      succ: function (e) {
        this.takeAwardSuccess()
      }.bind(this),
      fail: function (e, t) {
        popUp.getComponent('FloatTip').showTip(e)
      }
    })
  },
  takeAwardSuccess: function () {
    window.facade.getComponent('GameModel').takeAdvanceReward()
    window.facade.getComponent('GameModel').newerRewardCancelCount--
    popUp.getComponent('Pop').removeTop()
  }
})
