#!/usr/bin/env node
/* tests/validate.js — content integrity. No browser.

   Content integrity for every kind the app ships, plus the three rules
   from brief §6.3 that nothing else can catch:
     • every question has a `why`, and every distractor has its own reason
     • every diagram part id in the data exists in the SVG string, and vice
       versa (a typo produces a label that can never be placed, and nothing
       else notices)
     • every short-answer question has at least two criteria and a sample

   Run:  node tests/validate.js
   Prove it fails without its fix:  BREAK=<rule> node tests/validate.js */
"use strict";
const fs = require("fs");
const path = require("path");
const H = require("./harness.js");

const BREAK = process.env.BREAK || "";
const r = H.reporter("validate");
const { ECON } = H.loadData();
const U = ECON.U;

console.log("validate — content integrity");

/* ── fault injection ───────────────────────────────────────────────────
   Addendum §A: prove each check fails without its fix. A BREAK mode that
   merely SKIPS a check proves nothing at all — it passes while testing
   nothing, which is the exact failure the addendum describes. So each mode
   here INJECTS a fault into the loaded data and the run must then fail.

   Run  node tests/prove.js  to check every mode at once.                */
function inject(kind, apply) {
  if (BREAK !== kind) return;
  apply();
  console.log("  [BREAK=" + kind + "] fault injected — this run MUST fail");
}

inject("why", () => {
  const q = H.discover(ECON, H.PATTERNS.mcq)[7];
  delete q.why;
});
inject("distractors", () => {
  const q = H.discover(ECON, H.PATTERNS.mcq)[11];
  delete q.distractors;
});
inject("partid", () => {
  const d = ECON.DATA.diagrams[Object.keys(ECON.DATA.diagrams)[0]];
  d.parts[0].id = d.parts[0].id + "_typo";
});
inject("hotspot", () => {
  const d = ECON.DATA.diagrams[Object.keys(ECON.DATA.diagrams)[1]];
  delete d.parts[1].hx;
});
inject("dupopt", () => {
  const q = H.discover(ECON, H.PATTERNS.mcq)[3];
  q.options[2] = q.options[1];
});
inject("emptybin", () => {
  const s = H.discover(ECON, H.PATTERNS.sort)[0];
  s.bins.push("Never used");
});
inject("swbuild", () => { ECON.State.BUILD = "0.0.0-wrong"; });
inject("lengthbias", () => {
  // reintroduce the defect this suite actually caught: make the correct answer
  // the single longest option in most questions
  H.discover(ECON, H.PATTERNS.mcq).forEach((q, i) => {
    if (i % 3 === 0) return;
    q.options[q.answer] = q.options[q.answer] + ", as set out in the syllabus";
  });
});

/* ── 1. ids are globally unique ────────────────────────────────────── */
const seenIds = new Map();
Object.keys(H.PATTERNS).forEach((kind) => {
  H.discover(ECON, H.PATTERNS[kind]).forEach((item) => {
    if (seenIds.has(item.id)) {
      r.fail("duplicate id " + item.id + " in " + item._src + " and " + seenIds.get(item.id));
    } else seenIds.set(item.id, item._src);
  });
});
Object.keys(ECON.DATA.diagrams || {}).forEach((k) => {
  const d = ECON.DATA.diagrams[k];
  if (d.id !== k) r.fail("diagram key " + k + " does not match its id " + d.id);
});

/* ── 2. multiple choice ────────────────────────────────────────────── */
const mcq = H.discover(ECON, H.PATTERNS.mcq);
r.check(mcq.length > 0, "no multiple-choice questions discovered");
console.log("  " + mcq.length + " multiple-choice questions");

const MODULES = U.MODULES.map((m) => m.id);

