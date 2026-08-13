#!/usr/bin/env node
/* tests/coverage.js — course coverage packs (brief §8).

   Two rules make coverage safe rather than exploitable, and both are measured:
     • every pack removes what it claims
     • hiding content grants no advantage — it never raises what the remaining
       questions pay, and never lowers an achievement target */
"use strict";
const B = require("./browser.js");

(async () => {
  const r = B.reporter("coverage");
  const rig = await B.launch({ width: 390 });
  const { page } = rig;

  const packs = await page.evaluate(() => window.ECON.Coverage.packs().map((p) => p.id));
  console.log("coverage — " + packs.length + " packs");

  const baseline = await page.evaluate(() => ({
    kinds: window.ECON.Bank.kinds.reduce((o, k) => { o[k] = window.ECON.Bank.active(k).length; return o; }, {}),
    all: window.ECON.Bank.kinds.reduce((o, k) => { o[k] = window.ECON.Bank.all(k).length; return o; }, {}),
    diagrams: window.ECON.Bank.activeDiagrams().length,
    allDiagrams: window.ECON.Bank.diagrams().length
  }));

  for (const id of packs) {
    const res = await page.evaluate((packId) => {
      const before = window.ECON.Bank.kinds.reduce((o, k) => { o[k] = window.ECON.Bank.active(k).length; return o; }, {});
      before.diagram = window.ECON.Bank.activeDiagrams().length;
      window.ECON.State.setHidden(packId, true);
      const after = window.ECON.Bank.kinds.reduce((o, k) => { o[k] = window.ECON.Bank.active(k).length; return o; }, {});
      after.diagram = window.ECON.Bank.activeDiagrams().length;
      const allAfter = window.ECON.Bank.kinds.reduce((o, k) => { o[k] = window.ECON.Bank.all(k).length; return o; }, {});
      allAfter.diagram = window.ECON.Bank.diagrams().length;
      const impact = window.ECON.Coverage.impact(packId);
      window.ECON.State.setHidden(packId, false);
      return { before, after, allAfter, impact };
    }, id);

    const removed = Object.keys(res.before).reduce((s, k) => s + (res.before[k] - res.after[k]), 0);
    r.check(removed > 0, "pack " + id + " removed nothing — the toggle appears, flips, and does nothing (§8)");
    r.check(removed === res.impact.total,
      "pack " + id + " claims to remove " + res.impact.total + " items but actually removed " + removed);

    // the COMPLETE bank must be untouched — achievement targets read all()
    Object.keys(baseline.all).forEach((k) => {
      r.check(res.allAfter[k] === baseline.all[k],
        "pack " + id + " changed Bank.all('" + k + "') from " + baseline.all[k] + " to " + res.allAfter[k] +
        " — hiding content must never shorten a collection (§8)");
    });
    r.check(res.allAfter.diagram === baseline.allDiagrams, "pack " + id + " changed the complete diagram count");
  }

  // ── hiding content must not raise what a run pays
  const payouts = await page.evaluate(() => {
    const S = window.ECON.State, UI = window.ECON.UI;
    function runOnce() {
      S.data.xp = 0;
      UI.award({ xp: 300, bonus: 120, accuracy: 1, readRatio: 1, mode: "test", silent: true });
      return S.data.xp;
    }
    const open = runOnce();
    window.ECON.Coverage.packs().forEach((p) => S.setHidden(p.id, true));
    const hidden = runOnce();
    window.ECON.Coverage.packs().forEach((p) => S.setHidden(p.id, false));
    S.data.xp = 0;
    return { open, hidden };
  });
  r.check(payouts.open === payouts.hidden,
    "a run paid " + payouts.hidden + " XP with everything hidden but " + payouts.open +
    " with everything on — hiding content must never raise the payout (§8)");

  // ── achievement targets are measured against the complete bank
  const targets = await page.evaluate(() => {
    const S = window.ECON.State;
    const before = window.ECON.Bank.all("mcq").length;
    window.ECON.Coverage.packs().forEach((p) => S.setHidden(p.id, true));
    const after = window.ECON.Bank.all("mcq").length;
    window.ECON.Coverage.packs().forEach((p) => S.setHidden(p.id, false));
    return { before, after };
  });
  r.check(targets.before === targets.after,
    "the 'see every question' target fell from " + targets.before + " to " + targets.after + " when content was hidden");

  // ── a mode whose pool is emptied says so rather than failing silently
  await page.evaluate(() => {
    window.ECON.Coverage.packs().forEach((p) => window.ECON.State.setHidden(p.id, true));
  });
  await B.goto(page, "/play/rapidfire");
  await page.waitForTimeout(300);
  const warned = await page.evaluate(() => !document.querySelector("#modalRoot").hidden ||
                                            /nothing/i.test(document.querySelector("#view").textContent));
  r.check(warned, "with every pack hidden, Rapid Fire did not tell the student why there is nothing to play");
  await page.evaluate(() => {
    window.ECON.UI.closeModal();
    window.ECON.Coverage.packs().forEach((p) => window.ECON.State.setHidden(p.id, false));
  });

  // ── the settings screen shows the switches and they flip
  await B.goto(page, "/settings");
  const switches = await page.evaluate(() => document.querySelectorAll(".switch input").length);
  r.check(switches >= packs.length, "Settings shows " + switches + " switches for " + packs.length + " packs");

  const errs = rig.errors.filter((e) => !/favicon|manifest/i.test(e));
  r.check(errs.length === 0, "console errors — " + errs.slice(0, 3).join(" | "));

  await r.done(rig);
})();
