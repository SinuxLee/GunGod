cc.Class({
  extends: cc.Component,

  onLoad () {
    this._lib = {}
    this._curKey = ''
    this._loadedUrls = {}
    this.resLoadings = []
    this.altasLoadings = []
    this.spineLoadings = []
    this._loadedSpineUrls = []
    this._loadedFloorBgs = []
    this._loadedDecos = []
    this.resLoadingIndex = 0
    this.spineCallback
  },

  setCurKey (key) {
    this._curKey = key
  },

  getCurKey () {
    return this._curKey
  },

  updateGameTexture (e, t, n) {
    this.updateTexture(this._curKey, t, e, n)
  },

  updateTexture (key, resPath, n, sprite, width, height) {
    let s = void 0
    let c = void 0
    let r = void 0
    let l = void 0
    let d = void 0

    if (this._lib[key] == null) {
      s = this._lib[key] = {}
      s.urls = []
      s.textures = []
      s.refs = {}
      s.sfs = {}
    }

    c = this._lib[key].urls
    r = this._lib[key].textures
    l = this._lib[key].refs
    d = this._lib[key].sfs
    l[n] = resPath
    c.indexOf(resPath) < 0 && (c[c.length] = resPath)
    console.log('start load image:', resPath)

    cc.loader.load({ url: resPath, type: 'png' }, function (err, asset) {
      if (err) return cc.error(err)

      if (!this._lib[key]) {
        cc.loader.release(resPath)
        asset.releaseTexture()
        return
      }

      console.log('texture loaded image:', resPath)
      if (r.indexOf(asset) < 0) r[r.length] = asset

      if (resPath === l[n]) {
        const frame = new cc.SpriteFrame()
        frame.setTexture(asset)
        if (sprite) {
          sprite.spriteFrame = frame
          if (sprite.node.width >= sprite.node.height) {
            if (width != null && sprite.node.width > width) sprite.node.scale = width / sprite.node.width
          } else if (height != null && sprite.node.height > height) sprite.node.scale = height / sprite.node.height
        }
        d[n] = frame
      }
    }.bind(this))
  },

  getGameTexture (e, t, n) {
    this.getTexture(this._curKey, t, e, n)
  },

  getTexture (key, t, n, i, o, a) {
    if (!this._lib[key] || !this._lib[key].sfs || !this._lib[key].sfs[n]) return t ? void this.updateTexture(key, t, n, i, o, a) : -1
    if (i) {
      i.spriteFrame = this._lib[key].sfs[n]
      i.node.width >= i.node.height ? o != null && i.node.width > o && (i.node.scale = o / i.node.width) : a != null && i.node.height > a && (i.node.scale = a / i.node.height)
    }
  },

  loadTextureOneByOne (e, t, n, i) {
    this._waitings == null && (this._waitings = [])
    e && this._waitings.push({
      url: e,
      sp: t,
      wl: n,
      hl: i
    })

    this._waitings.length <= 0 || this._inLoading || (this._inLoading = true, cc.loader.load({
      url: this._waitings[0].url,
      type: 'png'
    }, function (err, asset) {
      if (!err) {
        const frame = new cc.SpriteFrame()
        frame.setTexture(asset)
        this._spriteFrameCache[this._waitings[0].url] = frame
        if (this._waitings[0].sp) this._waitings[0].sp.spriteFrame = frame
        this._waitings.shift()
        this._inLoading = false
        setTimeout(this.loadTextureOneByOne.bind(this), 100)
      }
    }.bind(this)))
  },

  getTextureOneByOne (e, t, n, i) {
    if (this._spriteFrameCache || (this._spriteFrameCache = {}), !this._spriteFrameCache[e]) return e ? void this.loadTextureOneByOne(e, t, n, i) : -1
    t && t.node.parent && (t.spriteFrame = this._spriteFrameCache[e], t.node.width >= t.node.height ? n != null && t.node.width > n && (t.node.scale = n / t.node.width) : i != null && t.node.height > i && (t.node.scale = i / t.node.height))
  },

  cancelSkeletonLoad (e) {
    for (let t = 0; t < this.spineLoadings.length; t++) this.spineLoadings[t].sk == e && (this.spineLoadings.splice(t, 1), t--)
  },

  formaSpineName (e) {
    if (window.facade.deviceLow) {
      const t = e.split('/')
      e = t[0] + '_low/' + t[1] + '_low'
    }
    return e
  },

  getResSpineForUI (e, t, n) {
    this.spineCallback = n
    for (let i = 0; i < t.length; i++) {
      const o = t[i]
      const a = cc.find(o.ui, e)
      let s = o.url
      s = o.preloaded ? 'spine/' + s : 'pre_spine/' + s
      a != null ? this.getResSpine(s, a.getComponent(sp.Skeleton), o.initAnimate.split(','), i === t.length - 1) : console.error('node null:', o.ui)
    }
  },

  getResSpine (e, t, n, i) {
    if (window.facade.deviceLow) {
      const o = e.split('/')
      e = o[0] + '_low/' + o[1] + '_low'
    }

    if (cc.loader.getRes(e, sp.SkeletonData)) {
      t.skeletonData = cc.loader.getRes(e, sp.SkeletonData)
      if (n != null && n.length > 0) {
        for (let a = 0; a < n.length; a++) {
          if (a == 0) {
            if (a + 1 == n.length) t.setAnimation(0, n[a], true)
            else t.setAnimation(0, n[a], false)
          } else {
            if (a + 1 == n.length) t.addAnimation(0, n[a], true)
            else t.addAnimation(0, n[a], false)
          }
        }
      }
      i && this.spineCallback && this.spineCallback.onResSucc()
    } else {
      const s = window.textureManager.getComponent('TextureManager').formaSpineName('spine/loading')
      t.skeletonData = cc.loader.getRes(s, sp.SkeletonData)
      t.premultipliedAlpha = false
      t.setAnimation(0, 'yangchao', true)
      t.node.originScale = t.node.scaleX
      this.spineLoadings.push({
        url: e,
        sk: t,
        anis: n
      })
      cc.loader.loadRes(e, sp.SkeletonData, this.gotSpine.bind(this))
    }
  },

  gotSpine (e, t) {
    for (let n = 0; n < this.spineLoadings.length; n++) {
      const i = this.spineLoadings[n]
      const o = cc.loader.getRes(i.url, sp.SkeletonData)
      if (o) {
        if (i.sk.skeletonData = o, i.anis != null && i.anis.length > 0) { for (let a = 0; a < i.anis.length; a++) a == 0 ? a + 1 == i.anis.length ? i.sk.setAnimation(0, i.anis[a], true) : i.sk.setAnimation(0, i.anis[a], false) : a + 1 == i.anis.length ? i.sk.addAnimation(0, i.anis[a], true) : i.sk.addAnimation(0, i.anis[a], false) }
        this._loadedSpineUrls.push(i.url)
        this.spineLoadings.splice(n, 1)
        i.sk.node.scale = i.sk.node.originScale
        n--
      }
      n == this.spineLoadings.length - 1 && this.spineCallback && this.spineCallback.onResSucc()
    }
  },

  releaseAllResSpine () {
    const e = window.facade.getComponent('PlayerModel').roleInfo
    if (e.character) {
      for (let t = window.facade.getComponent('PlayerModel').starConfig[e.character].avatar, n = 0; n < this._loadedSpineUrls.length; n++) this._loadedSpineUrls[n] == 'character/' + t && cc.loader.releaseRes(this._loadedSpineUrls[n], cc.SpriteAtlas)
      this._loadedSpineUrls = []
    }
  },

  getAtlasTexture (e, t, n, i, o) {
    cc.loader.getRes(e, cc.SpriteAtlas)
      ? (n.spriteFrame = cc.loader.getRes(e, cc.SpriteAtlas).getSpriteFrame(t), n.node.width >= n.node.height ? i != null && n.node.width > i && (n.node.scale = i / n.node.width) : o != null && n.node.height > o && (n.node.scale = o / n.node.height))
      : (this.altasLoadings.push({
          url: t,
          sp: n,
          atlas: e,
          wl: i,
          hl: o
        }), cc.loader.loadRes(e, cc.SpriteAtlas, this.gotAltas.bind(this)))
  },

  gotAltas (e, t) {
    for (let n = 0; n < this.altasLoadings.length; n++) {
      const i = this.altasLoadings[n]
      const o = cc.loader.getRes(i.atlas, cc.SpriteAtlas).getSpriteFrame(i.url)
      const a = i.wl
      const s = i.hl
      o && i.sp && i.sp.node && (i.sp.spriteFrame = o, i.sp.node.width >= i.sp.node.height ? a != null && i.sp.node.width > a && (i.sp.node.scale = a / i.sp.node.width) : s != null && i.sp.node.height > s && (i.sp.node.scale = s / i.sp.node.height), this.altasLoadings.splice(n, 1), n--)
    }
  },

  getIconTexture (e, t, n, i, o) {
    this.itemConfig == null && (this.itemConfig = cc.loader.getRes('config/ItemDB'))
    let a = ''
    this.itemConfig[String(e)] != null && this.itemConfig[String(e)].iconUrl ? Number(this.itemConfig[String(e)].isIconRemote) == 1 ? (a = window.facade.puzzleImgUrl + this.itemConfig[String(e)].iconUrl + '.png', this.getTexture(a, a, a, t, n, o)) : (a = 'item/' + this.itemConfig[String(e)].iconUrl, this.getResTexture(a, t, n, o)) : (typeof e === 'number' && (e = window.facade.PlayerAtrriKeys['res' + e]), typeof e === 'string' && e.length < 2 && (e = window.facade.PlayerAtrriKeys['res' + Number(e)]), i && (e += '_' + i), a = 'icon_' + e, e == 'energy' && (a = 'v2_' + a), this.getAtlasTexture('ui/common/main_and_common', a, t, n, o))
  },

  getResTexture (e, t, n, i, o) {
    if (cc.loader.getRes(e)) {
      if (t == null) return
      t.spriteFrame = cc.loader.getRes(e, cc.SpriteFrame)
      t.node.width >= t.node.height ? n != null && t.node.width > n && (t.node.scale = n / t.node.width) : i != null && t.node.height > i && (t.node.scale = i / t.node.height)
    } else {
      o != 0 && t && (t.node.opacity = 0)
      this.resLoadings.push({
        url: e,
        sp: t,
        wl: n,
        hl: i
      })
      this.resLoadingIndex++
      cc.loader.loadRes(e, cc.SpriteFrame, this.gotResTexture.bind(this))
    }
  },

  gotResTexture (e, t) {
    for (let n = 0; n < this.resLoadings.length; n++) {
      const i = cc.loader.getRes(this.resLoadings[n].url, cc.SpriteFrame)
      let o = this.resLoadings[n].wl
      if (i && this.resLoadings[n].sp && this.resLoadings[n].sp.node) {
        this.resLoadings[n].sp.spriteFrame = i
        const a = this.resLoadings[n]
        a.sp.node.opacity = 255
        o = a.wl
        const s = a.hl
        a.sp.node.width >= a.sp.node.height ? o != null && a.sp.node.width > o && (a.sp.node.scale = o / a.sp.node.width) : s != null && a.sp.node.height > s && (a.sp.node.scale = s / a.sp.node.height), this._loadedUrls[this.resLoadings[n].url] = true, this.resLoadings.splice(n, 1), n--
      }
    }
  },

  getDecoTexture (e, t, n, i) {
    this._loadedDecos.push(e)
    this.getResTexture(e, t, n, i)
  },

  getFloorBg (e, t) {
    this._loadedFloorBgs.push(e)
    this.getResTexture(e, t, null, null, false)
  },

  releaseAllFloorRes () {
    for (var e = 0; e < this._loadedDecos.length; e++) {
      cc.loader.releaseRes(this._loadedDecos[e], cc.SpriteFrame)
      cc.loader.releaseRes(this._loadedDecos[e], cc.Texture2D)
    }

    this._loadedDecos = []
    for (e = 0; e < this._loadedFloorBgs.length; e++) {
      cc.loader.releaseRes(this._loadedFloorBgs[e], cc.SpriteFrame)
      cc.loader.releaseRes(this._loadedFloorBgs[e], cc.Texture2D)
    }
    this._loadedFloorBgs = []
  },

  releaseAllResSprite (e) {
    for (var e in this._loadedUrls) {
      cc.loader.releaseRes(e, cc.SpriteFrame)
      cc.loader.releaseRes(e, cc.Texture2D)
    }
    this._loadedUrls = {}
  },

  releaseSprite (e) {
    cc.loader.releaseRes(e, cc.SpriteFrame)
    cc.loader.releaseRes(e, cc.Texture2D)
  },

  release (e) {
    if (this._lib[e]) {
      let t; let n; const i = this._lib[e]
      let o = void 0
      let a = void 0
      i.refs = null
      delete i.refs
      i.sfs = null
      delete i.sfs
      a = i.textures
      n = i.urls
      t = a.length

      for (o = 0; o < t; ++o) {
        cc.loader.release(n[o])
        a[o].releaseTexture()
      }

      i.urls.length = 0
      delete i.urls
      a.length = 0
      delete i.textures
      this._lib[e] = null
      delete this._lib[e]
    }
  },

  releaseGame () {
    this.release(this._curKey)
  }
})