mcq.forEach((q) => {
  const tag = q.id;
  r.check(MODULES.indexOf(q.mod) >= 0, tag + ": unknown module " + q.mod);
  r.check(typeof q.q === "string" && q.q.length > 10, tag + ": missing or trivial question text");
  r.check(Array.isArray(q.options) && q.options.length === 4, tag + ": needs exactly 4 options");
  if (!Array.isArray(q.options)) return;

  r.check(typeof q.answer === "number" && q.answer >= 0 && q.answer < q.options.length,
    tag + ": answer index out of range");

  const norm = q.options.map((o) => U.norm(o));
  r.check(new Set(norm).size === q.options.length, tag + ": duplicate options");
  q.options.forEach((o, i) => r.check(String(o).trim().length > 0, tag + ": option " + i + " is empty"));

  // brief §6.2 — every question explains itself
  r.check(typeof q.why === "string" && q.why.length > 20, tag + ": missing or trivial `why`");

  // brief §6.2 — and every distractor says why it is wrong
  const d = q.distractors || {};
  q.options.forEach((_, i) => {
    if (i === q.answer) return;
    const reason = d[i] !== undefined ? d[i] : d[String(i)];
    r.check(typeof reason === "string" && reason.length > 10,
      tag + ": distractor " + i + " has no reason it is wrong");
  });

  r.check(!q.diff || (q.diff >= 1 && q.diff <= 3), tag + ": difficulty must be 1–3");
});

/* ── 3. answer-length bias, PER MODULE (defect D1) ─────────────────────
   A whole-bank average hides one badly authored module, which is exactly how
   an earlier app in this lineage shipped a module where the longest option was the answer
   more than half the time. */
const byMod = {};
mcq.forEach((q) => { (byMod[q.mod] = byMod[q.mod] || []).push(q); });
Object.keys(byMod).sort().forEach((mod) => {
  const list = byMod[mod];
  // "Pick the longest option" only works when there IS a single longest one,
  // so a tie for longest is counted as carrying no signal.
  let longestIsAnswer = 0;
  list.forEach((q) => {
    if (!Array.isArray(q.options)) return;
    const lens = q.options.map((o) => String(o).length);
    const max = Math.max.apply(null, lens);
    if (lens[q.answer] === max && lens.filter((l) => l === max).length === 1) longestIsAnswer++;
  });
  const pct = longestIsAnswer / list.length;
  const limit = 0.36;
  r.check(pct <= limit,
    mod + ": longest option is the answer in " + Math.round(pct * 100) + "% of questions (limit " +
    Math.round(limit * 100) + "%, n=" + list.length + ")");
  console.log("    " + mod + " length bias " + Math.round(pct * 100) + "%  (n=" + list.length + ")");
});

/* ── 4. near-duplicate detection, on BIGRAMS (defect D2) ───────────────
   Unigram overlap passes exact opposites — "increases the rate" and
   "decreases the rate" share every word but one. */
const SIM_LIMIT = 0.82;
for (let i = 0; i < mcq.length; i++) {
  for (let j = i + 1; j < mcq.length; j++) {
    if (mcq[i].mod !== mcq[j].mod) continue;
    const s = U.bigramSim(mcq[i].q, mcq[j].q);
    if (s >= SIM_LIMIT) r.fail("near-duplicate questions " + mcq[i].id + " / " + mcq[j].id + " (bigram sim " + s.toFixed(2) + ")");
    else if (s >= 0.68) r.warn(false, "similar questions " + mcq[i].id + " / " + mcq[j].id + " (" + s.toFixed(2) + ")");
  }
}

/* ── 5. flashcards ─────────────────────────────────────────────────── */
const cards = H.discover(ECON, H.PATTERNS.card);
console.log("  " + cards.length + " flashcards");
r.check(cards.length > 0, "no flashcards discovered");
const frontSeen = new Map();
cards.forEach((c) => {
  r.check(MODULES.indexOf(c.mod) >= 0, c.id + ": unknown module " + c.mod);
  r.check(typeof c.front === "string" && c.front.length > 1, c.id + ": missing front");
  r.check(typeof c.back === "string" && c.back.length > 10, c.id + ": missing or trivial back");
  const key = U.norm(c.front);
  if (frontSeen.has(key)) r.fail("duplicate flashcard front '" + c.front + "' (" + c.id + " and " + frontSeen.get(key) + ")");
  else frontSeen.set(key, c.id);
});

