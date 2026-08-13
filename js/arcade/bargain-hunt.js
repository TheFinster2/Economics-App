/* Arcade — Bargain Hunt. Drag a basket, catch bargains, avoid the overpriced.
   Pays nothing. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, A = ECON.Arcade;

  A.register({ id:"bargainhunt", name:"Bargain Hunt", icon:"🛒", blurb:"Grab the bargains. Leave the overpriced ones alone." });

  UI.route("/arcade/bargainhunt", function (view) {
    var sh = A.shell(view, { id:"bargainhunt", name:"Bargain Hunt" });
    if (!sh) return;

    var c = sh.canvas, ctx = c.getContext("2d");
    var W = 360, H = 480;
    c.width = W * 2; c.height = H * 2; ctx.scale(2, 2);

    var st = { x: W / 2, y: H - 70, r: 26, blobs: [], t: 0, score: 0, lives: 3, over: false };
    var raf = null;

    function move(e) {
      var rect = c.getBoundingClientRect();
      var p = e.touches ? e.touches[0] : e;
      st.x = U.clamp((p.clientX - rect.left) / rect.width * W, st.r, W - st.r);
      st.y = U.clamp((p.clientY - rect.top) / rect.height * H, st.r, H - st.r);
    }
    c.addEventListener("pointerdown", function (e) { e.preventDefault(); move(e); });
    c.addEventListener("pointermove", function (e) { if (e.buttons || e.pointerType === "touch") { e.preventDefault(); move(e); } });

    function loop() {
      if (st.over) return;
      raf = requestAnimationFrame(loop);
      st.t++;

      if (st.t % Math.max(22, 60 - Math.floor(st.t / 200)) === 0) {
        var host = Math.random() < 0.28;
        st.blobs.push({
          x: 24 + Math.random() * (W - 48), y: -20,
          r: host ? 15 : 11,
          vy: 1.2 + Math.random() * 1.4 + st.t / 4000,
          host: host
        });
      }

      st.blobs.forEach(function (b) { b.y += b.vy; });
      st.blobs = st.blobs.filter(function (b) {
        var dx = b.x - st.x, dy = b.y - st.y;
        if (Math.sqrt(dx * dx + dy * dy) < st.r + b.r) {
          if (b.host) {
            st.lives--;
            if (st.lives <= 0) gameOver();
          } else {
            st.score += 10;
            sh.setScore(st.score);
          }
          return false;
        }
        return b.y < H + 40;
      });

      draw();
    }

    function draw() {
      var css = getComputedStyle(document.documentElement);
      var bg = css.getPropertyValue("--bg-2") || "#0b1a13";
      var acc = css.getPropertyValue("--accent") || "#4ade80";
      var bad = css.getPropertyValue("--bad") || "#f87171";
      var info = css.getPropertyValue("--info") || "#60a5fa";
      var ink = css.getPropertyValue("--ink-2") || "#a9c9b8";

      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      st.blobs.forEach(function (b) {
        ctx.fillStyle = b.host ? info : bad;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      });

      ctx.fillStyle = acc;
      ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = bg; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r - 7, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = ink; ctx.font = "13px system-ui";
      ctx.fillText("♥ ".repeat(Math.max(0, st.lives)), 12, 24);
      ctx.fillText("green = bargain · red = overpriced", 12, H - 12);
    }

    function gameOver() {
      st.over = true;
      cancelAnimationFrame(raf);
      var isBest = sh.recordBest(st.score);
      UI.modal({
        title: isBest ? "New best — " + st.score : "Score " + st.score,
        body:"Consumer surplus is what you get when you buy below what you would have paid. Nothing earned here either.",
        actions:[
          { label:"Again", kind:"primary", onclick: function () {
              st = { x: W / 2, y: H - 70, r: 26, blobs: [], t: 0, score: 0, lives: 3, over: false };
              sh.setScore(0); loop();
            } },
          { label:"Exit", kind:"ghost", onclick: function () { UI.go("/arcade"); } }
        ]
      });
    }

    loop();
    return function () { st.over = true; cancelAnimationFrame(raf); sh.dispose(); UI.hideTabs(false); };
  });
})(typeof window !== "undefined" ? window : globalThis);
