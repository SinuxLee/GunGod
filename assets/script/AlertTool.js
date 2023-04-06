module.exports = {
  showMessage (e) {
    cc.sys.platform == cc.sys.WECHAT_GAME && wx.showToast({
      title: e,
      icon: 'none',
      mask: true,
      duration: 2e3
    })
  },

  showSuccess (e) {
    cc.sys.platform == cc.sys.WECHAT_GAME && wx.showToast({
      title: e,
      icon: 'success',
      mask: true,
      duration: 2e3
    })
  },

  hideToast () {
    cc.sys.platform == cc.sys.WECHAT_GAME && wx.hideToast()
  },

  showLoading (e, t) {
    cc.sys.platform == cc.sys.WECHAT_GAME && wx.showLoading({
      title: e,
      mask: t
    })
  },

  hideLoading () {
    cc.sys.platform == cc.sys.WECHAT_GAME && wx.hideLoading()
  },

  showConfirmModal (e, t, n) {
    wx.showModal({
      title: e,
      content: t,
      confirm: function () {
        console.log('点击确定'), n.confirm && n.confirm()
      }
    })
  },

  showModal (e, t, n, i) {
    cc.sys.platform == cc.sys.WECHAT_GAME
      ? wx.showModal({
        title: '提示',
        content: e,
        confirmText: n,
        confirmColor: '#0a9528',
        cancelColor: '#646464',
        cancelText: t,
        success: function (e) {
          e.confirm ? (i.confirm(), console.log('用户点击确定')) : e.cancel && (i.cancel(), console.log('用户点击取消'))
        }
      })
      : i.cancel()
  }
}
