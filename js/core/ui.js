/* Equilibrium — js/core/ui.js
   Hash router, modals, toasts, gameShell, and award() — the ONLY path to XP
   or currency in the whole app. (brief §2, convention 1)
   Exposes: window.ECON.UI */
(function (root) {
  "use strict";

  var ECON = root.ECON = root.ECON || {};
  var U = ECON.U, S = ECON.State;
  var UI = {};

  UI.routes = {};
  UI._current = null;
  UI._teardown = null;
  UI._stack = [];

  /* ── routing ─────────────────────────────────────────────────────── */
  UI.route = function (path, fn) { UI.routes[path] = fn; };

  UI.go = function (hash, replace) {
    var h = hash.charAt(0) === "#" ? hash : "#" + hash;
    if (replace && root.history && root.history.replaceState) {
      root.history.replaceState(null, "", h);
      UI.render();
    } else {
      root.location.hash = h;
    }
  };

  UI.back = function () {
    if (UI._stack.length > 1) { UI._stack.pop(); root.history.back(); }
    else UI.go("/home");
  };

  UI.parseHash = function () {
    var raw = (root.location.hash || "#/home").replace(/^#/, "");
    var qi = raw.indexOf("?");
    var path = qi >= 0 ? raw.slice(0, qi) : raw;
    var query = {};
    if (qi >= 0) raw.slice(qi + 1).split("&").forEach(function (kv) {
      if (!kv) return;
      var p = kv.split("=");
      query[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " "));
    });
    var parts = path.split("/").filter(Boolean);
    return { path: "/" + parts.join("/"), parts: parts, query: query };
  };

  UI.render = function () {
    var r = UI.parseHash();
    var view = U.$("#view");

    if (typeof UI._teardown === "function") { try { UI._teardown(); } catch (e) { console.error(e); } }
    UI._teardown = null;
    if (ECON.Tools) ECON.Tools.detach();
    UI.closeModal(true);

    U.clear(view);
    view.classList.remove("no-tabs");
    view.scrollTop = 0;
    root.scrollTo(0, 0);

    var key = "/" + (r.parts[0] || "home");
    var fn = UI.routes[r.path] || UI.routes[key] || UI.routes["/home"];
    UI._current = r;
    try {
      var td = fn(view, r);
      if (typeof td === "function") UI._teardown = td;
    } catch (e) {
      console.error("route error", r.path, e);
      view.appendChild(U.el("div", { class: "card" }, [
        U.el("h2", { text: "Something went wrong" }),
        U.el("p", { class: "muted small", text: String(e && e.message || e) }),
        U.el("button", { class: "btn btn-primary", onclick: function () { UI.go("/home"); } }, "Back to Play")
      ]));
    }

    // tab bar highlighting
    U.$$("#tabbar a").forEach(function (a) {
      a.classList.toggle("on", a.dataset.tab === (r.parts[0] || "home"));
    });
    U.$("#btnBack").hidden = (r.parts[0] || "home") === "home";
    UI.syncChrome();
    view.focus({ preventScroll: true });
  };

  UI.hideTabs = function (hide) {
    U.$("#tabbar").hidden = !!hide;
    U.$("#view").classList.toggle("no-tabs", !!hide);
  };

  /* ── chrome ──────────────────────────────────────────────────────── */
  UI.syncChrome = function () {
    var d = S.data;
    var lv = S.levelFromXp(d.xp);
    U.$("#chipLv").textContent = "Lv " + lv.level;
    U.$("#chipXp").textContent = U.fmtInt(d.xp) + " XP";
    U.$("#chipCoin").textContent = "◉ " + U.fmtInt(d.coins);
    var pctv = lv.need ? Math.min(100, (lv.into / lv.need) * 100) : 100;
    U.$("#xpbarFill").style.width = pctv + "%";
    document.documentElement.dataset.theme = d.theme === "ledger" ? "" : d.theme;
    if (d.theme === "ledger") delete document.documentElement.dataset.theme;
  };

  /* ── toasts ──────────────────────────────────────────────────────── */
  UI.toast = function (msg, kind, ms) {
    var rootEl = U.$("#toastRoot");
    var t = U.el("div", { class: "toast" + (kind ? " " + kind : ""), text: msg });
    rootEl.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .25s";
      t.style.opacity = "0";
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
    }, ms || 1800);
  };

  /* ── modals ──────────────────────────────────────────────────────── */
  UI.modal = function (opts) {
    var rootEl = U.$("#modalRoot");
    U.clear(rootEl);
    rootEl.hidden = false;

    var box = U.el("div", { class: "modal", role: "dialog", "aria-modal": "true" });
    if (opts.title) box.appendChild(U.el("h2", { text: opts.title }));
    if (opts.body) box.appendChild(typeof opts.body === "string" ? U.el("p", { text: opts.body }) : opts.body);
    if (opts.actions && opts.actions.length) {
      var row = U.el("div", { class: "row", style: "margin-top:14px" });
      opts.actions.forEach(function (a) {
        row.appendChild(U.el("button", {
          class: "btn " + (a.kind ? "btn-" + a.kind : "") + (opts.actions.length <= 2 ? " grow" : ""),
          onclick: function () { if (!a.keepOpen) UI.closeModal(); if (a.onclick) a.onclick(); }
        }, a.label));
      });
      box.appendChild(row);
    }
    if (!opts.noClose) {
      box.appendChild(U.el("button", { class: "btn btn-ghost btn-sm modal-x", "aria-label": "Close", onclick: function () { UI.closeModal(); } }, "✕"));
    }

    var bg = U.el("div", { class: "modal-bg", onclick: function () { if (!opts.noClose) UI.closeModal(); } });
    rootEl.appendChild(bg);
    rootEl.appendChild(box);
    UI._modalOnClose = opts.onClose || null;
    return box;
  };

  UI.closeModal = function (silent) {
    var rootEl = U.$("#modalRoot");
    if (rootEl.hidden) return;
    rootEl.hidden = true;
    U.clear(rootEl);
    var cb = UI._modalOnClose; UI._modalOnClose = null;
    if (cb && !silent) cb();
  };

  UI.confirm = function (title, body, onYes, yesLabel) {
    UI.modal({
      title: title, body: body,
      actions: [
        { label: "Cancel", kind: "ghost" },
        { label: yesLabel || "Confirm", kind: "primary", onclick: onYes }
      ]
    });
  };

  /* ═══════════════════════════════════════════════════════════════════
     award() — the single reward path.

     Every mode calls this and nothing else touches XP or coins. That is what
     makes "the arcade pays nothing" and "the reference costs 25%" structural
     facts rather than promises (brief §2).

     opts:
       xp        raw XP earned by play (before the reference penalty)
       bonus     completion bonus — withheld entirely below 50% accuracy
       accuracy  0..1
       coins     override; default = applied value × COIN_RATE
       mode      mode id, for bests/achievements
       silent    don't toast
     ═══════════════════════════════════════════════════════════════════ */
  UI._awardLog = [];   // exploit.js / honest.js read this

  UI.award = function (opts) {
    opts = opts || {};
    var acc = (typeof opts.accuracy === "number") ? U.clamp(opts.accuracy, 0, 1) : null;
    var base = Math.max(0, Math.round(opts.xp || 0));
    var bonus = Math.max(0, Math.round(opts.bonus || 0));

    // completion bonus withheld entirely below 50% accuracy (brief §9)
    var bonusApplied = (acc !== null && acc < S.MIN_ACC_BONUS) ? 0 : bonus;

    // …and withheld when the run was answered faster than it can be read.
    // Without this a bot that taps through instantly still collects the bonus
    // on a lucky run, which is a completion-bonus-shaped score floor (C1).
    // tests/exploit.js caught exactly that.
    var readRatio = (typeof opts.readRatio === "number") ? opts.readRatio : null;
    if (readRatio !== null && readRatio < 0.5) bonusApplied = 0;

    var bonusWithheld = bonus - bonusApplied;

    var gross = base + bonusApplied;

    // reference latch: opening the glossary during a scored run costs 25%.
    // The latch is set by Tools and only cleared when a run starts, so
    // switching it off cannot refund the penalty (defect C3).
    var refPenalty = 0;
    if (ECON.Tools && ECON.Tools.refLatched() && gross > 0) {
      refPenalty = Math.round(gross * S.REFERENCE_PENALTY);
      gross -= refPenalty;
    }

    /* Difficulty and the Multiplier power-up. THE RULE: a multiplier
       MULTIPLIES. It never adds a flat amount and it never applies a floor,
       so a run that earned nothing is still worth nothing however many
       power-ups were spent on it. That is the one property that keeps
       "the bad bot earns 0 XP" true once the shop sells advantages, and
       tests/exploit.js re-runs its whole sweep with a full inventory and the
       multiplier active to prove it. S.runMultiplier clamps the value, so a
       typo in a data file cannot break the economy either. */
    var mult = (typeof opts.multiplier === "number")
      ? Math.max(1, Math.min(S.MAX_MULTIPLIER, opts.multiplier))
      : 1;
    var preMult = gross;
    gross = Math.round(gross * mult);
    var multBonus = gross - preMult;

    var coins = (typeof opts.coins === "number") ? Math.max(0, Math.round(opts.coins))
                                                 : Math.round(gross * S.COIN_RATE);

    var before = S.levelFromXp(S.data.xp).level;
    S.data.xp += gross;
    S.data.coins += coins;
    var after = S.levelFromXp(S.data.xp).level;

    if (opts.mode) {
      S.data.runs = (S.data.runs || 0) + 1;
      if (typeof opts.score === "number") {
        var b = S.data.bests[opts.mode] || 0;
        if (opts.score > b) S.data.bests[opts.mode] = opts.score;
      }
    }

    S.touchDay();
    S.saveSoon();
    UI.syncChrome();

    var rec = {
      t: Date.now(), mode: opts.mode || null, base: base, bonus: bonusApplied,
      bonusWithheld: bonusWithheld, refPenalty: refPenalty, xp: gross, coins: coins,
      multiplier: mult, multBonus: multBonus,
      accuracy: acc, readRatio: readRatio
    };
    UI._awardLog.push(rec);
    if (UI._awardLog.length > 400) UI._awardLog.shift();

    if (!opts.silent && (gross > 0 || coins > 0)) {
      UI.toast("+" + U.fmtInt(gross) + " XP  ·  +" + U.fmtInt(coins) + " ◉", "good");
    }
    if (after > before) {
      setTimeout(function () {
        UI.modal({
          title: "Level " + after,
          body: U.el("div", {}, [
            U.el("p", { class: "muted", text: "Nice work. Next level needs " + U.fmtInt(S.levelFromXp(S.data.xp).need) + " XP." }),
            after >= 5 ? U.el("p", { class: "small muted2", text: "Credits unlock arcade tickets and themes in the Shop." }) : null
          ]),
          actions: [{ label: "Keep going", kind: "primary" }]
        });
      }, 400);
    }

    if (ECON.Achievements) ECON.Achievements.check(rec);
    return rec;
  };

  /* Read-only preview of what a run is currently worth, for honest headers. */
  UI.previewPenalty = function () {
    return (ECON.Tools && ECON.Tools.refLatched()) ? S.REFERENCE_PENALTY : 0;
  };

  /* ═══════════════════════════════════════════════════════════════════
     gameShell — the common frame for every mode.
     ═══════════════════════════════════════════════════════════════════ */
  UI.gameShell = function (view, cfg) {
    UI.hideTabs(true);

    var head = U.el("div", { class: "gs-head" });
    var titleRow = U.el("div", { class: "spread" }, [
      U.el("div", {}, [
        U.el("div", { style: "font-weight:800;font-size:15px", text: cfg.title }),
        cfg.sub ? U.el("div", { class: "muted2", text: cfg.sub }) : null
      ]),
      U.el("button", { class: "btn btn-ghost btn-sm", onclick: function () { UI.quitGuard(cfg); } }, "Quit")
    ]);
    var meters = U.el("div", { class: "gs-meters", style: "margin-top:8px" });
    var prog = U.el("div", { class: "gs-prog" }, [U.el("i")]);
    head.appendChild(titleRow);
    head.appendChild(meters);
    if (cfg.progress !== false) head.appendChild(prog);

    var body = U.el("div", { class: "gs-body" });
    view.appendChild(head);
    view.appendChild(body);

    var api = {
      head: head, body: body, meters: meters,
      setMeters: function (items) {
        U.clear(meters);
        items.forEach(function (m) {
          if (!m) return;
          meters.appendChild(U.el("span", { class: "gs-meter" + (m.hot ? " hot" : ""), text: m.text }));
        });
        if (ECON.Tools && ECON.Tools.refLatched()) {
          meters.appendChild(U.el("span", { class: "gs-meter", style: "color:var(--warn);border-color:var(--warn)", text: "Reference −25%" }));
        }
      },
      setProgress: function (f) { prog.firstChild.style.width = U.clamp(f, 0, 1) * 100 + "%"; },
      clear: function () { U.clear(body); return body; }
    };
    return api;
  };

  UI.quitGuard = function (cfg) {
    if (cfg && cfg.onQuit) {
      UI.confirm("Quit this run?", "Progress in this run is not saved and it pays nothing.", function () {
        cfg.onQuit();
      }, "Quit");
    } else {
      UI.go("/home");
    }
  };

  /* ── results screen ─────────────────────────────────────────────────
     H1: never open a results overlay over an explanation the student is
     reading. Results are a full screen reached by a button, with a way back
     to the last explanation. */
  UI.results = function (view, cfg) {
    U.clear(view);
    UI.hideTabs(false);
    if (ECON.Tools) ECON.Tools.detach();

    var acc = cfg.total ? cfg.correct / cfg.total : 0;
    var card = U.el("div", { class: "card center" }, [
      U.el("div", { style: "font-size:34px", text: acc >= 0.9 ? "🏅" : acc >= 0.6 ? "🌿" : "🔬" }),
      U.el("h1", { text: cfg.title || "Run complete", style: "margin:6px 0 2px" }),
      U.el("div", { class: "muted", text: cfg.subtitle || (cfg.correct + " / " + cfg.total + " correct · " + Math.round(acc * 100) + "%") })
    ]);

    var stats = U.el("div", { class: "list", style: "margin-top:12px" });
    (cfg.rows || []).forEach(function (r) {
      stats.appendChild(U.el("div", { class: "li" }, [
        U.el("div", { class: "grow", text: r[0] }),
        U.el("b", { text: r[1], style: "text-align:right" })
      ]));
    });
    card.appendChild(stats);

    view.appendChild(card);

    if (cfg.review && cfg.review.length) {
      view.appendChild(U.el("h2", { text: "Review" }));
      cfg.review.forEach(function (r) {
        var c = U.el("div", { class: "card card-tight" }, [
          U.el("div", { class: "spread" }, [
            U.el("span", { class: "badge " + (r.ok ? "badge-good" : "badge-bad"), text: r.ok ? "Right" : "Missed" }),
            U.el("span", { class: "badge", text: r.mod || "" })
          ]),
          U.el("div", { style: "margin-top:6px;font-weight:600;font-size:14.5px", text: r.q }),
          r.a ? U.el("div", { class: "small muted", style: "margin-top:4px", text: "Answer: " + r.a }) : null,
          r.why ? U.el("div", { class: "small muted2", style: "margin-top:4px", text: r.why }) : null
        ]);
        view.appendChild(c);
      });
    }

    var row = U.el("div", { class: "row", style: "margin-top:14px" });
    if (cfg.again) row.appendChild(U.el("button", { class: "btn btn-primary grow", onclick: cfg.again }, "Play again"));
    row.appendChild(U.el("button", { class: "btn grow", onclick: function () { UI.go("/home"); } }, "Home"));
    view.appendChild(row);
  };

  /* ── shared question renderer (MCQ) ─────────────────────────────── */
  UI.renderMCQ = function (host, q, onAnswer, opts) {
    opts = opts || {};
    U.clear(host);
    var answered = false;

    var meta = U.el("div", { class: "qmeta" }, [
      U.el("span", { class: "badge badge-accent", text: q.mod }),
      q.topic ? U.el("span", { class: "badge", text: U.trunc(q.topic, 28) }) : null,
      q.diff ? U.el("span", { class: "badge", text: "×" + q.diff }) : null
    ]);
    host.appendChild(meta);
    if (q.stem) host.appendChild(U.el("div", { class: "card card-tight small muted", html: q.stem }));
    host.appendChild(U.el("div", { class: "qtext", text: q.q }));
    if (q.figure && ECON.Diagram) host.appendChild(ECON.Diagram.staticFigure(q.figure));

    var order = opts.order || U.shuffle(q.options.map(function (_, i) { return i; }));
    var box = U.el("div", { class: "opts" });
    var btns = [];

    order.forEach(function (oi, n) {
      var b = U.el("button", { class: "opt", type: "button" }, [
        U.el("span", { class: "k", text: "ABCD".charAt(n) }),
        U.el("span", { class: "grow", text: q.options[oi] })
      ]);
      b.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        var ok = oi === q.answer;
        btns.forEach(function (bb, j) {
          bb.disabled = true;
          if (order[j] === q.answer) bb.classList.add("right");
          else if (bb === b) bb.classList.add("wrong");
          else bb.classList.add("dim");
        });
        host.appendChild(explain(q, ok, oi));
        if (onAnswer) onAnswer(ok, oi, q);
      });
      btns.push(b);
      box.appendChild(b);
    });
    host.appendChild(box);
    return { buttons: btns, order: order };
  };

  function explain(q, ok, chosen) {
    var w = U.el("div", { class: "why " + (ok ? "ok" : "no") });
    w.appendChild(U.el("div", { class: "why-h", text: ok ? "Correct" : "Not quite" }));
    w.appendChild(U.el("div", { text: q.why || q.options[q.answer] }));
    if (!ok && q.distractors && q.distractors[chosen]) {
      w.appendChild(U.el("div", { class: "misc", text: "Why your option is wrong: " + q.distractors[chosen] }));
    }
    if (!ok && q.misconception) {
      w.appendChild(U.el("div", { class: "misc", text: "Common trap: " + q.misconception }));
    }
    return w;
  }
  UI.explain = explain;

  /* ── streak helper shared by timed modes ─────────────────────────── */
  UI.streakBadge = function (streak) {
    var m = S.streakMult(streak);
    return "×" + (m % 1 ? m.toFixed(1) : m);
  };

  ECON.UI = UI;
})(typeof window !== "undefined" ? window : globalThis);
