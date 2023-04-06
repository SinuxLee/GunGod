cc.Class({
  extends: cc.Component,
  properties: {
    skinOn: cc.SpriteFrame,
    skinOff: cc.SpriteFrame
  },

  onLoad () {
    this._soundSwitch = true
    const e = cc.sys.localStorage.getItem('Shooter_Sound')
    this._soundSwitch = !e || e == 'true'
    this.updateStatus()
  },

  trigger () {
    if (facade.FOR_DEVELOP) {
      const e = {
        game_id: window.facade.GameId,
        token: window.facade.getComponent('PlayerModel').token,
        record_type: 2,
        record: '{}'
      }
      window.net.getComponent('Net').httpRequest(window.net.SaveRecord, e)

      const t = {
        game_id: window.facade.GameId,
        token: window.facade.getComponent('PlayerModel').token,
        record_type: 1,
        record: '{}'
      }
      window.net.getComponent('Net').httpRequest(window.net.SaveRecord, t)

      const n = {
        game_id: window.facade.GameId,
        token: window.facade.getComponent('PlayerModel').token,
        record_type: 3,
        record: '{}'
      }
      window.net.getComponent('Net').httpRequest(window.net.SaveRecord, n)
    }

    this._soundSwitch = !this._soundSwitch
    this.updateStatus()

    cc.sys.localStorage.setItem('Shooter_Sound', this._soundSwitch ? 'true' : 'false')
  },

  updateStatus () {
    audio.getComponent('SoundManager').setSoundEnabled(this._soundSwitch)
  },

  update (e) {
    this.node.getComponent(cc.Sprite).spriteFrame = this._soundSwitch ? this.skinOn : this.skinOff
  }
})
