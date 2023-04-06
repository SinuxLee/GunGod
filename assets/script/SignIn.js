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

  onLoad () {
    this.closeActTime = 0.18
    this.normalBtn.scale = 1
  },

  viewDidAppear () {
    this.content.active = true
    this.initContent()
    this.setupShare()
    require('VirBannerCtrl').hideVirBanner()
  },

  initContent () {
    const config = facade.getComponent('GameModel').getRewardConfig()
    console.log('config: ', config)

    let dayIdx = 0
    let days = facade.getComponent('GameModel').fetchDays
    let lastFetch = Math.floor(facade.getComponent('GameModel').lastFetchSignInTime / 86400 / 1e3)
    const now = Math.floor(facade.getComponent('GameModel').getLocalTime() / 86400 / 1e3)
    days == null && (days = 0)
    lastFetch == null && (lastFetch = 0)
    lastFetch >= now && (this.doubleBtn.active = false, this.normalBtn.active = false)

    days == 0 ? (this.title.string = '第1天', dayIdx = 1) : (dayIdx = days % 7 == 0 ? 7 : days % 7, lastFetch < now && (dayIdx = dayIdx == 7 ? 1 : dayIdx + 1), this.title.string = '第' + dayIdx + '天')
    dayIdx == 7 && (now > lastFetch ? (this.sDayNow.active = true, this.sDayIsGet.active = false) : (this.sDayNow.active = false, this.sDayIsGet.active = true))

    this.doubleBtn.active = now > lastFetch
    this.normalBtn.active = now > lastFetch

    for (let a = 0; a < config.length - 1; a++) {
      const node = cc.instantiate(this.item)
      node.getComponent('SigninItem').initData(config[a], dayIdx)
      node.parent = this.content
      node.opacity = 0
      node.scaleY = 0
    }
    this.sDayNum.string = 'x' + config[config.length - 1].AwardNum

    let rewardName = ''
    switch (config[config.length - 1].AwardType) {
      case 1:
        rewardName = 'cash'
        break
      case 2:
        rewardName = 'strength'
        break
      case 3:
        rewardName = 'video'
        this.sDayNum.node.active = false
        break
      case 4:
        rewardName = 'skin'
        this.sDayNum.node.active = false
        cc.loader.loadRes('roles', cc.SpriteAtlas, this.updateSkin.bind(this))
    }

    this.sDayImg.getChildByName(rewardName).active = true
    this.reward = config[dayIdx - 1]
    this.sDayReward = config[6]
    this.doAction()
  },

  doAction () {
    this.title.node.runAction(cc.moveBy(0.3, cc.v2(-500, 0)).easing(cc.easeInOut(3)))
    this.uiName.runAction(cc.moveBy(0.3, cc.v2(500, 0)).easing(cc.easeInOut(3)))

    const action1 = cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 1).easing(cc.easeIn(3)))
    const action2 = cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 1).easing(cc.easeIn(3)))

    const arr1 = []
    const arr2 = []
    const childNodes = this.content.children

    for (let a = 0; a < childNodes.length; a++) a < 3 ? arr1.push(childNodes[a]) : arr2.push(childNodes[a])

    this.count = 1
    this.actId = setInterval(function () {
      if (this.count == 4) return clearInterval(this.actId)

      if (this.count == 3) {
        this.sDayIsGet.parent.runAction(action1.clone())
        this.count++
        return
      }

      const t = this.count == 2 ? arr2 : arr1
      for (const o in t) t[o].runAction(action1.clone())
      this.count++
    }.bind(this), 250)

    this.doubleBtn.runAction(action2)
    this.normalBtn.opacity = 255
  },

  setupShare () {
    if (facade.getComponent('ShareADModel').getShareADType() != 2) this.doubleBtn.getChildByName('video').active = true
    else this.doubleBtn.getChildByName('share').active = true
  },

  updateSkin (err, t) {
    if (err) return console.error(err)

    const n = t.getSpriteFrame('MrBullet_Role_Body_0' + this.sDayReward.AwardNum)
    this.sDayImg.getChildByName('skin').getChildByName('head').getComponent(cc.Sprite).spriteFrame = n
  },

  onClickNormalGet () {
    facade.getComponent('GameModel').applySignReward(false, this.reward)
  },

  onClickDoubleGet () {
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

  onClickClose () {
    popUp.getComponent('Pop').removeTop()
  },

  doClose () {
    const action = cc.scaleTo(0.2, 1.4)
    this.sDayIsGet.parent.runAction(action.clone())

    const child = this.content.children
    for (const n in child) child[n].runAction(action.clone())

    this.doubleBtn.runAction(action.clone())
    this.title.node.runAction(action.clone())
    this.uiName.runAction(action.clone())
  }
})
