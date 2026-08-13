#!/usr/bin/env node
/* tests/calc.js — the calculation engine, checked hard.

   js/core/econcalc.js promises three things. This file tries to break each:

   1. Every answer is computed by two independent routes that agree. Run each
      kind over hundreds of seeds and assert agreement on all of them, not on
      a sample — a formula that is wrong for one sign of the input is exactly
      the bug a sample misses.

   2. No distractor collides with the correct answer after rounding. A
      question with two correct options is worse than a missing question,
      and rounding is where collisions actually happen: two values that
      differ in the fourth decimal are the same option on screen.

   3. Market shift outcomes come from the four-case table, not from an
      author's memory. Assert the table itself against the geometry.

   Run:  node tests/calc.js
   Prove it fails without its fix:  BREAK=routeb node tests/calc.js       */
"use strict";
const H = require("./harness.js");

const BREAK = process.env.BREAK || "";
const r = H.reporter("calc");
const { ECON } = H.loadData();
const C = ECON.Calc;

console.log("calc — two-route verification over every kind");

/* ── fault injection ───────────────────────────────────────────────────
   Each mode injects a REAL fault. A mode that merely skipped a check would
   pass while testing nothing, which proves the opposite of what is wanted. */

if (BREAK === "routeb") {
  // Break the second route of one kind. The agreement check must catch it.
  const k = C.KINDS.ped;
  const realB = k.routeB;
  k.routeB = function (v) { return realB(v) * 1.02; };
}

if (BREAK === "collide") {
  // Make a distractor land exactly on the answer. The collision check must
  // catch it — on screen this is a question with two right answers.
  const k = C.KINDS.inflation;
  k.wrong = function (v) {
    const a = k.routeA(v);
    return [{ value: a, why: "collides with the answer" },
            { value: a + 1, why: "one point higher" },
            { value: a + 2, why: "two points higher" }];
  };
}

if (BREAK === "shiftrule") {
  // Corrupt the outcome table so demand-right reports a falling price.
  const real = C.shiftOutcome;
  C.shiftOutcome = function (curve, direction) {
    const out = real(curve, direction);
    if (out && curve === "demand" && direction === "right") out.price = "falls";
    return out;
  };
}

/* ── 1. the two routes agree, on every kind, over many seeds ────────── */
const SEEDS = 400;
C.kindIds.forEach((id) => {
  const k = C.KINDS[id];
  let disagreements = 0, firstBad = null;
  for (let s = 1; s <= SEEDS; s++) {
    const rnd = C.rng(s * 2654435761 % 2147483647 || 1);
    const v = k.gen(rnd);
    const bad = C.verify(id, v);
    if (bad) { disagreements++; if (!firstBad) firstBad = { seed: s, v: v, bad: bad }; }
  }
  r.check(disagreements === 0,
    id + ": routes disagreed on " + disagreements + "/" + SEEDS + " seeds" +
    (firstBad ? " (first at seed " + firstBad.seed + ": A=" + firstBad.bad.a + " B=" + firstBad.bad.b + ")" : ""));
});

/* ── 2. every built question is well formed ─────────────────────────── */
C.kindIds.forEach((id) => {
  let built = 0, collisions = 0, shortOpts = 0, missingWhy = 0, nonFinite = 0;
  for (let s = 1; s <= 150; s++) {
    const q = C.build(id, (s * 97 + 1) >>> 0);
    if (!q) continue;               // discarded by design; counted below
    built++;
    if (q.options.length !== 4) shortOpts++;
    const seen = {};
    q.options.forEach((o) => {
      if (!isFinite(o.value)) nonFinite++;
      const key = o.value.toFixed(q.dp);
      if (seen[key]) collisions++;
      seen[key] = true;
      if (!o.correct && (typeof o.why !== "string" || o.why.length < 15)) missingWhy++;
    });
  }
  r.check(built > 0, id + ": no seed produced a question at all");
  r.check(collisions === 0, id + ": " + collisions + " distractors collided with another option after rounding");
  r.check(shortOpts === 0, id + ": " + shortOpts + " questions had other than 4 options");
  r.check(nonFinite === 0, id + ": " + nonFinite + " non-finite option values reached a built question");
  r.check(missingWhy === 0, id + ": " + missingWhy + " distractors had no usable reason");
  // buildAny must never return null for a healthy kind, or the mode loops
  r.check(C.buildAny(id, 12345) !== null, id + ": buildAny failed after 200 attempts");
});

