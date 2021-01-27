var i = require('CommonFunc');
cc.Class({
    extends: cc.Component,
    properties: {
        energyLabel: cc.Node,
        energyCD: cc.Node
    },
    onLoad: function() {
        this.frameCount = 0
    },
    start: function() {},
    init: function() {},
    update: function(e) {
        if (this.energyLabel.getComponent("TextureLabel").setText(String(window.facade.getComponent("GameModel").energy)), this.energyCD.active = !window.facade.getComponent("GameModel").isEnergyFull(), this.frameCount++, this.frameCount % 30 == 0) {
            var t = window.facade.getComponent("GameModel").getNextEnergyTime(),
                n = (new Date).getTime(),
                o = Math.round((t - n) / 1e3),
                a = String(i.changeNumToTime(o));
            this.energyCD.getComponent("TextureLabel").setText(a)
        }
    }
})