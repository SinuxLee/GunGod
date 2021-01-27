cc.Class({
    extends: cc.Component,
    properties: {
        recommendPre: cc.Prefab
    },
    onLoad: function() {},
    onEnable: function() {
        "qq" != net.platformName ? cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1e4 : facade.getComponent("BannerModel").showBanner()
    },
    start: function() {},
    init: function() {
        this.inited = !0
    },
    onClose: function() {
        cc.director.getScene().getChildByName("Canvas").getComponent("MainUI").hideSkinPanel()
    },
    onDisable: function() {
        this.inited = !1, "qq" != net.platformName ? (cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1, cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").active = !0) : facade.getComponent("BannerModel").hideBanner()
    },
    update: function(e) {
        this.node.active && !this.inited && this.init()
    }
})