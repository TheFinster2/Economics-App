/* Label It — the diagram engine's game mode (brief §3).
   Three question types drawn from the same authoring effort: place the labels,
   identify a highlighted part, state its function.
   The reference is withheld entirely here — the labels ARE the answer key. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, D = ECON.Diagram, R = ECON.Run;

  R.register({
    id:"labelit", name:"Label It", icon:"🔬", route:"/play/labelit",
    blurb:"Label the diagram, identify the part, state its function. No reference.",
    group:"Core"
  });

  var ROUND = 5;

  UI.route("/play/labelit", function (view, r) {
    var pool = ECON.Bank.activeDiagrams();
    if (r.query.d) pool = pool.filter(function (d) { return d.id === r.query.d; });
    if (!pool.length) {
      if (ECON.Coverage.warnIfEmpty("mcq")) return;
      UI.modal({ title:"No diagrams available", body:"Course coverage is hiding every diagram this mode would use.",
        actions:[{ label:"Settings", kind:"primary", onclick: function () { UI.go("/settings"); } }] });
      return;
    }

    ECON.Tools.startRun("labelit");
    var shell = UI.gameShell(view, { title:"Label It", sub:"Diagrams — reference withheld", onQuit: function () { UI.go("/home"); } });
    UI._gsRefresh = paint;
    ECON.Tools.attach("labelit");

    var st = { i:0, counted:0, correct:0, answered:0, xp:0, review:[], done:false, shownAt:0 };
    next();

    function paint() {
      shell.setMeters([{ text:"Q " + Math.min(st.i + 1, ROUND) + "/" + ROUND }, { text: st.correct + " correct" }, { text:"Reference off" }]);
      shell.setProgress(st.i / ROUND);
    }

    function next() {
      if (st.done) return;
      if (st.i >= ROUND) return finish();
      paint();

      var def = U.pick(pool);
      var kind = U.pick(["label", "identify", "role", "identify", "role"]);
      st.shownAt = Date.now();
      var host = shell.clear();

      host.appendChild(U.el("div", { class:"qmeta" }, [
        U.el("span", { class:"badge badge-accent", text: def.mod }),
        U.el("span", { class:"badge", text: def.title })
      ]));

      if (kind === "label") return doLabel(host, def);
      return doPick(host, def, kind);
    }

    /* ── place every label ────────────────────────────────────────── */
    function doLabel(host, def) {
      host.appendChild(U.el("div", { class:"qtext", text:"Tap a label, then tap the numbered spot it belongs to." }));
      var stage = U.el("div");
      host.appendChild(stage);
      var wrongCount = 0;
      var count = Math.min(5, def.parts.length);

      var session = D.label(stage, def, {
        count: count,
        onWrong: function () { wrongCount++; },
        onDone: function (res) {
          // scored as one item: correct only if placed with no misses
          var ok = res.wrong === 0;
          finishItem(ok, def, {
            q:"Label the " + def.title.toLowerCase(),
            a: session.parts.map(function (p) { return p.label; }).join(", "),
            why: ok ? "All " + res.total + " labels placed first time."
                    : res.wrong + " misplacement" + (res.wrong === 1 ? "" : "s") + " before completing. " +
                      session.parts.map(function (p) { return p.label + " — " + (p.role || ""); }).join(". ")
          }, host);
        }
      });

      // A skip is allowed but scores as a miss — no free retries (defect C2).
      host.appendChild(U.el("button", { class:"btn btn-block", style:"margin-top:10px", onclick: function () {
        session.reveal();
        finishItem(false, def, {
          q:"Label the " + def.title.toLowerCase(), a:"(revealed)",
          why:"Revealed without completing. " + session.parts.map(function (p) { return p.label; }).join(", ")
        }, host);
      } }, "Reveal answers (counts as incorrect)"));
    }

    /* ── identify / function ──────────────────────────────────────── */
    function doPick(host, def, kind) {
      var q = D.pickQuestion(def, kind);
      if (!q) { st.i++; return next(); }

      var stage = U.el("div");
      host.appendChild(stage);
      D.renderHighlighted(stage, def, q.part);
      host.appendChild(U.el("div", { class:"qtext", style:"font-size:16px", text: q.q }));

      var box = U.el("div", { class:"opts" });
      var btns = [], answered = false;
      q.options.forEach(function (txt, n) {
        var b = U.el("button", { class:"opt", type:"button" }, [
          U.el("span", { class:"k", text:"ABCD".charAt(n) }),
          U.el("span", { class:"grow", text: txt })
        ]);
        b.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var ok = n === q.answer;
          btns.forEach(function (bb, j) {
            bb.disabled = true;
            if (j === q.answer) bb.classList.add("right"); else if (bb === b) bb.classList.add("wrong"); else bb.classList.add("dim");
          });
          finishItem(ok, def, { q: q.q, a: q.options[q.answer], why: q.why }, host);
        });
        btns.push(b); box.appendChild(b);
      });
      host.appendChild(box);
    }

    function finishItem(ok, def, info, host) {
      st.answered++;
      var counts = (Date.now() - st.shownAt) >= S.MIN_READ_MS;
      if (counts) st.counted++;
      if (ok) { st.correct++; if (counts) st.xp += S.XP_PER_CORRECT * 2; }
      S.data.diagramSeen[def.id] = Date.now();
      st.review.push({ ok: ok, q: U.trunc(info.q, 110), mod: def.mod, a: info.a, why: info.why });
      S.saveSoon();

      var w = U.el("div", { class:"why " + (ok ? "ok" : "no") });
      w.appendChild(U.el("div", { class:"why-h", text: ok ? "Correct" : "Not quite" }));
      w.appendChild(U.el("div", { text: info.why }));
      host.appendChild(w);
      host.appendChild(U.el("div", { class:"row", style:"margin-top:14px" }, [
        U.el("button", { class:"btn btn-primary btn-block", onclick: function () { st.i++; next(); } },
          st.i + 1 >= ROUND ? "See results" : "Next diagram")
      ]));
    }

    function finish() {
      if (st.done) return;
      st.done = true;
      UI._gsRefresh = null;
      var acc = st.answered ? st.correct / st.answered : 0;
      var rec = UI.award({ xp: Math.round(st.xp), bonus: 130, readRatio: st.answered ? st.counted / st.answered : 0, accuracy: acc, mode:"labelit", score: st.correct });
      rec.questions = st.answered;
      if (ECON.Achievements) ECON.Achievements.check(rec);

      UI.results(view, {
        title:"Label It complete", correct: st.correct, total: st.answered,
        rows:[
          ["Correct", st.correct + " / " + st.answered],
          ["XP from answers", U.fmtInt(Math.round(st.xp))],
          ["Completion bonus", rec.bonusWithheld ? "0  (withheld below 50%)" : "+" + U.fmtInt(rec.bonus)],
          ["Total earned", U.fmtInt(rec.xp) + " XP  ·  " + U.fmtInt(rec.coins) + " ◉"],
          ["Diagrams explored", Object.keys(S.data.diagramSeen).length + " / " + ECON.Bank.diagrams().length]
        ],
        review: st.review.filter(function (x) { return !x.ok; }),
        again: function () { UI.render(); }
      });
    }

    return function () { st.done = true; UI._gsRefresh = null; ECON.Tools.detach(); UI.hideTabs(false); };
  });
})(typeof window !== "undefined" ? window : globalThis);
