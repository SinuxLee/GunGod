cc.Class({
    extends: cc.Component,
    properties: {
        takeBtn: cc.Node,
        iconType: cc.Sprite,
        iconVideoFrame: cc.SpriteFrame,
        iconShareFrame: cc.SpriteFrame
    },
    onLoad: function() {},
    start: function() {
        this.rewardType = window.facade.getComponent("ShareADModel").getShareADType(), 2 != this.rewardType ? (this.iconType.spriteFrame = this.iconVideoFrame, this.type = "Video") : (this.iconType.spriteFrame = this.iconShareFrame, this.type = "Share")
    },
    initData: function() {},
    doClose: function() {
        window.facade.getComponent("GameModel").newerRewardCancelCount++, window.facade.getComponent("GameModel").passLevelCount = 0
    },
    takeAward: function() {
        var e = {
            inviteId: 1535,
            videoId: 21107,
            assistId: 0,
            interstitalId: 31109
        };
        window.facade.getComponent("ShareADModel").showShareAD(e, {
            succ: function(e) {
                this.takeAwardSuccess()
            }.bind(this),
            fail: function(e, t) {
                popUp.getComponent("FloatTip").showTip(e)
            }.bind(this)
        })
    },
    takeAwardSuccess: function() {
        window.facade.getComponent("GameModel").takeNewerReward(), window.facade.getComponent("GameModel").newerRewardCancelCount--, popUp.getComponent("Pop").removeTop()
    }
})