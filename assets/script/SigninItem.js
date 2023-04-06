cc.Class({
  extends: cc.Component,
  properties: {
    now: cc.Node,
    isGet: cc.Node,
    day: cc.Label,
    rewardNode: cc.Node,
    rewardCount: cc.Label
  },

  initData (day, data) {
    this.curDay = data
    this.mainData = day
  },

  start () {
    const lastSignin = Math.floor(facade.getComponent('GameModel').lastFetchSignInTime / 86400 / 1e3)
    const now = Math.floor(facade.getComponent('GameModel').getLocalTime() / 86400 / 1e3)

    this.now.active = false
    this.isGet.active = (this.curDay > this.mainData.Day)

    if (this.curDay == this.mainData.Day) {
      if (lastSignin < now) {
        this.now.active = true
        this.isGet.active = false
      } else if (lastSignin == now) {
        this.now.active = false
        this.isGet.active = true
      }
    }

    this.day.string = '第' + this.mainData.Day + '天'
    this.rewardCount.string = 'x' + this.mainData.AwardNum

    let rewardName = ''
    switch (this.mainData.AwardType) {
      case 1:
        rewardName = 'cash'
        break
      case 2:
        rewardName = 'strength'
        break
      case 3:
        rewardName = 'video'
        this.rewardCount.node.active = false
        break
      case 4:
        rewardName = 'skin'
        this.rewardCount.node.active = false
        cc.loader.loadRes('roles', cc.SpriteAtlas, this.updateSkin.bind(this))
    }
    this.rewardNode.getChildByName(rewardName).active = true
  },

  updateSkin (err, t) {
    if (err) return console.error(err)

    const n = t.getSpriteFrame('MrBullet_Role_Body_0' + this.mainData.AwardNum)
    this.rewardNode.getChildByName('skin').getChildByName('head').getComponent(cc.Sprite).spriteFrame = n
    sp1 = t.getSpriteFrame('MrBullet_Role_AimArm_0' + this.mainData.AwardNum)
    this.rewardNode.getChildByName('skin').getChildByName('New Sprite').getComponent(cc.Sprite).spriteFrame = sp1
  }
})