/* ── 6. short answers (brief §6.3) ─────────────────────────────────── */
const shorts = H.discover(ECON, H.PATTERNS.short);
console.log("  " + shorts.length + " short-answer questions");
r.check(shorts.length > 0, "no short-answer questions discovered");
shorts.forEach((q) => {
  const tag = q.id;
  r.check(MODULES.indexOf(q.mod) >= 0, tag + ": unknown module " + q.mod);
  r.check(Array.isArray(q.criteria) && q.criteria.length >= 2,
    tag + ": needs at least 2 marking criteria");
  r.check(typeof q.sample === "string" && q.sample.length > 60, tag + ": missing or trivial sample answer");
  r.check(typeof q.marks === "number" && q.marks >= 2, tag + ": marks must be at least 2");
  if (Array.isArray(q.criteria)) {
    r.check(q.criteria.length >= Math.min(q.marks, 3),
      tag + ": " + q.marks + " marks but only " + q.criteria.length + " criteria");
    q.criteria.forEach((c, i) => r.check(String(c).length > 20, tag + ": criterion " + i + " is too short to mark against"));
  }
  r.warn(Array.isArray(q.common) && q.common.length > 0, tag + ": no `common` misconceptions listed");
  if (q.keys) r.check(q.keys.length <= q.criteria.length, tag + ": more key sets than criteria");
});

/* ── 7. diagrams (brief §6.3) ──────────────────────────────────────── */
const diagrams = Object.keys(ECON.DATA.diagrams || {}).map((k) => ECON.DATA.diagrams[k]);
console.log("  " + diagrams.length + " diagrams");
r.check(diagrams.length > 0, "no diagrams discovered");

diagrams.forEach((d) => {
  const tag = "diagram " + d.id;
  r.check(MODULES.indexOf(d.mod) >= 0, tag + ": unknown module " + d.mod);
  r.check(typeof d.svg === "string" && d.svg.indexOf("<svg") === 0, tag + ": svg must start with <svg");
  r.check(/viewBox='[^']+'|viewBox="[^"]+"/.test(d.svg), tag + ": svg needs a viewBox");
  r.check(!/<svg[^>]*\swidth=/.test(d.svg) && !/<svg[^>]*\sheight=/.test(d.svg),
    tag + ": svg must not carry width/height — CSS sizes it (§3.3)");
  r.check(Array.isArray(d.parts) && d.parts.length >= 3, tag + ": needs at least 3 labellable parts");

  // every id used in the SVG
  const svgIds = new Set();
  const idRe = /\sid='([^']+)'|\sid="([^"]+)"/g;
  let m;
  while ((m = idRe.exec(d.svg))) svgIds.add(m[1] || m[2]);

  (d.parts || []).forEach((p) => {
    const ptag = tag + " part " + p.id;
    // the check the brief singles out: a part id with no element can never be placed
    r.check(svgIds.has(p.id), ptag + ": no element with this id exists in the SVG");
    r.check(typeof p.label === "string" && p.label.length > 1, ptag + ": missing label");
    r.check(typeof p.role === "string" && p.role.length > 10, ptag + ": missing or trivial role");
    r.check(Array.isArray(p.accept) && p.accept.length >= 1, ptag + ": needs at least one accepted name");
    r.check(typeof p.hx === "number" && typeof p.hy === "number",
      ptag + ": needs hx/hy so the 44px hit area can be placed on an awkward shape (§3.3)");
    const vb = /viewBox=['"]([^'"]+)['"]/.exec(d.svg)[1].trim().split(/[\s,]+/).map(Number);
    r.check(p.hx >= vb[0] && p.hx <= vb[0] + vb[2] && p.hy >= vb[1] && p.hy <= vb[1] + vb[3],
      ptag + ": hotspot (" + p.hx + "," + p.hy + ") lies outside the viewBox");
    r.check(p.accept.every((a) => a === U.norm(a)), ptag + ": accepted names must be normalised (lowercase, no punctuation)");
  });

  // and the reverse: labelled parts should not be silently missing
  const partIds = new Set((d.parts || []).map((p) => p.id));
  const labelled = [...svgIds].filter((id) => !partIds.has(id));
  r.warn(labelled.length <= 12, tag + ": " + labelled.length + " SVG ids are not labellable parts (fine, but check none were meant to be)");

  // duplicate labels within a diagram make Label It unsolvable
  const labels = (d.parts || []).map((p) => U.norm(p.label));
  r.check(new Set(labels).size === labels.length, tag + ": two parts share a label, so Label It cannot be solved");

  if (d.sequence) {
    d.sequence.forEach((sid) => r.check(partIds.has(sid), tag + ": sequence references unknown part " + sid));
  }
});

