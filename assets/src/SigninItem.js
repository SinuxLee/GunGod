cc.Class({
    extends: cc.Component,
    properties: {
        now: cc.Node,
        isGet: cc.Node,
        day: cc.Label,
        rewardNode: cc.Node,
        rewardCount: cc.Label
    },
    initData: function(e, t) {
        this.curDay = t, this.mainData = e
    },
    start: function() {
        var e = Math.floor(facade.getComponent("GameModel").lastFetchSignInTime / 86400 / 1e3),
            t = Math.floor(facade.getComponent("GameModel").getLocalTime() / 86400 / 1e3);
        this.now.active = !1, this.isGet.active = this.curDay > this.mainData.Day, this.curDay == this.mainData.Day && (e < t ? (this.now.active = !0, this.isGet.active = !1) : e == t && (this.now.active = !1, this.isGet.active = !0)), this.day.string = "第" + this.mainData.Day + "天", this.rewardCount.string = "x" + this.mainData.AwardNum;
        var n = "";
        switch (this.mainData.AwardType) {
            case 1:
                n = "cash";
                break;
            case 2:
                n = "strength";
                break;
            case 3:
                n = "video", this.rewardCount.node.active = !1;
                break;
            case 4:
                n = "skin", this.rewardCount.node.active = !1, cc.loader.loadRes("roles", cc.SpriteAtlas, this.updateSkin.bind(this))
        }
        this.rewardNode.getChildByName(n).active = !0
    },
    updateSkin: function(e, t) {
        if (e) console.error(e);
        else {
            var n = t.getSpriteFrame("MrBullet_Role_Body_0" + this.mainData.AwardNum);
            this.rewardNode.getChildByName("skin").getChildByName("head").getComponent(cc.Sprite).spriteFrame = n, sp1 = t.getSpriteFrame("MrBullet_Role_AimArm_0" + this.mainData.AwardNum), this.rewardNode.getChildByName("skin").getChildByName("New Sprite").getComponent(cc.Sprite).spriteFrame = sp1
        }
    }
})