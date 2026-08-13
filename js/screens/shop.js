/* Shop — power-ups, avatars, themes and arcade time.

   The original design sold nothing that helped in a scored run. That has been
   relaxed on purpose: a currency you can only spend on wallpaper stops being
   a reason to play. What replaced the old rule is narrower and stronger, and
   it is printed on the screen so a student can check it:

     a multiplier MULTIPLIES, so a run worth nothing stays worth nothing.

   Nothing on this screen calls UI.award. Credits are still a sink. */
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
      text:"Credits come from studying, at 75% of a run's XP. Power-ups change how a run feels; the Multiplier multiplies what you earn rather than adding to it, so an empty run is still worth nothing." }));

    var tabs = ["Power-ups", "Avatars", "Themes", "Arcade"];
    var active = decodeURIComponent((root.location.hash.split("tab=")[1] || "Power-ups").split("&")[0]);
    if (tabs.indexOf(active) < 0) active = "Power-ups";

    var seg = U.el("div", { class:"seg", style:"margin:10px 0 14px" });
    tabs.forEach(function (t) {
      var b = U.el("button", { class:"seg-b" + (t === active ? " on" : ""), type:"button", text: t });
      b.addEventListener("click", function () { UI.go("/shop?tab=" + encodeURIComponent(t), true); UI.render(); });
      seg.appendChild(b);
    });
    view.appendChild(seg);

    if (active === "Power-ups") renderPowerups(view);
    if (active === "Avatars") renderAvatars(view);
    if (active === "Themes") renderThemes(view);
    if (active === "Arcade") renderTickets(view);

    view.appendChild(U.el("div", { class:"honesty", style:"margin-top:16px",
      text:"Power-ups are bought with credits, and credits come from XP you already earned by answering correctly and slowly enough to have read the question. Nothing here can create XP out of nothing — tests/exploit.js replays the whole bad-bot sweep with a full inventory and the multiplier active to prove it." }));
  });

  /* ── power-ups ─────────────────────────────────────────────────────── */
  function renderPowerups(view) {
    var inv = S.data.inventory || {};
    view.appendChild(U.el("h2", { text:"Power-ups" }));

    var list = U.el("div", { class:"list" });
    (ECON.DATA.shop.powerups || []).forEach(function (p) {
      var afford = S.data.coins >= p.cost;
      var have = inv[p.id] || 0;
      list.appendChild(U.el("div", { class:"li" }, [
        U.el("span", { style:"font-size:22px;width:30px;text-align:center", text: p.icon }),
        U.el("div", { class:"grow" }, [
          U.el("b", { text: p.name + (have ? "  ×" + have : "") }),
          U.el("small", { text: p.desc })
        ]),
        U.el("button", { class:"btn btn-sm" + (afford ? " btn-primary" : ""), disabled: !afford,
          onclick: function () {
            if (S.data.coins < p.cost) return;
            S.data.coins -= p.cost;
            S.grantPowerup(p.id, 1);
            S.save(); UI.syncChrome();
            UI.toast(p.icon + " " + p.name + " ×1", "good");
            UI.render();
          } }, U.fmtInt(p.cost) + " ◉")
      ]));
    });
    view.appendChild(list);

    /* Difficulty is a choice, not a purchase. Harder settings pay a larger
       multiplier because they remove time and remove power-ups. */
    view.appendChild(U.el("h2", { text:"Difficulty" }));
    view.appendChild(U.el("p", { class:"muted small",
      text:"Free, and changeable at any time. Harder settings shorten every clock, lock some power-ups, and multiply what a run earns." }));
    var dl = U.el("div", { class:"list" });
    (ECON.DATA.difficulties || []).forEach(function (d) {
      var on = S.data.difficulty === d.id;
      dl.appendChild(U.el("div", { class:"li" }, [
        U.el("span", { style:"font-size:20px;width:30px;text-align:center", text: d.icon }),
        U.el("div", { class:"grow" }, [
          U.el("b", { text: d.name + "  ×" + d.xp + " XP" }),
          U.el("small", { text: d.desc })
        ]),
        on ? U.el("span", { class:"badge badge-good", text:"active" })
           : U.el("button", { class:"btn btn-sm btn-primary", onclick: function () {
               S.data.difficulty = d.id; S.save(); UI.toast(d.icon + "  " + d.name, "good"); UI.render();
             } }, "Use")
      ]));
    });
    view.appendChild(dl);
  }

  /* ── avatars ───────────────────────────────────────────────────────── */
  function renderAvatars(view) {
    var owned = S.data.owned.avatars || [];
    var lv = S.levelFromXp(S.data.xp).level;
    view.appendChild(U.el("h2", { text:"Avatars" }));
    view.appendChild(U.el("p", { class:"muted small",
      text:"Cosmetic only. The level gates exist so there is still something to reach for at level 40." }));

    var grid = U.el("div", { class:"av-grid" });
    (ECON.DATA.shop.avatars || []).forEach(function (a) {
      var have = owned.indexOf(a.emoji) >= 0;
      var on = S.data.avatar === a.emoji;
      var gated = !!(a.minLevel && lv < a.minLevel);
      var afford = S.data.coins >= a.cost;

      var cell = U.el("button", {
        class:"av" + (on ? " on" : "") + (gated ? " locked" : ""),
        type:"button",
        title: a.name + (a.note ? " — " + a.note : ""),
        disabled: gated || (!have && !afford)
      }, [
        U.el("span", { class:"av-e", text: gated ? "🔒" : a.emoji }),
        U.el("span", { class:"av-n", text: a.name }),
        U.el("span", { class:"av-c", text: on ? "active" : have ? "owned"
          : gated ? "Lv " + a.minLevel : U.fmtInt(a.cost) + " ◉" })
      ]);
      cell.addEventListener("click", function () {
        if (gated) return;
        if (!have) {
          if (S.data.coins < a.cost) return;
          S.data.coins -= a.cost;
          S.data.owned.avatars.push(a.emoji);
          UI.toast(a.emoji + "  " + a.name + " unlocked", "good");
        }
        S.data.avatar = a.emoji;
        S.save(); UI.syncChrome(); UI.render();
      });
      grid.appendChild(cell);
    });
    view.appendChild(grid);
  }

  /* ── themes ────────────────────────────────────────────────────────── */
  function renderThemes(view) {
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
  }

  /* ── arcade tickets ────────────────────────────────────────────────── */
  function renderTickets(view) {
    view.appendChild(U.el("h2", { text:"Arcade time" }));
    var left = A.ticketMsLeft();
    if (left) view.appendChild(U.el("div", { class:"card card-tight", text:"Ticket active — " + U.fmtTime(left) + " remaining" }));

    var tlist = U.el("div", { class:"list" });
    ECON.DATA.shop.tickets.forEach(function (t) {
      var afford = S.data.coins >= t.cost;
      tlist.appendChild(U.el("div", { class:"li" }, [
        U.el("div", { class:"grow" }, [
          U.el("b", { text: t.name }),
          U.el("small", { text: Math.round(t.cost / t.minutes) + " ◉ per minute" })
        ]),
        U.el("button", { class:"btn btn-sm " + (afford ? "btn-primary" : ""), disabled: !afford,
          onclick: function () {
            if (A.buyTicket(t)) { UI.toast("+" + t.minutes + " minutes of arcade", "good"); UI.render(); }
          } }, U.fmtInt(t.cost) + " ◉")
      ]));
    });
    view.appendChild(tlist);
    view.appendChild(U.el("p", { class:"muted small", style:"margin-top:10px",
      text:"The arcade pays nothing — no XP, no credits. It is a sink, and that is deliberate." }));
  }
})(typeof window !== "undefined" ? window : globalThis);