/* ── 8. sequences, sorts, datasets ─────────────────────────────────── */
const seqs = H.discover(ECON, H.PATTERNS.sequence);
console.log("  " + seqs.length + " process sequences");
seqs.forEach((s) => {
  r.check(MODULES.indexOf(s.mod) >= 0, s.id + ": unknown module");
  r.check(Array.isArray(s.steps) && s.steps.length >= 4, s.id + ": needs at least 4 steps");
  r.check(typeof s.why === "string" && s.why.length > 20, s.id + ": missing `why`");
  r.check(new Set(s.steps.map((x) => U.norm(x))).size === s.steps.length, s.id + ": duplicate steps");
});

const sorts = H.discover(ECON, H.PATTERNS.sort);
console.log("  " + sorts.length + " sort sets");
sorts.forEach((s) => {
  r.check(MODULES.indexOf(s.mod) >= 0, s.id + ": unknown module");
  r.check(Array.isArray(s.bins) && s.bins.length >= 2, s.id + ": needs at least 2 bins");
  r.check(Array.isArray(s.items) && s.items.length >= 6, s.id + ": needs at least 6 items");
  r.check(typeof s.why === "string" && s.why.length > 20, s.id + ": missing `why`");
  const used = new Set();
  (s.items || []).forEach((it, i) => {
    r.check(Array.isArray(it) && it.length === 2, s.id + ": item " + i + " must be [text, bin]");
    if (!Array.isArray(it)) return;
    r.check(s.bins.indexOf(it[1]) >= 0, s.id + ": item '" + it[0] + "' has unknown bin '" + it[1] + "'");
    used.add(it[1]);
  });
  // defect C4: a randomly generated board that comes up trivially uniform
  r.check(used.size === s.bins.length, s.id + ": at least one bin has no items — the sort is partly trivial");
  s.bins.forEach((b) => {
    const n = (s.items || []).filter((it) => it[1] === b).length;
    r.check(n >= 2, s.id + ": bin '" + b + "' has only " + n + " item(s)");
  });
});

