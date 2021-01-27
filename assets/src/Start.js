var i = require('GameConfig');
cc.Class({
    extends: cc.Component,
    properties: {
        platformList: {
            default: [],
            type: cc.String
        },
        facade: cc.Node,
        soundInstance: cc.Node,
        net: cc.Node,
        popUp: cc.Node,
        texturemanager: cc.Node,
        guidemanager: cc.Node
    },
    onLoad: function() {
        for (var t in "wx" == i.PLATFORM && wx.showLoading({
                title: "游戏加载中",
                mask: !0
            }), cc.director.getPhysicsManager().enabled = !0, cc.director.getPhysicsManager().gravity = cc.v2(0, -300), window.facade = this.facade, window.audio = this.soundInstance, window.net = this.net, window.textureManager = this.texturemanager, window.popUp = this.popUp, window.net.platformName = "", window.net.checkName = "", window.facade.isMiniGame = !("wx" != i.PLATFORM), this.platformList) {
            var n = this.platformList[t].split(","),
                o = n[0];
            if (null != window["" + o]) {
                window.net.platformName = o, window.net.checkName = n[1], console.log("当前平台： ", window.net.platformName);
                break
            }
        }
        cc.view.enableRetina(!0), cc.view.enableAntiAlias(!1), window.pool = require('Pool'), cc.game.addPersistRootNode(this.facade), cc.game.addPersistRootNode(this.soundInstance), cc.game.addPersistRootNode(this.net), cc.game.addPersistRootNode(this.popUp), cc.game.addPersistRootNode(this.texturemanager), window.facade.addComponent("GameModel"), window.facade.addComponent("LevelModel"), window.facade.addComponent("PlayerModel"), window.facade.addComponent("RecommendGameModel"), window.facade.addComponent("RewardCPAModel"), window.facade.addComponent("ShareADModel"), window.facade.addComponent("BannerModel"), window.facade.addComponent("RankModel"), window.facade.addComponent("InterstitialADModel"), this.doStart()
    },
    doStart: function() {
        cc.director.setClearColor((new cc.Color).fromHEX("#758F89")), this.initModules();
        var e = cc.sequence(cc.fadeOut(.05), cc.callFunc(this.gogame.bind(this)));
        this.node.runAction(e)
    },
    gogame: function() {
        var t = require('ModuleEventEnum');
        cc.systemEvent.emit(t.GO_GAME)
    },
    initModules: function() {
        window.facade.modules = {};
        var t = require('MConfig');
        for (var n in t) {
            var i = t[n].key,
                o = require(i);
            o.init(), window.facade.modules[i] = o
        }
    }
})