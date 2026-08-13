/* Home — the Play screen. Modes come from the Run registry, never a hand list. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, R = ECON.Run;

  UI.route("/home", function (view) {
    UI.hideTabs(false);

    var lv = S.levelFromXp(S.data.xp);
    var counts = ECON.Bank.counts();

    view.appendChild(U.el("div", { class:"card" }, [
      U.el("div", { class:"spread" }, [
        U.el("div", {}, [
          U.el("div", { style:"font-size:20px;font-weight:800", text: greeting() }),
          U.el("div", { class:"muted2", text: S.data.streakDays
            ? U.plural(S.data.streakDays, "day") + " streak · best " + (S.data.bestStreakDays || 0)
            : "Start a streak today." })
        ]),
        U.el("div", { style:"text-align:right" }, [
          U.el("div", { style:"font-weight:800;font-size:18px;color:var(--accent)", text:"Lv " + lv.level }),
          U.el("div", { class:"muted2", style:"font-weight:700", text: S.levelTitle(lv.level) }),
          U.el("div", { class:"muted2", text: lv.need ? U.fmtInt(lv.need - lv.into) + " XP to go" : "max level" })
        ])
      ]),
      U.el("div", { class:"bar", style:"margin-top:10px" }, [
        U.el("i", { style:"width:" + (lv.need ? Math.min(100, lv.into / lv.need * 100) : 100) + "%" })
      ])
    ]));

    // resume nudges
    var missed = S.missedIds().length;
    var dueCards = S.dueCards(ECON.Bank.active("card").map(function (c) { return c.id; })).length;
    var nudges = U.el("div", { class:"row", style:"margin:4px 0 10px" });
    if (dueCards) nudges.appendChild(U.el("button", { class:"btn btn-primary btn-sm grow", onclick: function () { UI.go("/play/flashcards"); } },
      dueCards + " cards due"));
    if (missed) nudges.appendChild(U.el("button", { class:"btn btn-sm grow", onclick: function () { UI.go("/play/rehab"); } },
      missed + " to rehab"));
    if (nudges.childNodes.length) view.appendChild(nudges);

    /* Difficulty is visible from the Play screen, because a student who set
       Nightmare a week ago and forgot should not be quietly wondering why
       every clock is short. */
    var diff = S.difficulty();
    if (diff.id !== "standard") {
      view.appendChild(U.el("div", { class:"card card-tight small" }, [
        U.el("b", { text: diff.icon + "  " + diff.name + " difficulty" }),
        U.el("div", { class:"muted2", text: diff.desc + "  Change it in Shop → Power-ups." })
      ]));
    }

    var groups = U.groupBy(R.MODES, function (m) { return m.group || "Other"; });
    ["Core", "Numbers", "Challenge", "Other"].forEach(function (g) {
      if (!groups[g]) return;
      view.appendChild(U.el("h2", { text: g }));
      var grid = U.el("div", { class:"tile-grid" });
      groups[g].forEach(function (m) {
        var tile = U.el("button", { class:"tile" }, [
          U.el("span", { class:"ico", text: m.icon }),
          U.el("span", { class:"t" }, [
            document.createTextNode(m.name),
            m.flag ? U.el("span", { class:"badge badge-warn", style:"margin-left:6px", text: m.flag }) : null
          ]),
          U.el("span", { class:"d", text: m.blurb })
        ]);
        tile.addEventListener("click", function () { UI.go(m.route === "/cards" ? "/play/flashcards" : m.route); });
        grid.appendChild(tile);
      });
      view.appendChild(grid);
    });

    view.appendChild(U.el("h2", { text:"Break" }));
    var arcadeTile = U.el("button", { class:"tile", style:"min-height:auto" }, [
      U.el("span", { class:"ico", text:"🕹️" }),
      U.el("span", { class:"t", text:"Arcade" }),
      U.el("span", { class:"d", text:"Three games you rent with credits. They pay nothing — that is deliberate." })
    ]);
    arcadeTile.addEventListener("click", function () { UI.go("/arcade"); });
    var grid2 = U.el("div", { class:"tile-grid" });
    grid2.appendChild(arcadeTile);
    view.appendChild(grid2);

    view.appendChild(U.el("div", { class:"muted2 small", style:"margin-top:18px;text-align:center",
      text: U.fmtInt(counts.mcq) + " questions · " + U.fmtInt(counts.card) + " flashcards · " +
            counts.short + " written responses · " + counts.diagram + " diagrams · " +
            counts.calc + " calculation templates" }));
  });

  function greeting() {
    var h = new Date().getHours();
    if (h < 5) return "Late one";
    if (h < 12) return "Morning";
    if (h < 17) return "Afternoon";
    if (h < 21) return "Evening";
    return "Late one";
  }
})(typeof window !== "undefined" ? window : globalThis);