/* ── 3. the answer really is the answer ─────────────────────────────── */
/* Independent spot checks with hand-computed values. If someone "simplifies"
   a formula, these fail even if both routes are changed together. */
const SPOT = [
  { kind:"multiplier", v:{ mpc:0.8 }, expect:5 },
  { kind:"multiplier", v:{ mpc:0.75 }, expect:4 },
  { kind:"inflation",  v:{ c1:100, c2:103 }, expect:3 },
  { kind:"unemployment", v:{ emp:9500000, unemp:500000, notInLF:4000000 }, expect:5 },
  { kind:"participation", v:{ emp:9500000, unemp:500000, notInLF:5000000 }, expect:(10/15)*100 },
  { kind:"tot", v:{ x2:120, m2:96 }, expect:125 },
  { kind:"realrate", v:{ nominal:6, inflation:2 }, expect:4 },
  { kind:"budget", v:{ rev:500000, exp:530000 }, expect:-30000 },
  { kind:"bogs", v:{ x:100000, m:112000 }, expect:-12000 },
  // PED, midpoint: price 10→12, quantity 100→80.
  // %ΔQ = -20/90 = -22.22%, %ΔP = 2/11 = 18.18%, so PED = -1.2222
  { kind:"ped", v:{ p1:10, p2:12, q1:100, q2:80 }, expect:(-20/90)/(2/11) }
];
SPOT.forEach((t) => {
  const got = C.KINDS[t.kind].routeA(t.v);
  r.check(C.agree(got, t.expect),
    t.kind + ": hand-checked value " + t.expect + " but engine gave " + got);
});

/* ── 4. the market shift table matches the geometry ─────────────────── */
/* Written out here independently of the engine. If someone edits the table
   in econcalc.js, this disagrees. */
const EXPECTED = [
  ["demand", "right", "rises", "rises"],
  ["demand", "left",  "falls", "falls"],
  ["supply", "right", "falls", "rises"],
  ["supply", "left",  "rises", "falls"]
];
EXPECTED.forEach((row) => {
  const out = C.shiftOutcome(row[0], row[1]);
  r.check(!!out, row[0] + "/" + row[1] + ": shiftOutcome returned nothing");
  if (!out) return;
  r.check(out.price === row[2], row[0] + " " + row[1] + ": price should " + row[2] + ", table says " + out.price);
  r.check(out.quantity === row[3], row[0] + " " + row[1] + ": quantity should " + row[3] + ", table says " + out.quantity);
});
r.check(C.shiftOutcome("demand", "sideways") === null, "an invalid direction must return null, not a guess");
r.check(C.shiftOutcome("price", "right") === null, "an invalid curve must return null, not a guess");

/* ── 5. every authored scenario resolves, and none hard-codes an outcome */
const shifts = H.discover(ECON, H.PATTERNS.shift);
r.check(shifts.length > 0, "no shift scenarios discovered");
shifts.forEach((s) => {
  r.check(C.shiftOutcome(s.curve, s.direction) !== null,
    s.id + ": curve/direction '" + s.curve + "/" + s.direction + "' is not a valid combination");
  // §the whole point: an authored outcome can go stale, a derived one cannot
  r.check(s.price === undefined && s.quantity === undefined,
    s.id + ": hard-codes an outcome. Remove it — the outcome is derived from curve and direction.");
  r.check(typeof s.why === "string" && s.why.length > 30, s.id + ": needs a real explanation");
  r.check(typeof s.shock === "string" && s.shock.length > 20, s.id + ": needs a scenario");
});

/* ── 6. every calc template points at a kind that exists ────────────── */
const templates = ECON.DATA.calc_core || [];
r.check(templates.length > 0, "no calculation templates discovered");
templates.forEach((t) => {
  r.check(!!C.KINDS[t.kind], t.id + ": references unknown engine kind '" + t.kind + "'");
  r.check(typeof t.note === "string" && t.note.length > 20, t.id + ": needs a note explaining the result");
});
// and the reverse: a kind nobody references is dead code
const used = new Set(templates.map((t) => t.kind));
C.kindIds.forEach((id) => r.warn(used.has(id), "engine kind '" + id + "' is not used by any template"));

r.done();
