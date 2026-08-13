/* Equilibrium — js/modes/common.js
   The shared MCQ run engine used by Rapid Fire, Module Drill, Survival,
   Mistake Rehab and the module bosses.

   All reward flows through UI.award at the end of a run, once. Nothing in here
   pays per item — a per-item score floor is defect C1 and this is where it
   would have gone.

   Exposes: window.ECON.Run */
(function (root) {
  "use strict";

  var ECON = root.ECON = root.ECON || {};
  var U = ECON.U, S = ECON.State, UI = ECON.UI;
  var R = {};

  R.MODES = [];   // registry, so home.js does not hand-list modes

  R.register = function (def) { R.MODES.push(def); return def; };

  R.byId = function (id) {
    for (var i = 0; i < R.MODES.length; i++) if (R.MODES[i].id === id) return R.MODES[i];
    return null;
  };

  /* ── the run ─────────────────────────────────────────────────────────
     cfg:
       id          mode id (used for bests and the tool tray)
       title, sub
       questions   array, or next() for an endless stream
       limit       number of questions (null for endless/timed)
       timeMs      run timer (null for untimed)
       lives       null, or a number (Survival uses 1)
       streakBonus apply the streak multiplier
       bonus       completion bonus before the accuracy gate
       onFinish    optional extra rows for the results screen
     ══════════════════════════════════════════════════════════════════ */
  R.start = function (view, cfg) {
    ECON.Tools.startRun(cfg.id);

    var shell = UI.gameShell(view, {
      title: cfg.title, sub: cfg.sub,
      onQuit: function () { UI.go("/home"); }
    });
    UI._gsRefresh = paintMeters;

    var state = {
      i: 0, correct: 0, answered: 0, counted: 0, streak: 0, bestStreak: 0,
      lives: cfg.lives || null, xp: 0, review: [], done: false,
      startedAt: Date.now(), shownAt: 0
    };

    var timer = null;
    if (cfg.timeMs) {
      state.endsAt = Date.now() + cfg.timeMs;
      timer = setInterval(function () {
        if (state.done) return;
        if (Date.now() >= state.endsAt) finish("Time");
        else paintMeters();
      }, 250);
    }

    if (ECON.Tools) ECON.Tools.attach(cfg.id);

    next();

    function nextQuestion() {
      if (cfg.next) return cfg.next(state);
      return cfg.questions[state.i] || null;
    }

    function next() {
      if (state.done) return;
      if (cfg.limit && state.i >= cfg.limit) return finish("Complete");
      var q = nextQuestion();
      if (!q) return finish("Out of questions");
      state.current = q;
      state.shownAt = Date.now();

      var host = shell.clear();
      paintMeters();
      shell.setProgress(cfg.limit ? state.i / cfg.limit : (cfg.timeMs ? 1 - (state.endsAt - Date.now()) / cfg.timeMs : 0));

      UI.renderMCQ(host, q, function (ok) {
        // MIN_READ_MS: answering faster than a human can read earns nothing
        // for that item. It is not a punishment — it simply does not count.
        var readMs = Date.now() - state.shownAt;
        var counts = readMs >= S.MIN_READ_MS;

        state.answered++;
        if (counts) state.counted++;
        S.markSeen(q.id, ok);

        if (ok) {
          state.correct++;
          state.streak++;
          state.bestStreak = Math.max(state.bestStreak, state.streak);
          if (counts) {
            var mult = cfg.streakBonus ? S.streakMult(state.streak) : 1;
            state.xp += S.XP_PER_CORRECT * (q.diff || 1) * mult;
          }
        } else {
          state.streak = 0;
          if (state.lives !== null) state.lives--;
        }

        state.review.push({
          ok: ok, q: U.trunc(q.q, 120), mod: q.mod,
          a: q.options[q.answer], why: q.why
        });

        state.i++;
        paintMeters();

        var row = U.el("div", { class: "row", style: "margin-top:14px" });
        if (state.lives !== null && state.lives <= 0) {
          row.appendChild(U.el("button", { class: "btn btn-primary btn-block", onclick: function () { finish("Out of lives"); } }, "See results"));
        } else if (cfg.limit && state.i >= cfg.limit) {
          row.appendChild(U.el("button", { class: "btn btn-primary btn-block", onclick: function () { finish("Complete"); } }, "See results"));
        } else {
          row.appendChild(U.el("button", { class: "btn btn-primary btn-block", onclick: next }, "Next question"));
        }
        host.appendChild(row);
      });
    }

    function paintMeters() {
      var items = [];
      if (cfg.limit) items.push({ text: "Q " + Math.min(state.i + 1, cfg.limit) + "/" + cfg.limit });
      if (cfg.timeMs) {
        var left = Math.max(0, state.endsAt - Date.now());
        items.push({ text: "⏱ " + U.fmtTime(left), hot: left < 15000 });
      }
      items.push({ text: state.correct + " correct" });
      if (cfg.streakBonus) items.push({ text: "🔥 " + state.streak + "  " + UI.streakBadge(state.streak) });
      if (state.lives !== null) items.push({ text: "♥ ".repeat(Math.max(0, state.lives)) || "♥ 0", hot: state.lives <= 1 });
      shell.setMeters(items);
    }

    function finish(reason) {
      if (state.done) return;
      state.done = true;
      if (timer) clearInterval(timer);
      UI._gsRefresh = null;

      var acc = state.answered ? state.correct / state.answered : 0;
      var bonus = cfg.bonus || 0;

      var rec = UI.award({
        xp: Math.round(state.xp),
        bonus: bonus,
        readRatio: state.answered ? state.counted / state.answered : 0,
        accuracy: state.answered ? acc : null,
        mode: cfg.id,
        score: state.correct
      });
      rec.questions = state.answered;
      if (ECON.Achievements) ECON.Achievements.check(rec);

      var rows = [
        ["Answered", String(state.answered)],
        ["Correct", state.correct + " (" + Math.round(acc * 100) + "%)"],
        ["Best streak", String(state.bestStreak)],
        ["XP from answers", U.fmtInt(Math.round(state.xp))]
      ];
      if (bonus) {
        rows.push(["Completion bonus", rec.bonusWithheld
          ? (rec.readRatio !== null && rec.readRatio < 0.5
              ? "0  (answered faster than it can be read)"
              : "0  (withheld below 50%)")
          : "+" + U.fmtInt(rec.bonus)]);
      }
      if (rec.refPenalty) rows.push(["Reference penalty", "−" + U.fmtInt(rec.refPenalty) + " XP"]);
      rows.push(["Total earned", U.fmtInt(rec.xp) + " XP  ·  " + U.fmtInt(rec.coins) + " ◉"]);
      if (cfg.extraRows) cfg.extraRows(state).forEach(function (r) { rows.push(r); });

      UI.results(view, {
        title: reason === "Complete" ? "Run complete" : reason,
        subtitle: state.correct + " / " + state.answered + " correct",
        correct: state.correct, total: state.answered,
        rows: rows,
        review: state.review.filter(function (r) { return !r.ok; }).slice(0, 12),
        again: function () { UI.go(root.location.hash, true); UI.render(); }
      });
    }

    return function teardown() {
      state.done = true;
      if (timer) clearInterval(timer);
      UI._gsRefresh = null;
      ECON.Tools.detach();
      UI.hideTabs(false);
    };
  };

  ECON.Run = R;
})(typeof window !== "undefined" ? window : globalThis);
