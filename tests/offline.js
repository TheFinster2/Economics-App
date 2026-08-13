#!/usr/bin/env node
/* tests/offline.js — install, go offline, every screen renders, progress persists. */
"use strict";
const B = require("./browser.js");

(async () => {
  const r = B.reporter("offline");
  const rig = await B.launch({ width: 390 });
  const { page, context } = rig;

  console.log("offline — installing, then cutting the network");

  // ── the service worker installs and precaches
  const installed = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return !!(reg && (reg.active || reg.installing || reg.waiting));
  });
  r.check(installed, "the service worker never became ready");

  await page.waitForTimeout(1200);
  const cached = await page.evaluate(async () => {
    const keys = await caches.keys();
    if (!keys.length) return { keys, count: 0 };
    const c = await caches.open(keys[0]);
    const reqs = await c.keys();
    return { keys, count: reqs.length };
  });
  r.check(cached.keys.length === 1, "expected exactly one cache, found " + cached.keys.length + ": " + cached.keys.join(", "));
  r.check(/^equilibrium-v/.test(cached.keys[0] || ""), "the cache name is not versioned: " + cached.keys[0]);
  r.check(cached.count > 40, "only " + cached.count + " files were precached");

  // ── earn some progress, then reload offline and confirm it survived
  await page.evaluate(() => {
    window.ECON.UI.award({ xp: 777, coins: 55, mode: "test", silent: true });
    window.ECON.State.save();
  });
  const before = await page.evaluate(() => ({ xp: window.ECON.State.data.xp, coins: window.ECON.State.data.coins }));

  await context.setOffline(true);
  await page.reload({ waitUntil: "load" });
  await page.waitForFunction(() => window.ECON && window.ECON.UI && window.ECON.Run);
  await B.dismissModal(page);

  const after = await page.evaluate(() => ({ xp: window.ECON.State.data.xp, coins: window.ECON.State.data.coins }));
  r.check(after.xp === before.xp, "XP was " + before.xp + " before the offline reload and " + after.xp + " after");
  r.check(after.coins === before.coins, "credits did not survive the offline reload");

  // ── every screen still renders with no network
  const screens = ["/home", "/cards", "/atlas", "/shop", "/you", "/settings", "/reference", "/arcade",
                   "/play/rapidfire", "/play/calculate", "/play/shiftit", "/play/labelit",
                   "/play/response", "/play/sortit", "/play/processorder", "/play/datadetective"];
  for (const s of screens) {
    await B.goto(page, s);
    await page.waitForTimeout(200);
    const ok = await page.evaluate(() => document.querySelector("#view").children.length > 0);
    r.check(ok, "offline: " + s + " rendered nothing");
  }

  // ── a diagram still draws offline (the SVG is inline, not fetched)
  await B.goto(page, "/atlas?d=supplyDemand");
  await page.waitForTimeout(200);
  const svgOk = await page.evaluate(() => !!document.querySelector("#view .dg-wrap svg"));
  r.check(svgOk, "offline: a diagram failed to render");

  const errs = rig.errors.filter((e) => !/favicon|manifest|Failed to load resource/i.test(e));
  r.check(errs.length === 0, "console errors while offline — " + errs.slice(0, 4).join(" | "));

  await context.setOffline(false);
  await r.done(rig);
})();
