#!/usr/bin/env node
/* tests/tools.js — the tool tray (brief §7.3).

   Two fixes an earlier app in this lineage paid for, measured rather than trusted:
     • the tray DOCKS, and the view reserves the space it covers, so the
       question, the answer box and the submit button all sit clear of it
     • the calculator keypad never focuses the display, because focusing a
       text input is what makes a phone open its keyboard over the calculator

   Plus the pricing rules: the reference latches on opening and is withheld
   entirely from Term Match and Label It. */
"use strict";
const B = require("./browser.js");

(async () => {
  const r = B.reporter("tools");
  const rig = await B.launch({ width: 360 });
  const { page } = rig;

  console.log("tools — tray geometry, keypad focus and reference pricing");

  await B.goto(page, "/play/drill?mod=P3");
  await page.waitForTimeout(300);

  // ── the tray is attached and docked to the bottom
  const docked = await page.evaluate(() => {
    const tray = document.querySelector("#toolTray");
    if (!tray) return null;
    const t = tray.getBoundingClientRect();
    return { bottom: t.bottom, top: t.top, innerH: window.innerHeight, pos: getComputedStyle(tray).position };
  });
  r.check(!!docked, "no tool tray attached during a scored run");
  if (docked) {
    r.check(docked.pos === "fixed", "the tray is " + docked.pos + ", not fixed — it must dock rather than float");
    r.check(Math.abs(docked.bottom - docked.innerH) < 2, "the tray does not sit flush with the bottom of the viewport");
  }

  // ── open the calculator, then measure what it covers
  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll(".tray-tab")];
    const calc = tabs.find((b) => /calculator/i.test(b.textContent));
    if (calc) calc.click();
  });
  await page.waitForTimeout(250);

  const clearance = await page.evaluate(() => {
    const tray = document.querySelector("#toolTray");
    const trayTop = tray.getBoundingClientRect().top;
    const trayVar = getComputedStyle(document.documentElement).getPropertyValue("--tray-h").trim();
    const targets = [];
    const q = document.querySelector(".qtext");
    if (q) targets.push({ what: "question", rect: q.getBoundingClientRect() });
    document.querySelectorAll(".opt").forEach((o, i) => targets.push({ what: "option " + i, rect: o.getBoundingClientRect() }));
    const view = document.querySelector("#view");
    return {
      trayTop, trayVar,
      viewPadBottom: getComputedStyle(view).paddingBottom,
      covered: targets.filter((t) => t.rect.bottom > trayTop + 1 && t.rect.top < trayTop).map((t) => t.what),
      docScroll: document.documentElement.scrollHeight,
      docClient: document.documentElement.clientHeight
    };
  });

  r.check(clearance.trayVar !== "0px" && clearance.trayVar !== "",
    "--tray-h is '" + clearance.trayVar + "' — the tray must publish its height so the view can reserve the space");
  r.check(parseFloat(clearance.viewPadBottom) >= parseFloat(clearance.trayVar),
    "the view reserves " + clearance.viewPadBottom + " at the bottom but the tray is " + clearance.trayVar + " tall");

  // scroll to the end and confirm nothing is stranded under the tray
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(200);
  const stranded = await page.evaluate(() => {
    const trayTop = document.querySelector("#toolTray").getBoundingClientRect().top;
    const out = [];
    document.querySelectorAll(".opt, .qtext, .gs-body .btn-primary").forEach((el, i) => {
      const rr = el.getBoundingClientRect();
      if (rr.top >= trayTop) out.push(el.className + "#" + i);
    });
    return out;
  });
  r.check(stranded.length === 0, "after scrolling to the end, these sit under the tray: " + stranded.join(", "));

  // ── the keypad must never focus the display (the keyboard-over-calculator bug)
  const focusBehaviour = await page.evaluate(async () => {
    const disp = document.querySelector(".calc-disp");
    if (!disp) return { error: "no calculator display" };
    const before = document.activeElement === disp;
    const keys = [...document.querySelectorAll(".calc-keys button")];
    const focused = [];
    for (const k of keys.slice(0, 12)) {
      k.click();
      if (document.activeElement === disp) focused.push(k.textContent);
    }
    return {
      before,
      focused,
      inputmode: disp.getAttribute("inputmode"),
      readonly: disp.hasAttribute("readonly"),
      tabindex: disp.getAttribute("tabindex"),
      value: disp.value
    };
  });
  r.check(!focusBehaviour.error, focusBehaviour.error || "");
  if (!focusBehaviour.error) {
    r.check(focusBehaviour.focused.length === 0,
      "these calculator keys focused the display, which opens the phone keyboard over it: " + focusBehaviour.focused.join(" "));
    r.check(focusBehaviour.inputmode === "none", "the calculator display has inputmode='" + focusBehaviour.inputmode + "', not 'none'");
    r.check(focusBehaviour.readonly, "the calculator display is not readonly");
    r.check(focusBehaviour.tabindex === "-1", "the calculator display is still in the tab order");
  }

  // ── the calculator actually computes, without eval()
  const maths = await page.evaluate(() => {
    const T = window.ECON.Tools;
    return {
      a: T.evaluate("40/2000"),
      b: T.evaluate("(6*4)/8"),
      c: T.evaluate("50%"),
      d: T.evaluate("1/0"),
      e: T.evaluate("2+3*4"),
      f: T.evaluate("bad input")
    };
  });
  r.check(Math.abs(maths.a - 0.02) < 1e-9, "calculator: 40/2000 gave " + maths.a);
  r.check(maths.b === 3, "calculator: (6*4)/8 gave " + maths.b);
  r.check(Math.abs(maths.c - 0.5) < 1e-9, "calculator: 50% gave " + maths.c);
  r.check(maths.d === null, "calculator: division by zero should refuse, gave " + maths.d);
  r.check(maths.e === 14, "calculator: 2+3*4 gave " + maths.e + " — operator precedence is wrong");
  r.check(maths.f === null, "calculator: garbage input should refuse, gave " + maths.f);

  const usesEval = await page.evaluate(() => {
    return /[^a-zA-Z]eval\s*\(|new Function\s*\(/.test(window.ECON.Tools.evaluate.toString());
  });
  r.check(!usesEval, "the calculator uses eval() or Function() — it should be a hand-written parser");

  // ── the reference is priced and latches (C3)
  await B.goto(page, "/play/drill?mod=P3");
  await page.waitForTimeout(250);
  const latch = await page.evaluate(async () => {
    window.ECON.State.data.settings.refAck = true;
    const before = window.ECON.Tools.refLatched();
    const ref = [...document.querySelectorAll(".tray-tab")].find((b) => /reference/i.test(b.textContent));
    if (ref) ref.click();
    await new Promise((r2) => setTimeout(r2, 120));
    window.ECON.UI.closeModal();
    const during = window.ECON.Tools.refLatched();
    const hide = [...document.querySelectorAll(".tray-tab")].find((b) => b.textContent === "▾");
    if (hide) hide.click();
    return { before, during, after: window.ECON.Tools.refLatched() };
  });
  r.check(latch.before === false, "the reference latch was already set at the start of a run");
  r.check(latch.during === true, "opening the reference did not latch the penalty");
  r.check(latch.after === true, "closing the reference cleared the penalty (defect C3)");

  // the penalty is at least 20%: the economics exam supplies no formula sheet, so
  const penalty = await page.evaluate(() => window.ECON.State.REFERENCE_PENALTY);
  r.check(penalty >= 0.2, "the reference penalty is only " + (penalty * 100) + "% — the economics exam supplies no formula sheet, so it must be at least 20%");

  // ── withheld entirely from Term Match and Label It
  for (const mode of ["termmatch", "labelit"]) {
    await B.goto(page, "/play/" + mode);
    await page.waitForTimeout(300);
    const state = await page.evaluate((m) => {
      const allowed = window.ECON.Tools.referenceAllowed(m);
      const tab = [...document.querySelectorAll(".tray-tab")].find((b) => /reference/i.test(b.textContent));
      let latchedAfterClick = null;
      if (tab) {
        tab.click();
        latchedAfterClick = window.ECON.Tools.refLatched();
        window.ECON.UI.closeModal();
      }
      return { allowed, label: tab ? tab.textContent : null, latchedAfterClick };
    }, mode);
    r.check(state.allowed === false, mode + ": the reference is still allowed, but it is the answer key there (§7.3)");
    r.check(state.latchedAfterClick === false, mode + ": clicking the reference tab latched a penalty instead of refusing");
    r.check(/✕/.test(state.label || ""), mode + ": the reference tab does not show that it is unavailable");
  }

  const errs = rig.errors.filter((e) => !/favicon|manifest/i.test(e));
  r.check(errs.length === 0, "console errors — " + errs.slice(0, 3).join(" | "));

  await r.done(rig);
})();
