var i = require('CommonFunc'),
    o = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        scroll: cc.Node,
        content: cc.Node,
        recommendPre: cc.Prefab,
        changeNameBtn: cc.Sprite,
        selfRankData: cc.Node,
        chanllenLabel: cc.Label,
        getBounsBtn: cc.Node,
        chanllenBtn: cc.Node,
        timeNode: cc.Node,
        timeLabel: cc.Label
    },
    onLoad: function() {
        this.frameCount = 0, cc.systemEvent.on(o.RANK_LIST, this.gotRank, this), cc.systemEvent.on(o.PLAYER_RANK_DATA, this.setPlayerSelfData, this), cc.systemEvent.on(o.PLAYER_NAME_CHANGE, this.changeNameBack, this)
    },
    onEnable: function() {
        cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1e5
    },
    onDisable: function() {
        cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1
    },
    initData: function(e) {
        (this.setChanllenLabel(), this.frameCount = 0, this.lesstimes = 0, this.timeNode.active = !1, window.facade.getComponent("GameModel").setOpenRankfFlag(1), 0 == window.facade.getComponent("GameModel").levelShotUpdate) && (window.facade.getComponent("GameModel").getLocalTimeHour() >= 21 ? window.facade.getComponent("GameModel").setShotUpdateData(1) : this.getTimeLess());
        0 != window.facade.getComponent("GameModel").oneShotLevel && 1 != window.facade.getComponent("GameModel").oneShotLevel || window.facade.getComponent("GameModel").setOneShotLeves()
    },
    start: function() {
        cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1, window.facade.getComponent("BannerModel").hideBanner(), window.facade.getComponent("RankModel").requestSelfRank(2), window.facade.getComponent("RankModel").requestRankList(2)
    },
    doClose: function() {
        cc.systemEvent.off(o.RANK_LIST, this.gotRank, this)
    },
    gotRank: function(e) {
        for (var t = 0; t < e.length; t++) e[t].rankNo = t + 1;
        this.scroll.getComponent("ListViewCtrl").setList(e, !1, 2)
    },
    getTimeLess: function() {
        var e = new Date,
            t = 60 * e.getHours() * 60 + 60 * e.getMinutes() + e.getSeconds();
        this.lesstimes = 75600 - t;
        var n = String(i.changeNumToTime(this.lesstimes));
        this.timeNode.active = !0, this.timeLabel.string = n
    },
    setPlayerSelfData: function(e) {
        if (this.selfRankData.getComponent("RankItem").setSelfItem(e), 0 == window.facade.getComponent("GameModel").levelShotUpdate) window.facade.getComponent("GameModel").chanllenTimes >= facade.getComponent("ShareADModel").GameConfig.OneBulletCnt.Value ? (this.chanllenBtn.active = !1, this.getBounsBtn.active = !0) : (this.chanllenBtn.active = !0, this.getBounsBtn.active = !1);
        else if (1 == window.facade.getComponent("GameModel").levelShotUpdate) {
            this.chanllenBtn.active = !1, this.getBounsBtn.active = !0;
            var t = e.rank_order,
                n = facade.getComponent("ShareADModel").GameConfig.RankReward.Value.split(",");
            this.rankBouns = 0;
            for (var i = 0; i < n.length; i++) {
                if (t <= n[i].split(":")[0]) {
                    this.rankBouns = n[i].split(":")[1];
                    break
                }
            }
            0 == t && (this.rankBouns = 0)
        } else 2 == window.facade.getComponent("GameModel").levelShotUpdate && (this.chanllenBtn.active = !1, this.getBounsBtn.active = !0)
    },
    jumpWorldRank: function() {
        window.popUp.getComponent("Pop").removeTop(), window.popUp.getComponent("Pop").addPopByName("Rank", this, !0, !0, !1)
    },
    changeNameBack: function(e) {
        window.facade.getComponent("RankModel").selfdata.nick_name = e, this.selfRankData.getComponent("RankItem").nameL.string = e
    },
    close: function() {
        facade.getComponent("BannerModel").showBanner(), window.popUp.getComponent("Pop").removeTop()
    },
    changeNameFuc: function() {
        window.popUp.getComponent("Pop").addPopByName("ChangeNameView", this, !0, !1, !1)
    },
    onGoShot: function() {
        var e = window.facade.getComponent("GameModel").chanllenTimes;
        if (e >= facade.getComponent("ShareADModel").GameConfig.OneBulletCnt.Value) {
            popUp.getComponent("FloatTip").showTip("今日挑战次数已用完，请明日再来！")
        } else 0 == e && window.facade.getComponent("GameModel").setAddChanllenNum(), window.facade.getComponent("LevelModel").initShotData(), window.popUp.getComponent("Pop").removeTop()
    },
    setChanllenLabel: function() {
        var e = window.facade.getComponent("GameModel").chanllenTimes,
            t = facade.getComponent("ShareADModel").GameConfig.OneBulletCnt.Value;
        this.chanllenLabel.string = t - e + "/" + t
    },
    getBounsResult: function() {
        if (0 == window.facade.getComponent("GameModel").levelShotUpdate) {
            var e = "每日21点结算，可领取奖励！";
            popUp.getComponent("FloatTip").showTip(e)
        } else if (1 == window.facade.getComponent("GameModel").levelShotUpdate) {
            window.facade.getComponent("GameModel").addCash(Number(this.rankBouns)), window.facade.getComponent("GameModel").setShotUpdateData(2);
            e = "成功领取奖励: 钞票 x " + this.rankBouns;
            popUp.getComponent("FloatTip").showTip(e)
        } else if (2 == window.facade.getComponent("GameModel").levelShotUpdate) {
            e = "今日已领取奖励，请明日再来！";
            popUp.getComponent("FloatTip").showTip(e)
        }
    },
    setupList: function(e) {},
    update: function(e) {
        if (this.lesstimes > 0 && (this.frameCount += e, this.frameCount >= 1))
            if (this.frameCount = 0, this.lesstimes--, this.lesstimes > 0) {
                var t = String(i.changeNumToTime(this.lesstimes));
                this.timeNode.active = !0, this.timeLabel.string = t
            } else window.facade.getComponent("GameModel").setShotUpdateData(1), window.popUp.getComponent("Pop").removeTop(), window.popUp.getComponent("Pop").addPopByName("GunMasterRank", this, !0, !1, !1)
    }
})