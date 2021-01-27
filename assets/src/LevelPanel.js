var i = require('AnalyticsUtilities').AnalyticsUtilities;
cc.Class({
    extends: cc.Component,
    properties: {
        chapterPre: cc.Prefab,
        scrollContent: cc.Node,
        prograssLabel: cc.Node,
        listView: cc.ScrollView
    },
    onLoad: function() {},
    start: function() {},
    init: function() {
        i.logEvent("进入选关界面");
        var e = Number(window.facade.getComponent("LevelModel").getUnlockedLevelByType(facade.selectedLevelType)) - 1;
        e < 0 && (e = 0);
        var t = e + "/" + window.facade.getComponent("LevelModel").getLevelNumByType(facade.selectedLevelType);
        this.prograssLabel.getComponent("TextureLabel").setText(t), this.chapters = window.facade.getComponent("LevelModel").getChapters(), this.scrollContent.removeAllChildren();
        var n = 0;
        for (var o in this.chapters) {
            n++;
            var a = cc.instantiate(this.chapterPre);
            a.data = this.chapters[o], this.scrollContent.addChild(a), this.scrollContent.height = n * a.height, this.scrollContent.height
        }
        this.inited = !0, setTimeout(this.delayScroll.bind(this), 100)
    },
    delayScroll: function() {
        this.currentLevel = window.facade.getComponent("LevelModel").getUnlockedLevelByType(facade.selectedLevelType);
        var e = Math.floor((this.currentLevel - 1) / 15),
            t = this.scrollContent.getChildren();
        t.length <= 2 || this.listView.scrollToPercentVertical((t.length - e) / t.length)
    },
    onClose: function() {
        cc.director.getScene().getChildByName("Canvas").getComponent("MainUI").hideSelectPanel()
    },
    onDisable: function() {
        this.inited = !1
    },
    update: function(e) {
        this.node.active && !this.inited && this.init()
    }
})