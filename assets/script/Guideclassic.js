const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {},
  start: function () {},
  doClose: function () {
    console.log('doClose...guide'), cc.systemEvent.emit(i.GUIDE_CLOSED)
  },
  update: function (e) {}
})
