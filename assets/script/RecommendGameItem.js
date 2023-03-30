const MoreGameManager = require('MoreGameManager')
cc.Class({
  extends: cc.Component,
  properties: {
    iconImg: cc.Sprite,
    name1: cc.Label,
    itemID: 0,
    startC: 0,
    endC: 0,
    count: 0,
    pointImg: cc.Node,
    effcount: 0,
    effStartC: 0,
    effEndC: 0,
    effImg: cc.Sprite
  },
  update: function () {
    this.frameCount || (this.frameCount = 0)
    this.frameCount++
    if (this.frameCount % 5 == 0) {
      if (this.endC > this.startC) {
        var e = this
        if ((n = parseInt(this.count) + parseInt(this.startC)) <= this.endC) {
          var t = this.data.animUrl + n.toString() + '.' + this.type
          cc.loader.load({
            url: t,
            type: 'png'
          }, function (t, n) {
            e.iconImg && n && (e.iconImg.spriteFrame = new cc.SpriteFrame(n))
          }), this.count++
        } else this.count = 1
      }
      if (this.effEndC > this.effStartC) {
        var n
        e = this
        if ((n = parseInt(this.effcount) + parseInt(this.startC)) <= this.effEndC) {
          t = this.data.effectUrl + n.toString() + '.' + this.effType
          cc.loader.load({
            url: t,
            type: 'png'
          }, function (t, n) {
            e.effImg && n && (e.effImg.spriteFrame = new cc.SpriteFrame(n), e.effNode.width = 120, e.effNode.height = 120)
          }), this.effcount++
        } else this.effcount = 1
      }
    }
  },
  setupItemData: function (e) {
    if (e && e.name) {
      this.node.active = true
      this._historyDataArr || (this._historyDataArr = [])
      this._historyDataArr.push(e)
      this._historyDataArr.length >= MoreGameManager.getData().length && (this._historyDataArr = [])
      this.data = JSON.parse(JSON.stringify(e))
      this.appId = this.data.appId
      this.path = this.data.extra

      const t = this
      if (e.icon != '' && e.icon && e.icon.indexOf('http') == 0 && (cc.loader.load({
        url: e.icon,
        type: 'png'
      }, function (e, n) {
        t.iconImg && n && (t.iconImg.spriteFrame = new cc.SpriteFrame(n))
      }), this.startC = this.endC = 0), e.name && this.name1 && (this.name1.string = e.name), e.animation && e.animation != '') {
        const n = e.animation.split(',')
        n.length >= 4 && (this.data.animUrl = n[0], this.startC = n[1], this.endC = n[2], this.type = n[3])
      }
      if (e.effect && e.effect != '') {
        this.effNode || (this.effNode = new cc.Node(), this.effImg = this.effNode.addComponent(cc.Sprite), this.effNode.parent = this.node)
        const o = e.effect.split(',')
        o.length >= 4 && (this.data.effectUrl = o[0], this.effStartC = parseInt(o[1]), this.effEndC = parseInt(o[2]), this.effType = o[3])
      } else this.effNode && (this.effNode.destroy(), this.effNode.parent = null, this.effNode = null, this.data.effectUrl = null, this.effStartC = 0, this.effEndC = 0, this.effType = null)
    } else this.node.active = false
  },
  isInHistory: function (e) {
    for (let t = 0; t < this._historyDataArr.length; t++) { if (e.icon == this._historyDataArr[t].icon) return true }
    return false
  },
  btnGoGameOnClick: function () {
    MoreGameManager.navigateToMiniProgram(this.appId, this.path)
  }
})
