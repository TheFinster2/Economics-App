/* Shop — arcade tickets and themes. Nothing bought here affects a scored run. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, A = ECON.Arcade;

  UI.route("/shop", function (view) {
    UI.hideTabs(false);
    view.appendChild(U.el("div", { class:"spread" }, [
      U.el("h1", { text:"Shop", style:"margin:0" }),
      U.el("span", { class:"chip chip-coin", style:"font-size:15px;padding:6px 12px", text:"◉ " + U.fmtInt(S.data.coins) })
    ]));
    view.appendChild(U.el("p", { class:"muted small",
      text:"Credits come from studying, at 75% of a run's XP. Nothing in here makes a scored run easier — that is the point." }));

    /* ── arcade tickets ── */
    view.appendChild(U.el("h2", { text:"Arcade time" }));
    var left = A.ticketMsLeft();
    if (left) view.appendChild(U.el("div", { class:"card card-tight", text:"Ticket active — " + U.fmtTime(left) + " remaining" }));

    var tlist = U.el("div", { class:"list" });
    ECON.DATA.shop.tickets.forEach(function (t) {
      var afford = S.data.coins >= t.cost;
      var row = U.el("div", { class:"li" }, [
        U.el("div", { class:"grow" }, [
          U.el("b", { text: t.name }),
          U.el("small", { text: Math.round(t.cost / t.minutes) + " ◉ per minute" })
        ]),
        U.el("button", { class:"btn btn-sm " + (afford ? "btn-primary" : ""), disabled: !afford,
          onclick: function () {
            if (A.buyTicket(t)) { UI.toast("+" + t.minutes + " minutes of arcade", "good"); UI.render(); }
          } }, U.fmtInt(t.cost) + " ◉")
      ]);
      tlist.appendChild(row);
    });
    view.appendChild(tlist);

    /* ── themes ── */
    view.appendChild(U.el("h2", { text:"Themes" }));
    var owned = S.data.owned.themes || ["ledger"];
    var glist = U.el("div", { class:"list" });
    ECON.DATA.shop.themes.forEach(function (th) {
      var have = owned.indexOf(th.id) >= 0;
      var on = S.data.theme === th.id;
      var afford = S.data.coins >= th.cost;
      var btn;
      if (on) btn = U.el("span", { class:"badge badge-good", text:"active" });
      else if (have) btn = U.el("button", { class:"btn btn-sm btn-primary", onclick: function () {
        S.data.theme = th.id; S.save(); UI.syncChrome(); UI.render();
      } }, "Use");
      else btn = U.el("button", { class:"btn btn-sm" + (afford ? " btn-primary" : ""), disabled: !afford, onclick: function () {
        if (S.data.coins < th.cost) return;
        S.data.coins -= th.cost;
        S.data.owned.themes.push(th.id);
        S.data.theme = th.id;
        S.save(); UI.syncChrome(); UI.toast("Theme unlocked", "good"); UI.render();
      } }, U.fmtInt(th.cost) + " ◉");

      glist.appendChild(U.el("div", { class:"li" }, [
        U.el("div", { class:"grow" }, [U.el("b", { text: th.name }), U.el("small", { text: th.blurb })]),
        btn
      ]));
    });
    view.appendChild(glist);

    view.appendChild(U.el("div", { class:"honesty", style:"margin-top:16px",
      text:"There is deliberately nothing here that buys a hint, skips a question or boosts XP. A shop that sold advantage would make the XP numbers meaningless." }));
  });
})(typeof window !== "undefined" ? window : globalThis);
