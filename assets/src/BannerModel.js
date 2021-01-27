var i = require('Network');
cc.Class({
    extends: cc.Component,
    properties: {
        bannerAd: null,
        isTransfinite: !1,
        isOpen: !1,
        isInclude: !1,
        showCount: 0,
        hideCount: 0,
        delayTime: 2e3,
        mistakeTime: 2e3,
        isRandomLoc: !1,
        isRandomLocInclude: !1
    },
    initConfig: function() {},
    onLoad: function() {},
    initBanner: function() {
        if (window.facade.bannerWidth = 300, window.facade.bannerHeight = 226, facade.isMiniGame) {
            facade.Screenratio && 1 / facade.Screenratio > 2.06 && (window.facade.bannerHeight = 290), this.leftSize = 0, window.facade.windowWidth > window.facade.bannerWidth && (this.leftSize = (window.facade.windowWidth - window.facade.bannerWidth) / 2);
            var e = this,
                t = {};
            switch (net.platformName) {
                case "wx":
                    t = {
                        adUnitId: "adunit-83ab50403a2e3b36",
                        style: {
                            left: e.leftSize,
                            top: window.facade.windowHeight - 93,
                            width: window.facade.bannerWidth
                        }
                    };
                    break;
                case "swan":
                    t = {
                        appid: "a0072267",
                        apid: "6446734",
                        style: {
                            left: e.leftSize,
                            top: facade.windowHeight - 93,
                            width: facade.bannerWidth
                        }
                    };
                    break;
                case "qq":
                case "tt":
                    t = {}
            }
            return this.bannerAd = wx.createBannerAd(t), this.bannerAd.onLoad(function() {}), this.bannerAd.onError(function(t) {
                e.bannerAd = null
            }), this.bannerAd.onResize(function(t) {
                e.bannerHeight = t.height, facade.Screenratio && 1 / facade.Screenratio > 2.06 ? window.facade.bannerHeight = 2 * (t.height + 15 + 20) + 30 : window.facade.bannerHeight = 2 * (t.height + 20), this.rePosBanner()
            }.bind(this)), this.bannerAd
        }
    },
    showBanner: function(e) {
        {
            if (facade.isMiniGame) return e && facade.isMiniGame ? window.facade.SAVE_MODE ? (this.delayTime = 0, void this.setupDelay(e)) : this.isTransfinite ? void this.setupDelay(e) : this.isOpen ? this.isInclude ? void this.setupDelay(e) : parseInt(this.getBannerCount()) % (parseInt(this.hideCount) + parseInt(this.showCount)) < this.hideCount ? void this.setupDelay(e) : void this.setupMistake(e) : void this.setupDelay(e) : void this.setupBanner();
            e && (e.startDelay(), this.delayTimer = setTimeout(function() {
                e.endDelay()
            }, this.delayTime))
        }
    },
    showVirtualBanner: function(e) {
        var t = function(e) {
            e && e.endDelay()
        }.bind(this);
        if (this.isShowVirBanner = !0, facade.isMiniGame) {
            if (window.facade.SAVE_MODE) return;
            if (this.isTransfinite) return console.log("lc banner-- 展示次数超过限制"), void t(e);
            if (!this.isOpen) return console.log("lc banner-- 误点功能未开放, 延迟"), void t(e);
            if (this.isInclude) return console.log("lc banner-- 处于关闭列表, 延迟"), void t(e);
            var n = parseInt(this.getBannerCount());
            console.log("lc banner-- 展示次数 no = ", this.hideCount, " show = ", this.showCount);
            var i = n % (parseInt(this.hideCount) + parseInt(this.showCount));
            return console.log("lc banner--  bannerCount = " + n + "  show = " + i), i < this.hideCount ? (console.log("lc banner-- 获取 banner 类型 : 不处于关闭列表, 当前不出现, 延迟"), void t(e)) : (console.log("lc banner-- 获取 banner 类型 : 不处于关闭列表, 当前出现, 误点"), void this.setupMistake(e))
        }
        e && (e.startDelay(), console.log("lc banner-- 非微信 开始延迟"), this.delayTimer = setTimeout(function() {
            console.log("lc banner-- 非微信 结束延迟"), e.endDelay()
        }, this.delayTime))
    },
    hideBanner: function() {
        null != this.mistakeTimer && (clearTimeout(this.mistakeTimer), this.mistakeTimer = null), null != this.delayTimer && (clearTimeout(this.delayTimer), this.delayTimer = null), this.isShowBanner = !1, null != this.bannerAd && this.bannerAd.hide()
    },
    setupDelay: function(e) {
        e && (e.startDelay(), this.setupBanner(null), this.delayTime > 0 ? this.delayTimer = setTimeout(function() {
            e.endDelay()
        }, this.delayTime) : e.endDelay())
    },
    setupMistake: function(e) {
        var t = this;
        e && (this.isRandom = !1, this.isRandomLoc && !this.isRandomLocInclude && (this.isRandom = !0), e.startMistake(this.getStartRandomLocation()), this.mistakeTime > 0 ? this.mistakeTimer = setTimeout(function() {
            t.isShowBanner ? e.endMistake(t.getEndRandomLocation()) : t.setupBanner(e)
        }, this.mistakeTime) : this.isShowBanner ? e.endMistake(this.getEndRandomLocation()) : this.setupBanner(e))
    },
    getStartRandomLocation: function() {
        var e = 0,
            t = window.facade.bannerHeight / 2 - 20,
            n = window.facade.windowWidth,
            i = -40;
        return this.isRandom && (e = parseInt(Math.random() * (n - 100) - (n - 100) / 2), t = parseInt(Math.random() * (window.facade.bannerHeight - 100) + 40), i = parseInt(150 * Math.random() + 160)), {
            x: e,
            bottom: t,
            top: i
        }
    },
    getEndRandomLocation: function() {
        var e = 0,
            t = window.facade.bannerHeight + 160,
            n = window.facade.windowWidth;
        return this.isRandom && (e = parseInt(Math.random() * (n - 100) - (n - 100) / 2)), {
            x: e,
            bottom: t,
            top: -40
        }
    },
    setupBanner: function(e) {
        var t = this,
            n = this;
        this.isShowVirBanner && (this.isShowVirBanner = !1, null != e && e.endMistake(n.getEndRandomLocation())), null != this.bannerAd ? (this.bannerAd.show().then(function() {
            n.isShowBanner = !0, n.uploadBannerShow(), null != e && e.endMistake(n.getEndRandomLocation())
        }), this.bannerAd.onError(function(i) {
            t.bannerAd = null, console.log("lc banner-- 显示 err = " + i), null != e && e.endMistake(n.getEndRandomLocation())
        }), this.rePosBanner()) : (this.bannerAd = this.initBanner(), this.bannerAd.onError(function(i) {
            t.bannerAd = null, null != e && e.endMistake(n.getEndRandomLocation())
        }), this.bannerAd.show().then(function() {
            n.uploadBannerShow(), null != e && e.endMistake(n.getEndRandomLocation())
        }), this.rePosBanner())
    },
    rePosBanner: function() {
        facade.Screenratio && 1 / facade.Screenratio > 2.06 ? this.bannerAd.style.top = window.facade.windowHeight - window.facade.bannerHeight / 2 + 20 + 15 + 15 : this.bannerAd.style.top = window.facade.windowHeight - window.facade.bannerHeight / 2 + 20
    },
    getBannerCount: function() {
        var e = cc.sys.localStorage.getItem("bannerCount"),
            t = cc.sys.localStorage.getItem("bannerTime");
        return e = e || 0, t = t || 0, parseInt(t) < window.net.getComponent("Net").getServerToday0Clock() && (e = 0), e
    },
    saveBannerCount: function() {
        var e = this.getBannerCount(),
            t = window.net.getComponent("Net").getServerTimeSec();
        e += 1, cc.sys.localStorage.setItem("bannerCount", e), cc.sys.localStorage.setItem("bannerTime", t)
    },
    uploadBannerShow: function() {
        var e = this,
            t = window.facade.httpServerAdress + "game/adBannerShow",
            n = {
                game_id: window.facade.GameId,
                token: window.facade.getComponent("PlayerModel").token
            };
        i.postRequest(t, n, {
            success: function(t) {
                e.isTransfinite = 1 != t.is_show, e.saveBannerCount()
            },
            failure: function(t) {
                e.isTransfinite = !1
            }
        })
    }
})