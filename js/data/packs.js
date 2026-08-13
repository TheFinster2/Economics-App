/* Course coverage packs (brief §8).
   Hiding content NEVER raises what the remaining questions pay and NEVER
   lowers an achievement target. validate.js checks that every module, topic
   and tag a pack claims actually exists — a typo hides nothing and is
   invisible from inside the app. */
window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.packs = [
{ id:"prelim", name:"Year 11 (Preliminary course)", group:"Year",
  blurb:"Hide the whole Preliminary course while you focus on the HSC topics.",
  modules:["P1","P2","P3","P4","P5","P6"] },

{ id:"p1", name:"Topic 1 — Introduction to Economics", group:"Year 11", modules:["P1"] },
{ id:"p2", name:"Topic 2 — Consumers and Business", group:"Year 11", modules:["P2"] },
{ id:"p3", name:"Topic 3 — Markets", group:"Year 11", modules:["P3"] },
{ id:"p4", name:"Topic 4 — Labour Markets", group:"Year 11", modules:["P4"] },
{ id:"p5", name:"Topic 5 — Financial Markets", group:"Year 11", modules:["P5"] },
{ id:"p6", name:"Topic 6 — Government and the Economy", group:"Year 11", modules:["P6"] },

{ id:"h1", name:"Topic 1 — The Global Economy", group:"Year 12", modules:["H1"] },
{ id:"h2", name:"Topic 2 — Australia's Place in the Global Economy", group:"Year 12", modules:["H2"] },
{ id:"h3", name:"Topic 3 — Economic Issues", group:"Year 12", modules:["H3"] },
{ id:"h4", name:"Topic 4 — Economic Policies and Management", group:"Year 12", modules:["H4"] },

{ id:"elasticity", name:"Elasticity", group:"By theme",
  blurb:"Price, income and cross elasticity, and the link to total revenue.",
  topics:["Elasticity"] },

{ id:"externalities", name:"Market failure and externalities", group:"By theme",
  blurb:"Public goods, externalities, and the case for intervention.",
  tags:["market-failure"] },

{ id:"bop", name:"Balance of payments and exchange rates", group:"By theme",
  blurb:"Current account, capital and financial account, and the exchange rate.",
  tags:["bop"] },

{ id:"policy-mix", name:"Policy mix", group:"By theme",
  blurb:"Fiscal, monetary and microeconomic policy and how they interact.",
  tags:["policy"] }
];
