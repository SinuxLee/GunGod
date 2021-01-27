var i = require('ModuleEventEnum'),
    o = require('AnalyticsUtilities').AnalyticsUtilities;
cc.Class({
    extends: cc.Component,
    properties: {
        star1: cc.Node,
        star2: cc.Node,
        star3: cc.Node,
        reward: cc.Node,
        linkBox: cc.Node,
        linkItemPre: cc.Prefab,
        failNode: cc.Node,
        passNode: cc.Node,
        goNextBtn: cc.Node,
        restartBtn: cc.Node,
        restartLabel: cc.Node,
        retryCostEnergy: cc.Node,
        skipBtn: cc.Node,
        upBtn: cc.Node,
        doubleBtn: cc.Node,
        replayPanel: cc.Node,
        recommendPage: cc.Node,
        resultLabel: cc.Node,
        result3LabelSkin: cc.SpriteFrame,
        result2LabelSkin: cc.SpriteFrame,
        result1LabelSkin: cc.SpriteFrame,
        resultPassLabelSkin: cc.SpriteFrame,
        btnVideoSkin: cc.SpriteFrame,
        btnShareSkin: cc.SpriteFrame,
        bigVideoSkin: cc.SpriteFrame,
        bigShareSkin: cc.SpriteFrame,
        iconVideoSkin: cc.SpriteFrame,
        iconShareSkin: cc.SpriteFrame,
        btnNextSkin: cc.SpriteFrame,
        bigNextSkin: cc.SpriteFrame,
        btnRetrySkin: cc.SpriteFrame,
        bigRetrySkin: cc.SpriteFrame
    },
    onLoad: function() {},
    start: function() {
        window.facade.Screenratio && window.facade.Screenratio < .47 ? this.skipBtn.parent.getComponent(cc.Widget).bottom = 200 : this.skipBtn.parent.getComponent(cc.Widget).bottom = 10, this.skipBtn.parent.getComponent(cc.Widget).updateAlignment()
    },
    onEnable: function() {
        this.losePlayed = !1, this.replayPanel.active = !1, this.recommendPage.active = !0
    },
    onDisable: function() {
        this.losePlayed = !1, this.replayPanel.active = !1
    },
    init: function(e) {
        this.passNode.active = !1, this.failNode.active = !1, this.goNextBtn.parent.active = !1, this.rewardCash = 0, this._passed = e, cc.systemEvent.on(i.RESULT_RECOMMEND, this.gotLinks, this), this.goNextBtn.getComponent(cc.Button).interactable = !0, this.restartBtn.getComponent(cc.Button).interactable = !0, this.restartLabel.getComponent(cc.Button).interactable = !0, this.retryCostEnergy.getComponent(cc.Button).interactable = !0, this.skipBtn.getComponent(cc.Button).interactable = !0, this.upBtn.getComponent(cc.Button).interactable = !0, this.doubleBtn.getComponent(cc.Button).interactable = !0, this.restartBtn.getComponent(cc.Widget).isAlignHorizontalCenter = !1, this.updateRewardType(), this.initResult(), this.initLinks(), o.logEvent("进入结算界面")
    },
    updateRewardType: function() {
        this.rewardType = window.facade.getComponent("ShareADModel").getShareADType(), 2 != this.rewardType ? (this.skipBtn.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.iconVideoSkin, this.upBtn.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.iconVideoSkin, this.doubleBtn.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.iconVideoSkin, this.restartBtn.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.iconVideoSkin, this.type = "Video") : (this.skipBtn.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.iconShareSkin, this.upBtn.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.iconShareSkin, this.doubleBtn.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.iconShareSkin, this.restartBtn.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.iconShareSkin, this.type = "Share")
    },
    initResult: function() {
        this.passNode.active = !0, this.failNode.active = !1, this.resultLabel.active = !1, this._passed ? (o.logEvent("进入闯关成功界面: " + window.facade.getComponent("LevelModel").playingLevel), this.reward.getComponent("TextureLabel").setText("0"), this.star1.getChildByName("light").active = !1, this.star2.getChildByName("light").active = !1, this.star3.getChildByName("light").active = !1, this.reward.parent.opacity = 0, this.node.runAction(cc.sequence(cc.delayTime(.03), cc.callFunc(this.showResult, this)))) : this.initFailed()
    },
    initFailed: function() {
        this.losePlayed || (window.audio.getComponent("SoundManager").playEffect("lose"), this.losePlayed = !0), o.logEvent("进入闯关失败界面: " + window.facade.getComponent("LevelModel").playingLevel), this.passNode.active = !1, this.failNode.active = !0, this.goNextBtn.active = !1, this.restartLabel.active = !1, this.upBtn.active = !1, this.doubleBtn.active = !1, this.restartBtn.active = !0, this.skipBtn.active = !0;
        var e = this;
        e.retryCostEnergy.active = !1, setTimeout(function() {
            e.retryCostEnergy.active = !0
        }, 2e3);
        facade.getComponent("LevelModel").costEnergy;
        this.retryCostEnergy.active = !0, this.retryCostEnergy.getComponent(cc.Label).string = "消耗1体力重玩", this.goNextBtn.parent.active = !0, window.facade.Screenratio && window.facade.Screenratio < .47 ? this.failNode.getComponent(cc.Widget).bottom = 381 : this.failNode.getComponent(cc.Widget).bottom = 170, this.failNode.getComponent(cc.Widget).updateAlignment(), facade.SAVE_MODE ? (this.skipBtn.active = !1, this.restartBtn.getComponent(cc.Widget).isAlignHorizontalCenter = !0, this.restartBtn.getComponent(cc.Widget).isAlignRight = !1, this.restartBtn.getComponent(cc.Widget).isAlignLeft = !1, this.restartBtn.getComponent(cc.Widget).horizontalCenter = 0, this.restartBtn.getComponent(cc.Widget).updateAlignment()) : (this.restartBtn.getComponent(cc.Sprite).spriteFrame = this.bigRetrySkin, this.restartBtn.getComponent(cc.Widget).isAlignRight = !1, this.restartBtn.getComponent(cc.Widget).isAlignLeft = !0, this.restartBtn.getComponent(cc.Widget).left = 50, this.restartBtn.getComponent(cc.Widget).updateAlignment(), this.skipBtn.width = 205, this.skipBtn.getComponent(cc.Sprite).spriteFrame = this["btn" + this.type + "Skin"], this.skipBtn.getComponent(cc.Widget).right = 50, this.skipBtn.getComponent(cc.Widget).updateAlignment()), this.checkLast()
    },
    initNeedUp: function() {
        this.updateRewardType(), this.passNode.active = !0, this.failNode.active = !1, this.restartBtn.active = !1, this.skipBtn.active = !1, this.doubleBtn.active = !1, this.retryCostEnergy.active = !1;
        var e = this;
        e.restartLabel.active = !1, setTimeout(function() {
            e.restartLabel.active = !0
        }, 2e3), this.goNextBtn.active = !0, this.upBtn.active = !0, this.goNextBtn.parent.active = !0, this.goNextBtn.width = 205, this.goNextBtn.getComponent(cc.Sprite).spriteFrame = this.btnNextSkin, this.goNextBtn.getComponent(cc.Widget).isAlignRight = !1, this.goNextBtn.getComponent(cc.Widget).isAlignLeft = !0, this.goNextBtn.getComponent(cc.Widget).left = 50, this.goNextBtn.getComponent(cc.Widget).updateAlignment(), this.upBtn.getComponent(cc.Sprite).spriteFrame = this["big" + this.type + "Skin"], this.upBtn.getComponent(cc.Widget).right = 50, this.upBtn.getComponent(cc.Widget).updateAlignment(), this.checkLast()
    },
    initDefault: function() {
        this.updateRewardType(), this.passNode.active = !0, this.failNode.active = !1, this.skipBtn.active = !1, this.restartLabel.active = !1, this.upBtn.active = !1, this.doubleBtn.active = !1, this.goNextBtn.active = !0, this.restartBtn.active = !0, this.goNextBtn.parent.active = !0, this.goNextBtn.width = 205, this.goNextBtn.getComponent(cc.Sprite).spriteFrame = this.bigNextSkin, this.goNextBtn.getComponent(cc.Widget).left = 50, this.goNextBtn.getComponent(cc.Widget).updateAlignment(), this.restartBtn.getComponent(cc.Sprite).spriteFrame = this.btnRetrySkin, this.restartBtn.getComponent(cc.Widget).isAlignRight = !0, this.restartBtn.getComponent(cc.Widget).isAlignLeft = !1, this.restartBtn.getComponent(cc.Widget).right = 50, this.restartBtn.getComponent(cc.Widget).updateAlignment(), this.checkLast()
    },
    initDouble: function() {
        this.updateRewardType(), this.passNode.active = !0, this.failNode.active = !1, this.skipBtn.active = !1, this.restartLabel.active = !1, this.retryCostEnergy.active = !1, this.upBtn.active = !1, this.restartBtn.active = !1, this.goNextBtn.active = !0, this.doubleBtn.active = !0, this.goNextBtn.parent.active = !0, this.goNextBtn.width = 205, this.goNextBtn.getComponent(cc.Sprite).spriteFrame = this.btnNextSkin, this.goNextBtn.getComponent(cc.Widget).left = 50, this.goNextBtn.getComponent(cc.Widget).updateAlignment(), this.doubleBtn.getComponent(cc.Sprite).spriteFrame = this["big" + this.type + "Skin"], this.doubleBtn.getComponent(cc.Widget).right = 50, this.doubleBtn.getComponent(cc.Widget).updateAlignment(), this.checkLast()
    },
    checkLast: function() {
        window.facade.getComponent("LevelModel").isLastLevel() && (this.goNextBtn.active = !1, this.skipBtn.active = !1)
    },
    initLinks: function() {
        facade.SAVE_MODE ? this.linkBox.active = !1 : window.facade.getComponent("RecommendGameModel").requestResultRecommend()
    },
    showResult: function() {
        window.facade.Screenratio && window.facade.Screenratio < .47 ? this.passNode.getComponent(cc.Widget).bottom = 580 : this.passNode.getComponent(cc.Widget).bottom = 380, this.passNode.getComponent(cc.Widget).updateAlignment(), this.star = window.facade.getComponent("LevelModel").star, this.star < 3 && this.initNeedUp(), this.star <= 0 ? this.showTitle() : (this.starIndex = 1, this.node.runAction(cc.sequence(cc.repeat(cc.sequence(cc.callFunc(this.addStar.bind(this)), cc.delayTime(.5)), this.star), cc.delayTime(.5), cc.callFunc(this.showTitle, this))))
    },
    showTitle: function() {
        this.checkGfit()
    },
    addStar: function() {
        var e = this["star" + this.starIndex].getChildByName("light");
        e.active = !0, e.opacity = 0, e.scale = 0;
        var t = cc.spawn(cc.fadeIn(.4), cc.scaleTo(.4, 1));
        t.easing(cc.easeElasticOut(.2)), e.runAction(t), window.audio.getComponent("SoundManager").playEffect("star"), this.starIndex >= 3 && (this.reward.parent.opacity = 255, this.reward.parent.getChildByName("moneyEffect").getComponent(cc.ParticleSystem).resetSystem(), this.rewardCash = window.facade.getComponent("LevelModel").playingLevelConfig.Reward, this.reward.getComponent("TextureLabel").setText("+" + this.rewardCash), window.facade.getComponent("GameModel").addCash(Number(this.rewardCash)), this.initDouble()), this.starIndex++
    },
    goNext: function() {
        this.goNextBtn.getComponent(cc.Button).interactable = !1;
        var e = facade.getComponent("LevelModel").getTotalStar(),
            t = facade.getComponent("LevelModel").getLevelConfig(window.facade.getComponent("LevelModel").playingLevel + 1);
        if (window.facade.getComponent("LevelModel").getLevelVideo(facade.selectedLevelType + "_" + t.Level) > 0) 3 == t.BonusType && window.facade.getComponent("LevelModel").getLevelStar(facade.selectedLevelType + "_" + t.Level) < 3 && (t.Reward = 2 * window.facade.getComponent("LevelModel").playingLevelConfig.Reward);
        else if (t.Level == window.facade.getComponent("LevelModel").playingLevel + 1 && t.BonusType > 0) return this.watchVideo(), void(this.goNextBtn.getComponent(cc.Button).interactable = !0);
        var n = facade.getComponent("LevelModel").costEnergy;
        if (facade.getComponent("GameModel").energy < n) return cc.systemEvent.emit(i.ENERGY_NEEDED), void this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
            this.goNextBtn.getComponent(cc.Button).interactable = !0
        }.bind(this))));
        t.Star > e ? popUp.getComponent("FloatTip").showTip("收集" + t.Star + "颗星星解锁下一关") : (cc.systemEvent.emit(i.GO_NEXT), o.logEvent("闯关成功点击下一关"))
    },
    watchVideo: function() {
        var e = {
            inviteId: 0,
            videoId: 21111,
            assistId: 0,
            interstitalId: 31106
        };
        window.facade.getComponent("ShareADModel").showShareAD(e, {
            succ: function(e) {
                console.log("关卡视频:", e), this.jumpToLevlUi()
            }.bind(this),
            fail: function(e, t) {
                popUp.getComponent("FloatTip").showTip(e)
            }.bind(this)
        })
    },
    jumpToLevlUi: function() {
        window.facade.getComponent("LevelModel").setOverVideo();
        var e = facade.getComponent("LevelModel").getLevelConfig(window.facade.getComponent("LevelModel").playingLevel + 1);
        if (facade.getComponent("LevelModel").costEnergy = 1, 1 == e.BonusType) {
            facade.getComponent("LevelModel").costEnergy = 0;
            var t = facade.getComponent("LevelModel").costEnergy;
            if (facade.getComponent("GameModel").energy < t) return void cc.systemEvent.emit(i.ENERGY_NEEDED)
        }
        2 == e.BonusType && (e.LuckyPoint = 2 * window.facade.getComponent("LevelModel").playingLevelConfig.Reward), 3 == e.BonusType && (e.Reward = 2 * window.facade.getComponent("LevelModel").playingLevelConfig.Reward);
        var n = facade.getComponent("LevelModel").getTotalStar();
        e.Star > n ? popUp.getComponent("FloatTip").showTip("收集" + e.Star + "颗星星解锁下一关") : cc.systemEvent.emit(i.GO_NEXT)
    },
    onRetryLabelHandler: function() {
        this.replayPanel.active = !0, o.logEvent("闯关成功点击重玩")
    },
    onRetry: function() {
        this.doRetry()
    },
    doRetry: function() {
        var e = {
            inviteId: 0,
            videoId: 21113,
            assistId: 0,
            interstitalId: 31106
        };
        window.facade.getComponent("ShareADModel").showShareAD(e, {
            succ: function(e) {
                console.log("免费重玩视频:", e), window.facade.getComponent("GameModel").levelRetryTouch = !0, this.node.parent.getComponent("LevelUI").retry()
            }.bind(this),
            fail: function(e, t) {
                popUp.getComponent("FloatTip").showTip(e)
            }.bind(this)
        }), o.logEvent("体力不足界面看视频或分享")
    },
    doRetryCostEnergy: function() {
        this.restartBtn.getComponent(cc.Button).interactable = !1, this.restartLabel.getComponent(cc.Button).interactable = !1, this.retryCostEnergy.getComponent(cc.Button).interactable = !1, window.facade.getComponent("GameModel").levelRetryTouch = !0, this.node.parent.getComponent("LevelUI").retryCostEnergy(), o.logEvent("闯关失败点击消耗体力")
    },
    onTake3Star: function() {
        if (facade.isMiniGame)
            if (this.rewardType > 2) popUp.getComponent("FloatTip").showTip("已经超出今天的奖励上限啦！");
            else {
                var e = {
                    inviteId: 1530,
                    videoId: 21104,
                    assistId: 0,
                    interstitalId: 31104
                };
                window.facade.getComponent("ShareADModel").showShareAD(e, {
                    succ: function(e) {
                        console.log("三星分享成功:", e), this.take3Star()
                    }.bind(this),
                    fail: function(e, t) {
                        popUp.getComponent("FloatTip").showTip(e)
                    }.bind(this)
                })
            }
        else this.take3Star()
    },
    take3Star: function() {
        this.upBtn.getComponent(cc.Button).interactable = !1, window.facade.getComponent("LevelModel").force3Star(), this.showResult()
    },
    take3StarGet: function() {
        window.facade.getComponent("LevelModel").force3Star(), this.showResult()
    },
    skip: function() {
        if (!facade.isMiniGame) return this.hide(), void cc.systemEvent.emit(i.SKIP);
        if (this.rewardType > 2) popUp.getComponent("FloatTip").showTip("已经超出今天的跳关上限啦！");
        else {
            var e = {
                inviteId: 1528,
                videoId: 21102,
                assistId: 0,
                interstitalId: 31102
            };
            window.facade.getComponent("ShareADModel").showShareAD(e, {
                succ: function(e) {
                    console.log("跳关分享成功:", e), this.hide(), cc.systemEvent.emit(i.SKIP)
                }.bind(this),
                fail: function(e, t) {
                    popUp.getComponent("FloatTip").showTip(e)
                }.bind(this)
            })
        }
    },
    onDouble: function() {
        if (facade.isMiniGame)
            if (this.rewardType > 2) popUp.getComponent("FloatTip").showTip("已经超出今天的奖励上限啦！");
            else {
                var e = {
                    inviteId: 1525,
                    videoId: 21100,
                    assistId: 0,
                    interstitalId: 31100
                };
                window.facade.getComponent("ShareADModel").showShareAD(e, {
                    succ: function(e) {
                        console.log("双倍分享成功:", e), this.takeDouble()
                    }.bind(this),
                    fail: function(e, t) {
                        popUp.getComponent("FloatTip").showTip(e)
                    }.bind(this)
                })
            }
        else this.takeDouble()
    },
    takeDouble: function() {
        this.doubleBtn.getComponent(cc.Button).interactable = !1, this.reward.parent.opacity = 255, this.reward.parent.getChildByName("moneyEffect").getComponent(cc.ParticleSystem).resetSystem(), this.rewardCash = Number(window.facade.getComponent("LevelModel").playingLevelConfig.Reward);
        var e = 5 * this.rewardCash;
        this.reward.getComponent("TextureLabel").setText("+" + e), window.facade.getComponent("GameModel").addCash(Number(4 * this.rewardCash))
    },
    hide: function() {
        cc.systemEvent.off(i.RESULT_RECOMMEND, this.gotLinks, this), this.node.active = !1, this.restartLabel.active = this.retryCostEnergy.active = !1
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
            0 != e && window.popUp.getComponent("Pop").addPopByName(e + "View", null, !0, !0)
        }
    },
    update: function(e) {}
})