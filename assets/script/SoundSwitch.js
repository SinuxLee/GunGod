cc.Class({
  extends: cc.Component,
  properties: {
    skinOn: cc.SpriteFrame,
    skinOff: cc.SpriteFrame
  },
  onLoad: function () {
    this._soundSwitch = !0
    const e = cc.sys.localStorage.getItem('Shooter_Sound')
    this._soundSwitch = !e || e == 'true', this.updateStatus()
  },
  start: function () {},
  trigger: function () {
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
    this._soundSwitch = !this._soundSwitch, this.updateStatus()
    const i = this._soundSwitch ? 'true' : 'false'
    cc.sys.localStorage.setItem('Shooter_Sound', i)
  },
  updateStatus: function () {
    audio.getComponent('SoundManager').setSoundEnabled(this._soundSwitch)
  },
  update: function (e) {
    this.node.getComponent(cc.Sprite).spriteFrame = this._soundSwitch ? this.skinOn : this.skinOff
  }
})
