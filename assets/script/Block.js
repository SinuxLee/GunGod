const i = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {},
  // 特价9.9元一套cocoscreator代码联系Q2483367084
  // 截图 链接：https://share.weiyun.com/leGAHpnB 密码：b9udtv
  start: function () {},
  onBeginContact: function (e, t, n) {
    t.node.group == 'prop' && n.node.group == 'body' && (cc.v2(t.body._b2Body.m_linearVelocity.x - n.body._b2Body.m_linearVelocity.x, t.body._b2Body.m_linearVelocity.y - -n.body._b2Body.m_linearVelocity.y).mag() > 2 && this.killSuffer(n.node))
  },
  onPreSolve: function (e, t, n) {},
  onPostSolve: function (e, t, n) {},
  killSuffer: function (e) {
    if (!this.suffer || this.suffer != e.parent) {
      this.suffer = e.parent
      const t = cc.instantiate(this.suffer.getChildByName('blood'))
      t.active = !0, t.getComponent(cc.ParticleSystem).resetSystem(), t.parent = e, cc.systemEvent.emit(i.KILLED, this.suffer.name)
    }
  },
  expolosiveAnimate: function () {},
  update: function (e) {}
})
