cc.Class({
  extends: cc.Component,
  properties: {
    itemName: '',
    spawnCount: 0,
    spacing: 0,
    bufferZone: 0,
    itemAnchor: 1,
    vertical: !0,
    itemTemplate: cc.Node,
    scrollView: cc.ScrollView,
    content: cc.Node
  },
  onLoad: function () {
    this.items = [], this.totalCount = 0, this.lastContentPosY = 0, this.lastContentPosX = 0, this.initialize(), this.content.originY = this.content.y, this.content.originX = this.content.x
  },
  initialize: function () {
    for (let e = 0; e < this.spawnCount; ++e) {
      let t = null
      t = window.pool.has(this.itemName) ? window.pool.get(this.itemName) : cc.instantiate(this.itemTemplate), this.content.addChild(t), this.vertical ? this.itemAnchor == 1 ? t.setPosition(0, -t.height * e - this.spacing * (e + 1)) : t.setPosition(0, -t.height * (0.5 + e) - this.spacing * (e + 1)) : this.itemAnchor == 0 ? t.setPosition((t.width + this.spacing) * e, 0) : t.setPosition((t.width + this.spacing) * e + (t.width + this.spacing) / 2, 0), this.items.push(t)
    }
  },
  setList: function (e, t, n) {
    if (this.showData = e, this.custom = n, this.totalCount = this.showData.length, this.vertical) {
      if (this.content.y = this.content.originY, this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing, this.content.height < this.scrollView.height && (this.content.height = this.scrollView.height), this.items && this.items.length > 0) {
        for (let i = 0; i < this.items.length; i++) {
          const o = this.items[i]
          this.showData[i] ? (o.active = !0, o.getComponent(this.itemName).setItemData(i, i, this.showData[i], this.custom), this.itemAnchor == 1 ? o.setPosition(0, -o.height * i - this.spacing * (i + 1)) : o.setPosition(0, -o.height * (0.5 + i) - this.spacing * (i + 1)), t && this.iteamAction(i, o)) : o.active = !1
        }
      }
    } else if (this.content.x = this.content.originX, this.content.width = this.totalCount * (this.itemTemplate.width + this.spacing) + this.spacing, this.content.width < this.scrollView.width && (this.content.width = this.scrollView.width), this.items && this.items.length > 0) {
      for (let a = 0; a < this.items.length; a++) {
        const s = this.items[a]
        this.showData[a] ? (s.active = !0, s.getComponent(this.itemName).setItemData(a, a, this.showData[a], this.custom), this.itemAnchor == 1 ? s.setPosition((s.width + this.spacing) * a, 0) : s.setPosition((s.width + this.spacing) * a + (s.width + this.spacing) / 2, 0)) : s.active = !1
      }
    }
  },
  refreshList: function () {
    this.totalCount = this.showData.length, this.vertical ? this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing : this.content.width = this.totalCount * (this.itemTemplate.width + this.spacing) + this.spacing
    for (let e = 0; e < this.items.length; e++) {
      const t = this.items[e]
      if (this.showData[e]) {
        t.active = !0
        const n = t.getComponent(this.itemName)
        const i = n.itemID
        n.setItemData(e, i, this.showData[i], this.custom)
      } else t.active = !1
    }
  },
  iteamAction: function (e, t) {
    const n = t
    n.opacity = 0, n.x = -300
    const i = cc.spawn(cc.fadeIn(0.2), cc.moveBy(0.2, cc.v2(300, 0)))
    n.runAction(cc.sequence(cc.delayTime(0.08 * e), i, cc.callFunc(function () {
      n.stopAllActions(), n.x = 0, n.opacity = 255
    })))
  },
  scrollEvent: function (e, t) {
    t != 4 && t != 9 || this.doUpdateList()
  },
  getPositionInView: function (e) {
    const t = e.parent.convertToWorldSpaceAR(e.position)
    return this.scrollView.node.convertToNodeSpaceAR(t)
  },
  doUpdateList: function (e) {
    if (this.vertical) {
      const t = this.items
      if (t.length == 0) return
      for (let n = this.bufferZone, i = this.scrollView.content.y < this.lastContentPosY, o = (this.itemTemplate.height + this.spacing) * t.length, a = 0; a < t.length; ++a) {
        const s = this.getPositionInView(t[a])
        if (i) {
          if (s.y < -n && t[a].y + o < 0) {
            t[a].y = t[a].y + o
            const c = t[a].getComponent(this.itemName)
            const r = c.itemID - t.length
            c.setItemData(a, r, this.showData[r], this.custom)
          }
        } else if (s.y > n && t[a].y - o > -this.content.height) {
          t[a].y = t[a].y - o
          const l = t[a].getComponent(this.itemName)
          const d = l.itemID + t.length
          l.setItemData(a, d, this.showData[d], this.custom)
        }
      }
      this.lastContentPosY = this.scrollView.content.y
    } else {
      const h = this.items
      if (h.length == 0) return
      for (let u = this.bufferZone, p = this.scrollView.content.x < this.lastContentPosX, m = (this.itemTemplate.width + this.spacing) * h.length, g = 0; g < h.length; g++) {
        const f = this.getPositionInView(h[g])
        if (p) {
          if (f.x < -u && h[g].x + m < this.scrollView.content.width) {
            h[g].setPositionX(h[g].x + m)
            const v = h[g].getComponent(this.itemName)
            const C = v.itemID + h.length
            v.setItemData(g, C, this.showData[C], this.custom)
          }
        } else if (f.x > u && h[g].x - m > 0) {
          h[g].setPositionX(h[g].x - m)
          const w = h[g].getComponent(this.itemName)
          const S = w.itemID - h.length
          w.setItemData(g, S, this.showData[S], this.custom)
        }
      }
      this.lastContentPosX = this.scrollView.content.x
    }
  },
  close: function () {
    if (window.pool.has(this.itemName)) {
      for (let e = 0; e < this.items.length; e++) {
        const t = this.items[e]
        window.pool.put(this.itemName, t)
      }
    } else window.pool.create(this.itemName, this.spawnCount, cc.instantiate(this.itemTemplate))
  }
})
