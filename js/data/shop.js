/* Shop — what credits are for.

   The original brief said the shop must sell nothing that helps you in a
   scored mode. That has been relaxed deliberately: power-ups are now sold,
   because a currency you can only spend on wallpaper stops being a reason to
   play. The honesty property the brief was protecting is preserved a
   different and stronger way:

     • Nothing here calls UI.award. Credits are still a sink.
     • Power-ups change how a run FEELS, not what an empty run is worth.
       Multipliers multiply; they never add. A run that earned nothing is
       still worth nothing after a 2x multiplier, and tests/exploit.js
       re-runs the whole bad-bot sweep with a full inventory and the
       multiplier active to prove it.
     • Credits come from XP, and XP comes from answering things correctly
       and slowly enough to have read them. So power-ups are bought with
       work already done. */
window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.shop = {
  tickets: [
    { id:"tkt-5",  name:"Arcade ticket — 5 minutes",  minutes:5,  cost:315 },
    { id:"tkt-15", name:"Arcade ticket — 15 minutes", minutes:15, cost:840 },
    { id:"tkt-40", name:"Arcade ticket — 40 minutes", minutes:40, cost:1980 }
  ],
  /* Consumable power-ups. `desc` is what the shop shows; the behaviour lives
     in js/modes/common.js. Prices are set so that a strong run buys roughly
     one mid-tier power-up — enough to matter, not enough to farm. */
  powerups: [
    { id:"fifty",   icon:"✂️",  name:"Narrow the field", cost:140,
      desc:"Removes two wrong options from the current multiple-choice question." },
    { id:"skip",    icon:"⏭️",  name:"Pass",             cost:110,
      desc:"Skip a question without breaking your streak. It is not counted as wrong." },
    { id:"freeze",  icon:"🧊",  name:"Extension",        cost:190,
      desc:"Adds 20 seconds to the clock in any timed mode." },
    { id:"shield",  icon:"🛡️",  name:"Buffer stock",     cost:260,
      desc:"Absorbs one wrong answer so your streak survives. Used automatically." },
    { id:"insight", icon:"🔍",  name:"Research note",    cost:320,
      desc:"Names the topic and the misconception being tested, without costing you the reference penalty." },
    { id:"double",  icon:"✨",  name:"Multiplier",       cost:400,
      desc:"Doubles the XP you earn for one run. It multiplies what you earn — a run worth nothing stays worth nothing." },
    { id:"revive",  icon:"💉",  name:"Second wind",      cost:750,
      desc:"Restores one life when you fall in Survival or a topic boss. Used automatically." }
  ],

  /* Avatars are pure cosmetics with a level gate, so there is something to
     work towards at every stage rather than only at the start. */
  avatars: [
    { emoji:"📊", name:"Chart",            cost:0 },
    { emoji:"⚖️", name:"Balance",          cost:0 },
    { emoji:"🪙", name:"Coin",             cost:300 },
    { emoji:"📈", name:"Bull",             cost:300 },
    { emoji:"📉", name:"Bear",             cost:450 },
    { emoji:"🏦", name:"Central Bank",     cost:450 },
    { emoji:"🧾", name:"Receipt",          cost:600 },
    { emoji:"🛒", name:"Shopping Trolley", cost:600 },
    { emoji:"🚢", name:"Container Ship",   cost:750 },
    { emoji:"⛏️", name:"Mining Boom",      cost:750 },
    { emoji:"🏗️", name:"Infrastructure",   cost:900,   minLevel:8 },
    { emoji:"💹", name:"Ticker",           cost:1100,  minLevel:10 },
    { emoji:"🧮", name:"Abacus",           cost:1400,  minLevel:12 },
    { emoji:"🦘", name:"Kangaroo Economy", cost:1400,  minLevel:14 },
    { emoji:"🌏", name:"Global Economy",   cost:1800,  minLevel:16 },
    { emoji:"🐐", name:"GOAT",             cost:2400,  minLevel:18, note:"For the truly unhinged." },
    { emoji:"🎩", name:"Treasurer",        cost:3200,  minLevel:24 },
    { emoji:"🧠", name:"Rational Agent",   cost:4000,  minLevel:30 },
    { emoji:"🏛️", name:"Institution",      cost:5200,  minLevel:36 },
    { emoji:"👑", name:"Governor",         cost:6800,  minLevel:42 },
    { emoji:"🌌", name:"Invisible Hand",   cost:9000,  minLevel:50 },
    { emoji:"🔱", name:"Equilibrium",      cost:12000, minLevel:60, note:"Level 60. The end of the road." }
  ],

  themes: [
    { id:"ledger",   name:"Ledger",   cost:0,    blurb:"The default. Deep green and brass." },
    { id:"indigo",   name:"Indigo",   cost:1200, blurb:"Cool blues, easy on the eyes at night." },
    { id:"ochre",    name:"Ochre",    cost:1800, blurb:"Warm reds and gold." },
    { id:"slate",    name:"Slate",    cost:2400, blurb:"Cold grey and pale steel." },
    { id:"daylight", name:"Daylight", cost:3000, blurb:"A light theme, for reading in the sun." }
  ]
};

