cc.Class({
    extends: cc.Component,
    properties: {
        title: cc.Label,
        now: cc.Node,
        isget: cc.Node,
        rewardCount: cc.Label,
        mask: cc.Node
    },
    onLoad: function() {
        var t = require('ModuleEventEnum');
        cc.systemEvent.on(t.INVITE_UPDATE_DAILY, this.updateShow, this)
    },
    updateShow: function(e) {
        if (this.itemId == e) return this.mask.active = !1, this.showImg = this.node.getChildByName("strength"), this.showImg.active = !0, this.isget.active = !0, void(this.title.node.color = cc.Color.WHITE);
        facade.getComponent("GameModel").aliveFetchList.length == this.itemId && (this.now.active = !0, this.title.color = cc.Color(254, 203, 24, 255))
    },
    setItemData: function(e, t) {
        this.itemData = t, this.itemId = e;
        var n = facade.getComponent("ShareADModel").GameConfig.InviteT;
        if (this.title.string = "第" + (e + 1) + "个好友", this.rewardCount.string = "x" + n.Value, this.showImg = this.node.getChildByName("strength"), this.showImg.active = !0, null == t) this.now.active = !1, this.mask.active = !0, this.isget.active = !1;
        else {
            var i = facade.getComponent("GameModel").aliveFetchList;
            for (var o in this.now.active = i.length == this.itemId, this.mask.active = !1, this.isget.active = !0, i)
                if (i[o] == this.itemData.user_id) {
                    this.isget.active = !0, this.isInList = !0;
                    break
                }
        }
    },
    onClickRevice: function() {
        !this.isInList && this.itemData && facade.getComponent("GameModel").applyInviteAliveReward(this.itemId, this.itemData.user_id)
    }
})