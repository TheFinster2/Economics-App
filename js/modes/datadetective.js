/* Data Detective — read a graph or table and answer. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, R = ECON.Run;

  R.register({
    id:"datadetective", name:"Data Detective", icon:"📈", route:"/play/datadetective",
    blurb:"Read a graph or a table and answer questions about what it shows.",
    group:"Core"
  });

  UI.route("/play/datadetective", function (view) {
    var pool = ECON.Bank.active("dataset");
    if (!pool.length) { ECON.Coverage.warnIfEmpty("dataset"); return; }

    ECON.Tools.startRun("datadetective");
    var set = U.pick(pool);
    var qs = U.shuffle(set.questions);
    var shell = UI.gameShell(view, { title:"Data Detective", sub: set.title, onQuit: function () { UI.go("/home"); } });
    UI._gsRefresh = paint;
    ECON.Tools.attach("datadetective");

    var st = { i:0, counted:0, correct:0, answered:0, xp:0, review:[], done:false, shownAt:0 };
    next();

    function paint() {
      shell.setMeters([{ text:"Q " + Math.min(st.i + 1, qs.length) + "/" + qs.length }, { text: st.correct + " correct" }]);
      shell.setProgress(st.i / qs.length);
    }

    function next() {
      if (st.done) return;
      if (st.i >= qs.length) return finish();
      paint();
      var q = qs[st.i];
      st.shownAt = Date.now();
      var host = shell.clear();

      host.appendChild(U.el("div", { class:"qmeta" }, [
        U.el("span", { class:"badge badge-accent", text: set.mod }),
        U.el("span", { class:"badge", text: set.topic }),
        U.el("span", { class:"badge", text:"×" + set.diff })
      ]));
      host.appendChild(U.el("h3", { text: set.title, style:"margin-top:2px" }));
      host.appendChild(set.kind === "table" ? renderTable(set) : renderChart(set));

      var qHost = U.el("div");
      host.appendChild(qHost);
      qHost.appendChild(U.el("div", { class:"qtext", style:"font-size:16px", text: q.q }));

      var box = U.el("div", { class:"opts" });
      var order = U.shuffle(q.options.map(function (_, k) { return k; }));
      var btns = [], answered = false;
      order.forEach(function (oi, n) {
        var b = U.el("button", { class:"opt", type:"button" }, [
          U.el("span", { class:"k", text:"ABCD".charAt(n) }),
          U.el("span", { class:"grow", text: q.options[oi] })
        ]);
        b.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var ok = oi === q.answer;
          btns.forEach(function (bb, j) {
            bb.disabled = true;
            if (order[j] === q.answer) bb.classList.add("right");
            else if (bb === b) bb.classList.add("wrong");
            else bb.classList.add("dim");
          });
          resolve(ok, q, oi, qHost);
        });
        btns.push(b); box.appendChild(b);
      });
      qHost.appendChild(box);
    }

    function resolve(ok, q, chosen, host) {
      st.answered++;
      var counts = (Date.now() - st.shownAt) >= S.MIN_READ_MS;
      if (counts) st.counted++;
      if (ok) {
        st.correct++;
        if (counts) st.xp += S.XP_PER_CORRECT * (set.diff || 2);
      }
      st.review.push({ ok: ok, q: U.trunc(q.q, 110), mod: set.mod, a: q.options[q.answer], why: q.why });
      S.saveSoon();
      host.appendChild(UI.explain(q, ok, chosen));
      host.appendChild(U.el("div", { class:"row", style:"margin-top:14px" }, [
        U.el("button", { class:"btn btn-primary btn-block", onclick: function () { st.i++; next(); } },
          st.i + 1 >= qs.length ? "See results" : "Next question")
      ]));
    }

    function finish() {
      if (st.done) return;
      st.done = true;
      UI._gsRefresh = null;
      var acc = st.answered ? st.correct / st.answered : 0;
      var rec = UI.award({ xp: Math.round(st.xp), bonus: 110, readRatio: st.answered ? st.counted / st.answered : 0, accuracy: acc, mode:"datadetective", score: st.correct });
      rec.questions = st.answered;
      if (ECON.Achievements) ECON.Achievements.check(rec);
      UI.results(view, {
        title:"Data Detective complete", subtitle: set.title,
        correct: st.correct, total: st.answered,
        rows:[
          ["Correct", st.correct + " / " + st.answered],
          ["XP from answers", U.fmtInt(Math.round(st.xp))],
          ["Completion bonus", rec.bonusWithheld ? "0  (withheld)" : "+" + U.fmtInt(rec.bonus)],
          ["Total earned", U.fmtInt(rec.xp) + " XP  ·  " + U.fmtInt(rec.coins) + " ◉"]
        ],
        review: st.review.filter(function (x) { return !x.ok; }),
        again: function () { UI.render(); }
      });
    }

    return function () { st.done = true; UI._gsRefresh = null; ECON.Tools.detach(); UI.hideTabs(false); };
  });

  /* ── renderers ───────────────────────────────────────────────────── */
  function renderTable(set) {
    var wrap = U.el("div", { class:"card card-tight scroll-x" });
    var t = U.el("table", { class:"data" });
    var thead = U.el("thead");
    var tr = U.el("tr");
    set.columns.forEach(function (c) { tr.appendChild(U.el("th", { text: c })); });
    thead.appendChild(tr);
    t.appendChild(thead);
    var tb = U.el("tbody");
    set.rows.forEach(function (r) {
      var row = U.el("tr");
      r.forEach(function (cell) { row.appendChild(U.el("td", { text: cell })); });
      tb.appendChild(row);
    });
    t.appendChild(tb);
    wrap.appendChild(t);
    return wrap;
  }

  var PALETTE = ["var(--accent)", "var(--warn)", "var(--info)", "var(--violet)"];

  function renderChart(set) {
    var W = 440, H = 280, m = { l: 52, r: 16, t: 18, b: 46 };
    var all = set.series.reduce(function (a, s) { return a.concat(s.points); }, []);
    var xs = all.map(function (p) { return p[0]; }), ys = all.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = 0, y1 = Math.max.apply(null, ys);
    y1 = niceMax(y1);
    if (x1 === x0) x1 = x0 + 1;

    function px(x) { return m.l + (x - x0) / (x1 - x0) * (W - m.l - m.r); }
    function py(y) { return H - m.b - (y - y0) / (y1 - y0) * (H - m.t - m.b); }

    var s = "<svg viewBox='0 0 " + W + " " + H + "'>";
    // gridlines
    for (var g = 0; g <= 4; g++) {
      var yv = y0 + (y1 - y0) * g / 4;
      s += "<line x1='" + m.l + "' y1='" + py(yv) + "' x2='" + (W - m.r) + "' y2='" + py(yv) +
           "' stroke='var(--line-soft)' stroke-width='1'/>";
      s += "<text x='" + (m.l - 8) + "' y='" + (py(yv) + 4) + "' text-anchor='end' fill='var(--ink-3)' font-size='11'>" +
           U.fmtNum(yv, yv % 1 ? 1 : 0) + "</text>";
    }
    s += "<line x1='" + m.l + "' y1='" + py(0) + "' x2='" + (W - m.r) + "' y2='" + py(0) + "' stroke='var(--ink-2)' stroke-width='2'/>";
    s += "<line x1='" + m.l + "' y1='" + m.t + "' x2='" + m.l + "' y2='" + py(0) + "' stroke='var(--ink-2)' stroke-width='2'/>";

    // x ticks
    var ticks = U.uniq(xs).sort(function (a, b) { return a - b; });
    if (ticks.length > 7) ticks = ticks.filter(function (_, i) { return i % Math.ceil(ticks.length / 7) === 0; });
    ticks.forEach(function (t) {
      s += "<text x='" + px(t) + "' y='" + (H - m.b + 18) + "' text-anchor='middle' fill='var(--ink-3)' font-size='11'>" + t + "</text>";
    });

    set.series.forEach(function (ser, si) {
      var col = PALETTE[si % PALETTE.length];
      var d = ser.points.map(function (p, i) { return (i ? "L" : "M") + px(p[0]) + " " + py(p[1]); }).join(" ");
      s += "<path d='" + d + "' fill='none' stroke='" + col + "' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/>";
      ser.points.forEach(function (p) {
        s += "<circle cx='" + px(p[0]) + "' cy='" + py(p[1]) + "' r='4' fill='" + col + "'/>";
      });
      s += "<rect x='" + (m.l + 8 + si * 150) + "' y='" + (m.t - 8) + "' width='12' height='4' rx='2' fill='" + col + "'/>";
      s += "<text x='" + (m.l + 26 + si * 150) + "' y='" + (m.t - 2) + "' fill='var(--ink-2)' font-size='11'>" + U.esc(ser.name) + "</text>";
    });

    s += "<text x='" + ((W + m.l) / 2) + "' y='" + (H - 6) + "' text-anchor='middle' fill='var(--ink-3)' font-size='11'>" + U.esc(set.xLabel) + "</text>";
    s += "<text x='14' y='" + (H / 2) + "' text-anchor='middle' fill='var(--ink-3)' font-size='11' transform='rotate(-90 14 " + (H / 2) + ")'>" + U.esc(set.yLabel) + "</text>";
    s += "</svg>";

    var wrap = U.el("div", { class:"dg-wrap" });
    wrap.innerHTML = s;
    return wrap;
  }

  function niceMax(v) {
    if (v <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log10(v)));
    return Math.ceil(v / (mag / 2)) * (mag / 2);
  }
})(typeof window !== "undefined" ? window : globalThis);
