/* Equilibrium — the arcade (brief §7.2).

   Three games you rent by the minute with credits. THEY PAY NOTHING — no
   XP, no currency, no achievements beyond "you played one", only a high score.

   The guarantee is structural, not a promise: nothing in js/arcade/ calls
   UI.award, and tests/exploit.js greps this directory to prove it. An arcade
   game that paid XP would immediately beat studying on XP per minute, which
   defeats the whole app.

   Exposes: window.ECON.Arcade */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State;
  var A = { games: [] };

  A.register = function (g) { A.games.push(g); return g; };

  A.ticketMsLeft = function () { return Math.max(0, (S.data.arcade.ticketUntil || 0) - Date.now()); };
  A.hasTicket = function () { return A.ticketMsLeft() > 0; };

  A.buyTicket = function (t) {
    if (S.data.coins < t.cost) return false;
    S.data.coins -= t.cost;
    var base = Math.max(Date.now(), S.data.arcade.ticketUntil || 0);
    S.data.arcade.ticketUntil = base + t.minutes * 60000;
    S.save();
    UI.syncChrome();
    return true;
  };

  UI.route("/arcade", function (view) {
    UI.hideTabs(false);
    view.appendChild(U.el("h1", { text:"Arcade" }));
    view.appendChild(U.el("div", { class:"honesty",
      text:"The arcade pays nothing. No XP, no credits, no progress — only a high score. It is what your credits are for, and keeping it worthless is what keeps the rest of the app honest." }));

    var left = A.ticketMsLeft();
    var status = U.el("div", { class:"card" }, [
      U.el("div", { class:"spread" }, [
        U.el("div", {}, [
          U.el("b", { text: left ? "Ticket active" : "No active ticket" }),
          U.el("div", { class:"muted2", text: left ? U.fmtTime(left) + " remaining" : "Buy time in the Shop." })
        ]),
        U.el("button", { class:"btn btn-sm", onclick: function () { UI.go("/shop"); } }, "Shop")
      ])
    ]);
    view.appendChild(status);

    var grid = U.el("div", { class:"tile-grid" });
    A.games.forEach(function (g) {
      var best = S.data.arcade.bests[g.id] || 0;
      var tile = U.el("button", { class:"tile" + (left ? "" : " locked") }, [
        U.el("span", { class:"ico", text: g.icon }),
        U.el("span", { class:"t", text: g.name }),
        U.el("span", { class:"d", text: g.blurb }),
        U.el("span", { class:"free-tag", text:"best " + U.fmtInt(best) + " · pays nothing" })
      ]);
      tile.addEventListener("click", function () {
        if (!A.hasTicket()) {
          UI.modal({
            title:"No arcade ticket",
            body:"Arcade time is bought with credits in the Shop. The cheapest is 5 minutes for " + ECON.DATA.shop.tickets[0].cost + " ◉.",
            actions:[{ label:"Go to Shop", kind:"primary", onclick: function () { UI.go("/shop"); } }, { label:"Back", kind:"ghost" }]
          });
          return;
        }
        UI.go("/arcade/" + g.id);
      });
      grid.appendChild(tile);
    });
    view.appendChild(grid);
  });

  /* Shared arcade shell: a canvas, a score, a ticket countdown, and no
     connection whatsoever to the reward system. */
  A.shell = function (view, game) {
    UI.hideTabs(true);
    if (!A.hasTicket()) { UI.go("/arcade"); return; }

    var head = U.el("div", { class:"gs-head" }, [
      U.el("div", { class:"spread" }, [
        U.el("div", {}, [
          U.el("div", { style:"font-weight:800", text: game.name }),
          U.el("div", { class:"muted2", text:"Pays nothing — high score only" })
        ]),
        U.el("button", { class:"btn btn-ghost btn-sm", onclick: function () { UI.go("/arcade"); } }, "Exit")
      ]),
      U.el("div", { class:"gs-meters", style:"margin-top:8px" }, [
        U.el("span", { class:"gs-meter", id:"arcScore", text:"Score 0" }),
        U.el("span", { class:"gs-meter", id:"arcBest", text:"Best " + U.fmtInt(S.data.arcade.bests[game.id] || 0) }),
        U.el("span", { class:"gs-meter", id:"arcTicket", text:"⏱ " + U.fmtTime(A.ticketMsLeft()) })
      ])
    ]);
    view.appendChild(head);

    var canvas = U.el("canvas", { class:"arcade-stage" });
    view.appendChild(canvas);

    var footer = U.el("div", { class:"row", style:"margin-top:10px" });
    view.appendChild(footer);

    var ticketTimer = setInterval(function () {
      var left = A.ticketMsLeft();
      var el = U.$("#arcTicket");
      if (el) el.textContent = "⏱ " + U.fmtTime(left);
      if (left <= 0) {
        clearInterval(ticketTimer);
        UI.modal({
          title:"Ticket expired",
          body:"Back to it. Nothing was earned here, and nothing was lost.",
          actions:[{ label:"Back to Play", kind:"primary", onclick: function () { UI.go("/home"); } }]
        });
      }
    }, 1000);

    return {
      canvas: canvas,
      footer: footer,
      setScore: function (n) {
        var el = U.$("#arcScore");
        if (el) el.textContent = "Score " + U.fmtInt(n);
      },
      /* The ONLY persistence the arcade has. Note there is no UI.award call
         anywhere in this file or in any game file. */
      recordBest: function (n) {
        var prev = S.data.arcade.bests[game.id] || 0;
        if (n > prev) {
          S.data.arcade.bests[game.id] = n;
          S.saveSoon();
          var el = U.$("#arcBest");
          if (el) el.textContent = "Best " + U.fmtInt(n);
          return true;
        }
        return false;
      },
      dispose: function () { clearInterval(ticketTimer); }
    };
  };

  ECON.Arcade = A;
})(typeof window !== "undefined" ? window : globalThis);
