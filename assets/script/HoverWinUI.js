cc.Class({
  extends: cc.Component,
  properties: {
    backBtn: cc.Node,
    title: cc.Node,
    titleLine: cc.Node,
    showSp1: cc.Node,
    showSp2: cc.Node
  },
  onLoad: function () {
    this.closeActTime = 0.2
  },
  start: function () {
    if (window.wx) {
      const t = require('ModuleEventEnum')
      cc.systemEvent.once(t.UPDATE_HOVER_SHOW, this.onClickBack, this)
      facade.getComponent('PlayerModel').wxAdaptor.reigsterWXFunc(function () {
        facade.getComponent('PlayerModel').wxAdaptor.checkHoverWinShow() && (console.log('aaaaa   check  领奖啦啦啦啦啦啦'), facade.getComponent('GameModel').applyHoverWinReward())
      }, true)
    }
  },
  viewDidAppear: function () {
    this.backBtn.active = true
    this.title.active = true
    this.titleLine.active = true
    this.showSp1.active = true
    this.showSp2.active = true
    const e = cc.moveBy(0.3, cc.v2(0, -200)).easing(cc.easeBackOut())
    this.backBtn.runAction(e)
    const t = cc.moveBy(0.3, cc.v2(-300, 0)).easing(cc.easeBackOut())
    this.title.runAction(t)
    const n = cc.moveBy(0.3, cc.v2(500, 0)).easing(cc.easeBackOut())
    this.titleLine.runAction(n)
    const i = cc.scaleTo(0.3, 0.9).easing(cc.easeBackOut())
    this.count = 1
    this.actId = setInterval(function () {
      this.count != 3 ? (this['showSp' + this.count].runAction(i.clone()), this.count++) : clearInterval(this.actId)
    }.bind(this), 300)
  },
  doClose: function () {
    const e = cc.scaleTo(0.2, 1.1)
    this.title.runAction(e.clone())
    this.titleLine.runAction(e.clone())
    this.backBtn.runAction(e.clone())
    this.showSp1.runAction(e.clone())
    this.showSp2.runAction(e.clone())
  },
  onClickBack: function () {
    popUp.getComponent('Pop').removeByName('HoverWinUI')
  }
})
