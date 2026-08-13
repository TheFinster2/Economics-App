/* Calculation Lab — the flagship. Read the scenario, do the arithmetic.

   Every answer and every distractor is produced by js/core/econcalc.js, which
   computes the answer by two independent routes and refuses to emit a
   question when they disagree. A question that fails verification is skipped
   here rather than shown with a warning, because a wrong answer a student
   memorises is worse than a missing question. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, C = ECON.Calc, R = ECON.Run;

  R.register({
    id:"calculate", name:"Calculation Lab", icon:"🧮", route:"/play/calculate",
    blurb:"Elasticity, multipliers, rates and balances. Unlimited questions, all worked.",
    group:"Numbers"
  });

  var ROUND = 6;

  UI.route("/play/calculate", function (view) {
    var templates = (ECON.DATA.calc_core || []).filter(function (t) { return !ECON.Coverage.isHiddenItem(t); });
    if (!templates.length) { ECON.Coverage.warnIfEmpty("calc"); return; }

    ECON.Tools.startRun("calculate");
    var shell = UI.gameShell(view, { title:"Calculation Lab", sub:"Read the scenario, then choose the value",
                                     onQuit: function () { UI.go("/home"); } });
    UI._gsRefresh = paint;
    ECON.Tools.attach("calculate");

    var st = { i:0, counted:0, correct:0, answered:0, xp:0, review:[], done:false, shownAt:0 };
    next();

    function paint() {
      shell.setMeters([{ text:"Q " + Math.min(st.i + 1, ROUND) + "/" + ROUND }, { text: st.correct + " correct" }]);
      shell.setProgress(st.i / ROUND);
    }

    function next() {
      if (st.done) return;
      if (st.i >= ROUND) return finish();
      paint();

      var tpl = U.pick(templates);
      var q = C.buildAny(tpl.kind, (Math.floor(Math.random() * 2147483647) + 1) >>> 0);
      if (!q) { console.error("calc: could not build a verified question for", tpl.id); return next(); }

      st.shownAt = Date.now();
      var host = shell.clear();

      host.appendChild(U.el("div", { class:"qmeta" }, [
        U.el("span", { class:"badge badge-accent", text: tpl.mod }),
        U.el("span", { class:"badge", text: U.trunc(tpl.title, 30) }),
        U.el("span", { class:"badge", text:"×" + tpl.diff })
      ]));
      host.appendChild(U.el("div", { class:"card card-tight small muted", text: q.context }));
      host.appendChild(U.el("div", { class:"qtext", text: q.ask }));

      var box = U.el("div", { class:"opts" });
      var order = U.shuffle(q.options.map(function (_, k) { return k; }));
      var answerIndex = 0;
      var btns = [], answered = false;

      order.forEach(function (oi, n) {
        var opt = q.options[oi];
        var b = U.el("button", { class:"opt", type:"button" }, [
          U.el("span", { class:"k", text:"ABCD".charAt(n) }),
          U.el("span", { class:"grow", text: C.format(opt.value, q.dp, q.unit) })
        ]);
        b.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var ok = !!opt.correct;
          btns.forEach(function (bb, j) {
            bb.disabled = true;
            if (q.options[order[j]].correct) bb.classList.add("right");
            else if (bb === b) bb.classList.add("wrong");
            else bb.classList.add("dim");
          });
          score(ok, q, tpl);

          var w = U.el("div", { class:"why " + (ok ? "ok" : "no") });
          w.appendChild(U.el("div", { class:"why-h", text: ok ? "Correct" : "Not quite" }));
          w.appendChild(U.el("div", { text: "The answer is " + C.format(q.answer, q.dp, q.unit) + ". " + tpl.note }));
          if (!ok && opt.why) {
            w.appendChild(U.el("div", { class:"small muted", style:"margin-top:6px", text: "Why that option is wrong: " + opt.why }));
          }
          host.appendChild(w);

          // Show the reason for every distractor, not only the one chosen —
          // the near-miss you did not pick is often the one you would pick
          // next time.
          var others = U.el("div", { class:"card card-tight small muted", style:"margin-top:8px" });
          others.appendChild(U.el("div", { style:"font-weight:700;margin-bottom:4px", text:"The other options" }));
          q.options.forEach(function (o) {
            if (o.correct) return;
            others.appendChild(U.el("div", { style:"margin-bottom:4px",
              text: C.format(o.value, q.dp, q.unit) + " — " + o.why }));
          });
          host.appendChild(others);

          host.appendChild(U.el("div", { class:"row", style:"margin-top:14px" }, [
            U.el("button", { class:"btn btn-primary btn-block", onclick: function () { st.i++; next(); } },
              st.i + 1 >= ROUND ? "See results" : "Next question")
          ]));
        });
        btns.push(b); box.appendChild(b);
      });
      host.appendChild(box);
      void answerIndex;
    }

    function score(ok, q, tpl) {
      st.answered++;
      var counts = (Date.now() - st.shownAt) >= S.MIN_READ_MS;
      if (counts) st.counted++;
      if (ok) {
        st.correct++;
        if (counts) st.xp += S.XP_PER_CORRECT * (tpl.diff || 2);
        S.data.bests.calcSolved = (S.data.bests.calcSolved || 0) + 1;
      }
      st.review.push({ ok: ok, q: q.context + " " + q.ask, mod: tpl.mod,
                       a: C.format(q.answer, q.dp, q.unit), why: tpl.note });
      S.saveSoon();
    }

    function finish() {
      if (st.done) return;
      st.done = true;
      UI._gsRefresh = null;
      var acc = st.answered ? st.correct / st.answered : 0;
      var rec = UI.award({ xp: Math.round(st.xp), bonus: 150,
                           readRatio: st.answered ? st.counted / st.answered : 0,
                           accuracy: acc, mode:"calculate", score: st.correct });
      rec.questions = st.answered;
      if (ECON.Achievements) ECON.Achievements.check(rec);

      var rows = [
        ["Calculations correct", st.correct + " / " + st.answered],
        ["Accuracy", Math.round(acc * 100) + "%"],
        ["XP from answers", U.fmtInt(Math.round(st.xp))],
        ["Completion bonus", rec.bonusWithheld ? "0  (withheld below 50%)" : "+" + U.fmtInt(rec.bonus)]
      ];
      if (rec.refPenalty) rows.push(["Reference penalty", "−" + U.fmtInt(rec.refPenalty) + " XP"]);
      rows.push(["Total earned", U.fmtInt(rec.xp) + " XP  ·  " + U.fmtInt(rec.coins) + " ◉"]);
      rows.push(["Lifetime calculations", U.fmtInt(S.data.bests.calcSolved || 0)]);

      UI.results(view, {
        title:"Calculation Lab complete", correct: st.correct, total: st.answered,
        rows: rows, review: st.review.filter(function (r) { return !r.ok; }),
        again: function () { UI.render(); }
      });
    }

    return function () { st.done = true; UI._gsRefresh = null; ECON.Tools.detach(); UI.hideTabs(false); };
  });

})(typeof window !== "undefined" ? window : globalThis);
