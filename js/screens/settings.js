/* Settings — course coverage, data export/import, service worker controls. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, C = ECON.Coverage;

  UI.route("/settings", function (view) {
    UI.hideTabs(false);
    view.appendChild(U.el("h1", { text:"Settings" }));

    /* ── course coverage ────────────────────────────────────────── */
    view.appendChild(U.el("h2", { text:"Course coverage" }));
    view.appendChild(U.el("p", { class:"muted small",
      text:"Schools finish modules at different times. Switch a pack off to remove it from every draw. Hiding content never raises what the remaining questions pay and never lowers an achievement target — you cannot shorten a collection by hiding it." }));

    var packs = C.packs();
    var byGroup = U.groupBy(packs, function (p) { return p.group || "Other"; });
    Object.keys(byGroup).forEach(function (g) {
      view.appendChild(U.el("h3", { text: g }));
      var box = U.el("div", { class:"card", style:"padding:4px 12px" });
      byGroup[g].forEach(function (p) {
        var impact = C.impact(p.id);
        var lab = U.el("label", { class:"switch" });
        var cb = U.el("input", { type:"checkbox" });
        cb.checked = !S.isHidden(p.id);         // checked = INCLUDED
        cb.addEventListener("change", function () {
          S.setHidden(p.id, !cb.checked);
          UI.toast(cb.checked ? p.name + " included" : p.name + " hidden", null, 1300);
          UI.render();
        });
        lab.appendChild(cb);
        lab.appendChild(U.el("span", { class:"sw" }));
        lab.appendChild(U.el("span", { class:"grow" }, [
          U.el("b", { style:"font-size:14.5px", text: p.name }),
          U.el("div", { class:"muted2", style:"font-size:11.5px",
            text: (p.blurb ? p.blurb + " · " : "") + impact.total + " items" })
        ]));
        box.appendChild(lab);
      });
      view.appendChild(box);
    });

    var hidden = C.hiddenPackIds();
    if (hidden.length) {
      view.appendChild(U.el("div", { class:"why no" }, [
        U.el("div", { class:"why-h", text:"Hidden right now" }),
        U.el("div", { class:"small", text: hidden.map(function (id) { return C.pack(id).name; }).join(" · ") }),
        U.el("div", { class:"small muted2", style:"margin-top:6px",
          text:"Totals and achievement targets still count every hidden item." })
      ]));
    }

    /* ── behaviour ──────────────────────────────────────────────── */
    view.appendChild(U.el("h2", { text:"Response Builder" }));
    var hintBox = U.el("div", { class:"card", style:"padding:4px 12px" });
    var hl = U.el("label", { class:"switch" });
    var hc = U.el("input", { type:"checkbox" });
    hc.checked = !!S.data.settings.hintsInResponse;
    hc.addEventListener("change", function () {
      S.data.settings.hintsInResponse = hc.checked;
      S.saveSoon();
    });
    hl.appendChild(hc);
    hl.appendChild(U.el("span", { class:"sw" }));
    hl.appendChild(U.el("span", { class:"grow" }, [
      U.el("b", { style:"font-size:14.5px", text:"Show keyword hints on criteria" }),
      U.el("div", { class:"muted2", style:"font-size:11.5px",
        text:"Flags criteria that look like they might be covered. A guess, never a mark, and never fed into the score." })
    ]));
    hintBox.appendChild(hl);
    view.appendChild(hintBox);

    /* ── data ───────────────────────────────────────────────────── */
    view.appendChild(U.el("h2", { text:"Your data" }));
    view.appendChild(U.el("p", { class:"muted small",
      text:"Everything is stored on this device only. No accounts, no network, no analytics. Export before you change phone." }));

    var dataRow = U.el("div", { class:"row" }, [
      U.el("button", { class:"btn grow", onclick: exportSave }, "Export save"),
      U.el("button", { class:"btn grow", onclick: importSave }, "Import save")
    ]);
    view.appendChild(dataRow);

    view.appendChild(U.el("button", {
      class:"btn btn-block", style:"margin-top:8px;border-color:var(--bad);color:var(--bad)",
      onclick: function () {
        UI.confirm("Erase all progress?",
          "XP, levels, credits, flashcard schedules and achievements will all be deleted. This cannot be undone.",
          function () { S.reset(); UI.toast("Progress erased"); UI.go("/home"); }, "Erase everything");
      }
    }, "Erase all progress"));

    /* ── app / service worker ───────────────────────────────────── */
    view.appendChild(U.el("h2", { text:"App" }));
    var swBox = U.el("div", { class:"list" });
    swBox.appendChild(U.el("div", { class:"li" }, [
      U.el("div", { class:"grow" }, [U.el("b", { text:"Running build" }), U.el("small", { text: S.BUILD + " · " + (ECON.SW && ECON.SW.cacheName ? ECON.SW.cacheName : "not installed") })])
    ]));
    swBox.appendChild(U.el("div", { class:"li" }, [
      U.el("div", { class:"grow" }, [
        U.el("b", { text:"Force refresh" }),
        U.el("small", { text:"Clears the app cache and reloads. iOS does not clear website data when a home-screen app is deleted, so this is the reliable way to get a stuck install onto the latest build. Your progress is untouched." })
      ]),
      U.el("button", { class:"btn btn-sm", onclick: function () {
        UI.confirm("Force refresh?", "The app cache is cleared and the page reloads. Your saved progress is not affected.",
          function () { ECON.SW.forceRefresh(); }, "Refresh");
      } }, "Refresh")
    ]));
    view.appendChild(swBox);

    view.appendChild(U.el("div", { class:"muted2 small", style:"margin-top:20px;text-align:center",
      text:"Equilibrium · HSC Economics · offline-first, no accounts, no network at runtime" }));
  });

  function exportSave() {
    var text = S.exportJSON();
    try {
      var blob = new Blob([text], { type:"application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "equilibrium-save-" + U.dayKey() + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      UI.toast("Save exported", "good");
    } catch (e) {
      var box = UI.modal({ title:"Copy your save", body: U.el("textarea", { class:"pad", style:"min-height:220px", text: text }) });
      var ta = box.querySelector("textarea");
      ta.select();
    }
  }

  function importSave() {
    var input = U.el("input", { type:"file", accept:"application/json,.json", style:"display:none" });
    document.body.appendChild(input);
    input.addEventListener("change", function () {
      var f = input.files && input.files[0];
      document.body.removeChild(input);
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () { applyImport(String(fr.result)); };
      fr.readAsText(f);
    });
    input.click();
  }

  function applyImport(text) {
    UI.confirm("Replace all progress?",
      "The imported save will replace everything currently on this device.",
      function () {
        try {
          S.importJSON(text);
          // Defect F1: location.reload() fires pagehide, and a pagehide handler
          // that flushes the in-memory save would write the OLD data straight
          // back over the imported file. importJSON writes to storage and then
          // freezes every write path, so the reload cannot undo the import.
          UI.toast("Imported — reloading", "good");
          setTimeout(function () { root.location.reload(); }, 350);
        } catch (e) {
          UI.modal({ title:"Import failed", body: String(e && e.message || e), actions:[{ label:"OK", kind:"primary" }] });
        }
      }, "Import and replace");
  }
})(typeof window !== "undefined" ? window : globalThis);
