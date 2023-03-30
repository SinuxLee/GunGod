const i = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
  ? function (e) {
    return typeof e
  }
  : function (e) {
    return e && typeof Symbol === 'function' && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e
  }

cc.sys.platform === cc.sys.WECHAT_GAME && (function () {
  function t (e) {
    function t (e) {
      return Object.prototype.toString.call(e)
    }
    const n = {}
    return 'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ').forEach(function (e, t) {
      n['[object ' + e + ']'] = e.toLowerCase()
    }), e == null ? e : (void 0 === e ? 'undefined' : i(e)) == 'object' || typeof e === 'function' ? n[t.call(e)] || 'object' : void 0 === e ? 'undefined' : i(e)
  }

  function n () {
    function e () {
      return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
    }
    return e() + e() + e() + e() + e() + e() + e() + e()
  }

  function o (e, t) {
    v++
    e.as = y
    e.at = S
    e.rq_c = v
    e.ifo = h
    e.ak = d.app_key
    e.uu = u
    e.v = r
    e.st = Date.now()
    e.ev = t
    e.wsr = C
    a(e.ufo) !== '' && (e.ufo = e.ufo), e.ec = f, wx.Queue.push(function () {
      return new Promise(function (t, n) {
        wx.request({
          url: 'https://' + l + '.aldwx.com/d.html',
          data: e,
          header: {
            se: m || '',
            op: g || '',
            img: L || ''
          },
          method: 'GET',
          fail: function () {
            t('')
          },
          success: function (e) {
            t(e.statusCode == 200 ? '' : 'status error')
          }
        })
      })
    })
  }

  function a (e) {
    if (void 0 === e || e === '') return ''
    const t = {}
    for (const n in e) n != 'rawData' && n != 'errMsg' && (t[n] = e[n])
    return t
  }

  function s (e) {
    const t = {}
    for (const n in e) t[n] = e[n]
    return t
  }

  function c (e) {
    for (var t = '', n = 0; n < e.length; n++) e[n].length > t.length && (t = e[n])
    return t
  }
  var r = '2.0.0'
  var l = 'glog'
  var d = require('ald-game-conf')
  d.app_key === '' && console.error('请在配置文件中填写您的app_key'), d.app_key = d.app_key.replace(/\s/g, ''), wx.request({
    url: 'https://' + l + '.aldwx.com/config/app.json',
    method: 'GET',
    success: function (e) {
      e.statusCode === 200 && (e.data.version != r && console.warn('您的SDK不是最新版本，请尽快升级！'), e.data.warn && console.warn(e.data.warn), e.data.error && console.error(e.data.error))
    }
  })
  var h = ''

  var u = (function () {
    let e = ''
    try {
      e = wx.getStorageSync('aldstat_uuid'), wx.setStorageSync('ald_ifo', true)
    } catch (t) {
      e = 'uuid_getstoragesync'
    }
    if (e) h = false
    else {
      e = n(), h = true
      try {
        wx.setStorageSync('aldstat_uuid', e)
      } catch (e) {
        wx.setStorageSync('aldstat_uuid', 'uuid_getstoragesync')
      }
    }
    return e
  }())

  const p = {}
  var m = ''
  var g = ''
  var f = 0
  var v = ''
  var C = wx.getLaunchOptionsSync()
  const w = Date.now()
  var S = '' + Date.now() + Math.floor(1e7 * Math.random())
  var y = '' + Date.now() + Math.floor(1e7 * Math.random())
  let E = 0
  let _ = ''
  var L = ''
  let T = true
  let I = false
  const R = ['aldSendEvent', 'aldOnShareAppMessage', 'aldShareAppMessage', 'aldSendSession', 'aldSendOpenid', 'aldLevelEvent']
  const N = ['payStart', 'paySuccess', 'payFail', 'die', 'revive', 'tools', 'award']
  const M = ['complete', 'fail']
  void 0 === wx.Queue && (wx.Queue = new function () {
    this.concurrency = 4, this.queue = [], this.tasks = [], this.activeCount = 0
    const e = this
    this.push = function (t) {
      this.tasks.push(new Promise(function (n, i) {
        const o = function () {
          e.activeCount++, t().then(function (e) {
            n(e)
          }).then(function () {
            e.next()
          })
        }
        e.activeCount < e.concurrency ? o() : e.queue.push(o)
      }))
    }, this.all = function () {
      return Promise.all(this.tasks)
    }, this.next = function () {
      e.activeCount--, e.queue.length > 0 && e.queue.shift()()
    }
  }(), wx.Queue.all()), Promise.all([new Promise(function (e, t) {
    wx.getSetting({
      success: function (t) {
        t.authSetting['scope.userInfo']
          ? wx.getUserInfo({
            success: function (t) {
              L = c(t.userInfo.avatarUrl.split('/')), e(t)
            },
            fail: function () {
              e('')
            }
          })
          : e('')
      },
      fail: function () {
        e('')
      }
    })
  }), new Promise(function (e, t) {
    wx.getNetworkType({
      success: function (t) {
        e(t)
      },
      fail: function () {
        e('')
      }
    })
  }), new Promise(function (e, t) {
    d.getLocation
      ? wx.getLocation({
        success: function (t) {
          e(t)
        },
        fail: function () {
          e('')
        }
      })
      : wx.getSetting({
        success: function (t) {
          t.authSetting['scope.userLocation']
            ? (wx.getLocation({
                success: function (t) {
                  e(t)
                },
                fail: function () {
                  e('')
                }
              }), e(''))
            : e('')
        },
        fail: function () {
          e('')
        }
      })
  })]).then(function (e) {
    e[2] !== '' ? (p.lat = e[2].latitude || '', p.lng = e[2].longitude || '', p.spd = e[2].speed || '') : (p.lat = '', p.lng = '', p.spd = ''), e[1] !== '' ? p.nt = e[1].networkType || '' : p.nt = ''
    const t = s(p)
    e[0] !== '' && (t.ufo = e[0], _ = e[0]), o(t, 'init')
  }), wx.onShow(function (e) {
    if (C = e, E = Date.now(), !T && !I) {
      S = '' + Date.now() + Math.floor(1e7 * Math.random()), h = false
      try {
        wx.setStorageSync('ald_ifo', false)
      } catch (e) {}
    }
    T = false, I = false
    const t = s(p)
    const n = s(p)
    t.sm = E - w, e.query.ald_share_src && e.shareTicket && e.scene === '1044'
      ? (n.tp = 'ald_share_click', new Promise(function (e, t) {
          C.scene == '1044'
            ? wx.getShareInfo({
              shareTicket: C.shareTicket,
              success: function (t) {
                e(t)
              },
              fail: function () {
                e('')
              }
            })
            : e('')
        }).then(function (e) {
          n.ct = e, o(n, 'event')
        }))
      : e.query.ald_share_src && (n.tp = 'ald_share_click', n.ct = '1', o(n, 'event')), o(t, 'show')
  }), wx.onHide(function () {
    const e = s(p)
    e.dr = Date.now() - E, _ === ''
      ? wx.getSetting({
        success: function (t) {
          t.authSetting['scope.userInfo']
            ? wx.getUserInfo({
              success: function (t) {
                e.ufo = t, _ = t, L = c(t.userInfo.avatarUrl.split('/')), o(e, 'hide')
              }
            })
            : o(e, 'hide')
        }
      })
      : o(e, 'hide')
  }), wx.onError(function (e) {
    const t = s(p)
    t.tp = 'ald_error_message', t.ct = e, f++, o(t, 'event')
  })
  const A = {
    aldSendEvent: function (e, t) {
      const n = s(p)
      e !== '' && typeof e === 'string' && e.length <= 255 ? (n.tp = e, typeof t === 'string' && t.length <= 255 ? (n.ct = String(t), o(n, 'event')) : (void 0 === t ? 'undefined' : i(t)) == 'object' ? (JSON.stringify(t).length >= 255 && console.error('自定义事件参数不能超过255个字符'), n.ct = JSON.stringify(t), o(n, 'event')) : void 0 === t || t === '' ? o(n, 'event') : console.error('事件参数必须为String,Object类型,且参数长度不能超过255个字符')) : console.error('事件名称必须为String类型且不能超过255个字符')
    },
    aldOnShareAppMessage: function (e) {
      wx.onShareAppMessage(function () {
        I = true
        const n = e()
        let i = ''
        i = void 0 !== C.query.ald_share_src ? void 0 !== n.query ? (C.query.ald_share_src.indexOf(u), n.query + '&ald_share_src=' + C.query.ald_share_src + ',' + u) : (C.query.ald_share_src.indexOf(u), 'ald_share_src=' + C.query.ald_share_src + ',' + u) : void 0 !== n.query ? n.query + '&ald_share_src=' + u : 'ald_share_src=' + u, t(n.ald_desc) != 'undefined' && (i += '&ald_desc=' + n.ald_desc), n.query = i
        const a = s(p)
        return a.ct = n, a.ct.sho = 1, a.tp = 'ald_share_chain', o(a, 'event'), n
      })
    },
    aldShareAppMessage: function (e) {
      I = true
      const n = e
      let i = ''
      i = void 0 !== C.query.ald_share_src ? void 0 !== n.query ? (C.query.ald_share_src.indexOf(u), n.query + '&ald_share_src=' + C.query.ald_share_src + ',' + u) : (C.query.ald_share_src.indexOf(u), 'ald_share_src=' + C.query.ald_share_src + ',' + u) : void 0 !== n.query ? n.query + '&ald_share_src=' + u : 'ald_share_src=' + u
      const a = s(p)
      t(n.ald_desc) != 'undefined' && (i += '&ald_desc=' + n.ald_desc), n.query = i, a.ct = n, a.tp = 'ald_share_chain', o(a, 'event'), wx.shareAppMessage(n)
    },
    aldSendSession: function (e) {
      if (e !== '' && e) {
        const t = s(p)
        t.tp = 'session', t.ct = 'session', m = e, _ === ''
          ? wx.getSetting({
            success: function (e) {
              e.authSetting['scope.userInfo']
                ? wx.getUserInfo({
                  success: function (e) {
                    t.ufo = e, o(t, 'event')
                  }
                })
                : o(t, 'event')
            }
          })
          : (t.ufo = _, _ !== '' && (t.gid = ''), o(t, 'event'))
      } else console.error('请传入从后台获取的session_key')
    },
    aldSendOpenid: function (e) {
      if (e !== '' && e) {
        g = e
        const t = s(p)
        t.tp = 'openid', t.ct = 'openid', o(t, 'event')
      } else console.error('openID不能为空')
    }
  }
  wx.aldStage = new function () {
    function e (e) {
      return !/^\d+(.\d+)*$/.test(e.stageId) || e.stageId.length > 32 ? (console.warn('关卡stageId必须符合传参规则,请参考文档。'), false) : !(t(e.stageName) !== 'string' || e.stageName.length > 32) || (console.warn('关卡名称为必传字段,且长度小于32个字符,请参考文档'), false)
    }
    let n = ''
    let i = ''
    let a = 0
    this.onStart = function (o) {
      if (e(o)) {
        const s = {}
        a = Date.now(), s.sid = o.stageId, s.snm = o.stageName, s.state = 'start', i = '' + Date.now() + Math.floor(1e7 * Math.random()), n = s, (t(o.userId) === 'string' && o.userId) < 32 && (this.uid = o.uid), this.request()
      }
    }, this.onRunning = function (i) {
      if (e(i)) {
        const o = {
          params: {}
        }
        if ((t(i.userId) === 'string' && i.userId) < 32 && (this.uid = i.uid), !t(i.event) && N.join(',').indexOf(i.event + ',') != -1) return void N.join(',')
        if (o.event = i.event, t(i.params) === 'object') {
          if (t(i.params.itemName) !== 'string' || i.params.itemName.length > 32) return void console.warn('道具/商品名称为必传字段，且长度小于32个字符，详情请参考文档')
          o.params.itnm = i.params.itemName, t(i.params.itemId) === 'string' && i.params.itemId.length < 32 && (o.params.itid = i.params.itemId), t(i.params.itemCount) === 'number' && i.params.itemCount.length < 32 ? o.params.itco = i.params.itemCount : o.params.itco = 1, i.event.indexOf('pay') !== -1 && (t(i.params.itemMoney) === 'number' && i.params.itemMoney.length < 32 ? o.params.money = i.params.itemMoney : o.params.money = 0), t(i.params.desc) === 'string' && i.params.desc.length < 64 && (o.params.desc = i.params.desc), o.state = 'running', o.sid = i.stageId, o.snm = i.stageName, n = o, this.request()
        }
      }
    }, this.onEnd = function (i) {
      if (e(i)) {
        const o = {
          state: 'end'
        }
        if ((t(i.userId) === 'string' && i.userId) < 32 && (this.uid = i.uid), !t(i.event) && M.join(',').indexOf(i.event + ',') !== -1) return void M.join(',')
        o.sid = i.stageId
        o.snm = i.stageName
        o.event = i.event
        o.sdr = a !== 0 ? Date.now() - a : ''
        o.params = {}
        t(i.params) === 'object' && t(i.params.desc) === 'string' && i.params.desc.length < 64 && (o.params.desc = i.params.desc)
        n = o
        this.request()
      }
    }, this.request = function () {
      const e = s(p)
      n.ss = i, e.ct = n, o(e, 'screen')
    }
  }()
  for (let b = 0; b < R.length; b++) {
    !(function (e, t) {
      Object.defineProperty(wx, e, {
        value: t,
        writable: false,
        enumerable: true,
        configurable: true
      })
    }(R[b], A[R[b]]))
  }

  try {
    const D = wx.getSystemInfoSync()
    p.br = D.brand || ''
    p.md = D.model
    p.pr = D.pixelRatio
    p.sw = D.screenWidth
    p.sh = D.screenHeight
    p.ww = D.windowWidth
    p.wh = D.windowHeight
    p.lang = D.language
    p.wv = D.version
    p.sv = D.system
    p.wvv = D.platform
    p.fs = D.fontSizeSetting
    p.wsdk = D.SDKVersion
    p.bh = D.benchmarkLevel || ''
    p.bt = D.battery || ''
    p.wf = D.wifiSignal || ''
    p.lng = ''
    p.lat = ''
    p.nt = ''
    p.spd = ''
    p.ufo = ''
  } catch (e) {}
}())
