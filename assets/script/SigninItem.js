cc.Class({
  extends: cc.Component,
  properties: {
    now: cc.Node,
    isGet: cc.Node,
    day: cc.Label,
    rewardNode: cc.Node,
    rewardCount: cc.Label
  },
  initData: function (e, t) {
    this.curDay = t
    this.mainData = e
  },
  start: function () {
    const e = Math.floor(facade.getComponent('GameModel').lastFetchSignInTime / 86400 / 1e3)
    const t = Math.floor(facade.getComponent('GameModel').getLocalTime() / 86400 / 1e3)
    this.now.active = false
    this.isGet.active = this.curDay > this.mainData.Day
    this.curDay == this.mainData.Day && (e < t ? (this.now.active = true, this.isGet.active = false) : e == t && (this.now.active = false, this.isGet.active = true)), this.day.string = '第' + this.mainData.Day + '天', this.rewardCount.string = 'x' + this.mainData.AwardNum
    let n = ''
    switch (this.mainData.AwardType) {
      case 1:
        n = 'cash'
        break
      case 2:
        n = 'strength'
        break
      case 3:
        n = 'video'
        this.rewardCount.node.active = false
        break
      case 4:
        n = 'skin'
        this.rewardCount.node.active = false
        cc.loader.loadRes('roles', cc.SpriteAtlas, this.updateSkin.bind(this))
    }
    this.rewardNode.getChildByName(n).active = true
  },
  updateSkin: function (e, t) {
    if (e) console.error(e)
    else {
      const n = t.getSpriteFrame('MrBullet_Role_Body_0' + this.mainData.AwardNum)
      this.rewardNode.getChildByName('skin').getChildByName('head').getComponent(cc.Sprite).spriteFrame = n
      sp1 = t.getSpriteFrame('MrBullet_Role_AimArm_0' + this.mainData.AwardNum)
      this.rewardNode.getChildByName('skin').getChildByName('New Sprite').getComponent(cc.Sprite).spriteFrame = sp1
    }
  }
})
