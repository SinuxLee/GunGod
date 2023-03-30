const t = module

const i = cc.Class({
  ctor: function () {
    this._pools = {}
  },
  create: function (e, t, n) {
    let i = this._pools[e]
    i == null && (i = new cc.NodePool(), this._pools[e] = i)
    for (let o = 0; o < t; o++) o == 0 ? i.put(n) : i.put(cc.instantiate(n))
  },
  put: function (e, t) {
    let n = this._pools[e]
    n == null && (cc.error('名为{0}的池对象不存在,新创建一个'.format(e)), n = new cc.NodePool(), this._pools[e] = n), n.put(t)
  },
  get: function (e) {
    const t = this._pools[e]
    return t == null ? (cc.error('名为{0}的池对象不存在'.format(e)), null) : t.size() == 0 ? null : t.get()
  },
  from: function (e) {
    const t = this._pools[e.name]
    return t == null || t.size() == 0 ? e.parent ? (this.create(e.name, 1, cc.instantiate(e)), this.get(e.name)) : (this.create(e.name, 1, e), this.get(e.name)) : this.get(e.name)
  },
  has: function (e) {
    return this._pools[e] != null && this._pools[e].size() != 0
  },
  clear: function (e) {
    const t = this._pools[e]
    t != null ? (t.clear(), cc.error('名为{0}的池对象已清空'.format(e)), delete this._pools[e]) : cc.error('名为{0}的池对象不存在'.format(e))
  },
  clearAll: function () {
    for (const e in this._pools) this.clear(e)
  }
})
t.exports = new i()
