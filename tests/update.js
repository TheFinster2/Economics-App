#!/usr/bin/env node
/* tests/update.js — a deployed version is detected while the app is open AND
   applied on next launch.

   Covers the service worker defects an earlier app in this lineage paid for:
     E1  a cache version that is not bumped means the fix never arrives
     E2  updatefound never fires for a worker that is ALREADY waiting
     E3  calling update() when one is waiting makes Chromium reinstall it
     E6  iOS keeps website data when a home-screen PWA is deleted

   Run with BREAK=1 to confirm it still fails without the fix.  */
"use strict";
const fs = require("fs");
const path = require("path");
const B = require("./browser.js");

const BREAK = process.env.BREAK === "1" || process.env.BREAK === "e1";
const SW = path.join(B.ROOT, "sw.js");

(async () => {
  const r = B.reporter("update");
  const original = fs.readFileSync(SW, "utf8");
  let restored = false;
  const restore = () => { if (!restored) { fs.writeFileSync(SW, original); restored = true; } };
  process.on("exit", restore);

  const rig = await B.launch({ width: 390 });
  const { page } = rig;
  console.log("update — deploying a new build under a running app" + (BREAK ? "  [BREAK=1: cache version NOT bumped]" : ""));

  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForTimeout(900);

  const firstCache = await page.evaluate(async () => (await caches.keys())[0]);
  r.check(!!firstCache, "no cache after the first install");

  /* ── E2/E3: registration must notice a worker that is already waiting ── */
  const appjs = fs.readFileSync(path.join(B.ROOT, "js/app.js"), "utf8");
  r.check(appjs.indexOf("reg.waiting && navigator.serviceWorker.controller") >= 0,
    "app.js does not check reg.waiting on registration — updatefound never fires for an already-waiting worker (E2)");
  r.check(/if \(!SW\.reg \|\| SW\.reg\.waiting\) return;/.test(appjs),
    "app.js polls update() without checking for a waiting worker — Chromium reinstalls it and downgrades a silent apply into a prompt (E3)");

  // skipWaiting is legitimate only in response to the student pressing "apply
  // now" — never inside install, where it would swap the scripts under a
  // running game.
  // strip comments first — sw.js documents this rule in a comment, and a grep
  // that trips over its own documentation is not testing the code
  const swCode = original.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const installBlock = /addEventListener\("install"[\s\S]*?\n\}\);/.exec(swCode);
  r.check(installBlock && !/skipWaiting/.test(installBlock[0]),
    "sw.js calls skipWaiting() during install — that swaps the scripts under a running game");
  r.check(/e\.data\.type === "skip-waiting"[\s\S]{0,40}skipWaiting\(\)/.test(original),
    "sw.js has no message-driven skipWaiting, so 'apply now' cannot work");

  /* ── deploy a new build ─────────────────────────────────────────────── */
  const bumped = BREAK
    ? original.replace(/AN OLD MARKER/, "")                       // change nothing at all
    : original.replace(/var BUILD = "[^"]+"/, 'var BUILD = "9.9.9-test"');
  const deployed = bumped.replace('"js/app.js"', '"js/app.js"') +
    "\n// deployed change " + (BREAK ? "without" : "with") + " a version bump\n";
  fs.writeFileSync(SW, deployed);

  // ask the running page to check for an update, the way the app does
  const detected = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return { error: "no registration" };
    let sawUpdateFound = false;
    reg.addEventListener("updatefound", () => { sawUpdateFound = true; });
    await reg.update();
    await new Promise((res) => setTimeout(res, 1500));
    const fresh = await navigator.serviceWorker.getRegistration();
    return {
      sawUpdateFound,
      waiting: !!(fresh && fresh.waiting),
      installing: !!(fresh && fresh.installing),
      caches: await caches.keys()
    };
  });

  if (BREAK) {
    // With no version bump the cache name is unchanged, so an installed device
    // keeps serving the old files. The check below must therefore FAIL.
    r.check(detected.caches.some((c) => c !== firstCache),
      "no cache version bump: the installed app still serves '" + firstCache +
      "' and your fix never reaches it (defect E1) — this is what BREAK=1 proves");
  } else {
    r.check(detected.waiting || detected.installing || detected.sawUpdateFound,
      "the running app did not detect the deployed update at all");

    // ── E1: the new build must produce a NEW cache name
    r.check(detected.caches.some((c) => c === "equilibrium-v9.9.9-test"),
      "the new build did not create a new versioned cache — found: " + detected.caches.join(", ") + " (defect E1)");

    // ── it applies on next launch, without being asked
    await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.waiting) reg.waiting.postMessage({ type: "skip-waiting" });
    });
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: "load" });
    await page.waitForFunction(() => window.ECON && window.ECON.UI);
    await B.dismissModal(page);

    const afterCaches = await page.evaluate(async () => await caches.keys());
    r.check(afterCaches.length === 1 && afterCaches[0] === "equilibrium-v9.9.9-test",
      "after applying the update the old cache was not cleaned up: " + afterCaches.join(", "));
  }

  /* ── E6: a force refresh, and the running build shown to the student ── */
  restore();
  const hasForce = await page.evaluate(() => typeof window.ECON.SW.forceRefresh === "function");
  r.check(hasForce, "there is no Force refresh — iOS does not clear website data when a home-screen PWA is deleted (E6)");

  await B.goto(page, "/settings");
  await page.waitForTimeout(250);
  const showsBuild = await page.evaluate(() => /Running build/i.test(document.querySelector("#view").textContent));
  r.check(showsBuild, "Settings does not show the running build, so a stuck install cannot be diagnosed (E6)");

  await r.done(rig);
})();
