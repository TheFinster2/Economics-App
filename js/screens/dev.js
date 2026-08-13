/* Equilibrium — js/screens/dev.js
   A developer panel for testing, reached at #/dev only. There is no link to it
   anywhere in the UI, and nothing here is reachable by ordinary play.

   IMPORTANT: everything in here writes to State DIRECTLY and never through
   UI.award(). That matters. award() is the app's single reward path and the
   thing exploit.js measures; if a debug button went through it, "the bad bot
   earns 0 XP" would stop being a property of the app and start being a
   property of which buttons the test happened to press.

   Any save touched here is flagged `devUnlocked: true`, and the You screen
   says so, so a screenshot of a maxed account can never be mistaken for a
   real one. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State;

  UI.route("/dev", function (view) {
    UI.hideTabs(false);

    view.appendChild(U.el("h1", { text: "Dev panel" }));
    view.appendChild(U.el("div", { class: "why no" }, [
      U.el("div", { class: "why-h", text: "Testing only" }),
      U.el("div", { class: "small", text:
        "Nothing here goes through UI.award(), so using it does not affect what the exploit and honest bots measure. " +
        "Any save you touch is marked as dev-unlocked and the You screen will say so." })
    ]));

    if (S.data.devUnlocked) {
      view.appendChild(U.el("div", { class: "card card-tight", style: "border-color:var(--warn)" }, [
        U.el("b", { style: "color:var(--warn)", text: "⚠ This save is dev-unlocked" }),
        U.el("div", { class: "muted2", text: "Its numbers are not earned. Use Reset below for a clean run-through." })
      ]));
    }

    /* ── one-tap maxed account ─────────────────────────────────────── */
    view.appendChild(U.el("h2", { text: "Presets" }));
    var presets = U.el("div", { class: "list" });

    preset(presets, "Max everything", "Level 60, 500 000 credits, every theme, every achievement, every boss cleared, all content marked seen.", function () {
      maxLevel();
      S.data.coins = 500000;
      S.data.owned.themes = ECON.DATA.shop.themes.map(function (t) { return t.id; });
      ECON.DATA.achievements.forEach(function (a) { S.data.achievements[a.id] = Date.now(); });
      U.MODULES.forEach(function (m) { S.data.bosses[m.id] = { cleared: true, best: 20 }; });
      ECON.Bank.all("mcq").forEach(function (q) { S.data.seen[q.id] = { n: 3, wrong: 0, last: Date.now() }; });
      ECON.Bank.diagrams().forEach(function (d) { S.data.diagramSeen[d.id] = Date.now(); });
      S.data.bests.calcSolved = 120;
      Object.keys(S.data.inventory).forEach(function (k) { S.data.inventory[k] = 25; });
      (ECON.DATA.shop.avatars || []).forEach(function (a) {
        if (S.data.owned.avatars.indexOf(a.emoji) < 0) S.data.owned.avatars.push(a.emoji);
      });
      S.data.bests.shiftsSolved = 60;
      S.data.bests.survival = 42;
      S.data.runs = 250;
      S.data.streakDays = 45;
      S.data.bestStreakDays = 45;
      S.data.missed = {};
    });

    preset(presets, "Rich but unskilled", "500 000 credits at level 1, nothing seen. For testing the Shop and arcade in isolation.", function () {
      S.data.coins = 500000;
    });

    preset(presets, "Mid-year student", "Level 22, 8000 credits, about half the bank seen, a realistic rehab pool and some cards in flight.", function () {
      S.data.xp = S.totalXpForLevel(22) + 400;
      S.data.coins = 8000;
      var all = ECON.Bank.all("mcq");
      U.sample(all, Math.floor(all.length * 0.55)).forEach(function (q, i) {
        S.data.seen[q.id] = { n: 1 + (i % 3), wrong: i % 5 === 0 ? 1 : 0, last: Date.now() - i * 3600000 };
        if (i % 5 === 0) S.data.missed[q.id] = { n: 1, last: Date.now() };
      });
      var cards = ECON.Bank.all("card");
      U.sample(cards, Math.floor(cards.length * 0.4)).forEach(function (c, i) {
        S.data.cards[c.id] = {
          box: i % 5, n: 1 + (i % 4), lapses: i % 7 === 0 ? 1 : 0,
          last: Date.now() - i * 7200000,
          due: Date.now() + ((i % 3) - 1) * 86400000
        };
      });
      S.data.runs = 60;
      S.data.streakDays = 9;
      S.data.bestStreakDays = 12;
      U.MODULES.slice(0, 3).forEach(function (m) { S.data.bosses[m.id] = { cleared: true, best: 17 }; });
    });

    preset(presets, "Everything due", "Every flashcard due right now, for testing the review session and the Cards screen.", function () {
      ECON.Bank.all("card").forEach(function (c) {
        S.data.cards[c.id] = { box: 2, due: Date.now() - 86400000, n: 4, lapses: 0, last: Date.now() - 4 * 86400000 };
      });
    });

    preset(presets, "Big rehab pool", "40 questions marked missed, for testing Mistake Rehab.", function () {
      U.sample(ECON.Bank.all("mcq"), 40).forEach(function (q) {
        S.data.seen[q.id] = { n: 2, wrong: 2, last: Date.now() };
        S.data.missed[q.id] = { n: 2, last: Date.now() };
      });
    });

    view.appendChild(presets);

    /* ── individual levers ─────────────────────────────────────────── */
    view.appendChild(U.el("h2", { text: "Levers" }));
    var levers = U.el("div", { class: "list" });

    lever(levers, "XP", function () { return U.fmtInt(S.data.xp) + "  (level " + S.levelFromXp(S.data.xp).level + ")"; }, [
      ["+1k", function () { S.data.xp += 1000; }],
      ["+50k", function () { S.data.xp += 50000; }],
      ["Max", maxLevel],
      ["0", function () { S.data.xp = 0; }]
    ]);

    lever(levers, "Credits", function () { return U.fmtInt(S.data.coins); }, [
      ["+1k", function () { S.data.coins += 1000; }],
      ["+100k", function () { S.data.coins += 100000; }],
      ["0", function () { S.data.coins = 0; }]
    ]);

    lever(levers, "Arcade ticket", function () {
      var ms = ECON.Arcade.ticketMsLeft();
      return ms ? U.fmtTime(ms) + " left" : "none";
    }, [
      ["+30 min", function () {
        var base = Math.max(Date.now(), S.data.arcade.ticketUntil || 0);
        S.data.arcade.ticketUntil = base + 30 * 60000;
      }],
      ["Clear", function () { S.data.arcade.ticketUntil = 0; }]
    ]);

    lever(levers, "Daily streak", function () { return U.plural(S.data.streakDays || 0, "day"); }, [
      ["+1", function () { S.data.streakDays = (S.data.streakDays || 0) + 1; S.data.bestStreakDays = Math.max(S.data.bestStreakDays || 0, S.data.streakDays); }],
      ["30", function () { S.data.streakDays = 30; S.data.bestStreakDays = 30; }],
      ["0", function () { S.data.streakDays = 0; }]
    ]);

    lever(levers, "Short-answer day lock", function () { return Object.keys(S.data.shortLog).length + " paid today"; }, [
      ["Clear", function () { S.data.shortLog = {}; }]
    ]);

    lever(levers, "Achievements", function () {
      var p = ECON.Achievements.progress();
      return p.have + " / " + p.total;
    }, [
      ["All", function () { ECON.DATA.achievements.forEach(function (a) { S.data.achievements[a.id] = Date.now(); }); }],
      ["None", function () { S.data.achievements = {}; }]
    ]);

    lever(levers, "Bosses", function () {
      return Object.keys(S.data.bosses).filter(function (b) { return S.data.bosses[b].cleared; }).length + " / 8 cleared";
    }, [
      ["Unlock", function () {
        ECON.Bank.all("mcq").forEach(function (q) { if (!S.data.seen[q.id]) S.data.seen[q.id] = { n: 1, wrong: 0, last: Date.now() }; });
      }],
      ["Clear all", function () { U.MODULES.forEach(function (m) { S.data.bosses[m.id] = { cleared: true, best: 20 }; }); }],
      ["Reset", function () { S.data.bosses = {}; }]
    ]);

    view.appendChild(levers);

    /* ── content sanity, read straight off the live banks ──────────── */
    view.appendChild(U.el("h2", { text: "Content loaded" }));
    var counts = ECON.Bank.counts();
    var tbl = U.el("div", { class: "list" });
    Object.keys(counts).sort().forEach(function (k) {
      tbl.appendChild(U.el("div", { class: "li" }, [
        U.el("div", { class: "grow", text: k }),
        U.el("b", { text: U.fmtInt(counts[k]) })
      ]));
    });
    tbl.appendChild(U.el("div", { class: "li" }, [
      U.el("div", { class: "grow", text: "modes registered" }),
      U.el("b", { text: String(ECON.Run.MODES.length) })
    ]));
    tbl.appendChild(U.el("div", { class: "li" }, [
      U.el("div", { class: "grow", text: "build" }),
      U.el("b", { text: S.BUILD })
    ]));
    view.appendChild(tbl);

    /* ── danger ────────────────────────────────────────────────────── */
    view.appendChild(U.el("h2", { text: "Reset" }));
    view.appendChild(U.el("button", {
      class: "btn btn-block", style: "border-color:var(--bad);color:var(--bad)",
      onclick: function () {
        UI.confirm("Erase everything?", "Back to a clean install, with no dev flag.", function () {
          S.reset(); UI.toast("Reset"); UI.go("/home");
        }, "Erase");
      }
    }, "Reset to a clean save"));

    view.appendChild(U.el("div", { class: "muted2 small", style: "margin-top:16px;text-align:center",
      text: "Reach this panel at #/dev. It is not linked from anywhere in the app." }));

    /* ── helpers ───────────────────────────────────────────────────── */
    function maxLevel() {
      S.data.xp = S.totalXpForLevel(S.LEVEL_CAP) + S.levelCost(S.LEVEL_CAP);
    }

    function apply(fn) {
      fn();
      S.data.devUnlocked = true;
      S.save();
      UI.syncChrome();
      UI.render();
    }

    function preset(host, name, blurb, fn) {
      var row = U.el("div", { class: "li" }, [
        U.el("div", { class: "grow" }, [U.el("b", { text: name }), U.el("small", { text: blurb })]),
        U.el("button", { class: "btn btn-sm btn-primary", onclick: function () { apply(fn); UI.toast(name + " applied", "good"); } }, "Apply")
      ]);
      host.appendChild(row);
    }

    function lever(host, name, value, actions) {
      var row = U.el("div", { class: "li", style: "flex-direction:column;align-items:stretch;gap:8px" }, [
        U.el("div", { class: "spread" }, [
          U.el("b", { text: name }),
          U.el("span", { class: "muted2", text: value() })
        ]),
        U.el("div", { class: "row-tight" }, actions.map(function (a) {
          return U.el("button", { class: "btn btn-sm", onclick: function () { apply(a[1]); } }, a[0]);
        }))
      ]);
      host.appendChild(row);
    }
  });

  /* Keyboard shortcut for desktop testing: Ctrl/Cmd + Shift + D. */
  U.on(document, "keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "D" || e.key === "d")) {
      e.preventDefault();
      UI.go("/dev");
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
