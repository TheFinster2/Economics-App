/* Term Match — term ↔ definition ↔ module, three ways.
   The reference is withheld entirely: the glossary IS the answer key. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, R = ECON.Run;

  R.register({
    id:"termmatch", name:"Term Match", icon:"🔗", route:"/play/termmatch",
    blurb:"Match terms to definitions and to modules. No reference.",
    group:"Core"
  });

  var ROUND = 8;

  UI.route("/play/termmatch", function (view) {
    var pool = ECON.Bank.active("card");
    if (pool.length < 6) { if (ECON.Coverage.warnIfEmpty("card")) return; }

    ECON.Tools.startRun("termmatch");
    var shell = UI.gameShell(view, { title:"Term Match", sub:"Reference withheld", onQuit: function () { UI.go("/home"); } });
    UI._gsRefresh = paint;
    ECON.Tools.attach("termmatch");

    var st = { i:0, counted:0, correct:0, answered:0, streak:0, xp:0, review:[], done:false, shownAt:0 };
    next();

    function paint() {
      shell.setMeters([
        { text:"Q " + Math.min(st.i + 1, ROUND) + "/" + ROUND },
        { text: st.correct + " correct" },
        { text:"🔥 " + st.streak + "  " + UI.streakBadge(st.streak) },
        { text:"Reference off" }
      ]);
      shell.setProgress(st.i / ROUND);
    }

    function next() {
      if (st.done) return;
      if (st.i >= ROUND) return finish();
      paint();

      var card = U.pick(pool);
      var kind = U.pick(["toBack", "toFront", "toModule"]);
      var qa = buildQ(card, kind, pool);
      if (!qa) { st.i++; return next(); }

      st.shownAt = Date.now();
      var host = shell.clear();
      host.appendChild(U.el("div", { class:"qmeta" }, [
        U.el("span", { class:"badge badge-accent", text: card.mod }),
        U.el("span", { class:"badge", text: U.trunc(card.topic || "", 28) })
      ]));
      host.appendChild(U.el("div", { class:"qtext", text: qa.q }));

      var box = U.el("div", { class:"opts" });
      var btns = [], answered = false;
      qa.options.forEach(function (txt, n) {
        var b = U.el("button", { class:"opt", type:"button" }, [
          U.el("span", { class:"k", text:"ABCD".charAt(n) }),
          U.el("span", { class:"grow", text: txt })
        ]);
        b.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var ok = n === qa.answer;
          btns.forEach(function (bb, j) {
            bb.disabled = true;
            if (j === qa.answer) bb.classList.add("right"); else if (bb === b) bb.classList.add("wrong"); else bb.classList.add("dim");
          });
          resolve(ok, qa, card, host);
        });
        btns.push(b); box.appendChild(b);
      });
      host.appendChild(box);
    }

    function buildQ(card, kind, all) {
      if (kind === "toModule") {
        var right = card.mod + " — " + U.moduleName(card.mod);
        var others = U.shuffle(U.MODULES.filter(function (m) { return m.id !== card.mod; }))
          .slice(0, 3).map(function (m) { return m.id + " — " + m.name; });
        var opts = U.shuffle([right].concat(others));
        return {
          q:"Which module does “" + card.front + "” belong to?",
          options: opts, answer: opts.indexOf(right),
          why: card.front + " is a " + card.mod + " term. " + card.back
        };
      }
      var field = kind === "toBack" ? "back" : "front";
      var other = kind === "toBack" ? "front" : "back";
      var sameMod = all.filter(function (c) { return c.id !== card.id && c.mod === card.mod; });
      var distractPool = (sameMod.length >= 3 ? sameMod : all.filter(function (c) { return c.id !== card.id; }));
      var picks = U.sample(distractPool, 3).map(function (c) { return c[field]; });
      if (picks.length < 3) return null;
      var opts2 = U.shuffle([card[field]].concat(picks));
      return {
        q: kind === "toBack" ? "What does “" + card.front + "” mean?" : "Which term matches this description?\n\n" + card.back,
        options: opts2.map(function (t) { return U.trunc(t, 150); }),
        answer: opts2.indexOf(card[field]),
        why: card.front + " — " + card.back,
        _full: opts2
      };
    }

    function resolve(ok, qa, card, host) {
      st.answered++;
      var counts = (Date.now() - st.shownAt) >= S.MIN_READ_MS;
      if (counts) st.counted++;
      if (ok) {
        st.correct++; st.streak++;
        if (counts) st.xp += S.XP_PER_CORRECT * S.streakMult(st.streak);
      } else st.streak = 0;
      st.review.push({ ok: ok, q: U.trunc(qa.q, 110), mod: card.mod, a: qa.options[qa.answer], why: qa.why });
      S.saveSoon();

      var w = U.el("div", { class:"why " + (ok ? "ok" : "no") });
      w.appendChild(U.el("div", { class:"why-h", text: ok ? "Correct" : "Not quite" }));
      w.appendChild(U.el("div", { text: qa.why }));
      host.appendChild(w);
      host.appendChild(U.el("div", { class:"row", style:"margin-top:14px" }, [
        U.el("button", { class:"btn btn-primary btn-block", onclick: function () { st.i++; next(); } },
          st.i + 1 >= ROUND ? "See results" : "Next term")
      ]));
    }

    function finish() {
      if (st.done) return;
      st.done = true;
      UI._gsRefresh = null;
      var acc = st.answered ? st.correct / st.answered : 0;
      var rec = UI.award({ xp: Math.round(st.xp), bonus: 100, readRatio: st.answered ? st.counted / st.answered : 0, accuracy: acc, mode:"termmatch", score: st.correct });
      rec.questions = st.answered;
      if (ECON.Achievements) ECON.Achievements.check(rec);
      UI.results(view, {
        title:"Term Match complete", correct: st.correct, total: st.answered,
        rows:[
          ["Correct", st.correct + " / " + st.answered],
          ["XP from answers", U.fmtInt(Math.round(st.xp))],
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
