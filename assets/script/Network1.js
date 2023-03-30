const n = module.exports = {}
const t = module

const i = {
  getRequest: function (e, t, n) {
    const i = new XMLHttpRequest()
    i.onreadystatechange = function (e) {
      if (i.readyState == 4 && i.status >= 200 && i.status < 300) {
        const t = JSON.parse(i.responseText)
        n.success && n.success(t)
      }
    }, i.onerror = function (e) {
      n.failure() && n.failure(e)
    }, i.open('GET', e, !1), i.send(t)
  },
  postRequest: function (e, t, n) {
    const i = new XMLHttpRequest()
    i.onreadystatechange = function (e) {
      if (i.readyState == 4 && i.status >= 200 && i.status < 300) {
        const t = JSON.parse(i.responseText)
        t.code != 0 ? n.failure && n.failure(t.code) : n.success && n.success(t.data)
      }
    }, i.onerror = function (e) {
      n.failure() && n.failure(e)
    }, i.open('POST', e, !1), i.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'), i.send(t)
  },
  saveGameData: function (e) {
    const t = window.Config.RECORD_SAVE
    e.value = e.value == 0 ? -1 : e.value, e.value = JSON.stringify(e.value)
    const n = 'record_type=' + e.key + '&record=' + e.value
    this.postRequest(t, n, {
      success: function (t) {
        e.suc(t)
      },
      failure: function (t) {
        e.fail && e.fail(t)
      }
    })
  },
  getGameData: function (e) {
    const t = window.Config.RECORD_GET
    const n = 'record_type=' + e.key
    this.postRequest(t, n, {
      success: function (t) {
        t.record = JSON.parse(t.record), t.record = t.record == -1 ? 0 : t.record, e.suc(t)
      },
      failure: function (t) {
        e.fail && e.fail(t)
      }
    })
  }
}
t.exports = i
