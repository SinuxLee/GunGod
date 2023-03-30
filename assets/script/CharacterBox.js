const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {
    itemPre: cc.Prefab,
    content: cc.Node,
    character: cc.Sprite,
    characterHand: cc.Sprite,
    btn: cc.Node,
    priceLabel: cc.Node,
    buyBtnSprite: cc.SpriteFrame,
    useBtnSprite: cc.SpriteFrame,
    videoBtnSprite: cc.SpriteFrame
  },

  onLoad: function () {
    this.datas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this)
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this)
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this)
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this)
    cc.systemEvent.on(ModuleEventEnum.CHARACTER_INFO, this.onGotCharater, this)
    cc.systemEvent.on(ModuleEventEnum.SKIN_WATCHED, this.onSKinWatched, this)
  },

  _onTouchBegan: function (e, t) {
    const n = e.touch
    this._startTouch = n.getLocation().clone()
    this._startContentX = this.content.x
  },

  _onTouchMoved: function (e, t) {
    const n = e.touch
    this.deltaMove = n.getLocation().sub(n.getStartLocation())
    this._touchMoved ? this.content.x = this._startContentX + this.deltaMove.x : this.deltaMove.mag() > 7 && (this.content.x = this._startContentX + this.deltaMove.x, this._touchMoved = true)
  },

  _onTouchEnded: function (e, t) {
    const n = e.touch
    this._touchMoved && e.stopPropagation()
    this._touchMoved ? (this._touchMoved = false, this.turnHome()) : this.onClick(n)
  },

  onClick: function (e) {
    for (var t = this.content.getChildren(), n = null, i = 0; i < t.length; i++) {
      const o = t[i]
      if (o.convertToNodeSpaceAR(e.getLocation()).mag() < 120) {
        o.getComponent('CharacterItem').onClick(), n = o
        break
      }
    }
    if (n) {
      this._touchMoved = true
      const a = 200 * Math.round(-n.x / 200)
      this.deltaMove || (this.deltaMove = cc.v2()), this.deltaMove.x = a - this.content.x, this.content.stopAllActions()
      const s = cc.moveTo(0.2, a, 0)
      s.easing(cc.easeSineIn())
      this.content.runAction(cc.sequence(s, cc.callFunc(this.selected, this)))
    }
  },

  _onTouchCancelled: function (e, t) {
    this._touchMoved = false
    this.turnHome()
  },

  turnHome: function () {
    const e = 200 * Math.round(this.content.x / 200)
    this.content.stopAllActions()
    const t = cc.moveTo(0.2, e, 0)
    t.easing(cc.easeSineIn())
    this.content.runAction(cc.sequence(t, cc.callFunc(this.selected, this)))
  },

  selected: function () {
    this._touchMoved = false
    for (var e = this.content.getChildren(), t = 999999, n = null, i = 0; i < e.length; i++) {
      const o = e[i]
      const a = this.node.convertToNodeSpaceAR(o.convertToWorldSpaceAR(cc.v2(0, 0))).x
      const s = Math.abs(a)
      s < t && (t = s, n = e[i])
    }
    this._selectOne = n
    window.facade.getComponent('GameModel').isCharacterLocked(n.data)
  },

  onBuyClick: function () {
    window.facade.getComponent('GameModel').isCharacterLocked(this._selectOne.data) && (this.selectedConfig.CostType == 2 ? window.facade.getComponent('GameModel').watchACharacter(this._selectOne.data) : (window.facade.getComponent('GameModel').buyACharacter(this._selectOne.data), this.updateStatus()))
  },

  pageChange: function (e, t) {
    if (console.log(e._curPageIdx), e._curPageIdx < this._curPageIdx) {
      for (let n = 0; n < this._curPageIdx - e._curPageIdx; n++) {
        this.removeRight()
        this.addLeft()
      }
    } else {
      e._curPageIdx
      this._curPageIdx
    }
    this.removeLeft()
    this.addRight()
  },

  removeRight: function () {
    const e = this.node.getComponent(cc.PageView).getPages()
    this.node.getComponent(cc.PageView).removePageAtIndex(e.length - 1)
  },

  addLeft: function () {
    let e = this.node.getComponent(cc.PageView).getPages()[0].data - 1
    e <= 0 && (e = this.datas[this.datas.length - 1])
    const t = cc.instantiate(this.itemPre)
    t.data = e
    this.node.getComponent(cc.PageView).insertPage(t, 0)
    this.updatePosition()
  },

  updatePosition: function () {
    this.node.getComponent(cc.PageView)._curPageIdx = 2
    this.content.x = -this.content.width / 2
    this._curPageIdx = 2
  },

  start: function () {
    window.facade.getComponent('GameModel').charaterConfig && this.onGotCharater()
  },

  onGotCharater: function () {
    this.characterId = window.facade.getComponent('GameModel').characterId
    for (var e = [], t = 0, n = 0; n < this.datas.length; n++) this.characterId == this.datas[n] && (t = n)
    for (var i = 0; i < 5; i++) {
      let o = t - 2 + i
      o < 0 ? o = this.datas.length + o : o >= this.datas.length && (o -= this.datas.length), e[i] = this.datas[o]
    }
    for (i = 0; i < 5; i++) {
      const a = cc.instantiate(this.itemPre)
      a.data = e[i], a.x = 200 * i - 400, this.content.addChild(a)
    }
    this.updateContent(), this.selected()
  },

  onSKinWatched: function () {
    this.updateStatus()
  },

  init: function () {
    this.content.x = -this.content.width / 2
  },

  updateContent: function () {
    this.content.width = 200 * this.content.getChildren().length
  },

  insertToRight: function (e) {
    const t = this.content.getChildren()
    const n = t[t.length - 1]
    let i = n.data + 1
    i > this.datas[this.datas.length - 1] && (i = this.datas[0]), e.data = i, e.getComponent('CharacterItem').init(), e.x = n.x + 200
  },

  insertToLeft: function (e) {
    const t = this.content.getChildren()[0]
    let n = t.data - 1
    n < this.datas[0] && (n = this.datas[this.datas.length - 1]), e.data = n, e.getComponent('CharacterItem').init(), e.x = t.x - 200
  },

  dealSelection: function (e) {
    e != this._selectId && (this._selectId = e, this.setSkin(), this.updateStatus())
  },

  setSkin: function () {
    cc.loader.getRes('roles', cc.SpriteAtlas) ? (this.character.spriteFrame = cc.loader.getRes('roles', cc.SpriteAtlas).getSpriteFrame('MrBullet_Role_Body_0' + this._selectId), this.characterHand.spriteFrame = cc.loader.getRes('roles', cc.SpriteAtlas).getSpriteFrame('MrBullet_Role_AimArm_0' + this._selectId)) : cc.loader.loadRes('roles', cc.SpriteAtlas, this.setSkin.bind(this))
  },

  updateStatus: function () {
    if (this.selectedConfig = window.facade.getComponent('GameModel').charaterConfig[String(this._selectId)], console.error(this.selectedConfig), window.facade.getComponent('GameModel').isCharacterLocked(this._selectId)) {
      if (this.selectedConfig.CostType == 2) {
        const e = window.facade.getComponent('GameModel').getWatchCount(this._selectId)
        this.priceLabel.getComponent('TextureLabel').setText(e + '/' + this.selectedConfig.Cost), this.priceLabel.parent.active = true, this.priceLabel.parent.getChildByName('cash').active = false, this.btn.getComponent(cc.Sprite).spriteFrame = this.videoBtnSprite, this.btn.active = true
      } else this.priceLabel.getComponent('TextureLabel').setText(String(this.selectedConfig.Cost)), this.priceLabel.parent.getChildByName('cash').active = true, this.priceLabel.parent.active = true, this.btn.getComponent(cc.Sprite).spriteFrame = this.buyBtnSprite, this.btn.active = true
    } else this.priceLabel.parent.active = false, this.btn.getComponent(cc.Sprite).spriteFrame = this.useBtnSprite, window.facade.getComponent('GameModel').characterId == this._selectId ? this.btn.active = false : this.btn.active = true
  },

  useSkin: function () {
    cc.systemEvent.emit(ModuleEventEnum.ROLE_SELECTED, this._selectId), this.btn.active = false
  },

  btnClick: function () {
    this.priceLabel.parent.active ? this.onBuyClick() : this.useSkin()
  },

  update: function (e) {
    const t = this.content.getChildren()
    if (this._touchMoved) {
      for (var n = 0; n < t.length; n++) {
        const i = (o = t[n]).convertToWorldSpaceAR(cc.v2(100, 0))
        if (i.x < 0 && this.deltaMove.x < 0) {
          this.insertToRight(o)
          break
        }
        if (i.x > 740 && this.deltaMove.x > 0) {
          this.insertToLeft(o)
          break
        }
      }
      t.sort(function (e, t) {
        return e.x < t.x ? -1 : 1
      })
    }
    for (n = 0; n < t.length; n++) {
      var o = t[n]
      const a = this.node.convertToNodeSpaceAR(o.convertToWorldSpaceAR(cc.v2(0, 0))).x
      o.selection = -1e-5 * Math.pow(a, 2) + 1.3, o.selection > 1.25 && this.dealSelection(o.data)
    }
  }
})
