const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {
    item: cc.Prefab,
    content: cc.Node,
    recommendPre: cc.Prefab
  },
  onLoad: function () {
    this.initContent()
  },
  onEnable: function () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e4
  },
  onDisable: function () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1
  },
  initRecommond: function () {},
  initContent: function () {
    for (let e = facade.getComponent('GameModel').aliveFetchList, t = 0; t < 4; t++) {
      const n = cc.instantiate(this.item)
      e[t] != null ? n.getComponent('InviteDailyItem').setItemData(t, e[t]) : n.getComponent('InviteDailyItem').setItemData(t, null), this.content.addChild(n)
    }
  },
  onClickInvite: function () {
    const e = {
      inviteId: 1533,
      videoId: 0,
      assistId: 0
    }
    window.facade.getComponent('ShareADModel').showShareAD(e, {
      succ: function (e) {
        console.log('拉活 分享/视频:', e)
        popUp.getComponent('FloatTip').showTip('分享成功')
        const t = facade.getComponent('GameModel').aliveFetchList
        facade.getComponent('GameModel').applyInviteAliveReward(t.length, '123')
      },
      fail: function (e, t) {
        popUp.getComponent('FloatTip').showTip(e)
      }
    })
  },
  onClickBack: function () {
    popUp.getComponent('Pop').removeTop()
  },
  doClose: function () {
    cc.systemEvent.off(ModuleEventEnum.GAME_OPEN_DAILY_INVITE, this.initContent, this)
  }
})
