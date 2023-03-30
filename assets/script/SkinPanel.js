cc.Class({
  extends: cc.Component,
  properties: {
    recommendPre: cc.Prefab
  },

  onEnable: function () {
    net.platformName != 'qq' ? cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e4 : facade.getComponent('BannerModel').showBanner()
  },

  init: function () {
    this.inited = true
  },
  onClose: function () {
    cc.director.getScene().getChildByName('Canvas').getComponent('MainUI').hideSkinPanel()
  },
  onDisable: function () {
    this.inited = false, net.platformName != 'qq' ? (cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1, cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').active = true) : facade.getComponent('BannerModel').hideBanner()
  },
  update: function (e) {
    this.node.active && !this.inited && this.init()
  }
})
