const i = require('ModuleEventEnum')
require('MathUtils')
cc.Class({
  extends: cc.Component,
  properties: {},
  initConfig: function () {
    cc.loader.loadRes('config/SignConfig', this.setConfig.bind(this)), cc.loader.loadRes('config/CharacterConfig', cc.JsonAsset, this.characterLoaded.bind(this)), cc.systemEvent.on(i.WX_SHOW, this.onWxShow.bind(this)), cc.systemEvent.on(i.WX_HIDE, this.onWxHide.bind(this))
  },
  dealLoadData: function (e) {
    const t = JSON.parse(e)
    this.gotGameRecord = !0, this.localCash = t || {}, console.log('GameModel data:', e), facade.getComponent('LevelModel').httpResDeal(this.localCash), this.formDatas()
  },
  httpResDeal: function (e) {},
  getLocalTime: function () {
    const e = new Date()
    return e.getTime() - 6e4 * e.getTimezoneOffset()
  },
  getLocalTimeHour: function () {
    return (new Date()).getHours()
  },
  formDatas: function (e) {
    this.firstLoginTime1 = this.localCash.firstLoginTime1, this.cash = Number(this.localCash.cash), this.energy = Number(this.localCash.energy), this.energyLostTime = Number(this.localCash.energyLostTime), this.characterId = Number(this.localCash.characterId), this.unlockCharacters = this.localCash.unlockCharacters, this.characterVideoCounts = this.localCash.characterVideoCounts, this.lastRewardEnergyTime = Number(this.localCash.lastRewardEnergyTime), this.rewardEnergyCount = Number(this.localCash.rewardEnergyCount), this.lastFetchColectTime = Number(this.localCash.lastFetchColectTime), this.lastFetchSignInTime = Number(this.localCash.lastFetchSignInTime), this.fetchDays = Number(this.localCash.fetchDays), this.aliveFetchList = this.localCash.aliveFetchList, this.newbieFetchList = this.localCash.newbieFetchList, this.lastFetchFloatReward = this.localCash.lastFetchFloatReward, this.lastFetchClientTime = this.localCash.lastFetchClientTime, this.gotNextReward = Number(this.localCash.gotNextReward), this.gotNewerReward = Number(this.localCash.gotNewerReward), this.gotAdvanceReward = Number(this.localCash.gotAdvanceReward), this.oneShotLevelList = this.localCash.oneShotLevelList, this.oneShotLevel = Number(this.localCash.oneShotLevel), this.oneShotLevelCupNum = Number(this.localCash.oneShotLevelCupNum), this.levelShotUpdate = Number(this.localCash.levelShotUpdate), this.chanllenTimes = Number(this.localCash.chanllenTimes), this.cupNumData = Number(this.localCash.cupNumData), this.levelFreeRetry = Number(this.localCash.levelFreeRetry), this.today = this.localCash.today, e || (this.localCash.today ? this.today != (new Date()).getMonth() + '_' + (new Date()).getDate() && (this.today = (new Date()).getMonth() + '_' + (new Date()).getDate(), this.aliveFetchList = [], this.newbieFetchList = [], this.saveData()) : (this.today = (new Date()).getMonth() + '_' + (new Date()).getDate(), this.saveData())), this.levelFreeRetry || (this.levelFreeRetry = 0), this.oneShotLevelCupNum || (this.oneShotLevelCupNum = 0), this.chanllenTimes || (this.chanllenTimes = 0), this.oneShotLevel || (this.oneShotLevel = 0), this.cupNumData || (this.cupNumData = 0), this.oneShotLevelList || (this.oneShotLevelList = []), this.levelShotUpdate || (this.levelShotUpdate = 0), this.cash || (this.cash = 0), this.gotNextReward || (this.gotNextReward = 0), this.gotNewerReward || (this.gotNewerReward = 0), this.gotAdvanceReward || (this.gotAdvanceReward = 0), this.characterId || (this.characterId = 1, this.unlockCharacters = [1]), this.characterVideoCounts || (this.characterVideoCounts = {}), this.energyLostTime || (this.energyLostTime = 0, (!this.energy || this.energy < 15) && (this.energy = this.maxEnergy))
    const t = Math.floor(this.getLocalTime() / 86400 / 1e3)
    if (this.lastRewardEnergyTime) {
      const n = Math.floor(this.lastRewardEnergyTime / 86400 / 1e3)
      const o = new Date(86400 * n * 1e3)
      const a = new Date(86400 * t * 1e3)
      console.log('lastRewardDate:', a.toString()), console.log('todayDate:', o.toString()), n < t && (this.rewardEnergyCount = 0, this.lastRewardEnergyTime = this.getLocalTime(), this.levelShotUpdate = 0, this.chanllenTimes = 0, this.freeLuckyVideoTimes = 0, this.cupNumData = 0, this.oneShotLevelCupNum = 0, this.oneShotLevel = 0, this.levelFreeRetry = 0)
    } else this.lastRewardEnergyTime = 0
    this.getLocalTimeHour() >= 21 && this.levelShotUpdate == 0 && (this.levelShotUpdate = 1), this.levelRetryTouch = !1
    const s = new Date()
    if (this.energy < this.maxEnergy && this.energyLostTime) {
      const c = s.getTime() - this.energyLostTime
      let r = Math.floor(c / (2 * this.energyCD))
      r + this.energy > 15 && (r = 15 - this.energy), this.energy += r, this.energyLostTime += r * this.energyCD * 2, this.energy >= this.maxEnergy && (this.energyLostTime = 0), this.offlineEnergy(r)
    }
    this.lastFetchColectTime || (this.lastFetchColectTime = 0), this.lastFetchSignInTime || (this.lastFetchSignInTime = 0), this.fetchDays || (this.fetchDays = 0), this.aliveFetchList || (this.aliveFetchList = []), this.newbieFetchList || (this.newbieFetchList = []), this.lastFetchFloatReward || (this.lastFetchFloatReward = 0), this.lastFetchClientTime || (this.lastFetchClientTime = 0), e || (facade.CurrentScene != 'Game' ? facade.needShowSign = !0 : (facade.needShowSign = !1, this.saveData(), cc.systemEvent.emit(i.INIT_ROLEINFO_COMPLETED)))
  },
  setShotUpdateData: function (e) {
    this.levelShotUpdate = e, this.saveData()
  },
  setAddChanllenNum: function () {
    this.chanllenTimes++, this.saveData()
  },
  setOneShotLeves: function () {
    if (facade.getComponent('LevelModel').oneShotConfigList) {
      this.oneShotLevelList = [], this.oneShotLevel = 1, this.oneShotLevelCupNum = 0
      for (let e = facade.getComponent('LevelModel').oneShotConfigList.length; this.oneShotLevelList.length < 20;) {
        for (var t = Math.floor(Math.random() * e + 1), n = !1, i = 0; i < this.oneShotLevelList.length; i++) {
          if (this.oneShotLevelList[i] == t) {
            n = !0
            break
          }
        } n || (this.oneShotLevelList.push(t), 0)
      }
      this.saveData()
    }
  },
  onLevelShotPassed: function () {
    this.showLevelOver = !1, this.oneShotLevel < 20 ? this.oneShotLevel++ : this.oneShotLevel == 20 && (this.showLevelOver = !0)
    const e = facade.getComponent('LevelModel').nowLevelConfig.LuckyPoint
    this.cupNumData += e, this.oneShotLevelCupNum += e
    const t = {
      game_id: window.facade.GameId,
      token: window.facade.getComponent('PlayerModel').token,
      score_type: 2,
      score: this.cupNumData
    }
    window.net.getComponent('Net').httpRequest(window.net.SaveScore, t), this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(this.goToShotNextLevel, this))), this.saveData()
  },
  goToShotNextLevel: function () {
    this.showLevelOver ? cc.systemEvent.emit(i.SHOT_NOW_OVER_SHOW) : cc.systemEvent.emit(i.GO_SHOT_NEXT)
  },
  onLevelShotNext: function () {
    this.oneShotLevel < 20 ? this.oneShotLevel++ : this.oneShotLevel == 20 && this.setOneShotLeves(), cc.systemEvent.emit(i.GO_SHOT_NEXT), this.saveData()
  },
  setOpenRankfFlag: function (e) {
    this.openRankFlag = e
  },
  getFreeRetry: function () {
    const e = facade.getComponent('ShareADModel').GameConfig.Free_Rematch_Cnt.Value
    return !!e && this.levelFreeRetry <= e
  },
  setAddFreeRetryNum: function () {
    this.levelFreeRetry++, this.saveData()
  },
  offlineEnergy: function (e) {
    console.log('offlineEnergy:', e), this._offLineEnergy = e, this.saveData()
  },
  characterLoaded: function (e, t) {
    console.log('asset:', t), this.charaterConfig = t.json, cc.systemEvent.emit(i.CHARACTER_INFO)
  },
  setConfig: function (e, t) {
    if (e) console.error(e)
    else {
      const n = t.json
      for (const i in n) n[i].Type == 1 ? this.newcomerConfig.push(n[i]) : n[i].Type == 2 && this.oldConfig.push(n[i])
    }
  },
  isCharacterLocked: function (e) {
    for (let t = 0; t < this.unlockCharacters.length; t++) { if (this.unlockCharacters[t] == e) return !1 }
    return !0
  },
  onLoad: function () {
    this.newcomerConfig = [], this.oldConfig = [], this.initConfig(), this.cash = 0, this.energy = 15, this.gotNextReward = 0, this.gotNewerReward = 0, this.gotAdvanceReward = 0, this.energyLostTime = 0, this.lastRewardEnergyTime = 0, this.rewardEnergyCount = 0, this.characterId = 1, this.unlockCharacters = [1], this.maxEnergy = 15, this.energyCD = 6e5, this.newerRewardCancelCount = 0, this.passLevelCount = 0, this.characterVideoCounts = {}, this.localCash = {}, this.formDatas(!0), this.oneShotLevelList = [], this.oneShotLevel = 1, this.oneShotLevelCupNum = 0, this.levelShotUpdate = 0, this.chanllenTimes = 0, this.cupNumData = 0, this.levelFreeRetry = 0, cc.systemEvent.on(i.GOT_HTTP_RES, this.httpResDeal.bind(this)), cc.systemEvent.on(i.ROLE_SELECTED, this.onRoleSelected.bind(this)), cc.systemEvent.on(i.ROLE_SELECTED, this.onRoleSelected.bind(this)), cc.systemEvent.on(i.LEVEL_SHOT_PASSED, this.onLevelShotPassed, this), facade.isMiniGame ? cc.systemEvent.on(i.WX_REGISTERED, this.onGotToken.bind(this)) : this.readDataFromLocal()
  },
  checkNewerShowCondtition: function () {
    return this.passLevelCount++, this.newerRewardCancelCount >= 2 && this.passLevelCount < 3 ? 0 : this.gotNewerReward ? this.gotAdvanceReward ? 0 : 'Advance' : 'Newer'
  },
  onGotToken: function () {
    const e = this
    if (facade.isMiniGame) {
      const t = {
        channel: 'wx',
        gameId: 'wxf88c93d96e079e42',
        accountId: window.facade.getComponent('PlayerModel').userId
      }
      this.postRequest('https://games.qdos.com/game/load', 'p=' + JSON.stringify(t), {
        success: function (t) {
          console.error(t), e.dealLoadData(t)
        }
      })
    }
  },
  delayInitData: function () {
    this.gotGameRecord || this.formDatas()
  },
  readDataFromLocal: function () {
    const e = cc.sys.localStorage.getItem('Shooter_GameData')
    e ? (this.localCash = JSON.parse(e), this.formDatas()) : (this.cash = 0, this.energy = 15, this.energyLostTime = 0, this.characterId = 1, this.unlockCharacters = [1], this.characterVideoCounts = {})
  },
  clearData: function () {
    const e = {}
    if (facade.isMiniGame) {
      const t = {
        channel: 'wx',
        gameId: 'wxf88c93d96e079e42',
        accountId: window.facade.getComponent('PlayerModel').userId,
        data: JSON.stringify(e)
      }
      this.postRequest('https://games.qdos.com/game/upload', 'p=' + JSON.stringify(t))
    } else cc.sys.localStorage.setItem('Shooter_GameData', JSON.stringify(e))
  },
  onWxShow: function () {},
  onWxHide: function () {
    facade.FOR_DEVELOP || this.saveData(!0)
  },
  saveData: function (e) {
    if (facade.CurrentScene != 'SkipPage') {
      const t = {}
      if (t.firstLoginTime1 || (t.firstLoginTime1 = (new Date()).getTime()), t.cash = this.cash, t.energy = this.energy, t.energyLostTime = this.energyLostTime, t.characterId = this.characterId, t.unlockCharacters = this.unlockCharacters, t.lastRewardEnergyTime = this.lastRewardEnergyTime, t.rewardEnergyCount = this.rewardEnergyCount, t.characterVideoCounts = this.characterVideoCounts, t.lastFetchColectTime = this.lastFetchColectTime, t.lastFetchSignInTime = this.lastFetchSignInTime, t.fetchDays = this.fetchDays, t.aliveFetchList = this.aliveFetchList, t.newbieFetchList = this.newbieFetchList, t.lastFetchFloatReward = this.lastFetchFloatReward, t.lastFetchClientTime = this.lastFetchClientTime, t.gotNextReward = this.gotNextReward, t.gotAdvanceReward = this.gotAdvanceReward, t.gotNewerReward = this.gotNewerReward, t.oneShotLevelList = this.oneShotLevelList, t.oneShotLevel = this.oneShotLevel, t.levelShotUpdate = this.levelShotUpdate, t.chanllenTimes = this.chanllenTimes, t.cupNumData = this.cupNumData, t.oneShotLevelCupNum = this.oneShotLevelCupNum, t.levelFreeRetry = this.levelFreeRetry, t.today = this.today, facade.isMiniGame) {
        const n = this
        if (!window.facade.getComponent('LevelModel')) {
          return void setTimeout(function () {
            n.saveData()
          }, 100)
        }
        t.score = window.facade.getComponent('LevelModel').getTotalStar()
        const i = window.facade.getComponent('LevelModel').localCaCheOnlyThis
        for (const o in i) {
          if (i.hasOwnProperty(o)) {
            const a = i[o]
            t[o] = a
          }
        }
      }
      if (facade.isMiniGame && (e || facade.FOR_DEVELOP)) {
        const s = {
          channel: 'wx',
          gameId: 'wxf88c93d96e079e42',
          accountId: window.facade.getComponent('PlayerModel').userId,
          data: JSON.stringify(t)
        }
        this.postRequest('https://games.qdos.com/game/upload', 'p=' + JSON.stringify(s))
      } else cc.sys.localStorage.setItem('Shooter_GameData', JSON.stringify(t))
    }
  },
  isEnergyFull: function () {
    return this.energy >= this.maxEnergy
  },
  getNextEnergyTime: function () {
    return this.energyLostTime + this.energyCD
  },
  getFullTime: function () {
    const e = this.getNextEnergyTime()
    const t = this.energy + 1
    let n = e
    return n += (this.maxEnergy - t) * this.energyCD
  },
  loseEnergy: function () {
    let e; const t = facade.getComponent('LevelModel').getLevelConfig(window.facade.getComponent('LevelModel').playingLevel)
    if (facade.getComponent('LevelModel').costEnergy = 1, e = t.BonusType == 1 ? 0 : 1, this.energy -= e, this.energy < 0 && (this.energy = 0), this.energy < this.maxEnergy && this.energyLostTime == 0) {
      const n = new Date()
      this.energyLostTime = n.getTime()
    }
    this.saveData()
  },
  gainEnergy: function () {
    const e = new Date()
    this.energy++, this.energyLostTime = e.getTime(), this.energy >= this.maxEnergy && (this.energy = this.maxEnergy, this.energyLostTime = 0), this.saveData()
  },
  gainEnergy11111: function () {
    this.energy += 5, this.saveData()
  },
  isRewardEnergyLimited: function () {
    return this.rewardEnergyCount >= 6
  },
  rewardEnergy: function (e) {
    new Date()
    this.lastRewardEnergyTime = this.getLocalTime(), this.rewardEnergyCount++, this.energy += e, this.energy >= this.maxEnergy && (this.energyLostTime = 0), this.saveData()
  },
  addCash: function (e) {
    this.cash += e, this.saveData()
  },
  onRoleSelected: function (e) {
    this.characterId = e, this.saveData()
  },
  buyACharacter: function (e) {
    const t = this.charaterConfig[String(e)]
    Number(t.Cost) > this.cash ? popUp.getComponent('FloatTip').showTip('钱钱好像不够哦！') : (cc.systemEvent.emit(i.CHARACTER_GOT, e), this.cash -= Number(t.Cost), this.unlockCharacters.push(e), this.characterId = e, this.saveData())
  },
  watchACharacter: function (e) {
    this._watchingId = e
    const t = {
      inviteId: 0,
      videoId: 21106,
      assistId: 0,
      interstitalId: 31106
    }
    window.facade.getComponent('ShareADModel').showShareAD(t, {
      succ: function (e) {
        console.log('皮肤观看成功:', e), this.addAWatchCount()
      }.bind(this),
      fail: function (e, t) {
        popUp.getComponent('FloatTip').showTip(e)
      }
    })
  },
  addAWatchCount: function () {
    this.characterVideoCounts[this._watchingId + ''] ? this.characterVideoCounts[this._watchingId + '']++ : this.characterVideoCounts[this._watchingId + ''] = 1
    const e = this.charaterConfig[String(this._watchingId)]
    this.characterVideoCounts[this._watchingId + ''] >= e.Cost && this.unlockCharacters.push(this._watchingId), cc.systemEvent.emit(i.SKIN_WATCHED), this._watchingId = null, this.saveData()
  },
  getWatchCount: function (e) {
    return this.characterVideoCounts[e + ''] ? this.characterVideoCounts[e + ''] : 0
  },
  getCollectReward: function () {
    const e = facade.getComponent('ShareADModel').GameConfig.CollectValue
    const t = this.getLocalTime()
    this.lastFetchColectTime = t, this.addCash(parseInt(e.Value))
    const n = '成功领取奖励: 钞票 x ' + e.Value
    popUp.getComponent('FloatTip').showTip(n), cc.systemEvent.emit(i.UPDATE_COLLECT_SHOW)
  },
  gainSkin: function (e) {
    this.unlockCharacters.push(parseInt(e)), this.saveData()
  },
  getRewardConfig: function () {
    let e = this.fetchDays
    return e == null && (e = 0), e <= 7 ? this.newcomerConfig : this.oldConfig
  },
  applySignReward: function (e, t) {
    console.log('SignIn reward: ', t)
    const n = this.getLocalTime()
    this.lastFetchSignInTime = n, this.fetchDays++
    const i = e ? 2 * t.AwardNum : t.AwardNum
    switch (t.AwardType) {
      case 1:
        this.addCash(i), popUp.getComponent('FloatTip').showTip('钞票 +' + i)
        break
      case 2:
        this.rewardEnergy(i), popUp.getComponent('FloatTip').showTip('体力 +' + i)
        break
      case 3:
        break
      case 4:
        this.gainSkin(t.AwardNum)
        var o = this.charaterConfig['' + t.AwardNum].langName
        popUp.getComponent('FloatTip').showTip('获得皮肤 ' + o)
    }
    popUp.getComponent('Pop').removeTop()
  },
  applyInviteNewbieReward: function (e, t) {
    const n = facade.getComponent('ShareADModel').GameConfig.InviteB
    this.newbieFetchList.length >= 4 || (this.newbieFetchList.push({
      id: e,
      user_id: t
    }), this.addCash(Number(n.Value)), this.saveData(), cc.systemEvent.emit(i.INVITE_UPDATE_DAILY, e))
  },
  applyInviteAliveReward: function (e, t) {
    const n = facade.getComponent('ShareADModel').GameConfig.InviteT
    this.aliveFetchList.length >= 4 || (this.aliveFetchList.push(t), this.rewardEnergy(parseInt(n.Value)), this.saveData(), cc.systemEvent.emit(i.INVITE_UPDATE_DAILY, e))
  },
  applyHoverWinReward: function () {
    const e = facade.getComponent('ShareADModel').GameConfig.Float_Reward.Value
    this.lastFetchFloatReward = this.getLocalTime(), this.rewardEnergy(parseInt(e)), popUp.getComponent('FloatTip').showTip('恭喜获得体力 x' + e), cc.systemEvent.emit(i.UPDATE_HOVER_SHOW)
  },
  takeNextReward: function () {
    this.gotNextReward > 0 ? popUp.getComponent('FloatTip').showTip('已经领取过该奖励~') : (this.rewardEnergy(5), this.unlockCharacters.includes(4) || this.unlockCharacters.push(4), this.gotNextReward = 1, this.saveData(), popUp.getComponent('FloatTip').showTip('恭喜获得次日大礼包！'))
  },
  takeAdvanceReward: function () {
    this.gotAdvanceReward > 0 ? popUp.getComponent('FloatTip').showTip('已经领取过该奖励~') : (this.rewardEnergy(5), this.addCash(300), this.gotAdvanceReward = 1, this.saveData(), popUp.getComponent('FloatTip').showTip('恭喜获得进阶大礼包！'))
  },
  takeNewerReward: function () {
    this.gotNewerReward > 0 ? popUp.getComponent('FloatTip').showTip('已经领取过该奖励~') : (this.addCash(300), this.rewardEnergy(5), this.unlockCharacters.includes(2) || this.unlockCharacters.push(2), this.gotNewerReward = 1, this.saveData(), popUp.getComponent('FloatTip').showTip('恭喜获得新手大礼包！'))
  },
  checkClientRewardShow: function () {
    return console.log('lastFetchClientTime: ', this.lastFetchClientTime), !(Math.floor(this.getLocalTime() / 86400 / 1e3) <= Math.floor(this.lastFetchClientTime / 86400 / 1e3))
  },
  applyClientReward: function () {
    this.lastFetchClientTime = this.getLocalTime()
    const e = facade.getComponent('ShareADModel').GameConfig.Customer_service_reward.Value
    this.rewardEnergy(parseInt(e)), popUp.getComponent('FloatTip').showTip('公众号每日奖励：体力 x' + e), cc.systemEvent.emit(i.UPDATE_HOVER_SHOW)
  },
  checkHoverWinRewardShow: function () {
    return this.lastFetchFloatReward == 0 || !(Math.floor(this.getLocalTime() / 86400 / 1e3) <= Math.floor(this.lastFetchFloatReward / 86400 / 1e3))
  },
  waitingForBroadcastReward: function () {
    cc.director.getScene().name == 'Game' && facade.fromBroadcast && (this.checkClientRewardShow() ? (facade.fromBroadcast = !1, this.applyClientReward()) : facade.fromBroadcast = !1)
  },
  update: function () {
    this.energy < this.maxEnergy && ((new Date()).getTime() >= this.energyLostTime + this.energyCD && this.gainEnergy())
    this.waitingForBroadcastReward()
  },
  postRequest: function (e, t, n) {
    const i = new XMLHttpRequest()
    i.onreadystatechange = function (e) {
      if (i.readyState == 4 && i.status >= 200 && i.status < 300) {
        const t = JSON.parse(i.responseText)
        t.code != 0 ? n && n.failure && n.failure(t.code) : n && n.success && n.success(t.data)
      }
    }, i.onerror = function (e) {
      n && n.failure && n.failure(e)
    }, i.open('POST', e, !1), i.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'), i.send(t)
  }
})
