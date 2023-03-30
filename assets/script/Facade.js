cc.Class({
  extends: cc.Component,

  onLoad: function () {
    this.node.reEnter = false
    this.node.inQQ = false
    this.node.qqAppId = ''
    this.node.qqAppKey = ''
    this.node.VERSION = 1002

    switch (window.net.platformName) {
      case 'wx':
        this.node.GameId = 91
        this.node.Client_Secret = ''
    }

    this.node.token = ''
    this.node.FOR_DEVELOP = true
    this.node.SAVE_MODE = false
    this.node.ResPath = ''
    this.node.ProjName = ''
    this.node.AllowWXInfo = true
    this.node.SkipLogin = false
    this.node.isEnteredGame = false
    this.node.isEnabledPay = false
    this.node.isEnabledGuilde = true
    this.node.isEnabledVideoAd = true
    this.node.SERVER_ID = 2
    this.node.SERVER_ID_BETA = 3
    this.node.FIRST_CAR_ID = 10101
    this.node.PopOrder = 9999
    this.node.FloatOrder = 11e3
    this.node.BEHAVE_WELLBEING = 5001
    this.node.BEHAVE_MAINRECOMMEND = 5002
    this.node.BEHAVE_COMMONRECOMMEND = 5003
    this.node.BEHAVE_CPARECOMMEND = 5004
    this.node.CLICK_MAIN_BOX = 3002
    this.node.CLICK_ADVENTURE = 3003
    this.node.BEHAVE_WX_LOGIN = 1001
    this.node.BEHAVE_LOADING_START = 1002
    this.node.BEHAVE_LOADING_END = 1003
    this.node.BEHAVE_CLICK_RACING = 3001
    this.node.PAY_SUCCESS = 13
    this.node.BEHAVE_ROLE = 12
    this.node.BEHAVE_LOGIN = 11
    this.node.BEHAVE_ALLOWED = 10
    this.node.BEHAVE_ONSHOW = 9
    this.node.BEHAVE_FORM_SHARE = 8
    this.node.BEHAVE_SHARE = 7
    this.node.BEHAVE_ENTER = 1
    this.node.BEHAVE_VIDEOSTART = 4
    this.node.BEHAVE_VIDEOEND = 5
    this.node.INVITE_LEVERAWARD = '1511'
    this.node.INVITE_RECALL = '1517'
    this.node.INVITE_PARARA = '1513'
    this.node.INVITE_UNLOCK_FRIEND_GUARD = '1514'
    this.node.INVITE_FRIEND_GUARD = '1515'
    this.node.INVITE_UNIVERSAL_FRAGMENT = '1516'
    this.node.INVITE_LOVESEA = '1518'
    this.node.INVITE_AWARDRES = '1519'
    this.node.INVITE_SHAREDOG = '1520'
    this.node.INVITE_SHAREFRIEND = '1521'
    this.node.INVITE_SHARERANK = '1522'
    this.node.INVITE_LUCKYDRAW = '1523'
    this.node.INVITE_TIMEINIVTE = '1524'
    this.node.uiNames = {
      NextLoginView: 1,
      NewerView: 2,
      AdvanceView: 3,
      EnergyNeedView: 4,
      BackEnergyView: 5,
      EntranceUI: 6,
      Rank: 8,
      skinPanel: 9
    }
    this.node.PlayerAtrriKeys = {}
    this.node.GlobalKeys = {}
    this.node.httpServerAdress = ''
    this.node.behaveReportAdress = ''
    this.node.appLinkReportAdress = ''
    this.node.openapiUrl = ''
    this.node.showRankPage = 1
    this.node.canShowShareGroup = true
    this.node.lastSessionid = '0'
    this.node.showShareTicket = null
    this.node.isEnterGameFirst = true
    this.node.queryRoleID = null
    this.node.isShareOut = false
    this.node.isOpenedGiftbag = false
    this.node.logicCode = ''
    this.node.tipsNode = null
  }
})
