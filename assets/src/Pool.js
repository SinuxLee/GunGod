let t = module

var i = cc.Class({
    ctor: function() {
        this._pools = {}
    },
    create: function(e, t, n) {
        var i = this._pools[e];
        null == i && (i = new cc.NodePool, this._pools[e] = i);
        for (var o = 0; o < t; o++) 0 == o ? i.put(n) : i.put(cc.instantiate(n))
    },
    put: function(e, t) {
        var n = this._pools[e];
        null == n && (cc.error("名为{0}的池对象不存在,新创建一个".format(e)), n = new cc.NodePool, this._pools[e] = n), n.put(t)
    },
    get: function(e) {
        var t = this._pools[e];
        return null == t ? (cc.error("名为{0}的池对象不存在".format(e)), null) : 0 == t.size() ? null : t.get()
    },
    from: function(e) {
        var t = this._pools[e.name];
        return null == t || 0 == t.size() ? e.parent ? (this.create(e.name, 1, cc.instantiate(e)), this.get(e.name)) : (this.create(e.name, 1, e), this.get(e.name)) : this.get(e.name)
    },
    has: function(e) {
        return null != this._pools[e] && 0 != this._pools[e].size()
    },
    clear: function(e) {
        var t = this._pools[e];
        null != t ? (t.clear(), cc.error("名为{0}的池对象已清空".format(e)), delete this._pools[e]) : cc.error("名为{0}的池对象不存在".format(e))
    },
    clearAll: function() {
        for (var e in this._pools) this.clear(e)
    }
});
t.exports = new i