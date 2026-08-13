/* Sort It — classify against the clock. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, R = ECON.Run;

  R.register({
    id:"sortit", name:"Sort It", icon:"🗂️", route:"/play/sortit",
    blurb:"Classify items against the clock: biotic/abiotic, mitosis/meiosis, pathogen types.",
    group:"Core"
  });

  var TIME_MS = 90000;

  UI.route("/play/sortit", function (view) {
    var pool = ECON.Bank.active("sort");
    if (!pool.length) { ECON.Coverage.warnIfEmpty("sort"); return; }

    ECON.Tools.startRun("sortit");
    var set = U.pick(pool);
    var items = U.shuffle(set.items);
    var shell = UI.gameShell(view, { title:"Sort It", sub: set.title, onQuit: function () { UI.go("/home"); } });
    UI._gsRefresh = paint;
    ECON.Tools.attach("sortit");

    var st = { i:0, counted:0, correct:0, answered:0, streak:0, xp:0, wrong:[], done:false, endsAt: Date.now() + TIME_MS };
    var timer = setInterval(function () {
      if (st.done) return;
      if (Date.now() >= st.endsAt) finish("Time");
      else paint();
    }, 250);

    next();

    function paint() {
      var left = Math.max(0, st.endsAt - Date.now());
      shell.setMeters([
        { text:"⏱ " + U.fmtTime(left), hot: left < 15000 },
        { text: st.correct + "/" + st.answered },
        { text:"🔥 " + st.streak + "  " + UI.streakBadge(st.streak) }
      ]);
      shell.setProgress(st.i / items.length);
    }

    function next() {
      if (st.done) return;
      if (st.i >= items.length) return finish("All sorted");
      paint();
      var it = items[st.i];
      var host = shell.clear();
      var shownAt = Date.now();

      host.appendChild(U.el("div", { class:"qmeta" }, [
        U.el("span", { class:"badge badge-accent", text: set.mod }),
        U.el("span", { class:"badge", text: set.title })
      ]));
      host.appendChild(U.el("div", { class:"qtext", style:"font-size:20px;text-align:center;padding:20px 8px", text: it[0] }));

      var box = U.el("div", { class:"opts" });
      var answered = false, btns = [];
      set.bins.forEach(function (bin) {
        var b = U.el("button", { class:"opt", type:"button", style:"justify-content:center" }, [
          U.el("span", { class:"grow", style:"text-align:center;font-weight:700", text: bin })
        ]);
        b.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var ok = bin === it[1];
          btns.forEach(function (bb) {
            bb.disabled = true;
            if (bb.dataset.bin === it[1]) bb.classList.add("right");
            else if (bb === b) bb.classList.add("wrong");
            else bb.classList.add("dim");
          });
          st.answered++;
          if (Date.now() - shownAt >= S.MIN_READ_MS) st.counted++;
          if (ok) {
            st.correct++; st.streak++;
            if (Date.now() - shownAt >= S.MIN_READ_MS) st.xp += S.XP_PER_CORRECT * (set.diff || 1) * S.streakMult(st.streak) * 0.6;
          } else {
            st.streak = 0;
            st.wrong.push({ ok:false, q: it[0], mod: set.mod, a: it[1], why: set.why });
          }
          st.i++;
          paint();
          setTimeout(next, ok ? 380 : 1400);
          if (!ok) {
            host.appendChild(U.el("div", { class:"why no", style:"margin-top:12px" }, [
              U.el("div", { class:"why-h", text:"Correct bin: " + it[1] }),
              U.el("div", { text: set.why })
            ]));
          }
        });
        b.dataset.bin = bin;
        btns.push(b); box.appendChild(b);
      });
      host.appendChild(box);
    }

    function finish(reason) {
      if (st.done) return;
      st.done = true;
      clearInterval(timer);
      UI._gsRefresh = null;
      var acc = st.answered ? st.correct / st.answered : 0;
      var rec = UI.award({ xp: Math.round(st.xp), bonus: st.i >= items.length ? 90 : 0, readRatio: st.answered ? st.counted / st.answered : 0, accuracy: acc, mode:"sortit", score: st.correct });
      rec.questions = st.answered;
      if (ECON.Achievements) ECON.Achievements.check(rec);

      UI.results(view, {
        title: reason, subtitle: set.title,
        correct: st.correct, total: st.answered,
        rows:[
          ["Sorted", st.correct + " / " + st.answered],
          ["Accuracy", Math.round(acc * 100) + "%"],
          ["XP earned", U.fmtInt(rec.xp) + " XP  ·  " + U.fmtInt(rec.coins) + " ◉"]
        ],
        review: st.wrong.slice(0, 12),
        again: function () { UI.render(); }
      });
    }

    return function () { st.done = true; clearInterval(timer); UI._gsRefresh = null; ECON.Tools.detach(); UI.hideTabs(false); };
  });
})(typeof window !== "undefined" ? window : globalThis);