const datasets = H.discover(ECON, H.PATTERNS.dataset);
console.log("  " + datasets.length + " datasets");
datasets.forEach((d) => {
  r.check(MODULES.indexOf(d.mod) >= 0, d.id + ": unknown module");
  r.check(Array.isArray(d.questions) && d.questions.length >= 2, d.id + ": needs at least 2 questions");
  if (d.kind === "table") {
    r.check(Array.isArray(d.columns) && Array.isArray(d.rows), d.id + ": table needs columns and rows");
    (d.rows || []).forEach((row, i) => r.check(row.length === d.columns.length, d.id + ": row " + i + " has the wrong column count"));
  } else {
    r.check(Array.isArray(d.series) && d.series.length >= 1, d.id + ": chart needs at least one series");
    (d.series || []).forEach((s) => {
      r.check(Array.isArray(s.points) && s.points.length >= 3, d.id + ": series '" + s.name + "' needs at least 3 points");
      (s.points || []).forEach((p) => r.check(Array.isArray(p) && p.length === 2 && p.every((n) => typeof n === "number"),
        d.id + ": bad point in series '" + s.name + "'"));
    });
  }
  (d.questions || []).forEach((q, i) => {
    const tag = d.id + " q" + i;
    r.check(Array.isArray(q.options) && q.options.length === 4, tag + ": needs 4 options");
    r.check(typeof q.answer === "number" && q.answer >= 0 && q.answer < 4, tag + ": bad answer index");
    r.check(typeof q.why === "string" && q.why.length > 20, tag + ": missing `why`");
    const dd = q.distractors || {};
    (q.options || []).forEach((_, k) => {
      if (k === q.answer) return;
      const reason = dd[k] !== undefined ? dd[k] : dd[String(k)];
      r.check(typeof reason === "string" && reason.length > 10, tag + ": distractor " + k + " has no reason");
    });
  });
});

/* ── 9. coverage packs (brief §8) ──────────────────────────────────────
   A typo hides nothing and is invisible from inside the app: the toggle still
   appears, still flips, and simply does nothing. */
const packs = ECON.DATA.packs || [];
console.log("  " + packs.length + " coverage packs");
r.check(packs.length > 0, "no coverage packs declared");

const allItems = []
  .concat(...Object.keys(H.PATTERNS).map((k) => H.discover(ECON, H.PATTERNS[k])))
  .concat(diagrams);
const allTopics = new Set(allItems.map((i) => i.topic).filter(Boolean));
const allTags = new Set();
allItems.forEach((i) => (i.tags || []).forEach((t) => allTags.add(t)));
const allIds = new Set(allItems.map((i) => i.id));

const packIds = new Set();
packs.forEach((p) => {
  r.check(!packIds.has(p.id), "duplicate pack id " + p.id);
  packIds.add(p.id);
  r.check(typeof p.name === "string" && p.name.length > 2, p.id + ": missing name");
  r.check(p.modules || p.topics || p.tags || p.ids, p.id + ": pack claims nothing at all");

  (p.modules || []).forEach((m) => r.check(MODULES.indexOf(m) >= 0, "pack " + p.id + ": unknown module " + m));
  (p.tags || []).forEach((t) => {
    r.check(allTags.has(t), "pack " + p.id + ": tag '" + t + "' is on no content — the toggle would do nothing");
  });
  (p.topics || []).forEach((t) => r.check(allTopics.has(t),
    "pack " + p.id + ": topic '" + t + "' is on no content — the toggle would do nothing"));
  (p.ids || []).forEach((i) => r.check(allIds.has(i), "pack " + p.id + ": id '" + i + "' does not exist"));

  // and it must actually remove something
  const claims = allItems.filter((it) => {
    if (p.modules && it.mod && p.modules.indexOf(it.mod) >= 0 && !p.topics) return true;
    if (p.topics && it.topic && p.topics.indexOf(it.topic) >= 0) return !p.modules || p.modules.indexOf(it.mod) >= 0;
    if (p.ids && p.ids.indexOf(it.id) >= 0) return true;
    if (p.tags && it.tags) return p.tags.some((t) => it.tags.indexOf(t) >= 0);
    return false;
  }).length;
  r.check(claims > 0, "pack " + p.id + ": removes nothing at all");
});

