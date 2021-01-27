var i = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        result: cc.Node,
        levelLabel: cc.Label,
        backBtn: cc.Node,
        cupLabel: cc.Node
    },
    onLoad: function() {
        cc.systemEvent.on(i.BULLET_SHOTED, this.bulletShoted, this), cc.systemEvent.on(i.LEVEL_SHOT_BULLET_USE, this.bulletUsed, this), cc.systemEvent.on(i.LEVEL_SHOT_PASSED, this.onLevelShotPassed, this), cc.systemEvent.on(i.SHOT_NOW_OVER_SHOW, this.levelShotShowTotal, this)
    },
    start: function() {
        this.init(), cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1e3
    },
    init: function() {
        this.passed = !1, this.failed = !1, console.log("levelUI init..."), this.result.active = !1, this.cupLabel.getComponent("TextureLabel").setText(String(window.facade.getComponent("GameModel").cupNumData)), this.levelLabel.string = "第" + window.facade.getComponent("GameModel").oneShotLevel + "关"
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
        window.audio.getComponent("SoundManager").playEffect("empty")
    },
    bulletUsed: function() {
        if (window.facade.getComponent("LevelModel").lastBullets <= 0) {
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
        this.isBulletFlying() || cc.systemEvent.emit(i.BACK_MAIN)
    },
    retry: function() {
        window.facade.getComponent("LevelModel").resetLevel(), cc.systemEvent.emit(i.RELOAD_LEVEL)
    },
    onFailureKill: function() {
        this.node.stopAllActions(), this.failure(!0)
    },
    failure: function(e) {
        cc.director.getScene().getChildByName("Canvas").getComponent("GameLogic").hasPassed && !e || this.failed || (20 != window.facade.getComponent("GameModel").oneShotLevel ? (cc.systemEvent.emit(i.FAILURE), window.facade.getComponent("LevelModel").resultLevel = window.facade.getComponent("LevelModel").playingLevel, this.failed = !0, this.showResult(!1)) : this.levelShotShowTotal())
    },
    onLevelShotPassed: function(e) {
        this.node.stopAllActions(), this.passed = !0;
        popUp.getComponent("FloatTip").showTip("挑战胜利")
    },
    levelShotShowTotal: function() {
        this.showResult(!0)
    },
    showResult: function(e) {
        this.backBtn.active = !0, cc.director.getScene().getChildByName("Canvas").getChildByName("recommendBar").zIndex = 1, 0 != e && (e = !0), this.result.active = !0, this.result.getComponent("ResultShotOne").init(e)
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
    }
})