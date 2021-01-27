var i = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function() {
        cc.systemEvent.on(i.GOT_HTTP_RES, this.httpResDeal.bind(this)), window.facade.windowWidth = 375, window.facade.windowHeight = 667, facade.isMiniGame && wx.wxOnShowRes && (this._onShowData = wx.wxOnShowRes, wx.wxOnShowRes = null, this.openToService = !1), this.initListener(), this.initVersionLinstener(), facade.isMiniGame && (wx.showShareMenu({
            withShareTicket: !0
        }), wx.setKeepScreenOn({
            keepScreenOn: !0
        }), wx.getSystemInfo({
            success: function(e) {
                if (window.facade.PhoneInfo = e, window.facade.windowWidth = e.windowWidth, window.facade.windowHeight = e.windowHeight, window.facade.Screenratio = Number(e.windowWidth) / Number(e.windowHeight), window.facade.screenWidth = 640, window.facade.screenHeight = 640 / window.facade.Screenratio, window.facade.isIOS = null != e.system.match("iOS"), canvas.width = e.screenWidth * e.pixelRatio, canvas.height = e.screenHeight * e.pixelRatio, console.log("phoneinfo----------------\x3e", window.facade.PhoneInfo), window.facade.isIOS) {
                    if ((t = e.model.split("")).length >= 2 && null != t[1].match("s")) Number(t[1][0]) < 6 && (window.facade.deviceLow = !0);
                    else if ("X" != t[1]) {
                        Number(t[1][0]) <= 6 && (window.facade.deviceLow = !0)
                    }
                } else {
                    var t = e.system.replace("Android ", "");
                    Number(t.split(".")[0]) < 6 && (window.facade.deviceLow = !0)
                }
            }
        }), this.setSharedCancas(), this.login())
    },
    setSharedCancas: function(e) {
        try {
            if (void 0 == wx || wx) {
                var t = wx.getOpenDataContext().canvas;
                t && (t.width = cc.game.canvas.width, t.height = cc.game.canvas.height)
            }
        } catch (e) {}
    },
    start: function() {
        facade.isMiniGame && window.facade.isEnabledVideoAd && this.createVideo()
    },
    init: function(e) {
        this._model = e, this.wxCode = null, this.wxUserInfo = null, this.wxSignature = null, this.wxEncryptedData = null, this.wxRawData = null, this.wxIv = null, this.loginDatas = {
            boxId: 24,
            secret: "f3d7964d586629c82bddb22b65c32b3d",
            boxUid: 0,
            gameId: 0,
            gameOpenid: 0,
            actId: 0,
            chanId: 0,
            subCid: 0
        }, this.behaveReportDatas = {
            openid: 0,
            actId: 0,
            platform: 0,
            chan: 0,
            subChan: 0
        }, this.appLinkReportDatas = {
            gmId: 91,
            objGmId: 0,
            openid: 0,
            chan: 0,
            subChan: 0
        }
    },
    reportEnter: function() {
        this.login()
    },
    relogin: function() {
        console.log("do relogin()..."), this.needRelogin = !0, this.login()
    },
    login: function() {
        console.log("login: function () {..."), wx.login({
            success: function(e) {
                this.wxCode = e.code
            }.bind(this),
            complete: function() {
                this.wxCode ? this.loginServer() : this.loginWithoutUser()
            }.bind(this)
        })
    },
    loginWithoutUser: function() {
        "swan" == window.net.platformName && wx.getSwanId({
            success: function(e) {
                this.baidu_swanid = e.data.swanid, this.baidu_swanid_sign = e.data.swanid_signature
            }.bind(this),
            complete: function() {
                this.loginServer()
            }.bind(this)
        })
    },
    wxGetUserInfo: function() {
        this.isNewGetInfoApi = !0, wx.getSetting && wx.getSetting({
            success: function(e) {
                var t = e.authSetting;
                !0 === t["scope.userInfo"] ? (console.log("用户已经授权，可以获取用户信息"), this.getUserInfoOldApi()) : !1 === t["scope.userInfo"] ? (console.log("用户已拒绝授权, 需要引导用户到设置页面打开授权开关"), wx.showModal({
                    title: "请授权",
                    content: "授权页面的进入路径为：\n右上角菜单->关于->右上角菜单->设置",
                    success: function() {
                        console.log("点击确定")
                    }
                })) : this.createAllowBtn()
            }.bind(this)
        })
    },
    createAllowBtn: function() {
        void 0 != cc.sys.os && 0 == window.facade.isEnteredGame && wx.createUserInfoButton && !window.facade.WXInfoButton ? (console.log("====create btn:", window.facade.windowWidth, window.facade.windowHeight), window.facade.WXInfoButton = wx.createUserInfoButton({
            type: "text",
            text: "        ",
            style: {
                left: 0,
                top: 0,
                width: window.facade.windowWidth,
                height: window.facade.windowHeight,
                lineHeight: 600,
                backgroundColor: "#FFFFFF00",
                borderColor: "#FFFFFF",
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: 40,
                borderRadius: 4
            }
        }), window.facade.WXInfoButton.onTap(function(e) {
            e.errMsg.indexOf("auth deny") > -1 || e.errMsg.indexOf("auth denied") > -1 ? (console.log("用户拒绝授权"), this.guideActive()) : (window.net.getComponent("Net").behaveReport(window.facade.BEHAVE_ALLOWED), this.setUserData(e))
        }.bind(this)), window.facade.WXInfoButton.show()) : this.getUserInfoOldApi()
    },
    getUserInfoOldApi: function() {
        wx.getUserInfo({
            fail: function(e) {
                (e.errMsg.indexOf("auth deny") > -1 || e.errMsg.indexOf("auth denied") > -1) && (console.log("用户拒绝授权"), this.guideActive())
            }.bind(this),
            success: function(e) {
                this.setUserData(e)
            }.bind(this)
        })
    },
    refreshUserInfo: function() {
        wx.getUserInfo({
            success: function(e) {
                this.recordUserData(e)
            }.bind(this)
        })
    },
    recordUserData: function(e) {
        this.wxUserInfo = e.userInfo, this._model.platUserInfo = e.userInfo, this._model.recordRoleProfile()
    },
    setUserData: function(t) {
        window.facade.WXInfoButton && (window.facade.WXInfoButton.hide(), window.facade.WXInfoButton.destroy(), window.facade.WXInfoButton = null), this.wxUserInfo = t.userInfo, this._model.platUserInfo = t.userInfo, this.wxSignature = t.signature, this.wxEncryptedData = t.encryptedData, this.wxRawData = t.rawData, this.wxIv = t.iv, window.facade.isEnteredGame = !0;
        var n = require('ModuleEventEnum');
        cc.systemEvent.emit(n.USER_INFO_ALLOWED), this._model.recordRoleProfile(), cc.systemEvent.emit(n.ENTER_AGREED)
    },
    getWxScene: function() {
        if (this._onShowData && this._onShowData.scene) return this._onShowData.scene;
        var e = wx.getLaunchOptionsSync();
        return e.scene && e.scene ? e.scene : 0
    },
    checkBroadcastReward: function() {
        var e = wx.getLaunchOptionsSync();
        console.log("checkBroadcastReward:", e), "Gongzhonghao" == e.query.lsreward && (facade.fromBroadcast = !0)
    },
    getAdScource: function() {
        if (facade.isMiniGame) {
            var e = wx.getLaunchOptionsSync();
            if (e.referrerInfo && e.referrerInfo.appId && e.referrerInfo.appId == window.facade.WX_APPID_TENCENTBOX) return e.referrerInfo.appId;
            if (e.query && e.query.chanId) {
                var t = {};
                return t.chanId = e.query.chanId, t.subCid = e.query.subCid, t
            }
            return "0_0"
        }
        return "0_0"
    },
    guideActive: function() {
        wx.showModal({
            title: "警告",
            content: "拒绝授权将无法正常游戏",
            cancelText: "取消",
            showCancel: !0,
            confirmText: "设置",
            success: function(e) {
                e.confirm && wx.openSetting({
                    success: function(e) {
                        !0 === e.authSetting["scope.userInfo"] && (console.log("openSetting userInfo----------------------\x3e", e), this.getUserInfoOldApi())
                    }.bind(this)
                })
            }.bind(this)
        })
    },
    loginServer: function() {
        var e = this;
        wx.request({
            url: "https://games.qdos.com/game/wxLogin",
            data: {
                appid: "wxf88c93d96e079e42",
                js_code: e.wxCode
            },
            method: "POST",
            success: function(t) {
                e._model.userId = t.data.data.openid, cc.systemEvent.emit(i.WX_REGISTERED)
            }
        })
    },
    httpResDeal: function(e) {
        var t = e.data;
        if (t && (console.log(JSON.stringify(t)), t && t.user_id && t.token && t.open_id)) {
            if (this._model.userId = t.token, this._model.privateUid = t.user_id, this._model.token = t.token, this._model.gameGate = t.game_gate, this._model.userState = t.user_state, this.openId = this._model.openId = t.open_id, window.facade.token = this._model.token, window.facade.openId = this._model.openId, window.facade.userId = t.user_id, window.facade.channel_id = t.channel_id, window.facade.channel_sub = t.channel_sub, window.net.getComponent("Net").behaveReport(1001), window.net.getComponent("Net").behaveReport(1002), window.net.getComponent("Net").behaveReport(1), facade.isMiniGame) {
                var n = wx.getLaunchOptionsSync();
                console.log("lc====== launchData1 :", n), n.query && n.query.id && window.net.getComponent("Net").behaveReport(8)
            }
            if (this.needRelogin) {
                this.needRelogin = !1;
                var i = {};
                i.game_id = window.facade.GameId, i.token = this._model.token, window.net.getComponent("Net").httpRequest(window.net.ServerInfo, i)
            }
        }
    },
    initVersionLinstener: function() {
        try {
            if (void 0 == wx || wx) {
                if (!wx.getUpdateManager) return;
                wx.getUpdateManager().onCheckForUpdate(function(e) {
                    console.log("hasUpdate", e.hasUpdate), e.hasUpdate && window.popUp.getComponent("Pop").addAlert("当前游戏程序不是最新版本，这可能会造成部分功能体验不畅。代码自行更新完成后会提醒您哦！", null, !1)
                }), wx.getUpdateManager().onUpdateReady(function() {
                    wx.getUpdateManager().applyUpdate()
                }), wx.getUpdateManager().onUpdateFailed(function() {})
            }
        } catch (e) {}
    },
    checkTicket: function(e) {
        e.query && e.query.id && window.net.getComponent("Net").behaveReport(window.facade.BEHAVE_FORM_SHARE), 1 == window.facade.canShowShareGroup ? e.shareTicket && e.sessionid != window.facade.lastSessionid && (window.facade.showShareTicket = e.shareTicket, window.facade.lastSessionid = e.sessionid) : window.facade.canShowShareGroup = !0
    },
    reEnter: function() {
        window.facade.reEnter = !0, cc.systemEvent.emit(i.RE_ENTERED)
    },
    initListener: function() {
        try {
            (void 0 == wx || wx) && (wx.onShow(function(e) {
                if (console.log("lc wxAdaptor ============wx.onShow==========query =", e.query), console.log(e), e.query.id && (window.facade.queryRoleID = e.query.id), this.checkTicket(e), 1 == window.facade.isShareOut ? window.facade.isShareOut = !1 : (window.facade.isEnterGameFirst = !0, this.reEnter()), this._onShowData = e, this._registerList)
                    for (var t = 0; t < this._registerList.length;) this._registerList[t].callback(), this._registerList[t].once ? this._registerList.splice(t, 1) : t++;
                "Gongzhonghao" == e.query.lsreward && (facade.fromBroadcast = !0)
            }.bind(this)), wx.onHide(function(e) {
                console.log("wx.onHide==========")
            }.bind(this)))
        } catch (e) {}
    },
    checkIsDebug: function() {
        if (__wxConfig.envVersion) switch (console.log("__wxConfig.envVersion is :", __wxConfig.envVersion), __wxConfig.envVersion) {
            case "develop":
                return !0;
            case "trial":
            case "release":
                return !1
        }
    },
    checkClientScene: function() {
        var e = this.getWxScene();
        return 1073 == e || 1081 == e
    },
    getEnterAnalyzeId: function() {
        if (this._onShowData && this._onShowData.query && this._onShowData.query.enter_analyze_id) return this._onShowData.query.enter_analyze_id;
        var e = wx.getLaunchOptionsSync();
        return e.query && e.query.enter_analyze_id ? e.query.enter_analyze_id : 0
    },
    getinviteRid: function() {
        if (this._onShowData && this._onShowData.query && this._onShowData.query.id) return this._onShowData.query.id;
        var e = wx.getLaunchOptionsSync();
        return e.query && e.query.id ? e.query.id : "0"
    },
    getinviteType: function() {
        if (this._onShowData && this._onShowData.query && this._onShowData.query.inviteType) return this._onShowData.query.inviteType;
        var e = wx.getLaunchOptionsSync();
        return e.query && e.query.inviteType ? e.query.inviteType : 0
    },
    getInviteId: function() {
        if (console.log("getInviteId:", wx.getLaunchOptionsSync()), this._onShowData && this._onShowData.query && this._onShowData.query.inviteId) return this._onShowData.query.inviteId;
        var e = wx.getLaunchOptionsSync();
        return e.query && e.query.inviteId ? e.query.inviteId : 0
    },
    getInviteQuery: function() {
        if (this._onShowData && this._onShowData.query) return this._onShowData.query;
        var e = wx.getLaunchOptionsSync();
        return e.query && e.query ? e.query : 0
    },
    clearShowData: function() {
        this._onShowData = null
    },
    getReferrerInfo: function() {
        if (this._onShowData && this._onShowData.referrerInfo) return this._onShowData.referrerInfo;
        var e = wx.getLaunchOptionsSync();
        return e.referrerInfo && e.referrerInfo ? e.referrerInfo : 0
    },
    getLoginParams: function() {
        if (facade.isMiniGame) {
            var e = this.getInviteQuery(),
                t = this.getReferrerInfo();
            if (0 != e) return e.boxId && (this.loginDatas.boxId = e.boxId, 2 == e.boxId && (this.loginDatas.secret = "17ed27b11e3bbea460a3a6331361b6f4")), e.boxUid && (this.loginDatas.boxUid = e.boxUid), e.gameId && (this.loginDatas.gameId = e.gameId), this.openId && (this.loginDatas.gameOpenid = this.openId), e.chanId && (this.loginDatas.chanId = e.chanId), e.subCid && (this.loginDatas.subCid = e.subCid), t.appId && (this.loginDatas.appId = t.appId), t.scene && (this.loginDatas.scene = t.scene), this.loginDatas
        }
    },
    getReportParams: function() {
        if (facade.isMiniGame) {
            var e = this.getInviteQuery();
            this.getReferrerInfo();
            if (0 != e) return this.openId && (this.behaveReportDatas.openid = this.openId), e.chanId && (this.behaveReportDatas.chan = e.chanId), e.subCid && (this.behaveReportDatas.subChan = e.subCid), this.behaveReportDatas
        }
    },
    getAppLinkParams: function() {
        if (facade.isMiniGame) {
            var e = this.getInviteQuery();
            this.getReferrerInfo();
            if (0 != e) return this.openId && (this.appLinkReportDatas.openid = this.openId), e.chanId && (this.appLinkReportDatas.chan = e.chanId), e.subCid && (this.appLinkReportDatas.subChan = e.subCid), this.appLinkReportDatas
        }
    },
    removeKeyboard: function() {
        try {
            (void 0 == wx || wx) && (wx.offKeyboardComplete(), wx.hideKeyboard())
        } catch (e) {}
    },
    gc: function() {
        try {
            (void 0 == wx || wx) && wx.triggerGC()
        } catch (e) {}
    },
    compareVersion: function(e, t) {
        null == e && (e = wx.getSystemInfoSync().SDKVersion), e = e.split("."), t = t.split(".");
        for (var n = Math.max(e.length, t.length); e.length < n;) e.push("0");
        for (; t.length < n;) t.push("0");
        for (var i = 0; i < n; i++) {
            var o = parseInt(e[i]),
                a = parseInt(t[i]);
            if (o > a) return 1;
            if (o < a) return -1
        }
        return 0
    },
    isCanShowVideo: function() {
        var e = !1;
        if (facade.isMiniGame) {
            var t = wx.getSystemInfoSync().SDKVersion; - 1 === this.compareVersion(t, "2.0.4") ? console.log("=====版本不够2.0.4，视频广告不能用") : e = !0
        }
        return e
    },
    createVideo: function(e) {},
    loadVideo: function(e) {
        var t = this;
        if (!this.isCanShowVideo()) return window.popUp.getComponent("FloatTip").showTip("微信版本过低无法加载广告"), void(window.facade.isEnabledVideoAd = !1);
        this.entrance = e, window.facade.getComponent("UserModel").starVideo(e), window.audio.getComponent("SoundManager").isPlayingBgm && window.audio.getComponent("SoundManager")._soundActive && (this.videoPauseBGM = !0, window.audio.getComponent("SoundManager").pauseBGM()), facade.isMiniGame && this.videoAd.load().then(function() {
            return t.videoAd.show().catch(function(e) {
                return console.log(e)
            })
        })
    },
    getMenuPos: function() {
        if (null == window.wx) return null;
        var e = wx.getSystemInfoSync().screenWidth,
            t = wx.getSystemInfoSync().screenHeight,
            n = wx.getMenuButtonBoundingClientRect();
        return {
            x: (n.left + n.width / 2) / e - .5,
            y: .5 - n.bottom / t
        }
    },
    checkCollectCondi: function() {
        if (null == window.wx) return !1;
        var e = wx.getSystemInfoSync().SDKVersion,
            t = this.compareVersion(e, "2.2.4"),
            n = this.getWxScene();
        return console.log("wxScene: ", n), t ? -1 != n && (1001 == n || 1089 == n) : -1 != n && (1103 == n || 1104 == n || 1023 == n)
    },
    checkHoverWinShow: function() {
        return 1131 == this.getWxScene()
    },
    reigsterWXFunc: function(e, t) {
        this._registerList = this._registerList || [];
        var n = {};
        n.callback = e, n.once = t, this._registerList.push(n)
    },
    checkInterstitialAd: function() {
        return !(facade.SAVE_MODE || !facade.isMiniGame) && this.compareVersion(null, "2.6.0") >= 0
    },
    createInterstitialAd: function(e) {
        return wx.createInterstitialAd(e)
    },
    getClientReward: function() {
        var e = this;
        wx.openCustomerServiceConversation({
            showMessageCard: !0,
            sendMessageTitle: "",
            sendMessagePath: "",
            sendMessageImg: "",
            success: function(t) {
                e.openToService = !0
            },
            fail: function(t) {
                e.openToService = !1
            }
        }), net.getComponent("Net").behaveReport(facade.BEHAVE_OPENSERVICE)
    },
    update: function(e) {}
})