var i = require('ModuleEventEnum');
cc.Class({
    extends: cc.Component,
    properties: {},
    initConfig: function() {},
    onLoad: function() {
        facade.isMiniGame && (this.userObject = null, this.rewardTplId = null, this.inviteTypeId = null, this.node.addComponent("WxAdaptor"), this.wxAdaptor = this.node.getComponent("WxAdaptor"), this.wxAdaptor.init(this), cc.systemEvent.on(i.GOT_HTTP_RES, this.httpResDeal.bind(this)), facade.isMiniGame && (cc.systemEvent.on(i.WX_REGISTERED, this.onGotToken.bind(this)), cc.systemEvent.on(i.INIT_ROLEINFO_COMPLETED, this.onRoleInfo, this)))
    },
    onGotToken: function() {
        var e = {
            game_id: window.facade.GameId,
            token: this.token
        };
        window.net.getComponent("Net").httpRequest(window.net.Setting, e), this.checkFuncOpen()
    },
    onRoleInfo: function() {
        this.wxAdaptor.checkBroadcastReward()
    },
    httpResDeal: function(e) {
        if (e && e.data) {
            var t = e.data;
            t.extra_config && t.extra_config.online_version && this.checkVersion(t.extra_config.online_version), t[0] && t[0].func_id && (this.addFuncOpenList(t), window.facade.getFunc = !0)
        }
    },
    checkFuncOpen: function() {
        var e = {};
        e.game_id = window.facade.GameId, e.token = this.token, window.net.getComponent("Net").httpRequest(window.net.CheckFuncOpen, e)
    },
    gotServerData: function(e) {
        this.servers = e, cc.systemEvent.emit(i.GOT_SERVER_INFO)
    },
    checkVersion: function(e) {
        this.verisonValue = Number(e), this.verisonValue < facade.VERSION ? facade.SAVE_MODE = !0 : facade.SAVE_MODE = !1, cc.systemEvent.emit(i.SAVE_MODE_CHANGE)
    },
    addNoticeData: function(e) {
        this.noticeImgs = e
    },
    addFuncOpenList: function(e) {
        for (var t in console.log("func opens:", e), this.funcList = {}, this.funcParams = {}, e) this.funcList[e[t].func_id] = e[t].is_open, this.funcParams[e[t].func_id] = e[t].func_params;
        cc.systemEvent.emit(i.FUNCOPEN_UPDATE)
    },
    isIntersADOpen: function() {
        return !!this.funcList && !(!this.funcList[11] || "1" != this.funcList[11])
    },
    isIconRandomOrder: function(e) {
        var t = 17;
        switch (e) {
            case "result":
                t = 15;
                break;
            case "interstitial":
                t = 16;
                break;
            case "bottom":
                t = 17;
                break;
            case "banner":
                t = 18
        }
        return !!this.funcList && !(!this.funcList[t] || "1" != this.funcList[t])
    },
    checkVirBannerShow: function(e) {
        if (!facade.SAVE_MODE) {
            if (!this.funcList || !this.funcList[10] || "1" != this.funcList[10]) return !1;
            var t = this.funcParams[10].split(",");
            for (var n in t)
                if (t[n] === String(facade.uiNames[e])) return !0;
            return !1
        }
    },
    getRecommondType: function() {
        return !!this.funcList && !(!this.funcList[12] || "1" != this.funcList[12])
    },
    getRecommondCount: function() {
        return this.funcParams && this.funcParams[12] ? Number(this.funcParams[12]) : 19
    },
    getBottomRecommondRandomCount: function() {
        return this.funcParams && this.funcParams[17] ? Number(this.funcParams[17]) : 0
    },
    getInterstiRecommondRandomCount: function() {
        return this.funcParams && this.funcParams[16] ? Number(this.funcParams[16]) : 0
    },
    getResultRecommondRandomCount: function() {
        return this.funcParams && this.funcParams[15] ? Number(this.funcParams[15]) : 0
    },
    getBannerRecommondRandomCount: function(e) {
        if (!this.funcParams || !this.funcParams[18]) return 0;
        null == this.virBannerList && (this.virBannerList = this.funcParams[18].split(","));
        var t = [];
        t = t.concat(e);
        for (var n = 0; n != this.virBannerList.length;) {
            var i = parseInt(this.virBannerList[n]),
                o = t.splice(0, i);
            if (this.checkItem(o), console.log("checklist is : ", o), n++, 0 != o.length) return o
        }
        return parseInt(this.virBannerList[n - 1])
    },
    checkItem: function(e) {
        for (var t = 0; t != e.length;) e[t].navout_cnt > 0 ? e.splice(t, 1) : t++
    },
    isClickCountLimit: function(e) {
        if (!this.funcParams) return !1;
        if (!this.funcParams[14]) return !1;
        for (var t = this.funcParams[14].split(","), n = 0; n < t.length; n++)
            if (t[n] == String(e)) return !0;
        return !1
    },
    isLoginInterOpen: function() {
        if (!this.funcParams) return !1;
        if (!this.funcParams[13]) return !1;
        for (var e = this.funcParams[13].split(","), t = facade.channel_id + "_" + facade.channel_sub, n = 0; n < e.length; n++)
            if (t == e[n]) return !0;
        return !1
    },
    connectGameServer: function(e) {
        0 == e && facade.isMiniGame && window.facade.VERSION > this.verisonValue && (e = facade.SERVER_ID_BETA, facade.SAVE_MODE = !0), this.currentServer = this.servers[e], this.serverAddresss = this.servers[e].websocket, window.net.getComponent("Net").connect(this.serverAddresss)
    },
    onConnected: function() {
        if (console.log("onConnected...1"), facade.isMiniGame || window.facade.inQQ) {
            console.log("onConnected...2"), this._adultType = 3, this._osType = null == window.facade.PhoneInfo.system.match("iOS") ? 1 : 2;
            var e = String(this.userId);
            e = this.serverAddresss.match("wss://") ? String(this.userId) : String(this.privateUid), this.loginGameServer(e)
        } else this._adultType = 3, this._osType = 3, cc.systemEvent.emit(i.NEED_INPUT_ID)
    },
    loginGameServer: function(e) {
        var t = 1,
            n = this.wxAdaptor.getAdScource();
        console.log("got adSource:", n), n && 0 != n && n.chanId && (n = n.chanId + "_" + n.subCid, this.wxAdaptor.chanId = null);
        var i = this.currentServer.id;
        facade.isMiniGame ? (t = 1, window.net.getComponent("Net").behaveReport(window.facade.BEHAVE_LOGIN)) : window.facade.inQQ && (t = window.facade.PhoneInfo.system.match("iOS") ? 3 : 2);
        var o = new Message_login.CGReqUserLoginMessage;
        o.ctor(e, t, this._osType, i, n, this._adultType), window.net.getComponent("Net").send(o)
    },
    getTargetRoleInfo: function(e) {
        var t = new Message_role.CSReqViewTargetProfileMessage;
        t.ctor(e), window.net.getComponent("Net").send(t)
    },
    recordRoleProfile: function() {
        if (this.platUserInfo) {
            var e = {
                game_id: window.facade.GameId,
                token: this.token,
                wx_data: this.wxAdaptor.wxEncryptedData,
                wx_iv: this.wxAdaptor.wxIv
            };
            window.net.getComponent("Net").httpRequest(window.net.RefreshUserInfo, e)
        }
    },
    parseRoleData: function(e) {
        for (var t = e, n = 0; n < e.attrList.length; n++) {
            var i = e.attrList[n];
            t[window.facade.PlayerAtrriKeys[i.type]] = i.value
        }
        for (n = 0; n < e.resList.length; n++) {
            i = e.resList[n];
            t[window.facade.PlayerAtrriKeys["res" + i.type]] = i.value
        }
        return t
    },
    updateRoleData: function(e) {
        var t = {},
            n = 0,
            o = 0;
        if (this.roleInfo && (o = this.roleInfo.level), e.resList)
            for (var a = 0; a < e.resList.length; a++) {
                var s = e.resList[a];
                t[window.facade.PlayerAtrriKeys["res" + s.type]] = s.value
            }
        if (e.attrList)
            for (a = 0; a < e.attrList.length; a++) {
                s = e.attrList[a];
                t[window.facade.PlayerAtrriKeys[s.type]] = s.value
            }
        if (this.roleInfo) {
            var c = !1;
            for (var r in t) this.roleInfo[r] = t[r], "energyLastRev" == r && !0, "level" == r && (n = t[r]), "vip" == r && t[r] > 0 && !0, "province" != r && "city" != r || !0, "midAutumnShop" != r && "midAutumnRank" != r || (c = !0);
            c && cc.systemEvent.emit(i.TITLE_MIDAUTUMNPOINT), n && 0 != n && window.facade.getComponent("RankModel").saveScore(n), this.levelChange = this.roleInfo.level - o, cc.systemEvent.emit(i.ROLE_INFO_UPDATED)
        }
    }
})