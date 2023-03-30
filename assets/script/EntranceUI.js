const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {
    title: cc.Label,
    scroll: cc.ScrollView,
    item: cc.Prefab,
    recommendPre: cc.Prefab,
    mianfeitili: cc.Node,
    xinrenhaoli: cc.Node
  },
  onLoad: function () {
    cc.systemEvent.on(i.UPDATE_HOVER_SHOW, this.initContent, this), this.strengthList = [{
      name: 'pop_icon_fc',
      desc: '添加浮窗得体力',
      type: 1,
      target: 'HoverWinUI',
      act: '去领取'
    }, {
      name: 'pop_icon_yq',
      desc: '邀请好友得体力',
      type: 1,
      target: 'InviteDailyUI',
      act: '去领取'
    }], this.cashList = [{
      name: 'pop_icon_sc',
      desc: '收藏游戏得好礼',
      type: 0,
      target: 'CollectGift',
      act: '去收藏'
    }, {
      name: 'pop_icon_rz',
      desc: '新手入驻得豪礼',
      type: 0,
      target: 'InviteNewUI',
      act: '去邀请'
    }]
  },
  start: function () {
    this.initContent()
  },
  initData: function (e) {
    this.data = e
  },
  onEnable: function () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e4
  },
  onDisable: function () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1
  },
  initContent: function () {
    if (facade.getComponent('GameModel').checkHoverWinRewardShow() || this.strengthList.shift(), !facade.getComponent('GameModel').checkClientRewardShow()) {
      const e = this.strengthList.length == 2 ? 0 : 1
      this.strengthList.splice(e, 1)
    }
    facade.getComponent('GameModel').lastFetchColectTime != 0 && this.cashList.splice(0, 1)
    const t = this.data == 1 ? this.strengthList : this.cashList
    for (const n in this.mianfeitili.active = this.xinrenhaoli.active = !1, this.data == 1 ? this.mianfeitili.active = !0 : this.xinrenhaoli.active = !0, this.scroll.content.childrenCount != 0 && this.scroll.content.removeAllChildren(), t) {
      const i = cc.instantiate(this.item)
      i.getComponent('EntranceItem').setItemData(parseInt(n), t[n]), this.scroll.content.addChild(i)
    }
  },
  doClose: function () {
    cc.systemEvent.off(i.UPDATE_HOVER_SHOW, this.initContent, this)
  },
  onClickBack: function () {
    popUp.getComponent('Pop').removeTop()
  }
})
