cc.Class({
  extends: cc.Component,
  properties: {
    awardCount: cc.Label,
    addTip: cc.Node,
    notInvite: cc.Node,
    inviteLab: cc.Node,
    canGet: cc.Node,
    reveiceBtn: cc.Node
  },

  start: function () {
    this.addTip.active = false
    this.awardCount.string = 'x' + facade.getComponent('ShareADModel').GameConfig.InviteB.Value
  },
  setItemData: function (e, t, n) {
    this.id = e
    this.itemID = t
    this.itemData = n
    n.user_id == 0 ? (this.notInvite.active = true, this.addTip.active = true, this.inviteLab.actiev = true, this.canGet.active = false, this.reveiceBtn.active = false) : (this.canGet.active = true, this.reveiceBtn.active = true, this.notInvite.active = false, this.addTip.active = false, this.inviteLab.actiev = false)
  },
  onClickRevice: function () {
    facade.getComponent('GameModel').applyInviteNewbieReward(this.itemID, this.itemData.user_id)
    popUp.getComponent('Pop').removeTop()
  },
  onClickInvite: function () {
    const e = {
      inviteId: 1534,
      videoId: 0,
      assistId: 0
    }
    window.facade.getComponent('ShareADModel').showShareAD(e, {
      succ: function (e) {
        console.log('拉新 分享/视频:', e), popUp.getComponent('FloatTip').showTip('分享成功')
      },
      fail: function (e, t) {
        popUp.getComponent('FloatTip').showTip(e)
      }
    })
  }
})
