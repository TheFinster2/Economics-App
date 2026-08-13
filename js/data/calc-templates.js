/* Calculation templates — each one an unbounded family of questions.

   A template is only a label: it says which engine kind to use and where the
   question belongs in the syllabus. Every number, every answer and every
   distractor comes from js/core/econcalc.js, which computes each answer twice
   by independent routes and refuses to emit a question when they disagree.

   Adding a template here adds an infinite supply of questions. Adding a kind
   to econcalc.js is the only thing that needs real care. */

window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.calc_core = [

{ id:"ct-001", mod:"P3", topic:"Elasticity", kind:"ped", diff:2,
  title:"Price elasticity of demand",
  note:"Between 0 and 1 in absolute value is inelastic; above 1 is elastic. The sign is always negative." },

{ id:"ct-002", mod:"P3", topic:"Elasticity", kind:"pes", diff:2,
  title:"Price elasticity of supply",
  note:"Supply elasticity is positive. It rises with the time available to adjust output." },

{ id:"ct-003", mod:"P2", topic:"Elasticity", kind:"yed", diff:3,
  title:"Income elasticity of demand",
  note:"A negative value marks an inferior good; above 1 marks a luxury." },

{ id:"ct-004", mod:"P3", topic:"Elasticity", kind:"totalrevenue", diff:3,
  title:"Price change and total revenue",
  note:"If revenue falls when price rises, demand over that range was elastic." },

{ id:"ct-005", mod:"P6", topic:"Aggregate demand", kind:"multiplier", diff:2,
  title:"The expenditure multiplier",
  note:"The multiplier is 1 ÷ (1 − MPC), which is the same as 1 ÷ MPS." },

{ id:"ct-006", mod:"H3", topic:"Inflation", kind:"inflation", diff:1,
  title:"Inflation from the CPI",
  note:"Percentage change always uses the earlier figure as the base." },

{ id:"ct-007", mod:"H3", topic:"Unemployment", kind:"unemployment", diff:2,
  title:"The unemployment rate",
  note:"The denominator is the labour force — the employed plus the unemployed, not the whole population." },

{ id:"ct-008", mod:"P4", topic:"Labour force", kind:"participation", diff:2,
  title:"The participation rate",
  note:"This is the share of the working-age population that is in the labour force." },

{ id:"ct-009", mod:"H2", topic:"Terms of trade", kind:"tot", diff:2,
  title:"The terms of trade index",
  note:"Export prices on top. A rise means each unit of exports buys more imports." },

{ id:"ct-010", mod:"H2", topic:"Exchange rates", kind:"fx", diff:2,
  title:"Converting at an exchange rate",
  note:"Read the quote carefully: A$1 = US$0.65 means one Australian dollar buys 65 US cents." },

{ id:"ct-011", mod:"H3", topic:"Economic growth", kind:"realgrowth", diff:1,
  title:"Applying a growth rate",
  note:"A growth rate is applied to the level, so multiply rather than add." },

{ id:"ct-012", mod:"H4", topic:"Fiscal policy", kind:"budget", diff:1,
  title:"The budget outcome",
  note:"Revenue minus expenditure. A negative result is a deficit." },

{ id:"ct-013", mod:"P5", topic:"Interest rates", kind:"realrate", diff:2,
  title:"The real interest rate",
  note:"Nominal rate minus inflation. This is the approximation the syllabus uses." },

{ id:"ct-014", mod:"H2", topic:"Balance of payments", kind:"bogs", diff:2,
  title:"Balance on goods and services",
  note:"Exports minus imports. A negative figure is a deficit on goods and services." }

];
