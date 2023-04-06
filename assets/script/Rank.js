const ModuleEventEnum = require('ModuleEventEnum')
cc.Class({
  extends: cc.Component,
  properties: {
    scroll: cc.Node,
    content: cc.Node,
    recommendPre: cc.Prefab
  },

  onLoad () {
    const e = this
    this.frameCount = 0
    if (facade.isMiniGame) {
      window.facade.getComponent('PlayerModel').wxAdaptor.wxGetUserInfo()
      cc.systemEvent.on(ModuleEventEnum.USER_INFO_ALLOWED, function () {
        const e = facade.getComponent('PlayerModel').platUserInfo
        const t = {
          channel: 'wx',
          appId: 'wxf88c93d96e079e42',
          openid: window.facade.getComponent('PlayerModel').userId,
          nickName: e.nickName,
          image: e.avatarUrl,
          score: window.facade.getComponent('LevelModel').getTotalStar()
        }
        facade.getComponent('GameModel').postRequest('https://games.qdos.com/game/commit/score', 'p=' + JSON.stringify(t), {
          success: function (e) {
            console.error(e)
          }
        })
      })
      const t = {
        appId: 'wxf88c93d96e079e42',
        openid: window.facade.getComponent('PlayerModel').userId
      }
      facade.getComponent('GameModel').postRequest('https://games.qdos.com/game/update/rank', 'p=' + JSON.stringify(t), {
        success: function (t) {
          for (var n = [], i = 0; i < t.length; i++) {
            n.push({
              avatar: t[i].image,
              nick_name: t[i].nickName,
              best_score: t[i].score
            })
          }
          e.gotRank(n)
        }
      })
    }
  },

  onEnable () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1e4
  },

  onDisable () {
    cc.director.getScene().getChildByName('Canvas').getChildByName('recommendBar').zIndex = 1
  },

  initData (e) {
    window.facade.getComponent('GameModel').setOpenRankfFlag(2)
  },

  start () {
    window.facade.getComponent('RankModel').requestRankList(1)
  },

  doClose () {
    cc.systemEvent.off(ModuleEventEnum.RANK_LIST, this.gotRank, this)
  },

  gotRank (e) {
    for (let t = 0; t < e.length; t++) e[t].rankNo = t + 1
    this.scroll.getComponent('ListViewCtrl').setList(e, false, null)
  },

  close () {
    window.popUp.getComponent('Pop').removeTop()
  },

  jumpTadayRank () {
    window.popUp.getComponent('Pop').removeTop()
    window.popUp.getComponent('Pop').addPopByName('GunMasterRank', this, true, true, false)
  },

  setupList: function (e) {}
})
