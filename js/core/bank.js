/* Equilibrium — js/core/bank.js
   Question discovery, coverage filtering, adaptive draw.

   Two rules from an earlier app in this lineage’s scar tissue (brief §2):

   2. Content is DISCOVERED, not listed. Bank.all() scans ECON.DATA for keys
      matching a pattern. A hand-written list silently lost 87 flashcards when
      a new file sorted before the one that declared the array. (D4)

   3. all() and active() are different functions. all() is everything —
      achievement targets and totals measure against it. active() is what gets
      asked after the coverage toggles. Mixing them up lets a student shorten
      a collection by hiding content.

   Exposes: window.ECON.Bank */
(function (root) {
  "use strict";

  var ECON = root.ECON = root.ECON || {};
  var U = ECON.U, S = ECON.State;
  var Bank = {};

  ECON.DATA = ECON.DATA || {};

  /* Key patterns. Any data file that declares  ECON.DATA.mcq_m9 = [...]  is
     picked up with no edit anywhere else. */
  var PATTERNS = {
    mcq:      /^mcq_/,
    card:     /^cards_/,
    short:    /^short_/,
    sequence: /^seq_/,
    sort:     /^sort_/,
    dataset:  /^data_/,
    calc:     /^calc_/,
    shift:    /^shift_/
  };

  var cache = {};

  Bank.invalidate = function () { cache = {}; };

  function discover(kind) {
    if (cache[kind]) return cache[kind];
    var re = PATTERNS[kind];
    if (!re) throw new Error("unknown bank kind: " + kind);
    var out = [];
    Object.keys(ECON.DATA).sort().forEach(function (key) {
      if (!re.test(key)) return;
      var v = ECON.DATA[key];
      if (!Array.isArray(v)) { console.warn("ECON.DATA." + key + " matches the " + kind + " pattern but is not an array"); return; }
      v.forEach(function (item, i) {
        if (!item || typeof item !== "object") return;
        item._src = key;
        item._kind = kind;
        if (!item.id) item.id = key + "-" + i;
        out.push(item);
      });
    });
    cache[kind] = out;
    return out;
  }

  Bank.kinds = Object.keys(PATTERNS);

  /* ── the complete bank ───────────────────────────────────────────── */
  Bank.all = function (kind) { return discover(kind).slice(); };

  Bank.byId = function (kind, id) {
    var list = discover(kind);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };

  Bank.count = function (kind) { return discover(kind).length; };

  Bank.counts = function () {
    var o = {};
    Bank.kinds.forEach(function (k) { o[k] = discover(k).length; });
    o.diagram = Object.keys(ECON.DATA.diagrams || {}).length;
    return o;
  };

  /* ── the active bank (after coverage) ────────────────────────────── */
  Bank.active = function (kind, filter) {
    var list = discover(kind).filter(function (item) {
      return !ECON.Coverage.isHiddenItem(item);
    });
    if (filter) list = list.filter(filter);
    return list;
  };

  Bank.activeByModule = function (kind, mod) {
    return Bank.active(kind, function (q) { return q.mod === mod; });
  };

  /* ── adaptive draw ───────────────────────────────────────────────────
     Weight by: never seen > previously missed > seen and correct, and by how
     long ago. Difficulty is nudged toward the student's recent accuracy.     */
  Bank.draw = function (kind, n, opts) {
    opts = opts || {};
    var pool = Bank.active(kind, opts.filter);
    if (!pool.length) return [];

    var seen = S.data.seen, missed = S.data.missed;
    var now = Date.now();
    var targetDiff = opts.difficulty || null;

    var scored = pool.map(function (q) {
      var s = seen[q.id];
      var w = 1;
      if (!s) w = 3.2;
      else {
        var ageDays = (now - (s.last || 0)) / 86400000;
        w = 0.5 + Math.min(2.2, ageDays * 0.35);
        if (missed[q.id]) w += 1.6 * Math.min(3, missed[q.id].n);
        w += Math.min(1.2, (s.wrong || 0) * 0.4);
      }
      if (targetDiff && q.diff) w *= 1 / (1 + Math.abs(q.diff - targetDiff) * 0.6);
      if (opts.excludeIds && opts.excludeIds.indexOf(q.id) >= 0) w = 0;
      return { q: q, w: Math.max(0, w) };
    }).filter(function (x) { return x.w > 0; });

    var out = [];
    var total = scored.reduce(function (a, b) { return a + b.w; }, 0);
    var guard = 0;
    while (out.length < Math.min(n, scored.length) && guard++ < n * 60) {
      var r = Math.random() * total, acc = 0, chosen = -1;
      for (var i = 0; i < scored.length; i++) {
        acc += scored[i].w;
        if (r <= acc) { chosen = i; break; }
      }
      if (chosen < 0) chosen = scored.length - 1;
      var picked = scored.splice(chosen, 1)[0];
      total -= picked.w;
      out.push(picked.q);
    }
    return out;
  };

  /* Endless supply for Rapid Fire / Survival — reshuffles rather than repeating
     the same question twice in a row. */
  Bank.stream = function (kind, opts) {
    var used = [];
    return {
      next: function () {
        var got = Bank.draw(kind, 1, Object.assign({}, opts, { excludeIds: used.slice(-25) }));
        if (!got.length) { used = []; got = Bank.draw(kind, 1, opts); }
        if (!got.length) return null;
        used.push(got[0].id);
        return got[0];
      }
    };
  };

  /* ── stats ───────────────────────────────────────────────────────── */
  Bank.moduleStats = function () {
    var out = {};
    U.MODULES.forEach(function (m) { out[m.id] = { total: 0, seen: 0, correct: 0, missed: 0 }; });
    discover("mcq").forEach(function (q) {
      var m = out[q.mod]; if (!m) return;
      m.total++;
      var s = S.data.seen[q.id];
      if (s) { m.seen++; if (!S.data.missed[q.id]) m.correct++; }
      if (S.data.missed[q.id]) m.missed++;
    });
    return out;
  };

  Bank.diagrams = function () {
    var d = ECON.DATA.diagrams || {};
    return Object.keys(d).map(function (k) { return d[k]; });
  };

  Bank.activeDiagrams = function () {
    return Bank.diagrams().filter(function (d) { return !ECON.Coverage.isHiddenItem(d); });
  };

  ECON.Bank = Bank;
})(typeof window !== "undefined" ? window : globalThis);
