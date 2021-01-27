var i = require('ModuleEventEnum'),
    o = require('AnalyticsUtilities').AnalyticsUtilities;
cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function() {
        cc.loader.loadRes("roles", cc.SpriteAtlas), cc.systemEvent.on(i.GO_LEVEL, this.onGoLevel, this), cc.systemEvent.on(i.RELOAD_LEVEL, this.onReloadLevel, this), cc.systemEvent.on(i.GO_NEXT, this.onGoNext, this), cc.systemEvent.on(i.GO_SHOT_NEXT, this.onGoShotNext, this), cc.systemEvent.on(i.LEVEL_ONE_SHOT_GO, this.shotLoadLevel, this)
    },
    start: function() {},
    onGoLevel: function(e) {
        console.log("onGoLevel:", e);
        var t = facade.selectedLevelType;
        "classic" == t && (t = "level"), this.loadLevel(t + "_" + e)
    },
    shotLoadLevel: function(e) {
        if (!this.inLoading && !this.node.getChildByName("levelPlay")) {
            if (window.audio.getComponent("SoundManager").pauseBGM("Bgm"), window.facade.getComponent("Facade").levelPassed = !1, this.levelType = e.split("_")[0], this._levelPre = cc.loader.getRes("levels/" + e.toLowerCase(), cc.Prefab), this._levelPre) return this.level = cc.instantiate(this._levelPre), this.level.position = cc.v2(), this.level.name = "levelPlay", this.node.addChild(this.level, 100), this.changeShotSkins(), this.changeShotBg(), this.generateLevelData(), void cc.systemEvent.emit(i.LEVEL_ONE_SHOT_ADD, this.levelData);
            this.inLoading = !0, cc.loader.loadRes("levels/" + e.toLowerCase(), cc.Prefab, this.onShotLoaded.bind(this))
        }
    },
    onShotLoaded: function(e, t) {
        this.inLoading = !1, console.log("onLoaded...", t), this._levelPre = t, this.level = cc.instantiate(this._levelPre), this.level.position = cc.v2(), this.level.name = "levelPlay", this.node.addChild(this.level, 100), this.changeShotSkins(), this.changeShotBg(), this.generateLevelData(), cc.systemEvent.emit(i.LEVEL_ONE_SHOT_ADD, this.levelData)
    },
    loadLevel: function(e) {
        var t = e.split("_")[0];
        if ("level" == t && (t = "classic"), facade.selectedLevelType = t, !this.inLoading && !this.node.getChildByName("levelPlay")) {
            if (window.audio.getComponent("SoundManager").pauseBGM("Bgm"), window.facade.getComponent("Facade").levelPassed = !1, this.levelType = e.split("_")[0], this._levelPre = cc.loader.getRes("levels/" + e.toLowerCase(), cc.Prefab), this._levelPre) return this.level = cc.instantiate(this._levelPre), this.level.position = cc.v2(), this.level.name = "levelPlay", this.node.addChild(this.level, 2), this.changeSkins(), this.changeBg(), this.generateLevelData(), void cc.systemEvent.emit(i.LEVEL_ADDED, this.levelData);
            this.inLoading = !0, cc.loader.loadRes("levels/" + e.toLowerCase(), cc.Prefab, this.onLoaded.bind(this)), o.logEvent("进入游戏界面")
        }
    },
    onLoaded: function(e, t) {
        this.inLoading = !1, console.log("onLoaded...", t), this._levelPre = t, this.level = cc.instantiate(this._levelPre), this.level.position = cc.v2(), this.level.name = "levelPlay", this.node.addChild(this.level, 2), this.changeSkins(), this.changeBg(), this.generateLevelData(), cc.systemEvent.emit(i.LEVEL_ADDED, this.levelData)
    },
    generateLevelData: function() {
        this.levelData = {}, this.levelData.levelType = this.levelType, this.levelData.isDebug = this.isDebug, this.levelData.node = this.level
    },
    changeSkins: function() {
        if (window.facade.getComponent("LevelModel").playingLevelConfig)
            for (var e = this.level.getChildren(), t = cc.loader.getRes("roles", cc.SpriteAtlas), n = 0; n < e.length; n++)
                if (null != e[n].name.match("suffer"))
                    for (var i = window.facade.getComponent("LevelModel").playingLevelConfig.Enemy, o = e[n].getChildren(), a = 0; a < o.length; a++)
                        if ("blood" != o[a].name) o[a].getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED, o[a].getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame(i + "_" + o[a].name);
                        else {
                            var s = cc.Color.BLACK;
                            o[a].getComponent(cc.ParticleSystem).startColor = s.fromHEX("#94F8F0"), o[a].getComponent(cc.ParticleSystem).endColor = s.fromHEX("#94F8F0")
                        }
        else if ("role" == e[n].name) {
            if ("injury" == this.levelType) {
                var c = e[n].getChildByName("blood");
                s = cc.Color.BLACK;
                c.getComponent(cc.ParticleSystem).startColor = s.fromHEX("#94F8F0"), c.getComponent(cc.ParticleSystem).endColor = s.fromHEX("#94F8F0"), this.changeRoleSkin2(e[n])
            } else this.changeRoleSkin1(e[n]);
            e[n].zIndex = 9999
        } else if (null != e[n].name.match("vip")) {
            c = e[n].getChildByName("blood"), s = cc.Color.BLACK;
            c.getComponent(cc.ParticleSystem).startColor = s.fromHEX("#94F8F0"), c.getComponent(cc.ParticleSystem).endColor = s.fromHEX("#94F8F0")
        }
    },
    changeShotSkins: function() {
        if (window.facade.getComponent("LevelModel").nowLevelConfig)
            for (var e = this.level.getChildren(), t = cc.loader.getRes("roles", cc.SpriteAtlas), n = 0; n < e.length; n++)
                if (null != e[n].name.match("suffer"))
                    for (var i = window.facade.getComponent("LevelModel").nowLevelConfig.Enemy, o = e[n].getChildren(), a = 0; a < o.length; a++)
                        if ("blood" != o[a].name) o[a].getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED, o[a].getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame(i + "_" + o[a].name);
                        else {
                            var s = cc.Color.BLACK;
                            o[a].getComponent(cc.ParticleSystem).startColor = s.fromHEX("#94F8F0"), o[a].getComponent(cc.ParticleSystem).endColor = s.fromHEX("#94F8F0")
                        }
        else if ("role" == e[n].name) {
            if ("injury" == this.levelType) {
                var c = e[n].getChildByName("blood");
                s = cc.Color.BLACK;
                c.getComponent(cc.ParticleSystem).startColor = s.fromHEX("#94F8F0"), c.getComponent(cc.ParticleSystem).endColor = s.fromHEX("#94F8F0"), this.changeRoleSkin2(e[n])
            } else this.changeRoleSkin1(e[n]);
            e[n].zIndex = 9999
        } else if (null != e[n].name.match("vip")) {
            c = e[n].getChildByName("blood"), s = cc.Color.BLACK;
            c.getComponent(cc.ParticleSystem).startColor = s.fromHEX("#94F8F0"), c.getComponent(cc.ParticleSystem).endColor = s.fromHEX("#94F8F0")
        }
    },
    changeRoleSkin1: function(e) {
        var t = window.facade.getComponent("GameModel").characterId,
            n = cc.loader.getRes("roles", cc.SpriteAtlas);
        e.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED, e.getChildByName("handGun").getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED, e.getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame("MrBullet_Role_Body_0" + t), e.getChildByName("handGun").getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame("MrBullet_Role_AimArm_0" + t), e.getChildByName("handGun").x = -26, e.getChildByName("handGun").y = 19
    },
    changeRoleSkin2: function(e) {
        for (var t = window.facade.getComponent("GameModel").characterId, n = cc.loader.getRes("roles", cc.SpriteAtlas), i = e.getChildren(), o = 0; o < i.length; o++) {
            var a = i[o];
            a.getComponent(cc.Sprite) ? a.getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame("Role_0" + t + "_" + a.name) : a.getChildByName("skin") && (a.getChildByName("skin").getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED, a.getChildByName("skin").getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame("Role_0" + t + "_" + a.name)), a.getChildByName("handGun") && (a.getChildByName("handGun").getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame("MrBullet_Role_AimArm_0" + t))
        }
    },
    changeBg: function() {
        window.facade.getComponent("LevelModel").playingLevelConfig && (this.bgSkinUrl = "scene/" + window.facade.getComponent("LevelModel").playingLevelConfig.BgImage + ".jpg", this.bg = this.level.getChildByName("bg"), cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame) ? (this.bg.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame), cc.director.getScene().getChildByName("Canvas").getChildByName("bg").getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame)) : cc.loader.loadRes(this.bgSkinUrl, cc.SpriteFrame, this.onSkinLoaded.bind(this)))
    },
    onSkinLoaded: function(e, t) {
        this.bg.spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame), cc.director.getScene().getChildByName("Canvas").getChildByName("bg").getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame)
    },
    changeShotBg: function() {
        window.facade.getComponent("LevelModel").nowLevelConfig && (this.bgSkinUrl = "scene/" + window.facade.getComponent("LevelModel").nowLevelConfig.BgImage + ".jpg", this.bg = this.level.getChildByName("bg"), cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame) ? (this.bg.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame), cc.director.getScene().getChildByName("Canvas").getChildByName("bg").getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame)) : cc.loader.loadRes(this.bgSkinUrl, cc.SpriteFrame, this.onSkinLoaded.bind(this)))
    },
    onLevelPassed: function(e) {
        console.log("onLevelPassed...", e), window.facade.getComponent("Facade").levelPassed = !0, setTimeout(this.changeLevel.bind(this), 5e3)
    },
    onGoNext: function() {
        window.facade.getComponent("LevelModel").playingLevel++, window.facade.getComponent("Facade").levelPassed = !0, this.level.removeFromParent(), cc.systemEvent.emit(i.GO_LEVEL, window.facade.getComponent("LevelModel").playingLevel)
    },
    onGoShotNext: function() {
        this.level.removeFromParent(), window.facade.getComponent("LevelModel").initShotData()
    },
    onReloadLevel: function() {
        this.level.removeFromParent(), cc.systemEvent.emit(i.GO_LEVEL, window.facade.getComponent("LevelModel").playingLevel)
    },
    changeLevel: function() {
        this.levelId++, this.levelId > 10 || (this.level.removeFromParent(), this.loadLevel("level_" + this.levelId))
    }
})