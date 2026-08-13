/* Module bosses — one per module. 20 questions, no reference, 75% to clear. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, R = ECON.Run;

  R.register({
    id:"boss", name:"Module Boss", icon:"🛡️", route:"/play/boss",
    blurb:"20 questions from one module. 75% to clear it. Unlocks at 30 questions seen.",
    group:"Challenge"
  });

  var LENGTH = 20, PASS = 0.75, UNLOCK_SEEN = 30;

  UI.route("/play/boss", function (view, r) {
    var mod = r.query.mod;
    if (!mod) return chooser(view);

    var seen = ECON.Bank.all("mcq").filter(function (q) { return q.mod === mod && S.data.seen[q.id]; }).length;
    if (seen < UNLOCK_SEEN) {
      UI.modal({
        title:"Boss locked",
        body:"Answer " + UNLOCK_SEEN + " questions from " + mod + " first. You have seen " + seen + ".",
        actions:[
          { label:"Drill this module", kind:"primary", onclick: function () { UI.go("/play/drill?mod=" + mod); } },
          { label:"Back", kind:"ghost", onclick: function () { UI.go("/play/boss"); } }
        ]
      });
      return;
    }

    var qs = ECON.Bank.draw("mcq", LENGTH, { filter: function (q) { return q.mod === mod; } });
    if (qs.length < 8) { ECON.Coverage.warnIfEmpty("mcq", function (q) { return q.mod === mod; }); return; }

    var teardown = R.start(view, {
      id:"boss",
      title:"Boss — " + mod,
      sub: U.moduleName(mod) + " · " + Math.round(PASS * 100) + "% to clear",
      questions: qs,
      limit: qs.length,
      streakBonus: true,
      bonus: 400,
      extraRows: function (st) {
        var acc = st.answered ? st.correct / st.answered : 0;
        var cleared = acc >= PASS;
        var prev = S.data.bosses[mod] || { cleared: false, best: 0 };
        S.data.bosses[mod] = { cleared: prev.cleared || cleared, best: Math.max(prev.best, st.correct) };
        S.saveSoon();
        return [
          ["Result", cleared ? "CLEARED ✓" : "Not cleared — needed " + Math.ceil(PASS * st.answered)],
          ["Best on this boss", String(S.data.bosses[mod].best)]
        ];
      }
    });
    return teardown;
  });

  function chooser(view) {
    UI.hideTabs(false);
    view.appendChild(U.el("h1", { text:"Module Bosses" }));
    view.appendChild(U.el("p", { class:"muted", text:"Twenty questions from one module, at " + Math.round(PASS * 100) + "% to clear. The tool tray reference still costs 25% — clearing a boss with it is not the same as clearing it without." }));

    var list = U.el("div", { class:"list" });
    U.MODULES.forEach(function (m) {
      var seen = ECON.Bank.all("mcq").filter(function (q) { return q.mod === m.id && S.data.seen[q.id]; }).length;
      var b = S.data.bosses[m.id] || { cleared:false, best:0 };
      var locked = seen < UNLOCK_SEEN;
      var row = U.el("button", { class:"li", style:"width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer" }, [
        U.el("span", { style:"font-size:20px", text: b.cleared ? "🛡️" : locked ? "🔒" : "⚔️" }),
        U.el("div", { class:"grow" }, [
          U.el("b", { text: m.id + " — " + m.name }),
          U.el("small", { text: locked ? (seen + "/" + UNLOCK_SEEN + " questions seen") :
            (b.cleared ? "Cleared · best " + b.best + "/" + LENGTH : "Best " + b.best + "/" + LENGTH) })
        ]),
        U.el("span", { class:"muted2", text:"›" })
      ]);
      if (locked) row.style.opacity = ".55";
      row.addEventListener("click", function () { UI.go("/play/boss?mod=" + m.id); });
      list.appendChild(row);
    });
    view.appendChild(list);
  }
})(typeof window !== "undefined" ? window : globalThis);
