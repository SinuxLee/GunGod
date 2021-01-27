cc.Class({
    extends: cc.Component,
    properties: {
        color: "y"
    },
    onLoad: function() {},
    start: function() {},
    setText: function(e) {
        this._word != e && (this._word = e, cc.loader.getRes("uis", cc.SpriteAtlas) ? this.createWord() : cc.loader.loadRes("uis", cc.SpriteAtlas, this.loaded.bind(this)))
    },
    loaded: function() {
        this.createWord()
    },
    createWord: function() {
        this.node.removeAllChildren();
        for (var e = this._word.split(""), t = e.length - 1; t >= 0; t--) {
            var n = new cc.Node,
                i = e[t];
            "+" == i ? i = "plus" : "/" == i ? i = "split" : ":" == i && (i = "colon");
            var o = cc.loader.getRes("uis", cc.SpriteAtlas);
            n.addComponent(cc.Sprite).spriteFrame = o.getSpriteFrame("n" + this.color + "_" + i), n.color = this.node.color, this.node.addChild(n)
        }
    }
})