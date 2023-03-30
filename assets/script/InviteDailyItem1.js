cc.Class({
  extends: cc.Component,
  properties: {
    title: cc.Label,
    now: cc.Node,
    isget: cc.Node,
    rewardCount: cc.Label,
    mask: cc.Node
  },
  onLoad: function () {
    const t = require('ModuleEventEnum')
    cc.systemEvent.on(t.INVITE_UPDATE_DAILY, this.updateShow, this)
  },
  updateShow: function (e) {
    if (this.itemId == e) return this.mask.active = !1, this.showImg = this.node.getChildByName('cash'), this.showImg.active = !0, this.isget.active = !0, void (this.title.node.color = cc.Color.WHITE)
    facade.getComponent('GameModel').newbieFetchList.length == this.itemId && (this.now.active = !0, this.title.color = cc.Color(254, 203, 24, 255))
  },
  setItemData: function (e, t) {
    this.itemData = t, this.itemId = e
    const n = facade.getComponent('ShareADModel').GameConfig.InviteB
    if (this.title.string = '第' + (e + 1) + '个好友', this.rewardCount.string = 'x' + n.Value, this.showImg = this.node.getChildByName('cash'), this.showImg.active = !0, t == null) this.now.active = !1, this.mask.active = !0, this.isget.active = !1
    else {
      const i = facade.getComponent('GameModel').newbieFetchList
      for (const o in this.now.active = i.length == this.itemId, this.mask.active = !1, this.isget.active = !0, i) {
        if (i[o] == this.itemData.user_id) {
          this.isget.active = !0, this.isInList = !0
          break
        }
      }
    }
  },
  onClickRevice: function () {
    !this.isInList && this.itemData && facade.getComponent('GameModel').applyInviteNewbieReward(this.itemId, this.itemData.user_id)
  }
})
