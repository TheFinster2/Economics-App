/* Shift It scenarios.

   Author three fields only: the shock, which curve moves, and which way.
   The effect on equilibrium price and quantity is derived at run time by
   ECON.Calc.shiftOutcome, so it cannot fall out of step with the scenario.
   Do NOT add a `price` or `quantity` field here — validate.js rejects it,
   because an authored outcome is an outcome that can go stale.

   The hardest cases in this file are deliberate: a shift in a SUBSTITUTE'S
   price, an input-cost change that looks like a demand story, and an
   expectations shock that moves demand today rather than supply. */

window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.shift_core = [

// ── demand shifters ─────────────────────────────────────────────────────
{ id:"sh-001", mod:"P3", market:"new cars", diff:1,
  shock:"Household incomes rise across the economy and cars are a normal good.",
  curve:"demand", direction:"right",
  why:"Income is a determinant of demand, not of supply. For a normal good, higher income means more is wanted at every price." },

{ id:"sh-002", mod:"P3", market:"bus travel", diff:2,
  shock:"The price of petrol rises sharply.",
  curve:"demand", direction:"right",
  why:"Petrol is a complement to driving, so driving becomes more expensive and commuters switch to the substitute. Demand for bus travel rises at every fare." },

{ id:"sh-003", mod:"P3", market:"beef", diff:2,
  shock:"The price of chicken, a substitute, falls sharply.",
  curve:"demand", direction:"left",
  why:"A cheaper substitute draws buyers away, so less beef is wanted at every price. Nothing has changed about the cost of producing beef." },

{ id:"sh-004", mod:"P3", market:"umbrellas", diff:1,
  shock:"An unusually wet season is forecast for the coming months.",
  curve:"demand", direction:"right",
  why:"Tastes and expected conditions are demand determinants. More umbrellas are wanted at every price." },

{ id:"sh-005", mod:"P3", market:"housing", diff:3,
  shock:"Buyers come to expect that house prices will be considerably higher next year.",
  curve:"demand", direction:"right",
  why:"Expectations of a future price rise bring purchases forward, so demand today increases even though nothing about today's construction costs has changed." },

{ id:"sh-006", mod:"P2", market:"cigarettes", diff:2,
  shock:"A sustained public health campaign changes consumer attitudes to smoking.",
  curve:"demand", direction:"left",
  why:"A change in tastes shifts demand. Fewer cigarettes are wanted at every price, which is the intended effect of the campaign." },

{ id:"sh-007", mod:"P3", market:"baby products", diff:2,
  shock:"The birth rate falls steadily over a decade.",
  curve:"demand", direction:"left",
  why:"The number of buyers is a determinant of demand. A smaller market means less is bought at every price." },

{ id:"sh-008", mod:"H1", market:"Australian iron ore exports", diff:3,
  shock:"Chinese construction activity slows sharply.",
  curve:"demand", direction:"left",
  why:"The buyer's demand for the final product falls, and demand for the input is derived from it. Australian production capacity is unchanged." },

// ── supply shifters ─────────────────────────────────────────────────────
{ id:"sh-101", mod:"P3", market:"wheat", diff:1,
  shock:"An extended drought reduces yields across the growing region.",
  curve:"supply", direction:"left",
  why:"A production condition has worsened, so less is offered at every price. Buyers' willingness to pay has not changed." },

{ id:"sh-102", mod:"P3", market:"electronics", diff:2,
  shock:"A new manufacturing technique cuts the cost of assembly substantially.",
  curve:"supply", direction:"right",
  why:"Technology is a supply determinant. Lower unit costs mean firms will offer more at every price." },

{ id:"sh-103", mod:"P4", market:"restaurant meals", diff:2,
  shock:"The award wage for hospitality staff increases.",
  curve:"supply", direction:"left",
  why:"Wages are an input cost. Higher costs mean fewer meals are profitable to produce at any given price, so supply decreases." },

{ id:"sh-104", mod:"P6", market:"solar panels", diff:2,
  shock:"The government introduces a subsidy paid to panel manufacturers.",
  curve:"supply", direction:"right",
  why:"A production subsidy lowers the effective cost of supplying, so more is offered at every price. A subsidy paid to buyers instead would have shifted demand." },

{ id:"sh-105", mod:"P6", market:"alcohol", diff:2,
  shock:"An excise tax on producers is increased.",
  curve:"supply", direction:"left",
  why:"An indirect tax on production raises the cost of supplying each unit, so the supply curve shifts left and buyers face a higher price." },

{ id:"sh-106", mod:"P3", market:"crude oil", diff:3,
  shock:"A major producing region returns to full output after a long shutdown.",
  curve:"supply", direction:"right",
  why:"The number of sellers and their capacity is a supply determinant. More is available at every price." },

{ id:"sh-107", mod:"P3", market:"fresh milk", diff:3,
  shock:"Dairy farmers expect the price of milk to be much higher next month.",
  curve:"supply", direction:"left",
  why:"Expecting a better price later, producers hold stock back from today's market, so supply today decreases. This is the mirror image of buyers bringing purchases forward." },

{ id:"sh-108", mod:"H2", market:"Australian tourism services", diff:3,
  shock:"The Australian dollar depreciates significantly against major currencies.",
  curve:"demand", direction:"right",
  why:"A depreciation makes Australian services cheaper in foreign currency, so overseas visitors want more at every Australian-dollar price. The cost of providing the services is unchanged, so it is demand that moves." }

];
