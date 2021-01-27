cc.Class({
    extends: cc.Component,
    properties: {
        sDayImg: cc.Node,
        sDayIsGet: cc.Node,
        sDayNow: cc.Node,
        sDayNum: cc.Label,
        uiName: cc.Node,
        title: cc.Label,
        content: cc.Node,
        item: cc.Prefab,
        doubleBtn: cc.Node,
        normalBtn: cc.Node
    },
    onLoad: function() {
        this.closeActTime = .18, this.normalBtn.scale = 1
    },
    viewDidAppear: function() {
        this.content.active = !0, this.initContent(), this.setupShare(), require('VirBannerCtrl').hideVirBanner()
    },
    initContent: function() {
        var e = facade.getComponent("GameModel").getRewardConfig();
        console.log("config: ", e);
        var t, n = facade.getComponent("GameModel").fetchDays,
            i = Math.floor(facade.getComponent("GameModel").lastFetchSignInTime / 86400 / 1e3),
            o = Math.floor(facade.getComponent("GameModel").getLocalTime() / 86400 / 1e3);
        null == n && (n = 0), null == i && (i = 0), i >= o && (this.doubleBtn.active = !1, this.normalBtn.active = !1), 0 == n ? (this.title.string = "第1天", t = 1) : (t = n % 7 == 0 ? 7 : n % 7, i < o && (t = 7 == t ? 1 : t + 1), this.title.string = "第" + t + "天"), 7 == t && (o > i ? (this.sDayNow.active = !0, this.sDayIsGet.active = !1) : (this.sDayNow.active = !1, this.sDayIsGet.active = !0)), this.doubleBtn.active = o > i, this.normalBtn.active = o > i;
        for (var a = 0; a < e.length - 1; a++) {
            var s = cc.instantiate(this.item);
            s.getComponent("SigninItem").initData(e[a], t), s.parent = this.content, s.opacity = 0, s.scaleY = 0
        }
        this.sDayNum.string = "x" + e[e.length - 1].AwardNum;
        var c = "";
        switch (e[e.length - 1].AwardType) {
            case 1:
                c = "cash";
                break;
            case 2:
                c = "strength";
                break;
            case 3:
                c = "video", this.sDayNum.node.active = !1;
                break;
            case 4:
                c = "skin", this.sDayNum.node.active = !1, cc.loader.loadRes("roles", cc.SpriteAtlas, this.updateSkin.bind(this))
        }
        this.sDayImg.getChildByName(c).active = !0, this.reward = e[t - 1], this.sDayReward = e[6], this.doAction()
    },
    doAction: function() {
        this.title.node.runAction(cc.moveBy(.3, cc.v2(-500, 0)).easing(cc.easeInOut(3))), this.uiName.runAction(cc.moveBy(.3, cc.v2(500, 0)).easing(cc.easeInOut(3)));
        for (var e = cc.spawn(cc.fadeIn(.3), cc.scaleTo(.3, 1).easing(cc.easeIn(3))), t = cc.spawn(cc.fadeIn(.3), cc.scaleTo(.3, 1).easing(cc.easeIn(3))), n = [], i = [], o = this.content.children, a = 0; a < o.length; a++) a < 3 ? n.push(o[a]) : i.push(o[a]);
        this.count = 1, this.actId = setInterval(function() {
            if (4 != this.count) {
                if (3 == this.count) return this.sDayIsGet.parent.runAction(e.clone()), void this.count++;
                var t = 2 == this.count ? i : n;
                for (var o in t) t[o].runAction(e.clone());
                this.count++
            } else clearInterval(this.actId)
        }.bind(this), 250), this.doubleBtn.runAction(t), this.normalBtn.opacity = 255
    },
    setupShare: function() {
        2 != facade.getComponent("ShareADModel").getShareADType() ? this.doubleBtn.getChildByName("video").active = !0 : this.doubleBtn.getChildByName("share").active = !0
    },
    updateSkin: function(e, t) {
        if (e) console.error(e);
        else {
            var n = t.getSpriteFrame("MrBullet_Role_Body_0" + this.sDayReward.AwardNum);
            this.sDayImg.getChildByName("skin").getChildByName("head").getComponent(cc.Sprite).spriteFrame = n
        }
    },
    onClickNormalGet: function() {
        facade.getComponent("GameModel").applySignReward(!1, this.reward)
    },
    onClickDoubleGet: function() {
        var e = this,
            t = {
                inviteId: 1531,
                videoId: 21105,
                assistId: 0,
                interstitalId: 31105
            };
        window.facade.getComponent("ShareADModel").showShareAD(t, {
            succ: function(t) {
                console.log("七日登陆 分享/视频:", t), facade.getComponent("GameModel").applySignReward(!0, e.reward), window.popUp.getComponent("Pop").removeTop()
            }.bind(this),
            fail: function(e, t) {
                popUp.getComponent("FloatTip").showTip(e)
            }.bind(this)
        })
    },
    onClickClose: function() {
        popUp.getComponent("Pop").removeTop()
    },
    doClose: function() {
        var e = cc.scaleTo(.2, 1.4);
        this.sDayIsGet.parent.runAction(e.clone());
        var t = this.content.children;
        for (var n in t) t[n].runAction(e.clone());
        this.doubleBtn.runAction(e.clone()), this.title.node.runAction(e.clone()), this.uiName.runAction(e.clone())
    }
})