/* Mistake Rehab — only what you have previously missed. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, R = ECON.Run;

  R.register({
    id:"rehab", name:"Mistake Rehab", icon:"🩹", route:"/play/rehab",
    blurb:"Only the questions you have got wrong before. Two clean answers retires one.",
    group:"Core"
  });

  UI.route("/play/rehab", function (view) {
    var missed = S.missedIds();
    var qs = missed.map(function (id) { return ECON.Bank.byId("mcq", id); })
                   .filter(function (q) { return q && !ECON.Coverage.isHiddenItem(q); });

    if (!qs.length) {
      UI.hideTabs(false);
      view.appendChild(U.el("div", { class:"card center" }, [
        U.el("div", { style:"font-size:40px", text:"🩹" }),
        U.el("h1", { text:"Nothing to rehabilitate", style:"margin:8px 0 2px" }),
        U.el("p", { class:"muted", text: missed.length
          ? "Everything in your rehab pool is currently hidden by a coverage pack."
          : "You have not missed anything yet — or you have already cleared them all. Play a mode and come back." }),
        U.el("div", { class:"row", style:"margin-top:12px;justify-content:center" }, [
          U.el("button", { class:"btn btn-primary", onclick: function () { UI.go("/play/rapidfire"); } }, "Rapid Fire"),
          U.el("button", { class:"btn", onclick: function () { UI.go("/home"); } }, "Home")
        ])
      ]));
      return;
    }

    var picked = U.sample(qs, Math.min(12, qs.length));
    return R.start(view, {
      id:"rehab",
      title:"Mistake Rehab",
      sub: U.plural(qs.length, "question") + " in your pool",
      questions: picked,
      limit: picked.length,
      streakBonus: false,
      bonus: 100,
      extraRows: function () {
        return [["Remaining in pool", String(S.missedIds().length)]];
      }
    });
  });
})(typeof window !== "undefined" ? window : globalThis);
