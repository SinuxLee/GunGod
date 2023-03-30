const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {},
  initConfig: function () {
    this.CLASSIC_ID = 1e3
    this.VIP_ID = 2e3
    this.INJURY_ID = 3e3
    this.GRENADE_ID = 4e3
    cc.loader.loadRes('config/LevelConfig', cc.JsonAsset, this.loaded.bind(this))
    cc.loader.loadRes('config/OneBulletConfig', cc.JsonAsset, this.shotloaded.bind(this))
    cc.systemEvent.on(ModuleEventEnum.WX_SHOW, this.onWxShow.bind(this))
    cc.systemEvent.on(ModuleEventEnum.WX_HIDE, this.onWxHide.bind(this))
  },
  shotloaded: function (e, t) {
    for (const n in console.log('asset:', t), this.oneShotConfig = t.json, this.oneShotConfigList = [], this.oneShotConfig) this.oneShotConfigList.push(this.oneShotConfig[n])
  },
  loaded: function (e, t) {
    console.log('asset:', t)
    this.levelConfig = t.json
    this.levelType = 1
    this.levelConfigList = []
    this.chaterConfigs = {}
    for (const n in this.levelConfig) {
      this.levelConfigList.push(this.levelConfig[n])
      this.chaterConfigs[this.levelConfig[n].Type + '_' + this.levelConfig[n].Chapter] == null && (this.chaterConfigs[this.levelConfig[n].Type + '_' + this.levelConfig[n].Chapter] = [])
      this.chaterConfigs[this.levelConfig[n].Type + '_' + this.levelConfig[n].Chapter].push(this.levelConfig[n])
    }
    console.log('asset:', this.chaterConfigs, this.levelConfigList)
    this.initData()
  },
  setLevelTypeStr: function (e) {
    e == 'vip' ? (this.levelType = 2, this.costEnergy = 2) : e == 'injury' ? (this.levelType = 3, this.costEnergy = 3) : e == 'gnd' ? (this.levelType = 4, this.costEnergy = 1) : (this.levelType = 1, this.costEnergy = 1), this.costEnergy = 1
  },
  getChapters: function () {
    const e = {}
    for (const t in this.chaterConfigs) {
      const n = t.split('_')[0]
      const i = t.split('_')[1]
      Number(n) == this.levelType && (e[i] = this.chaterConfigs[t])
    }
    return e
  },
  onLoad: function () {
    cc.systemEvent.on(ModuleEventEnum.GO_LEVEL, this.onGoLevel, this)
    cc.systemEvent.on(ModuleEventEnum.LEVEL_PASSED, this.onLevelPassed, this)
    this.costEnergy = 1
    this.oneShotLevel = false
    this.initConfig()
    cc.systemEvent.on(ModuleEventEnum.GOT_HTTP_RES, this.httpResDeal.bind(this))
  },
  onGotToken: function () {},
  httpResDeal: function (e) {
    this.localCaChe = e || {}
    console.log('LevelModel data:', e)
    this.formDatas()
  },
  formDatas: function () {
    for (var e in this.localCaCheOnlyThis = {}, this.classicLevel = Number(this.localCaChe.classicLevel), this.vipLevel = Number(this.localCaChe.vipLevel), this.injuryLevel = Number(this.localCaChe.injuryLevel), this.gndLevel = Number(this.localCaChe.gndLevel), this.vipLevel || (this.vipLevel = 1), this.injuryLevel || (this.injuryLevel = 1), this.gndLevel || (this.gndLevel = 1), this.classicLevel || (this.classicLevel = 1), this.levelStars = this.localCaChe.levelStars, this.levelStars || (this.levelStars = {}), this.levelStars)(typeof e === 'number' || Number(e) > 0) && delete this.levelStars[e]
    for (var e in console.log('levelStars:', this.levelStars), this.levelVideo = this.localCaChe.levelVideo, this.levelVideo || (this.levelVideo = {}), this.levelVideo)(typeof e === 'video' || Number(e) > 0) && delete this.levelVideo[e]
    this.localCaCheOnlyThis.vipLevel = this.vipLevel, this.localCaCheOnlyThis.injuryLevel = this.injuryLevel, this.localCaCheOnlyThis.gndLevel = this.gndLevel, this.localCaCheOnlyThis.classicLevel = this.classicLevel, this.localCaCheOnlyThis.levelStars = this.levelStars, this.localCaCheOnlyThis.levelVideo = this.levelVideo
  },
  update: function () {
    this.localCaCheOnlyThis = this.localCaCheOnlyThis || {}
    this.localCaCheOnlyThis.vipLevel = this.vipLevel
    this.localCaCheOnlyThis.injuryLevel = this.injuryLevel
    this.localCaCheOnlyThis.gndLevel = this.gndLevel
    this.localCaCheOnlyThis.classicLevel = this.classicLevel
    this.localCaCheOnlyThis.levelStars = this.levelStars
    this.localCaCheOnlyThis.levelVideo = this.levelVideo
  },
  readLocalDatas: function () {
    const e = cc.sys.localStorage.getItem('Shooter_LevelData')
    e ? (this.localCaChe = JSON.parse(e), this.formDatas()) : (this.localCaChe = {}, this.localCaChe[facade.selectedLevelType + 'Level'] = this[facade.selectedLevelType + 'Level'], this.levelStars = {}, this.levelVideo = {})
  },
  getUnlockedLevelByType: function (e) {
    return this[e + 'Level'] ? this[e + 'Level'] : 1
  },
  initData: function () {
    this.classicLevel || (this.classicLevel = 1, this.vipLevel = 1, this.injuryLevel = 1, this.gndLevel = 1), this.lastBullets = 1e3, facade.isMiniGame ? window.facade.getComponent('PlayerModel').token ? this.onGotToken() : (this.localCaChe = {}, this.localCaChe.classicLevel = this.classicLevel, this.localCaChe.vipLevel = this.vipLevel, this.localCaChe.injuryLevel = this.injuryLevel, this.localCaChe.gndLevel = this.gndLevel, this.levelStars = {}, this.levelVideo = {}, cc.systemEvent.on(ModuleEventEnum.WX_REGISTERED, this.onGotToken.bind(this))) : this.readLocalDatas()
  },
  initShotData: function () {
    this.oneShotLevel = true
    this.shotNowLevel = window.facade.getComponent('GameModel').oneShotLevel
    const e = window.facade.getComponent('GameModel').oneShotLevelList
    e.length == 0 ? this.nowLevelConfig = this.oneShotConfigList[0] : this.nowLevelConfig = this.oneShotConfigList[Number(e[Number(this.shotNowLevel - 1)] - 1)]
    const t = this.nowLevelConfig.Type
    const n = this.nowLevelConfig.Level
    let o = 'level_1'
    t == 1 ? o = 'level_' + n : t == 2 && (o = 'vip_' + n), this.lastBullets = 1, this.bulletFilled = 1, this.shotedBullets = 0, cc.systemEvent.emit(ModuleEventEnum.LEVEL_ONE_SHOT_GO, o)
  },
  onGoLevel: function (e) {
    this.playingLevel = e, this.shotedBullets = 0
    let t = 1e3
    facade.selectedLevelType == 'classic' ? t = this.CLASSIC_ID : facade.selectedLevelType == 'vip' ? t = this.VIP_ID : facade.selectedLevelType == 'injury' ? t = this.INJURY_ID : facade.selectedLevelType == 'gnd' && (t = this.GRENADE_ID), this.playingLevelConfig = this.levelConfig[String(t + e)]
    const n = this.playingLevelConfig.Bullet.split(':')
    this.lastBullets = Number(n[0]), this.bulletFilled = Number(n[0]), this.starNeeds = [Number(n[1]), Number(n[2]), Number(n[3])]
  },
  getLevelConfig: function (e) {
    let t = 1e3
    return facade.selectedLevelType == 'classic' ? t = this.CLASSIC_ID : facade.selectedLevelType == 'vip' ? t = this.VIP_ID : facade.selectedLevelType == 'injury' ? t = this.INJURY_ID : facade.selectedLevelType == 'gnd' && (t = this.GRENADE_ID), this.levelConfig[String(t + e)]
  },
  getLevelNumByType: function (e) {
    let t = 1
    switch (e) {
      case 'vip':
        t = 2
        break
      case 'injury':
        t = 3
        break
      case 'gnd':
        t = 4
        break
      default:
        t = 1
    }
    for (var n = 0, i = 0; i < this.levelConfigList.length; i++) this.levelConfigList[i].Type == t && n++
    return n
  },
  resetLevel: function () {
    this.onGoLevel(this.playingLevel)
  },
  isLastLevel: function () {
    return this.playingLevel >= this.getLevelNumByType(this.levelType)
  },
  isNewLevel: function () {
    return this.playingLevel >= this[facade.selectedLevelType + 'Level']
  },
  onLevelPassed: function () {
    if (this.starNeeds) {
      this.hasWon = this.isCurrentLevelWon()
      this.playingLevel >= this[facade.selectedLevelType + 'Level'] && this[facade.selectedLevelType + 'Level']++, this.star = 0
      for (let e = 0; e < this.starNeeds.length; e++) {
        if (this.starNeeds[e] >= this.shotedBullets) {
          this.star = 3 - e
          break
        }
      } this.levelStars || (this.levelStars = {}), this.levelStars[facade.selectedLevelType + '_' + this.playingLevel] ? this.levelStars[facade.selectedLevelType + '_' + this.playingLevel] < this.star && (this.levelStars[facade.selectedLevelType + '_' + this.playingLevel] = this.star) : this.levelStars[facade.selectedLevelType + '_' + this.playingLevel] = this.star, this.saveData()
    }
  },
  setOverVideo: function (e) {
    this.levelVideo || (this.levelVideo = {}), this.levelVideo[facade.selectedLevelType + '_' + e] || (this.levelVideo[facade.selectedLevelType + '_' + e] = e), this.saveData()
  },
  force3Star: function () {
    this.star = 3
    this.levelStars[facade.selectedLevelType + '_' + this.playingLevel] = 3
    this.saveData()
  },
  onSkip: function () {
    this.playingLevel < this[facade.selectedLevelType + 'Level'] || (this[facade.selectedLevelType + 'Level']++, this.star = 0, this.saveData(), cc.systemEvent.emit(ModuleEventEnum.GO_NEXT))
  },
  saveData: function (e) {
    facade.CurrentScene != 'SkipPage' && (this.localCaChe[facade.selectedLevelType + 'Level'] = this[facade.selectedLevelType + 'Level'], this.localCaChe.levelStars = this.levelStars, this.localCaChe.levelVideo = this.levelVideo, facade.isMiniGame && (e || facade.FOR_DEVELOP) ? window.facade.getComponent('GameModel').saveData() : cc.sys.localStorage.setItem('Shooter_LevelData', JSON.stringify(this.localCaChe)))
  },
  onWxShow: function () {},
  onWxHide: function () {
    facade.FOR_DEVELOP || this.saveData(true)
  },
  isCurrentLevelWon: function () {
    return !!(this.levelStars[facade.selectedLevelType + '_' + this.playingLevel] && this.levelStars[facade.selectedLevelType + '_' + this.playingLevel] >= 3)
  },
  getLevelStar: function (e) {
    return this.levelStars ? this.levelStars[e] : 0
  },
  getLevelVideo: function (e) {
    return this.levelVideo ? this.levelVideo[e] : 0
  },
  getTotalStar: function () {
    if (!this.levelStars) return 0
    let e = 0
    for (const t in this.levelStars) e += this.levelStars[t]
    return e
  },
  getStarByLevelType: function (e) {
    if (!this.levelStars) return 0
    let t = 0
    for (const n in this.levelStars) typeof n === 'string' && n.match(e) != null && (t += this.levelStars[n])
    return t
  },
  shotABullet: function () {
    this.shotedBullets++
    cc.systemEvent.emit(ModuleEventEnum.BULLET_SHOTED)
  },
  useABullet: function () {
    this.lastBullets--
    this.oneShotLevel ? this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(this.goToFialure, this))) : (this.oneShotLevel = false, cc.systemEvent.emit(ModuleEventEnum.BULLET_USED))
  },
  goToFialure: function () {
    cc.systemEvent.emit(ModuleEventEnum.LEVEL_SHOT_BULLET_USE)
  }
})
