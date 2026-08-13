/* Achievements.
   Targets measure against Bank.all(), never Bank.active() — so hiding content
   with a coverage pack can never shorten a collection (brief §8). */
window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.achievements = [
{ id:"first-run",   name:"Opening bell",       desc:"Finish your first run in any mode.",              icon:"🔔" },
{ id:"acc-90",      name:"Clean sweep",        desc:"Finish a run of 10+ questions at 90% or better.", icon:"🎯" },
{ id:"streak-15",   name:"On a roll",          desc:"Reach a 15-answer streak in one run.",            icon:"🔥" },
{ id:"streak-30",   name:"Unbroken",           desc:"Reach a 30-answer streak in one run.",            icon:"⚡" },
{ id:"days-7",      name:"Week of it",         desc:"Study on 7 consecutive days.",                    icon:"📅" },
{ id:"days-30",     name:"Month of it",        desc:"Study on 30 consecutive days.",                   icon:"🗓️" },
{ id:"lv-10",       name:"Level 10",           desc:"Reach level 10.",                                 icon:"⭐" },
{ id:"lv-25",       name:"Level 25",           desc:"Reach level 25.",                                 icon:"🌟" },
{ id:"lv-60",       name:"Blue chip",          desc:"Reach level 60.",                                 icon:"👑" },
{ id:"seen-100",    name:"Century",            desc:"Answer 100 different questions.",                 icon:"💯" },
{ id:"seen-half",   name:"Halfway through",    desc:"See half of every multiple-choice question in the bank.", icon:"📚" },
{ id:"seen-all",    name:"Completionist",      desc:"See every multiple-choice question in the bank.",  icon:"🏆" },
{ id:"cards-100",   name:"Card shark",         desc:"Review 100 flashcards.",                          icon:"🃏" },
{ id:"cards-box4",  name:"Long-term memory",   desc:"Get 50 flashcards into the final review box.",    icon:"🧠" },
{ id:"diagram-all", name:"Draw it from memory",desc:"Complete a Label It round on every diagram.",      icon:"🗺️" },
{ id:"calc-25",     name:"Show your working",  desc:"Get 25 Calculation Lab questions right.",          icon:"🧮" },
{ id:"shift-10",    name:"Comparative statics",desc:"Diagnose 10 market shocks completely correctly.",  icon:"📈" },
{ id:"response-20", name:"In your own words",  desc:"Complete 20 Response Builder questions.",          icon:"✍️" },
{ id:"rehab-clear", name:"Nothing left to fix",desc:"Clear your Mistake Rehab pool completely.",        icon:"🩹" },
{ id:"boss-1",      name:"Topic master",       desc:"Clear any topic boss.",                            icon:"🛡️" },
{ id:"boss-all",    name:"Ten for ten",        desc:"Clear the boss for all ten topics.",               icon:"🏅" },
{ id:"honest",      name:"Unassisted",         desc:"Finish a 15-question run at 100% without opening the reference.", icon:"🕊️" },
{ id:"arcade-1",    name:"Time off",           desc:"Play an arcade game. It pays nothing — that's the point.", icon:"🕹️" }
];

/* Achievement checking lives here rather than in ui.js so that adding an
   achievement never means editing the reward path. */
(function (root) {
  "use strict";
  var ECON = root.ECON = root.ECON || {};
  var A = {};

  A.all = function () { return ECON.DATA.achievements.slice(); };

  A.check = function (rec) {
    var S = ECON.State, Bank = ECON.Bank;
    var d = S.data, got = [];

    function win(id) { if (S.unlock(id)) got.push(id); }

    if (d.runs >= 1) win("first-run");
    if (rec && rec.accuracy !== null && rec.accuracy >= 0.9 && rec.questions >= 10) win("acc-90");

    var lv = S.levelFromXp(d.xp).level;
    if (lv >= 10) win("lv-10");
    if (lv >= 25) win("lv-25");
    if (lv >= 60) win("lv-60");

    if ((d.streakDays || 0) >= 7) win("days-7");
    if ((d.streakDays || 0) >= 30) win("days-30");

    var seen = Object.keys(d.seen).length;
    if (seen >= 100) win("seen-100");

    /* Targets measure against the COMPLETE bank, never Bank.active(). Hiding
       content with a coverage pack must not shorten a collection (§8). */
    var totalMcq = Bank.all("mcq").length;
    var seenMcq = Bank.all("mcq").filter(function (q) { return d.seen[q.id]; }).length;
    if (totalMcq && seenMcq >= Math.ceil(totalMcq / 2)) win("seen-half");
    if (totalMcq && seenMcq >= totalMcq) win("seen-all");

    var cardIds = Object.keys(d.cards);
    if (cardIds.length >= 100) win("cards-100");
    if (cardIds.filter(function (id) { return d.cards[id].box >= S.BOX_DAYS.length - 1; }).length >= 50) win("cards-box4");

    var diagramTotal = Bank.diagrams().length;
    var diagramDone = Object.keys(d.diagramSeen).length;
    if (diagramTotal && diagramDone >= diagramTotal) win("diagram-all");

    if ((d.bests.calcSolved || 0) >= 25) win("calc-25");
    if ((d.bests.shiftsSolved || 0) >= 10) win("shift-10");
    if (Object.keys(d.shortLog).length >= 20) win("response-20");

    if (Object.keys(d.missed).length === 0 && seen >= 40) win("rehab-clear");

    var cleared = Object.keys(d.bosses).filter(function (b) { return d.bosses[b].cleared; });
    if (cleared.length >= 1) win("boss-1");
    if (cleared.length >= ECON.U.MODULES.length) win("boss-all");

    if (rec && rec.mode === "drill" && rec.accuracy === 1 && rec.refPenalty === 0 && rec.questions >= 15) win("honest");
    if (d.arcade && Object.keys(d.arcade.bests).length >= 1) win("arcade-1");

    got.forEach(function (id) {
      var a = A.byId(id);
      if (!a) return;
      setTimeout(function () {
        ECON.UI.toast(a.icon + "  " + a.name + " unlocked", "good", 2600);
      }, 700);
    });
    return got;
  };

  A.byId = function (id) {
    var list = ECON.DATA.achievements;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };

  A.progress = function () {
    var total = ECON.DATA.achievements.length;
    var have = ECON.DATA.achievements.filter(function (a) { return ECON.State.has(a.id); }).length;
    return { have: have, total: total };
  };

  ECON.Achievements = A;
})(typeof window !== "undefined" ? window : globalThis);
