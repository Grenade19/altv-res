Object.defineProperty(t, "__esModule", {
    value: !0
});
var n = null,
    r = !1,
    a = 3,
    i = -1,
    l = -1,
    o = !1,
    u = !1;

function s() {
    if (!o) {
        var e = n.expirationTime;
        u ? w() : u = !0, k(d, e)
    }
}

function c() {
    var e = n,
        t = n.next;
    if (n === t) n = null;
    else {
        var r = n.previous;
        n = r.next = t, t.previous = r
    }
    e.next = e.previous = null, r = e.callback, t = e.expirationTime, e = e.priorityLevel;
    var i = a,
        o = l;
    a = e, l = t;
    try {
        var u = r()
    } finally {
        a = i, l = o
    }
    if ("function" == typeof u)
        if (u = {
                callback: u,
                priorityLevel: e,
                expirationTime: t,
                next: null,
                previous: null
            }, null === n) n = u.next = u.previous = u;
        else {
            r = null, e = n;
            do {
                if (e.expirationTime >= t) {
                    r = e;
                    break
                }
                e = e.next
            } while (e !== n);
            null === r ? r = n : r === n && (n = u, s()), (t = r.previous).next = r.previous = u, u.next = r, u.previous = t
        }
}

function f() {
    if (-1 === i && null !== n && 1 === n.priorityLevel) {
        o = !0;
        try {
            do {
                c()
            } while (null !== n && 1 === n.priorityLevel)
        } finally {
            o = !1, null !== n ? s() : u = !1
        }
    }
}

function d(e) {
    o = !0;
    var a = r;
    r = e;
    try {
        if (e)
            for (; null !== n;) {
                var i = t.unstable_now();
                if (!(n.expirationTime <= i)) break;
                do {
                    c()
                } while (null !== n && n.expirationTime <= i)
            } else if (null !== n)
                do {
                    c()
                } while (null !== n && !E())
    } finally {
        o = !1, r = a, null !== n ? s() : u = !1, f()
    }
}
var p, m, h = Date,
    v = "function" == typeof setTimeout ? setTimeout : void 0,
    y = "function" == typeof clearTimeout ? clearTimeout : void 0,
    g = "function" == typeof requestAnimationFrame ? requestAnimationFrame : void 0,
    b = "function" == typeof cancelAnimationFrame ? cancelAnimationFrame : void 0;

function _(e) {
    p = g(function(t) {
        y(m), e(t)
    }), m = v(function() {
        b(p), e(t.unstable_now())
    }, 100)
}
if ("object" == typeof performance && "function" == typeof performance.now) {
    var x = performance;
    t.unstable_now = function() {
        return x.now()
    }
} else t.unstable_now = function() {
    return h.now()
};
var k, w, E, T = null;
if ("undefined" != typeof window ? T = window : void 0 !== e && (T = e), T && T._schedMock) {
    var S = T._schedMock;
    k = S[0], w = S[1], E = S[2], t.unstable_now = S[3]
} else if ("undefined" == typeof window || "function" != typeof MessageChannel) {
    var C = null,
        P = function(e) {
            if (null !== C) try {
                C(e)
            } finally {
                C = null
            }
        };
    k = function(e) {
        null !== C ? setTimeout(k, 0, e) : (C = e, setTimeout(P, 0, !1))
    }, w = function() {
        C = null
    }, E = function() {
        return !1
    }
} else {
    "undefined" != typeof console && ("function" != typeof g && console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"), "function" != typeof b && console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"));
    var N = null,
        O = !1,
        M = -1,
        R = !1,
        z = !1,
        I = 0,
        U = 33,
        D = 33;
    E = function() {
        return I <= t.unstable_now()
    };
    var F = new MessageChannel,
        V = F.port2;
    F.port1.onmessage = function() {
        O = !1;
        var e = N,
            n = M;
        N = null, M = -1;
        var r = t.unstable_now(),
            a = !1;
        if (0 >= I - r) {
            if (!(-1 !== n && n <= r)) return R || (R = !0, _(A)), N = e, void(M = n);
            a = !0
        }
        if (null !== e) {
            z = !0;
            try {
                e(a)
            } finally {
                z = !1
            }
        }
    };
    var A = function(e) {
        if (null !== N) {
            _(A);
            var t = e - I + D;
            t < D && U < D ? (8 > t && (t = 8), D = t < U ? U : t) : U = t, I = e + D, O || (O = !0, V.postMessage(void 0))
        } else R = !1
    };
    k = function(e, t) {
        N = e, M = t, z || 0 > t ? V.postMessage(void 0) : R || (R = !0, _(A))
    }, w = function() {
        N = null, O = !1, M = -1
    }
}
t.unstable_ImmediatePriority = 1, t.unstable_UserBlockingPriority = 2, t.unstable_NormalPriority = 3, t.unstable_IdlePriority = 5, t.unstable_LowPriority = 4, t.unstable_runWithPriority = function(e, n) {
switch (e) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        break;
    default:
        e = 3
}
var r = a,
    l = i;
