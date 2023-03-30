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
  onLoad: function () {
    this.closeActTime = 0.18
    this.normalBtn.scale = 1
  },
  viewDidAppear: function () {
    this.content.active = true
    this.initContent()
    this.setupShare()
    require('VirBannerCtrl').hideVirBanner()
  },
  initContent: function () {
    const e = facade.getComponent('GameModel').getRewardConfig()
    console.log('config: ', e)
    let t
    let n = facade.getComponent('GameModel').fetchDays
    let i = Math.floor(facade.getComponent('GameModel').lastFetchSignInTime / 86400 / 1e3)
    const o = Math.floor(facade.getComponent('GameModel').getLocalTime() / 86400 / 1e3)
    n == null && (n = 0), i == null && (i = 0), i >= o && (this.doubleBtn.active = false, this.normalBtn.active = false), n == 0 ? (this.title.string = '第1天', t = 1) : (t = n % 7 == 0 ? 7 : n % 7, i < o && (t = t == 7 ? 1 : t + 1), this.title.string = '第' + t + '天'), t == 7 && (o > i ? (this.sDayNow.active = true, this.sDayIsGet.active = false) : (this.sDayNow.active = false, this.sDayIsGet.active = true)), this.doubleBtn.active = o > i, this.normalBtn.active = o > i
    for (let a = 0; a < e.length - 1; a++) {
      const s = cc.instantiate(this.item)
      s.getComponent('SigninItem').initData(e[a], t)
      s.parent = this.content
      s.opacity = 0
      s.scaleY = 0
    }
    this.sDayNum.string = 'x' + e[e.length - 1].AwardNum
    let c = ''
    switch (e[e.length - 1].AwardType) {
      case 1:
        c = 'cash'
        break
      case 2:
        c = 'strength'
        break
      case 3:
        c = 'video'
        this.sDayNum.node.active = false
        break
      case 4:
        c = 'skin'
        this.sDayNum.node.active = false
        cc.loader.loadRes('roles', cc.SpriteAtlas, this.updateSkin.bind(this))
    }
    this.sDayImg.getChildByName(c).active = true
    this.reward = e[t - 1]
    this.sDayReward = e[6]
    this.doAction()
  },
  doAction: function () {
    this.title.node.runAction(cc.moveBy(0.3, cc.v2(-500, 0)).easing(cc.easeInOut(3)))
    this.uiName.runAction(cc.moveBy(0.3, cc.v2(500, 0)).easing(cc.easeInOut(3)))

    const e = cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 1).easing(cc.easeIn(3)))
    const t = cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 1).easing(cc.easeIn(3)))
    const n = []; const i = []; const o = this.content.children
    for (let a = 0; a < o.length; a++) a < 3 ? n.push(o[a]) : i.push(o[a])
    this.count = 1, this.actId = setInterval(function () {
      if (this.count != 4) {
        if (this.count == 3) return this.sDayIsGet.parent.runAction(e.clone()), void this.count++
        const t = this.count == 2 ? i : n
        for (const o in t) t[o].runAction(e.clone())
        this.count++
      } else clearInterval(this.actId)
    }.bind(this), 250)
    this.doubleBtn.runAction(t)
    this.normalBtn.opacity = 255
  },
  setupShare: function () {
    facade.getComponent('ShareADModel').getShareADType() != 2 ? this.doubleBtn.getChildByName('video').active = true : this.doubleBtn.getChildByName('share').active = true
  },
  updateSkin: function (e, t) {
    if (e) console.error(e)
    else {
      const n = t.getSpriteFrame('MrBullet_Role_Body_0' + this.sDayReward.AwardNum)
      this.sDayImg.getChildByName('skin').getChildByName('head').getComponent(cc.Sprite).spriteFrame = n
    }
  },
  onClickNormalGet: function () {
    facade.getComponent('GameModel').applySignReward(false, this.reward)
  },
  onClickDoubleGet: function () {
    const e = this
    const t = {
      inviteId: 1531,
      videoId: 21105,
      assistId: 0,
      interstitalId: 31105
    }
    window.facade.getComponent('ShareADModel').showShareAD(t, {
      succ: function (t) {
        console.log('七日登陆 分享/视频:', t)
        facade.getComponent('GameModel').applySignReward(true, e.reward)
        window.popUp.getComponent('Pop').removeTop()
      },
      fail: function (e, t) {
        popUp.getComponent('FloatTip').showTip(e)
      }
    })
  },
  onClickClose: function () {
    popUp.getComponent('Pop').removeTop()
  },
  doClose: function () {
    const e = cc.scaleTo(0.2, 1.4)
    this.sDayIsGet.parent.runAction(e.clone())
    const t = this.content.children
    for (const n in t) t[n].runAction(e.clone())
    this.doubleBtn.runAction(e.clone()), this.title.node.runAction(e.clone()), this.uiName.runAction(e.clone())
  }
})
