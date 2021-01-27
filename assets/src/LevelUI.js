var i = require('ModuleEventEnum'),
    o = require('AnalyticsUtilities').AnalyticsUtilities;
cc.Class({
    extends: cc.Component,
    properties: {
        bulletsBox: cc.Node,
        result: cc.Node,
        skipBtn: cc.Node,
        retryBtn: cc.Node,
        skipPanel: cc.Node,
        cashLabel: cc.Node,
        backBtn: cc.Node,
        replayUI: cc.Node
    },
    onLoad: function() {
        cc.systemEvent.on(i.BULLET_SHOTED, this.bulletShoted, this), cc.systemEvent.on(i.BULLET_USED, this.bulletUsed, this), cc.systemEvent.on(i.LEVEL_PASSED, this.onLevelPassed, this), cc.systemEvent.on(i.FAILURE_BUY_KILL, this.onFailureKill, this), cc.systemEvent.on(i.GUIDE_CLOSED, this.onGuideClosed, this), cc.systemEvent.on(i.STAR_JUMP_CHANGE, this.getThreeStarOrJumpResult, this)
    },
    onEnable: function() {
        cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1e4
    },
    init: function() {
        (this.passed = !1, this.failed = !1, this.replayUI.active = !1, console.log("levelUI init..."), window.facade.getComponent("LevelModel").isNewLevel() && !facade.SAVE_MODE) ? this.skipBtn.active = !0: (this.skipBtn.active = !1, window.facade.getComponent("LevelModel").getLevelStar(facade.selectedLevelType + "_" + window.facade.getComponent("LevelModel").playingLevel) < 3 && popUp.getComponent("Pop").addPopByName("GetTreeStarView", 1, !0, !0, !1));
        window.facade.getComponent("BannerModel").hideBanner(), window.facade.getComponent("GameModel").levelRetryTouch ? window.facade.getComponent("GameModel").levelRetryTouch = !1 : window.facade.getComponent("GameModel").loseEnergy(), this.retryBtn.active = !0, this.bulletsBox.active = !0, this.result.active = !1, this.skipPanel.active = !1, this.backBtn.active = !0, this.config = window.facade.getComponent("LevelModel").playingLevelConfig, this.bulletsBox.removeAllChildren(), this.lastBullets = window.facade.getComponent("LevelModel").lastBullets, this.bestScoreLimit = window.facade.getComponent("LevelModel").starNeeds[0];
        for (var e = 0; e < this.lastBullets; e++) {
            var t = new cc.Node;
            this.bulletsBox.addChild(t), this.lastBullets - e <= this.bestScoreLimit ? t.addComponent(cc.Sprite).spriteFrame = cc.loader.getRes("uis", cc.SpriteAtlas).getSpriteFrame("bullet_light") : t.addComponent(cc.Sprite).spriteFrame = cc.loader.getRes("uis", cc.SpriteAtlas).getSpriteFrame("bullet_dark")
        }
        window.audio.getComponent("SoundManager").playEffect("begin_" + (1 + Math.floor(3 * Math.random())), !1, 50), this.checkGuide()
    },
    onGuideClosed: function() {
        if ("classic" == facade.selectedLevelType) {
            this.finger = cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").getChildByName("finger"), this.finger.active = !0;
            var e = cc.rotateTo(.8, -30),
                t = cc.rotateTo(.8, 0);
            e.easing(cc.easeSineOut()), t.easing(cc.easeSineIn()), this.finger.runAction(cc.sequence(cc.repeat(cc.sequence(e, t), 3), cc.fadeOut(.5)))
        }
    },
    checkGuide: function() {
        window.facade.getComponent("LevelModel").playingLevel > 1 || window.facade.getComponent("LevelModel").isNewLevel() && popUp.getComponent("Pop").addPopByName("Guide" + facade.selectedLevelType, null, !0, !0)
    },
    bulletShoted: function() {
        var e = this.bulletsBox.getChildren();
        e.length <= 0 ? window.audio.getComponent("SoundManager").playEffect("empty") : e[e.length - 1].removeFromParent()
    },
    bulletUsed: function() {
        if (this.bulletsBox.getChildren().length <= 0) {
            if (this.passed) return;
            this.failure()
        }
    },
    isBulletFlying: function() {
        for (var e = cc.director.getScene().getChildByName("Canvas").getChildByName("levelPlay").getChildren(), t = 0; t < e.length; t++)
            if (e[t].name.match("bullet")) return !0;
        return !1
    },
    backMain: function() {
        this.isBulletFlying() && !this.result.active || (cc.systemEvent.emit(i.BACK_MAIN), o.logEvent("左上角返回这界面按钮"))
    },
    retryLabelHandler: function() {
        this.replayUI.active = !0
    },
    retry: function() {
        window.facade.getComponent("LevelModel").resetLevel(), this.result.active = !1, cc.systemEvent.emit(i.RELOAD_LEVEL)
    },
    retryCostEnergy: function() {
        var e = facade.getComponent("LevelModel").costEnergy;
        facade.getComponent("GameModel").energy < e ? cc.systemEvent.emit(i.ENERGY_NEEDED) : (facade.getComponent("GameModel").loseEnergy(), window.facade.getComponent("LevelModel").resetLevel(), this.result.active = !1, cc.systemEvent.emit(i.RELOAD_LEVEL))
    },
    onFailureKill: function() {
        this.node.stopAllActions(), this.failure(!0)
    },
    failure: function(e) {
        cc.director.getScene().getChildByName("Canvas").getComponent("GameLogic").hasPassed && !e || this.failed || (window.audio.getComponent("SoundManager").playEffect("lose"), cc.systemEvent.emit(i.FAILURE), window.facade.getComponent("LevelModel").resultLevel = window.facade.getComponent("LevelModel").playingLevel, this.failed = !0, e ? this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(this.showResult2, this))) : this.showResult(!1))
    },
    onLevelPassed: function(e) {
        this.node.stopAllActions(), this.passed = !0, this.skipBtn.active = !1, this.retryBtn.active = !1, this.bulletsBox.active = !1, this.backBtn.active = !1, window.facade.getComponent("LevelModel").resultLevel = window.facade.getComponent("LevelModel").playingLevel, e ? this.showResult() : this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(this.showResult, this)))
    },
    showResult2: function() {
        this.showResult(!1)
    },
    showResult: function(e) {
        this.backBtn.active = !0, cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1, window.facade.getComponent("LevelModel").resultLevel == window.facade.getComponent("LevelModel").playingLevel && (0 != e && (e = !0), this.result.active = !0, this.result.getComponent("ResultPanel").init(e))
    },
    getThreeStarOrJumpResult: function(e) {
        2 != e && (this.backBtn.active = !0, cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1, this.result.active = !0, this.result.getComponent("ResultPanel").take3StarGet())
    },
    showSkip: function() {
        this.skipBtn.active = !1, this.retryBtn.active = !1, this.skipPanel.active = !0, this.skipPanel.opacity = 0, this.skipPanel.runAction(cc.fadeIn(.2)), this.skipPanel.getComponent("SkipPanel").init()
    },
    hideSkip: function() {
        this.skipBtn.active = !0, this.retryBtn.active = !0, this.skipPanel.active = !1, this.bulletsBox.getChildren().length <= 0 && this.retry()
    },
    update: function(e) {
        this.align()
    },
    align: function() {
        if (!this.reAligned) {
            var e = this.node.getChildren();
            if (window.facade.Screenratio && window.facade.Screenratio < .47) {
                for (var t = 0; t < e.length; t++) "resultPanel" != e[t].name && "skipPanel" != e[t].name && e[t].getComponent(cc.Widget) && (e[t].getComponent(cc.Widget).top += 50, e[t].getComponent(cc.Widget).updateAlignment());
                this.reAligned = !0
            }
        }
    },
    postRequest: function(e, t, n) {
        var i = new XMLHttpRequest;
        i.onreadystatechange = function(e) {
            if (4 == i.readyState && i.status >= 200 && i.status < 300) {
                var t = JSON.parse(i.responseText);
                0 != t.code ? n && n.failure && n.failure(t.code) : n && n.success && n.success(t.data)
            }
        }.bind(this), i.onerror = function(e) {
            n && n.failure && n.failure(e)
        }, i.open("POST", e, !1), i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), i.send(t)
    }
})