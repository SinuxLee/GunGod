const ModuleEventEnum = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {
    goNextBtn: cc.Node,
    restartBtn: cc.Node,
    linkBox: cc.Node,
    linkItemPre: cc.Prefab,
    chanllenLabel: cc.Label,
    fauilNode: cc.Node,
    cupNumLabel: cc.Label,
    returnPlayBt: cc.Node,
    cupNumNode: cc.Node
  },

  onEnable: function () {
    this.losePlayed = false
  },
  onDisable: function () {
    this.losePlayed = false
  },
  init: function (e) {
    cc.systemEvent.on(ModuleEventEnum.RESULT_RECOMMEND, this.gotLinks, this)
    if (e) {
      this.returnPlayBt.active = true
      this.returnPlayBt.getComponent(cc.Button).interactable = true
      this.cupNumNode.active = true
      this.goNextBtn.active = false
      this.restartBtn.active = false
      this.fauilNode.active = false
      const t = window.facade.getComponent('GameModel').oneShotLevelCupNum
      this.cupNumLabel.string = '+' + t
    } else {
      this.returnPlayBt.active = false
      this.cupNumNode.active = false
      this.goNextBtn.active = true
      this.restartBtn.active = true
      this.restartBtn.getComponent(cc.Button).interactable = true
      this.fauilNode.active = true
      this.setChanllenLabel()
    }

    this.initLinks()
  },
  setChanllenLabel: function () {
    this.chanllenNum = window.facade.getComponent('GameModel').chanllenTimes
    const e = facade.getComponent('ShareADModel').GameConfig.OneBulletCnt.Value
    this.chanllenLabel.string = '剩余次数:' + (e - this.chanllenNum) + '/' + e
  },
  goReturnBegin: function () {
    this.restartBtn.getComponent(cc.Button).interactable = false
    this.returnPlayBt.getComponent(cc.Button).interactable = false
    this.chanllenNum = window.facade.getComponent('GameModel').chanllenTimes
    const e = facade.getComponent('ShareADModel').GameConfig.OneBulletCnt.Value
    if (this.chanllenNum < e) {
      if (window.facade.getComponent('GameModel').levelShotUpdate == 0) {
        if (window.facade.getComponent('GameModel').getLocalTimeHour() >= 21) {
          window.facade.getComponent('GameModel').setShotUpdateData(1)
          var t = '今日挑战时间已结束，请领取奖励！'
          popUp.getComponent('FloatTip').showTip(t)
          this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(this.backMain, this)))
        } else {
          window.facade.getComponent('GameModel').setAddChanllenNum()
          this.chanllenNum++
          window.facade.getComponent('GameModel').setOneShotLeves()
          this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(this.goToShotNextLevel, this)))
        }
      }
    } else {
      t = '今日挑战次数已用完，请明日再来！'
      popUp.getComponent('FloatTip').showTip(t)
      this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(this.backMain, this)))
    }
  },
  initLinks: function () {
    facade.SAVE_MODE ? this.linkBox.active = false : window.facade.getComponent('RecommendGameModel').requestResultRecommend()
  },
  backMain: function () {
    cc.systemEvent.emit(ModuleEventEnum.BACK_MAIN)
  },
  goToShotNextLevel: function () {
    this.node.active = false
    cc.systemEvent.emit(ModuleEventEnum.GO_SHOT_NEXT)
  },
  goNext: function () {
    this.node.active = false
    window.facade.getComponent('GameModel').onLevelShotNext()
  },
  onRetry: function () {
    this.restartBtn.getComponent(cc.Button).interactable = false
    const e = facade.getComponent('ShareADModel').GameConfig.OneBulletCnt.Value
    if (this.chanllenNum < e) {
      window.facade.getComponent('GameModel').setAddChanllenNum()
      this.chanllenNum++
      const t = {
        inviteId: 0,
        videoId: 21109,
        assistId: 0,
        interstitalId: 31106
      }
      window.facade.getComponent('ShareADModel').showShareAD(t, {
        succ: function (e) {
          console.log('重玩视频:', e)
          this.node.active = false
          cc.systemEvent.emit(ModuleEventEnum.GO_SHOT_NEXT)
        }.bind(this),
        fail: function (e, t) {
          popUp.getComponent('FloatTip').showTip(e)
        }
      })
    }
  },
  hide: function () {
    cc.systemEvent.off(ModuleEventEnum.RESULT_RECOMMEND, this.gotLinks, this)
    this.node.active = false
  },
  gotLinks: function (e) {
    this.linkBox.removeAllChildren()
    if (!e || e.length == 0) return this.linkBox.opacity = 0, void (this.linkBox.active = false)
    this.linkBox.opacity = 255
    this.linkBox.active = true
    if (window.facade.getComponent('PlayerModel').isClickCountLimit(3)) {
      for (let t = 0; t < e.length; t++) e[t].navout_max_cnt && e[t].navout_max_cnt != '' && Number(e[t].navout_max_cnt) != 0 && e[t].navout_cnt >= Number(e[t].navout_max_cnt) && (e.splice(t, 1), t--)
    }
    if (facade.getComponent('PlayerModel').isIconRandomOrder('result')) {
      const n = facade.getComponent('PlayerModel').getResultRecommondRandomCount()
      const i = e.slice(0, n)
      const o = e.slice(n, e.length)
      i && i.length > 1 && i.sort(function () {
        return 0.5 - Math.random()
      }), e = [], e = i.concat(o)
    } else {
      e.sort(function (e, t) {
        return Number(e.weight) > Number(t.weight) ? -1 : 1
      })
    }
    for (let a = Math.min(e.length, 12), s = 0; s < a; s++) {
      let c = null;
      (c = cc.instantiate(this.linkItemPre)).active = true
      c.scale = 1.1
      c.getComponent('RecommendGameItem').setupItemData(e[s])
      this.linkBox.addChild(c)
    }
  },

  checkGfit: function () {
    if (!facade.SAVE_MODE) {
      const e = facade.getComponent('GameModel').checkNewerShowCondtition()
      e != 0 && window.popUp.getComponent('Pop').addPopByName(e + 'View', null, true, false)
    }
  }
})
