const ModuleEventEnum = require('ModuleEventEnum')
const o = require('AnalyticsUtilities').AnalyticsUtilities

cc.Class({
  extends: cc.Component,

  onLoad: function () {
    cc.loader.loadRes('roles', cc.SpriteAtlas)
    cc.systemEvent.on(ModuleEventEnum.GO_LEVEL, this.onGoLevel, this)
    cc.systemEvent.on(ModuleEventEnum.RELOAD_LEVEL, this.onReloadLevel, this)
    cc.systemEvent.on(ModuleEventEnum.GO_NEXT, this.onGoNext, this)
    cc.systemEvent.on(ModuleEventEnum.GO_SHOT_NEXT, this.onGoShotNext, this)
    cc.systemEvent.on(ModuleEventEnum.LEVEL_ONE_SHOT_GO, this.shotLoadLevel, this)
  },

  onGoLevel: function (e) {
    console.log('onGoLevel:', e)
    let t = facade.selectedLevelType
    t == 'classic' && (t = 'level'), this.loadLevel(t + '_' + e)
  },
  shotLoadLevel: function (e) {
    if (!this.inLoading && !this.node.getChildByName('levelPlay')) {
      window.audio.getComponent('SoundManager').pauseBGM('Bgm')
      window.facade.getComponent('Facade').levelPassed = false
      this.levelType = e.split('_')[0]
      this._levelPre = cc.loader.getRes('levels/' + e.toLowerCase(), cc.Prefab)

      if (this._levelPre) {
        this.level = cc.instantiate(this._levelPre)
        this.level.position = cc.v2()
        this.level.name = 'levelPlay'
        this.node.addChild(this.level, 100)
        this.changeShotSkins()
        this.changeShotBg()
        this.generateLevelData()
        cc.systemEvent.emit(ModuleEventEnum.LEVEL_ONE_SHOT_ADD, this.levelData)
        return
      }

      this.inLoading = true
      cc.loader.loadRes('levels/' + e.toLowerCase(), cc.Prefab, this.onShotLoaded.bind(this))
    }
  },

  onShotLoaded: function (e, t) {
    this.inLoading = false
    console.log('onLoaded...', t)
    this._levelPre = t
    this.level = cc.instantiate(this._levelPre)
    this.level.position = cc.v2()
    this.level.name = 'levelPlay'
    this.node.addChild(this.level, 100)
    this.changeShotSkins()
    this.changeShotBg()
    this.generateLevelData()
    cc.systemEvent.emit(ModuleEventEnum.LEVEL_ONE_SHOT_ADD, this.levelData)
  },

  loadLevel: function (e) {
    let t = e.split('_')[0]
    t == 'level' && (t = 'classic')
    facade.selectedLevelType = t
    if (!this.inLoading && !this.node.getChildByName('levelPlay')) {
      window.audio.getComponent('SoundManager').pauseBGM('Bgm')
      window.facade.getComponent('Facade').levelPassed = false
      this.levelType = e.split('_')[0]
      this._levelPre = cc.loader.getRes('levels/' + e.toLowerCase(), cc.Prefab)

      if (this._levelPre) {
        this.level = cc.instantiate(this._levelPre)
        this.level.position = cc.v2()
        this.level.name = 'levelPlay'
        this.node.addChild(this.level, 2)
        this.changeSkins()
        this.changeBg()
        this.generateLevelData()
        cc.systemEvent.emit(ModuleEventEnum.LEVEL_ADDED, this.levelData)
        return
      }

      this.inLoading = true
      cc.loader.loadRes('levels/' + e.toLowerCase(), cc.Prefab, this.onLoaded.bind(this))
      o.logEvent('进入游戏界面')
    }
  },
  onLoaded: function (e, t) {
    this.inLoading = false
    console.log('onLoaded...', t)
    this._levelPre = t
    this.level = cc.instantiate(this._levelPre)
    this.level.position = cc.v2()
    this.level.name = 'levelPlay'
    this.node.addChild(this.level, 2)
    this.changeSkins()
    this.changeBg()
    this.generateLevelData()
    cc.systemEvent.emit(ModuleEventEnum.LEVEL_ADDED, this.levelData)
  },
  generateLevelData: function () {
    this.levelData = {}
    this.levelData.levelType = this.levelType
    this.levelData.isDebug = this.isDebug
    this.levelData.node = this.level
  },
  changeSkins: function () {
    if (window.facade.getComponent('LevelModel').playingLevelConfig) {
      const e = this.level.getChildren()
      const t = cc.loader.getRes('roles', cc.SpriteAtlas)
      for (let n = 0; n < e.length; n++) {
        if (e[n].name.match('suffer') != null) {
          const i = window.facade.getComponent('LevelModel').playingLevelConfig.Enemy
          const o = e[n].getChildren()
          for (let a = 0; a < o.length; a++) {
            if (o[a].name != 'blood') {
              o[a].getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
              o[a].getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame(i + '_' + o[a].name)
            } else {
              var s = cc.Color.BLACK
              o[a].getComponent(cc.ParticleSystem).startColor = s.fromHEX('#94F8F0')
              o[a].getComponent(cc.ParticleSystem).endColor = s.fromHEX('#94F8F0')
            }
          }
        } else if (e[n].name == 'role') {
          if (this.levelType == 'injury') {
            var c = e[n].getChildByName('blood')
            s = cc.Color.BLACK
            c.getComponent(cc.ParticleSystem).startColor = s.fromHEX('#94F8F0')
            c.getComponent(cc.ParticleSystem).endColor = s.fromHEX('#94F8F0')
            this.changeRoleSkin2(e[n])
          } else this.changeRoleSkin1(e[n])
          e[n].zIndex = 9999
        } else if (e[n].name.match('vip') != null) {
          c = e[n].getChildByName('blood'), s = cc.Color.BLACK
          c.getComponent(cc.ParticleSystem).startColor = s.fromHEX('#94F8F0')
          c.getComponent(cc.ParticleSystem).endColor = s.fromHEX('#94F8F0')
        }
      }
    }
  },
  changeShotSkins: function () {
    if (window.facade.getComponent('LevelModel').nowLevelConfig) {
      for (let e = this.level.getChildren(), t = cc.loader.getRes('roles', cc.SpriteAtlas), n = 0; n < e.length; n++) {
        if (e[n].name.match('suffer') != null) {
          const i = window.facade.getComponent('LevelModel').nowLevelConfig.Enemy
          const o = e[n].getChildren()
          for (let a = 0; a < o.length; a++) {
            if (o[a].name != 'blood') {
              o[a].getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
              o[a].getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame(i + '_' + o[a].name)
            } else {
              var s = cc.Color.BLACK
              o[a].getComponent(cc.ParticleSystem).startColor = s.fromHEX('#94F8F0')
              o[a].getComponent(cc.ParticleSystem).endColor = s.fromHEX('#94F8F0')
            }
          }
        } else if (e[n].name == 'role') {
          if (this.levelType == 'injury') {
            var c = e[n].getChildByName('blood')
            s = cc.Color.BLACK
            c.getComponent(cc.ParticleSystem).startColor = s.fromHEX('#94F8F0')
            c.getComponent(cc.ParticleSystem).endColor = s.fromHEX('#94F8F0')
            this.changeRoleSkin2(e[n])
          } else this.changeRoleSkin1(e[n])
          e[n].zIndex = 9999
        } else if (e[n].name.match('vip') != null) {
          c = e[n].getChildByName('blood'), s = cc.Color.BLACK
          c.getComponent(cc.ParticleSystem).startColor = s.fromHEX('#94F8F0')
          c.getComponent(cc.ParticleSystem).endColor = s.fromHEX('#94F8F0')
        }
      }
    }
  },
  changeRoleSkin1: function (e) {
    const t = window.facade.getComponent('GameModel').characterId
    const n = cc.loader.getRes('roles', cc.SpriteAtlas)
    e.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
    e.getChildByName('handGun').getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
    e.getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame('MrBullet_Role_Body_0' + t)
    e.getChildByName('handGun').getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame('MrBullet_Role_AimArm_0' + t)
    e.getChildByName('handGun').x = -26
    e.getChildByName('handGun').y = 19
  },
  changeRoleSkin2: function (e) {
    const t = window.facade.getComponent('GameModel').characterId
    const n = cc.loader.getRes('roles', cc.SpriteAtlas)
    const i = e.getChildren()
    for (let o = 0; o < i.length; o++) {
      const a = i[o]
      a.getComponent(cc.Sprite) ? a.getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame('Role_0' + t + '_' + a.name) : a.getChildByName('skin') && (a.getChildByName('skin').getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED, a.getChildByName('skin').getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame('Role_0' + t + '_' + a.name)), a.getChildByName('handGun') && (a.getChildByName('handGun').getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame('MrBullet_Role_AimArm_0' + t))
    }
  },
  changeBg: function () {
    window.facade.getComponent('LevelModel').playingLevelConfig && (this.bgSkinUrl = 'scene/' + window.facade.getComponent('LevelModel').playingLevelConfig.BgImage + '.jpg', this.bg = this.level.getChildByName('bg'), cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame) ? (this.bg.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame), cc.director.getScene().getChildByName('Canvas').getChildByName('bg').getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame)) : cc.loader.loadRes(this.bgSkinUrl, cc.SpriteFrame, this.onSkinLoaded.bind(this)))
  },
  onSkinLoaded: function (e, t) {
    this.bg.spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame)
    cc.director.getScene().getChildByName('Canvas').getChildByName('bg').getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame)
  },
  changeShotBg: function () {
    window.facade.getComponent('LevelModel').nowLevelConfig && (this.bgSkinUrl = 'scene/' + window.facade.getComponent('LevelModel').nowLevelConfig.BgImage + '.jpg', this.bg = this.level.getChildByName('bg'), cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame) ? (this.bg.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame), cc.director.getScene().getChildByName('Canvas').getChildByName('bg').getComponent(cc.Sprite).spriteFrame = cc.loader.getRes(this.bgSkinUrl, cc.SpriteFrame)) : cc.loader.loadRes(this.bgSkinUrl, cc.SpriteFrame, this.onSkinLoaded.bind(this)))
  },
  onLevelPassed: function (e) {
    console.log('onLevelPassed...', e)
    window.facade.getComponent('Facade').levelPassed = true
    setTimeout(this.changeLevel.bind(this), 5e3)
  },
  onGoNext: function () {
    window.facade.getComponent('LevelModel').playingLevel++
    window.facade.getComponent('Facade').levelPassed = true
    this.level.removeFromParent()
    cc.systemEvent.emit(ModuleEventEnum.GO_LEVEL, window.facade.getComponent('LevelModel').playingLevel)
  },
  onGoShotNext: function () {
    this.level.removeFromParent()
    window.facade.getComponent('LevelModel').initShotData()
  },
  onReloadLevel: function () {
    this.level.removeFromParent()
    cc.systemEvent.emit(ModuleEventEnum.GO_LEVEL, window.facade.getComponent('LevelModel').playingLevel)
  },
  changeLevel: function () {
    this.levelId++, this.levelId > 10 || (this.level.removeFromParent(), this.loadLevel('level_' + this.levelId))
  }
})
