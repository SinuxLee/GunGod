const ModuleEventEnum = require('ModuleEventEnum')
const Analytics = require('AnalyticsUtilities').AnalyticsUtilities

cc.Class({
  extends: cc.Component,
  properties: {
    star1: cc.Node,
    star2: cc.Node,
    star3: cc.Node,
    reward: cc.Node,
    linkBox: cc.Node,
    linkItemPre: cc.Prefab,
    failNode: cc.Node,
    passNode: cc.Node,
    goNextBtn: cc.Node,
    restartBtn: cc.Node,
    restartLabel: cc.Node,
    retryCostEnergy: cc.Node,
    skipBtn: cc.Node,
    upBtn: cc.Node,
    doubleBtn: cc.Node,
    replayPanel: cc.Node,
    recommendPage: cc.Node,
    resultLabel: cc.Node,
    result3LabelSkin: cc.SpriteFrame,
    result2LabelSkin: cc.SpriteFrame,
    result1LabelSkin: cc.SpriteFrame,
    resultPassLabelSkin: cc.SpriteFrame,
    btnVideoSkin: cc.SpriteFrame,
    btnShareSkin: cc.SpriteFrame,
    bigVideoSkin: cc.SpriteFrame,
    bigShareSkin: cc.SpriteFrame,
    iconVideoSkin: cc.SpriteFrame,
    iconShareSkin: cc.SpriteFrame,
    btnNextSkin: cc.SpriteFrame,
    bigNextSkin: cc.SpriteFrame,
    btnRetrySkin: cc.SpriteFrame,
    bigRetrySkin: cc.SpriteFrame
  },

  start () {
    window.facade.Screenratio && window.facade.Screenratio < 0.47 ? this.skipBtn.parent.getComponent(cc.Widget).bottom = 200 : this.skipBtn.parent.getComponent(cc.Widget).bottom = 10, this.skipBtn.parent.getComponent(cc.Widget).updateAlignment()
  },

  onEnable () {
    this.losePlayed = false
    this.replayPanel.active = false
    this.recommendPage.active = true
  },

  onDisable () {
    this.losePlayed = false
    this.replayPanel.active = false
  },

  init (e) {
    this.passNode.active = false
    this.failNode.active = false
    this.goNextBtn.parent.active = false
    this.rewardCash = 0
    this._passed = e
    cc.systemEvent.on(ModuleEventEnum.RESULT_RECOMMEND, this.gotLinks, this)
    this.goNextBtn.getComponent(cc.Button).interactable = true
    this.restartBtn.getComponent(cc.Button).interactable = true
    this.restartLabel.getComponent(cc.Button).interactable = true
    this.retryCostEnergy.getComponent(cc.Button).interactable = true
    this.skipBtn.getComponent(cc.Button).interactable = true
    this.upBtn.getComponent(cc.Button).interactable = true
    this.doubleBtn.getComponent(cc.Button).interactable = true
    this.restartBtn.getComponent(cc.Widget).isAlignHorizontalCenter = false
    this.updateRewardType()
    this.initResult()
    this.initLinks()
    Analytics.logEvent('进入结算界面')
  },

  updateRewardType () {
    this.rewardType = window.facade.getComponent('ShareADModel').getShareADType()
    if (this.rewardType != 2) {
      this.skipBtn.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.iconVideoSkin
      this.upBtn.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.iconVideoSkin
      this.doubleBtn.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.iconVideoSkin
      this.restartBtn.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.iconVideoSkin
      this.type = 'Video'
    } else {
      this.skipBtn.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.iconShareSkin
      this.upBtn.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.iconShareSkin
      this.doubleBtn.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.iconShareSkin
      this.restartBtn.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.iconShareSkin
      this.type = 'Share'
    }
  },

  initResult () {
    this.passNode.active = true
    this.failNode.active = false
    this.resultLabel.active = false
    if (this._passed) {
      Analytics.logEvent('进入闯关成功界面: ' + window.facade.getComponent('LevelModel').playingLevel)
      this.reward.getComponent('TextureLabel').setText('0')
      this.star1.getChildByName('light').active = false
      this.star2.getChildByName('light').active = false
      this.star3.getChildByName('light').active = false
      this.reward.parent.opacity = 0
      this.node.runAction(cc.sequence(cc.delayTime(0.03), cc.callFunc(this.showResult, this)))
    } else this.initFailed()
  },

  initFailed () {
    if (!this.losePlayed) {
      window.audio.getComponent('SoundManager').playEffect('lose')
      this.losePlayed = true
    }

    Analytics.logEvent('进入闯关失败界面: ' + window.facade.getComponent('LevelModel').playingLevel)

    this.passNode.active = false
    this.failNode.active = true
    this.goNextBtn.active = false
    this.restartLabel.active = false
    this.upBtn.active = false
    this.doubleBtn.active = false
    this.restartBtn.active = true
    this.skipBtn.active = true

    this.retryCostEnergy.active = false
    setTimeout(() => {
      this.retryCostEnergy.active = true
    }, 2000)

    facade.getComponent('LevelModel').costEnergy
    this.retryCostEnergy.active = true
    this.retryCostEnergy.getComponent(cc.Label).string = '消耗1体力重玩'
    this.goNextBtn.parent.active = true
    if (window.facade.Screenratio && window.facade.Screenratio < 0.47) {
      this.failNode.getComponent(cc.Widget).bottom = 381
    } else {
      this.failNode.getComponent(cc.Widget).bottom = 170
      this.failNode.getComponent(cc.Widget).updateAlignment()
      if (facade.SAVE_MODE) {
        this.skipBtn.active = false, this.restartBtn.getComponent(cc.Widget).isAlignHorizontalCenter = true
        this.restartBtn.getComponent(cc.Widget).isAlignRight = false
        this.restartBtn.getComponent(cc.Widget).isAlignLeft = false
        this.restartBtn.getComponent(cc.Widget).horizontalCenter = 0
        this.restartBtn.getComponent(cc.Widget).updateAlignment()
      } else {
        this.restartBtn.getComponent(cc.Sprite).spriteFrame = this.bigRetrySkin
        this.restartBtn.getComponent(cc.Widget).isAlignRight = false
        this.restartBtn.getComponent(cc.Widget).isAlignLeft = true
        this.restartBtn.getComponent(cc.Widget).left = 50
        this.restartBtn.getComponent(cc.Widget).updateAlignment()
        this.skipBtn.width = 205
        this.skipBtn.getComponent(cc.Sprite).spriteFrame = this['btn' + this.type + 'Skin']
        this.skipBtn.getComponent(cc.Widget).right = 50
        this.skipBtn.getComponent(cc.Widget).updateAlignment()
      }
      this.checkLast()
    }
  },
  initNeedUp: function () {
    this.updateRewardType()
    this.passNode.active = true
    this.failNode.active = false
    this.restartBtn.active = false
    this.skipBtn.active = false
    this.doubleBtn.active = false
    this.retryCostEnergy.active = false
    const e = this
    e.restartLabel.active = false
    setTimeout(function () {
      e.restartLabel.active = true
    }, 2e3)
    this.goNextBtn.active = true
    this.upBtn.active = true

    this.goNextBtn.parent.active = true
    this.goNextBtn.width = 205
    this.goNextBtn.getComponent(cc.Sprite).spriteFrame = this.btnNextSkin
    this.goNextBtn.getComponent(cc.Widget).isAlignRight = false
    this.goNextBtn.getComponent(cc.Widget).isAlignLeft = true
    this.goNextBtn.getComponent(cc.Widget).left = 50
    this.goNextBtn.getComponent(cc.Widget).updateAlignment()

    this.upBtn.getComponent(cc.Sprite).spriteFrame = this['big' + this.type + 'Skin']
    this.upBtn.getComponent(cc.Widget).right = 50
    this.upBtn.getComponent(cc.Widget).updateAlignment()
    this.checkLast()
  },

  initDefault () {
    this.updateRewardType()
    this.passNode.active = true
    this.failNode.active = false
    this.skipBtn.active = false
    this.restartLabel.active = false
    this.upBtn.active = false
    this.doubleBtn.active = false
    this.goNextBtn.active = true
    this.restartBtn.active = true
    this.goNextBtn.parent.active = true
    this.goNextBtn.width = 205
    this.goNextBtn.getComponent(cc.Sprite).spriteFrame = this.bigNextSkin
    this.goNextBtn.getComponent(cc.Widget).left = 50
    this.goNextBtn.getComponent(cc.Widget).updateAlignment()
    this.restartBtn.getComponent(cc.Sprite).spriteFrame = this.btnRetrySkin
    this.restartBtn.getComponent(cc.Widget).isAlignRight = true
    this.restartBtn.getComponent(cc.Widget).isAlignLeft = false
    this.restartBtn.getComponent(cc.Widget).right = 50
    this.restartBtn.getComponent(cc.Widget).updateAlignment()
    this.checkLast()
  },

  initDouble () {
    this.updateRewardType()
    this.passNode.active = true
    this.failNode.active = false
    this.skipBtn.active = false
    this.restartLabel.active = false
    this.retryCostEnergy.active = false
    this.upBtn.active = false
    this.restartBtn.active = false
    this.goNextBtn.active = true
    this.doubleBtn.active = true
    this.goNextBtn.parent.active = true
    this.goNextBtn.width = 205
    this.goNextBtn.getComponent(cc.Sprite).spriteFrame = this.btnNextSkin
    this.goNextBtn.getComponent(cc.Widget).left = 50
    this.goNextBtn.getComponent(cc.Widget).updateAlignment()
    this.doubleBtn.getComponent(cc.Sprite).spriteFrame = this['big' + this.type + 'Skin']
    this.doubleBtn.getComponent(cc.Widget).right = 50
    this.doubleBtn.getComponent(cc.Widget).updateAlignment()
    this.checkLast()
  },

  checkLast () {
    window.facade.getComponent('LevelModel').isLastLevel() && (this.goNextBtn.active = false, this.skipBtn.active = false)
  },

  initLinks () {
    facade.SAVE_MODE ? this.linkBox.active = false : window.facade.getComponent('RecommendGameModel').requestResultRecommend()
  },

  showResult () {
    window.facade.Screenratio && window.facade.Screenratio < 0.47 ? this.passNode.getComponent(cc.Widget).bottom = 580 : this.passNode.getComponent(cc.Widget).bottom = 380, this.passNode.getComponent(cc.Widget).updateAlignment(), this.star = window.facade.getComponent('LevelModel').star, this.star < 3 && this.initNeedUp(), this.star <= 0 ? this.showTitle() : (this.starIndex = 1, this.node.runAction(cc.sequence(cc.repeat(cc.sequence(cc.callFunc(this.addStar.bind(this)), cc.delayTime(0.5)), this.star), cc.delayTime(0.5), cc.callFunc(this.showTitle, this))))
  },

  showTitle () {
    this.checkGfit()
  },

  addStar () {
    const e = this['star' + this.starIndex].getChildByName('light')
    e.active = true, e.opacity = 0, e.scale = 0
    const t = cc.spawn(cc.fadeIn(0.4), cc.scaleTo(0.4, 1))
    t.easing(cc.easeElasticOut(0.2))
    e.runAction(t)
    window.audio.getComponent('SoundManager').playEffect('star')
    this.starIndex >= 3 && (this.reward.parent.opacity = 255, this.reward.parent.getChildByName('moneyEffect').getComponent(cc.ParticleSystem).resetSystem(), this.rewardCash = window.facade.getComponent('LevelModel').playingLevelConfig.Reward, this.reward.getComponent('TextureLabel').setText('+' + this.rewardCash), window.facade.getComponent('GameModel').addCash(Number(this.rewardCash)), this.initDouble()), this.starIndex++
  },

  goNext () {
    this.goNextBtn.getComponent(cc.Button).interactable = false
    const e = facade.getComponent('LevelModel').getTotalStar()
    const t = facade.getComponent('LevelModel').getLevelConfig(window.facade.getComponent('LevelModel').playingLevel + 1)
    if (window.facade.getComponent('LevelModel').getLevelVideo(facade.selectedLevelType + '_' + t.Level) > 0) t.BonusType == 3 && window.facade.getComponent('LevelModel').getLevelStar(facade.selectedLevelType + '_' + t.Level) < 3 && (t.Reward = 2 * window.facade.getComponent('LevelModel').playingLevelConfig.Reward)
    else if (t.Level == window.facade.getComponent('LevelModel').playingLevel + 1 && t.BonusType > 0) return this.watchVideo(), void (this.goNextBtn.getComponent(cc.Button).interactable = true)
    const n = facade.getComponent('LevelModel').costEnergy
    if (facade.getComponent('GameModel').energy < n) {
      return cc.systemEvent.emit(ModuleEventEnum.ENERGY_NEEDED), void this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
        this.goNextBtn.getComponent(cc.Button).interactable = true
      }.bind(this))))
    }
    t.Star > e ? popUp.getComponent('FloatTip').showTip('收集' + t.Star + '颗星星解锁下一关') : (cc.systemEvent.emit(ModuleEventEnum.GO_NEXT), Analytics.logEvent('闯关成功点击下一关'))
  },

  watchVideo () {
    const e = {
      inviteId: 0,
      videoId: 21111,
      assistId: 0,
      interstitalId: 31106
    }
    window.facade.getComponent('ShareADModel').showShareAD(e, {
      succ: function (e) {
        console.log('关卡视频:', e), this.jumpToLevlUi()
      }.bind(this),
      fail: function (e, t) {
        popUp.getComponent('FloatTip').showTip(e)
      }
    })
  },

  jumpToLevlUi () {
    window.facade.getComponent('LevelModel').setOverVideo()
    const e = facade.getComponent('LevelModel').getLevelConfig(window.facade.getComponent('LevelModel').playingLevel + 1)
    if (facade.getComponent('LevelModel').costEnergy = 1, e.BonusType == 1) {
      facade.getComponent('LevelModel').costEnergy = 0
      const t = facade.getComponent('LevelModel').costEnergy
      if (facade.getComponent('GameModel').energy < t) return void cc.systemEvent.emit(ModuleEventEnum.ENERGY_NEEDED)
    }
    e.BonusType == 2 && (e.LuckyPoint = 2 * window.facade.getComponent('LevelModel').playingLevelConfig.Reward), e.BonusType == 3 && (e.Reward = 2 * window.facade.getComponent('LevelModel').playingLevelConfig.Reward)
    const n = facade.getComponent('LevelModel').getTotalStar()
    e.Star > n ? popUp.getComponent('FloatTip').showTip('收集' + e.Star + '颗星星解锁下一关') : cc.systemEvent.emit(ModuleEventEnum.GO_NEXT)
  },

  onRetryLabelHandler () {
    this.replayPanel.active = true, Analytics.logEvent('闯关成功点击重玩')
  },

  onRetry () {
    this.doRetry()
  },

  doRetry () {
    const e = {
      inviteId: 0,
      videoId: 21113,
      assistId: 0,
      interstitalId: 31106
    }
    window.facade.getComponent('ShareADModel').showShareAD(e, {
      succ: function (e) {
        console.log('免费重玩视频:', e)
        window.facade.getComponent('GameModel').levelRetryTouch = true
        this.node.parent.getComponent('LevelUI').retry()
      }.bind(this),
      fail: function (e, t) {
        popUp.getComponent('FloatTip').showTip(e)
      }
    }), Analytics.logEvent('体力不足界面看视频或分享')
  },

  doRetryCostEnergy () {
    this.restartBtn.getComponent(cc.Button).interactable = false
    this.restartLabel.getComponent(cc.Button).interactable = false
    this.retryCostEnergy.getComponent(cc.Button).interactable = false
    window.facade.getComponent('GameModel').levelRetryTouch = true
    this.node.parent.getComponent('LevelUI').retryCostEnergy()
    Analytics.logEvent('闯关失败点击消耗体力')
  },

  onTake3Star () {
    if (facade.isMiniGame) {
      if (this.rewardType > 2) popUp.getComponent('FloatTip').showTip('已经超出今天的奖励上限啦！')
      else {
        const e = {
          inviteId: 1530,
          videoId: 21104,
          assistId: 0,
          interstitalId: 31104
        }
        window.facade.getComponent('ShareADModel').showShareAD(e, {
          succ: function (e) {
            console.log('三星分享成功:', e), this.take3Star()
          }.bind(this),
          fail: function (e, t) {
            popUp.getComponent('FloatTip').showTip(e)
          }
        })
      }
    } else this.take3Star()
  },

  take3Star () {
    this.upBtn.getComponent(cc.Button).interactable = false
    window.facade.getComponent('LevelModel').force3Star()
    this.showResult()
  },

  take3StarGet () {
    window.facade.getComponent('LevelModel').force3Star()
    this.showResult()
  },

  skip () {
    if (!facade.isMiniGame) return this.hide(), void cc.systemEvent.emit(ModuleEventEnum.SKIP)
    if (this.rewardType > 2) popUp.getComponent('FloatTip').showTip('已经超出今天的跳关上限啦！')
    else {
      const e = {
        inviteId: 1528,
        videoId: 21102,
        assistId: 0,
        interstitalId: 31102
      }
      window.facade.getComponent('ShareADModel').showShareAD(e, {
        succ: function (e) {
          console.log('跳关分享成功:', e)
          this.hide()
          cc.systemEvent.emit(ModuleEventEnum.SKIP)
        }.bind(this),
        fail: function (e, t) {
          popUp.getComponent('FloatTip').showTip(e)
        }
      })
    }
  },

  onDouble () {
    if (facade.isMiniGame) {
      if (this.rewardType > 2) popUp.getComponent('FloatTip').showTip('已经超出今天的奖励上限啦！')
      else {
        const e = {
          inviteId: 1525,
          videoId: 21100,
          assistId: 0,
          interstitalId: 31100
        }
        window.facade.getComponent('ShareADModel').showShareAD(e, {
          succ: function (e) {
            console.log('双倍分享成功:', e), this.takeDouble()
          }.bind(this),
          fail: function (e, t) {
            popUp.getComponent('FloatTip').showTip(e)
          }
        })
      }
    } else this.takeDouble()
  },

  takeDouble () {
    this.doubleBtn.getComponent(cc.Button).interactable = false
    this.reward.parent.opacity = 255
    this.reward.parent.getChildByName('moneyEffect').getComponent(cc.ParticleSystem).resetSystem()
    this.rewardCash = Number(window.facade.getComponent('LevelModel').playingLevelConfig.Reward)
    const e = 5 * this.rewardCash
    this.reward.getComponent('TextureLabel').setText('+' + e)
    window.facade.getComponent('GameModel').addCash(Number(4 * this.rewardCash))
  },

  hide () {
    cc.systemEvent.off(ModuleEventEnum.RESULT_RECOMMEND, this.gotLinks, this)
    this.node.active = false
    this.restartLabel.active = this.retryCostEnergy.active = false
  },

  gotLinks (e) {
    if (this.linkBox.removeAllChildren(), !e || e.length == 0) return this.linkBox.opacity = 0, void (this.linkBox.active = false)
    if (this.linkBox.opacity = 255, this.linkBox.active = true, window.facade.getComponent('PlayerModel').isClickCountLimit(3)) { for (let t = 0; t < e.length; t++) e[t].navout_max_cnt && e[t].navout_max_cnt != '' && Number(e[t].navout_max_cnt) != 0 && e[t].navout_cnt >= Number(e[t].navout_max_cnt) && (e.splice(t, 1), t--) }
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
      (c = cc.instantiate(this.linkItemPre)).active = true, c.scale = 1.1, c.getComponent('RecommendGameItem').setupItemData(e[s]), this.linkBox.addChild(c)
    }
  },

  checkGfit () {
    if (!facade.SAVE_MODE) {
      const e = facade.getComponent('GameModel').checkNewerShowCondtition()
      e != 0 && window.popUp.getComponent('Pop').addPopByName(e + 'View', null, true, true)
    }
  }
})
