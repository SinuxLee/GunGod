let n = module.exports = {}
let t = module

var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
};
CC_WECHATGAME && function() {
    function t(e) {
        function t(e) {
            return Object.prototype.toString.call(e)
        }
        var n = {};
        return "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(e, t) {
            n["[object " + e + "]"] = e.toLowerCase()
        }), null == e ? e : "object" == (void 0 === e ? "undefined" : i(e)) || "function" == typeof e ? n[t.call(e)] || "object" : void 0 === e ? "undefined" : i(e)
    }

    function n() {
        function e() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
        return e() + e() + e() + e() + e() + e() + e() + e()
    }

    function o(e, t) {
        v++, e.as = y, e.at = S, e.rq_c = v, e.ifo = h, e.ak = d.app_key, e.uu = u, e.v = r, e.st = Date.now(), e.ev = t, e.wsr = C, "" !== a(e.ufo) && (e.ufo = e.ufo), e.ec = f, wx.Queue.push(function() {
            return new Promise(function(t, n) {
                wx.request({
                    url: "https://" + l + ".aldwx.com/d.html",
                    data: e,
                    header: {
                        se: m || "",
                        op: g || "",
                        img: L || ""
                    },
                    method: "GET",
                    fail: function() {
                        t("")
                    },
                    success: function(e) {
                        t(200 == e.statusCode ? "" : "status error")
                    }
                })
            })
        })
    }

    function a(e) {
        if (void 0 === e || "" === e) return "";
        var t = {};
        for (var n in e) "rawData" != n && "errMsg" != n && (t[n] = e[n]);
        return t
    }

    function s(e) {
        var t = {};
        for (var n in e) t[n] = e[n];
        return t
    }

    function c(e) {
        for (var t = "", n = 0; n < e.length; n++) e[n].length > t.length && (t = e[n]);
        return t
    }
    var r = "2.0.0",
        l = "glog",
        d = require('ald-game-conf');
    "" === d.app_key && console.error("请在配置文件中填写您的app_key"), d.app_key = d.app_key.replace(/\s/g, ""), wx.request({
        url: "https://" + l + ".aldwx.com/config/app.json",
        method: "GET",
        success: function(e) {
            200 === e.statusCode && (e.data.version != r && console.warn("您的SDK不是最新版本，请尽快升级！"), e.data.warn && console.warn(e.data.warn), e.data.error && console.error(e.data.error))
        }
    });
    var h = "",
        u = function() {
            var e = "";
            try {
                e = wx.getStorageSync("aldstat_uuid"), wx.setStorageSync("ald_ifo", !0)
            } catch (t) {
                e = "uuid_getstoragesync"
            }
            if (e) h = !1;
            else {
                e = n(), h = !0;
                try {
                    wx.setStorageSync("aldstat_uuid", e)
                } catch (e) {
                    wx.setStorageSync("aldstat_uuid", "uuid_getstoragesync")
                }
            }
            return e
        }(),
        p = {},
        m = "",
        g = "",
        f = 0,
        v = "",
        C = wx.getLaunchOptionsSync(),
        w = Date.now(),
        S = "" + Date.now() + Math.floor(1e7 * Math.random()),
        y = "" + Date.now() + Math.floor(1e7 * Math.random()),
        E = 0,
        _ = "",
        L = "",
        T = !0,
        I = !1,
        R = ["aldSendEvent", "aldOnShareAppMessage", "aldShareAppMessage", "aldSendSession", "aldSendOpenid", "aldLevelEvent"],
        N = ["payStart", "paySuccess", "payFail", "die", "revive", "tools", "award"],
        M = ["complete", "fail"];
    void 0 === wx.Queue && (wx.Queue = new function() {
        this.concurrency = 4, this.queue = [], this.tasks = [], this.activeCount = 0;
        var e = this;
        this.push = function(t) {
            this.tasks.push(new Promise(function(n, i) {
                var o = function() {
                    e.activeCount++, t().then(function(e) {
                        n(e)
                    }).then(function() {
                        e.next()
                    })
                };
                e.activeCount < e.concurrency ? o() : e.queue.push(o)
            }))
        }, this.all = function() {
            return Promise.all(this.tasks)
        }, this.next = function() {
            e.activeCount--, e.queue.length > 0 && e.queue.shift()()
        }
    }, wx.Queue.all()), Promise.all([new Promise(function(e, t) {
        wx.getSetting({
            success: function(t) {
                t.authSetting["scope.userInfo"] ? wx.getUserInfo({
                    success: function(t) {
                        L = c(t.userInfo.avatarUrl.split("/")), e(t)
                    },
                    fail: function() {
                        e("")
                    }
                }) : e("")
            },
            fail: function() {
                e("")
            }
        })
    }), new Promise(function(e, t) {
        wx.getNetworkType({
            success: function(t) {
                e(t)
            },
            fail: function() {
                e("")
            }
        })
    }), new Promise(function(e, t) {
        d.getLocation ? wx.getLocation({
            success: function(t) {
                e(t)
            },
            fail: function() {
                e("")
            }
        }) : wx.getSetting({
            success: function(t) {
                t.authSetting["scope.userLocation"] ? (wx.getLocation({
                    success: function(t) {
                        e(t)
                    },
                    fail: function() {
                        e("")
                    }
                }), e("")) : e("")
            },
            fail: function() {
                e("")
            }
        })
    })]).then(function(e) {
        "" !== e[2] ? (p.lat = e[2].latitude || "", p.lng = e[2].longitude || "", p.spd = e[2].speed || "") : (p.lat = "", p.lng = "", p.spd = ""), "" !== e[1] ? p.nt = e[1].networkType || "" : p.nt = "";
        var t = s(p);
        "" !== e[0] && (t.ufo = e[0], _ = e[0]), o(t, "init")
    }), wx.onShow(function(e) {
        if (C = e, E = Date.now(), !T && !I) {
            S = "" + Date.now() + Math.floor(1e7 * Math.random()), h = !1;
            try {
                wx.setStorageSync("ald_ifo", !1)
            } catch (e) {}
        }
        T = !1, I = !1;
        var t = s(p),
            n = s(p);
        t.sm = E - w, e.query.ald_share_src && e.shareTicket && "1044" === e.scene ? (n.tp = "ald_share_click", new Promise(function(e, t) {
            "1044" == C.scene ? wx.getShareInfo({
                shareTicket: C.shareTicket,
                success: function(t) {
                    e(t)
                },
                fail: function() {
                    e("")
                }
            }) : e("")
        }).then(function(e) {
            n.ct = e, o(n, "event")
        })) : e.query.ald_share_src && (n.tp = "ald_share_click", n.ct = "1", o(n, "event")), o(t, "show")
    }), wx.onHide(function() {
        var e = s(p);
        e.dr = Date.now() - E, "" === _ ? wx.getSetting({
            success: function(t) {
                t.authSetting["scope.userInfo"] ? wx.getUserInfo({
                    success: function(t) {
                        e.ufo = t, _ = t, L = c(t.userInfo.avatarUrl.split("/")), o(e, "hide")
                    }
                }) : o(e, "hide")
            }
        }) : o(e, "hide")
    }), wx.onError(function(e) {
        var t = s(p);
        t.tp = "ald_error_message", t.ct = e, f++, o(t, "event")
    });
    var A = {
        aldSendEvent: function(e, t) {
            var n = s(p);
            "" !== e && "string" == typeof e && e.length <= 255 ? (n.tp = e, "string" == typeof t && t.length <= 255 ? (n.ct = String(t), o(n, "event")) : "object" == (void 0 === t ? "undefined" : i(t)) ? (JSON.stringify(t).length >= 255 && console.error("自定义事件参数不能超过255个字符"), n.ct = JSON.stringify(t), o(n, "event")) : void 0 === t || "" === t ? o(n, "event") : console.error("事件参数必须为String,Object类型,且参数长度不能超过255个字符")) : console.error("事件名称必须为String类型且不能超过255个字符")
        },
        aldOnShareAppMessage: function(e) {
            wx.onShareAppMessage(function() {
                I = !0;
                var n = e(),
                    i = "";
                i = void 0 !== C.query.ald_share_src ? void 0 !== n.query ? (C.query.ald_share_src.indexOf(u), n.query + "&ald_share_src=" + C.query.ald_share_src + "," + u) : (C.query.ald_share_src.indexOf(u), "ald_share_src=" + C.query.ald_share_src + "," + u) : void 0 !== n.query ? n.query + "&ald_share_src=" + u : "ald_share_src=" + u, "undefined" != t(n.ald_desc) && (i += "&ald_desc=" + n.ald_desc), n.query = i;
                var a = s(p);
                return a.ct = n, a.ct.sho = 1, a.tp = "ald_share_chain", o(a, "event"), n
            })
        },
        aldShareAppMessage: function(e) {
            I = !0;
            var n = e,
                i = "";
            i = void 0 !== C.query.ald_share_src ? void 0 !== n.query ? (C.query.ald_share_src.indexOf(u), n.query + "&ald_share_src=" + C.query.ald_share_src + "," + u) : (C.query.ald_share_src.indexOf(u), "ald_share_src=" + C.query.ald_share_src + "," + u) : void 0 !== n.query ? n.query + "&ald_share_src=" + u : "ald_share_src=" + u;
            var a = s(p);
            "undefined" != t(n.ald_desc) && (i += "&ald_desc=" + n.ald_desc), n.query = i, a.ct = n, a.tp = "ald_share_chain", o(a, "event"), wx.shareAppMessage(n)
        },
        aldSendSession: function(e) {
            if ("" !== e && e) {
                var t = s(p);
                t.tp = "session", t.ct = "session", m = e, "" === _ ? wx.getSetting({
                    success: function(e) {
                        e.authSetting["scope.userInfo"] ? wx.getUserInfo({
                            success: function(e) {
                                t.ufo = e, o(t, "event")
                            }
                        }) : o(t, "event")
                    }
                }) : (t.ufo = _, "" !== _ && (t.gid = ""), o(t, "event"))
            } else console.error("请传入从后台获取的session_key")
        },
        aldSendOpenid: function(e) {
            if ("" !== e && e) {
                g = e;
                var t = s(p);
                t.tp = "openid", t.ct = "openid", o(t, "event")
            } else console.error("openID不能为空")
        }
    };
    wx.aldStage = new function() {
        function e(e) {
            return !/^\d+(.\d+)*$/.test(e.stageId) || e.stageId.length > 32 ? (console.warn("关卡stageId必须符合传参规则,请参考文档。"), !1) : !("string" !== t(e.stageName) || e.stageName.length > 32) || (console.warn("关卡名称为必传字段,且长度小于32个字符,请参考文档"), !1)
        }
        var n = "",
            i = "",
            a = 0;
        this.onStart = function(o) {
            if (e(o)) {
                var s = {};
                a = Date.now(), s.sid = o.stageId, s.snm = o.stageName, s.state = "start", i = "" + Date.now() + Math.floor(1e7 * Math.random()), n = s, ("string" === t(o.userId) && o.userId) < 32 && (this.uid = o.uid), this.request()
            }
        }, this.onRunning = function(i) {
            if (e(i)) {
                var o = {
                    params: {}
                };
                if (("string" === t(i.userId) && i.userId) < 32 && (this.uid = i.uid), !t(i.event) && -1 != N.join(",").indexOf(i.event + ",")) return void N.join(",");
                if (o.event = i.event, "object" === t(i.params)) {
                    if ("string" !== t(i.params.itemName) || i.params.itemName.length > 32) return void console.warn("道具/商品名称为必传字段，且长度小于32个字符，详情请参考文档");
                    o.params.itnm = i.params.itemName, "string" === t(i.params.itemId) && i.params.itemId.length < 32 && (o.params.itid = i.params.itemId), "number" === t(i.params.itemCount) && i.params.itemCount.length < 32 ? o.params.itco = i.params.itemCount : o.params.itco = 1, -1 !== i.event.indexOf("pay") && ("number" === t(i.params.itemMoney) && i.params.itemMoney.length < 32 ? o.params.money = i.params.itemMoney : o.params.money = 0), "string" === t(i.params.desc) && i.params.desc.length < 64 && (o.params.desc = i.params.desc), o.state = "running", o.sid = i.stageId, o.snm = i.stageName, n = o, this.request()
                }
            }
        }, this.onEnd = function(i) {
            if (e(i)) {
                var o = {
                    state: "end"
                };
                if (("string" === t(i.userId) && i.userId) < 32 && (this.uid = i.uid), !t(i.event) && -1 !== M.join(",").indexOf(i.event + ",")) return void M.join(",");
                o.sid = i.stageId, o.snm = i.stageName, o.event = i.event, o.sdr = 0 !== a ? Date.now() - a : "", o.params = {}, "object" === t(i.params) && "string" === t(i.params.desc) && i.params.desc.length < 64 && (o.params.desc = i.params.desc), n = o, this.request()
            }
        }, this.request = function() {
            var e = s(p);
            n.ss = i, e.ct = n, o(e, "screen")
        }
    };
    for (var b = 0; b < R.length; b++) ! function(e, t) {
        Object.defineProperty(wx, e, {
            value: t,
            writable: !1,
            enumerable: !0,
            configurable: !0
        })
    }(R[b], A[R[b]]);
    try {
        var D = wx.getSystemInfoSync();
        p.br = D.brand || "", p.md = D.model, p.pr = D.pixelRatio, p.sw = D.screenWidth, p.sh = D.screenHeight, p.ww = D.windowWidth, p.wh = D.windowHeight, p.lang = D.language, p.wv = D.version, p.sv = D.system, p.wvv = D.platform, p.fs = D.fontSizeSetting, p.wsdk = D.SDKVersion, p.bh = D.benchmarkLevel || "", p.bt = D.battery || "", p.wf = D.wifiSignal || "", p.lng = "", p.lat = "", p.nt = "", p.spd = "", p.ufo = ""
    } catch (e) {}
}()