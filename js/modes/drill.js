/* Module Drill — 15 adaptive questions from one module. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, R = ECON.Run, S = ECON.State;

  R.register({
    id:"drill", name:"Module Drill", icon:"🎯", route:"/play/drill",
    blurb:"15 adaptive questions from one module. Untimed.",
    group:"Core"
  });

  UI.route("/play/drill", function (view, r) {
    var mod = r.query.mod;
    if (!mod) return chooser(view);
    if (ECON.Coverage.warnIfEmpty("mcq", function (q) { return q.mod === mod; })) return;

    var qs = ECON.Bank.draw("mcq", 15, { filter: function (q) { return q.mod === mod; } });
    if (!qs.length) { UI.go("/play/drill"); return; }

    return R.start(view, {
      id:"drill",
      title:"Module Drill",
      sub: mod + " — " + U.moduleName(mod),
      questions: qs,
      limit: qs.length,
      streakBonus: true,
      bonus: 120
    });
  });

  function chooser(view) {
    UI.hideTabs(false);
    view.appendChild(U.el("h1", { text: "Module Drill" }));
    view.appendChild(U.el("p", { class: "muted", text: "15 adaptive questions from one module. Questions you have missed before come up more often." }));

    var stats = ECON.Bank.moduleStats();
    var grid = U.el("div", { class: "list" });
    U.MODULES.forEach(function (m) {
      var st = stats[m.id] || { total: 0, seen: 0 };
      var active = ECON.Bank.activeByModule("mcq", m.id).length;
      var row = U.el("button", { class: "li", style: "text-align:left;cursor:pointer;width:100%;font:inherit;color:inherit" }, [
        U.el("span", { class: "badge badge-accent", text: m.id }),
        U.el("div", { class: "grow" }, [
          U.el("b", { text: m.name }),
          U.el("small", { text: "Year " + m.year + " · " + active + " available · " + st.seen + "/" + st.total + " seen" })
        ]),
        U.el("span", { class: "muted2", text: "›" })
      ]);
      if (!active) { row.disabled = true; row.style.opacity = ".45"; }
      row.addEventListener("click", function () { UI.go("/play/drill?mod=" + m.id); });
      grid.appendChild(row);
    });
    view.appendChild(grid);
    view.appendChild(U.el("p", { class: "muted2", style: "margin-top:14px",
      text: "A module with no questions available is hidden by a coverage pack. Settings → Course coverage." }));
  }
})(typeof window !== "undefined" ? window : globalThis);
