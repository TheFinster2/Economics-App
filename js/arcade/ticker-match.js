/* Arcade — Ticker Match. A memory grid. Pays nothing. */
(function (root) {
  "use strict";
  var ECON = root.ECON, U = ECON.U, UI = ECON.UI, S = ECON.State, A = ECON.Arcade;

  A.register({ id:"tickermatch", name:"Ticker Match", icon:"🧩", blurb:"Pair the tickers before the closing bell." });

  var SYMBOLS = ["📈", "📉", "💹", "🏦", "🪙", "💵", "📊", "🧾", "⚖️", "🏗️"];

  UI.route("/arcade/tickermatch", function (view) {
    var sh = A.shell(view, { id:"tickermatch", name:"Ticker Match" });
    if (!sh) return;
    sh.canvas.remove();

    var board = U.el("div", { style:"display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px" });
    view.insertBefore(board, sh.footer);

    var st = { level:1, score:0, first:null, lock:false, matched:0, cards:[], timeLeft:0, timer:null };

    function deal() {
      U.clear(board);
      var pairs = Math.min(8, 4 + st.level);
      var syms = U.sample(SYMBOLS, pairs);
      var deck = U.shuffle(syms.concat(syms));
      st.matched = 0;
      st.cards = [];
      st.first = null;
      st.lock = false;
      board.style.gridTemplateColumns = "repeat(" + (pairs <= 6 ? 4 : 4) + ",1fr)";

      deck.forEach(function (sym, i) {
        var b = U.el("button", {
          class:"btn",
          style:"aspect-ratio:1/1;font-size:26px;min-height:0;padding:0"
        }, "?");
        var card = { sym: sym, el: b, open: false, done: false };
        b.addEventListener("click", function () { flip(card); });
        st.cards.push(card);
        board.appendChild(b);
      });

      st.timeLeft = 22 + pairs * 4;
      tickStart();
    }

    function tickStart() {
      if (st.timer) clearInterval(st.timer);
      st.timer = setInterval(function () {
        st.timeLeft--;
        sh.setScore(st.score);
        var el = U.$("#arcScore");
        if (el) el.textContent = "Score " + st.score + " · " + st.timeLeft + "s";
        if (st.timeLeft <= 0) gameOver();
      }, 1000);
    }

    function flip(card) {
      if (st.lock || card.open || card.done) return;
      card.open = true;
      card.el.textContent = card.sym;
      card.el.style.borderColor = "var(--accent)";
      if (!st.first) { st.first = card; return; }

      st.lock = true;
      var a = st.first, b = card;
      st.first = null;
      if (a.sym === b.sym) {
        a.done = b.done = true;
        a.el.style.opacity = b.el.style.opacity = ".4";
        st.matched++;
        st.score += 10 + st.level * 2;
        sh.setScore(st.score);
        st.lock = false;
        if (st.matched === st.cards.length / 2) {
          st.level++;
          st.score += 25;
          setTimeout(deal, 500);
        }
      } else {
        setTimeout(function () {
          [a, b].forEach(function (c) { c.open = false; c.el.textContent = "?"; c.el.style.borderColor = "var(--line)"; });
          st.lock = false;
        }, 620);
      }
    }

    function gameOver() {
      clearInterval(st.timer);
      var isBest = sh.recordBest(st.score);
      UI.modal({
        title: isBest ? "New best — " + st.score : "Score " + st.score,
        body:"Reached level " + st.level + ". Nothing earned — the arcade is a sink.",
        actions:[
          { label:"Again", kind:"primary", onclick: function () { st.level = 1; st.score = 0; deal(); } },
          { label:"Exit", kind:"ghost", onclick: function () { UI.go("/arcade"); } }
        ]
      });
    }

    deal();
    return function () { clearInterval(st.timer); sh.dispose(); UI.hideTabs(false); };
  });
})(typeof window !== "undefined" ? window : globalThis);
