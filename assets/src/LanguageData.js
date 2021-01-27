let n = module.exports = {}
let t = module

var i = require('polyglot.min'),
    o = null;

function a(e) {
    return window.i18n.languages[e]
}

function s(e) {
    e && (o ? o.replace(e) : o = new i({
        phrases: e,
        allowMissing: !0
    }))
}
window.i18n || (window.i18n = {
    languages: {},
    curLang: ""
}), t.exports = {
    init: function(e) {
        if (e !== window.i18n.curLang) {
            var t = a(e) || {};
            window.i18n.curLang = e, s(t), this.inst = o
        }
    },
    t: function(e, t) {
        if (o) return o.t(e, t)
    },
    inst: o,
    updateSceneRenderers: function() {
        for (var e = cc.director.getScene().children, t = [], n = 0; n < e.length; ++n) {
            var i = e[n].getComponentsInChildren("LocalizedLabel");
            Array.prototype.push.apply(t, i)
        }
        for (var o = 0; o < t.length; ++o) {
            var a = t[o];
            a.node.active && a.updateLabel()
        }
        for (var s = [], c = 0; c < e.length; ++c) {
            var r = e[c].getComponentsInChildren("LocalizedSprite");
            Array.prototype.push.apply(s, r)
        }
        for (var l = 0; l < s.length; ++l) {
            var d = s[l];
            d.node.active && d.updateSprite(window.i18n.curLang)
        }
    }
}