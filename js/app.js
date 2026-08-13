/* Equilibrium — boot, routing kick-off, and the service worker lifecycle.

   The service worker was the biggest source of support questions in the
   earlier apps in this lineage. Four defects are handled explicitly here:

   E1  A cache version that is not bumped means your fix never reaches an
       installed phone. sw.js derives its cache name from BUILD, and
       tests/update.js fails if the two drift apart.
   E2  `updatefound` never fires for a worker that is ALREADY waiting. So we
       check reg.waiting on registration as well as listening for the event.
   E3  Calling update() while one is already waiting makes Chromium reinstall
       it, downgrading a silent apply into a dismissable prompt. So update()
       is only called when nothing is waiting.
   E6  iOS does not clear website data when a home-screen PWA is deleted. So
       Settings ships a Force refresh and shows the running build. */
(function (root) {
  "use strict";

  var ECON = root.ECON, U = ECON.U, S = ECON.State, UI = ECON.UI;

  /* ── service worker ──────────────────────────────────────────────── */
  var SW = { reg: null, waiting: null, cacheName: null };

  SW.register = function () {
    if (!("serviceWorker" in navigator) || root.location.protocol === "file:") return;

    navigator.serviceWorker.register("sw.js").then(function (reg) {
      SW.reg = reg;

      // E2: a worker may ALREADY be waiting when we register. updatefound will
      // never fire for it, so check explicitly.
      if (reg.waiting && navigator.serviceWorker.controller) onWaiting(reg.waiting);

      reg.addEventListener("updatefound", function () {
        var sw = reg.installing;
        if (!sw) return;
        sw.addEventListener("statechange", function () {
          if (sw.state === "installed" && navigator.serviceWorker.controller) onWaiting(sw);
        });
      });

      // E3: only poll for an update when nothing is waiting. Calling update()
      // with a waiting worker makes Chromium reinstall it.
      setInterval(function () {
        if (!SW.reg || SW.reg.waiting) return;
        SW.reg.update().catch(function () { /* offline: nothing to do */ });
      }, 30 * 60 * 1000);

      navigator.serviceWorker.addEventListener("message", function (e) {
        if (e.data && e.data.type === "cache-name") SW.cacheName = e.data.cache;
      });
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "which-cache" });
      }
    }).catch(function (e) {
      console.warn("service worker registration failed", e);
    });

    var reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (reloading) return;
      reloading = true;
      root.location.reload();
    });
  };

  function onWaiting(sw) {
    SW.waiting = sw;
    var bar = U.el("div", {
      style:"position:fixed;left:12px;right:12px;bottom:calc(var(--tab-h) + var(--safe-b) + 12px);z-index:80;" +
            "background:var(--card-3);border:1px solid var(--accent);border-radius:14px;padding:12px;" +
            "display:flex;gap:10px;align-items:center;box-shadow:var(--shadow)"
    }, [
      U.el("div", { class:"grow small", text:"A new version is ready. It will apply next time you open the app." }),
      U.el("button", { class:"btn btn-primary btn-sm", onclick: function () {
        sw.postMessage({ type:"skip-waiting" });
      } }, "Apply now")
    ]);
    document.body.appendChild(bar);
    setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 12000);
  }

  /* E6: iOS keeps website data after a home-screen app is deleted, so a stuck
     install needs a way out from inside the app. */
  SW.forceRefresh = function () {
    var jobs = [];
    if (root.caches && caches.keys) {
      jobs.push(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      }));
    }
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
      jobs.push(navigator.serviceWorker.getRegistrations().then(function (rs) {
        return Promise.all(rs.map(function (r) { return r.unregister(); }));
      }));
    }
    Promise.all(jobs).catch(function () {}).then(function () {
      root.location.reload();
    });
  };

  ECON.SW = SW;

  /* ── boot ────────────────────────────────────────────────────────── */
  function boot() {
    S.load();
    UI.syncChrome();

    // Persist on the way out. This runs AFTER State.freeze() during an import,
    // so it can never write stale data over an imported save (defect F1).
    U.on(root, "pagehide", function () { S.save(); });
    U.on(document, "visibilitychange", function () { if (document.hidden) S.save(); });

    U.on(root, "hashchange", function () { UI.render(); });

    U.$("#btnBack").addEventListener("click", function () { UI.back(); });
    U.$("#btnMenu").addEventListener("click", function () { UI.go("/settings"); });

    // Escape closes a modal; a real back button would be better but this is a
    // hash router and we do not want to fight the browser history.
    U.on(document, "keydown", function (e) {
      if (e.key === "Escape") UI.closeModal();
    });

    if (!root.location.hash) UI.go("/home", true);
    UI.render();

    S.touchDay();
    SW.register();

    // First run: a short, honest orientation.
    if (!S.data.seenIntro) {
      S.data.seenIntro = true;
      S.saveSoon();
      setTimeout(function () {
        UI.modal({
          title:"Equilibrium",
          body: U.el("div", {}, [
            U.el("p", { class:"small", text:"NSW HSC Biology, built as a game. Everything runs on this device — no accounts, no network, no data leaves your phone." }),
            U.el("p", { class:"small", text:"Two promises worth knowing up front:" }),
            U.el("ul", { class:"small muted", style:"padding-left:18px" }, [
              U.el("li", { text:"If a run says it is worth 200 XP, that is what a student who knows the biology earns. Someone who knows nothing earns zero." }),
              U.el("li", { text:"This app will never tell you your written answer is wrong. It shows you the marking criteria and a good answer, and you decide." })
            ])
          ]),
          actions:[{ label:"Start", kind:"primary" }]
        });
      }, 500);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : globalThis);
