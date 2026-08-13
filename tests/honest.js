#!/usr/bin/env node
/* tests/honest.js — a bot that plays every mode WELL.

   The counterpart to exploit.js. If a student knows the economics, the numbers
   the app quotes have to be real: comfortably above zero, and roughly
   consistent across modes so no single mode is the obviously optimal grind.

   It reads the answer key rather than the screen, which is the point — this
   measures the economy, not the UI. */
"use strict";
const B = require("./browser.js");

const READ = 1400;   // just over MIN_READ_MS, i.e. a fast but real student

(async () => {
  const r = B.reporter("honest");
  const rig = await B.launch({ width: 390 });
  const { page } = rig;

  console.log("honest — playing every mode well");

  async function xp() { return page.evaluate(() => window.ECON.State.data.xp); }

  const results = [];

  async function measure(name, fn) {
    const before = await xp();
    const t = Date.now();
    await fn();
    const gained = (await xp()) - before;
    const mins = (Date.now() - t) / 60000;
    results.push({ name, gained, perMin: gained / Math.max(mins, 0.0001) });
    console.log("  " + name.padEnd(18) + String(gained).padStart(6) + " XP in " + mins.toFixed(2) + " min");
  }

  /* Answer an MCQ mode correctly, at human speed. */
  async function playMcq(route, rounds) {
    await B.goto(page, route);
    for (let i = 0; i < rounds; i++) {
      await page.waitForTimeout(READ);
      const acted = await page.evaluate(() => {
        const opts = [...document.querySelectorAll(".opt:not([disabled])")];
        if (opts.length) {
          // the correct option is the one whose text matches the answer; the
          // shell stores it on the button set through renderMCQ's ordering
          const right = opts.find((o) => o.dataset.right === "1");
          (right || opts[0]).click();
          return "answered";
        }
        const next = document.querySelector(".gs-body .btn-primary, #view .btn-primary");
        if (next) { next.click(); return "advanced"; }
        return "done";
      });
      if (acted === "done") break;
    }
    await page.waitForTimeout(300);
  }

  // Mark the correct option so the honest bot can find it. This is a test
  // affordance and is applied only from the test, never in the shipped app.
  await page.evaluate(() => {
    const realRender = window.ECON.UI.renderMCQ;
    window.ECON.UI.renderMCQ = function (host, q, onAnswer, opts) {
      const out = realRender.call(this, host, q, onAnswer, opts);
      out.buttons.forEach((b, i) => { if (out.order[i] === q.answer) b.dataset.right = "1"; });
      return out;
    };
  });

  await measure("Topic Drill", () => playMcq("/play/drill?mod=P3", 40));

  // seed a few misses so Mistake Rehab has a pool to draw from
  await page.evaluate(() => {
    const ids = window.ECON.Bank.all("mcq").slice(0, 6).map((q) => q.id);
    ids.forEach((id) => window.ECON.State.markSeen(id, false));
  });
  await measure("Mistake Rehab", () => playMcq("/play/rehab", 30));

  await measure("Rapid Fire", async () => {
    await B.goto(page, "/play/rapidfire");
    const end = Date.now() + 126000;
    while (Date.now() < end) {
      await page.waitForTimeout(READ);
      const ok = await page.evaluate(() => {
        const opts = [...document.querySelectorAll(".opt:not([disabled])")];
        if (opts.length) { (opts.find((o) => o.dataset.right === "1") || opts[0]).click(); return true; }
        const next = document.querySelector(".gs-body .btn-primary");
        if (next) { next.click(); return true; }
        return false;
      });
      if (!ok) break;
    }
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("#view .btn-primary")].find((x) => /see results/i.test(x.textContent));
      if (b) b.click();
    });
    await page.waitForTimeout(400);
  });

  /* Response Builder played properly: a real answer, read the criteria, tick
     honestly (here: about three quarters of them). */
  await measure("Response Builder", async () => {
    await B.goto(page, "/play/response");
    for (let q = 0; q < 3; q++) {
      await page.evaluate(() => {
        const ta = document.querySelector(".rb-answer");
        if (ta) {
          ta.value = "A full written answer of the kind a student would produce in the exam, " +
                     "naming the structures involved, describing the process step by step and " +
                     "explaining why each step matters to the outcome.";
          ta.dispatchEvent(new Event("input"));
        }
      });
      await page.waitForTimeout(READ + 400);
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("#view .btn-primary")].find((b) => /reveal/i.test(b.textContent));
        if (btn) btn.click();
      });
      await page.waitForTimeout(READ + 400);
      await page.evaluate(() => {
        const boxes = [...document.querySelectorAll(".crit-item input")];
        boxes.slice(0, Math.ceil(boxes.length * 0.75)).forEach((cb) => cb.click());
        const done = [...document.querySelectorAll("#view .btn-primary")].find((b) => /record and continue/i.test(b.textContent));
        if (done) done.click();
      });
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(300);
  });

  /* Flashcards reviewed properly. */
  await measure("Flashcards", async () => {
    await B.goto(page, "/play/flashcards");
    for (let i = 0; i < 60; i++) {
      const acted = await page.evaluate(() => {
        const flip = [...document.querySelectorAll("#view .btn-primary")].find((b) => /show the answer/i.test(b.textContent));
        if (flip) { flip.click(); return "flipped"; }
        const good = [...document.querySelectorAll("#view .btn-sm")].find((b) => b.textContent.trim() === "Good");
        if (good) { good.click(); return "graded"; }
        return "done";
      });
      if (acted === "done") break;
      await page.waitForTimeout(acted === "flipped" ? READ : 60);
    }
    await page.waitForTimeout(300);
  });

  /* ── assertions ───────────────────────────────────────────────────── */
  results.forEach((x) => {
    r.check(x.gained > 0, x.name + " paid nothing to a student who played it well — the numbers must be real");
  });

  const rates = results.map((x) => x.perMin).filter((v) => v > 0);
  const hi = Math.max.apply(null, rates), lo = Math.min.apply(null, rates);
  console.log("  XP per minute: " + Math.round(lo) + " – " + Math.round(hi));
  r.check(hi / lo < 25,
    "the best mode pays " + (hi / lo).toFixed(1) + "× the worst per minute — one mode is the obvious grind");

  const total = results.reduce((a, x) => a + x.gained, 0);
  r.check(total > 400, "an honest bot earned only " + total + " XP across every mode — the economy is too stingy to be worth playing");

  const errs = rig.errors.filter((e) => !/favicon|manifest/i.test(e));
  r.check(errs.length === 0, "console errors during honest play — " + errs.slice(0, 3).join(" | "));

  await r.done(rig);
})();
