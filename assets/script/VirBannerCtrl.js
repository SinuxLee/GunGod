module.exports = {
  inited: false,
  curShowName: '',
  gameInfo: null,

  init () {
    this.inited = true
    const ModuleEventEnum = require('ModuleEventEnum')
    cc.systemEvent.on(ModuleEventEnum.MORE_GAME, this.checkVirBanner, this)

    this.virBannerNode = new cc.Node()
    this.virBannerNode.width = 640
    this.virBannerNode.height = 300
    this.virBannerNode.addComponent(cc.Widget)
    this.virBannerNode.addComponent(cc.Button)
    this.virBannerNode.addComponent(cc.Sprite)
    this.virBannerNode.getComponent(cc.Widget).isAlignBottom = true

    const cvsNode = cc.director.getScene().getChildByName('Canvas')
    const event = new cc.Component.EventHandler()
    event.target = cvsNode
    event.component = 'MainUI'
    event.handler = 'onClickBanner'
    this.virBannerNode.getComponent(cc.Button).clickEvents.push(event)

    cvsNode.addChild(this.virBannerNode)
    this.virBannerNode.active = false
  },

  callData () {
    facade.getComponent('MoreGameModel').requestMoreGameList()
  },

  checkVirBanner () {
    if (this.curShowName && this.curShowName != '') {
      console.log('cur UI: ' + this.curShowName + ' need Virbanner')
      const box = facade.getComponent('MoreGameModel').boxList[0]
      let bannerArr = []
      for (const i in box) box[i].banner && box[i].banner != '' && bannerArr.push(box[i])
      bannerArr.sort((e, t) => {
        e.banner_sort == '' && (e.banner_sort = 0)
        t.banner_sort == '' && (t.banner_sort = 0)
        return parseInt(e.banner_sort) > parseInt(t.banner_sort) ? -1 : 1
      })

      if (facade.getComponent('PlayerModel').isIconRandomOrder('banner')) {
        const o = facade.getComponent('PlayerModel').getBannerRecommondRandomCount(bannerArr)
        o instanceof Array
          ? (o.sort(function (e, t) {
              return 0.5 - Math.random()
            }), bannerArr = o, console.log('cur show virBanner : ', bannerArr), bannerArr.length > 0 && (this.gameInfo = bannerArr[0]))
          : (facade.getComponent('PlayerModel').checkItem(bannerArr), bannerArr.length > 0 ? this.gameInfo = bannerArr[0] : this.gameInfo = null)
      }
      this.gameInfo ? this.showVirBanner() : console.log('已经点完所有cpa')
    }
  },

  showVirBanner () {
    if (this.gameInfo) {
      this.virBannerNode.active = true
      const info = this.gameInfo

      if (info.banner != '' && info.banner && info.banner.indexOf('http') == 0) {
        cc.loader.load({ url: info.banner, type: 'png' }, (e, asset) => {
          if (asset) {
            this.virBannerNode.active = true
            this.virBannerNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(asset)
            this.virBannerNode.zIndex = 99999
            this.virBannerNode.getComponent(cc.Widget).bottom = 0
            this.virBannerNode.getComponent(cc.Widget).updateAlignment()
          }
        })
      }
    }
  },

  hideVirBanner () {
    this.curShowName = ''
    if (this.virBannerNode) {
      this.virBannerNode.getComponent(cc.Sprite).spriteFrame = null
      this.virBannerNode.zIndex = 1
      this.virBannerNode.active = false
    }
    facade.getComponent('BannerModel').hideBanner()
  }
}
