var i = require('ModuleEventEnum'),
    o = require('VirBannerCtrl');
cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function() {
        this.loadedKeys = {}, this.popList = [], this.modeShowed = !1, this.doAction = !0, cc.loader.loadRes("modeBg", cc.SpriteFrame), this.IN_POOL_POPS = {
            DailyReward: 1,
            DatingEdit: 1,
            LoveSeaLucky: 1,
            VipReward: 1,
            WXRank: 1,
            InfoEdit: 1,
            GoodInfo: 1,
            Alert: 1,
            Claim: 1
        }
    },
    reset: function() {
        this.removeAll(), this.popList = [], this.modeShowed = !1
    },
    start: function() {},
    addAlert: function(e, t, n, i) {
        var o = {
            detailString: e,
            enterCallBack: t,
            needCancel: n,
            animSpeed: i
        };
        this.addPopByName("Alert", o, !0, !0)
    },
    addGuide: function(e) {
        this.addPopByName("Guide", e, !1, !1)
    },
    showCurtainIn: function() {
        this._curtainType = "in", this.curtainDeal()
    },
    showCurtainOut: function(e) {
        this._curtainType = "out", this._curtainOutFunc = e, this.curtainDeal()
    },
    curtainDeal: function() {
        if (this.changeAniName = "spine/zhuanchang", window.facade.deviceLow && (this.changeAniName = "spine_low/zhuanchang_low"), cc.loader.getRes(this.changeAniName, sp.SkeletonData)) {
            var e = cc.loader.getRes(this.changeAniName, sp.SkeletonData);
            this.curtainResDeal(e)
        } else cc.loader.loadRes(this.changeAniName, sp.SkeletonData, function(e, t) {
            this.curtainResDeal(t)
        }.bind(this))
    },
    curtianEnded: function() {
        this.curtainAnimate.getComponent(sp.Skeleton).setCompleteListener(null), "out" == this._curtainType && this._curtainOutFunc ? (this._curtainOutFunc(), this._curtainOutFunc = null) : (this.curtainAnimate.removeFromParent(), this.curtainAnimate = null)
    },
    curtainResDeal: function(e) {
        if (null == e && (e = this.curtainRes), this.curtainRes = e, this.curtainAnimate = new cc.Node, this.curtainAnimate.addComponent(sp.Skeleton), this.curtainAnimate.getComponent(sp.Skeleton).skeletonData = e, this.curtainAnimate.getComponent(sp.Skeleton).premultipliedAlpha = !1, cc.director.getScene().getChildByName("Canvas") || cc.director.getScene().runAction(cc.sequence(cc.delayTime(.2), this.curtainResDeal, this)), cc.director.getScene().getChildByName("Canvas").addChild(this.curtainAnimate, 1e3), "out" == this._curtainType) {
            var t = cc.find("Canvas");
            t && t.pauseSystemEvents(!0), this.curtainAnimate.getComponent(sp.Skeleton).setAnimation(0, "play", !1)
        } else this.curtainAnimate.getComponent(sp.Skeleton).setAnimation(0, "play2", !1);
        this.curtainAnimate.getComponent(sp.Skeleton).setCompleteListener(this.curtianEnded.bind(this))
    },
    addPopByName: function(e, t, n, i, o, a, s) {
        console.log("addPopByName:", e), this._tempDatas || (this._tempDatas = {}), this._tempDatas[e] = null, this.loadingUrls || (this.loadingUrls = {});
        for (var c = 0; c < this.popList.length; c++)
            if (this.popList[c].getName() == e) {
                this._clearOne = this.popList[c], null != this._clearOne.getComponent(this._clearOne.name).doClose && this._clearOne.getComponent(this._clearOne.name).doClose(), this.clearPop();
                break
            } if (null == i && (i = !0), this.doAction = 0 != o, this.loadedKeys[e] || cc.loader.getRes("pfb/" + e)) {
            var r = cc.loader.getRes("pfb/" + e),
                l = this.createNew(r, e, t);
            l.setName(e), this.addPop(l, n, i, a, s)
        } else this._tempDatas[e] = t, this.showLoading(), this.loadingUrls[e] = !0, cc.loader.loadRes("pfb/" + e, function(t, o) {
            if (this.hideLoading(), this.loadingUrls[e]) {
                delete this.loadingUrls[e];
                var c = this.createNew(o, e, this._tempDatas[e]);
                c.setName(e), this.addPop(c, n, i, a, s)
            }
        }.bind(this))
    },
    showLoading: function() {
        null == this.loading ? (this.loading = new cc.Node, this.loading.addComponent(cc.Sprite), this.loading.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("modeBg", cc.SpriteFrame), this.loading.scale = 100, this.loading.opacity = 40, this.loading.addComponent(cc.Button), cc.director.getScene().getChildByName("Canvas").addChild(this.loading, window.facade.PopOrder - 1)) : this.loading.active = !0
    },
    hideLoading: function() {
        null != this.loading && (this.loading.removeFromParent(), this.loading = null), null != this.loadingAni && (this.loadingAni.removeFromParent(), this.loadingAni = null)
    },
    createNew: function(e, t, n) {
        console.log("createNew:", t);
        var i = null;
        return (i = (this.IN_POOL_POPS[t], cc.instantiate(e))).getComponent(t) && n && i.getComponent(t).initData(n), i
    },
    addPop: function(e, t, n, a, s) {
        if (cc.director.getScene() && cc.director.getScene().getChildByName("Canvas")) {
            if (t && this.showMode(n), cc.director.getScene().getChildByName("Canvas").addChild(e, window.facade.PopOrder + this.popList.length + 1), this.popList.push(e), console.log("addPop:", e.name, e.zIndex), o.inited || o.init(), this.doAction) this.fadeInPop(e, a, s);
            else {
                var c = e.getComponent(e.name);
                c && null != c.viewDidAppear && c.viewDidAppear(), facade.getComponent("PlayerModel").checkVirBannerShow(e.name) && (o.curShowName = e.name, o.callData())
            }
            cc.systemEvent.emit(i.POP_ADDED)
        }
    },
    fadeInPop: function(e, t, n) {
        if (e.fadeType = t, null == n && (n = cc.v2(0, 0)), "top" == t) {
            e.y = 2e3;
            var i = cc.moveTo(.3, n);
            return i.easing(cc.easeElasticOut(2)), void e.runAction(i)
        }
        if ("bottom" == t) {
            e.y = -2e3;
            var o = cc.moveTo(.3, n);
            return o.easing(cc.easeElasticOut(2)), void e.runAction(o)
        }
        e.scale = .1, e.runAction(cc.sequence(cc.scaleTo(.1, 1.1), cc.scaleTo(.1, 1), cc.callFunc(this.popFadeIn, this)))
    },
    popFadeIn: function(e) {
        var t = e.getComponent(e.name);
        t && null != t.viewDidAppear && t.viewDidAppear(), facade.getComponent("PlayerModel").checkVirBannerShow(e.name) && (o.curShowName = e.name, o.callData())
    },
    showMode: function(e) {
        if (this.modeShowed && this.mode && this.mode.parent) return this.mode.opacity = 255, this.mode.zIndex = window.facade.PopOrder + this.popList.length + 1, void console.log("addMode:", this.mode.zIndex);
        this.mode = new cc.Node, this.mode.addComponent(cc.Sprite), this.mode.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("modeBg", cc.SpriteFrame), this.mode.color = "#383838", this.mode.scale = 100, this.modeShowed = !0, this.mode.runAction(cc.sequence(cc.delayTime(.21), cc.callFunc(function() {
            this.mode.addComponent(cc.Button), this.mode.on("click", this.modeClick, this), this.modeClose = e
        }.bind(this)))), cc.director.getScene().getChildByName("Canvas").addChild(this.mode, window.facade.PopOrder)
    },
    removeTop: function() {
        if (!(null == this.popList || this.popList.length <= 0)) {
            var e = this.popList[this.popList.length - 1];
            if (this._clearOne = e, this.doAction) {
                var t = 0;
                if (this._clearOne.getComponent(this._clearOne.name) && null != this._clearOne.getComponent(this._clearOne.name).closeActTime && (t = this._clearOne.getComponent(this._clearOne.name).closeActTime), this._clearOne.getComponent(this._clearOne.name) && null != this._clearOne.getComponent(this._clearOne.name).doClose && this._clearOne.getComponent(this._clearOne.name).doClose(), "top" == e.fadeType) return void e.runAction(cc.sequence(cc.delayTime(t), cc.moveBy(.3, cc.v2(0, 2e3)), cc.callFunc(this.clearPop, this)));
                "bottom" == e.fadeType && e.runAction(cc.sequence(cc.delayTime(t), cc.moveBy(.3, cc.v2(0, -2e3)), cc.callFunc(this.clearPop, this))), e.runAction(cc.sequence(cc.delayTime(t), cc.scaleTo(.1, 1.1), cc.scaleTo(.1, 0), cc.callFunc(this.clearPop, this)))
            } else e.runAction(cc.sequence(cc.delayTime(t), cc.callFunc(this.clearPop, this)))
        }
    },
    clearPop: function() {
        for (var e = 0; e < this.popList.length; e++)
            if (this.popList[e] == this._clearOne) {
                this.popList.splice(e, 1);
                break
            } o.virBannerNode && o.virBannerNode.active && o.hideVirBanner(), this.modeShowed && this.mode && this.mode.parent && (this.mode.zIndex = window.facade.PopOrder + this.popList.length - 1), this.releasePop(this._clearOne), this.popList.length <= 0 && this.mode && (this.mode.removeFromParent(), this.mode = null, this.modeShowed = !1, cc.systemEvent.emit(i.POP_REMOVED), facade.getComponent("BannerModel").hideBanner())
    },
    removeByName: function(e) {
        if (!(null == this.popList || this.popList.length <= 0)) {
            for (var t = null, n = 0; n < this.popList.length; n++)
                if (this.popList[n].name == e) {
                    t = this.popList[n];
                    break
                } if (t)
                if (this._clearOne = t, this.doAction) {
                    var i = 0;
                    if (null != this._clearOne.getComponent(this._clearOne.name).closeActTime && (i = this._clearOne.getComponent(this._clearOne.name).closeActTime), null != this._clearOne.getComponent(this._clearOne.name).doClose && this._clearOne.getComponent(this._clearOne.name).doClose(), "top" == t.fadeType) return void t.runAction(cc.sequence(cc.delayTime(i), cc.moveBy(.3, cc.v2(0, 2e3)), cc.callFunc(this.clearPop, this)));
                    "bottom" == t.fadeType && t.runAction(cc.sequence(cc.delayTime(i), cc.moveBy(.3, cc.v2(0, -2e3)), cc.callFunc(this.clearPop, this))), t.runAction(cc.sequence(cc.delayTime(i), cc.scaleTo(.1, 1.1), cc.scaleTo(.1, 0), cc.callFunc(this.clearPop, this)))
                } else this._clearOne.runAction(cc.sequence(cc.delayTime(i), cc.callFunc(this.clearPop, this)))
        }
    },
    getPopByName: function(e) {
        if (null == this.popList || this.popList.length <= 0) return !1;
        for (var t = null, n = 0; n < this.popList.length; n++)
            if (this.popList[n].name == e) {
                t = this.popList[n];
                break
            } return t || null
    },
    getTop: function() {
        return this.popList[this.popList.length - 1]
    },
    getPopComponent: function(e) {
        if (null == this.popList || this.popList.length <= 0) return null;
        for (var t = null, n = 0; n < this.popList.length; n++)
            if (this.popList[n].name == e) {
                t = this.popList[n];
                break
            } return t ? t.getComponent(e + "JS") : null
    },
    removeAll: function(e) {
        for (var t in this.loadingUrls) t != e && delete this.loadingUrls[t];
        for (var n = 0; n < this.popList.length; n++) this.popList[n].name != e && (null != this.popList[n].getComponent(this.popList[n].name).doClose && this.popList[n].getComponent(this.popList[n].name).doClose(), this.releasePop(this.popList[n]), this.popList.splice(n, 1), n--);
        this.popList.length <= 0 && this.mode && (this.mode.removeFromParent(), this.mode = null, this.modeShowed = !1), cc.systemEvent.emit(i.POP_REMOVED)
    },
    releasePop: function(e) {
        this.IN_POOL_POPS[e.name] ? window.pool.has(e.name) ? window.pool.put(e.name, e) : window.pool.create(e.name, 1, e) : (e.removeFromParent(), e.destroy())
    },
    modeClick: function(e) {
        this.modeClose && this.removeTop()
    },
    showGoodTip: function(e, t) {
        var n = function(e) {
            for (var t = null, n = 0; n < this.popList.length; n++)
                if ("GoodTips" == this.popList[n].getName()) {
                    t = this.popList[n];
                    break
                } return t
        }.bind(this);
        window.popUp.getComponent("Pop").addPopByName("GoodTips", e, !1, !1, !0, "top", t), this.node.runAction(cc.sequence(cc.delayTime(.21), cc.callFunc(function() {
            var e = n();
            e && e.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
                window.popUp.getComponent("Pop").removeByName("GoodTips")
            }.bind(this))))
        }.bind(this))))
    }
})