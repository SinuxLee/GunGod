cc.Class({
    extends: cc.Component,
    properties: {
        vertical: {
            default: !0
        },
        horizontal: {
            default: !1
        },
        moveRangeY: 100,
        moveRangeX: 100,
        speed: .5
    },
    onLoad: function() {},
    start: function() {
        this.originPos = this.node.position, this.rangePos = this.originPos.clone(), this.vertical ? this.rangePos.y += this.moveRangeY : this.rangePos.x += this.moveRangeX, this.rangeDis = this.rangePos.sub(this.originPos).mag(), this.normalizeVec = this.rangePos.sub(this.originPos).normalizeSelf(), this.dir = 1
    },
    update: function(e) {
        var t = this.originPos.sub(this.node.position).mag(),
            n = this.rangePos.sub(this.node.position).mag();
        t > this.rangeDis ? this.dir = -1 : n > this.rangeDis && (this.dir = 1), this.node.x += this.normalizeVec.x * this.speed * this.dir, this.node.y += this.normalizeVec.y * this.speed * this.dir
    }
})