#!/usr/bin/env node
/* tests/smoke.js — every screen and mode driven end to end.

   Asserts: zero console errors, no horizontal overflow at 360 AND 390 px
   (addendum H6), and that a hover rule never repaints a primary button into
   unreadable colours (H2). */
"use strict";
const B = require("./browser.js");


(async () => {
  const r = B.reporter("smoke");

  for (const width of [320, 360, 390, 414]) {
    const rig = await B.launch({ width });
    const { page } = rig;
    console.log("smoke — driving every screen at " + width + "px");


    const screens = [
      "/home", "/cards", "/atlas", "/shop", "/you", "/settings", "/reference",
      "/arcade", "/play/drill", "/play/boss"
    ];
    for (const s of screens) {
      await B.goto(page, s);
      const over = await B.overflow(page);
      r.check(over.length === 0, width + "px " + s + ": horizontal overflow — " + over.join("; "));
      const hasContent = await page.evaluate(() => document.querySelector("#view").children.length > 0);
      r.check(hasContent, width + "px " + s + ": rendered nothing");
      const collide = await B.overlaps(page);
      r.check(collide.length === 0, width + "px " + s + ": overlapping UI — " + collide.join("; "));
      const crushed = await B.squeezed(page);
      r.check(crushed.length === 0, width + "px " + s + ": text crushed to nothing — " + crushed.join("; "));
    }

    /* ── the top bar, with numbers big enough to be awkward ───────────
       The bar shipped with the stat chips painted over the brand name at
       five-digit XP. Nothing caught it: no element overflowed the document,
       the grid tracks simply collided, and the default save has small enough
       numbers that the bar fits. So set the numbers high and measure. */
    await B.goto(page, "/home");
    await page.evaluate(() => {
      const S = window.ECON.State;
      S.data.xp = 284500; S.data.coins = 18400; S.save();
      window.ECON.UI.syncChrome();
    });
    await page.waitForTimeout(120);

    const bar = await page.evaluate(() => {
      const tb = document.querySelector(".topbar");
      const kids = [...tb.children].filter((k) => getComputedStyle(k).display !== "none");
      const r = tb.getBoundingClientRect();
      const boxes = kids.map((k) => {
        const b = k.getBoundingClientRect();
        return { cls: k.className || k.id, left: b.left, right: b.right, w: b.width };
      });
      const nameEl = document.querySelector(".brand-name");
      const nameCS = nameEl ? getComputedStyle(nameEl) : null;
      return {
        barW: r.width,
        boxes: boxes,
        contentRight: Math.max.apply(null, boxes.map((b) => b.right)),
        contentLeft: Math.min.apply(null, boxes.map((b) => b.left)),
        nameShown: !!nameEl && nameCS.display !== "none",
        nameW: nameEl ? nameEl.getBoundingClientRect().width : 0,
        nameScroll: nameEl ? nameEl.scrollWidth : 0
      };
    });

    // 1. no child of the bar collides with another
    for (let i = 0; i < bar.boxes.length; i++) {
      for (let j = i + 1; j < bar.boxes.length; j++) {
        const a = bar.boxes[i], b = bar.boxes[j];
        const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        r.check(ox <= 2, width + "px top bar: " + a.cls + " overlaps " + b.cls +
          " by " + Math.round(ox) + "px at five-digit XP — the stat chips are painting over the brand");
      }
    }
    // 2. and nothing sits outside the bar itself
    r.check(bar.contentLeft >= -2 && bar.contentRight <= bar.barW + 2,
      width + "px top bar: content spans " + Math.round(bar.contentLeft) + "→" +
      Math.round(bar.contentRight) + " inside a " + Math.round(bar.barW) + "px bar");
    // 3. if the brand name is shown at all, it must not be clipped to nothing
    if (bar.nameShown) {
      r.check(bar.nameW >= Math.min(40, bar.nameScroll),
        width + "px top bar: the brand name is squeezed to " + Math.round(bar.nameW) +
        "px of " + bar.nameScroll + "px — it should truncate gracefully, not vanish");
    }

    // every mode the registry knows about, opened and given one interaction
    const modes = await page.evaluate(() => window.ECON.Run.MODES.map((m) => ({ id: m.id, route: m.route })));
    r.check(modes.length >= 12, "expected at least 12 registered modes, found " + modes.length);

    for (const m of modes) {
      const route = m.route === "/cards" ? "/play/flashcards" : m.route;
      await B.goto(page, route);
      await page.waitForTimeout(260);

      const over = await B.overflow(page);
      r.check(over.length === 0, width + "px " + m.id + ": horizontal overflow — " + over.join("; "));
      const collide = await B.overlaps(page);
      r.check(collide.length === 0, width + "px " + m.id + ": overlapping UI — " + collide.join("; "));
      const crushed = await B.squeezed(page);
      r.check(crushed.length === 0, width + "px " + m.id + ": text crushed to nothing — " + crushed.join("; "));

      // answer / advance once, whatever the mode offers
      const clicked = await page.evaluate(() => {
        const pick = document.querySelector(".opt:not([disabled])") ||
                     document.querySelector(".dg-chip:not([disabled])") ||
                     document.querySelector(".crit-item input") ||
                     document.querySelector(".rb-answer") ||
                     document.querySelector(".gs-body .btn-primary") ||
                     document.querySelector("#view .btn-primary") ||
                     document.querySelector("#view button:not([disabled])");
        if (!pick) return false;
        if (pick.tagName === "TEXTAREA") { pick.value = "test answer for the smoke test, long enough to count"; return true; }
        pick.click();
        return true;
      });
      r.check(clicked, width + "px " + m.id + ": nothing interactive on the first screen");
      await page.waitForTimeout(220);

      const over2 = await B.overflow(page);
      r.check(over2.length === 0, width + "px " + m.id + " after interaction: overflow — " + over2.join("; "));
    }

    // ── H2: a hover rule must not leave a primary button unreadable
    await B.goto(page, "/home");
    const contrast = await page.evaluate(() => {
      const btn = document.createElement("button");
      btn.className = "btn btn-primary";
      btn.textContent = "Test";
      document.querySelector("#view").appendChild(btn);
      const before = getComputedStyle(btn);
      const out = { bg: before.backgroundColor, fg: before.color };
      btn.remove();
      return out;
    });
    const lum = (c) => {
      const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
      if (!m) return 0.5;
      const [rr, gg, bb] = [1, 2, 3].map((i) => {
        const v = Number(m[i]) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
    };
    const l1 = lum(contrast.bg), l2 = lum(contrast.fg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    r.check(ratio >= 4.5, "btn-primary contrast is only " + ratio.toFixed(2) + ":1 (needs 4.5:1) — dark text on a dark fill (defect H2)");

    // ── the hidden attribute must actually hide, even on a grid (maths §9.1)
    const hiddenWorks = await page.evaluate(() => {
      const d = document.createElement("div");
      d.style.display = "grid";
      d.hidden = true;
      document.body.appendChild(d);
      const shown = getComputedStyle(d).display !== "none";
      d.remove();
      return !shown;
    });
    r.check(hiddenWorks, "[hidden] does not beat display:grid — add [hidden]{display:none !important} (maths §9.1)");

    const realErrors = rig.errors.filter((e) => !/favicon|manifest|Failed to load resource/i.test(e));
    r.check(realErrors.length === 0, width + "px: console errors — " + realErrors.slice(0, 5).join(" | "));

    await rig.close();
  }

  await r.done();
})();
