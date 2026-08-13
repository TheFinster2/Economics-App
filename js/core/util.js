/* Equilibrium — js/core/util.js
   DOM helpers, sampling, formatting, numeric parsing.
   Exposes: window.ECON.U   (also module.exports under Node, for tests) */
(function (root) {
  "use strict";

  var ECON = root.ECON = root.ECON || {};
  var U = {};

  /* ── DOM ─────────────────────────────────────────────────────────── */
  U.$  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  U.$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  U.el = function (tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
      var v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "text") n.textContent = v;
      else if (k === "dataset") { for (var d in v) n.dataset[d] = v[d]; }
      else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
      else if (v === true) n.setAttribute(k, "");
      else n.setAttribute(k, v);
    }
    if (kids != null) {
      (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
        if (c === null || c === undefined || c === false) return;
        n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
      });
    }
    return n;
  };

  U.frag = function (kids) {
    var f = document.createDocumentFragment();
    (kids || []).forEach(function (c) { if (c) f.appendChild(c); });
    return f;
  };

  U.clear = function (n) { while (n && n.firstChild) n.removeChild(n.firstChild); return n; };

  U.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  U.on = function (n, ev, fn, opt) { n.addEventListener(ev, fn, opt); return function () { n.removeEventListener(ev, fn, opt); }; };

  /* ── random / sampling ───────────────────────────────────────────── */
  /* Deterministic PRNG (mulberry32) so generators and tests can be seeded. */
  U.rng = function (seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  U.rand = function (rnd) { return typeof rnd === "function" ? rnd() : Math.random(); };
  U.randInt = function (lo, hi, rnd) { return lo + Math.floor(U.rand(rnd) * (hi - lo + 1)); };
  U.pick = function (arr, rnd) { return arr[Math.floor(U.rand(rnd) * arr.length)]; };

  U.shuffle = function (arr, rnd) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(U.rand(rnd) * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  U.sample = function (arr, n, rnd) { return U.shuffle(arr, rnd).slice(0, Math.max(0, Math.min(n, arr.length))); };

  U.uniq = function (arr) {
    var seen = Object.create(null), out = [];
    for (var i = 0; i < arr.length; i++) { var k = String(arr[i]); if (!seen[k]) { seen[k] = 1; out.push(arr[i]); } }
    return out;
  };

  U.groupBy = function (arr, fn) {
    var m = {};
    arr.forEach(function (x, i) { var k = fn(x, i); (m[k] = m[k] || []).push(x); });
    return m;
  };

  U.sum = function (arr) { return arr.reduce(function (a, b) { return a + b; }, 0); };

  U.clamp = function (v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; };

  /* ── formatting ──────────────────────────────────────────────────── */
  U.fmtInt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };

  /* Compact form for the top bar. A five-digit XP total rendered in full
     ("284,500 XP") is wide enough to push the brand out of the header on a
     360px phone, which is exactly what it did. Chips get this; everywhere
     with room keeps fmtInt. */
  U.fmtCompact = function (n) {
    n = Math.round(n || 0);
    var a = Math.abs(n);
    if (a < 10000) return U.fmtInt(n);
    if (a < 1000000) {
      var k = n / 1000;
      return (a < 100000 ? k.toFixed(1).replace(/\.0$/, "") : String(Math.round(k))) + "k";
    }
    return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  };

  U.fmtNum = function (n, dp) {
    if (!isFinite(n)) return String(n);
    var s = (dp === undefined) ? String(Math.round(n * 1e6) / 1e6) : n.toFixed(dp);
    return s;
  };

  U.fmtTime = function (ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    var m = Math.floor(s / 60);
    return m + ":" + String(s % 60).padStart(2, "0");
  };

  U.pct = function (a, b) { return b ? Math.round((a / b) * 100) : 0; };

  U.plural = function (n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); };

  U.dayKey = function (t) {
    var d = new Date(t === undefined ? Date.now() : t);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };

  U.daysBetween = function (aKey, bKey) {
    var a = new Date(aKey + "T00:00:00"), b = new Date(bKey + "T00:00:00");
    return Math.round((b - a) / 86400000);
  };

  /* ── numeric answer parsing ──────────────────────────────────────────
     Accepts: 0.25 | .25 | 25% | 1/4 | 1 in 4 | 1:3 (as a ratio share) |
              ¼ ½ ¾ | 3 x 10^4 | 3e4 | 1,250
     Returns a Number, or NaN. Brief §5.3.                               */
  var VULGAR = { "¼": 0.25, "½": 0.5, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3,
                 "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
                 "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8, "⅙": 1 / 6, "⅚": 5 / 6 };

  U.parseNum = function (raw) {
    if (typeof raw === "number") return raw;
    if (raw == null) return NaN;
    var s = String(raw).trim().toLowerCase();
    if (!s) return NaN;

    s = s.replace(/[−–—]/g, "-")   // unicode minus / dashes
         .replace(/[×✕]/g, "x")          // × → x
         .replace(/\s+/g, " ");

    // bare vulgar fraction, possibly with a leading whole number
    var vf = s.match(/^(-?\d+)?\s*([¼-¾⅓-⅞])$/);
    if (vf) {
      var whole = vf[1] ? parseFloat(vf[1]) : 0;
      var frac = VULGAR[vf[2]];
      if (frac === undefined) return NaN;
      return whole < 0 ? whole - frac : whole + frac;
    }

    var isPct = /%$/.test(s) || /\spercent$/.test(s);
    if (isPct) s = s.replace(/\s*percent$/, "").replace(/%$/, "").trim();

    // "1 in 4"  /  "1 out of 4"  /  "one in four" (digits only)
    var inm = s.match(/^(-?[\d.,]+)\s*(?:in|out of)\s*([\d.,]+)$/);
    if (inm) {
      var a = num(inm[1]), b = num(inm[2]);
      return (isFinite(a) && isFinite(b) && b !== 0) ? (isPct ? a / b / 100 : a / b) : NaN;
    }

    // "a/b"
    var fm = s.match(/^(-?[\d.,]+)\s*\/\s*([\d.,]+)$/);
    if (fm) {
      var fa = num(fm[1]), fb = num(fm[2]);
      return (isFinite(fa) && isFinite(fb) && fb !== 0) ? (isPct ? fa / fb / 100 : fa / fb) : NaN;
    }

    // scientific: 3 x 10^4 | 3*10^4 | 3e4 | 3 x 10-4
    var sm = s.match(/^(-?[\d.,]+)\s*(?:x|\*)\s*10\s*\^?\s*\(?(-?\d+)\)?$/);
    if (sm) {
      var m0 = num(sm[1]), e0 = parseInt(sm[2], 10);
      return isFinite(m0) ? m0 * Math.pow(10, e0) : NaN;
    }

    var v = num(s);
    if (!isFinite(v)) return NaN;
    return isPct ? v / 100 : v;

    function num(t) {
      t = String(t).replace(/,/g, "").trim();
      if (!/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/.test(t)) return NaN;
      return parseFloat(t);
    }
  };

  /* Ratio strings: "9:3:3:1". Normalised by dividing through by the GCD. */
  U.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };

  U.normaliseRatio = function (parts) {
    var nums = parts.map(Number).filter(function (n) { return isFinite(n); });
    if (!nums.length) return "";
    var g = nums.reduce(function (a, b) { return U.gcd(a, b); }, 0) || 1;
    return nums.map(function (n) { return n / g; }).join(":");
  };

  U.parseRatio = function (raw) {
    if (raw == null) return "";
    var parts = String(raw).trim().split(/\s*[:：]\s*/);
    if (parts.length < 2) return "";
    if (!parts.every(function (p) { return /^\d+(\.\d+)?$/.test(p); })) return "";
    return U.normaliseRatio(parts);
  };

  U.ratioEq = function (a, b) {
    var na = U.parseRatio(a), nb = U.parseRatio(b);
    return !!na && na === nb;
  };

  U.numEq = function (a, b, tol) {
    var x = U.parseNum(a), y = U.parseNum(b);
    if (!isFinite(x) || !isFinite(y)) return false;
    var t = (tol === undefined) ? 1e-6 : tol;
    var scale = Math.max(1, Math.abs(y));
    return Math.abs(x - y) <= Math.max(t, t * scale);
  };

  /* ── text ────────────────────────────────────────────────────────── */
  U.norm = function (s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
      .replace(/[^a-z0-9'\s-]/g, " ")
      .replace(/\s+/g, " ").trim();
  };

  U.words = function (s) { return U.norm(s).split(" ").filter(Boolean); };

  U.bigrams = function (s) {
    var w = U.words(s), out = [];
    for (var i = 0; i < w.length - 1; i++) out.push(w[i] + " " + w[i + 1]);
    return out;
  };

  /* Jaccard similarity over bigrams — the near-duplicate check (D2: unigrams
     pass exact opposites, so this deliberately uses bigrams). */
  U.bigramSim = function (a, b) {
    var A = U.uniq(U.bigrams(a)), B = U.uniq(U.bigrams(b));
    if (!A.length || !B.length) return 0;
    var setB = Object.create(null); B.forEach(function (x) { setB[x] = 1; });
    var inter = 0; A.forEach(function (x) { if (setB[x]) inter++; });
    return inter / (A.length + B.length - inter);
  };

  U.titleCase = function (s) { return String(s).replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); };

  U.trunc = function (s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

  /* ── misc ────────────────────────────────────────────────────────── */
  U.hash = function (s) {
    var h = 2166136261 >>> 0;
    s = String(s);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  };

  U.debounce = function (fn, ms) {
    var t;
    return function () { var a = arguments, self = this; clearTimeout(t); t = setTimeout(function () { fn.apply(self, a); }, ms); };
  };

  U.raf = function (fn) { return (root.requestAnimationFrame || function (f) { return setTimeout(f, 16); })(fn); };

  U.MODULES = [
    { id: "P1", year: 11, name: "Introduction to Economics" },
    { id: "P2", year: 11, name: "Consumers and Business" },
    { id: "P3", year: 11, name: "Markets" },
    { id: "P4", year: 11, name: "Labour Markets" },
    { id: "P5", year: 11, name: "Financial Markets" },
    { id: "P6", year: 11, name: "Government and the Economy" },
    { id: "H1", year: 12, name: "The Global Economy" },
    { id: "H2", year: 12, name: "Australia's Place in the Global Economy" },
    { id: "H3", year: 12, name: "Economic Issues" },
    { id: "H4", year: 12, name: "Economic Policies and Management" }
  ];

  U.moduleName = function (id) {
    for (var i = 0; i < U.MODULES.length; i++) if (U.MODULES[i].id === id) return U.MODULES[i].name;
    return id;
  };
  U.moduleYear = function (id) {
    for (var i = 0; i < U.MODULES.length; i++) if (U.MODULES[i].id === id) return U.MODULES[i].year;
    return 12;
  };

  ECON.U = U;
  if (typeof module !== "undefined" && module.exports) module.exports = U;
})(typeof window !== "undefined" ? window : globalThis);
