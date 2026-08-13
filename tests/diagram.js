#!/usr/bin/env node
/* tests/diagram.js — the three things that bite (brief §3.3), measured in a
   real browser rather than trusted.

     • every hit area renders at 44 CSS px or more, on the actual artwork
     • the label bank sits BELOW the diagram and never overlaps it at 360 px
     • the SVG scales with CSS and does not overflow on rotation
*/
"use strict";
const B = require("./browser.js");

(async () => {
  const r = B.reporter("diagram");
  const rig = await B.launch({ width: 360 });
  const { page } = rig;

  const ids = await page.evaluate(() => window.ECON.Diagram.all().map((d) => d.id));
  console.log("diagram — checking " + ids.length + " diagrams at 360px");
  r.check(ids.length >= 12, "only " + ids.length + " diagrams — the HSC Economics course has about twelve canonical diagrams and all of them must be here");

  for (const id of ids) {
    // ── static reference view: renders, scales, no overflow
    await B.goto(page, "/atlas?d=" + id);
    await page.waitForTimeout(160);

    const fig = await page.evaluate(() => {
      const svg = document.querySelector("#view .dg-wrap svg");
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      return {
        w: rect.width, h: rect.height,
        hasWidthAttr: svg.hasAttribute("width"),
        hasHeightAttr: svg.hasAttribute("height"),
        viewBox: svg.getAttribute("viewBox"),
        badges: document.querySelectorAll("#view .dg-numbg").length
      };
    });
    r.check(!!fig, id + ": no SVG rendered in the Atlas");
    if (!fig) continue;

    r.check(fig.w > 200 && fig.w <= 360, id + ": rendered " + Math.round(fig.w) + "px wide — it should fill the column");
    r.check(!fig.hasWidthAttr && !fig.hasHeightAttr, id + ": SVG still carries width/height, so CSS cannot size it (§3.3)");
    r.check(!!fig.viewBox, id + ": SVG has no viewBox");
    r.check(fig.badges > 0, id + ": no numbered badges drawn in the reference view");

    const over = await B.overflow(page);
    r.check(over.length === 0, id + ": overflows at 360px — " + over.join("; "));

    // ── the Label It round: hit areas and label bank position
    await B.goto(page, "/play/labelit?d=" + id);
    await page.waitForTimeout(300);

    // force the label variant rather than waiting for it to be drawn
    const measured = await page.evaluate((diagramId) => {
      const def = window.ECON.Diagram.get(diagramId);
      const host = document.querySelector(".gs-body") || document.querySelector("#view");
      const stage = document.createElement("div");
      host.appendChild(stage);
      window.ECON.Diagram.label(stage, def, { count: Math.min(5, def.parts.length) });
      return new Promise((resolve) => {
        requestAnimationFrame(() => setTimeout(() => {
          const svg = stage.querySelector("svg");
          const vb = svg.getAttribute("viewBox").trim().split(/[\s,]+/).map(Number);
          const rect = svg.getBoundingClientRect();
          const scale = rect.width / vb[2];
          const hits = [...stage.querySelectorAll(".dg-hit")].map((h) => ({
            part: h.getAttribute("data-part"),
            px: Number(h.getAttribute("r")) * 2 * scale
          }));
          const bank = stage.querySelector(".dg-bank");
          const bankRect = bank ? bank.getBoundingClientRect() : null;
          const chips = bank ? [...bank.querySelectorAll(".dg-chip")].map((c) => {
            const cr = c.getBoundingClientRect();
            return { top: cr.top, height: cr.height, right: cr.right };
          }) : [];
          resolve({
            hits, scale,
            svgBottom: rect.bottom, svgTop: rect.top, svgRight: rect.right,
            bankTop: bankRect ? bankRect.top : null,
            chips,
            viewportWidth: document.documentElement.clientWidth
          });
        }, 40));
      });
    }, id);

    // 44px minimum touch target on every labellable part
    r.check(measured.hits.length > 0, id + ": no hit areas were created");
    measured.hits.forEach((h) => {
      r.check(h.px >= 43.5,
        id + " part " + h.part + ": hit area renders at " + h.px.toFixed(1) + "px, below the 44px minimum (§3.3)");
    });

    // the label bank must sit BELOW the artwork, never over it
    r.check(measured.bankTop !== null, id + ": no label bank rendered");
    if (measured.bankTop !== null) {
      r.check(measured.bankTop >= measured.svgBottom - 1,
        id + ": the label bank starts at y=" + Math.round(measured.bankTop) +
        " but the diagram ends at y=" + Math.round(measured.svgBottom) + " — labels overlap the artwork (§3.3)");
      measured.chips.forEach((c, i) => {
        r.check(c.top >= measured.svgBottom - 1, id + ": label chip " + i + " overlaps the artwork");
        r.check(c.height >= 39, id + ": label chip " + i + " is only " + Math.round(c.height) + "px tall");
        r.check(c.right <= measured.viewportWidth + 1, id + ": label chip " + i + " extends past the viewport");
      });
    }
  }

  // ── a diagram with N parts must not be N fixed questions (§3.3)
  const varied = await page.evaluate(() => {
    const def = window.ECON.Diagram.all().find((d) => d.parts.length >= 6);
    if (!def) return null;
    const seen = new Set();
    for (let i = 0; i < 40; i++) {
      const q = window.ECON.Diagram.pickQuestion(def, "identify");
      if (q) seen.add(q.part.id);
    }
    return { total: def.parts.length, distinct: seen.size, id: def.id };
  });
  if (varied) {
    r.check(varied.distinct >= Math.min(5, varied.total),
      varied.id + ": only " + varied.distinct + " of " + varied.total + " parts were ever asked about — the round is a fixed order");
  }

  const errs = rig.errors.filter((e) => !/favicon|manifest/i.test(e));
  r.check(errs.length === 0, "console errors — " + errs.slice(0, 3).join(" | "));

  await r.done(rig);
})();
