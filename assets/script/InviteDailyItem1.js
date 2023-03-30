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
    if (this.itemId == e) {
      this.mask.active = false
      this.showImg = this.node.getChildByName('cash')
      this.showImg.active = true
      this.isget.active = true
      this.title.node.color = cc.Color.WHITE
      return
    }

    facade.getComponent('GameModel').newbieFetchList.length == this.itemId && (this.now.active = true, this.title.color = cc.Color(254, 203, 24, 255))
  },
  setItemData: function (e, t) {
    this.itemData = t, this.itemId = e
    const n = facade.getComponent('ShareADModel').GameConfig.InviteB
    this.title.string = '第' + (e + 1) + '个好友'
    this.rewardCount.string = 'x' + n.Value
    this.showImg = this.node.getChildByName('cash')
    this.showImg.active = true
    if (t == null) {
      this.now.active = false
      this.mask.active = true
      this.isget.active = false
    } else {
      const i = facade.getComponent('GameModel').newbieFetchList
      for (const o in this.now.active = i.length == this.itemId, this.mask.active = false, this.isget.active = true, i) {
        if (i[o] == this.itemData.user_id) {
          this.isget.active = true, this.isInList = true
          break
        }
      }
    }
  },
  onClickRevice: function () {
    !this.isInList && this.itemData && facade.getComponent('GameModel').applyInviteNewbieReward(this.itemId, this.itemData.user_id)
  }
})
