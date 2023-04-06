cc.Class({
  extends: cc.Component,

  start () {
    this._soundActive = true
    this.isPlayingBgm = false
    this._effectSources = {}
    this._currentMusicVolume = 100
    this._loadEffectWaits = []
  },

  playEffect (name, loop = false, val = 100) {
    const path = 'audio/' + name + '.mp3'
    if (this._effectSources[path] == null) {
      if (this._soundActive) {
        this._loadEffectWaits.push({
          file: path,
          isLoop: loop,
          volume: val
        })
      }
    } else {
      this._currentVolume = val
      this._effectSources[path] = cc.audioEngine.play(cc.loader.getRes(path), loop, this._currentVolume / 100)
    }
  },

  loadBGMResCallBack (e, t) {
    cc.audioEngine.stop(this.bgmId)
    this.bgmId = cc.audioEngine.play(t, true, this._currentMusicVolume / 300)
  },

  loadEffectResCallBack (e, t) {
    this._isLoading = false
    this._effectSources[this._currentFile] = cc.audioEngine.play(t, false, this._currentVolume / 100)
  },

  stopEffect (name) {
    const path = 'audio/' + name + '.mp3'
    cc.audioEngine.stop(this._effectSources[path])
  },

  stopAllEffects () {
    for (const name in this._effectSources) {
      cc.audioEngine.stop(this._effectSources[name])
      cc.audioEngine.uncache(name)
      delete this._effectSources[name]
    }
    this._effectSources = {}
  },

  setBGM (name) {
    this._currentBGMKey = name
    if (this._soundActive) {
      if (this._currentBGM == name) return void this.resumeBGM()

      const path = 'audio/' + name
      if (this._currentBGM == path) return void this.resumeBGM()

      this._currentBGM = path
      cc.loader.loadRes(path, this.loadBGMResCallBack.bind(this))
      this.isPlayingBgm = true
    }
  },

  playBGM () {},

  resumeBGM () {
    if (this._soundActive && this.bgmId != null) {
      this.isPlayingBgm = true
      cc.audioEngine.resume(this.bgmId)
      return true
    }

    return false
  },

  pauseBGM () {
    this.isPlayingBgm = false
    cc.audioEngine.pause(this.bgmId)
  },

  stopBGM () {
    this.isPlayingBgm = false
    cc.audioEngine.stop(this.bgmId)
    cc.audioEngine.uncache(this._currentBGM)
    this.bgmId = null
  },

  setBGMVolume (vol) {
    this._currentMusicVolume = vol
  },

  stopAllSound () {
    this.stopAllEffects()
  },

  update (e) {
    if (this._loadEffectWaits.length != 0 && this._isLoading != 1) {
      const t = this._loadEffectWaits.shift()
      this._currentFile = t.file
      this._currentLoop = t.isLoop
      this._currentVolume = t.volume
      cc.loader.loadRes(this._currentFile, this.loadEffectResCallBack.bind(this))
      this._isLoading = true
    }
  },

  setSoundEnabled (isActive) {
    this._soundActive = isActive
    if (isActive) {
      if (!this.resumeBGM()) {
        if (this._currentBGMKey) this.setBGM(this._currentBGMKey)
        else if (window.facade.CurrentScene == 'Game') {
          this._currentBGM = null
          this.setBGM('Bgm')
        }
      }
    } else {
      this.pauseBGM()
      this.stopAllEffects()
    }
  }
})
