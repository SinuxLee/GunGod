module.exports = {
  getRad: function (e, t) {
    const n = e.x
    const i = e.y
    const o = t.x
    const a = t.y
    const s = (o - n) / cc.pDistance(e, t)
    let c = Math.acos(s)
    return a < i && (c = -c), c
  },
  getVectorRadians: function (e, t, n, i) {
    return Math.acos((e * n + t * i) / Math.sqrt(e * e + t * t) * Math.sqrt(n * n + i * i))
  },
  pointIsInPolygon: function (e, t) {
    let n, i, o, a
    n = e
    i = {
      x: -1e4,
      y: e.y
    }
    for (var s = 0, c = 0; c < t.length - 1; c++) o = t[c], a = t[c + 1], this.checkCross(n, i, o, a) == 1 && s++

    o = t[t.length - 1]
    a = t[0]
    this.checkCross(n, i, o, a) == 1 && s++
    return s % 2 != 0
  },
  crossMul: function (e, t) {
    return e.x * t.y - e.y * t.x
  },
  checkCross: function (e, t, n, i) {
    let o = {
      x: e.x - n.x,
      y: e.y - n.y
    }
    let a = {
      x: t.x - n.x,
      y: t.y - n.y
    }
    let s = {
      x: i.x - n.x,
      y: i.y - n.y
    }
    const c = this.crossMul(o, s) * this.crossMul(a, s)
    return o = {
      x: n.x - e.x,
      y: n.y - e.y
    }, a = {
      x: i.x - e.x,
      y: i.y - e.y
    }, s = {
      x: t.x - e.x,
      y: t.y - e.y
    }, c <= 0 && this.crossMul(o, s) * this.crossMul(a, s) <= 0
  }
}
