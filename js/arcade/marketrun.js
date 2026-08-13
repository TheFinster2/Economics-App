/* Arcade — Market Run. A one-touch runner. Pays nothing. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, A = ECON.Arcade;

  A.register({ id:"marketrun", name:"Market Run", icon:"🏃", blurb:"Dodge the downturns. One tap to jump." });

  UI.route("/arcade/marketrun", function (view) {
    var sh = A.shell(view, { id:"marketrun", name:"Market Run" });
    if (!sh) return;

    var c = sh.canvas, ctx = c.getContext("2d");
    var W = 360, H = 480;
    c.width = W * 2; c.height = H * 2; ctx.scale(2, 2);

    var st = { y: H - 80, vy: 0, ground: H - 80, obstacles: [], t: 0, score: 0, over: false, speed: 3.2 };
    var raf = null;

    function jump() {
      if (st.over) { restart(); return; }
      if (st.y >= st.ground - 1) st.vy = -11.5;
    }
    c.addEventListener("pointerdown", function (e) { e.preventDefault(); jump(); });
    var offKey = U.on(root, "keydown", function (e) { if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); } });

    sh.footer.appendChild(U.el("button", { class:"btn btn-primary btn-block", onclick: jump }, "Jump"));

    function restart() {
      st = { y: H - 80, vy: 0, ground: H - 80, obstacles: [], t: 0, score: 0, over: false, speed: 3.2 };
      sh.setScore(0);
      loop();
    }

    function loop() {
      if (st.over) return;
      raf = requestAnimationFrame(loop);
      st.t++;
      st.speed = 3.2 + st.t / 900;

      st.vy += 0.62;
      st.y += st.vy;
      if (st.y > st.ground) { st.y = st.ground; st.vy = 0; }

      if (st.t % Math.max(48, Math.round(96 - st.t / 40)) === 0) {
        st.obstacles.push({ x: W + 20, w: 16 + Math.random() * 16, h: 22 + Math.random() * 26 });
      }
      st.obstacles.forEach(function (o) { o.x -= st.speed; });
      st.obstacles = st.obstacles.filter(function (o) {
        if (o.x + o.w < 60 && !o.passed) { o.passed = true; st.score++; sh.setScore(st.score); }
        return o.x > -60;
      });

      var px = 56, pr = 15;
      for (var i = 0; i < st.obstacles.length; i++) {
        var o = st.obstacles[i];
        if (px + pr > o.x && px - pr < o.x + o.w && st.y + pr > st.ground + 12 - o.h) { gameOver(); break; }
      }
      draw();
    }

    function draw() {
      var css = getComputedStyle(document.documentElement);
      var bg = css.getPropertyValue("--bg-2") || "#0b1a13";
      var line = css.getPropertyValue("--line") || "#24503a";
      var acc = css.getPropertyValue("--accent") || "#4ade80";
      var bad = css.getPropertyValue("--bad") || "#f87171";

      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = line; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, st.ground + 16); ctx.lineTo(W, st.ground + 16); ctx.stroke();

      ctx.fillStyle = acc;
      ctx.beginPath(); ctx.arc(56, st.y, 15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.arc(60, st.y - 4, 5, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = bad;
      st.obstacles.forEach(function (o) {
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(o.x, st.ground + 16 - o.h, o.w, o.h, 5) : ctx.rect(o.x, st.ground + 16 - o.h, o.w, o.h);
        ctx.fill();
      });
    }

    function gameOver() {
      st.over = true;
      cancelAnimationFrame(raf);
      var isBest = sh.recordBest(st.score);
      UI.modal({
        title: isBest ? "New best — " + st.score : "Score " + st.score,
        body:"Nothing earned. That is the point of the arcade.",
        actions:[
          { label:"Again", kind:"primary", onclick: restart },
          { label:"Exit", kind:"ghost", onclick: function () { UI.go("/arcade"); } }
        ]
      });
    }

    loop();
    return function () { st.over = true; cancelAnimationFrame(raf); offKey(); sh.dispose(); UI.hideTabs(false); };
  });
})(typeof window !== "undefined" ? window : globalThis);
