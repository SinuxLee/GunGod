const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,

  doClose: function () {
    console.log('doClose...guide')
    cc.systemEvent.emit(ModuleEventEnum.GUIDE_CLOSED)
  }
})
