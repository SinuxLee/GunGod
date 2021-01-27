var i;

function o(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e
}
var a = require('ModuleEventEnum');
require('CommonFunc');
cc.Class((o(i = {
    extends: cc.Component,
    properties: {
        btn: cc.Sprite,
        shareSkin: cc.SpriteFrame,
        videoSkin: cc.SpriteFrame,
        rewardEnergyLabel: cc.Label,
        recommendPre: cc.Prefab
    },
    onLoad: function() {
        this.frameCount = 0
    },
    initData: function(e) {
        this.addValue = e
    },
    start: function() {
        this.rewardType = window.facade.getComponent("ShareADModel").getShareADType(), 2 != this.rewardType ? this.btn.spriteFrame = this.videoSkin : this.btn.spriteFrame = this.shareSkin, this.rewardEnergyLabel.string = this.addValue
    },
    onEnable: function() {
        cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1e4
    },
    onDisable: function() {
        cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1
    },
    close: function() {
        window.facade.getComponent("GameModel").rewardEnergy(this.addValue), popUp.getComponent("FloatTip").showTip("收获体力 x " + this.addValue), window.popUp.getComponent("Pop").removeTop()
    }
}, "onDisable", function() {
    cc.systemEvent.emit(a.BACK_ENERGY_CLOSED), window.facade.getComponent("BannerModel").hideBanner()
}), o(i, "comfirm", function() {
    if (!facade.isMiniGame) return window.facade.getComponent("GameModel").rewardEnergy(2 * this.addValue), popUp.getComponent("FloatTip").showTip("收获体力 x " + 2 * this.addValue), void window.popUp.getComponent("Pop").removeTop();
    var e = {
        inviteId: 1529,
        videoId: 21103,
        assistId: 0,
        interstitalId: 31103
    };
    window.facade.getComponent("ShareADModel").showShareAD(e, {
        succ: function(e) {
            console.log("体力分享成功:", e), window.facade.getComponent("GameModel").rewardEnergy(2 * this.addValue), popUp.getComponent("FloatTip").showTip("收获体力 x " + 2 * this.addValue), window.popUp.getComponent("Pop").removeTop()
        }.bind(this),
        fail: function(e, t) {
            popUp.getComponent("FloatTip").showTip(e)
        }.bind(this)
    })
}), o(i, "update", function(e) {
    this.frameCount++
}), i))