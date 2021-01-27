let n = module.exports = {}
let t = module

var i = {
    changeNumToTime: function(e) {
        var t = parseInt(e / 60),
            n = "",
            i = parseInt(t / 60);
        i > 0 && (n = i + ":", t = parseInt(t % 60));
        var o = e % 60,
            a = t + "",
            s = o + "";
        return 0 === t && (a = "0"), t < 10 && (a = "0" + t), o < 10 && (s = "0" + o), n + a + ":" + s
    },
    setShareADShow: function(e, t, n) {
        var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
        switch (e) {
            case 1:
                t.active = !0, null != i && (i.string = "看视频");
                break;
            case 2:
                n.active = !0, null != i && (i.string = "去分享")
        }
    }
};
t.exports = i