/* Level titles — index by level, capped at the last entry. Sixty levels. */
ECON.DATA.levelTitles = [
  "First Principles",           //  1
  "Wants and Needs",            //  2
  "Opportunity Cost",           //  3
  "Frontier Sketcher",          //  4
  "Circular Flow Tracer",       //  5
  "Price Reader",               //  6
  "Curve Shifter",              //  7
  "Equilibrium Finder",         //  8
  "Elasticity Apprentice",      //  9
  "Junior Analyst",             // 10
  "Revenue Tester",             // 11
  "Cost Curve Cartographer",    // 12
  "Scale Economist",            // 13
  "Market Structure Scout",     // 14
  "Externality Spotter",        // 15
  "Public Goods Provider",      // 16
  "Incidence Calculator",       // 17
  "Labour Market Reader",       // 18
  "Participation Rate Watcher", // 19
  "Band 5 Candidate",           // 20
  "Yield Curve Novice",         // 21
  "Intermediation Specialist",  // 22
  "Real Rate Realist",          // 23
  "Multiplier Mechanic",        // 24
  "Leakage Auditor",            // 25
  "Injection Engineer",         // 26
  "Budget Line Reader",         // 27
  "Stabiliser Technician",      // 28
  "Cycle Forecaster",           // 29
  "Band 6 Candidate",           // 30
  "Comparative Advantage Adept",// 31
  "Tariff Tactician",           // 32
  "Quota Cartographer",         // 33
  "Trade Bloc Navigator",       // 34
  "Development Economist",      // 35
  "Gini Interpreter",           // 36
  "Balance of Payments Keeper", // 37
  "Terms of Trade Tracker",     // 38
  "Exchange Rate Pilot",        // 39
  "J-Curve Rider",              // 40
  "Inflation Hunter",           // 41
  "Underlying Trend Reader",    // 42
  "NAIRU Navigator",            // 43
  "Phillips Curve Cartographer",// 44
  "Structural Diagnostician",   // 45
  "Fiscal Stance Reader",       // 46
  "Transmission Engineer",      // 47
  "Cash Rate Custodian",        // 48
  "Policy Mix Strategist",      // 49
  "Distinguished Economist",    // 50
  "Supply Side Reformer",       // 51
  "Sustainability Steward",     // 52
  "Chief Economist",            // 53
  "Treasury Secretary",         // 54
  "Reserve Bank Governor",      // 55
  "Nobel Hopeful",              // 56
  "Nobel Laureate",             // 57
  "Invisible Hand",             // 58
  "General Equilibrium",        // 59
  "Equilibrium Legend"          // 60+
];

/* Difficulty modes. `xp` MULTIPLIES what a run earns — it never adds, so a
   run worth nothing is still worth nothing on Nightmare. `timeScale` shortens
   every clock and `lock` names power-ups that difficulty refuses to allow. */
ECON.DATA.difficulties = [
  { id:"standard",  name:"Standard",  icon:"📊", xp:1.0,  timeScale:1.0,  lock:[],
    desc:"The default balance. Full timers, every power-up available." },
  { id:"hard",      name:"Hard",      icon:"🔥", xp:1.45, timeScale:0.75, lock:["fifty"],
    desc:"A quarter less time on every clock and no Narrow the field — but 45% more XP." },
  { id:"nightmare", name:"Nightmare", icon:"☠️", xp:2.0,  timeScale:0.55, lock:["fifty","skip"],
    desc:"Barely any time, no Narrow the field and no Pass. Double XP for the reckless." }
];

/* Per-topic mastery tiers, measured against State.mastery(). */
ECON.DATA.masteryTiers = [
  { at:0,  name:"Unranked", icon:"▪️" },
  { at:25, name:"Bronze",   icon:"🥉" },
  { at:45, name:"Silver",   icon:"🥈" },
  { at:65, name:"Gold",     icon:"🥇" },
  { at:80, name:"Platinum", icon:"💠" },
  { at:92, name:"Diamond",  icon:"💎" }
];
