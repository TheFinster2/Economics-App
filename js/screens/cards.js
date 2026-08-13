/* Cards tab — the flashcard deck overview. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State;

  UI.route("/cards", function (view) {
    UI.hideTabs(false);
    view.appendChild(U.el("h1", { text:"Flashcards" }));

    var all = ECON.Bank.all("card");
    var active = ECON.Bank.active("card");
    var due = S.dueCards(active.map(function (c) { return c.id; }));

    var boxes = [0, 0, 0, 0, 0];
    var started = 0;
    all.forEach(function (c) {
      var cs = S.data.cards[c.id];
      if (cs) { boxes[cs.box]++; started++; }
    });

    view.appendChild(U.el("div", { class:"card" }, [
      U.el("div", { class:"spread" }, [
        U.el("div", {}, [
          U.el("b", { style:"font-size:18px", text: due.length ? U.plural(due.length, "card") + " due now" : "Nothing due" }),
          U.el("div", { class:"muted2", text: started + " of " + all.length + " cards started" })
        ]),
        U.el("button", { class:"btn btn-primary", onclick: function () { UI.go("/play/flashcards"); } },
          due.length ? "Review" : "Free review")
      ]),
      U.el("div", { style:"display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:12px" },
        boxes.map(function (n, i) {
          return U.el("div", { style:"text-align:center" }, [
            U.el("div", { style:"font-weight:800;color:var(--accent)", text: String(n) }),
            U.el("div", { class:"muted2", style:"font-size:10px", text:"box " + (i + 1) })
          ]);
        }))
    ]));

    if (!due.length && started) {
      view.appendChild(U.el("div", { class:"honesty",
        text:"Nothing is due, so a review session right now pays nothing. That is not a bug — spaced repetition only works if you come back when the interval is up." }));
    }

    view.appendChild(U.el("h2", { text:"By module" }));
    var list = U.el("div", { class:"list" });
    U.MODULES.forEach(function (m) {
      var mine = ECON.Bank.active("card", function (c) { return c.mod === m.id; });
      var mineDue = S.dueCards(mine.map(function (c) { return c.id; })).length;
      var row = U.el("button", { class:"li", style:"width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer" }, [
        U.el("span", { class:"badge badge-accent", text: m.id }),
        U.el("div", { class:"grow" }, [
          U.el("b", { text: m.name }),
          U.el("small", { text: mine.length + " cards · " + mineDue + " due" })
        ]),
        U.el("span", { class:"muted2", text:"›" })
      ]);
      if (!mine.length) { row.disabled = true; row.style.opacity = ".45"; }
      row.addEventListener("click", function () { UI.go("/play/flashcards?mod=" + m.id); });
      list.appendChild(row);
    });
    view.appendChild(list);

    view.appendChild(U.el("h2", { text:"Browse" }));
    var search = U.el("input", { class:"calc-disp", type:"search", placeholder:"Search cards…", style:"text-align:left;font-size:15px;font-weight:500" });
    view.appendChild(search);
    var results = U.el("div", { class:"list", style:"margin-top:8px" });
    view.appendChild(results);

    function draw(q) {
      U.clear(results);
      var qq = U.norm(q || "");
      if (!qq) { results.appendChild(U.el("div", { class:"muted2 small", text:"Type to search the whole deck." })); return; }
      var hits = active.filter(function (c) {
        return U.norm(c.front).indexOf(qq) >= 0 || U.norm(c.back).indexOf(qq) >= 0;
      }).slice(0, 30);
      if (!hits.length) { results.appendChild(U.el("div", { class:"muted2 small", text:"No match." })); return; }
      hits.forEach(function (c) {
        results.appendChild(U.el("div", { class:"li" }, [
          U.el("div", { class:"grow" }, [U.el("b", { text: c.front }), U.el("small", { text: c.back })]),
          U.el("span", { class:"badge", text: c.mod })
        ]));
      });
    }
    search.addEventListener("input", U.debounce(function () { draw(search.value); }, 150));
    draw("");
  });
})(typeof window !== "undefined" ? window : globalThis);
