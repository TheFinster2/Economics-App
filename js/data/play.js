/* Process Order sequences, Sort It boards and Data Detective datasets.

   All three are discovered by key pattern (seq_, sort_, data_), so this one
   file feeds three modes without touching any engine code. */

window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

/* ── Process Order ──────────────────────────────────────────────────── */
ECON.DATA.seq_core = [

{ id:"sq-001", mod:"H4", topic:"Monetary policy", title:"Transmission of a cash rate rise", diff:3,
  steps:[
    "The Reserve Bank board decides to raise the cash rate target",
    "Domestic market operations sell securities, draining cash from the system",
    "The overnight cash rate rises to the new target",
    "Banks reprice mortgage, business and deposit rates",
    "Households with debt have less disposable income and borrowing falls",
    "Asset prices soften and the exchange rate tends to appreciate",
    "Consumption and investment spending slow, reducing aggregate demand",
    "Inflationary pressure eases, with a lag of roughly one to two years"
  ],
  why:"The Bank sets a price, not a quantity of spending. Every step after the repricing is a behavioural response, which is why the lag is so long." },

{ id:"sq-002", mod:"P6", topic:"The multiplier", title:"How the multiplier works", diff:2,
  steps:[
    "An injection occurs, such as new government infrastructure spending",
    "Contractors receive the money as income",
    "They spend a fraction of it determined by the MPC",
    "That spending becomes income for other households and firms",
    "Those recipients in turn spend a fraction of what they receive",
    "Each round is smaller than the last because of leakages",
    "The rounds converge on a total larger than the original injection",
    "National income has risen by the injection multiplied by 1 ÷ MPS"
  ],
  why:"The multiplier is not a formula to memorise but a series to follow. It converges precisely because each round leaks." },

{ id:"sq-003", mod:"P3", topic:"Market equilibrium", title:"How a market returns to equilibrium after a shortage", diff:2,
  steps:[
    "Price is set below the equilibrium level",
    "Quantity demanded exceeds quantity supplied, creating a shortage",
    "Unsatisfied buyers compete and bid the price up",
    "The higher price reduces quantity demanded along the demand curve",
    "The higher price increases quantity supplied along the supply curve",
    "The gap between the two quantities narrows",
    "Price stops rising when quantity demanded equals quantity supplied",
    "The market clears at the equilibrium price and quantity"
  ],
  why:"Both quantities move, in opposite directions, and both movements are ALONG the curves. Neither curve shifts at any point in this sequence." },

{ id:"sq-004", mod:"H2", topic:"Exchange rates", title:"The J-curve after a depreciation", diff:3,
  steps:[
    "The Australian dollar depreciates against major currencies",
    "Existing contracts mean import and export volumes are unchanged at first",
    "The same volume of imports now costs more in Australian dollars",
    "The trade balance worsens in the short term",
    "Over months, foreign buyers respond to cheaper Australian exports",
    "Domestic buyers substitute away from dearer imports",
    "Export volumes rise and import volumes fall",
    "The trade balance improves and moves above its starting point"
  ],
  why:"Prices adjust immediately and volumes adjust slowly. That difference in speed is the entire explanation for the shape." },

{ id:"sq-005", mod:"P1", topic:"Circular flow", title:"A contraction working through the circular flow", diff:3,
  steps:[
    "Households become pessimistic and increase their saving",
    "Leakages now exceed injections",
    "Spending on domestically produced goods falls",
    "Firms find stocks building up and cut production",
    "Firms reduce hours and shed labour",
    "Household income falls",
    "Saving and tax paid fall with income, reducing leakages",
    "The flow stabilises at a new, lower level of income"
  ],
  why:"The paradox of thrift: an attempt by households to save more can end with a lower income and no more saving in total." },

{ id:"sq-006", mod:"H3", topic:"Inflation", title:"A wage-price spiral", diff:3,
  steps:[
    "A shock raises the general price level",
    "Real wages fall because nominal wages have not changed",
    "Workers bargain for higher nominal wages to restore purchasing power",
    "Firms face higher labour costs per unit of output",
    "Firms pass those costs on as higher prices",
    "The price level rises again, eroding the wage rise just granted",
    "Expectations of future inflation become entrenched",
    "Each round repeats until the expectation is broken"
  ],
  why:"The spiral runs on expectations. Breaking it usually requires a credible policy commitment rather than a single rate decision." }

];

