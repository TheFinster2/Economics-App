/* Process Order — sequence protein synthesis, the immune response, a reflex arc.

   Addendum C1 and C2 apply directly to this mode, because you can keep trying
   until it works:
     • NO per-item score floor. Getting there after six wrong attempts pays
       proportionally less, all the way down to zero, not down to a floor.
     • The restart button does NOT reset the attempt counter. Restarting a
       sequence keeps every attempt you have already spent on it this run. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, R = ECON.Run;

  R.register({
    id:"processorder", name:"Process Order", icon:"🔢", route:"/play/processorder",
    blurb:"Put the steps of an economic process in the right order.",
    group:"Core"
  });

  var ROUND = 3;

  UI.route("/play/processorder", function (view) {
    var pool = ECON.Bank.active("sequence");
    if (!pool.length) { ECON.Coverage.warnIfEmpty("sequence"); return; }

    ECON.Tools.startRun("processorder");
    var shell = UI.gameShell(view, { title:"Process Order", sub:"Sequence the steps", onQuit: function () { UI.go("/home"); } });
    UI._gsRefresh = paint;
    ECON.Tools.attach("processorder");

    var st = { i:0, counted:0, solved:0, xp:0, done:false, review:[], attemptsTotal:0 };
    next();

    function paint() {
      shell.setMeters([
        { text:"Process " + Math.min(st.i + 1, ROUND) + "/" + ROUND },
        { text: st.solved + " solved" },
        { text: st.attemptsTotal + " attempts used" }
      ]);
      shell.setProgress(st.i / ROUND);
    }

    function next() {
      if (st.done) return;
      if (st.i >= ROUND) return finish();
      paint();
      var seq = U.pick(pool);
      runSequence(seq);
    }

    function runSequence(seq) {
      var host = shell.clear();
      var shownAt = Date.now();
      // attempts persist across a restart of THIS sequence (defect C2)
      var attempts = 0;

      host.appendChild(U.el("div", { class:"qmeta" }, [
        U.el("span", { class:"badge badge-accent", text: seq.mod }),
        U.el("span", { class:"badge", text: seq.topic }),
        U.el("span", { class:"badge", text:"×" + seq.diff })
      ]));
      host.appendChild(U.el("div", { class:"qtext", text: seq.title + " — put these in order." }));
      host.appendChild(U.el("div", { class:"muted2 small", style:"margin-bottom:8px",
        text:"Tap steps in the order they happen. Every attempt reduces what this pays — restarting does not reset that." }));

      var slotHost = U.el("div", { class:"list" });
      var bank = U.el("div", { class:"dg-bank" });
      var feedback = U.el("div");
      var chosen = [];
      var shuffled = U.shuffle(seq.steps.map(function (s, i) { return { text: s, i: i }; }));

      host.appendChild(slotHost);
      host.appendChild(bank);
      host.appendChild(feedback);

      var actions = U.el("div", { class:"row", style:"margin-top:12px" });
      var checkBtn = U.el("button", { class:"btn btn-primary grow" }, "Check order");
      var resetBtn = U.el("button", { class:"btn grow" }, "Restart (attempts kept)");
      actions.appendChild(checkBtn);
      actions.appendChild(resetBtn);
      host.appendChild(actions);

      resetBtn.addEventListener("click", function () {
        chosen = [];
        // NOTE: `attempts` is deliberately NOT reset here. (defect C2)
        draw();
        U.clear(feedback);
      });
      checkBtn.addEventListener("click", check);

      draw();

      function draw() {
        U.clear(slotHost);
        U.clear(bank);
        chosen.forEach(function (item, n) {
          var row = U.el("button", { class:"li", style:"width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer" }, [
            U.el("span", { class:"badge badge-accent", text: String(n + 1) }),
            U.el("span", { class:"grow", text: item.text })
          ]);
          row.addEventListener("click", function () {
            chosen.splice(n, 1);
            draw();
          });
          slotHost.appendChild(row);
        });
        if (!chosen.length) slotHost.appendChild(U.el("div", { class:"muted2 small", text:"Your order will appear here." }));

        shuffled.forEach(function (item) {
          if (chosen.indexOf(item) >= 0) return;
          var chip = U.el("button", { class:"dg-chip", style:"text-align:left;white-space:normal;border-radius:12px", text: item.text });
          chip.addEventListener("click", function () { chosen.push(item); draw(); });
          bank.appendChild(chip);
        });
        checkBtn.disabled = chosen.length !== seq.steps.length;
      }

      function check() {
        attempts++;
        st.attemptsTotal++;
        paint();
        var ok = chosen.every(function (item, n) { return item.i === n; });
        U.clear(feedback);

        if (!ok) {
          var firstWrong = -1;
          for (var k = 0; k < chosen.length; k++) if (chosen[k].i !== k) { firstWrong = k; break; }
          var w = U.el("div", { class:"why no", style:"margin-top:12px" });
          w.appendChild(U.el("div", { class:"why-h", text:"Not yet — attempt " + attempts }));
          w.appendChild(U.el("div", { text:"The first step out of place is position " + (firstWrong + 1) + ". Everything before it is correct." }));
          feedback.appendChild(w);
          if (attempts >= 6) {
            feedback.appendChild(U.el("div", { class:"muted2 small", style:"margin-top:8px",
              text:"This sequence now pays nothing. Work it out anyway — the reasoning is the point." }));
          }
          return;
        }

        // Payment decays with attempts, all the way to zero. No floor. (C1)
        var counts = (Date.now() - shownAt) >= S.MIN_READ_MS;
        var value = Math.max(0, (7 - attempts)) / 6;          // 1st try = 1.0, 7th = 0
        var earned = counts ? Math.round(S.XP_PER_CORRECT * (seq.diff || 2) * seq.steps.length * 0.5 * value) : 0;
        st.finished = (st.finished || 0) + 1;
        if (counts) st.counted++;
        st.xp += earned;
        if (attempts === 1) st.solved++;

        var g = U.el("div", { class:"why ok", style:"margin-top:12px" });
        g.appendChild(U.el("div", { class:"why-h", text: attempts === 1 ? "Correct, first time" : "Correct after " + attempts + " attempts" }));
        g.appendChild(U.el("div", { text: seq.why }));
        g.appendChild(U.el("div", { class:"small muted2", style:"margin-top:6px",
          text: earned ? "This sequence paid " + earned + " XP (" + Math.round(value * 100) + "% of full value)."
                       : "This sequence paid nothing." }));
        feedback.appendChild(g);

        st.review.push({ ok: attempts === 1, q: seq.title, mod: seq.mod, a: seq.steps[0] + " → …", why: seq.why });
        checkBtn.disabled = true;
        resetBtn.disabled = true;
        feedback.appendChild(U.el("button", {
          class:"btn btn-primary btn-block", style:"margin-top:12px",
          onclick: function () { st.i++; next(); }
        }, st.i + 1 >= ROUND ? "See results" : "Next process"));
      }
    }

    function finish() {
      if (st.done) return;
      st.done = true;
      UI._gsRefresh = null;
      var acc = ROUND ? st.solved / ROUND : 0;
      var rec = UI.award({ xp: Math.round(st.xp), bonus: 80, readRatio: st.finished ? st.counted / st.finished : 0, accuracy: acc, mode:"processorder", score: st.solved });
      rec.questions = ROUND;
      if (ECON.Achievements) ECON.Achievements.check(rec);

      UI.results(view, {
        title:"Process Order complete",
        subtitle: st.solved + " of " + ROUND + " solved first time",
        correct: st.solved, total: ROUND,
        rows:[
          ["Solved first time", st.solved + " / " + ROUND],
          ["Total attempts used", String(st.attemptsTotal)],
          ["XP from sequences", U.fmtInt(Math.round(st.xp))],
          ["Completion bonus", rec.bonusWithheld ? "0  (withheld below 50%)" : "+" + U.fmtInt(rec.bonus)],
          ["Total earned", U.fmtInt(rec.xp) + " XP  ·  " + U.fmtInt(rec.coins) + " ◉"]
        ],
        review: st.review.filter(function (x) { return !x.ok; }),
        again: function () { UI.render(); }
      });
    }

    return function () { st.done = true; UI._gsRefresh = null; ECON.Tools.detach(); UI.hideTabs(false); };
  });
})(typeof window !== "undefined" ? window : globalThis);
