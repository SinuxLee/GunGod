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
    start: function() {
        this.addTip.active = !1, this.awardCount.string = "x" + facade.getComponent("ShareADModel").GameConfig.InviteB.Value
    },
    setItemData: function(e, t, n) {
        this.id = e, this.itemID = t, this.itemData = n, 0 == n.user_id ? (this.notInvite.active = !0, this.addTip.active = !0, this.inviteLab.actiev = !0, this.canGet.active = !1, this.reveiceBtn.active = !1) : (this.canGet.active = !0, this.reveiceBtn.active = !0, this.notInvite.active = !1, this.addTip.active = !1, this.inviteLab.actiev = !1)
    },
    onClickRevice: function() {
        facade.getComponent("GameModel").applyInviteNewbieReward(this.itemID, this.itemData.user_id), popUp.getComponent("Pop").removeTop()
    },
    onClickInvite: function() {
        var e = {
            inviteId: 1534,
            videoId: 0,
            assistId: 0
        };
        window.facade.getComponent("ShareADModel").showShareAD(e, {
            succ: function(e) {
                console.log("拉新 分享/视频:", e), popUp.getComponent("FloatTip").showTip("分享成功")
            }.bind(this),
            fail: function(e, t) {
                popUp.getComponent("FloatTip").showTip(e)
            }.bind(this)
        })
    }
})