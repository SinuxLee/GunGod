const i = require('LanguageData')
cc.Class({
  extends: cc.Component,
  editor: {
    executeInEditMode: !0,
    menu: 'i18n/LocalizedLabel'
  },
  properties: {
    dataID: {
      get: function () {
        return this._dataID
      },
      set: function (e) {
        this._dataID !== e && (this._dataID = e, this.updateLabel())
      }
    },
    _dataID: ''
  },
  onLoad: function () {
    i.inst || i.init(), this.fetchRender()
  },
  fetchRender: function () {
    const e = this.getComponent(cc.Label)
    if (e) return this.label = e, void this.updateLabel()
  },
  updateLabel: function () {
    this.label ? i.t(this.dataID) && (this.label.string = i.t(this.dataID)) : cc.error('Failed to update localized label, label component is invalid!')
  }
})
