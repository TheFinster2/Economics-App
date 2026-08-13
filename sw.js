/* Equilibrium service worker.

   DEFECT E1: bumping BUILD is the ONLY thing that makes a fix reach an already
   installed phone. If you change any file in PRECACHE and do not bump BUILD,
   installed devices keep serving the old copy forever and you will spend a
   week convincing yourself the bug is in the code.

   tests/update.js fails if BUILD here does not match State.BUILD in
   js/core/state.js, and validate.js fails if a file exists that is not in
   PRECACHE. */

var BUILD = "0.1.0";
var CACHE = "equilibrium-v" + BUILD;

var PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "icons/icon.svg",
  "js/core/util.js",
  "js/core/state.js",
  "js/core/ui.js",
  "js/core/econcalc.js",
  "js/core/mark.js",
  "js/core/bank.js",
  "js/core/coverage.js",
  "js/core/diagram.js",
  "js/core/tools.js",
  "js/data/glossary.js",
  "js/data/mcq-y11.js",
  "js/data/mcq-y12.js",
  "js/data/cards.js",
  "js/data/short.js",
  "js/data/play.js",
  "js/data/calc-templates.js",
  "js/data/shifts.js",
  "js/data/diagrams/market.js",
  "js/data/diagrams/macro.js",
  "js/data/packs.js",
  "js/data/achievements.js",
  "js/data/shop.js",
  "js/modes/common.js",
  "js/modes/rapidfire.js",
  "js/modes/drill.js",
  "js/modes/calculate.js",
  "js/modes/termmatch.js",
  "js/modes/labelit.js",
  "js/modes/datadetective.js",
  "js/modes/sortit.js",
  "js/modes/shiftit.js",
  "js/modes/processorder.js",
  "js/modes/survival.js",
  "js/modes/rehab.js",
  "js/modes/response.js",
  "js/modes/boss.js",
  "js/modes/flashcards.js",
  "js/arcade/arcade.js",
  "js/arcade/marketrun.js",
  "js/arcade/ticker-match.js",
  "js/arcade/bargain-hunt.js",
  "js/screens/home.js",
  "js/screens/cards.js",
  "js/screens/atlas.js",
  "js/screens/shop.js",
  "js/screens/you.js",
  "js/screens/settings.js",
  "js/screens/reference.js",
  "js/screens/dev.js",
  "js/app.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // addAll rejects the whole install if any single file 404s, which is the
      // behaviour we want — a half-cached app is worse than no app.
      return c.addAll(PRECACHE);
    })
  );
  // NOTE: no skipWaiting() here. A silent takeover mid-session would swap the
  // scripts under a running game. The new worker waits, the app offers "apply
  // now", and otherwise it applies on next launch.
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("message", function (e) {
  if (!e.data) return;
  if (e.data.type === "skip-waiting") self.skipWaiting();
  if (e.data.type === "which-cache" && e.source) e.source.postMessage({ type:"cache-name", cache: CACHE });
});

/* Cache-first. There is no network at runtime by design, so a cache miss for
   a same-origin asset is either a first load or a genuine gap. */
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // Offline and not cached: navigations fall back to the shell.
        if (req.mode === "navigate") return caches.match("index.html");
        return new Response("", { status: 504, statusText: "offline" });
      });
    })
  );
});
