/* Shift It — a shock arrives; say what moves and what happens to equilibrium.

   The author of a scenario supplies only three things: the shock, which curve
   moves, and which way. The effect on equilibrium price and quantity is
   DERIVED by ECON.Calc.shiftOutcome, never written out beside the scenario.
   That is deliberate. Hand-written outcomes drift out of step with the
   scenario the moment someone edits one and not the other, and a study app
   that confidently states the wrong comparative static is worse than useless.

   The three sub-questions are asked in the order a marker wants them:
   which curve, which direction, then the equilibrium effect. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, C = ECON.Calc, R = ECON.Run;

  R.register({
    id:"shiftit", name:"Shift It", icon:"📈", route:"/play/shiftit",
    blurb:"A shock hits the market. Which curve moves, which way, and what happens to price?",
    group:"Numbers"
  });

  var ROUND = 6;

  UI.route("/play/shiftit", function (view) {
    var items = ECON.Bank.active("shift");
    if (!items.length) { ECON.Coverage.warnIfEmpty("shift"); return; }

    ECON.Tools.startRun("shiftit");
    var shell = UI.gameShell(view, { title:"Shift It", sub:"Diagnose the shock",
                                     onQuit: function () { UI.go("/home"); } });
    UI._gsRefresh = paint;
    ECON.Tools.attach("shiftit");

    var order = U.shuffle(items.slice()), st = {
      i:0, counted:0, correct:0, answered:0, xp:0, review:[], done:false, shownAt:0
    };
    next();

    function paint() {
      shell.setMeters([{ text:"Shock " + Math.min(st.i + 1, ROUND) + "/" + ROUND }, { text: st.correct + " correct" }]);
      shell.setProgress(st.i / ROUND);
    }

    function next() {
      if (st.done) return;
      if (st.i >= ROUND || st.i >= order.length) return finish();
      paint();

      var item = order[st.i];
      var out = C.shiftOutcome(item.curve, item.direction);
      if (!out) { console.error("shiftit: bad curve/direction on", item.id); st.i++; return next(); }

      st.shownAt = Date.now();
      var host = shell.clear();

      host.appendChild(U.el("div", { class:"qmeta" }, [
        U.el("span", { class:"badge badge-accent", text: item.mod }),
        U.el("span", { class:"badge", text: U.trunc(item.market, 28) })
      ]));
      host.appendChild(U.el("div", { class:"card card-tight small muted",
        text: "Market for " + item.market }));
      host.appendChild(U.el("div", { class:"qtext", text: item.shock }));

      var stage = 0, gotAll = true;
      var stages = [
        { q:"Which curve shifts?",
          options:["Demand", "Supply"],
          answer: item.curve === "demand" ? 0 : 1,
          why: item.why },
        { q:"In which direction does it shift?",
          options:["Right (an increase)", "Left (a decrease)"],
          answer: item.direction === "right" ? 0 : 1,
          why: item.direction === "right"
            ? "More is wanted or offered at every price, so the curve moves right."
            : "Less is wanted or offered at every price, so the curve moves left." },
        { q:"What happens to the equilibrium price?",
          options:["It rises", "It falls"],
          answer: out.price === "rises" ? 0 : 1,
          why: "With " + item.curve + " shifting " + item.direction + ", equilibrium price " + out.price +
               " and equilibrium quantity " + out.quantity + ". " + out.movementNote }
      ];

      var box = U.el("div");
      host.appendChild(box);
      askStage();

      function askStage() {
        var sg = stages[stage];
        var wrap = U.el("div", { style:"margin-top:12px" });
        wrap.appendChild(U.el("div", { class:"qtext", style:"font-size:16px", text: sg.q }));
        var opts = U.el("div", { class:"opts" });
        var picked = false, btns = [];
        var shuffled = U.shuffle([0, 1]);
        shuffled.forEach(function (oi, n) {
          var b = U.el("button", { class:"opt", type:"button" }, [
            U.el("span", { class:"k", text:"AB".charAt(n) }),
            U.el("span", { class:"grow", text: sg.options[oi] })
          ]);
          b.addEventListener("click", function () {
            if (picked) return;
            picked = true;
            var ok = oi === sg.answer;
            if (!ok) gotAll = false;
            btns.forEach(function (bb, j) {
              bb.disabled = true;
              if (shuffled[j] === sg.answer) bb.classList.add("right");
              else if (bb === b) bb.classList.add("wrong");
              else bb.classList.add("dim");
            });
            var w = U.el("div", { class:"why " + (ok ? "ok" : "no") });
            w.appendChild(U.el("div", { class:"why-h", text: ok ? "Correct" : "Not quite" }));
            w.appendChild(U.el("div", { text: sg.why }));
            wrap.appendChild(w);

            stage++;
            if (stage < stages.length) {
              wrap.appendChild(U.el("div", { class:"row", style:"margin-top:12px" }, [
                U.el("button", { class:"btn btn-primary btn-block", onclick: askStage }, "Next part")
              ]));
            } else {
              score(gotAll, item, out);
              wrap.appendChild(U.el("div", { class:"row", style:"margin-top:12px" }, [
                U.el("button", { class:"btn btn-primary btn-block", onclick: function () { st.i++; next(); } },
                  st.i + 1 >= Math.min(ROUND, order.length) ? "See results" : "Next shock")
              ]));
            }
          });
          btns.push(b); opts.appendChild(b);
        });
        wrap.appendChild(opts);
        box.appendChild(wrap);
      }
    }

    function score(ok, item, out) {
      st.answered++;
      var counts = (Date.now() - st.shownAt) >= S.MIN_READ_MS;
      if (counts) st.counted++;
      if (ok) {
        st.correct++;
        if (counts) st.xp += S.XP_PER_CORRECT * (item.diff || 2);
        S.data.bests.shiftsSolved = (S.data.bests.shiftsSolved || 0) + 1;
      } else {
        S.markMissed(item.id);
      }
      st.review.push({ ok: ok, q: item.shock, mod: item.mod,
                       a: item.curve + " shifts " + item.direction + "; price " + out.price + ", quantity " + out.quantity,
                       why: item.why });
      S.saveSoon();
    }

    function finish() {
      if (st.done) return;
      st.done = true;
      UI._gsRefresh = null;
      var acc = st.answered ? st.correct / st.answered : 0;
      var rec = UI.award({ xp: Math.round(st.xp), bonus: 120,
                           readRatio: st.answered ? st.counted / st.answered : 0,
                           accuracy: acc, mode:"shiftit", score: st.correct });
      rec.questions = st.answered;
      if (ECON.Achievements) ECON.Achievements.check(rec);

      var rows = [
        ["Shocks fully correct", st.correct + " / " + st.answered],
        ["Accuracy", Math.round(acc * 100) + "%"],
        ["XP from answers", U.fmtInt(Math.round(st.xp))],
        ["Completion bonus", rec.bonusWithheld ? "0  (withheld below 50%)" : "+" + U.fmtInt(rec.bonus)]
      ];
      if (rec.refPenalty) rows.push(["Reference penalty", "−" + U.fmtInt(rec.refPenalty) + " XP"]);
      rows.push(["Total earned", U.fmtInt(rec.xp) + " XP  ·  " + U.fmtInt(rec.coins) + " ◉"]);

      UI.results(view, {
        title:"Shift It complete", correct: st.correct, total: st.answered,
        rows: rows, review: st.review.filter(function (r) { return !r.ok; }),
        again: function () { UI.render(); }
      });
    }

    return function () { st.done = true; UI._gsRefresh = null; ECON.Tools.detach(); UI.hideTabs(false); };
  });

})(typeof window !== "undefined" ? window : globalThis);
