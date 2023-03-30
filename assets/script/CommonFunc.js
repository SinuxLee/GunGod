const n = module.exports = {}
const t = module

const i = {
  changeNumToTime: function (e) {
    let t = parseInt(e / 60)
    let n = ''
    const i = parseInt(t / 60)
    i > 0 && (n = i + ':', t = parseInt(t % 60))
    const o = e % 60
    let a = t + ''
    let s = o + ''
    return t === 0 && (a = '0'), t < 10 && (a = '0' + t), o < 10 && (s = '0' + o), n + a + ':' + s
  },
  setShareADShow: function (e, t, n) {
    const i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null
    switch (e) {
      case 1:
        t.active = !0, i != null && (i.string = '看视频')
        break
      case 2:
        n.active = !0, i != null && (i.string = '去分享')
    }
  }
}
t.exports = i
