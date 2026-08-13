/* Equilibrium — js/core/tools.js
   The in-game tool tray (brief §7.3).

   Two fixes carried over from an earlier app in this lineage, both worth the words:

   • It DOCKS rather than floats. The tray publishes its height as --tray-h and
     the view reserves that space, so the question, the answer box and the
     submit button all stay clear of it. tests/tools.js measures that rather
     than trusting the layout.

   • The calculator display is inputmode="none" and no key ever calls focus().
     Focusing a text input is what makes a phone open its keyboard, and the
     first version popped the keyboard over the calculator on every key press.

   The Reference tab is priced. The economics exam supplies no formula sheet, so an
   in-app glossary during a scored run is a bigger crutch than that app’s was:
   it costs 25% of the run, it LATCHES on opening (switching it off cannot
   refund the penalty — defect C3), and it is withheld entirely from Term Match
   and Label It, where the glossary and the labels are the answer key.

   Exposes: window.ECON.Tools */
(function (root) {
  "use strict";

  var ECON = root.ECON = root.ECON || {};
  var U = ECON.U, S = ECON.State;
  var T = {};

  T.NO_REFERENCE_MODES = ["termmatch", "labelit"];

  var el = null, mode = null, latched = false, openTab = null;

  T.refLatched = function () { return latched; };

  /* Called by every mode at the start of a run. The latch resets here and
     nowhere else, so a restart cannot clear a penalty mid-run (C2/C3). */
  T.startRun = function (modeId) {
    mode = modeId || null;
    latched = false;
  };

  T.referenceAllowed = function (modeId) {
    return T.NO_REFERENCE_MODES.indexOf(modeId || mode) < 0;
  };

  T.attach = function (modeId, opts) {
    opts = opts || {};
    T.detach();
    mode = modeId;

    el = U.el("div", { class: "tray", id: "toolTray" });

    var tabs = U.el("div", { class: "tray-tabs" });
    var bodies = {};

    var defs = [
      { id: "calc", label: "Calculator", build: buildCalc },
      { id: "pad",  label: "Working",    build: buildPad },
      { id: "ref",  label: T.referenceAllowed(modeId) ? "Reference −25%" : "Reference ✕", build: buildRef }
    ];
    if (opts.only) defs = defs.filter(function (d) { return opts.only.indexOf(d.id) >= 0; });

    defs.forEach(function (d) {
      var btn = U.el("button", { class: "tray-tab", type: "button", text: d.label });
      btn.addEventListener("click", function () { toggle(d.id); });
      tabs.appendChild(btn);
      d.btn = btn;
      var body = U.el("div", { class: "tray-body", hidden: true });
      bodies[d.id] = body;
      d.body = body;
    });

    var hide = U.el("button", { class: "tray-tab", type: "button", style: "flex:0 0 44px", "aria-label": "Close tools", text: "▾" });
    hide.addEventListener("click", function () { toggle(null); });
    tabs.appendChild(hide);

    el.appendChild(tabs);
    defs.forEach(function (d) { el.appendChild(d.body); });
    document.body.appendChild(el);

    T._defs = defs;
    measure();
    root.addEventListener("resize", measure);
    T._offResize = function () { root.removeEventListener("resize", measure); };

    function toggle(id) {
      if (id === "ref" && !T.referenceAllowed(mode)) {
        ECON.UI.modal({
          title: "Reference is off in this mode",
          body: "In Term Match and Label It the glossary and the diagram labels are the answer key, so the reference is withheld entirely rather than priced. Every other mode has it at −25%.",
          actions: [{ label: "Got it", kind: "primary" }]
        });
        return;
      }
      if (id === "ref" && !latched && !S.data.settings.refAck) {
        ECON.UI.confirm(
          "Open the reference?",
          "This run will pay 25% less XP and credits. The charge latches the moment you open it — closing the tab again does not refund it.",
          function () { S.data.settings.refAck = false; latchAndOpen(); },
          "Open anyway (−25%)"
        );
        return;
      }
      if (id === "ref") { latchAndOpen(); return; }
      show(id);
    }

    function latchAndOpen() {
      if (!latched) {
        latched = true;
        ECON.UI.toast("Reference open — this run pays 25% less", "bad", 2400);
        if (ECON.UI._gsRefresh) ECON.UI._gsRefresh();
      }
      show("ref");
    }

    function show(id) {
      openTab = id;
      defs.forEach(function (d) {
        var on = d.id === id;
        d.btn.classList.toggle("on", on);
        d.body.hidden = !on;
        if (on && !d.built) { d.build(d.body); d.built = true; }
      });
      measure();
    }

    function measure() {
      if (!el) return;
      var h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--tray-h", Math.round(h) + "px");
    }
    T._measure = measure;
    return el;
  };

  T.detach = function () {
    if (T._offResize) { T._offResize(); T._offResize = null; }
    if (el && el.parentNode) el.parentNode.removeChild(el);
    el = null; openTab = null;
    document.documentElement.style.setProperty("--tray-h", "0px");
  };

  T.isAttached = function () { return !!el; };
  T.height = function () { return el ? el.getBoundingClientRect().height : 0; };

  /* ── calculator ────────────────────────────────────────────────────
     Percentage change, elasticity, multipliers, rates. Economics needs it more than
     biology did — every second question is a percentage change. */
  function buildCalc(host) {
    var expr = "";
    var disp = U.el("input", {
      class: "calc-disp", type: "text", value: "0",
      readonly: true, inputmode: "none", "aria-label": "Calculator display", tabindex: "-1"
    });
    host.appendChild(disp);

    var keys = U.el("div", { class: "calc-keys" });
    var layout = [
      ["7", "8", "9", "÷"],
      ["4", "5", "6", "×"],
      ["1", "2", "3", "−"],
      ["0", ".", "%", "+"],
      ["C", "(", ")", "="]
    ];
    layout.forEach(function (rowk) {
      rowk.forEach(function (k) {
        var cls = /[÷×−+]/.test(k) ? "op" : k === "=" ? "eq" : "";
        var b = U.el("button", { type: "button", class: cls, text: k });
        // NOTE: no focus() anywhere in here, and the button is not a text input.
        b.addEventListener("click", function (e) { e.preventDefault(); press(k); });
        b.addEventListener("mousedown", function (e) { e.preventDefault(); });   // keep focus off the display
        keys.appendChild(b);
      });
    });
    host.appendChild(keys);
    host.appendChild(U.el("div", { class: "muted2 small", style: "margin-top:8px", text: "% change = (new − old) ÷ old × 100.   Multiplier = 1 ÷ MPS." }));

    function press(k) {
      if (k === "C") { expr = ""; disp.value = "0"; return; }
      if (k === "=") {
        var v = evaluate(expr);
        disp.value = (v === null) ? "—" : U.fmtNum(v, undefined);
        expr = (v === null) ? "" : String(v);
        return;
      }
      expr += k === "÷" ? "/" : k === "×" ? "*" : k === "−" ? "-" : k;
      disp.value = expr;
    }
  }

  /* Tiny shunting-yard evaluator — no eval(), no Function(). */
  function evaluate(src) {
    var s = String(src).replace(/\s+/g, "");
    if (!s) return null;
    var i = 0;
    try {
      var v = parseExpr();
      if (i !== s.length) return null;
      return isFinite(v) ? Math.round(v * 1e10) / 1e10 : null;
    } catch (e) { return null; }

    function parseExpr() {
      var v = parseTerm();
      while (i < s.length && (s[i] === "+" || s[i] === "-")) {
        var op = s[i++]; var r = parseTerm();
        v = op === "+" ? v + r : v - r;
      }
      return v;
    }
    function parseTerm() {
      var v = parseUnary();
      while (i < s.length && (s[i] === "*" || s[i] === "/")) {
        var op = s[i++]; var r = parseUnary();
        if (op === "/" && r === 0) throw new Error("div0");
        v = op === "*" ? v * r : v / r;
      }
      return v;
    }
    function parseUnary() {
      if (s[i] === "-") { i++; return -parseUnary(); }
      if (s[i] === "+") { i++; return parseUnary(); }
      return parseAtom();
    }
    function parseAtom() {
      if (s[i] === "(") {
        i++;
        var v = parseExpr();
        if (s[i] !== ")") throw new Error("paren");
        i++;
        return postfix(v);
      }
      var m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (!m) throw new Error("num");
      i += m[1].length;
      return postfix(parseFloat(m[1]));
    }
    function postfix(v) {
      while (s[i] === "%") { i++; v = v / 100; }
      return v;
    }
  }
  T.evaluate = evaluate;

  /* ── working space ─────────────────────────────────────────────────
     Elasticity working and process sequencing both benefit. Persisted per mode
     so a student can jot a calculation and come back to it. */
  function buildPad(host) {
    var key = "equilibrium.pad." + (mode || "general");
    var ta = U.el("textarea", {
      class: "pad", placeholder: "Working space — percentage changes, a multiplier, the order of the steps…",
      spellcheck: "false"
    });
    try { ta.value = root.localStorage.getItem(key) || ""; } catch (e) { /* private mode */ }
    ta.addEventListener("input", U.debounce(function () {
      try { root.localStorage.setItem(key, ta.value); } catch (e) { /* ignore */ }
    }, 400));
    host.appendChild(ta);
    var row = U.el("div", { class: "row", style: "margin-top:8px" }, [
      U.el("button", { class: "btn btn-sm", onclick: function () { ta.value = ""; try { root.localStorage.removeItem(key); } catch (e) {} } }, "Clear"),
      U.el("button", { class: "btn btn-sm", onclick: function () { ta.value += "\n     |  A  |  a\n  ---+-----+-----\n   A |     |\n   a |     |\n"; } }, "Insert 2×2 grid")
    ]);
    host.appendChild(row);
  }

  /* ── reference ─────────────────────────────────────────────────────── */
  function buildRef(host) {
    host.appendChild(U.el("div", { class: "honesty", text: "Open during a scored run, this costs 25% of the run's XP and credits. The charge is already applied." }));

    var search = U.el("input", {
      class: "calc-disp", type: "search", placeholder: "Search a term…", style: "text-align:left;font-size:15px;font-weight:500"
    });
    host.appendChild(search);
    var list = U.el("div", { class: "list", style: "margin-top:8px" });
    host.appendChild(list);

    var terms = (ECON.DATA.glossary || []).slice().sort(function (a, b) { return a.term < b.term ? -1 : 1; });

    function draw(q) {
      U.clear(list);
      var qq = U.norm(q || "");
      var hits = terms.filter(function (t) {
        return !qq || U.norm(t.term).indexOf(qq) >= 0 || U.norm(t.def).indexOf(qq) >= 0;
      }).slice(0, 40);
      if (!hits.length) { list.appendChild(U.el("div", { class: "muted2 small", text: "No match." })); return; }
      hits.forEach(function (t) {
        list.appendChild(U.el("div", { class: "li" }, [
          U.el("div", { class: "grow" }, [
            U.el("b", { text: t.term }),
            U.el("small", { text: t.def })
          ]),
          U.el("span", { class: "badge", text: t.mod || "" })
        ]));
      });
    }
    search.addEventListener("input", U.debounce(function () { draw(search.value); }, 150));
    draw("");
  }

  ECON.Tools = T;
})(typeof window !== "undefined" ? window : globalThis);
