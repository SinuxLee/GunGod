cc.Class({
  extends: cc.Component,
  properties: {
    rankL: cc.Node,
    starL: cc.Node,
    head: cc.Sprite,
    nameL: cc.Label,
    rankSF1: cc.SpriteFrame,
    rankSF2: cc.SpriteFrame,
    rankSF3: cc.SpriteFrame,
    rankImgLay: cc.Node,
    cashLabel: cc.Label
  },

  onLoad () {
    this.frameCount = 0
  },

  initRecommond () {},
  close () {},

  cutNick (e) {
    for (var t = '', n = 0, i = 0; i < e.length; i++) {
      if (e.charCodeAt(i) > 127 || e.charCodeAt(i) == 94 ? n += 2 : n++, t += e[i], n >= 5) {
        t += '...'
        break
      }
    } return t
  },

  setItemData (e, t, n, i) {
    this.itemID = t
    this.nameL.string = this.cutNick(n.nick_name)
    console.log('rank sign:', n)
    if (n.rankNo < 4) {
      this.rankL.active = false
      this.rankImgLay.active = true
      this.rankImgLay.getComponent(cc.Sprite).spriteFrame = this['rankSF' + n.rankNo]
    } else {
      this.rankImgLay.active = false
      this.rankL.active = true
      this.rankL.getComponent('TextureLabel').setText(String(n.rankNo))
    }

    if (n.avatar && n.avatar.length > 0) {
      this.head.node.active = false
      n.avatar
      n.avatar.slice(-4) == '/132' && (n.avatar = n.avatar.substr(0, n.avatar.length - 4), n.avatar += '/46')
      this.loadHead(n.avatar)
      this.head.node.active = true
    } else {
      this.head.node.active = false
      this.head.node.parent.active = false
    }
    const o = this.getRankCashNum(n.rankNo)
    this.cashLabel.string = '+' + o, i == 2 ? this.starL.getComponent('TextureLabel').setText(String(n.today_best_score)) : this.starL.getComponent('TextureLabel').setText(String(n.best_score))
  },

  getRankCashNum (e) {
    if (e == 0) return 0
    for (var t = facade.getComponent('ShareADModel').GameConfig.RankReward.Value.split(','), n = 0, i = 0; i < t.length; i++) {
      if (e <= t[i].split(':')[0]) {
        n = t[i].split(':')[1]
        break
      }
    }
    return n
  },

  setSelfItem (e) {
    const t = e
    this.nameL.string = this.cutNick(t.nick_name)
    console.log('rank sign:', t)
    if (t.rank_order < 4) {
      this.rankL.active = false
      this.rankImgLay.active = true
      this.rankImgLay.getComponent(cc.Sprite).spriteFrame = this['rankSF' + t.rank_order]
    } else {
      this.rankImgLay.active = false
      this.rankL.active = true
      this.rankL.getComponent('TextureLabel').setText(String(t.rank_order))
    }

    !t.avatar && t.avatar_url && (t.avatar = t.avatar_url)

    if (t.avatar && t.avatar.length > 0) {
      this.head.node.active = false
      t.avatar
      t.avatar.slice(-4) == '/132' && (t.avatar = t.avatar.substr(0, t.avatar.length - 4), t.avatar += '/46')
      this.loadHead(t.avatar)
      this.head.node.active = true
    } else {
      this.head.node.active = false
      this.head.node.parent.active = false
    }
    const n = this.getRankCashNum(t.rank_order)
    this.cashLabel.string = '+' + n, t.best_score && this.starL.getComponent('TextureLabel').setText(String(t.best_score))
  },

  loadHead (e) {
    textureManager.getComponent('TextureManager').getTextureOneByOne(e, this.head)
  }
})
