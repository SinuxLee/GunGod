cc.Class({
  extends: cc.Component,
  properties: {
    desc: cc.Label,
    icon: cc.Sprite,
    btn: cc.Node
  },

  start: function () {
    cc.loader.loadRes('uis', cc.SpriteAtlas, function (e, t) {
      e ? console.error(e) : this.icon.spriteFrame = t.getSpriteFrame(this.itemData.name)
    }.bind(this))

    this.desc.string = this.itemData.desc
    this.btn.getChildByName('strength').active = this.itemData.type == 1
    this.btn.getChildByName('cash').active = !(this.itemData.type == 1)
    this.btn.getChildByName('Label').getComponent(cc.Label).string = this.itemData.act
  },

  setItemData: function (e, t) {
    this.itemId = e
    this.itemData = t
  },

  onClickSelf: function () {
    if (this.itemData.target != '') {
      if (this.itemData.target == 'HoverWinUI' && facade.getComponent('PlayerModel').wxAdaptor.checkHoverWinShow()) return void facade.getComponent('GameModel').applyHoverWinReward()
      popUp.getComponent('Pop').addPopByName(this.itemData.target, null, true, true, false)
      require('VirBannerCtrl').hideVirBanner()
    } else popUp.getComponent('FloatTip').showTip('开发中，敬请期待！')
  }
})
