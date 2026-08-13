/* Equilibrium — js/core/state.js
   Save/load, XP, levels, streaks, achievements, coverage toggles, SR scheduling.
   Exposes: window.ECON.State */
(function (root) {
  "use strict";

  var ECON = root.ECON = root.ECON || {};
  var U = ECON.U;
  var S = {};

  S.KEY = "equilibrium.save.v1";
  S.BUILD = "0.2.0";

  /* ── economy constants (brief §9) ────────────────────────────────── */
  S.XP_PER_CORRECT   = 10;      // × difficulty × streak multiplier
  S.LEVEL_CAP        = 60;
  S.COIN_RATE        = 0.75;    // currency = run XP × 0.75
  S.MIN_READ_MS      = 1200;    // faster than this earns nothing
  S.MIN_ACC_BONUS    = 0.50;    // completion bonus withheld below this
  S.REFERENCE_PENALTY = 0.25;   // the economics exam supplies no formula sheet → 25%
  S.SHORT_MIN_CHARS  = 20;      // §4.4

  S.levelCost = function (n) { return Math.round(115 * Math.pow(n, 1.5)); };

  S.totalXpForLevel = function (n) {
    var t = 0;
    for (var i = 1; i < n; i++) t += S.levelCost(i);
    return t;
  };

  S.levelFromXp = function (xp) {
    var lv = 1, need = S.levelCost(1), acc = 0;
    while (lv < S.LEVEL_CAP && xp >= acc + need) { acc += need; lv++; need = S.levelCost(lv); }
    return { level: lv, into: xp - acc, need: lv >= S.LEVEL_CAP ? 0 : need };
  };

  /* Streak multiplier: ×1 → ×3 in half steps every 5 correct. */
  S.streakMult = function (streak) {
    return Math.min(3, 1 + Math.floor(streak / 5) * 0.5);
  };

  /* ── the save object ─────────────────────────────────────────────── */
  function fresh() {
    return {
      v: 1,
      build: S.BUILD,
      created: Date.now(),
      xp: 0,
      coins: 0,
      theme: "ledger",
      seen: {},            // questionId -> {n, wrong, last}
      missed: {},          // questionId -> {n, last}  (Mistake Rehab pool)
      cards: {},           // cardId -> {box, due, n, lapses, last}
      shortLog: {},        // shortId -> lastPaidDayKey  (§4.4 once per day)
      bests: {},           // modeId -> best score
      runs: 0,
      correct: 0,
      answered: 0,
      timeMs: 0,
      streakDays: 0,
      lastDay: null,
      bestStreakDays: 0,
      achievements: {},    // achId -> unlockedAt
      coverage: {},        // packId -> true when HIDDEN
      owned: { themes: ["ledger"], avatars: ["📊", "⚖️"], boosts: {} },
      avatar: "📊",
      difficulty: "standard",
      inventory: { fifty: 1, skip: 1, freeze: 0, shield: 1, insight: 0, double: 0, revive: 0 },
      arcade: { bests: {}, ticketUntil: 0 },
      bosses: {},          // bossId -> {cleared, best}
      settings: { sound: true, haptics: true, reduceMotion: false, hintsInResponse: true },
      diagramSeen: {},
      genSeeds: {}
    };
  }

  S.data = fresh();
  S._dirty = false;
  S._listeners = [];

  S.onChange = function (fn) { S._listeners.push(fn); return function () { S._listeners = S._listeners.filter(function (f) { return f !== fn; }); }; };
  S.emit = function () { S._listeners.forEach(function (f) { try { f(S.data); } catch (e) { console.error(e); } }); };

  /* F1: an import must not be clobbered by a pagehide flush of the old
     in-memory save. `_frozen` blocks every write path, not just save(). */
  S._frozen = false;

  S.load = function () {
    try {
      var raw = root.localStorage && root.localStorage.getItem(S.KEY);
      if (!raw) { S.data = fresh(); return false; }
      var obj = JSON.parse(raw);
      S.data = migrate(obj);
      return true;
    } catch (e) {
      console.warn("save load failed, starting fresh", e);
      S.data = fresh();
      return false;
    }
  };

  function migrate(obj) {
    var base = fresh();
    if (!obj || typeof obj !== "object") return base;
    Object.keys(base).forEach(function (k) {
      if (obj[k] === undefined) return;
      if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) && typeof obj[k] === "object" && !Array.isArray(obj[k])) {
        base[k] = Object.assign({}, base[k], obj[k]);
      } else {
        base[k] = obj[k];
      }
    });
    base.build = S.BUILD;
    return base;
  }

  S.save = function () {
    if (S._frozen) return false;
    try {
      root.localStorage.setItem(S.KEY, JSON.stringify(S.data));
      S._dirty = false;
      return true;
    } catch (e) {
      console.warn("save failed", e);
      return false;
    }
  };

  S.saveSoon = (function () {
    var t = null;
    return function () {
      S._dirty = true;
      if (t) return;
      t = setTimeout(function () { t = null; S.save(); }, 400);
    };
  })();

  S.freeze  = function () { S._frozen = true; };      // used before an import reload (F1)
  S.reset   = function () { S.data = fresh(); S.save(); S.emit(); };

  S.exportJSON = function () {
    return JSON.stringify({ app: "equilibrium", build: S.BUILD, exported: Date.now(), save: S.data }, null, 2);
  };

  S.importJSON = function (text) {
    var obj = JSON.parse(text);
    var save = obj && obj.save ? obj.save : obj;
    if (!save || typeof save !== "object" || typeof save.xp !== "number") throw new Error("Not a Equilibrium save file.");
    S.data = migrate(save);
    // Write immediately and *then* freeze, so nothing can flush stale state
    // over the top before the reload lands. (defect F1)
    root.localStorage.setItem(S.KEY, JSON.stringify(S.data));
    S.freeze();
    return true;
  };

  /* ── daily streak ────────────────────────────────────────────────── */
  S.touchDay = function () {
    var today = U.dayKey();
    var d = S.data;
    if (d.lastDay === today) return false;
    if (d.lastDay && U.daysBetween(d.lastDay, today) === 1) d.streakDays = (d.streakDays || 0) + 1;
    else d.streakDays = 1;
    d.lastDay = today;
    d.bestStreakDays = Math.max(d.bestStreakDays || 0, d.streakDays);
    S.saveSoon();
    return true;
  };

  /* ── question history ────────────────────────────────────────────── */
  S.markSeen = function (id, correct) {
    var s = S.data.seen[id] || (S.data.seen[id] = { n: 0, wrong: 0, last: 0 });
    s.n++; s.last = Date.now();
    if (!correct) {
      s.wrong++;
      var m = S.data.missed[id] || (S.data.missed[id] = { n: 0, last: 0 });
      m.n++; m.last = Date.now();
    } else if (S.data.missed[id]) {
      // two clean answers retires it from the rehab pool
      S.data.missed[id].n--;
      if (S.data.missed[id].n <= 0) delete S.data.missed[id];
    }
    S.saveSoon();
  };

  S.missedIds = function () { return Object.keys(S.data.missed); };

  /* ── spaced repetition (Leitner, 5 boxes) ────────────────────────── */
  S.BOX_DAYS = [0, 1, 3, 7, 16];

  S.cardState = function (id) {
    return S.data.cards[id] || { box: 0, due: 0, n: 0, lapses: 0, last: 0 };
  };

  S.reviewCard = function (id, grade) {   // grade: 0 again, 1 hard, 2 good, 3 easy
    var c = S.data.cards[id] || (S.data.cards[id] = { box: 0, due: 0, n: 0, lapses: 0, last: 0 });
    c.n++; c.last = Date.now();
    if (grade === 0)      { c.box = 0; c.lapses++; }
    else if (grade === 1) { c.box = Math.max(0, c.box - 1); }
    else if (grade === 2) { c.box = Math.min(S.BOX_DAYS.length - 1, c.box + 1); }
    else                  { c.box = Math.min(S.BOX_DAYS.length - 1, c.box + 2); }
    var days = S.BOX_DAYS[c.box];
    c.due = Date.now() + days * 86400000;
    S.saveSoon();
    return c;
  };

  S.dueCards = function (ids) {
    var now = Date.now();
    return ids.filter(function (id) {
      var c = S.data.cards[id];
      return !c || c.due <= now;
    });
  };

  /* ── short-answer daily payment ledger (§4.4) ────────────────────── */
  S.shortPaidToday = function (id) { return S.data.shortLog[id] === U.dayKey(); };
  S.markShortPaid  = function (id) { S.data.shortLog[id] = U.dayKey(); S.saveSoon(); };

  /* ── achievements ────────────────────────────────────────────────── */
  S.unlock = function (id) {
    if (S.data.achievements[id]) return false;
    S.data.achievements[id] = Date.now();
    S.saveSoon();
    return true;
  };
  S.has = function (id) { return !!S.data.achievements[id]; };

  /* ── coverage ────────────────────────────────────────────────────── */
  S.isHidden = function (packId) { return !!S.data.coverage[packId]; };
  S.setHidden = function (packId, hidden) {
    if (hidden) S.data.coverage[packId] = true; else delete S.data.coverage[packId];
    S.saveSoon(); S.emit();
  };

  /* ── inventory ────────────────────────────────────────────────────
     Power-ups are consumables bought with credits, which are themselves
     earned from XP. Nothing in here creates XP, and nothing in here calls
     UI.award — see the header of js/data/shop.js for why that matters. */

  S.powerupCount = function (id) {
    return (S.data.inventory && S.data.inventory[id]) || 0;
  };

  /* Returns true only if one was actually spent. Callers must check: a
     power-up whose effect fires without the count going down is free. */
  S.usePowerup = function (id) {
    if (!S.data.inventory) S.data.inventory = {};
    if ((S.data.inventory[id] || 0) <= 0) return false;
    S.data.inventory[id]--;
    S.saveSoon();
    return true;
  };

  S.grantPowerup = function (id, n) {
    if (!S.data.inventory) S.data.inventory = {};
    S.data.inventory[id] = (S.data.inventory[id] || 0) + (n || 1);
    S.saveSoon();
  };

  /* ── difficulty ──────────────────────────────────────────────────── */
  S.difficulty = function () {
    var list = (ECON.DATA && ECON.DATA.difficulties) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === S.data.difficulty) return list[i];
    return list[0] || { id: "standard", name: "Standard", xp: 1, timeScale: 1, lock: [] };
  };

  /* The only multiplier the reward path will accept. Clamped hard, because a
     multiplier is the one lever that could quietly turn a fair economy into
     an unfair one, and a typo in a data file should not be able to do it. */
  S.MAX_MULTIPLIER = 4;
  S.runMultiplier = function (boostActive) {
    var m = S.difficulty().xp || 1;
    if (boostActive) m *= 2;
    return Math.max(1, Math.min(S.MAX_MULTIPLIER, m));
  };

  /* ── level titles ────────────────────────────────────────────────── */
  S.levelTitle = function (lv) {
    var t = (ECON.DATA && ECON.DATA.levelTitles) || [];
    if (!t.length) return "";
    return t[Math.min(t.length - 1, Math.max(0, (lv || 1) - 1))];
  };

  /* ── per-topic mastery ───────────────────────────────────────────────
     A percentage derived from what has actually been answered, so it cannot
     be bought and does not move when a coverage pack hides content. */
  S.mastery = function (modId) {
    var seen = 0, correct = 0;
    var d = S.data.seen;
    var bank = ECON.Bank ? ECON.Bank.all("mcq") : [];
    for (var i = 0; i < bank.length; i++) {
      var q = bank[i];
      if (q.mod !== modId) continue;
      var rec = d[q.id];
      if (!rec) continue;
      seen++;
      if ((rec.n || 0) > (rec.wrong || 0)) correct++;
    }
    var total = 0;
    for (var j = 0; j < bank.length; j++) if (bank[j].mod === modId) total++;
    if (!total) return 0;
    // Coverage of the topic and accuracy on it, weighted evenly. Answering
    // three questions perfectly is not mastery of a topic with sixty.
    var coverage = seen / total;
    var accuracy = seen ? correct / seen : 0;
    return Math.round(coverage * accuracy * 100);
  };

  S.masteryTier = function (pct) {
    var tiers = (ECON.DATA && ECON.DATA.masteryTiers) || [];
    var out = tiers[0] || null;
    for (var i = 0; i < tiers.length; i++) if (pct >= tiers[i].at) out = tiers[i];
    return out;
  };

  ECON.State = S;
  if (typeof module !== "undefined" && module.exports) module.exports = S;
})(typeof window !== "undefined" ? window : globalThis);
