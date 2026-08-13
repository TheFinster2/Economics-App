/* Shop — what credits are for. Arcade tickets and cosmetics only.
   Nothing here grants an advantage in a scored mode, and nothing here calls
   UI.award. Credits are a sink, not a second currency loop. */
window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.shop = {
  tickets: [
    { id:"tkt-5",  name:"Arcade ticket — 5 minutes",  minutes:5,  cost:315 },
    { id:"tkt-15", name:"Arcade ticket — 15 minutes", minutes:15, cost:840 },
    { id:"tkt-40", name:"Arcade ticket — 40 minutes", minutes:40, cost:1980 }
  ],
  themes: [
    { id:"ledger",   name:"Ledger",   cost:0,    blurb:"The default. Deep green and brass." },
    { id:"indigo",   name:"Indigo",   cost:1200, blurb:"Cool blues, easy on the eyes at night." },
    { id:"ochre",    name:"Ochre",    cost:1800, blurb:"Warm reds and gold." },
    { id:"slate",    name:"Slate",    cost:2400, blurb:"Cold grey and pale steel." },
    { id:"daylight", name:"Daylight", cost:3000, blurb:"A light theme, for reading in the sun." }
  ]
};
