cc.Class({
  extends: cc.Component,
  properties: {
    color: 'y'
  },

  setText (word) {
    if (this._word == word) return

    this._word = word
    const atlas = cc.loader.getRes('uis', cc.SpriteAtlas)
    if (atlas) this.createWord()
    else cc.loader.loadRes('uis', cc.SpriteAtlas, this.loaded.bind(this))
  },

  loaded () {
    this.createWord()
  },

  createWord () {
    this.node.removeAllChildren()
    const arr = this._word.split('')

    for (let len = arr.length - 1; len >= 0; len--) {
      const node = new cc.Node()
      let char = arr[len]
      if (char == '+') char = 'plus'
      else if (char == '/') char = 'split'
      else if (char == ':') char = 'colon'

      const atlas = cc.loader.getRes('uis', cc.SpriteAtlas)
      node.addComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('n' + this.color + '_' + char)
      node.color = this.node.color
      this.node.addChild(node)
    }
  }
})
