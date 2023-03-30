const n = module.exports = {}
const t = module

const i = {
  inited: !1,
  curShowName: '',
  gameInfo: null,
  init: function () {
    this.inited = !0
    const t = require('ModuleEventEnum')
    cc.systemEvent.on(t.MORE_GAME, this.checkVirBanner, this), this.virBannerNode = new cc.Node(), this.virBannerNode.width = 640, this.virBannerNode.height = 300, this.virBannerNode.addComponent(cc.Widget), this.virBannerNode.addComponent(cc.Button), this.virBannerNode.addComponent(cc.Sprite), this.virBannerNode.getComponent(cc.Widget).isAlignBottom = !0
    const n = cc.director.getScene().getChildByName('Canvas')
    const i = new cc.Component.EventHandler()
    i.target = n, i.component = 'MainUI', i.handler = 'onClickBanner', this.virBannerNode.getComponent(cc.Button).clickEvents.push(i), n.addChild(this.virBannerNode), this.virBannerNode.active = !1
  },
  callData: function () {
    facade.getComponent('MoreGameModel').requestMoreGameList()
  },
  checkVirBanner: function () {
    if (this.curShowName && this.curShowName != '') {
      require('ModuleEventEnum')
      console.log('cur UI: ' + this.curShowName + ' need Virbanner')
      const t = facade.getComponent('MoreGameModel').boxList[0]
      let n = []
      for (const i in t) t[i].banner && t[i].banner != '' && n.push(t[i])
      if (n.sort(function (e, t) {
        return e.banner_sort == '' && (e.banner_sort = 0), t.banner_sort == '' && (t.banner_sort = 0), parseInt(e.banner_sort) > parseInt(t.banner_sort) ? -1 : 1
      }), facade.getComponent('PlayerModel').isIconRandomOrder('banner')) {
        const o = facade.getComponent('PlayerModel').getBannerRecommondRandomCount(n)
        o instanceof Array
          ? (o.sort(function (e, t) {
              return 0.5 - Math.random()
            }), n = o, console.log('cur show virBanner : ', n), n.length > 0 && (this.gameInfo = n[0]))
          : (facade.getComponent('PlayerModel').checkItem(n), n.length > 0 ? this.gameInfo = n[0] : this.gameInfo = null)
      }
      this.gameInfo ? this.showVirBanner() : console.log('已经点完所有cpa')
    }
  },
  showVirBanner: function () {
    if (this.gameInfo) {
      this.virBannerNode.active = !0
      const e = this.gameInfo
      e.banner != '' && e.banner && e.banner.indexOf('http') == 0 && cc.loader.load({
        url: e.banner,
        type: 'png'
      }, function (e, t) {
        t && (this.virBannerNode.active = !0, this.virBannerNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t), this.virBannerNode.zIndex = 99999, this.virBannerNode.getComponent(cc.Widget).bottom = 0, this.virBannerNode.getComponent(cc.Widget).updateAlignment())
      }.bind(this))
    }
  },
  hideVirBanner: function () {
    this.curShowName = '', this.virBannerNode && (this.virBannerNode.getComponent(cc.Sprite).spriteFrame = null, this.virBannerNode.zIndex = 1, this.virBannerNode.active = !1), facade.getComponent('BannerModel').hideBanner()
  }
}
t.exports = i