a = e, i = t.unstable_now();
try {
    return n()
} finally {
    a = r, i = l, f()
}
}, t.unstable_next = function(e) {
switch (a) {
    case 1:
    case 2:
    case 3:
        var n = 3;
        break;
    default:
        n = a
}
var r = a,
    l = i;
a = n, i = t.unstable_now();
try {
    return e()
} finally {
    a = r, i = l, f()
}
}, t.unstable_scheduleCallback = function(e, r) {
var l = -1 !== i ? i : t.unstable_now();
if ("object" == typeof r && null !== r && "number" == typeof r.timeout) r = l + r.timeout;
else switch (a) {
    case 1:
        r = l + -1;
        break;
    case 2:
        r = l + 250;
        break;
    case 5:
        r = l + 1073741823;
        break;
    case 4:
        r = l + 1e4;
        break;
    default:
        r = l + 5e3
}
if (e = {
        callback: e,
        priorityLevel: a,
        expirationTime: r,
        next: null,
        previous: null
    }, null === n) n = e.next = e.previous = e, s();
else {
    l = null;
    var o = n;
    do {
        if (o.expirationTime > r) {
            l = o;
            break
        }
        o = o.next
    } while (o !== n);
    null === l ? l = n : l === n && (n = e, s()), (r = l.previous).next = l.previous = e, e.next = l, e.previous = r
}
return e
}, t.unstable_cancelCallback = function(e) {
var t = e.next;
if (null !== t) {
    if (t === e) n = null;
    else {
        e === n && (n = t);
        var r = e.previous;
        r.next = t, t.previous = r
    }
    e.next = e.previous = null
}
}, t.unstable_wrapCallback = function(e) {
var n = a;
return function() {
    var r = a,
        l = i;
    a = n, i = t.unstable_now();
    try {
        return e.apply(this, arguments)
    } finally {
        a = r, i = l, f()
    }
}
}, t.unstable_getCurrentPriorityLevel = function() {
return a
}, t.unstable_shouldYield = function() {
return !r && (null !== n && n.expirationTime < l || E())
}, t.unstable_continueExecution = function() {
null !== n && s()
}, t.unstable_pauseExecution = function() {}, t.unstable_getFirstCallbackNode = function() {
return n
}
}).call(this, n(7))
},
function(e, t) {
    var n;
    n = function() {
        return this
    }();
    try {
        n = n || new Function("return this")()
    } catch (e) {
        "object" == typeof window && (n = window)
    }
    e.exports = n
},
function(e, t, n) {},
function(e, t, n) {},
function(e, t, n) {},
function(e, t, n) {},
function(e, t, n) {},
function(e, t, n) {
    e.exports = n.p + "img/preview.png"
},
function(e, t, n) {
    "use strict";
    n.r(t);
    var r = n(0),
        a = n.n(r),
        i = n(2);
    n(8), n(9);
    class l extends a.a.Component {
        constructor(e) {
            if (super(e), this.state = {
                    value: 0
                }, this.holdTimeouts = [null, null], this.mouse_not_pressed = !1, this.state.value = this.props.initialValue || 0, this.props.step < 0) throw new Error("step must be positive");
            window.addEventListener("mouseup", this.onMouseUp.bind(this), !1), window.addEventListener("mousedown", this.onMouseDown.bind(this), !1)
        }
        componentWillUnmount() {
            for (let e = 0; e < 2; e++) this.holdTimeouts[e] && clearTimeout(this.holdTimeouts[e]);
            window.removeEventListener("mouseup", this.onMouseUp.bind(this), !1), window.removeEventListener("mousedown", this.onMouseDown.bind(this), !1)
        }
        componentWillUpdate(e, t) {
            this.props.loop ? t.value < this.props.min ? t.value = this.props.max : t.value > this.props.max && (t.value = this.props.min) : t.value = Math.max(this.props.min, Math.min(this.props.max, t.value)), this.state.value !== t.value && this.props.onChange && this.props.onChange(t.value)
        }
        onMouseUp() {
            this.mouse_not_pressed = !0
        }
        onMouseDown() {
            this.mouse_not_pressed = !1
        }
        setValue(e) {
            this.setState({
                value: e
            })
        }
        clamp() {
            return Math.max(this.props.min, Math.min(this.props.max, this.state.value))
        }
        _parse(e) {
            let t = "string" == typeof e ? parseFloat(e) : e,
                n = Math.floor(Math.log10(Math.abs(this.props.step)));
            try {
                return parseFloat(t.toFixed(-n))
            } catch (e) {
                return t
            }
        }
        handleHold(e, t, n = 500) {
            t && null !== this.holdTimeouts[e] ? (clearTimeout(this.holdTimeouts[e]), this.holdTimeouts[e] = null) : this.holdTimeouts[e] = setTimeout(() => {
                this.mouse_not_pressed || 0 === e && this.state.value <= this.props.min && !this.props.loop || 1 === e && this.state.value >= this.props.max && !this.props.loop || (this.setState({
                    value: this._parse(this.state.value + this.props.step * (1 === e ? 1 : -1))
                }), this.handleHold(e, !1, Math.max(50, n - 30)))
            }, n)
        }
        render() {
            return a.a.createElement("div", {
                className: `small_numeric ${this.props.disabled?"disabled":""}`
            }, a.a.createElement("button", {
                onClick: () => this.setState({
                    value: this._parse(this.state.value - this.props.step)
                }),
                onMouseDown: () => this.handleHold(0, !1),
                onMouseUp: () => this.handleHold(0, !0)
            }), a.a.createElement("input", {
                type: "number",
                value: this.state.value,
                step: this.props.step,
                onChange: e => {
                    0 === e.target.value.length && (e.target.value = this.props.min.toString()), this.setState({
                        value: this._parse(e.target.value)
                    })
                }
            }), a.a.createElement("button", {
                onClick: () => this.setState({
                    value: this._parse(this.state.value + this.props.step)
                }),
                onMouseDown: () => this.handleHold(1, !1),
                onMouseUp: () => this.handleHold(1, !0)
            }))
        }
    }
    l.defaultProps = {
        disabled: !1,
        step: 1,
        loop: !0,
        initialValue: 0
    };
    class o extends a.a.Component {
        constructor(e) {
            super(e), this.texture_numeric = null, this.state = {
                model_id: 0,
                texture_id: 0
            }, this.enable_texture_variations = this.props.variations_data.some(e => e > 1), this.state.model_id = this.props.initialValues.model_id, this.state.texture_id = this.props.initialValues.texture_id
        }
        componentWillUpdate(e, t) {
            this.state.model_id === t.model_id && this.state.texture_id === t.texture_id || this.props.onChange(t)
        }
        render() {
            const e = this.props.variations_data[this.state.model_id] - 1;
            return a.a.createElement("div", {
                className: "variation-box"
            }, a.a.createElement("label", null, this.props.label), a.a.createElement("div", null, a.a.createElement("label", null, "Model"), a.a.createElement(l, {
                initialValue: this.state.model_id,
                onChange: e => {
                    this.setState({
                        model_id: e,
                        texture_id: 0
                    }), this.texture_numeric && this.texture_numeric.setValue(0)
                },
                min: 0,
                max: this.props.variations_data.length - 1
            })), this.enable_texture_variations && a.a.createElement("div", null, a.a.createElement("label", null, "Textura"), a.a.createElement(l, {
                initialValue: this.state.texture_id,
                onChange: e => {
                    this.setState({
                        texture_id: e
                    })
                },
                min: 0,
                max: e,
                disabled: !e,
                ref: e => this.texture_numeric = e
            })))
        }
    }
    o.defaultProps = {
        initialValues: {
            model_id: 0,
            texture_id: 0
        }
    };
    n(10);
    class u extends a.a.Component {
        constructor(e) {
            super(e), this.state = {
                value: 0
            }, this.startPos = null, window.addEventListener("mouseup", this.onMouseUp.bind(this), !1), window.addEventListener("mousemove", this.onMouseMove.bind(this), !1)
        }
        componentDidMount() {
            this.setValue(this.props.initialValue || 0)
        }
        componentWillUnmount() {
            window.removeEventListener("mouseup", this.onMouseUp.bind(this), !1), window.removeEventListener("mousemove", this.onMouseMove.bind(this), !1)
        }
        componentWillUpdate(e, t) {
            this.state.value !== t.value && this.props.onChange && this.props.onChange(t.value)
        }
        onMouseUp() {
            this.startPos = null
        }
        onMouseMove(e) {
            if (null === this.startPos) return;
            let t = e.screenX - this.startPos;
            this.setValue(this.state.value + t / this.props.width * (this.props.max - this.props.min)), this.startPos = e.clientX
        }
        clamp(e) {
            return Math.max(this.props.min, Math.min(this.props.max, e))
        }
        setValue(e) {
            this.setState({
                value: this.clamp(e)
            })
        }
        mapValue() {
            return (this.state.value - this.props.min) / (this.props.max - this.props.min)
        }
        render() {
            let e = this.mapValue() * this.props.width;
            return a.a.createElement("div", {
                className: "slider-main",
                style: {
                    width: `${this.props.width}px`
                },
                onWheel: e => {
                    this.setValue(this.state.value - e.deltaY / 100 * (this.props.max - this.props.min) * .1)
                }
            }, a.a.createElement("button", {
                style: {
                    transform: `translateX(${e}px)`
                },
                onMouseDown: e => {
                    this.startPos = e.screenX
                }
            }))
        }
    }
    u.defaultProps = {
        disabled: !1,
        step: 1,
        loop: !0,
        initialValue: 0,
        width: 80
    };
    class s extends a.a.Component {
        constructor(e) {
            super(e), this.state = {
                index: 0,
                opacity: 1
            }, this.state.index = this.props.initialValues.index, this.state.opacity = this.props.initialValues.opacity, this.state.color1 = this.props.initialValues.color1, this.state.color2 = this.props.initialValues.color2
        }
        componentWillUpdate(e, t) {
            this.state.index === t.index && this.state.opacity === t.opacity && this.state.color1 === t.color1 && this.state.color2 === t.color2 || this.props.onChange(t)
        }
        render() {
            return a.a.createElement("div", {
                className: "variation-box"
            }, a.a.createElement("label", null, this.props.label), a.a.createElement("div", null, a.a.createElement("label", null, "Typ"), a.a.createElement(l, {
                initialValue: this.state.index,
                onChange: e => {
                    this.setState({
                        index: e
                    })
                },
                min: 0,
                max: this.props.max_index
            })), a.a.createElement("div", null, a.a.createElement("label", null, "Widoczność"), a.a.createElement(u, {
                width: 62,
                initialValue: this.state.opacity,
                onChange: e => {
                    this.setState({
                        opacity: e
                    })
                },
                min: 0,
                max: 1
            })), void 0 !== this.state.color1 && a.a.createElement("div", null, a.a.createElement("label", null, "Kolor 1"), a.a.createElement(l, {
                initialValue: this.state.color1,
                onChange: e => {
                    this.setState({
                        color1: e
                    })
                },
                min: 0,
                max: 63
            })), void 0 !== this.state.color2 && a.a.createElement("div", null, a.a.createElement("label", null, "Kolor 2"), a.a.createElement(l, {
                initialValue: this.state.color2,
                onChange: e => {
                    this.setState({
                        color2: e
                    })
                },
                min: 0,
                max: 63
            })))
        }
    }
    s.defaultProps = {
        initialValues: {
            index: 0,
            opacity: 1
        }
    };
    n(11);
    const c = ["Ogólne", "Głowa", "Kształt głowy", "Twarz", "Makijaż", "Ubiór"],
        f = 0,
        d = 1,
        p = 2,
        m = 3,
        h = 4,
        v = 5,
        y = 6,
        g = 7,
        b = 8,
        _ = 10,
        x = 11,
        k = {
            Blemishes: 23,
            "Facial Hair": 28,
            Eyebrows: 33,
            Ageing: 14,
            Makeup: 74,
            Blush: 6,
            Complexion: 11,
            "Sun Damage": 10,
            Lipstick: 9,
            "Moles/Freckles": 17,
            "Chest Hair": 16,
            "Body Blemishes": 11,
            "Add Body Blemishes": 1
        },
        w = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 4, 4, 1, 4, 4, 4, 4, 3, 1, 1, 3, 3, 1, 16, 4, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 5, 5, 1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 4, 4, 26, 10, 10, 11, 9, 11, 2, 9, 22, 10, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 6, 2, 3, 3, 3, 3, 4, 1, 3, 3, 3, 3, 5, 8, 11, 6, 6, 6, 8, 4, 6, 1, 6, 6, 16, 3, 26, 26, 24, 26, 24, 24, 12, 26, 26, 26, 22, 26, 26, 26, 21, 26, 25, 1, 1, 3, 12, 24, 26, 18, 4, 16, 18, 19, 4, 26, 17, 20, 14, 16, 8, 12, 12, 12, 12, 12, 1, 1, 1, 17, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 3, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 12, 16, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2, 1, 2, 2, 2, 2, 1, 1, 2, 1, 2, 2, 2, 2, 1, 1, 2, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 12, 18, 12, 1],
            [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 12, 12, 2, 5, 3, 1, 3, 13, 13, 13, 1, 16, 1, 1, 5, 4, 1, 1, 1, 1, 4, 7, 4, 4, 4, 4, 1, 5, 5, 4, 1, 7, 2, 2, 5, 5, 4, 1, 4, 1, 6, 8, 4, 3, 16, 10, 12, 12, 4, 3, 11, 14, 10, 12, 10, 18, 4, 6, 6, 3, 3, 3, 4, 11, 8, 3, 8, 3, 10, 4, 11, 16, 3, 24, 24, 24, 26, 10, 14, 20, 1, 26, 12, 2, 26, 26, 21, 7, 14, 2, 8, 12, 16, 18, 18, 1, 12, 20, 16, 12, 18, 12, 1, 1, 1, 14],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 26, 26, 26, 26, 26, 26, 26, 26, 26, 1, 1, 26, 26, 26, 26, 26, 26, 26, 26, 26, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 26, 26, 5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1, 1, 26, 26, 5, 26, 1, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 12, 1, 3, 12, 12, 10, 16, 3, 1, 1, 1, 1, 1, 3, 1, 1, 5, 8, 1, 1, 2, 4, 5, 5, 1, 12, 12, 8, 8, 11, 11, 10, 12, 2, 2, 6, 6, 2, 6, 6, 3, 3, 11, 2, 12, 3, 26, 8, 8, 8, 8, 14, 7, 7, 26, 12, 26, 26, 26, 26, 26, 9, 2, 26, 26, 26, 14, 2, 2, 3, 3, 20, 8, 16, 16, 18, 12, 1, 1],
            [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 3, 6, 4, 5, 1, 4, 4, 1, 16, 3, 16, 3, 1, 1, 16, 3, 16, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 1, 1, 2, 10, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
            [16, 16, 1, 1, 16, 16, 1, 1, 1, 1, 1, 16, 16, 16, 1, 16, 7, 12, 4, 4, 3, 3, 5, 13, 6, 16, 3, 3, 9, 5, 4, 2, 1, 2, 1, 1, 2, 1, 16, 16, 10, 10, 4, 4, 2, 20, 20, 8, 1, 1, 20, 2, 2, 8, 1, 8, 1, 3, 3, 3, 3, 4, 4, 4, 5, 1, 6, 6, 12, 3, 3, 3, 3, 3, 3, 3, 8, 8, 6, 6, 6, 6, 16, 16, 16, 16, 26, 7, 26, 7, 26, 7, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 24, 24, 18, 11, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 1, 1, 1, 1, 1, 1, 14, 12, 12, 26, 1, 26, 5, 5, 5, 5, 5, 1, 1, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 2, 12, 12, 8, 22, 22, 22, 22, 22, 22, 1],
            [1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 3, 3, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 5, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 6, 8, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
            [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 7, 1, 12, 4, 2, 6, 5, 3, 12, 11, 13, 6, 16, 16, 3, 7, 3, 9, 1, 12, 5, 6, 4, 1, 2, 1, 5, 5, 3, 4, 4, 1, 1, 2, 1, 1, 4, 4, 4, 1, 1, 9, 9, 4, 4, 4, 6, 6, 5, 12, 4, 1, 20, 1, 5, 16, 1, 3, 3, 4, 5, 1, 8, 4, 1, 12, 1, 7, 3, 3, 3, 1, 2, 2, 5, 5, 4, 4, 1, 1, 1, 1, 5, 11, 1, 6, 1, 6, 1, 8, 4, 1, 3, 16, 10, 12, 3, 3, 3, 3, 3, 3, 3, 3, 17, 17, 1, 12, 3, 10, 3, 1, 1, 1, 1, 3, 7, 7, 3, 3, 8, 15, 11, 3, 10, 6, 14, 14, 10, 12, 10, 12, 6, 16, 26, 8, 4, 6, 4, 3, 2, 2, 4, 4, 1, 3, 7, 6, 16, 3, 4, 4, 6, 6, 6, 8, 2, 1, 4, 4, 4, 4, 1, 7, 11, 4, 3, 6, 2, 6, 4, 4, 11, 13, 11, 11, 26, 26, 12, 26, 3, 3, 16, 16, 8, 8, 26, 3, 5, 26, 13, 5, 17, 17, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 15, 15, 26, 26, 26, 26, 16, 16, 2, 1, 14, 20, 12, 12, 1, 10, 10, 26, 12, 12, 26, 6, 6, 6, 26, 26, 10, 12, 26, 26, 2, 2, 26, 1, 26, 21, 7, 26, 16, 24, 15, 26, 26, 16, 16, 16, 16, 18, 18, 5, 5, 16, 8, 21, 21, 2, 12, 12, 1, 22, 20, 16, 12, 12, 18, 18, 18, 24, 16, 12, 1, 1, 1, 14, 14, 16],
            [],
            []
        ];

    function E(e) {
        return e.substr(0, 1).toUpperCase() + e.substr(1, e.length).toLowerCase()
    }

    function T(e, t) {
        for (; e.length < t;) e = "0" + e;
        return e
    }
    class S extends a.a.Component {
        constructor(e) {
            super(e), this.general_form = null, this.confirm_btn = null, this.confirm_timeout = null, this.state = {
                category: c[0],
                gender: "male",
                firstname: "",
                surname: "",
                birth_date: "",
                face_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                skin_color: 0,
                head_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                hair_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                eyes_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                torso_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                torso2_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                legs_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                feet_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                hands_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                accesories_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                textures_variation: {
                    model_id: 0,
                    texture_id: 0
                },
                hair_color: {
                    col1: 0,
                    col2: 0
                },
                nose_width: 0,
                nose_peak_hight: 0,
                nose_peak_lenght: 0,
                nose_bone_high: 0,
                nose_peak_lowering: 0,
                nose_bone_twist: 0,
                eyebrown_high: 0,
                eyebrown_forward: 0,
                cheeks_bone_high: 0,
                cheeks_bone_width: 0,
                cheeks_width: 0,
                eyes_openning: 0,
                lips_thickness: 0,
                jaw_bone_width: 0,
                jaw_bone_back_lenght: 0,
                chimp_bone_lowering: 0,
                chimp_bone_lenght: 0,
                chimp_bone_width: 0,
                chimp_hole: 0,
                neck_thikness: 0,
                blemishes: {
                    index: 0,
                    opacity: 1
                },
                facial_hair: {
                    index: 0,
                    opacity: 1,
                    color1: 0,
                    color2: 0
                },
                eyebrows: {
                    index: 0,
                    opacity: 1,
                    color1: 0,
                    color2: 0
                },
                ageing: {
                    index: 0,
                    opacity: 1
                },
                makeup: {
                    index: 0,
                    opacity: 1
                },
                blush: {
                    index: 0,
                    opacity: 1,
                    color1: 0,
                    color2: 0
                },
                complexion: {
                    index: 0,
                    opacity: 1
                },
                sun_damage: {
                    index: 0,
                    opacity: 1
                },
                lipstick: {
                    index: 0,
                    opacity: 1,
                    color1: 0,
                    color2: 0
                },
                moles_freckles: {
                    index: 0,
                    opacity: 1
                },
                chest_hair: {
                    index: 0,
                    opacity: 1
                },
                body_blemishes: {
                    index: 0,
                    opacity: 1
                },
                add_body_blemishes: {
                    index: 0,
                    opacity: 1
                }
            }
        }
        componentWillUnmount() {
            this.confirm_timeout && clearTimeout(this.confirm_timeout)
        }
        componentWillUpdate(e, t) {
            this.state.gender !== t.gender && ("female" === t.gender ? t.face_variation.model_id = 45 : t.face_variation.model_id = 0, t.face_variation.texture_id = 0);
            for (let e in this.state)
                if (this.state[e] !== t[e]) try {
                    alt.emit("characterPropertyChanged", e, t[e])
                } catch (e) {}
        }
        tryApply() {
            if (!this.general_form || !this.confirm_btn) return this.setState({
                category: c[0]
            }), void setTimeout(() => {
                this.tryApply()
            });
            if (this.general_form.checkValidity())
                if (this.state.birth_date.match(/\d{2}-\d{2}-\d{4}/i))
                    if (null === this.confirm_timeout) this.confirm_btn.innerText = "NA PEWNO?", this.confirm_timeout = setTimeout(() => {
                        this.confirm_btn && (this.confirm_btn.innerText = "ZATWIERDŹ POSTAĆ"), this.confirm_timeout = null
                    }, 5e3), this.setState({
                        general_error: void 0
                    });
                    else try {
                        alt.emit("confirmCharacterCreation", this.state)
                    } catch (e) {} else this.setState({
                        category: c[0],
                        general_error: "Niepoprawny format daty"
                    });
            else this.setState({
                category: c[0],
                general_error: "Wypełnij wszystkie dane postaci!"
            })
        }
        renderOptions() {
            switch (this.state.category) {
                default:
                case c[0]:
                    return a.a.createElement(a.a.Fragment, null, a.a.createElement("div", {
                        style: {
                            color: "#ef9a9a"
                        }
                    }, this.state.general_error), a.a.createElement("form", {
                        ref: e => this.general_form = e
                    }, a.a.createElement("input", {
                        type: "text",
                        placeholder: "Imię postaci",
                        value: this.state.firstname,
                        onChange: e => this.setState({
                            firstname: E(e.target.value)
                        }),
                        required: !0
                    }), a.a.createElement("input", {
                        type: "text",
                        placeholder: "Nazwisko postaci",
                        value: this.state.surname,
                        onChange: e => this.setState({
                            surname: E(e.target.value)
                        }),
                        required: !0
                    }), a.a.createElement("label", null, "Data urodzenia"), a.a.createElement("label", null, "Data urodzenia (DD-MM-RRRR)"), a.a.createElement("div", {
                        className: "one-liner"
                    }, a.a.createElement("input", {
                        type: "text",
                        maxLength: 10,
                        value: this.state.birth_date,
                        onChange: e => {
                            let t = e.target.value;

                            function n(e) {
                                return e.map((e, t) => {
                                    const n = [
                                            [1, 31],
                                            [1, 12],
                                            [1e3, 3e3]
                                        ],
                                        r = [2, 2, 4];
                                    if (e.length !== r[t]) return e;
                                    let a = parseInt(e),
                                        i = Math.max(n[t][0], Math.min(n[t][1], a));
                                    return a !== i ? T(i.toString(), r[t]) : e
                                }).join("-")
                            }
                            let r = (t = t.replace(/[^\d]/gi, "-")).split("-").filter(e => e.length > 0);
                            if ("-" === t.charAt(t.length - 1)) {
                                for (let e = 0; e < r.length; e++) {
                                    let t = e < 2 ? 2 : 4;
                                    r[e] = T(r[e], t)
                                }
                                t = n(r), r.length < 3 && (t += "-")
                            } else {
                                for (let e = 0; e < r.length; e++) {
                                    let t = e < 2 ? 2 : 4;
                                    if (r[e].length > t) {
                                        let n = r[e].substr(0, t);
                                        r.splice(e + 1, 0, r[e].substring(t, r[e].length)), r[e] = n
                                    }
                                }
                                t = n(r)
                            }
                            this.setState({
                                birth_date: t
                            })
                        },
                        style: {
                            textAlign: "center"
                        },
                        required: !0
                    }))), a.a.createElement("hr", {
                        style: {
                            margin: "15px 0px"
                        }
                    }), a.a.createElement("label", null, "PŁEĆ"), a.a.createElement("div", {
                        className: "one-liner gender-buttons",
                        style: {
                            gridTemplateColumns: "1fr 1fr",
                            gridColumnGap: "20px"
                        }
                    }, a.a.createElement("button", {
                        className: "female" === this.state.gender ? "selected" : "",
                        style: {
                            backgroundColor: "#EC407A",
                            fontWeight: "bold"
                        },
                        onClick: () => {
                            this.setState({
                                gender: "female"
                            })
                        }
                    }, "♀"), a.a.createElement("button", {
                        className: "male" === this.state.gender ? "selected" : "",
                        style: {
                            backgroundColor: "#29B6F6",
                            fontWeight: "bold"
                        },
                        onClick: () => {
                            this.setState({
                                gender: "male"
                            })
                        }
                    }, "♂")));
                case c[1]:
                    return a.a.createElement(a.a.Fragment, null, a.a.createElement(o, {
                        key: "face",
                        label: "TYP",
                        onChange: e => {
                            this.setState({
                                face_variation: e
                            })
                        },
                        variations_data: w[f],
                        initialValues: this.state.face_variation
                    }), a.a.createElement("div", {
                        className: "variation-box",
                        key: "skin_color",
                        style: {
                            gridTemplateColumns: "1fr"
                        }
                    }, a.a.createElement("label", null, "KOLOR SKÓRY"), a.a.createElement("div", {
                        style: {
                            alignSelf: "center",
                            margin: "auto"
                        }
                    }, a.a.createElement(l, {
                        min: 0,
                        max: w[f].length - 1,
                        initialValue: this.state.skin_color,
                        onChange: e => this.setState({
                            skin_color: e
                        })
                    }))), a.a.createElement(o, {
                        key: "head",
                        label: "MASKA",
                        onChange: e => {
                            this.setState({
                                head_variation: e
                            })
                        },
                        variations_data: w[d],
                        initialValues: this.state.head_variation
                    }), a.a.createElement(o, {
                        key: "hair",
                        label: "FRYZURA",
                        onChange: e => {
                            this.setState({
                                hair_variation: e
                            })
                        },
                        variations_data: w[p],
                        initialValues: this.state.hair_variation
                    }), a.a.createElement("div", {
                        key: "hair-color",
                        className: "variation-box"
                    }, a.a.createElement("label", null, "KOLOR WŁOSÓW"), a.a.createElement("div", null, a.a.createElement("label", null, "Główny"), a.a.createElement(l, {
                        min: 0,
                        max: 63,
                        onChange: e => {
                            this.setState({
                                hair_color: {
                                    col1: e,
                                    col2: this.state.hair_color.col2
                                }
                            })
                        },
                        initialValue: this.state.hair_color.col1
                    })), a.a.createElement("div", null, a.a.createElement("label", null, "Drugorzędny"), a.a.createElement(l, {
                        min: 0,
                        max: 63,
                        onChange: e => {
                            this.setState({
                                hair_color: {
                                    col1: this.state.hair_color.col1,
                                    col2: e
                                }
                            })
                        },
                        initialValue: this.state.hair_color.col2
                    }))), a.a.createElement(o, {
                        key: "eyes",
                        label: "AKCESORIA",
                        onChange: e => {
                            this.setState({
                                eyes_variation: e
                            })
                        },
                        variations_data: w[g],
                        initialValues: this.state.eyes_variation
                    }));
                case c[2]:
                    return a.a.createElement(a.a.Fragment, null, a.a.createElement("div", {
                        className: "variation-box",
                        key: "nose"
                    }, a.a.createElement("label", null, "NOS"), a.a.createElement("div", {
                        className: "two-columns"
                    }, a.a.createElement("div", null, "Szerokość"), a.a.createElement(u, {
                        key: "nose_width",
                        initialValue: this.state.nose_width,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            nose_width: e
                        })
                    }), a.a.createElement("div", null, "Wysokość wierzchołka"), a.a.createElement(u, {
                        key: "nose_peak_hight",
                        initialValue: this.state.nose_peak_hight,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            nose_peak_hight: e
                        })
                    }), a.a.createElement("div", null, "Długość wierzchołka"), a.a.createElement(u, {
                        key: "nose_peak_lenght",
                        initialValue: this.state.nose_peak_lenght,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            nose_peak_lenght: e
                        })
                    }), a.a.createElement("div", null, "Wysokość kości"), a.a.createElement(u, {
                        key: "nose_bone_high",
                        initialValue: this.state.nose_bone_high,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            nose_bone_high: e
                        })
                    }), a.a.createElement("div", null, "Obniżenie szczytu"), a.a.createElement(u, {
                        key: "nose_peak_lowering",
                        initialValue: this.state.nose_peak_lowering,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            nose_peak_lowering: e
                        })
                    }), a.a.createElement("div", null, "Skręt kości"), a.a.createElement(u, {
                        key: "nose_bone_twist",
                        initialValue: this.state.nose_bone_twist,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            nose_bone_twist: e
                        })
                    }))), a.a.createElement("div", {
                        className: "variation-box",
                        key: "eyebrows"
                    }, a.a.createElement("label", null, "BRWI"), a.a.createElement("div", {
                        className: "two-columns"
                    }, a.a.createElement("div", null, "Wysokość"), a.a.createElement(u, {
                        initialValue: this.state.eyebrown_high,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            eyebrown_high: e
                        })
                    }), a.a.createElement("div", null, "Wychylenie do przodu"), a.a.createElement(u, {
                        initialValue: this.state.eyebrown_forward,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            eyebrown_forward: e
                        })
                    }))), a.a.createElement("div", {
                        className: "variation-box",
                        key: "cheeks"
                    }, a.a.createElement("label", null, "POLICZKI"), a.a.createElement("div", {
                        className: "two-columns"
                    }, a.a.createElement("div", null, "Wysokość kości"), a.a.createElement(u, {
                        initialValue: this.state.cheeks_bone_high,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            cheeks_bone_high: e
                        })
                    }), a.a.createElement("div", null, "Szerokość kości"), a.a.createElement(u, {
                        initialValue: this.state.cheeks_bone_width,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            cheeks_bone_width: e
                        })
                    }), a.a.createElement("div", null, "Szerokość"), a.a.createElement(u, {
                        initialValue: this.state.cheeks_width,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            cheeks_width: e
                        })
                    }))), a.a.createElement("div", {
                        className: "variation-box",
                        key: "jaw"
                    }, a.a.createElement("label", null, "SZCZĘKA"), a.a.createElement("div", {
                        className: "two-columns"
                    }, a.a.createElement("div", null, "Szerokość"), a.a.createElement(u, {
                        initialValue: this.state.jaw_bone_width,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            jaw_bone_width: e
                        })
                    }), a.a.createElement("div", null, "Wysunięcie"), a.a.createElement(u, {
                        initialValue: this.state.jaw_bone_back_lenght,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            jaw_bone_back_lenght: e
                        })
                    }))), a.a.createElement("div", {
                        className: "variation-box",
                        key: "chimp_bones"
                    }, a.a.createElement("label", null, "PODBRÓDEK"), a.a.createElement("div", {
                        className: "two-columns"
                    }, a.a.createElement("div", null, "Obniżenie"), a.a.createElement(u, {
                        initialValue: this.state.chimp_bone_lowering,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            chimp_bone_lowering: e
                        })
                    }), a.a.createElement("div", null, "Długość"), a.a.createElement(u, {
                        initialValue: this.state.chimp_bone_lenght,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            chimp_bone_lenght: e
                        })
                    }), a.a.createElement("div", null, "Szerokość"), a.a.createElement(u, {
                        initialValue: this.state.chimp_bone_width,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            chimp_bone_width: e
                        })
                    }), a.a.createElement("div", null, "Wielkość przerwy"), a.a.createElement(u, {
                        initialValue: this.state.chimp_hole,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            chimp_hole: e
                        })
                    }))), a.a.createElement("div", {
                        className: "variation-box",
                        key: "others"
                    }, a.a.createElement("label", null, "INNE"), a.a.createElement("div", {
                        className: "two-columns"
                    }, a.a.createElement("div", null, "Otwartość oczu"), a.a.createElement(u, {
                        initialValue: this.state.eyes_openning,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            eyes_openning: e
                        })
                    }), a.a.createElement("div", null, "Grubość warg"), a.a.createElement(u, {
                        initialValue: this.state.lips_thickness,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            lips_thickness: e
                        })
                    }), a.a.createElement("div", null, "Grubość szyji"), a.a.createElement(u, {
                        initialValue: this.state.neck_thikness,
                        min: -1,
                        max: 1,
                        onChange: e => this.setState({
                            neck_thikness: e
                        })
                    }))));
                case c[3]:
                    return a.a.createElement(a.a.Fragment, null, a.a.createElement(s, {
                        key: "blemishes",
                        label: "SKAZY",
                        initialValues: this.state.blemishes,
                        max_index: k.Blemishes,
                        onChange: e => this.setState({
                            blemishes: e
                        })
                    }), a.a.createElement(s, {
                        key: "facial_hair",
                        label: "ZAROST",
                        initialValues: this.state.facial_hair,
                        max_index: k["Facial Hair"],
                        onChange: e => this.setState({
                            facial_hair: e
                        })
                    }), a.a.createElement(s, {
                        key: "eyebrows",
                        label: "BRWI",
                        initialValues: this.state.eyebrows,
                        max_index: k.Eyebrows,
                        onChange: e => this.setState({
                            eyebrows: e
                        })
                    }), a.a.createElement(s, {
                        key: "ageing",
                        label: "WIEK",
                        initialValues: this.state.ageing,
                        max_index: k.Ageing,
                        onChange: e => this.setState({
                            ageing: e
                        })
                    }), a.a.createElement(s, {
                        key: "complexion",
                        label: "CERA",
                        initialValues: this.state.complexion,
                        max_index: k.Complexion,
                        onChange: e => this.setState({
                            complexion: e
                        })
                    }), a.a.createElement(s, {
                        key: "moles_freckles",
                        label: "PIEGI",
                        initialValues: this.state.moles_freckles,
                        max_index: k["Moles/Freckles"],
                        onChange: e => this.setState({
                            moles_freckles: e
                        })
                    }), a.a.createElement(s, {
                        key: "body_blemishes",
                        label: "SKAZY NA CIELE",
                        initialValues: this.state.body_blemishes,
                        max_index: k["Body Blemishes"],
                        onChange: e => this.setState({
                            body_blemishes: e
                        })
                    }));
                case c[4]:
                    return a.a.createElement(a.a.Fragment, null, a.a.createElement(s, {
                        key: "makeup",
                        label: "MAKIJAŻ",
                        initialValues: this.state.makeup,
                        max_index: k.Makeup,
                        onChange: e => this.setState({
                            makeup: e
                        })
                    }), a.a.createElement(s, {
                        key: "blush",
                        label: "RUMIENIEC",
                        initialValues: this.state.blush,
                        max_index: k.Blush,
                        onChange: e => this.setState({
                            blush: e
                        })
                    }), a.a.createElement(s, {
                        key: "lipstick",
                        label: "SZMINKA",
                        initialValues: this.state.lipstick,
                        max_index: k.Lipstick,
                        onChange: e => this.setState({
                            lipstick: e
                        })
                    }), a.a.createElement(s, {
                        key: "sun_damage",
                        label: "OPARZENIA SŁONECZNE",
                        initialValues: this.state.sun_damage,
                        max_index: k["Sun Damage"],
                        onChange: e => this.setState({
                            sun_damage: e
                        })
                    }));
                case c[5]:
                    return a.a.createElement(a.a.Fragment, null, a.a.createElement(o, {
                        key: "torso",
                        label: "RĘCE",
                        onChange: e => {
                            this.setState({
                                torso_variation: e
                            })
                        },
                        variations_data: w[m],
                        initialValues: this.state.torso_variation
                    }), a.a.createElement(o, {
                        key: "accesories",
                        label: "KOSZULKA",
                        onChange: e => {
                            this.setState({
                                accesories_variation: e
                            })
                        },
                        variations_data: w[b],
                        initialValues: this.state.accesories_variation
                    }), a.a.createElement(o, {
                        key: "torso2",
                        label: "TUŁÓW",
                        onChange: e => {
                            this.setState({
                                torso2_variation: e
                            })
                        },
                        variations_data: w[x],
                        initialValues: this.state.torso2_variation
                    }), a.a.createElement(o, {
                        key: "legs",
                        label: "SPODNIE",
                        onChange: e => {
                            this.setState({
                                legs_variation: e
                            })
                        },
                        variations_data: w[h],
                        initialValues: this.state.legs_variation
                    }), a.a.createElement(o, {
                        key: "feet",
                        label: "BUTY",
                        onChange: e => {
                            this.setState({
                                feet_variation: e
                            })
                        },
                        variations_data: w[y],
                        initialValues: this.state.feet_variation
                    }), a.a.createElement(o, {
                        key: "hands",
                        label: "PLECAK",
                        onChange: e => {
                            this.setState({
                                hands_variation: e
                            })
                        },
                        variations_data: w[v],
                        initialValues: this.state.hands_variation
                    }));
                case c[6]:
                    return a.a.createElement(a.a.Fragment, null, a.a.createElement(o, {
                        key: "textures",
                        label: "ZNACZKI",
                        onChange: e => {
                            this.setState({
                                textures_variation: e
                            })
                        },
                        variations_data: w[_],
                        initialValues: this.state.textures_variation
                    }))
            }
        }
        render() {
            return a.a.createElement("div", {
                className: "creator-main"
            }, a.a.createElement("nav", null, c.map((e, t) => a.a.createElement("button", {
                className: this.state.category === e ? "current" : "",
                onClick: () => {
                    this.setState({
                        category: e
                    })
                },
                key: t
            }, e))), a.a.createElement("button", {
                className: "apply-button",
                ref: e => this.confirm_btn = e,
                onClick: this.tryApply.bind(this)
            }, "ZATWIERDŹ POSTAĆ"), a.a.createElement("div", {
                className: "options"
            }, this.renderOptions()))
        }
    }
    n(12);
    class C extends a.a.Component {
        constructor(e) {
            super(e), this.state = {}
        }
        makeChoice(e) {
            try {
                alt.emit("character_choice", e)
            } catch (e) {}
        }
        render() {
            const e = {
                fontSize: "50px",
                fontWeight: "bold"
            };
            let t = [];
            for (let n = 0; n < this.props.slots; n++)
                if (n >= this.props.characters_properties.length) t.push(a.a.createElement("div", {
                    key: n,
                    className: "empty",
                    onClick: () => this.makeChoice(n)
                }, a.a.createElement("div", null, "STWÓRZ NOWĄ POSTAĆ"), a.a.createElement("span", {
                    style: e
                }, "+")));
                else {
                    let r = this.props.characters_properties[n];
                    t.push(a.a.createElement("div", {
                        key: n,
                        onClick: () => this.makeChoice(n)
                    }, a.a.createElement("header", null, r.firstname, a.a.createElement("br", null), r.surname), a.a.createElement("div", null, r.birth_date), "male" === r.gender ? a.a.createElement("span", {
                        style: e
                    }, "♂") : a.a.createElement("span", {
                        style: e
                    }, "♀")))
                } return a.a.createElement("div", {
                className: "choicer"
            }, t)
        }
    }
    n(13);
    Object(i.render)(a.a.createElement(class extends a.a.Component {
        constructor(e) {
            super(e), this.state = {
                page: 0,
                slots: 0,
                characters_properties: []
            }
        }
        componentDidMount() {
            try {
                alt.on("show_choicer", (e, t) => {
                    let n = document.getElementById("main_view");
                    n && (n.style.display = "block"), this._showChoicer(e, t)
                }), alt.on("toogle_display", e => {
                    let t = document.getElementById("main_view");
                    t && (t.style.display = e ? "block" : "none")
                }), setTimeout(function() {
                    try {
                        alt.emit("CC_viewLoaded")
                    } catch (e) {}
                }, 100)
            } catch (e) {}
        }
        _showChoicer(e, t) {
            this.setState({
                page: 1,
                slots: e,
                characters_properties: t
            })
        }
        render() {
            switch (this.state.page) {
                default:
                case 0:
                    return a.a.createElement(S, null);
                case 1:
                    return a.a.createElement(C, {
                        slots: this.state.slots,
                        characters_properties: this.state.characters_properties
                    })
            }
        }
    }, null), document.getElementById("main_view"))
}]);