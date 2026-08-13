/* Shared Playwright harness. Serves the app from disk over http so the
   service worker can register, and collects console errors. */
"use strict";
const path = require("path");
const http = require("http");
const fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

function serve(port, opts) {
  opts = opts || {};
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    if (opts.block && opts.block(p)) { res.writeHead(503); res.end("blocked"); return; }
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end("not found"); return;
    }
    const ext = path.extname(file);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

async function launch(opts) {
  opts = opts || {};
  const port = opts.port || (9000 + Math.floor(Math.random() * 900));
  const server = await serve(port, opts);
  const browser = await chromium.launch({
    executablePath: opts.executablePath || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  const context = await browser.newContext({
    viewport: { width: opts.width || 360, height: opts.height || 740 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

  const base = "http://127.0.0.1:" + port + "/index.html";
  await page.goto(base, { waitUntil: "load" });
  await page.waitForFunction(() => window.ECON && window.ECON.UI && window.ECON.Run);
  await dismissModal(page);

  return {
    page, browser, context, base, errors, port,
    async close() { await browser.close(); await new Promise((r) => server.close(r)); }
  };
}

async function dismissModal(page) {
  await page.waitForTimeout(700);
  const root = await page.$("#modalRoot:not([hidden])");
  if (root) {
    const btn = await page.$("#modalRoot .btn-primary");
    if (btn) await btn.click();
    else await page.evaluate(() => window.ECON.UI.closeModal());
  }
}

async function goto(page, hash) {
  await page.evaluate((h) => { window.ECON.UI.go(h); }, hash);
  /* Wait for the view to actually have content rather than for a fixed
     interval. A flat timeout made the first navigation of a run flaky —
     the render can land a few milliseconds late on a cold page, and a
     suite that fails intermittently teaches you to ignore it. Screens that
     legitimately render nothing (there are none today) still fall through
     after the timeout, so this cannot hide a real regression. */
  await page.waitForFunction(() => {
    const v = document.querySelector("#view");
    return v && v.children.length > 0;
  }, null, { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(180);
}

/* Overlap check.

   Horizontal overflow catches content that spills past the viewport. It does
   NOT catch content that collides with a sibling inside the viewport, which
   is how the top bar shipped with the stat chips painted over the brand name:
   nothing overflowed the document, the grid tracks simply overlapped.

   So: for every row-like container, compare the bounding boxes of its
   visible direct children and report any pair that intersects by more than a
   couple of pixels. Deliberately narrow — it only looks at containers that
   are supposed to lay children out side by side, because a badge absolutely
   positioned over a card is legitimate and common. */
async function overlaps(page) {
  return page.evaluate(() => {
    const ROWS = [".topbar", ".tb-stats", ".gs-meters", ".spread", ".row", ".seg", ".li", ".powerbar", ".tabbar"];
    const out = [];
    const seen = new Set();
    const name = (e) => e.tagName.toLowerCase() +
      (e.id ? "#" + e.id : "") +
      (typeof e.className === "string" && e.className ? "." + e.className.trim().split(/\s+/)[0] : "");

    document.querySelectorAll(ROWS.join(",")).forEach((row) => {
      const kids = [...row.children].filter((k) => {
        const cs = getComputedStyle(k);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "absolute") return false;
        const r = k.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      for (let i = 0; i < kids.length; i++) {
        for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i].getBoundingClientRect();
          const b = kids[j].getBoundingClientRect();
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 2 && oy > 2) {
            const key = name(row) + ">" + name(kids[i]) + "|" + name(kids[j]);
            if (seen.has(key)) continue;
            seen.add(key);
            out.push(name(kids[i]) + " overlaps " + name(kids[j]) +
                     " by " + Math.round(ox) + "x" + Math.round(oy) + "px inside " + name(row));
          }
        }
      }
    });
    return out;
  });
}

/* Squeezed-text check.

   The sibling of the overlap check, and the one that actually caught the top
   bar. An element with overflow:hidden that has been compressed to a small
   fraction of the text it contains is not "truncated gracefully" — it is
   gone. A chip losing its last few characters to an ellipsis is fine; a
   nine-character brand name rendered in 28px is a layout failure.

   The thresholds are deliberately generous so that legitimate ellipsis
   truncation does not register: an element must be BOTH under 45% of its
   content width AND narrower than 60px before it counts. */
async function squeezed(page) {
  return page.evaluate(() => {
    const out = [];
    const name = (e) => e.tagName.toLowerCase() +
      (e.id ? "#" + e.id : "") +
      (typeof e.className === "string" && e.className ? "." + e.className.trim().split(/\s+/)[0] : "");

    document.querySelectorAll("#view *, .topbar *, .tabbar *, .gs-head *").forEach((e) => {
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      if (cs.overflowX !== "hidden" && cs.overflowX !== "clip") return;
      if (!e.textContent || !e.textContent.trim()) return;
      if (e.children.length) return;                  // leaf text nodes only
      const w = e.getBoundingClientRect().width;
      const need = e.scrollWidth;
      if (need < 20) return;
      if (w < need * 0.45 && w < 60) {
        out.push(name(e) + ' shows ' + Math.round(w) + 'px of ' + need + 'px ("' +
                 e.textContent.trim().slice(0, 24) + '")');
      }
    });
    return out;
  });
}

/* Horizontal overflow check — H6 in the addendum. */
async function overflow(page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const over = [];
    if (de.scrollWidth > de.clientWidth + 1) over.push("document scrollWidth " + de.scrollWidth + " > " + de.clientWidth);
    // An element inside a deliberately scrollable container (a wide table, the
    // module filter strip) is not page overflow — the page itself must not
    // scroll sideways, which is what the scrollWidth check above tests.
    const inScroller = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === "auto" || ox === "scroll") return true;
      }
      return false;
    };
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (inScroller(el)) return;
      if (r.right > de.clientWidth + 1.5 || r.left < -1.5) {
        over.push((el.tagName + (el.className ? "." + String(el.className).split(" ")[0] : "")) +
          " spans " + Math.round(r.left) + "→" + Math.round(r.right));
      }
    });
    return over.slice(0, 6);
  });
}

function reporter(name) {
  const fails = [];
  let checks = 0;
  return {
    check(cond, msg) { checks++; if (!cond) fails.push(msg); return !!cond; },
    fail(msg) { checks++; fails.push(msg); },
    async done(rig) {
      if (rig) await rig.close();
      if (fails.length) {
        console.log("\n  " + fails.length + " FAILURE(S):");
        fails.slice(0, 40).forEach((f) => console.log("    ✗ " + f));
        console.log("\n" + name + ": FAIL  (" + checks + " checks)\n");
        process.exit(1);
      }
      console.log("\n" + name + ": PASS  (" + checks + " checks)\n");
    }
  };
}

module.exports = {
  overlaps,
  squeezed, ROOT, launch, goto, overflow, reporter, dismissModal, serve };
