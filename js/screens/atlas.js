/* Atlas — the static reference view of every diagram (the fourth mode the
   diagram engine gives you for free). */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, D = ECON.Diagram;

  UI.route("/atlas", function (view, r) {
    UI.hideTabs(false);
    if (r.query.d) return one(view, r.query.d);

    view.appendChild(U.el("h1", { text:"Atlas" }));
    view.appendChild(U.el("p", { class:"muted", text:"Every diagram, labelled. Free to browse — the Atlas is a reference screen, not a scored run, so nothing here costs or pays anything." }));

    var all = D.all();
    var byMod = U.groupBy(all, function (d) { return d.mod; });
    U.MODULES.forEach(function (m) {
      var list = byMod[m.id];
      if (!list) return;
      view.appendChild(U.el("h2", { text: m.id + " — " + m.name }));
      var grid = U.el("div", { class:"tile-grid" });
      list.forEach(function (def) {
        var hidden = ECON.Coverage.isHiddenItem(def);
        var seen = !!S.data.diagramSeen[def.id];
        var tile = U.el("button", { class:"tile" + (hidden ? " locked" : "") }, [
          U.el("span", { class:"ico", text: seen ? "✅" : "🔬" }),
          U.el("span", { class:"t", text: def.title }),
          U.el("span", { class:"d", text: U.plural(def.parts.length, "part") + (hidden ? " · hidden by coverage" : "") })
        ]);
        tile.addEventListener("click", function () { UI.go("/atlas?d=" + def.id); });
        grid.appendChild(tile);
      });
      view.appendChild(grid);
    });

    view.appendChild(U.el("h2", { text:"Glossary" }));
    view.appendChild(U.el("button", { class:"btn btn-block", onclick: function () { UI.go("/reference"); } },
      ECON.DATA.glossary.length + " terms — free to read here"));
  });

  function one(view, id) {
    var def = D.get(id);
    if (!def) { UI.go("/atlas"); return; }

    view.appendChild(U.el("div", { class:"spread" }, [
      U.el("h1", { text: def.title, style:"margin:0" }),
      U.el("span", { class:"badge badge-accent", text: def.mod })
    ]));
    if (def.topic) view.appendChild(U.el("div", { class:"muted2", style:"margin-bottom:8px", text: def.topic }));

    view.appendChild(D.figure(def));

    if (def.sequence) {
      view.appendChild(U.el("h2", { text:"Order" }));
      var ol = U.el("ol", { style:"padding-left:20px" });
      def.sequence.forEach(function (pid) {
        var p = def.parts.filter(function (x) { return x.id === pid; })[0];
        if (p) ol.appendChild(U.el("li", { class:"small", style:"margin:4px 0", text: p.label + " — " + (p.role || "") }));
      });
      view.appendChild(ol);
    }

    var row = U.el("div", { class:"row", style:"margin-top:16px" }, [
      U.el("button", { class:"btn btn-primary grow", onclick: function () { UI.go("/play/labelit?d=" + def.id); } }, "Practise this diagram"),
      U.el("button", { class:"btn grow", onclick: function () { UI.go("/atlas"); } }, "All diagrams")
    ]);
    view.appendChild(row);
  }
})(typeof window !== "undefined" ? window : globalThis);
