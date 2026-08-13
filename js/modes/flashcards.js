/* Flashcards — spaced repetition (Leitner, 5 boxes).

   Self-graded, so priced like an earlier app in this lineage’s flashcards: a card pays only
   when it is genuinely due, only once per day per card, and only if the answer
   was on screen for at least MIN_READ_MS. Grading every card "easy" as fast as
   you can tap must earn 0 XP/hour — tests/exploit.js asserts it. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, R = ECON.Run;

  R.register({
    id:"flashcards", name:"Flashcards", icon:"🃏", route:"/cards",
    blurb:"Spaced repetition over the whole terminology load. The highest-value mode in the app.",
    group:"Core"
  });

  var SESSION = 20;
  var XP_PER_CARD = 4;

  UI.route("/play/flashcards", function (view, r) {
    var pool = ECON.Bank.active("card", r.query.mod ? function (c) { return c.mod === r.query.mod; } : null);
    if (!pool.length) { ECON.Coverage.warnIfEmpty("card"); return; }

    var due = S.dueCards(pool.map(function (c) { return c.id; }));
    var dueCards = pool.filter(function (c) { return due.indexOf(c.id) >= 0; });
    var deck = (dueCards.length ? U.sample(dueCards, SESSION) : U.sample(pool, SESSION));
    var onlyReview = dueCards.length === 0;

    ECON.Tools.startRun("flashcards");
    var shell = UI.gameShell(view, {
      title:"Flashcards",
      sub: onlyReview ? "Nothing due — free review, pays nothing" : U.plural(dueCards.length, "card") + " due",
      onQuit: function () { UI.go("/cards"); }
    });
    UI._gsRefresh = paint;

    var st = { i:0, xp:0, done:false, reviewed:0, again:0, flippedAt:0, paidToday:{} };
    next();

    function paint() {
      shell.setMeters([
        { text:"Card " + Math.min(st.i + 1, deck.length) + "/" + deck.length },
        { text: st.reviewed + " reviewed" },
        onlyReview ? { text:"Free review — 0 XP" } : null
      ].filter(Boolean));
      shell.setProgress(st.i / deck.length);
    }

    function next() {
      if (st.done) return;
      if (st.i >= deck.length) return finish();
      paint();
      var card = deck[st.i];
      var host = shell.clear();
      var cs = S.cardState(card.id);

      host.appendChild(U.el("div", { class:"qmeta" }, [
        U.el("span", { class:"badge badge-accent", text: card.mod }),
        U.el("span", { class:"badge", text: U.trunc(card.topic || "", 26) }),
        U.el("span", { class:"badge", text:"box " + (cs.box + 1) + "/" + S.BOX_DAYS.length })
      ]));

      var face = U.el("div", { class:"card", style:"min-height:180px;display:grid;place-items:center;text-align:center;padding:26px 16px" }, [
        U.el("div", { style:"font-size:20px;font-weight:700;line-height:1.4", text: card.front })
      ]);
      host.appendChild(face);

      var flip = U.el("button", { class:"btn btn-primary btn-block", style:"margin-top:12px" }, "Show the answer");
      host.appendChild(flip);
      flip.addEventListener("click", function () {
        flip.remove();
        st.flippedAt = Date.now();
        face.appendChild(U.el("hr", { style:"border:0;border-top:1px solid var(--line-soft);width:100%;margin:16px 0" }));
        face.appendChild(U.el("div", { style:"font-size:16px;line-height:1.55;color:var(--ink-2)", text: card.back }));
        host.appendChild(grades(card));
      });
    }

    function grades(card) {
      var row = U.el("div", { style:"display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:12px" });
      [["Again", 0, "var(--bad)"], ["Hard", 1, "var(--warn)"], ["Good", 2, "var(--accent)"], ["Easy", 3, "var(--good)"]]
        .forEach(function (g) {
          var b = U.el("button", { class:"btn btn-sm", style:"border-color:" + g[2] + ";color:" + g[2] }, g[0]);
          b.addEventListener("click", function () { grade(card, g[1]); });
          row.appendChild(b);
        });
      var wrap = U.el("div");
      wrap.appendChild(row);
      wrap.appendChild(U.el("div", { class:"muted2 small", style:"margin-top:8px;text-align:center",
        text:"Again = today · Hard = 1 day · Good = next box · Easy = skip a box" }));
      return wrap;
    }

    function grade(card, g) {
      var readMs = Date.now() - st.flippedAt;
      var wasDue = !onlyReview && !st.paidToday[card.id];
      S.reviewCard(card.id, g);
      st.reviewed++;
      if (wasDue && readMs >= S.MIN_READ_MS && g >= 1) {
        // "Again" pays nothing — you did not know it, and paying for a miss is
        // exactly how a self-graded mode becomes free XP.
        st.xp += XP_PER_CARD;
        st.paidToday[card.id] = true;
      }
      if (g === 0) st.again++;
      st.i++;
      next();
    }

    function finish() {
      if (st.done) return;
      st.done = true;
      UI._gsRefresh = null;
      var rec = UI.award({ xp: Math.round(st.xp), mode:"flashcards", score: st.reviewed, accuracy: st.reviewed ? 1 - st.again / st.reviewed : null });
      rec.questions = st.reviewed;
      if (ECON.Achievements) ECON.Achievements.check(rec);

      var boxes = [0, 0, 0, 0, 0];
      Object.keys(S.data.cards).forEach(function (id) { boxes[S.data.cards[id].box]++; });

      UI.results(view, {
        title:"Session complete",
        subtitle: st.reviewed + " cards reviewed",
        correct: st.reviewed - st.again, total: st.reviewed,
        rows:[
          ["Reviewed", String(st.reviewed)],
          ["Marked 'again'", String(st.again)],
          ["Box distribution", boxes.join(" · ")],
          ["XP earned", U.fmtInt(rec.xp) + " XP  ·  " + U.fmtInt(rec.coins) + " ◉"],
          onlyReview ? ["Note", "Nothing was due, so this session paid nothing."] : null
        ].filter(Boolean),
        again: function () { UI.render(); }
      });
    }

    return function () { st.done = true; UI._gsRefresh = null; ECON.Tools.detach(); UI.hideTabs(false); };
  });
})(typeof window !== "undefined" ? window : globalThis);
