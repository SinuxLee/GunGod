let n = module.exports = {}
let t = module

var i = {
    getRequest: function(e, t, n) {
        var i = new XMLHttpRequest;
        i.onreadystatechange = function(e) {
            if (4 == i.readyState && i.status >= 200 && i.status < 300) {
                var t = JSON.parse(i.responseText);
                n.success && n.success(t)
            }
        }.bind(this), i.onerror = function(e) {
            n.failure() && n.failure(e)
        }, i.open("GET", e, !1), i.send(t)
    },
    postRequest: function(e, t, n) {
        var i = new XMLHttpRequest;
        i.onreadystatechange = function(e) {
            if (4 == i.readyState && i.status >= 200 && i.status < 300) {
                var t = JSON.parse(i.responseText);
                0 != t.code ? n.failure && n.failure(t.code) : n.success && n.success(t.data)
            }
        }.bind(this), i.onerror = function(e) {
            n.failure() && n.failure(e)
        }, i.open("POST", e, !1), i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), i.send(t)
    },
    saveGameData: function(e) {
        var t = window.Config.RECORD_SAVE;
        e.value = 0 == e.value ? -1 : e.value, e.value = JSON.stringify(e.value);
        var n = "record_type=" + e.key + "&record=" + e.value;
        this.postRequest(t, n, {
            success: function(t) {
                e.suc(t)
            },
            failure: function(t) {
                e.fail && e.fail(t)
            }
        })
    },
    getGameData: function(e) {
        var t = window.Config.RECORD_GET,
            n = "record_type=" + e.key;
        this.postRequest(t, n, {
            success: function(t) {
                t.record = JSON.parse(t.record), t.record = -1 == t.record ? 0 : t.record, e.suc(t)
            },
            failure: function(t) {
                e.fail && e.fail(t)
            }
        })
    }
};
t.exports = i