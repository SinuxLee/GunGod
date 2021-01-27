var i = require('ModuleEventEnum');
require('CommonFunc');
cc.Class({
    extends: cc.Component,
    properties: {
        comfirbtn: cc.Sprite,
        judgeInput: cc.Sprite,
        judgeTrue: cc.SpriteFrame,
        judgeFalse: cc.SpriteFrame,
        nameEditBox: cc.EditBox,
        titleLabel: cc.Label
    },
    onLoad: function() {
        if (!window.filterWord.m_wordList) {
            var e = cc.loader.getRes("config/FilterwordDB.txt", cc.TextAsset);
            this.filterwordDBList = e.text.split(","), window.filterWord.init(this.filterwordDBList)
        }
    },
    start: function() {},
    initData: function() {},
    comfirBtn: function() {
        var e = this.nameEditBox.string,
            t = window.filterWord.runFilterWord(e);
        e != t && (this.nameEditBox.string = t, e = t, window.popUp.getComponent("FloatTip").showTip("内容包含敏感词汇，已自动屏蔽")), window.facade.getComponent("PlayerModel").nick = e, window.facade.getComponent("PlayerModel").recordRoleProfile(), cc.systemEvent.emit(i.PLAYER_NAME_CHANGE, e), window.popUp.getComponent("Pop").removeTop()
    },
    update: function(e) {}
})