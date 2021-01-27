var i = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {
        lock: cc.SpriteFrame,
        unlock: cc.SpriteFrame,
        bg: cc.Sprite,
        light: cc.Node,
        stars: cc.Node,
        label: cc.Node,
        lockByStar: cc.Node,
        levelCondition: cc.Sprite
    },
    onLoad: function() {},
    start: function() {
        this._config = this.node.config;
        for (var e = 1; e <= 3; e++) this.stars.getChildByName("star" + e).active = !1;
        var t = window.facade.getComponent("LevelModel").getLevelStar(facade.selectedLevelType + "_" + this._config.Level),
            n = facade.getComponent("LevelModel").getTotalStar();
        for (e = 1; e <= t; e++) this.stars.getChildByName("star" + e).active = !0;
        this.light.active = !1, this.levelCondition.node.active = !1;
        var i = this._config.BonusType;
        if (i > 0) {
            var o = cc.loader.getRes("uis", cc.SpriteAtlas);
            this.levelCondition.spriteFrame = o.getSpriteFrame("level_label" + i)
        }
        this._config.Level == this.node.currentLevel ? (this.light.active = !0, this.bg.spriteFrame = this.unlock, this.stars.active = !1, this._config.Star > n && (this.label.active = !1, this.lockByStar.active = !0), i > 0 && (this.levelCondition.node.active = !0)) : this._config.Level < this.node.currentLevel ? (this._config.BonusType = 0, this.bg.spriteFrame = this.unlock, this.label.y = 20, this.stars.active = !0) : (this.locked = !0, this.stars.active = !1, this.bg.spriteFrame = this.lock, i > 0 && (this.levelCondition.node.active = !0)), this.label.getComponent("TextureLabel").setText(String(this._config.Level))
    },
    goLevel: function() {
        if (!this.locked) {
            if (window.facade.getComponent("LevelModel").getLevelVideo(facade.selectedLevelType + "_" + this._config.Level) > 0) {
                if (3 == this._config.BonusType) window.facade.getComponent("LevelModel").getLevelStar(facade.selectedLevelType + "_" + this._config.Level) < 3 && (this._config.Reward = 2 * this._config.Reward)
            } else if (this._config.Level == this.node.currentLevel && this._config.BonusType > 0) return void this.watchVideo();
            var e = facade.getComponent("LevelModel").costEnergy;
            if (facade.getComponent("GameModel").energy < e) cc.systemEvent.emit(i.ENERGY_NEEDED);
            else {
                var t = facade.getComponent("LevelModel").getTotalStar();
                this._config.Star > t ? popUp.getComponent("FloatTip").showTip("收集" + this._config.Star + "颗星星解锁") : cc.systemEvent.emit(i.GO_LEVEL, this._config.Level)
            }
        }
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
        if (window.facade.getComponent("LevelModel").setOverVideo(this.node.currentLevel), facade.getComponent("LevelModel").costEnergy = 1, 1 == this._config.BonusType) {
            facade.getComponent("LevelModel").costEnergy = 0;
            var e = facade.getComponent("LevelModel").costEnergy;
            if (facade.getComponent("GameModel").energy < e) return void cc.systemEvent.emit(i.ENERGY_NEEDED)
        }
        2 == this._config.BonusType && (this._config.LuckyPoint = 2 * this._config.LuckyPoint), 3 == this._config.BonusType && (this._config.Reward = 2 * this._config.Reward);
        var t = facade.getComponent("LevelModel").getTotalStar();
        this._config.Star > t ? popUp.getComponent("FloatTip").showTip("收集" + this._config.Star + "颗星星解锁") : cc.systemEvent.emit(i.GO_LEVEL, this._config.Level)
    },
    update: function(e) {}
})