/* ── 10. achievements and shop ─────────────────────────────────────── */
const achIds = new Set();
(ECON.DATA.achievements || []).forEach((a) => {
  r.check(!achIds.has(a.id), "duplicate achievement id " + a.id);
  achIds.add(a.id);
  r.check(a.name && a.desc && a.icon, a.id + ": achievement needs name, desc and icon");
});
(ECON.DATA.shop.themes || []).forEach((t) => r.check(typeof t.cost === "number" && t.cost >= 0, "theme " + t.id + ": bad cost"));
(ECON.DATA.shop.tickets || []).forEach((t) => r.check(t.cost > 0 && t.minutes > 0, "ticket " + t.id + ": bad cost or duration"));

/* ── 11. glossary ──────────────────────────────────────────────────── */
const gTerms = new Set();
(ECON.DATA.glossary || []).forEach((g) => {
  r.check(!gTerms.has(U.norm(g.term)), "duplicate glossary term " + g.term);
  gTerms.add(U.norm(g.term));
  r.check(MODULES.indexOf(g.mod) >= 0, "glossary '" + g.term + "': unknown module " + g.mod);
  r.check(g.def && g.def.length > 20, "glossary '" + g.term + "': definition too short");
});
console.log("  " + (ECON.DATA.glossary || []).length + " glossary terms");

/* ── 12. the service worker precache (defect E1) ───────────────────────
   A shipped file that is not precached will 404 for an offline user, and a
   BUILD that has not been bumped means the fix never reaches an installed
   phone. Both are silent. */
const sw = fs.readFileSync(path.join(H.ROOT, "sw.js"), "utf8");
const swBuild = /var BUILD = "([^"]+)"/.exec(sw);
r.check(!!swBuild, "sw.js: cannot find BUILD");
if (swBuild) {
  r.check(swBuild[1] === ECON.State.BUILD,
    "sw.js BUILD (" + swBuild[1] + ") does not match State.BUILD (" + ECON.State.BUILD + ") — a fix would never reach an installed phone (defect E1)");
}
const precache = new Set();
const preRe = /"([^"]+\.(?:js|css|html|svg|webmanifest))"/g;
let pm;
const preBlock = sw.slice(sw.indexOf("var PRECACHE"), sw.indexOf("self.addEventListener"));
while ((pm = preRe.exec(preBlock))) precache.add(pm[1]);

const shipped = [];
(function walk(dir, rel) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    if (e.name === "node_modules" || e.name === ".git" || e.name === "tests" || e.name === "docs") return;
    const full = path.join(dir, e.name);
    const r2 = rel ? rel + "/" + e.name : e.name;
    if (e.isDirectory()) walk(full, r2);
    else if (/\.(js|css|html|webmanifest)$/.test(e.name) && r2 !== "sw.js") shipped.push(r2);
  });
})(H.ROOT, "");

shipped.forEach((f) => {
  r.check(precache.has(f), "sw.js: " + f + " is shipped but not in PRECACHE — offline users would 404 on it (defect E1)");
});

const indexScripts = H.readIndexScripts();
indexScripts.forEach((s) => r.check(fs.existsSync(path.join(H.ROOT, s)), "index.html loads " + s + " which does not exist"));
shipped.filter((f) => f.startsWith("js/")).forEach((f) => {
  r.check(indexScripts.indexOf(f) >= 0, f + " exists but index.html never loads it");
});

/* ── 13. volume report (informational, and honest about the gap) ───── */
console.log("\n  volume against the brief's §6.1 targets:");
const targets = [
  ["Multiple choice", mcq.length, 1000],
  ["Short answer", shorts.length, 150],
  ["Diagrams", diagrams.length, 35],
  ["Flashcards", cards.length, 400],
  ["Calculation templates", (ECON.DATA.calc_core || []).length, 12]
];
targets.forEach(([name, have, want]) => {
  const pct = Math.round((have / want) * 100);
  console.log("    " + name.padEnd(20) + String(have).padStart(5) + " / " + String(want).padStart(5) +
              "   " + pct + "%" + (have >= want ? "  ✓" : ""));
  r.warn(have >= want, name + " is at " + have + " against a target of " + want);
});

r.done();
