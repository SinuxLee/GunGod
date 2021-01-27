var i = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        goNextBtn: cc.Node,
        restartBtn: cc.Node,
        linkBox: cc.Node,
        linkItemPre: cc.Prefab,
        chanllenLabel: cc.Label,
        fauilNode: cc.Node,
        cupNumLabel: cc.Label,
        returnPlayBt: cc.Node,
        cupNumNode: cc.Node
    },
    onLoad: function() {},
    start: function() {},
    onEnable: function() {
        this.losePlayed = !1
    },
    onDisable: function() {
        this.losePlayed = !1
    },
    init: function(e) {
        if (cc.systemEvent.on(i.RESULT_RECOMMEND, this.gotLinks, this), e) {
            this.returnPlayBt.active = !0, this.returnPlayBt.getComponent(cc.Button).interactable = !0, this.cupNumNode.active = !0, this.goNextBtn.active = !1, this.restartBtn.active = !1, this.fauilNode.active = !1;
            var t = window.facade.getComponent("GameModel").oneShotLevelCupNum;
            this.cupNumLabel.string = "+" + t
        } else this.returnPlayBt.active = !1, this.cupNumNode.active = !1, this.goNextBtn.active = !0, this.restartBtn.active = !0, this.restartBtn.getComponent(cc.Button).interactable = !0, this.fauilNode.active = !0, this.setChanllenLabel();
        this.initLinks()
    },
    setChanllenLabel: function() {
        this.chanllenNum = window.facade.getComponent("GameModel").chanllenTimes;
        var e = facade.getComponent("ShareADModel").GameConfig.OneBulletCnt.Value;
        this.chanllenLabel.string = "剩余次数:" + (e - this.chanllenNum) + "/" + e
    },
    goReturnBegin: function() {
        this.restartBtn.getComponent(cc.Button).interactable = !1, this.returnPlayBt.getComponent(cc.Button).interactable = !1, this.chanllenNum = window.facade.getComponent("GameModel").chanllenTimes;
        var e = facade.getComponent("ShareADModel").GameConfig.OneBulletCnt.Value;
        if (this.chanllenNum < e) {
            if (0 == window.facade.getComponent("GameModel").levelShotUpdate)
                if (window.facade.getComponent("GameModel").getLocalTimeHour() >= 21) {
                    window.facade.getComponent("GameModel").setShotUpdateData(1);
                    var t = "今日挑战时间已结束，请领取奖励！";
                    popUp.getComponent("FloatTip").showTip(t), this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(this.backMain, this)))
                } else window.facade.getComponent("GameModel").setAddChanllenNum(), this.chanllenNum++, window.facade.getComponent("GameModel").setOneShotLeves(), this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(this.goToShotNextLevel, this)))
        } else {
            t = "今日挑战次数已用完，请明日再来！";
            popUp.getComponent("FloatTip").showTip(t), this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(this.backMain, this)))
        }
    },
    initLinks: function() {
        facade.SAVE_MODE ? this.linkBox.active = !1 : window.facade.getComponent("RecommendGameModel").requestResultRecommend()
    },
    backMain: function() {
        cc.systemEvent.emit(i.BACK_MAIN)
    },
    goToShotNextLevel: function() {
        this.node.active = !1, cc.systemEvent.emit(i.GO_SHOT_NEXT)
    },
    goNext: function() {
        this.node.active = !1, window.facade.getComponent("GameModel").onLevelShotNext()
    },
    onRetry: function() {
        this.restartBtn.getComponent(cc.Button).interactable = !1;
        var e = facade.getComponent("ShareADModel").GameConfig.OneBulletCnt.Value;
        if (this.chanllenNum < e) {
            window.facade.getComponent("GameModel").setAddChanllenNum(), this.chanllenNum++;
            var t = {
                inviteId: 0,
                videoId: 21109,
                assistId: 0,
                interstitalId: 31106
            };
            window.facade.getComponent("ShareADModel").showShareAD(t, {
                succ: function(e) {
                    console.log("重玩视频:", e), this.node.active = !1, cc.systemEvent.emit(i.GO_SHOT_NEXT)
                }.bind(this),
                fail: function(e, t) {
                    popUp.getComponent("FloatTip").showTip(e)
                }.bind(this)
            })
        }
    },
    hide: function() {
        cc.systemEvent.off(i.RESULT_RECOMMEND, this.gotLinks, this), this.node.active = !1
    },
    gotLinks: function(e) {
        if (this.linkBox.removeAllChildren(), !e || 0 == e.length) return this.linkBox.opacity = 0, void(this.linkBox.active = !1);
        if (this.linkBox.opacity = 255, this.linkBox.active = !0, window.facade.getComponent("PlayerModel").isClickCountLimit(3))
            for (var t = 0; t < e.length; t++) e[t].navout_max_cnt && "" != e[t].navout_max_cnt && 0 != Number(e[t].navout_max_cnt) && e[t].navout_cnt >= Number(e[t].navout_max_cnt) && (e.splice(t, 1), t--);
        if (facade.getComponent("PlayerModel").isIconRandomOrder("result")) {
            var n = facade.getComponent("PlayerModel").getResultRecommondRandomCount(),
                i = e.slice(0, n),
                o = e.slice(n, e.length);
            i && i.length > 1 && i.sort(function() {
                return .5 - Math.random()
            }), e = [], e = i.concat(o)
        } else e.sort(function(e, t) {
            return Number(e.weight) > Number(t.weight) ? -1 : 1
        });
        for (var a = Math.min(e.length, 12), s = 0; s < a; s++) {
            var c = null;
            (c = cc.instantiate(this.linkItemPre)).active = !0, c.scale = 1.1, c.getComponent("RecommendGameItem").setupItemData(e[s]), this.linkBox.addChild(c)
        }
    },
    onDestroy: function() {},
    checkGfit: function() {
        if (!facade.SAVE_MODE) {
            var e = facade.getComponent("GameModel").checkNewerShowCondtition();
            0 != e && window.popUp.getComponent("Pop").addPopByName(e + "View", null, !0, !1)
        }
    },
    update: function(e) {}
})