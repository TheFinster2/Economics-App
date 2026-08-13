/* Response Builder — the short-answer mode (brief §4).
   The most important mode in the app, and the one with the strictest rules.

   THE HONESTY RULE: this app does not grade prose and never implies that it
   does. The student writes, the criteria are revealed, and the student ticks
   the points they actually made. That is the mark. Keyword hints are offered,
   labelled as guesses, never pre-ticked, never coloured red, and never fed
   into the score.

   THE FARMING RULE (§4.4): self-marked work is free XP unless it is gated.
     • a given question pays once per day, however many times it is opened
     • it pays nothing if the answer is under 20 characters
     • it pays nothing if the criteria were revealed inside MIN_READ_MS
     • ticking every box on every question must earn 0 XP/hour — tests/exploit.js
       asserts exactly that. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, M = ECON.Mark, R = ECON.Run;

  R.register({
    id:"response", name:"Response Builder", icon:"✍️", route:"/play/response",
    blurb:"Write a full short answer, then mark it against the real criteria.",
    group:"Core", flag:"most important"
  });

  var ROUND = 3;

  UI.route("/play/response", function (view, r) {
    var pool = ECON.Bank.active("short", r.query.mod ? function (q) { return q.mod === r.query.mod; } : null);
    if (!pool.length) { ECON.Coverage.warnIfEmpty("short"); return; }

    ECON.Tools.startRun("response");
    var shell = UI.gameShell(view, { title:"Response Builder", sub:"You mark your own work — honestly", onQuit: function () { UI.go("/home"); } });
    UI._gsRefresh = paint;
    ECON.Tools.attach("response");

    var st = { i:0, marksGot:0, marksTotal:0, xp:0, done:false, answered:0, log:[] };
    next();

    function paint() {
      shell.setMeters([
        { text:"Q " + Math.min(st.i + 1, ROUND) + "/" + ROUND },
        { text: st.marksGot + "/" + st.marksTotal + " marks" }
      ]);
      shell.setProgress(st.i / ROUND);
    }

    function next() {
      if (st.done) return;
      if (st.i >= ROUND) return finish();
      paint();

      // prefer questions not already paid today, so the mode stays worth playing
      var unpaid = pool.filter(function (q) { return !S.shortPaidToday(q.id); });
      var q = U.pick(unpaid.length ? unpaid : pool);
      var host = shell.clear();
      renderQuestion(host, q);
    }

    function renderQuestion(host, q) {
      var openedAt = Date.now();
      var paidToday = S.shortPaidToday(q.id);

      host.appendChild(U.el("div", { class:"qmeta" }, [
        U.el("span", { class:"badge badge-accent", text: q.mod }),
        U.el("span", { class:"badge", text: U.trunc(q.topic, 26) }),
        U.el("span", { class:"badge badge-warn", text: q.marks + " marks" }),
        paidToday ? U.el("span", { class:"badge", text:"already paid today" }) : null
      ]));
      host.appendChild(U.el("div", { class:"qtext", text: q.q }));

      var ta = U.el("textarea", {
        class:"rb-answer",
        placeholder:"Write your full answer here. Take the time you would in the exam — about " + (q.marks * 1.5).toFixed(0) + " minutes for " + q.marks + " marks.",
        spellcheck:"true"
      });
      host.appendChild(ta);

      var counter = U.el("div", { class:"muted2 small", style:"margin-top:6px", text:"0 words" });
      host.appendChild(counter);
      ta.addEventListener("input", function () {
        var e = M.effort(ta.value);
        counter.textContent = U.plural(e.words, "word") + " · " + e.chars + " characters";
      });

      host.appendChild(U.el("div", { class:"honesty",
        text:"Nothing here reads your writing while you type, and the app will not tell you your answer is wrong. When you submit, you see the real marking criteria and a sample answer, and you decide which points you made." }));

      var submit = U.el("button", { class:"btn btn-primary btn-block", style:"margin-top:10px" }, "Reveal the marking criteria");
      submit.addEventListener("click", function () {
        submit.disabled = true;
        ta.readOnly = true;
        reveal(host, q, ta.value, openedAt, paidToday);
      });
      host.appendChild(submit);

      host.appendChild(U.el("button", {
        class:"btn btn-ghost btn-block", style:"margin-top:8px",
        onclick: function () { st.i++; next(); }
      }, "Skip this question"));
    }

    function reveal(host, q, text, openedAt, paidToday) {
      var readMs = Date.now() - openedAt;
      var effort = M.effort(text);
      var hints = S.data.settings.hintsInResponse ? M.hints(q, text) : null;

      // ── the gates. Each is stated to the student rather than applied silently.
      var gates = [];
      if (paidToday) gates.push("You already earned XP for this question today. Reviewing it again is free practice.");
      if (effort.chars < S.SHORT_MIN_CHARS) gates.push("Your answer was under " + S.SHORT_MIN_CHARS + " characters, so this one pays nothing.");
      if (readMs < S.MIN_READ_MS) gates.push("The criteria were revealed in under " + (S.MIN_READ_MS / 1000) + " s — too fast to have written an answer, so this one pays nothing.");
      var pays = gates.length === 0;

      host.appendChild(U.el("h3", { text:"Marking criteria", style:"margin-top:18px" }));
      host.appendChild(U.el("div", { class:"honesty",
        text: hints ? M.DISCLAIMER : "Tick every point you actually made. Be honest — the XP is only worth having if it is." }));

      var ticked = [];
      var list = U.el("div", { class:"crit" });
      q.criteria.forEach(function (c, i) {
        var lab = U.el("label", { class:"crit-item" });
        var cb = U.el("input", { type:"checkbox" });      // NEVER pre-ticked
        cb.addEventListener("change", function () {
          ticked[i] = cb.checked;
          lab.classList.toggle("ticked", cb.checked);
          updateTally();
        });
        lab.appendChild(cb);
        var txt = U.el("span", { class:"grow" }, [document.createTextNode(c)]);
        if (hints && hints[i] && hints[i].looksCovered) {
          txt.appendChild(U.el("span", { class:"crit-hint", text:"might be covered" }));
        }
        lab.appendChild(txt);
        list.appendChild(lab);
      });
      host.appendChild(list);

      var tally = U.el("div", { style:"margin-top:10px;font-weight:800;font-size:15px" });
      host.appendChild(tally);
      function updateTally() {
        var n = ticked.filter(Boolean).length;
        tally.textContent = "You marked yourself " + n + " / " + q.criteria.length;
      }
      updateTally();

      host.appendChild(U.el("h3", { text:"Sample answer" }));
      host.appendChild(U.el("div", { class:"sample", text: q.sample }));

      if (q.common && q.common.length) {
        host.appendChild(U.el("h3", { text:"What students usually get wrong here" }));
        var ul = U.el("ul", { style:"margin:0;padding-left:18px" });
        q.common.forEach(function (c) { ul.appendChild(U.el("li", { class:"small muted", text: c })); });
        host.appendChild(ul);
      }

      if (gates.length) {
        var g = U.el("div", { class:"why no", style:"margin-top:12px" });
        g.appendChild(U.el("div", { class:"why-h", text:"This one pays nothing" }));
        gates.forEach(function (t) { g.appendChild(U.el("div", { class:"small", text: t })); });
        host.appendChild(g);
      }

      var done = U.el("button", { class:"btn btn-primary btn-block", style:"margin-top:14px" }, "Record and continue");
      done.addEventListener("click", function () {
        done.disabled = true;
        var got = ticked.filter(Boolean).length;
        st.marksGot += got;
        st.marksTotal += q.criteria.length;
        st.answered++;
        if (pays) {
          // 10 XP per criterion actually claimed, scaled by question difficulty.
          st.xp += got * S.XP_PER_CORRECT;
          S.markShortPaid(q.id);
        }
        st.log.push({ id: q.id, got: got, of: q.criteria.length, paid: pays, chars: effort.chars });
        st.i++;
        next();
      });
      host.appendChild(done);
    }

    function finish() {
      if (st.done) return;
      st.done = true;
      UI._gsRefresh = null;
      var acc = st.marksTotal ? st.marksGot / st.marksTotal : 0;
      // No completion bonus here at all. A completion bonus on self-marked work
      // is the exact shape of a per-item score floor (defect C1).
      var rec = UI.award({ xp: Math.round(st.xp), accuracy: acc, mode:"response", score: st.marksGot });
      rec.questions = st.answered;
      if (ECON.Achievements) ECON.Achievements.check(rec);

      var unpaid = st.log.filter(function (l) { return !l.paid; }).length;
      var rows = [
        ["Self-marked", st.marksGot + " / " + st.marksTotal + " criteria"],
        ["Questions attempted", String(st.answered)],
        ["XP earned", U.fmtInt(rec.xp) + " XP  ·  " + U.fmtInt(rec.coins) + " ◉"]
      ];
      if (unpaid) rows.push(["Paid nothing", unpaid + " (already paid today, too short, or revealed too fast)"]);
      if (rec.refPenalty) rows.push(["Reference penalty", "−" + U.fmtInt(rec.refPenalty) + " XP"]);

      UI.results(view, {
        title:"Response Builder complete",
        subtitle:"You marked yourself " + st.marksGot + " / " + st.marksTotal,
        correct: st.marksGot, total: st.marksTotal,
        rows: rows,
        again: function () { UI.render(); }
      });
      var v = U.$("#view");
      v.appendChild(U.el("div", { class:"honesty", style:"margin-top:14px",
        text:"These marks are yours, not the app's. Nothing here read your writing. Compare your answer with the sample and with a marking guide from a past paper — that is where the real improvement comes from." }));
    }

    return function () { st.done = true; UI._gsRefresh = null; ECON.Tools.detach(); UI.hideTabs(false); };
  });
})(typeof window !== "undefined" ? window : globalThis);
