/* Equilibrium — the exactly-checkable calculation engine.

   This is the economics counterpart of a genetics engine: a place where the
   app can generate an unlimited number of questions and still be certain the
   answer it shows is right.

   THE RULE, and it is not negotiable: every quantity this file reports is
   computed TWICE, by two routes that do not share intermediate values, and
   the two are compared before anything reaches the screen. If they disagree
   the question is discarded rather than shown. Floating point means "agree"
   has to mean "agree to a relative tolerance", not "are identical bits" —
   see EPS below.

   Why bother, when the formulas are one-liners? Because the failure mode of
   a study app is not a crash, it is a plausible wrong answer that a student
   memorises. A single-route calculation has nothing to disagree with.

   tests/calc.js runs every template over hundreds of seeds and asserts the
   two routes agree, and asserts that the distractors are never equal to the
   correct answer after rounding — a distractor that rounds onto the answer
   is a question with two correct options. */

(function (root) {
  "use strict";
  var ECON = root.ECON = root.ECON || {};
  var C = {};

  /* Relative tolerance for "the two routes agree". 1e-9 is far tighter than
     any rounding the app displays (2 decimal places at most) and far looser
     than the ~1e-16 noise of double arithmetic over a handful of operations. */
  C.EPS = 1e-9;

  C.agree = function (a, b) {
    if (!isFinite(a) || !isFinite(b)) return false;
    var scale = Math.max(1, Math.abs(a), Math.abs(b));
    return Math.abs(a - b) / scale < C.EPS;
  };

  C.round = function (x, dp) {
    var f = Math.pow(10, dp === undefined ? 2 : dp);
    // +Number.EPSILON nudge stops 1.005 rounding down through binary
    // representation; the values here are small enough for that to be safe.
    return Math.round((x + Number.EPSILON * Math.sign(x)) * f) / f;
  };

  /* Deterministic PRNG so a seed reproduces a question exactly. Tests rely on
     this: a failure can be reproduced from the seed printed in the message. */
  C.rng = function (seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;  s >>>= 0;
      return s / 4294967296;
    };
  };
  function pickInt(rnd, lo, hi, step) {
    step = step || 1;
    var n = Math.floor((hi - lo) / step) + 1;
    return lo + step * Math.floor(rnd() * n);
  }

  /* ── the kinds ──────────────────────────────────────────────────────

     Each kind supplies:
       gen(rnd)        → the numbers for one question
       routeA(v)       → the answer, computed one way
       routeB(v)       → the same answer, computed a genuinely different way
       unit, dp        → how to display it
       ask(v)          → the question text
       context(v)      → the scenario sentence
       wrong(v, ans)   → [{value, why}] common-error distractors

     "Genuinely different" means the two routes must not share a subexpression
     that could itself be wrong. Computing x/y twice is not two routes.       */

  var KINDS = {};

  /* Price elasticity of demand, midpoint (arc) method — the one the syllabus
     asks for, because it gives the same answer in both directions. */
  KINDS.ped = {
    label: "Price elasticity of demand",
    gen: function (rnd) {
      var p1 = pickInt(rnd, 4, 40), q1 = pickInt(rnd, 100, 900, 10);
      var pd = pickInt(rnd, 1, 8), qd = pickInt(rnd, 20, 200, 10);
      var up = rnd() < 0.5;
      return { p1: p1, p2: up ? p1 + pd : p1 - Math.min(pd, p1 - 2),
               q1: q1, q2: up ? q1 - Math.min(qd, q1 - 40) : q1 + qd };
    },
    // Route A: percentage changes first, then divide.
    routeA: function (v) {
      var pctQ = (v.q2 - v.q1) / ((v.q1 + v.q2) / 2) * 100;
      var pctP = (v.p2 - v.p1) / ((v.p1 + v.p2) / 2) * 100;
      return pctQ / pctP;
    },
    // Route B: the algebraically rearranged slope form. Shares no intermediate.
    routeB: function (v) {
      return ((v.q2 - v.q1) / (v.p2 - v.p1)) * ((v.p1 + v.p2) / (v.q1 + v.q2));
    },
    dp: 2, unit: "",
    context: function (v) {
      return "The price of a good changes from $" + v.p1 + " to $" + v.p2 +
             ". Quantity demanded changes from " + v.q1 + " to " + v.q2 + " units per week.";
    },
    ask: function () { return "Using the midpoint method, what is the price elasticity of demand?"; },
    wrong: function (v, ans) {
      var pctQ = (v.q2 - v.q1) / v.q1 * 100, pctP = (v.p2 - v.p1) / v.p1 * 100;
      return [
        { value: pctQ / pctP, why: "This uses the original values as the base instead of the midpoint, so it gives a different answer depending on which direction the price moved." },
        { value: -ans, why: "The sign is reversed. Demand elasticity is negative because price and quantity move in opposite directions." },
        { value: 1 / ans, why: "This inverts the ratio — it divides the price change by the quantity change instead of the other way round." }
      ];
    }
  };

  /* Price elasticity of supply, same method, positive by construction. */
  KINDS.pes = {
    label: "Price elasticity of supply",
    gen: function (rnd) {
      var p1 = pickInt(rnd, 5, 40), q1 = pickInt(rnd, 100, 800, 10);
      return { p1: p1, p2: p1 + pickInt(rnd, 2, 10), q1: q1, q2: q1 + pickInt(rnd, 20, 300, 10) };
    },
    routeA: function (v) {
      var pctQ = (v.q2 - v.q1) / ((v.q1 + v.q2) / 2) * 100;
      var pctP = (v.p2 - v.p1) / ((v.p1 + v.p2) / 2) * 100;
      return pctQ / pctP;
    },
    routeB: function (v) {
      return ((v.q2 - v.q1) / (v.p2 - v.p1)) * ((v.p1 + v.p2) / (v.q1 + v.q2));
    },
    dp: 2, unit: "",
    context: function (v) {
      return "Price rises from $" + v.p1 + " to $" + v.p2 + " and the quantity supplied rises from " +
             v.q1 + " to " + v.q2 + " units.";
    },
    ask: function () { return "Using the midpoint method, what is the price elasticity of supply?"; },
    wrong: function (v, ans) {
      return [
        { value: (v.q2 - v.q1) / v.q1 * 100 / ((v.p2 - v.p1) / v.p1 * 100), why: "This uses the original values as the base rather than the midpoint." },
        { value: -ans, why: "Supply elasticity is positive: price and quantity supplied move in the same direction." },
        { value: 1 / ans, why: "The ratio is inverted — percentage change in price has been divided by percentage change in quantity." }
      ];
    }
  };

  /* Income elasticity of demand — sign carries the meaning here. */
  KINDS.yed = {
    label: "Income elasticity of demand",
    gen: function (rnd) {
      var y1 = pickInt(rnd, 40, 90) * 1000, q1 = pickInt(rnd, 100, 600, 10);
      var inferior = rnd() < 0.35;
      return { y1: y1, y2: y1 + pickInt(rnd, 2, 12) * 1000,
               q1: q1, q2: inferior ? q1 - pickInt(rnd, 10, 60, 5) : q1 + pickInt(rnd, 10, 180, 5) };
    },
    routeA: function (v) {
      var pctQ = (v.q2 - v.q1) / ((v.q1 + v.q2) / 2) * 100;
      var pctY = (v.y2 - v.y1) / ((v.y1 + v.y2) / 2) * 100;
      return pctQ / pctY;
    },
    routeB: function (v) {
      return ((v.q2 - v.q1) / (v.y2 - v.y1)) * ((v.y1 + v.y2) / (v.q1 + v.q2));
    },
    dp: 2, unit: "",
    context: function (v) {
      return "Average income rises from $" + v.y1.toLocaleString("en-AU") + " to $" + v.y2.toLocaleString("en-AU") +
             " and quantity demanded moves from " + v.q1 + " to " + v.q2 + " units.";
    },
    ask: function () { return "Using the midpoint method, what is the income elasticity of demand?"; },
    wrong: function (v, ans) {
      return [
        { value: -ans, why: "The sign is what classifies the good: positive means normal, negative means inferior. Reversing it reverses the conclusion." },
        { value: ans * 2, why: "This looks like a percentage change taken over the original base and then doubled — check which base the midpoint method uses." },
        { value: 1 / ans, why: "The ratio is the wrong way up: quantity change goes on top, income change on the bottom." }
      ];
    }
  };

  /* The expenditure (Keynesian) multiplier. */
  KINDS.multiplier = {
    label: "The multiplier",
    gen: function (rnd) {
      var mpc = pickInt(rnd, 50, 90, 5) / 100;
      return { mpc: mpc, inject: pickInt(rnd, 2, 20) * 100 };
    },
    // Route A: the closed form 1/(1 - MPC).
    routeA: function (v) { return 1 / (1 - v.mpc); },
    // Route B: sum the geometric series term by term until the terms vanish.
    // No shared subexpression with route A beyond mpc itself.
    routeB: function (v) {
      var sum = 0, term = 1, n = 0;
      while (term > 1e-15 && n < 20000) { sum += term; term *= v.mpc; n++; }
      return sum;
    },
    dp: 2, unit: "",
    context: function (v) {
      return "In a simple economy the marginal propensity to consume is " + v.mpc.toFixed(2) + ".";
    },
    ask: function () { return "What is the value of the multiplier?"; },
    wrong: function (v) {
      return [
        { value: 1 / v.mpc, why: "This divides by the MPC rather than by the marginal propensity to SAVE. The multiplier is 1 ÷ (1 − MPC)." },
        { value: v.mpc / (1 - v.mpc), why: "This is the ratio of consumption to saving, not the multiplier." },
        { value: 1 + v.mpc, why: "This adds one round of spending only. The multiplier counts every subsequent round as well." }
      ];
    }
  };

  /* Inflation from a CPI series. */
  KINDS.inflation = {
    label: "Inflation rate from CPI",
    gen: function (rnd) {
      var c1 = pickInt(rnd, 900, 1300) / 10;
      return { c1: c1, c2: C.round(c1 * (1 + pickInt(rnd, -20, 90) / 1000), 1) };
    },
    routeA: function (v) { return (v.c2 - v.c1) / v.c1 * 100; },
    routeB: function (v) { return (v.c2 / v.c1 - 1) * 100; },
    dp: 2, unit: "%",
    context: function (v) {
      return "The Consumer Price Index moves from " + v.c1.toFixed(1) + " to " + v.c2.toFixed(1) + " over one year.";
    },
    ask: function () { return "What is the inflation rate over that year?"; },
    wrong: function (v, ans) {
      return [
        { value: v.c2 - v.c1, why: "This is the change in index points, not a percentage. An index point is not a per cent." },
        { value: (v.c2 - v.c1) / v.c2 * 100, why: "This divides by the NEW index rather than the original. Percentage change always uses the starting value as the base." },
        { value: -ans, why: "The direction is reversed — check which figure is the earlier one." }
      ];
    }
  };

  /* Unemployment rate. The trap is the denominator. */
  KINDS.unemployment = {
    label: "Unemployment rate",
    gen: function (rnd) {
      var emp = pickInt(rnd, 90, 140) * 100000;
      return { emp: emp, unemp: pickInt(rnd, 4, 12) * 100000,
               notInLF: pickInt(rnd, 50, 80) * 100000 };
    },
    routeA: function (v) { return v.unemp / (v.emp + v.unemp) * 100; },
    routeB: function (v) { return (1 - v.emp / (v.emp + v.unemp)) * 100; },
    dp: 2, unit: "%",
    context: function (v) {
      return "There are " + fmtM(v.emp) + " employed, " + fmtM(v.unemp) + " unemployed, and " +
             fmtM(v.notInLF) + " of working age who are not in the labour force.";
    },
    ask: function () { return "What is the unemployment rate?"; },
    wrong: function (v) {
      return [
        { value: v.unemp / (v.emp + v.unemp + v.notInLF) * 100, why: "This divides by the whole working-age population. The unemployment rate uses the labour force, which excludes people not looking for work." },
        { value: v.unemp / v.emp * 100, why: "This divides the unemployed by the EMPLOYED rather than by the labour force." },
        { value: (v.emp + v.unemp) / (v.emp + v.unemp + v.notInLF) * 100, why: "This is the participation rate, not the unemployment rate." }
      ];
    }
  };

  /* Participation rate — deliberately shares its scenario shape with the
     unemployment kind, because confusing the two is the standard error. */
  KINDS.participation = {
    label: "Participation rate",
    gen: KINDS.unemployment.gen,
    routeA: function (v) { return (v.emp + v.unemp) / (v.emp + v.unemp + v.notInLF) * 100; },
    routeB: function (v) { return 100 - v.notInLF / (v.emp + v.unemp + v.notInLF) * 100; },
    dp: 2, unit: "%",
    context: KINDS.unemployment.context,
    ask: function () { return "What is the labour force participation rate?"; },
    wrong: function (v) {
      return [
        { value: v.unemp / (v.emp + v.unemp) * 100, why: "This is the unemployment rate. Participation asks what share of the working-age population is IN the labour force." },
        { value: v.emp / (v.emp + v.unemp + v.notInLF) * 100, why: "This counts only the employed. The labour force includes the unemployed, who are actively looking." },
        { value: v.notInLF / (v.emp + v.unemp + v.notInLF) * 100, why: "This is the share NOT participating — the complement of the answer." }
      ];
    }
  };

  /* Terms of trade index. */
  KINDS.tot = {
    label: "Terms of trade",
    gen: function (rnd) {
      return { x1: pickInt(rnd, 90, 130), m1: pickInt(rnd, 90, 130),
               x2: pickInt(rnd, 90, 150), m2: pickInt(rnd, 90, 130) };
    },
    routeA: function (v) { return v.x2 / v.m2 * 100; },
    routeB: function (v) { return 100 / (v.m2 / v.x2); },
    dp: 2, unit: "",
    context: function (v) {
      return "In the current year the export price index is " + v.x2 + " and the import price index is " + v.m2 + ".";
    },
    ask: function () { return "What is the terms of trade index?"; },
    wrong: function (v) {
      return [
        { value: v.m2 / v.x2 * 100, why: "The ratio is inverted. The terms of trade puts EXPORT prices on top — it measures what a unit of exports buys." },
        { value: v.x2 - v.m2, why: "This is the difference between two index numbers, which has no meaning as a ratio index." },
        { value: (v.x2 + v.m2) / 2, why: "This averages the two indices rather than dividing one by the other." }
      ];
    }
  };

  /* Exchange rate conversion, both directions. */
  KINDS.fx = {
    label: "Exchange rate conversion",
    gen: function (rnd) {
      return { rate: pickInt(rnd, 55, 95) / 100, amount: pickInt(rnd, 2, 40) * 500,
               toAud: rnd() < 0.5 };
    },
    routeA: function (v) { return v.toAud ? v.amount / v.rate : v.amount * v.rate; },
    routeB: function (v) { return v.toAud ? v.amount * (1 / v.rate) : v.amount / (1 / v.rate); },
    dp: 2, unit: "",
    context: function (v) {
      return "The exchange rate is A$1 = US$" + v.rate.toFixed(2) + ".";
    },
    ask: function (v) {
      return v.toAud
        ? "How many Australian dollars are needed to buy US$" + v.amount.toLocaleString("en-AU") + "?"
        : "How many US dollars will A$" + v.amount.toLocaleString("en-AU") + " buy?";
    },
    wrong: function (v) {
      return [
        { value: v.toAud ? v.amount * v.rate : v.amount / v.rate, why: "This multiplies where it should divide. Check which currency the quoted rate is expressed in." },
        { value: v.amount, why: "This leaves the amount unconverted, which would only be right if the rate were exactly one." },
        { value: v.toAud ? v.amount / (v.rate * v.rate) : v.amount * v.rate * v.rate, why: "The conversion has been applied twice." }
      ];
    }
  };

  /* Real GDP growth from nominal growth and the deflator. */
  KINDS.realgrowth = {
    label: "Real growth",
    gen: function (rnd) {
      return { g1: pickInt(rnd, 400, 900) * 1000, g2p: pickInt(rnd, -20, 80) / 10 };
    },
    routeA: function (v) { return v.g1 * (1 + v.g2p / 100); },
    routeB: function (v) { return v.g1 + v.g1 * v.g2p / 100; },
    dp: 0, unit: "$m",
    context: function (v) {
      return "Real GDP is $" + v.g1.toLocaleString("en-AU") + " million and grows by " + v.g2p.toFixed(1) + "% over the year.";
    },
    ask: function () { return "What is real GDP at the end of the year, in $ million?"; },
    wrong: function (v) {
      return [
        { value: v.g1 * (1 - v.g2p / 100), why: "The growth rate has been subtracted rather than added." },
        { value: v.g1 + v.g2p, why: "The percentage has been added as though it were a dollar amount." },
        { value: v.g1 * v.g2p / 100, why: "This is the increase alone, not the new level." }
      ];
    }
  };

  /* Budget outcome, with the sign convention that trips students up. */
  KINDS.budget = {
    label: "Budget outcome",
    gen: function (rnd) {
      return { rev: pickInt(rnd, 400, 700) * 1000, exp: pickInt(rnd, 400, 700) * 1000 };
    },
    routeA: function (v) { return v.rev - v.exp; },
    routeB: function (v) { return -(v.exp - v.rev); },
    dp: 0, unit: "$m",
    context: function (v) {
      return "Government revenue is $" + v.rev.toLocaleString("en-AU") + " million and government expenditure is $" +
             v.exp.toLocaleString("en-AU") + " million.";
    },
    ask: function () { return "What is the budget outcome, in $ million? A negative figure is a deficit."; },
    wrong: function (v) {
      return [
        { value: v.exp - v.rev, why: "The sign is reversed. A surplus is revenue above expenditure, so revenue comes first." },
        { value: v.rev + v.exp, why: "The two figures have been added instead of subtracted." },
        { value: (v.rev - v.exp) / 2, why: "There is no reason to halve the difference." }
      ];
    }
  };

  /* Real interest rate — the approximation the syllabus uses. */
  KINDS.realrate = {
    label: "Real interest rate",
    gen: function (rnd) {
      return { nominal: pickInt(rnd, 20, 90) / 10, inflation: pickInt(rnd, 5, 70) / 10 };
    },
    routeA: function (v) { return v.nominal - v.inflation; },
    routeB: function (v) { return -(v.inflation - v.nominal); },
    dp: 2, unit: "%",
    context: function (v) {
      return "The nominal interest rate is " + v.nominal.toFixed(1) + "% and the inflation rate is " + v.inflation.toFixed(1) + "%.";
    },
    ask: function () { return "What is the approximate real interest rate?"; },
    wrong: function (v) {
      return [
        { value: v.nominal + v.inflation, why: "Inflation erodes the return, so it is subtracted from the nominal rate, not added." },
        { value: v.inflation - v.nominal, why: "The subtraction is the wrong way round." },
        { value: v.nominal * v.inflation / 100, why: "This multiplies the two rates, which is not what the real rate means." }
      ];
    }
  };

  /* Balance on goods and services. */
  KINDS.bogs = {
    label: "Balance on goods and services",
    gen: function (rnd) {
      return { x: pickInt(rnd, 60, 120) * 1000, m: pickInt(rnd, 60, 120) * 1000 };
    },
    routeA: function (v) { return v.x - v.m; },
    routeB: function (v) { return -(v.m - v.x); },
    dp: 0, unit: "$m",
    context: function (v) {
      return "Exports of goods and services are $" + v.x.toLocaleString("en-AU") +
             " million and imports are $" + v.m.toLocaleString("en-AU") + " million.";
    },
    ask: function () { return "What is the balance on goods and services, in $ million?"; },
    wrong: function (v) {
      return [
        { value: v.m - v.x, why: "The sign is reversed. Exports are a credit, so they come first." },
        { value: v.x + v.m, why: "This is the total value of trade, not the balance." },
        { value: v.x / v.m * 100, why: "This is a ratio, not a balance in dollars." }
      ];
    }
  };

  /* Total revenue and the elasticity link that makes it interesting. */
  KINDS.totalrevenue = {
    label: "Total revenue",
    gen: function (rnd) {
      var p1 = pickInt(rnd, 5, 30), q1 = pickInt(rnd, 100, 900, 10);
      return { p1: p1, q1: q1, p2: p1 + pickInt(rnd, 1, 6), q2: q1 - pickInt(rnd, 20, 200, 10) };
    },
    routeA: function (v) { return v.p2 * v.q2 - v.p1 * v.q1; },
    routeB: function (v) { return -(v.p1 * v.q1 - v.p2 * v.q2); },
    dp: 0, unit: "$",
    context: function (v) {
      return "A firm raises its price from $" + v.p1 + " to $" + v.p2 +
             ". Quantity sold falls from " + v.q1 + " to " + v.q2 + " units.";
    },
    ask: function () { return "By how much does total revenue change, in dollars?"; },
    wrong: function (v) {
      return [
        { value: v.p1 * v.q1 - v.p2 * v.q2, why: "The sign is reversed — this is the old revenue minus the new." },
        { value: (v.p2 - v.p1) * (v.q2 - v.q1), why: "Multiplying the two changes together is not the change in revenue." },
        { value: (v.p2 - v.p1) * v.q1, why: "This assumes quantity is unchanged, which is exactly what the price rise altered." }
      ];
    }
  };

  function fmtM(n) { return (n / 1000000).toFixed(1) + " million"; }

  C.KINDS = KINDS;
  C.kindIds = Object.keys(KINDS);

  /* ── the public surface ──────────────────────────────────────────── */

  /* Returns null when the two routes agree, or a description of the
     disagreement. Callers MUST treat a non-null return as "do not show". */
  C.verify = function (kindId, v) {
    var k = KINDS[kindId];
    if (!k) return { error: "unknown kind " + kindId };
    var a, b;
    try { a = k.routeA(v); b = k.routeB(v); }
    catch (e) { return { error: String(e) }; }
    if (!isFinite(a)) return { error: "route A is not finite", a: a };
    if (!C.agree(a, b)) return { a: a, b: b, error: "routes disagree" };
    return null;
  };

  /* Build one complete question. Returns null if verification fails or if a
     distractor collides with the answer after rounding — both are reasons to
     discard the seed and try another, never to show it anyway. */
  C.build = function (kindId, seed) {
    var k = KINDS[kindId];
    if (!k) return null;
    var rnd = C.rng(seed);
    var v = k.gen(rnd);

    if (C.verify(kindId, v)) return null;

    var raw = k.routeA(v);
    var dp = k.dp;
    var ans = C.round(raw, dp);

    var opts = [{ value: ans, correct: true }];
    var seen = {}; seen[ans.toFixed(dp)] = true;
    var candidates = k.wrong(v, raw) || [];
    for (var i = 0; i < candidates.length && opts.length < 4; i++) {
      var c = candidates[i];
      if (!isFinite(c.value)) continue;
      var r = C.round(c.value, dp);
      var key = r.toFixed(dp);
      // A distractor that rounds onto the answer would make two options right.
      if (seen[key]) continue;
      seen[key] = true;
      opts.push({ value: r, why: c.why });
    }
    if (opts.length < 4) return null;

    return {
      kind: kindId,
      label: k.label,
      values: v,
      context: k.context(v),
      ask: k.ask(v),
      answer: ans,
      dp: dp,
      unit: k.unit || "",
      options: opts,
      seed: seed
    };
  };

  /* Try seeds until one builds. Bounded, so a broken kind fails loudly in a
     test rather than hanging the UI. */
  C.buildAny = function (kindId, seed) {
    for (var i = 0; i < 200; i++) {
      var q = C.build(kindId, (seed + i * 7919) >>> 0 || 1);
      if (q) return q;
    }
    return null;
  };

  C.format = function (value, dp, unit) {
    var s = Math.abs(value) >= 1000 && dp === 0
      ? Math.round(value).toLocaleString("en-AU")
      : value.toFixed(dp);
    if (unit === "%") return s + "%";
    if (unit === "$") return "$" + s;
    if (unit === "$m") return "$" + s + "m";
    return s;
  };

  /* ── the four-case market outcome table ─────────────────────────────

     Curve shifts are the other place this app can be confidently exact, so
     the outcome is DERIVED here rather than written out beside each scenario.
     An author supplies only the shock, which curve moves and which way; the
     effect on equilibrium price and quantity follows from the geometry and
     cannot drift out of step with the scenario.

     demand  right → P up,   Q up
     demand  left  → P down, Q down
     supply  right → P down, Q up
     supply  left  → P up,   Q down                                        */

  C.shiftOutcome = function (curve, direction) {
    if (curve !== "demand" && curve !== "supply") return null;
    if (direction !== "right" && direction !== "left") return null;
    var demand = curve === "demand", right = direction === "right";
    return {
      price:    demand === right ? "rises" : "falls",
      quantity: right ? "rises" : "falls",
      // Spelled out because "increase in demand" and "increase in quantity
      // demanded" are different things and the distinction is examinable.
      movementNote: demand
        ? "The demand curve itself moves, and the change in quantity is a movement along the supply curve."
        : "The supply curve itself moves, and the change in quantity is a movement along the demand curve."
    };
  };

  ECON.Calc = C;
  if (typeof module !== "undefined" && module.exports) module.exports = C;
})(typeof window !== "undefined" ? window : globalThis);
