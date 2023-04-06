cc.Class({
  extends: cc.Component,
  properties: {
    recommendPre: cc.Prefab
  },

  onEnable () {
    if (net.platformName != 'qq') cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e4
    else facade.getComponent('BannerModel').showBanner()
  },

  init () {
    this.inited = true
  },

  onClose () {
    cc.director.getScene().getChildByName('Canvas').getComponent('MainUI').hideSkinPanel()
  },

  onDisable () {
    this.inited = false
    if (net.platformName != 'qq') {
      cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1
      cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').active = true
    } else facade.getComponent('BannerModel').hideBanner()
  },

  update (e) {
    this.node.active && !this.inited && this.init()
  }
})
