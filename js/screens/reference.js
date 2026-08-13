/* Reference — the glossary as a full screen.
   Free to read HERE, because this is not a scored run. The same glossary
   inside a run costs 25% and latches (js/core/tools.js). */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI;

  UI.route("/reference", function (view) {
    UI.hideTabs(false);
    view.appendChild(U.el("h1", { text:"Reference" }));
    view.appendChild(U.el("div", { class:"honesty",
      text:"Free here, because you are not being scored. Opening the same glossary from inside a run costs 25% of that run's XP and credits, and it is withheld entirely from Term Match and Label It, where it is the answer key." }));

    var search = U.el("input", { class:"calc-disp", type:"search", placeholder:"Search a term…", style:"text-align:left;font-size:15px;font-weight:500" });
    view.appendChild(search);

    var filter = U.el("div", { class:"seg", style:"margin-top:8px" });
    var current = "";
    [["", "All"]].concat(U.MODULES.map(function (m) { return [m.id, m.id]; })).forEach(function (f) {
      var b = U.el("button", { class: f[0] === current ? "on" : "", text: f[1] });
      b.addEventListener("click", function () {
        current = f[0];
        U.$$("button", filter).forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        draw();
      });
      filter.appendChild(b);
    });
    view.appendChild(filter);

    var list = U.el("div", { class:"list", style:"margin-top:10px" });
    view.appendChild(list);

    var terms = ECON.DATA.glossary.slice().sort(function (a, b) { return a.term < b.term ? -1 : 1; });

    function draw() {
      U.clear(list);
      var qq = U.norm(search.value || "");
      var hits = terms.filter(function (t) {
        if (current && t.mod !== current) return false;
        return !qq || U.norm(t.term).indexOf(qq) >= 0 || U.norm(t.def).indexOf(qq) >= 0;
      });
      if (!hits.length) { list.appendChild(U.el("div", { class:"muted2 small", text:"No match." })); return; }
      hits.forEach(function (t) {
        list.appendChild(U.el("div", { class:"li" }, [
          U.el("div", { class:"grow" }, [U.el("b", { text: t.term }), U.el("small", { text: t.def })]),
          U.el("span", { class:"badge", text: t.mod })
        ]));
      });
    }
    search.addEventListener("input", U.debounce(draw, 150));
    draw();
  });
})(typeof window !== "undefined" ? window : globalThis);
