/* Loads the app's browser data files into Node so the no-browser tests can
   read them. Nothing here is shipped. */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

function readIndexScripts() {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const out = [];
  const re = /<script src="([^"]+)"><\/script>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

/* Load util, state, econcalc, mark and every js/data file. UI-dependent
   modules are skipped — they need a DOM. */
function loadData() {
  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    localStorage: {
      _d: {},
      getItem(k) { return this._d[k] === undefined ? null : this._d[k]; },
      setItem(k, v) { this._d[k] = String(v); },
      removeItem(k) { delete this._d[k]; }
    }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  const load = (rel) => {
    const p = path.join(ROOT, rel);
    const code = fs.readFileSync(p, "utf8");
    try {
      vm.runInContext(code, sandbox, { filename: rel });
    } catch (e) {
      throw new Error("failed to load " + rel + ": " + e.message);
    }
  };

  load("js/core/util.js");
  load("js/core/state.js");
  load("js/core/econcalc.js");
  load("js/core/mark.js");

  const scripts = readIndexScripts().filter((s) => s.startsWith("js/data/"));
  scripts.forEach(load);

  return { ECON: sandbox.ECON, scripts, sandbox };
}

/* A minimal stand-in for Bank.all(), using the same discovery rule as
   js/core/bank.js so the tests exercise the same convention. */
function discover(ECON, re) {
  const out = [];
  Object.keys(ECON.DATA).sort().forEach((key) => {
    if (!re.test(key)) return;
    const v = ECON.DATA[key];
    if (!Array.isArray(v)) return;
    v.forEach((item, i) => {
      item._src = key;
      if (!item.id) item.id = key + "-" + i;
      out.push(item);
    });
  });
  return out;
}

const PATTERNS = {
  mcq: /^mcq_/,
  card: /^cards_/,
  short: /^short_/,
  sequence: /^seq_/,
  sort: /^sort_/,
  dataset: /^data_/,
  calc: /^calc_/,
  shift: /^shift_/
};

/* Tiny assertion recorder shared by every test script. */
function reporter(name) {
  const fails = [];
  const warns = [];
  let checks = 0;
  return {
    check(cond, msg) {
      checks++;
      if (!cond) fails.push(msg);
      return !!cond;
    },
    warn(cond, msg) { if (!cond) warns.push(msg); },
    fail(msg) { checks++; fails.push(msg); },
    done() {
      const pad = (s) => String(s);
      if (warns.length) {
        console.log("\n  " + warns.length + " warning" + (warns.length === 1 ? "" : "s") + ":");
        warns.slice(0, 25).forEach((w) => console.log("    ~ " + pad(w)));
        if (warns.length > 25) console.log("    … " + (warns.length - 25) + " more");
      }
      if (fails.length) {
        console.log("\n  " + fails.length + " FAILURE" + (fails.length === 1 ? "" : "S") + ":");
        fails.slice(0, 60).forEach((f) => console.log("    ✗ " + pad(f)));
        if (fails.length > 60) console.log("    … " + (fails.length - 60) + " more");
        console.log("\n" + name + ": FAIL  (" + checks + " checks)\n");
        process.exit(1);
      }
      console.log("\n" + name + ": PASS  (" + checks + " checks)\n");
    },
    get failures() { return fails; },
    get warnings() { return warns; }
  };
}

module.exports = { ROOT, loadData, discover, PATTERNS, readIndexScripts, reporter };