/* ── Sort It ────────────────────────────────────────────────────────── */
ECON.DATA.sort_core = [

{ id:"so-001", mod:"P1", topic:"Circular flow", title:"Leakage or injection?", diff:1,
  bins:["Leakage","Injection"],
  items:[
    ["Household saving","Leakage"], ["Business investment","Injection"],
    ["Income tax paid","Leakage"], ["Government infrastructure spending","Injection"],
    ["Spending on imported cars","Leakage"], ["Export income from iron ore","Injection"],
    ["Superannuation contributions","Leakage"], ["A foreign tourist's hotel bill","Injection"],
    ["GST paid on a purchase","Leakage"], ["A firm building a new factory","Injection"]
  ],
  why:"Leakages withdraw income from the domestic flow: Saving, Taxation, iMports. Injections add to it: Investment, Government spending, eXports." },

{ id:"so-002", mod:"P3", topic:"Demand and supply", title:"Shifts demand or shifts supply?", diff:2,
  bins:["Shifts demand","Shifts supply","Moves along the curve"],
  items:[
    ["A rise in household income","Shifts demand"], ["A new labour-saving technology","Shifts supply"],
    ["The good's own price falls","Moves along the curve"], ["A fall in the price of a substitute","Shifts demand"],
    ["An increase in wages paid by producers","Shifts supply"], ["The good's own price rises","Moves along the curve"],
    ["A successful advertising campaign","Shifts demand"], ["A subsidy paid to producers","Shifts supply"],
    ["Drought reducing crop yields","Shifts supply"], ["A rise in the number of consumers","Shifts demand"]
  ],
  why:"Only the good's OWN price moves you along a curve. Every other determinant shifts one of the curves." },

{ id:"so-003", mod:"H2", topic:"Balance of payments", title:"Current account or financial account?", diff:3,
  bins:["Current account","Capital and financial account"],
  items:[
    ["Export of coal to Japan","Current account"], ["A foreign firm buying an Australian mine","Capital and financial account"],
    ["Interest paid on foreign debt","Current account"], ["An Australian bank borrowing overseas","Capital and financial account"],
    ["Tourism services sold to visitors","Current account"], ["A foreign investor buying Australian shares","Capital and financial account"],
    ["Dividends paid to foreign shareholders","Current account"], ["Australians buying property overseas","Capital and financial account"],
    ["Foreign aid given to a Pacific nation","Current account"], ["Repayment of the principal on a foreign loan","Capital and financial account"]
  ],
  why:"Income FROM assets is current account. Buying or selling the assets themselves is financial account. Interest and dividends are the ones people misfile." },

{ id:"so-004", mod:"H3", topic:"Unemployment", title:"Which type of unemployment?", diff:3,
  bins:["Cyclical","Structural","Frictional","Seasonal"],
  items:[
    ["A recession causes retail closures","Cyclical"], ["A factory automates and workers lack the new skills","Structural"],
    ["A graduate spends two months applying for jobs","Frictional"], ["A ski instructor is out of work in summer","Seasonal"],
    ["Aggregate demand falls sharply","Cyclical"], ["An industry declines permanently as tastes change","Structural"],
    ["Someone quits to look for a better role","Frictional"], ["Fruit pickers between harvests","Seasonal"]
  ],
  why:"Match the cause to the cure. Cyclical responds to demand stimulus; structural needs training and mobility; frictional needs better job matching." },

{ id:"so-005", mod:"H4", topic:"Policy mix", title:"Fiscal, monetary or microeconomic?", diff:2,
  bins:["Fiscal policy","Monetary policy","Microeconomic policy"],
  items:[
    ["Raising the cash rate target","Monetary policy"], ["Cutting personal income tax rates","Fiscal policy"],
    ["Deregulating the electricity market","Microeconomic policy"], ["Increasing the age pension","Fiscal policy"],
    ["Domestic market operations","Monetary policy"], ["Reforming competition law","Microeconomic policy"],
    ["Announcing a new infrastructure program","Fiscal policy"], ["Lowering the cash rate to stimulate borrowing","Monetary policy"],
    ["Investing in vocational training","Microeconomic policy"]
  ],
  why:"Fiscal is the budget. Monetary is the cash rate. Microeconomic reform changes how efficiently individual markets work, and so raises aggregate supply." },

{ id:"so-006", mod:"P6", topic:"Taxation", title:"Progressive, proportional or regressive?", diff:2,
  bins:["Progressive","Proportional","Regressive"],
  items:[
    ["Australian personal income tax","Progressive"], ["The company tax rate","Proportional"],
    ["The GST, measured against income","Regressive"], ["The Medicare levy at a flat percentage","Proportional"],
    ["The top marginal income tax bracket","Progressive"], ["Excise on tobacco, measured against income","Regressive"],
    ["A flat licence fee paid by every household","Regressive"], ["Higher capital gains tax at higher income","Progressive"]
  ],
  why:"The test is what happens to the AVERAGE rate as income rises: up is progressive, flat is proportional, down is regressive. A flat dollar charge is always regressive." },

{ id:"so-007", mod:"P3", topic:"Elasticity", title:"Elastic or inelastic demand?", diff:2,
  bins:["Likely elastic","Likely inelastic"],
  items:[
    ["One particular brand of breakfast cereal","Likely elastic"], ["Prescription medication for a chronic condition","Likely inelastic"],
    ["Overseas holiday travel","Likely elastic"], ["Salt","Likely inelastic"],
    ["A specific airline on a busy route","Likely elastic"], ["Petrol in the short run","Likely inelastic"],
    ["Restaurant meals","Likely elastic"], ["Water for household use","Likely inelastic"]
  ],
  why:"Elastic when substitutes exist, the good is a luxury, and it takes a large share of income. Inelastic when it is a necessity with no substitute and costs little." }

];

