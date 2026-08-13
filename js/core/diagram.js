/* Equilibrium — js/core/diagram.js
   The SVG label / hotspot engine (brief §3).

   One diagram definition yields four modes:
     label()    — place every label on the artwork (tap-then-tap)
     identify() — one part highlighted, name it
     role()     — one part highlighted, pick what it does
     figure()   — static reference view

   The three things that bite (§3.3) are handled here, not per diagram:
     • every labellable part gets an invisible hit circle sized in *rendered*
       pixels, so it is at least 44px however the artwork is scaled;
     • the label bank is a wrapping row BELOW the artwork, never over it;
     • the SVG carries a viewBox and nothing else — CSS does the sizing.

   Exposes: window.ECON.Diagram */
(function (root) {
  "use strict";

  var ECON = root.ECON = root.ECON || {};
  var U = ECON.U, S = ECON.State;
  var D = {};

  D.MIN_HIT_PX = 44;
  var SVGNS = "http://www.w3.org/2000/svg";

  D.get = function (id) { return (ECON.DATA.diagrams || {})[id] || null; };
  D.all = function () { var d = ECON.DATA.diagrams || {}; return Object.keys(d).map(function (k) { return d[k]; }); };

  /* ── mount ───────────────────────────────────────────────────────────
     Parses the authored SVG string, strips any width/height, and returns the
     live <svg> plus a lookup of part elements. */
  D.mount = function (def) {
    var wrap = U.el("div", { class: "dg-wrap" });
    wrap.innerHTML = def.svg;
    var svg = wrap.querySelector("svg");
    if (!svg) throw new Error("diagram " + def.id + " has no <svg>");
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    if (!svg.getAttribute("viewBox")) throw new Error("diagram " + def.id + " needs a viewBox");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", def.title);

    var overlay = document.createElementNS(SVGNS, "g");
    overlay.setAttribute("class", "dg-overlay");
    svg.appendChild(overlay);

    var els = {};
    def.parts.forEach(function (p) {
      var e = svg.querySelector("#" + cssEscape(p.id));
      if (!e) console.warn("diagram " + def.id + ": no element #" + p.id);
      els[p.id] = e;
    });

    return { wrap: wrap, svg: svg, overlay: overlay, els: els, def: def };
  };

  function cssEscape(s) { return String(s).replace(/([^\w-])/g, "\\$1"); }

  /* Centre of a part, in viewBox units. Explicit hx/hy always wins so the
     hotspot can sit somewhere sensible on an awkward shape (the Golgi). */
  function centre(m, part) {
    if (typeof part.hx === "number" && typeof part.hy === "number") return { x: part.hx, y: part.hy };
    var e = m.els[part.id];
    if (e && e.getBBox) {
      try { var b = e.getBBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; } catch (err) { /* not rendered yet */ }
    }
    var vb = viewBox(m.svg);
    return { x: vb.w / 2, y: vb.h / 2 };
  }

  function viewBox(svg) {
    var p = (svg.getAttribute("viewBox") || "0 0 100 100").trim().split(/[\s,]+/).map(Number);
    return { x: p[0], y: p[1], w: p[2], h: p[3] };
  }

  /* Radius, in viewBox units, that renders at >= MIN_HIT_PX across. */
  D.hitRadius = function (svg) {
    var vb = viewBox(svg);
    var rect = svg.getBoundingClientRect();
    var scale = rect.width > 0 ? rect.width / vb.w : 1;
    if (!isFinite(scale) || scale <= 0) scale = 1;
    return (D.MIN_HIT_PX / 2) / scale;
  };

  /* Add an invisible, generously sized hit circle over a part. The listener
     goes on THIS, never on the artwork. */
  D.addHit = function (m, part, onTap) {
    var c = centre(m, part);
    var r = D.hitRadius(m.svg);
    var hit = document.createElementNS(SVGNS, "circle");
    hit.setAttribute("cx", c.x);
    hit.setAttribute("cy", c.y);
    hit.setAttribute("r", r);
    hit.setAttribute("fill", "transparent");
    hit.setAttribute("class", "dg-hit");
    hit.setAttribute("data-part", part.id);
    hit.setAttribute("tabindex", "0");
    hit.setAttribute("role", "button");
    hit.setAttribute("aria-label", "Part " + (part.n || ""));
    if (onTap) {
      hit.addEventListener("click", function (e) { e.preventDefault(); onTap(part, hit); });
      hit.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTap(part, hit); } });
    }
    m.overlay.appendChild(hit);
    return { hit: hit, cx: c.x, cy: c.y, r: r };
  };

  D.addBadge = function (m, part, text, cls) {
    var c = centre(m, part);
    var vb = viewBox(m.svg);
    var r = Math.max(11, vb.w * 0.035);
    var g = document.createElementNS(SVGNS, "g");
    g.setAttribute("class", "dg-badge");
    g.setAttribute("pointer-events", "none");
    var bg = document.createElementNS(SVGNS, "circle");
    bg.setAttribute("cx", c.x); bg.setAttribute("cy", c.y); bg.setAttribute("r", r);
    bg.setAttribute("class", "dg-numbg" + (cls ? " " + cls : ""));
    var t = document.createElementNS(SVGNS, "text");
    t.setAttribute("x", c.x); t.setAttribute("y", c.y);
    t.setAttribute("class", "dg-num");
    t.setAttribute("font-size", r * 1.15);
    t.textContent = text;
    g.appendChild(bg); g.appendChild(t);
    m.overlay.appendChild(g);
    return { g: g, bg: bg, text: t };
  };

  D.highlight = function (m, partId, on) {
    var e = m.els[partId];
    if (!e) return;
    if (on) {
      e.dataset.dgPrevStroke = e.getAttribute("stroke") || "";
      e.dataset.dgPrevWidth = e.getAttribute("stroke-width") || "";
      e.setAttribute("stroke", "var(--warn)");
      e.setAttribute("stroke-width", "4");
      e.classList.add("dg-focus");
    } else {
      e.setAttribute("stroke", e.dataset.dgPrevStroke || "");
      e.setAttribute("stroke-width", e.dataset.dgPrevWidth || "");
      e.classList.remove("dg-focus");
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
     Static reference figure
     ═══════════════════════════════════════════════════════════════════ */
  D.figure = function (def, opts) {
    opts = opts || {};
    var m = D.mount(def);
    var box = U.el("div", {}, [m.wrap]);
    if (opts.numbers !== false) {
      U.raf(function () {
        def.parts.forEach(function (p, i) { D.addBadge(m, p, String(i + 1)); });
      });
    }
    if (opts.legend !== false) {
      var leg = U.el("div", { class: "dg-legend" });
      def.parts.forEach(function (p, i) {
        leg.appendChild(U.el("div", {}, [
          U.el("b", { text: (i + 1) + ". " + p.label }),
          p.role ? U.el("span", { text: " — " + p.role }) : null
        ]));
      });
      box.appendChild(leg);
    }
    return box;
  };

  /* Small inline figure for an MCQ stem — no numbers, no legend. */
  D.staticFigure = function (idOrDef) {
    var def = typeof idOrDef === "string" ? D.get(idOrDef) : idOrDef;
    if (!def) return U.el("div", { class: "muted2 small", text: "[figure missing]" });
    var m = D.mount(def);
    return m.wrap;
  };

  /* ═══════════════════════════════════════════════════════════════════
     Mode 1 — label the diagram (tap a label, then tap the numbered spot)
     A diagram with N parts is NOT N questions: a subset is drawn per round
     and the order is shuffled. (§3.3)
     ═══════════════════════════════════════════════════════════════════ */
  D.label = function (host, def, opts) {
    opts = opts || {};
    var count = Math.min(opts.count || 5, def.parts.length);
    var chosen = U.sample(def.parts, count);
    var order = U.shuffle(chosen);                 // badge numbering order
    var m = D.mount(def);
    U.clear(host);
    host.appendChild(m.wrap);

    var bank = U.el("div", { class: "dg-bank" });
    host.appendChild(bank);

    var placed = {}, selectedChip = null, badges = {}, wrong = 0, done = 0;

    U.raf(function () {
      order.forEach(function (p, i) {
        p._n = i + 1;
        badges[p.id] = D.addBadge(m, p, String(i + 1), "target");
        D.addHit(m, p, function () { tapSpot(p); });
      });
    });

    U.shuffle(chosen).forEach(function (p) {
      var chip = U.el("button", { class: "dg-chip", type: "button", "data-part": p.id, text: p.label });
      chip.addEventListener("click", function () {
        if (placed[p.id]) return;
        if (selectedChip === chip) { chip.classList.remove("sel"); selectedChip = null; return; }
        U.$$(".dg-chip", bank).forEach(function (c) { c.classList.remove("sel"); });
        chip.classList.add("sel");
        selectedChip = chip;
      });
      bank.appendChild(chip);
    });

    function tapSpot(part) {
      if (!selectedChip) { ECON.UI.toast("Pick a label first", null, 1100); return; }
      var chipPart = selectedChip.dataset.part;
      var ok = chipPart === part.id;
      var badge = badges[part.id];
      if (ok) {
        placed[part.id] = true;
        done++;
        selectedChip.classList.remove("sel");
        selectedChip.classList.add("done");
        selectedChip.disabled = true;
        selectedChip = null;
        badge.bg.setAttribute("class", "dg-numbg right");
        badge.text.textContent = String(part._n);
        if (opts.onCorrect) opts.onCorrect(part);
        if (done === chosen.length && opts.onDone) opts.onDone({ wrong: wrong, total: chosen.length });
      } else {
        wrong++;
        badge.bg.setAttribute("class", "dg-numbg wrong");
        setTimeout(function () { if (!placed[part.id]) badge.bg.setAttribute("class", "dg-numbg target"); }, 500);
        if (opts.onWrong) opts.onWrong(part, chipPart);
      }
    }

    return {
      mount: m,
      reveal: function () {
        chosen.forEach(function (p) {
          if (placed[p.id]) return;
          badges[p.id].bg.setAttribute("class", "dg-numbg wrong");
        });
        var leg = U.el("div", { class: "dg-legend", style: "margin-top:8px" });
        order.forEach(function (p) {
          leg.appendChild(U.el("div", {}, [U.el("b", { text: p._n + ". " + p.label }), p.role ? U.el("span", { text: " — " + p.role }) : null]));
        });
        host.appendChild(leg);
      },
      parts: chosen
    };
  };

  /* ═══════════════════════════════════════════════════════════════════
     Modes 2 & 3 — identify the part / state its function
     ═══════════════════════════════════════════════════════════════════ */
  D.pickQuestion = function (def, kind, rnd) {
    var usable = def.parts.filter(function (p) { return kind === "role" ? !!p.role : true; });
    if (usable.length < 2) return null;
    var target = U.pick(usable, rnd);
    var field = kind === "role" ? "role" : "label";

    // distractors come from other parts of THIS diagram first, then from
    // parts of other diagrams in the same topic — a bank of real economics,
    // not invented text.
    var pool = usable.filter(function (p) { return p.id !== target.id; }).map(function (p) { return p[field]; });
    if (pool.length < 3) {
      D.all().forEach(function (d) {
        if (d.id === def.id || d.mod !== def.mod) return;
        d.parts.forEach(function (p) { if (p[field] && p[field] !== target[field]) pool.push(p[field]); });
      });
    }
    pool = U.uniq(pool).filter(function (x) { return x && x !== target[field]; });
    if (pool.length < 3) return null;

    var opts = U.shuffle([target[field]].concat(U.sample(pool, 3, rnd)));
    return {
      diagram: def,
      part: target,
      kind: kind,
      q: kind === "role"
        ? "What is the function of the highlighted structure?"
        : "What is the highlighted structure?",
      options: opts,
      answer: opts.indexOf(target[field]),
      why: kind === "role"
        ? target.label + " — " + target.role
        : "That is the " + target.label.toLowerCase() + (target.role ? ". " + target.role + "." : ".")
    };
  };

  D.renderHighlighted = function (host, def, part) {
    var m = D.mount(def);
    U.clear(host);
    host.appendChild(m.wrap);
    U.raf(function () {
      D.highlight(m, part.id, true);
      D.addBadge(m, part, "?", "target");
    });
    return m;
  };

  /* ── sequencing support: stages of a process drawn as panels ──────── */
  D.sequencePanels = function (def) {
    return (def.stages || []).map(function (st) {
      var box = U.el("div", { class: "card card-tight" });
      box.innerHTML = st.svg;
      var svg = box.querySelector("svg");
      if (svg) { svg.removeAttribute("width"); svg.removeAttribute("height"); }
      box.appendChild(U.el("div", { class: "small", style: "margin-top:6px", text: st.label }));
      return { el: box, stage: st };
    });
  };

  ECON.Diagram = D;
})(typeof window !== "undefined" ? window : globalThis);
