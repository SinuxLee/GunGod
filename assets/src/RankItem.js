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
    onLoad: function() {
        this.frameCount = 0
    },
    start: function() {},
    initRecommond: function() {},
    close: function() {},
    onDisable: function() {},
    cutNick: function(e) {
        for (var t = "", n = 0, i = 0; i < e.length; i++)
            if (e.charCodeAt(i) > 127 || 94 == e.charCodeAt(i) ? n += 2 : n++, t += e[i], n >= 5) {
                t += "...";
                break
            } return t
    },
    setItemData: function(e, t, n, i) {
        if (this.itemID = t, this.nameL.string = this.cutNick(n.nick_name), console.log("rank sign:", n), n.rankNo < 4 ? (this.rankL.active = !1, this.rankImgLay.active = !0, this.rankImgLay.getComponent(cc.Sprite).spriteFrame = this["rankSF" + n.rankNo]) : (this.rankImgLay.active = !1, this.rankL.active = !0, this.rankL.getComponent("TextureLabel").setText(String(n.rankNo))), n.avatar && n.avatar.length > 0) {
            this.head.node.active = !1;
            n.avatar;
            "/132" == n.avatar.slice(-4) && (n.avatar = n.avatar.substr(0, n.avatar.length - 4), n.avatar += "/46"), this.loadHead(n.avatar), this.head.node.active = !0
        } else this.head.node.active = !1, this.head.node.parent.active = !1;
        var o = this.getRankCashNum(n.rankNo);
        this.cashLabel.string = "+" + o, 2 == i ? this.starL.getComponent("TextureLabel").setText(String(n.today_best_score)) : this.starL.getComponent("TextureLabel").setText(String(n.best_score))
    },
    getRankCashNum: function(e) {
        if (0 == e) return 0;
        for (var t = facade.getComponent("ShareADModel").GameConfig.RankReward.Value.split(","), n = 0, i = 0; i < t.length; i++) {
            if (e <= t[i].split(":")[0]) {
                n = t[i].split(":")[1];
                break
            }
        }
        return n
    },
    setSelfItem: function(e) {
        var t = e;
        if (this.nameL.string = this.cutNick(t.nick_name), console.log("rank sign:", t), t.rank_order < 4 ? (this.rankL.active = !1, this.rankImgLay.active = !0, this.rankImgLay.getComponent(cc.Sprite).spriteFrame = this["rankSF" + t.rank_order]) : (this.rankImgLay.active = !1, this.rankL.active = !0, this.rankL.getComponent("TextureLabel").setText(String(t.rank_order))), !t.avatar && t.avatar_url && (t.avatar = t.avatar_url), t.avatar && t.avatar.length > 0) {
            this.head.node.active = !1;
            t.avatar;
            "/132" == t.avatar.slice(-4) && (t.avatar = t.avatar.substr(0, t.avatar.length - 4), t.avatar += "/46"), this.loadHead(t.avatar), this.head.node.active = !0
        } else this.head.node.active = !1, this.head.node.parent.active = !1;
        var n = this.getRankCashNum(t.rank_order);
        this.cashLabel.string = "+" + n, t.best_score && this.starL.getComponent("TextureLabel").setText(String(t.best_score))
    },
    loadHead: function(e) {
        textureManager.getComponent("TextureManager").getTextureOneByOne(e, this.head)
    }
})