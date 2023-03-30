const MathUtils = require('MathUtils')

cc.Class({
  extends: cc.Component,

  onLoad: function () {
    this.inDragging = false
  },

  initData: function () {
    this.track = this.node.getComponent('CarOperations').track
    this.track.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.track.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.track.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    this.track.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
  },

  releaseData: function () {
    this.track.off(cc.Node.EventType.TOUCH_START)
    this.track.off(cc.Node.EventType.TOUCH_MOVE)
    this.track.off(cc.Node.EventType.TOUCH_END)
    this.track.off(cc.Node.EventType.TOUCH_CANCEL)
    this.track = null
    this.rangePoints = null
  },

  onTouchStart: function (e) {
    const t = e.getLocation()
    this._startTouchPos = t
    const n = this.pickACar(t)
    n && (n.park.getComponent('ParkCarJS').getParkStatus() == facade.CAR_GIFT || n.park.getComponent('ParkCarJS').carUId && n.park.getComponent('ParkCarJS').carUId != '' && n.park.getComponent('ParkCarJS').getParkStatus() != facade.CAR_ANIMATION) ? this._selectPark = n : this._selectPark = null
  },

  onTouchMove: function (e) {
    const t = e.getLocation()
    if (this._selectPark && this._selectPark.park.getComponent('ParkCarJS').getParkStatus() != facade.CAR_RACING && this._selectPark.park.getComponent('ParkCarJS').getParkStatus() != facade.CAR_GIFT) {
      if (this.inDragging) {
        const n = this.node.getComponent('CarOperations').parkField.parent.convertToNodeSpaceAR(t)
        this.dragOne.x = n.x
        this.dragOne.y = n.y
      } else cc.pDistance(this._startTouchPos, t) >= 20 && this.startDrag()
    }
  },

  onTouchEnd: function (e) {
    if (this._selectPark) {
      const t = this._selectPark.park.getComponent('ParkCarJS')
      if (!t.isMainPark || t.carState != 1) {
        const n = this.node.getComponent('CarOperations').parkField
        const i = this.node.getComponent('CarOperations').parks
        const o = e.getLocation()
        const a = facade.getComponent('GameModel')
        if (this._selectPark.park.getComponent('ParkCarJS').getParkStatus() == facade.CAR_GIFT && cc.pDistance(this._startTouchPos, o) < 20) {
          var s = facade.getComponent('UserModel').roleInfo.curSceneId
          a.openCarGift(this._selectPark.index, s)
        }
        if (this._selectPark.park.getComponent('ParkCarJS').getParkStatus() == facade.CAR_RACING && cc.pDistance(this._startTouchPos, o) < 20) this.node.getComponent('CarOperations').rePark(this._selectPark.index, this._selectPark.park)
        else if (this.inDragging) {
          const c = facade.getComponent('GuideModel')
          const r = window.facade.getComponent('UserModel').roleInfo.signinCount
          if (!this.inFieldRange(o)) return r == 1 && c.curStep <= window.facade.GUIDE_COMPOSE ? void this.dragCancel() : a.isLaneLimited() ? a.hasLowerCarOnRacing(this._selectPark.park.getComponent('ParkCarJS').carUId) ? (this.node.getComponent('CarOperations').switchTrack(this._selectPark.index, this._selectPark.park, o), void this.dragEnd()) : (window.popUp.getComponent('FloatTip').showTip('赛道已经太拥挤啦！'), void this.dragCancel()) : (this.node.getComponent('CarOperations').toTrack(this._selectPark.index, this._selectPark.park, o), void this.dragEnd())
          const l = this.node.getComponent('GameMainJS').recycleNode.convertToWorldSpaceAR(cc.Vec2(0, 0))
          if (cc.pDistance(l, o) < this.node.getComponent('GameMainJS').recycleNode.width / 2) return this.node.getComponent('CarOperations').recycle(this._selectPark.index, this._selectPark.park), void this.dragEnd()
          if (r == 1 && c.curStep == window.facade.GUIDE_MOVETO_TRACK) return void this.dragCancel()
          for (let d = 0; d < i.length; d++) {
            const h = i[d].convertToWorldSpaceAR(cc.Vec2(0, 0))
            if (cc.pDistance(h, o) <= i[d].width * n.scaleX / 2 && i[d] != this._selectPark.park) {
              if (i[d].getComponent('ParkCarJS').getParkStatus() == facade.CAR_RACING || i[d].getComponent('ParkCarJS').getParkStatus() == facade.CAR_ANIMATION || i[d].getComponent('ParkCarJS').getParkStatus() == facade.CAR_GIFT) break
              a.getBestCarId()
              if (i[d].getComponent('ParkCarJS').carId == this._selectPark.park.getComponent('ParkCarJS').carId) {
                if (a.getBestCarId() != this._selectPark.park.getComponent('ParkCarJS').carId) {
                  s = facade.getComponent('UserModel').roleInfo.curSceneId
                  a._mergeTarget = {
                    mapId: s,
                    posId: i[d].getComponent('ParkCarJS').parkIndex
                  }, this.node.getComponent('CarOperations').mergeCar(d, this._selectPark.index, i[d], this._selectPark.park), this.dragRelease()
                } else this.dragCancel()
              } else i[d].getComponent('ParkCarJS').carId != null && i[d].getComponent('ParkCarJS').carId != '' ? (this.node.getComponent('CarOperations').switchPark(d, this._selectPark.index, i[d], this._selectPark.park), this.dragEnd()) : (this.node.getComponent('CarOperations').movePark(d, this._selectPark.index, i[d], this._selectPark.park), this.dragEnd())
              return
            }
          }
          this.dragCancel()
        }
      }
    }
  },
  onTouchCancel: function (e) {
    this.onTouchEnd(e)
  },
  pickACar: function (e) {
    for (let t = this.node.getComponent('CarOperations').parks, n = this.node.getComponent('CarOperations').parkField, i = 0; i < t.length; i++) {
      const o = t[i].convertToWorldSpaceAR(cc.Vec2(0, 0))
      if (cc.pDistance(o, e) <= t[i].width * n.scaleX / 2) {
        return {
          park: t[i],
          index: i
        }
      }
    }
    return null
  },
  startDrag: function () {
    if (this._selectPark.park.getComponent('ParkCarJS').carUId && this._selectPark.park.getComponent('ParkCarJS').carUId != '') {
      this.node.getComponent('GameMainJS').disableBuy(), this.inDragging = true
      const e = window.facade.getComponent('GameModel').getCarLevelById(this._selectPark.park.getComponent('ParkCarJS').carId)
      this.dragOne = this.node.getComponent('CarOperations').createMoveCar(e)
      const t = this._selectPark.park.convertToNodeSpaceAR(this._startTouchPos)
      this.dragOne.x = t.x, this.dragOne.y = t.y
      const n = this._selectPark.park.getComponent('ParkCarJS')
      n.isMainPark && this.dragOne.getComponent(cc.Sprite)._sgNode.setState(n.carState), this._selectPark.park.getComponent('ParkCarJS').setCarGray(true), this.node.getComponent('CarOperations').showMergeNote(this._selectPark.park.getComponent('ParkCarJS'))
    }
  },
  startComposeGuide: function () {
    const e = window.facade.getComponent('GuideModel')
    if (window.facade.getComponent('UserModel').roleInfo.signinCount == 1 && e.curStep == window.facade.GUIDE_COMPOSE) {
      this._selectPark && this.inDragging && (this.dragCancel(), this._selectPark = null), this.dragOne && (this.dragOne.removeFromParent(), this.dragOne = null), this.inDragging = true
      const t = this.node.getComponent('CarOperations').parks
      this._selectPark = {
        park: t[0],
        index: 0
      }, this.dragOne = this.node.getComponent('CarOperations').createMoveCar(1), this._selectPark.park.getComponent('ParkCarJS').setCarGray(true)
      let n = this._selectPark.park.convertToWorldSpaceAR(cc.v2(0, 0))
      n = this.dragOne.parent.convertToNodeSpaceAR(n), this.dragOne.x = n.x, this.dragOne.y = n.y, this.node.getComponent('CarOperations').showMergeNote(this._selectPark.park.getComponent('ParkCarJS'))
      let i = t[1].convertToWorldSpaceAR(cc.v2(0, 0))
      i = this.dragOne.parent.convertToNodeSpaceAR(i)
      const o = cc.sequence(cc.moveTo(0.8, i), cc.callFunc(function () {
        this.node.getComponent('CarOperations').mergeCar(1, this._selectPark.index, t[1], this._selectPark.park), this.dragRelease(), this.endGuide()
      }.bind(this)))
      this.dragOne.runAction(o)
    }
  },
  startMovetoTarckGuide: function () {
    const e = window.facade.getComponent('GuideModel')
    if (window.facade.getComponent('UserModel').roleInfo.signinCount == 1 && e.curStep == window.facade.GUIDE_MOVETO_TRACK) {
      this._selectPark && this.inDragging && (this.dragCancel(), this._selectPark = null), this.dragOne && (this.dragOne.removeFromParent(), this.dragOne = null), this.inDragging = true
      const t = this.node.getComponent('CarOperations').parks
      this._selectPark = {
        park: t[1],
        index: 1
      }, this._selectPark.park.getComponent('ParkCarJS').setCarGray(true)
      const n = window.facade.getComponent('GameModel').getCarLevelById(this._selectPark.park.getComponent('ParkCarJS').carId)
      this.dragOne = this.node.getComponent('CarOperations').createMoveCar(n)
      const i = this.dragOne.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2(287, 0))).x
      const o = this.dragOne.parent.convertToNodeSpaceAR(t[1].convertToWorldSpaceAR(cc.v2(0, 0))).y
      let a = t[1].convertToWorldSpaceAR(cc.v2(0, 0))
      a = this.dragOne.parent.convertToNodeSpaceAR(a), this.dragOne.position = a
      const s = cc.sequence(cc.moveTo(0.8, cc.v2(i, o)), cc.callFunc(function () {
        this.node.getComponent('CarOperations').toTrack(this._selectPark.index, this._selectPark.park, cc.v2(i, o)), this.dragEnd(), this.endGuide()
      }.bind(this)))
      this.dragOne.runAction(s)
    }
  },
  endGuide: function () {
    this.inDragging = false, this.dragOne = null, this._selectPark = null, this.node.getComponent('CarOperations').hideMergeNote()
  },
  dragCancel: function () {
    this.node.getComponent('CarOperations').hideMergeNote()
    const e = this.node.getComponent('CarOperations').parkField.parent.convertToNodeSpaceAR(this._startTouchPos)
    this.dragOne && this.dragOne.runAction(cc.sequence(cc.moveTo(0.2, e), cc.callFunc(this.dragCancelDeal, this)))
  },
  dragCancelDeal: function () {
    this.node.getComponent('GameMainJS').enableBuy(), this._selectPark.park.getComponent('ParkCarJS').setCarGray(false), this.dragOne.removeFromParent(), this.dragOne = null, this.inDragging = false
  },
  dragEnd: function () {
    this.node.getComponent('CarOperations').hideMergeNote(), this.node.getComponent('GameMainJS').enableBuy(), this._selectPark.park.getComponent('ParkCarJS').setCarGray(false), this.dragOne.removeFromParent(), this.dragOne = null, this.inDragging = false
  },
  dragRelease: function () {
    this.node.getComponent('CarOperations').hideMergeNote(), this.node.getComponent('GameMainJS').enableBuy(), this.dragOne.removeFromParent(), this.dragOne = null, this.inDragging = false
  },
  inFieldRange: function (e) {
    this.range = this.node.getComponent('CarOperations').range
    const t = this.range.node.parent.convertToNodeSpaceAR(e)
    const n = this.getRangePoints()
    return MathUtils.pointIsInPolygon(t, n)
  },
  getRangePoints: function () {
    if (this.rangePoints) return this.rangePoints
    for (var e = [], t = this.range.points, n = 0; n < t.length; n++) {
      const i = t[n].clone()
      i.x *= this.range.node.scaleX, i.y *= this.range.node.scaleY, e.push(i)
    }
    return this.rangePoints = e, this.rangePoints
  }
})