/* ── Data Detective ─────────────────────────────────────────────────── */
ECON.DATA.data_core = [

{ id:"dd-001", mod:"H3", topic:"Inflation", title:"CPI and the cash rate", diff:3,
  kind:"line", xLabel:"Year", yLabel:"Per cent",
  series:[
    { name:"Underlying inflation", points:[[1,1.6],[2,2.1],[3,3.4],[4,6.1],[5,4.2],[6,3.1],[7,2.6]] },
    { name:"Cash rate", points:[[1,0.75],[2,0.1],[3,0.1],[4,3.1],[5,4.35],[6,4.1],[7,3.6]] }
  ],
  questions:[
    { q:"In which year did underlying inflation peak?", options:["Year 4","Year 5","Year 3","Year 7"], answer:0,
      why:"The inflation series reaches 6.1% in year 4 and falls in every year after that.",
      distractors:{1:"Inflation had already fallen to 4.2% by year 5.",2:"Year 3 is high but below the year 4 figure.",3:"Year 7 is the lowest point after the peak."} },
    { q:"What does the timing of the cash rate series suggest?", options:["Policy responded to inflation with a lag of about a year","Policy caused the inflation by moving first","The two series are entirely unrelated to each other","The cash rate was raised before inflation began rising"], answer:0,
      why:"Inflation rises from year 2 and the cash rate does not move materially until year 4, then keeps rising into year 5. That lag is characteristic of monetary policy responding to data.",
      distractors:{1:"The cash rate was at a record low while inflation was rising, so it cannot have caused it by tightening.",2:"They move together with a clear offset, which is not the pattern of unrelated series.",3:"The cash rate is still at 0.1% in year 3 while inflation is at 3.4%."} },
    { q:"By how many percentage points did the cash rate rise between year 3 and year 5?", options:["4.25","4.35","3.1","0.1"], answer:0,
      why:"4.35 − 0.1 = 4.25 percentage points, one of the fastest tightening cycles on record.",
      distractors:{1:"That is the year 5 level, not the change.",2:"That is the year 4 level.",3:"That is the year 3 level."} }
  ] },

{ id:"dd-002", mod:"H2", topic:"Balance of payments", title:"Current account components", diff:3,
  kind:"table", columns:["Component","$ billion"],
  rows:[["Exports of goods and services","+620"],["Imports of goods and services","−560"],["Net primary income","−85"],["Net secondary income","−3"]],
  questions:[
    { q:"What is the balance on goods and services?", options:["+$60 billion","−$60 billion","+$1180 billion","−$88 billion"], answer:0,
      why:"620 − 560 = +60. Exports exceed imports, so there is a surplus on goods and services.",
      distractors:{1:"The sign is reversed; exports are larger.",2:"That adds the two rather than subtracting.",3:"That is the sum of the two income components."} },
    { q:"What is the current account balance?", options:["−$28 billion","+$60 billion","−$88 billion","+$148 billion"], answer:0,
      why:"620 − 560 − 85 − 3 = −28. A surplus on goods and services is more than offset by the primary income deficit.",
      distractors:{1:"That is the goods and services balance alone, ignoring income.",2:"That is the income components alone.",3:"That treats the deficits as positive figures."} },
    { q:"What best explains the large net primary income deficit?", options:["Interest and dividends paid on past foreign borrowing and investment","A shortfall in the value of Australian exports this year","Foreign aid payments made by the Australian government","The purchase of overseas assets by Australian investors"], answer:0,
      why:"Primary income records the servicing cost of foreign liabilities. Decades of borrowing and foreign ownership mean large ongoing outflows regardless of this year's trade.",
      distractors:{1:"Exports are in surplus in this table.",2:"Aid is secondary income, which is only −3.",3:"Asset purchases are financial account transactions."} }
  ] },

{ id:"dd-003", mod:"P3", topic:"Elasticity", title:"Price changes and total revenue", diff:2,
  kind:"table", columns:["Price ($)","Quantity sold","Total revenue ($)"],
  rows:[["10","1000","10 000"],["12","900","10 800"],["14","760","10 640"],["16","600","9 600"],["18","420","7 560"]],
  questions:[
    { q:"Over which price range is demand inelastic?", options:["$10 to $12","$14 to $16","$16 to $18","$12 to $18"], answer:0,
      why:"Revenue rises from $10 000 to $10 800 as price rises, so quantity fell proportionally less than price rose. That is inelastic demand.",
      distractors:{1:"Revenue falls over this range, indicating elastic demand.",2:"Revenue falls sharply, so demand is clearly elastic.",3:"Revenue falls overall across this wider range."} },
    { q:"At which price is total revenue greatest?", options:["$12","$10","$14","$16"], answer:0,
      why:"Revenue peaks at $10 800 when price is $12. Beyond that the fall in quantity outweighs the rise in price.",
      distractors:{1:"Revenue at $10 is $10 000, slightly lower.",2:"Revenue at $14 has already begun to fall.",3:"Revenue at $16 is well below the peak."} },
    { q:"What happens to elasticity as price rises along this demand schedule?", options:["Demand becomes progressively more elastic","Demand becomes progressively more inelastic","Elasticity stays constant at every price","Demand becomes perfectly inelastic at high prices"], answer:0,
      why:"Each $2 price rise is a smaller percentage change while the quantity falls grow larger in percentage terms, so the elasticity ratio rises as you move up the schedule.",
      distractors:{1:"Revenue falling at higher prices is the signature of increasing elasticity.",2:"Revenue would be constant at every price if elasticity were unit throughout.",3:"Quantity keeps falling substantially, so demand is not perfectly inelastic."} }
  ] },

{ id:"dd-004", mod:"H3", topic:"Unemployment", title:"Labour force indicators", diff:3,
  kind:"table", columns:["Year","Employed (m)","Unemployed (m)","Not in labour force (m)"],
  rows:[["1","12.6","0.72","6.4"],["2","12.1","1.05","6.7"],["3","12.4","0.86","6.6"],["4","13.0","0.61","6.5"]],
  questions:[
    { q:"In which year was the unemployment rate highest?", options:["Year 2","Year 1","Year 3","Year 4"], answer:0,
      why:"1.05 ÷ (12.1 + 1.05) = 8.0%, the highest of the four. Employment also fell that year, which confirms a downturn.",
      distractors:{1:"Year 1 gives about 5.4%.",2:"Year 3 gives about 6.5%.",3:"Year 4 gives about 4.5%, the lowest."} },
    { q:"What happened to the participation rate between year 1 and year 2?", options:["It fell, as people left the labour force","It rose, as more people sought work","It was unchanged across the two years","It cannot be calculated from this table"], answer:0,
      why:"The labour force fell from 13.32m to 13.15m while those not in it rose from 6.4m to 6.7m, so a smaller share of the working-age population was participating.",
      distractors:{1:"The number not in the labour force rose, which is the opposite.",2:"Both components changed, so it cannot be unchanged.",3:"All three columns are given, so it can be calculated."} },
    { q:"Why might the year 2 unemployment rate understate the weakness of the labour market?", options:["Discouraged workers left the labour force and are not counted","The employed figure includes people working only one hour a week","Unemployment benefits were not paid to everyone that year","The table does not include people under working age"], answer:0,
      why:"The 'not in labour force' column rose by 0.3m in the same year employment fell. Those people are hidden unemployment: they want work but have stopped searching, so the headline rate misses them.",
      distractors:{1:"That is true of the definition generally but is not what changed between the two years.",2:"Benefit eligibility does not affect the ABS labour force classification.",3:"The working-age restriction applies to every year equally."} }
  ] },

{ id:"dd-005", mod:"H1", topic:"Inequality", title:"Income shares by quintile", diff:2,
  kind:"table", columns:["Quintile","Share of income (%)","Cumulative share (%)"],
  rows:[["Lowest","7","7"],["Second","12","19"],["Third","17","36"],["Fourth","23","59"],["Highest","41","100"]],
  questions:[
    { q:"What share of income goes to the bottom 40% of the population?", options:["19%","7%","36%","12%"], answer:0,
      why:"The cumulative column reads 19% at the end of the second quintile, which covers the bottom 40%.",
      distractors:{1:"That is the lowest quintile alone, the bottom 20%.",2:"That is the bottom 60%.",3:"That is the second quintile alone."} },
    { q:"What would the cumulative column look like under perfect equality?", options:["20, 40, 60, 80, 100","7, 19, 36, 59, 100","0, 25, 50, 75, 100","100 in every row of the table"], answer:0,
      why:"Perfect equality means each 20% of the population receives 20% of income, so the cumulative shares rise in equal steps — the 45-degree line on a Lorenz curve.",
      distractors:{1:"That is the actual distribution shown in the table.",2:"That would give the bottom quintile no income at all.",3:"Cumulative shares must rise gradually to 100."} },
    { q:"Comparing the actual and equal distributions, the Lorenz curve for this economy would", options:["sag below the diagonal, with a positive Gini coefficient","lie exactly on the diagonal, with a Gini of zero","bow above the diagonal, with a negative Gini coefficient","be a vertical line at the highest quintile"], answer:0,
      why:"Every cumulative figure is below the equal-distribution value, so the curve lies under the diagonal. The area between them, over the whole triangle, is the Gini coefficient.",
      distractors:{1:"That would require the actual and equal columns to match, which they do not.",2:"A Lorenz curve cannot lie above the diagonal, and the Gini is never negative.",3:"A vertical line would mean one group received all income."} }
  ] }

];
