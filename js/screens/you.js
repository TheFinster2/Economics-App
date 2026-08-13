/* You — progress, achievements, coverage by module. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State;

  UI.route("/you", function (view) {
    UI.hideTabs(false);
    var d = S.data, lv = S.levelFromXp(d.xp);

    view.appendChild(U.el("h1", { text:"You" }));

    // A dev-unlocked save must always say so. Numbers that were not earned
    // should never be able to pass as numbers that were.
    if (d.devUnlocked) {
      view.appendChild(U.el("div", { class:"why no" }, [
        U.el("div", { class:"why-h", text:"Dev-unlocked save" }),
        U.el("div", { class:"small", text:"XP, credits or progress on this save were set from the dev panel rather than earned. Reset from #/dev for a real run-through." })
      ]));
    }

    view.appendChild(U.el("div", { class:"card" }, [
      U.el("div", { class:"spread" }, [
        U.el("div", {}, [
          U.el("div", { style:"font-size:26px;font-weight:800;color:var(--accent)", text:"Level " + lv.level }),
          U.el("div", { class:"muted2", text: U.fmtInt(d.xp) + " XP total" })
        ]),
        U.el("div", { style:"text-align:right" }, [
          U.el("div", { style:"font-size:20px;font-weight:800;color:var(--warn)", text:"◉ " + U.fmtInt(d.coins) }),
          U.el("div", { class:"muted2", text: U.plural(d.streakDays || 0, "day") + " streak" })
        ])
      ]),
      U.el("div", { class:"bar", style:"margin-top:10px" }, [
        U.el("i", { style:"width:" + (lv.need ? Math.min(100, lv.into / lv.need * 100) : 100) + "%" })
      ]),
      U.el("div", { class:"muted2 small", style:"margin-top:6px",
        text: lv.need ? U.fmtInt(lv.into) + " / " + U.fmtInt(lv.need) + " XP to level " + (lv.level + 1) : "Maximum level reached." })
    ]));

    /* ── module coverage ── */
    view.appendChild(U.el("h2", { text:"Coverage by module" }));
    var stats = ECON.Bank.moduleStats();
    var list = U.el("div", { class:"list" });
    U.MODULES.forEach(function (m) {
      var st = stats[m.id];
      var pct = st.total ? Math.round(st.seen / st.total * 100) : 0;
      var boss = d.bosses[m.id] || {};
      list.appendChild(U.el("div", { class:"li", style:"flex-direction:column;align-items:stretch;gap:6px" }, [
        U.el("div", { class:"spread" }, [
          U.el("div", {}, [
            U.el("b", { text: m.id + " — " + m.name }),
            U.el("small", { text: st.seen + "/" + st.total + " seen · " + st.missed + " in rehab" })
          ]),
          boss.cleared ? U.el("span", { class:"badge badge-good", text:"boss cleared" }) : null
        ]),
        U.el("div", { class:"bar" }, [U.el("i", { style:"width:" + pct + "%" })])
      ]));
    });
    view.appendChild(list);

    /* ── stats ── */
    view.appendChild(U.el("h2", { text:"Totals" }));
    var counts = ECON.Bank.counts();
    var seenMcq = ECON.Bank.all("mcq").filter(function (q) { return d.seen[q.id]; }).length;
    var totals = [
      ["Runs completed", U.fmtInt(d.runs || 0)],
      ["Questions seen", seenMcq + " / " + counts.mcq],
      ["Flashcards started", Object.keys(d.cards).length + " / " + counts.card],
      ["Written responses marked", String(Object.keys(d.shortLog).length)],
      ["Diagrams explored", Object.keys(d.diagramSeen).length + " / " + counts.diagram],
      ["Calculations solved", U.fmtInt(d.bests.calcSolved || 0)],
      ["Market shocks solved", U.fmtInt(d.bests.shiftsSolved || 0)],
      ["Best Survival run", U.fmtInt(d.bests.survival || 0)],
      ["Longest daily streak", U.plural(d.bestStreakDays || 0, "day")]
    ];
    var tl = U.el("div", { class:"list" });
    totals.forEach(function (t) {
      tl.appendChild(U.el("div", { class:"li" }, [
        U.el("div", { class:"grow", text: t[0] }),
        U.el("b", { text: t[1] })
      ]));
    });
    view.appendChild(tl);

    /* ── achievements ── */
    var ap = ECON.Achievements.progress();
    view.appendChild(U.el("h2", { text:"Achievements  " + ap.have + "/" + ap.total }));
    var ag = U.el("div", { class:"list" });
    ECON.Achievements.all().forEach(function (a) {
      var have = S.has(a.id);
      ag.appendChild(U.el("div", { class:"li", style: have ? "" : "opacity:.5" }, [
        U.el("span", { style:"font-size:20px", text: a.icon }),
        U.el("div", { class:"grow" }, [U.el("b", { text: a.name }), U.el("small", { text: a.desc })]),
        have ? U.el("span", { class:"badge badge-good", text:"✓" }) : null
      ]));
    });
    view.appendChild(ag);

    view.appendChild(U.el("div", { class:"row", style:"margin-top:16px" }, [
      U.el("button", { class:"btn grow", onclick: function () { UI.go("/settings"); } }, "Settings")
    ]));
  });
})(typeof window !== "undefined" ? window : globalThis);
