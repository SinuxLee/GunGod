cc.Class({
  extends: cc.Component,
  properties: {
    color: 'y'
  },

  setText: function (e) {
    this._word != e && (this._word = e, cc.loader.getRes('uis', cc.SpriteAtlas) ? this.createWord() : cc.loader.loadRes('uis', cc.SpriteAtlas, this.loaded.bind(this)))
  },

  loaded: function () {
    this.createWord()
  },

  createWord: function () {
    this.node.removeAllChildren()
    for (let e = this._word.split(''), t = e.length - 1; t >= 0; t--) {
      const n = new cc.Node()
      let i = e[t]
      i == '+' ? i = 'plus' : i == '/' ? i = 'split' : i == ':' && (i = 'colon')
      const o = cc.loader.getRes('uis', cc.SpriteAtlas)
      n.addComponent(cc.Sprite).spriteFrame = o.getSpriteFrame('n' + this.color + '_' + i)
      n.color = this.node.color
      this.node.addChild(n)
    }
  }
})
