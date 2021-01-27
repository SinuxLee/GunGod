var i;

function o(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e
}
var a = require('ModuleEventEnum'),
    s = require('Network');
cc.Class((o(i = {
    extends: cc.Component,
    properties: {
        isCPA: !1,
        maxCarTerm: 0,
        cpaGameTime: 0,
        boxGameTime: 0,
        resourceMarkup: 0,
        carMarkup: 0,
        cpaRecord: [],
        boxReward: null
    },
    navigateToGame: function(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            i = e.link,
            o = e.link_params,
            a = e.link_game_id,
            s = e.game_id;
        if (wx.navigateToMiniProgram) {
            this.callback = t, o = "pages/index/index?" + o, console.log("lc 游戏跳转 : appId=", i, ", path=", o, " extraData = ", e);
            var c = this;
            wx.navigateToMiniProgram({
                appId: i,
                extraData: {
                    info: e
                },
                path: o,
                envVersion: n ? "develop" : "release",
                success: function() {
                    console.log("lc 游戏跳转 : 成功"), c.sendTravelGame(a, s), t && t.success(), c.isCPA = !0
                },
                fail: function() {
                    t && t.failure(), console.log("lc 游戏跳转 : 失败"), popUp.getComponent("Pop").getPopByName("FakeInterUI") || popUp.getComponent("Pop").addPopByName("FakeInterUI", null, !0)
                },
                complete: function() {}
            })
        }
    },
    sendTravelGame: function(e, t) {
        console.log("lc 跳转游戏-- 上报 webSocket", e, t);
        var n = {
            game_id: window.facade.GameId,
            to_game_id: e,
            final_to_game_id: t,
            token: window.facade.getComponent("PlayerModel").token
        };
        window.net.getComponent("Net").httpRequest(window.net.NavigateOut, n), console.log("lc 跳转游戏-- 上报 行行行 ", t), window.net.getComponent("Net").appLinkReport(t)
    },
    onLoad: function() {
        cc.systemEvent.on(a.GAMESENE_ENTERED, this.loadingEnd.bind(this)), cc.systemEvent.on(a.RELOGIN_SUCCESS, this.reLoginSuccess.bind(this)), cc.systemEvent.on(a.SERVER_RESPONSE, this.onServerResponse.bind(this)), this.monitorWXLifeCycle()
    },
    monitorWXLifeCycle: function() {
        if (facade.isMiniGame) {
            var e = this;
            wx.onShow(function() {
                setTimeout(function() {
                    "Game" == cc.director.getScene().name && window.net.getComponent("Net").inConnecting ? (console.log("lc cpa-- wx.onShow 检测奖励", window.net.getComponent("Net").inConnecting), e.getCPAReward()) : console.log("lc cpa-- wx.onShow 不满足领取条件")
                }, 200)
            })
        }
    },
    loadingEnd: function() {
        var e = this;
        setTimeout(function() {
            "Game" == cc.director.getScene().name && window.net.getComponent("Net").inConnecting && (console.log("lc cpa 加载完成 领取奖励"), e.getCPAReward())
        }, 200)
    },
    reLoginSuccess: function() {
        "Game" == cc.director.getScene().name && window.net.getComponent("Net").inConnecting && (console.log("lc cpa 重连成功 检测奖励"), this.getCPAReward())
    },
    onServerResponse: function(e) {
        var t = e.detail;
        switch (t.messageName) {
            case "Message_reward.SCResLinkRewardFetchMessage":
                console.log("lc cpa -- 领取盒子奖励 ", t.linkGameId);
                var n = {
                    type: 3,
                    content: this.boxReward.content
                };
                window.popUp.getComponent("Pop").addPopByName("Prop", [n], !0);
                break;
            case "Message_reward.SCResLinkRewardFetchedInfoMessage":
                console.log("lc cpa -- 已经领取信息 ", t.linkGameIds), this.callback.success(t.linkGameIds)
        }
    },
    receiveCPAReward: function(e, t, n) {
        var i = this;
        if (5 == (e = parseInt(e))) this.getBoxGameReward(t);
        else {
            if (1 == e) {
                var o = t;
                facade.getComponent("GameModel").requestUpGradeACar(o, 1), window.facade.getComponent("RewardBoxModel").carId = 0, console.log("lc cpa-- 开箱子", e, t)
            } else 2 == e ? (window.facade.getComponent("RewardOnlineModel").requestOpenEgg(1), console.log("lc cpa-- 开箱子", e, t)) : 3 == e ? window.facade.getComponent("RewardSubsidyModel").freeMoneyFetch(1) : 4 == e && cc.systemEvent.emit(a.CAN_FREE_BUY_CAR, t);
            window.facade.getComponent("RewardCPAModel").getBoxGameRewardInfo({
                success: function(e) {
                    for (var t = !1, o = 0; o < e.length; o++)
                        if (e[o] == n) {
                            t = !0;
                            break
                        } 0 == t ? setTimeout(function() {
                        i.getBoxGameReward(n), console.log("lc cpa 盒子中 没有领取过")
                    }, 100) : console.log("lc cpa 盒子中 已经领取过")
                }
            })
        }
        this.removeCPAReward()
    },
    saveCPAReward: function(e, t, n) {
        cc.sys.localStorage.setItem("cpaGame", n), cc.sys.localStorage.setItem("cpaTime", this.clientTimeStamp()), cc.sys.localStorage.setItem("cpaType", e), null != t && cc.sys.localStorage.setItem("cpaContent", t), console.log("lc cpa-- 保存奖励", e, t)
    },
    getCPAReward: function() {
        var e = cc.sys.localStorage.getItem("cpaGame"),
            t = cc.sys.localStorage.getItem("cpaTime"),
            n = cc.sys.localStorage.getItem("cpaType"),
            i = cc.sys.localStorage.getItem("cpaContent");
        (console.log("lc cpa-- 获取奖励", t, n, i), t && "" != t) ? (console.log("lc cpa 有奖励"), this.clientTimeStamp() - t < 1e3 * (5 != n ? this.cpaGameTime : this.boxGameTime) ? (console.log("lc cpa 没有达到时间要求"), this.removeCPAReward()) : (console.log("lc cpa 达到时间要求, 领取奖励"), this.receiveCPAReward(n, i, e))) : (console.log("lc cpa 没有奖励"), this.removeCPAReward())
    },
    getBoxGameRewardInfo: function(e) {
        this.callback = e, console.log("lc cpa 查询盒子奖励")
    },
    getBoxGameReward: function(e) {
        console.log("lc cpa 领取盒子奖励")
    },
    removeCPAReward: function() {
        cc.sys.localStorage.removeItem("cpaGame"), cc.sys.localStorage.removeItem("cpaTime"), cc.sys.localStorage.removeItem("cpaType"), cc.sys.localStorage.removeItem("cpaContent"), console.log("lc cap 移除奖励")
    },
    clientTimeStamp: function() {
        return (new Date).getTime()
    }
}, "clientTimeStamp", function() {
    return (new Date).getTime()
}), o(i, "requestCPAGame", function(e) {
    var t = window.facade.httpServerAdress + window.net.RecommendGame,
        n = {
            game_id: window.facade.GameId,
            token: window.facade.getComponent("PlayerModel").token
        },
        i = this;
    s.postReq(t, n, {
        success: function(t) {
            var n = i.setupRecommendList(t.recommend_info);
            e.success(n)
        },
        failure: function(t) {
            e.success(null)
        }
    })
}), o(i, "setupRecommendList", function(e) {
    for (var t = [], n = 0; n < e.length; n++) {
        var i = e[n];
        5 == parseInt(i.group) && t.push(i)
    }
    t = t.sort(function(e, t) {
        return parseInt(e.weight) < parseInt(t.weight) ? 1 : parseInt(e.weight) > parseInt(t.weight) ? -1 : 0
    });
    for (var o = [], a = [], s = 0; s < t.length; s++) {
        var c = t[s];
        parseInt(c.navout_cnt) <= 0 ? o.push(c) : a.push(c)
    }
    if (console.log("lc cpa recommendList =", o, a), o.length > 0) {
        var r = parseInt(Math.random() * o.length);
        return console.log("lc cpa random showParams = ", r, o.length), o[r]
    }
    r = parseInt(Math.random() * a.length);
    return console.log("lc cpa random clickParams = ", r, a.length), a[r]
}), o(i, "initConfig", function() {
    for (var e in this.globalDB = cc.loader.getRes("config/GlobalDB"), this.globalDB) {
        if ("47104" == e) {
            var t = this.globalDB[e].value.split("|");
            this.headOrderIds = t[0].split(":")[1].split(","), this.loopOrderIds = t[0].split(":")[1].split(",")
        }
        if ("47201" == e && (this.maxCarTerm = parseInt(this.globalDB[e].value), console.log("lc cpa-- maxCarTerm = ", this.maxCarTerm)), "47202" == e && (this.cpaGameTime = parseInt(this.globalDB[e].value), console.log("lc cpa-- cpaGameTime = ", this.cpaGameTime)), "47203" == e && (this.resourceMarkup = parseInt(this.globalDB[e].value), console.log("lc cpa-- resourceMarkup = ", this.resourceMarkup)), "47204" == e && (this.carMarkup = parseInt(this.globalDB[e].value), console.log("lc cpa-- carMarkup = ", this.carMarkup)), "47301" == e) {
            var n = this.globalDB[e].value;
            this.boxReward = {}, this.boxReward.type = n.split(":")[0], this.boxReward.content = n.split(":")[1], console.log("lc cpa-- boxReward = ", this.boxReward)
        }
        "47302" == e && (this.boxGameTime = parseInt(this.globalDB[e].value), console.log("lc cpa-- boxGameTime = ", this.boxGameTime))
    }
}), i))