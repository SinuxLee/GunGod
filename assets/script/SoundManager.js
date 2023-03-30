cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {},
  start: function () {
    this._soundActive = !0, this.isPlayingBgm = !1, this._effectSources = {}, this._currentMusicVolume = 100, this._loadEffectWaits = []
  },
  playEffect: function (e, t, n) {
    t || (t = !1), n || (n = 100)
    const i = 'audio/' + e + '.mp3'
    if (this._effectSources[i] == null) {
      if (this._soundActive) {
        const o = {}
        o.file = i, o.isLoop = t, o.volume = n, this._loadEffectWaits.push(o)
      }
    } else {
      this._currentVolume = n
      const a = cc.audioEngine.play(cc.loader.getRes(i), t, this._currentVolume / 100)
      this._effectSources[i] = a
    }
  },
  loadBGMResCallBack: function (e, t) {
    cc.audioEngine.stop(this.bgmId), this.bgmId = cc.audioEngine.play(t, !0, this._currentMusicVolume / 300)
  },
  loadEffectResCallBack: function (e, t) {
    this._isLoading = !1
    const n = cc.audioEngine.play(t, !1, this._currentVolume / 100)
    this._effectSources[this._currentFile] = n
  },
  stopEffect: function (e) {
    const t = 'audio/' + e + '.mp3'
    cc.audioEngine.stop(this._effectSources[t])
  },
  stopAllEffects: function () {
    for (const e in this._effectSources) cc.audioEngine.stop(this._effectSources[e]), cc.audioEngine.uncache(e), delete this._effectSources[e]
    this._effectSources = {}
  },
  setBGM: function (e) {
    if (this._currentBGMKey = e, this._soundActive) {
      if (this._currentBGM == e) return void this.resumeBGM()
      const t = 'audio/' + e + '.mp3'
      if (this._currentBGM == t) return void this.resumeBGM()
      this._currentBGM = t, cc.loader.loadRes(t, this.loadBGMResCallBack.bind(this)), this.isPlayingBgm = !0
    }
  },
  playBGM: function () {},
  resumeBGM: function () {
    if (this._soundActive) return this.bgmId != null && (this.isPlayingBgm = !0, cc.audioEngine.resume(this.bgmId), !0)
  },
  pauseBGM: function () {
    this.isPlayingBgm = !1, cc.audioEngine.pause(this.bgmId)
  },
  stopBGM: function () {
    this.isPlayingBgm = !1, cc.audioEngine.stop(this.bgmId), cc.audioEngine.uncache(this._currentBGM), this.bgmId = null
  },
  setBGMVolume: function (e) {
    this._currentMusicVolume = e
  },
  stopAllSound: function () {
    this.stopAllEffects()
  },
  update: function (e) {
    if (this._loadEffectWaits.length != 0 && this._isLoading != 1) {
      const t = this._loadEffectWaits.shift()
      this._currentFile = t.file, this._currentLoop = t.isLoop, this._currentVolume = t.volume, cc.loader.loadRes(this._currentFile, this.loadEffectResCallBack.bind(this)), this._isLoading = !0
    }
  },
  setSoundEnabled: function (e) {
    this._soundActive = e, e ? this.resumeBGM() || (this._currentBGMKey ? this.setBGM(this._currentBGMKey) : window.facade.CurrentScene == 'Game' && (this._currentBGM = null, this.setBGM('Bgm'))) : (this.pauseBGM(), this.stopAllEffects())
  }
})
