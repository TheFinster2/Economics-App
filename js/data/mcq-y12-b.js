/* Multiple choice — HSC course, second pass.

   Scenario-led. See mcq-y11.js for the two rules validate.js enforces. */

window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.mcq_h1b = [

{ id:"hb-101", mod:"H1", topic:"Trade theory", diff:3,
  q:"Country A can produce 10 tonnes of wheat or 5 cars with its resources. Country B can produce 6 tonnes of wheat or 6 cars. Country A should specialise in",
  options:["wheat, since its opportunity cost per tonne is half a car","cars, because it can produce more of both goods overall","cars, since it has an absolute advantage in car production","neither good, because it is more productive in both of them"], answer:0,
  why:"A gives up 0.5 cars per tonne of wheat; B gives up 1 car per tonne. A's opportunity cost is lower, so A specialises in wheat and B in cars, and both can consume beyond their own frontiers.",
  distractors:{1:"Being better at both is absolute advantage, which does not determine specialisation.",2:"A produces fewer cars than B, so it has no absolute advantage there.",3:"Gains from trade exist whenever opportunity costs differ, which they do here."},
  misconception:"Work out what each country gives up. The lower sacrifice wins, regardless of who is more productive." },

{ id:"hb-102", mod:"H1", topic:"Protection", diff:3, tags:["protection"],
  q:"The infant industry argument for protection is weakest when",
  options:["the protection is never withdrawn as the industry matures","the industry genuinely has large economies of scale to capture","the protection is announced with a fixed timetable for removal","the industry faces established foreign firms with lower costs"], answer:0,
  why:"The argument depends entirely on protection being temporary. A permanently sheltered industry never faces the pressure that would make it efficient, and the cost to consumers becomes permanent too.",
  distractors:{1:"Scale economies are exactly the condition the argument relies on.",2:"A credible sunset clause is what makes the argument defensible.",3:"That is the situation the argument is designed to address."},
  misconception:"" },

{ id:"hb-103", mod:"H1", topic:"Development", diff:3,
  q:"Two economies have identical GDP per capita but very different HDI scores. The most likely explanation is that",
  options:["one invests far more of its income in health and education","one has a substantially larger total population than the other","the HDI double-counts income, so identical incomes cannot differ","one measures its GDP in a different currency from the other"], answer:0,
  why:"Income is only one of three HDI components. An economy that converts income into life expectancy and schooling scores higher than one with the same income and worse outcomes.",
  distractors:{1:"Both measures are per head, so population size cancels out.",2:"Income appears once, alongside two independent components.",3:"The HDI uses purchasing-power-adjusted income precisely to remove that."},
  misconception:"" },

{ id:"hb-104", mod:"H1", topic:"Globalisation", diff:3, tags:["globalisation"],
  q:"A transnational corporation moves production to a low-wage economy. For the host economy, the clearest BENEFIT is",
  options:["employment and technology transfer that raises local productivity","a guaranteed permanent increase in domestic wage rates","complete protection from any future global economic downturn","full ownership of the profits that the operation generates"], answer:0,
  why:"FDI brings capital, management practices and technical knowledge alongside jobs. Those spill over into local firms and are the mechanism by which host economies actually gain.",
  distractors:{1:"Wages may rise, but nothing about FDI guarantees it permanently.",2:"Export-oriented production increases exposure to global downturns rather than reducing it.",3:"Profits are largely repatriated to the parent company."},
  misconception:"" },

{ id:"hb-105", mod:"H1", topic:"Inequality", diff:3,
  q:"Global inequality BETWEEN countries has narrowed while inequality WITHIN many countries has widened. This is best explained by",
  options:["rapid growth in large developing economies alongside rising returns to skills","a fall in world trade volumes over the last three decades","aid transfers being distributed evenly across all populations","an increase in average tariff rates across developing economies"], answer:0,
  why:"China and India growing far faster than rich economies compresses the gap between countries. Within economies, globalisation and technology raised returns to capital and to skilled labour faster than to unskilled labour.",
  distractors:{1:"Trade volumes have grown substantially over the period.",2:"Aid is small relative to growth and is not evenly distributed.",3:"Tariffs have fallen rather than risen."},
  misconception:"Between-country and within-country inequality are different measures and can move in opposite directions at once." },

{ id:"hb-106", mod:"H1", topic:"Global institutions", diff:2,
  q:"An economy facing a balance of payments crisis would most likely approach",
  options:["the International Monetary Fund for emergency lending","the World Trade Organization for a dispute settlement ruling","the World Bank for a long-term infrastructure development loan","the United Nations for a resolution on trade policy reform"], answer:0,
  why:"The IMF exists to lend to members facing short-term external payment difficulties, usually with conditions attached to the loan.",
  distractors:{1:"The WTO settles trade disputes and does not lend money.",2:"World Bank lending is for long-term development, not crisis liquidity.",3:"The UN does not provide balance of payments finance."},
  misconception:"" }

];

ECON.DATA.mcq_h2b = [

{ id:"hb-201", mod:"H2", topic:"Exchange rates", diff:3,
  q:"Australian interest rates rise relative to those overseas. In the foreign exchange market this causes",
  options:["demand for Australian dollars to increase, so the dollar appreciates","supply of Australian dollars to increase sharply, so the dollar depreciates","both demand and supply to fall, leaving the exchange rate unchanged","the Reserve Bank to be legally required to intervene in the market"], answer:0,
  why:"Higher relative returns attract foreign capital seeking Australian assets. Foreigners must buy Australian dollars to do so, which shifts demand right and lifts the exchange rate.",
  distractors:{1:"Higher domestic returns discourage Australians from investing overseas, which reduces supply rather than increasing it.",2:"Capital flows respond strongly to interest rate differentials.",3:"Australia floats its currency; intervention is occasional and discretionary."},
  misconception:"" },

{ id:"hb-202", mod:"H2", topic:"Terms of trade", diff:3,
  q:"Australia's terms of trade rise sharply during a commodity boom. A likely consequence is",
  options:["an appreciation of the dollar that squeezes non-mining exporters","an immediate fall in national income despite higher export prices","a permanent improvement in the terms of trade at the new level","a reduction in the value of Australian resource exports overseas"], answer:0,
  why:"Higher export prices raise demand for Australian dollars, lifting the exchange rate. Manufacturing and tourism, whose prices did not rise, become less competitive — the two-speed or Dutch disease effect.",
  distractors:{1:"Higher export prices raise national income, not lower it.",2:"Commodity prices are cyclical; terms of trade booms have historically reversed.",3:"Higher prices raise the value of resource exports."},
  misconception:"A commodity boom helps the resource sector and hurts every other exporter through the exchange rate." },

{ id:"hb-203", mod:"H2", topic:"Balance of payments", diff:3, tags:["bop"],
  q:"Which would DIRECTLY reduce Australia's net primary income deficit?",
  options:["Australian firms earning more profit from their overseas subsidiaries","An increase in the volume of Australian mineral exports","A sustained rise in the price of the goods Australia imports from overseas","A larger inflow of foreign direct investment into Australia"], answer:0,
  why:"Primary income records income earned on assets. Profits flowing IN from Australian-owned assets abroad are a credit, which offsets the interest and dividends flowing out.",
  distractors:{1:"Export volumes affect the balance on goods, a different component.",2:"Import prices affect the balance on goods and services.",3:"More foreign investment increases future outflows of dividends, widening the deficit."},
  misconception:"" },

{ id:"hb-204", mod:"H2", topic:"Exchange rates", diff:3,
  q:"A depreciation of the Australian dollar raises the Australian-dollar value of debt denominated in US dollars. This is called",
  options:["the valuation effect, which worsens the recorded debt position","the J-curve effect, which delays the improvement in trade","crowding out, which reduces private sector investment","the multiplier effect, which amplifies the initial change"], answer:0,
  why:"The debt is unchanged in US dollars, but it now takes more Australian dollars to repay. The stock of foreign debt rises on the books without any new borrowing having occurred.",
  distractors:{1:"The J-curve concerns the timing of trade volumes, not the value of debt.",2:"Crowding out is a domestic interest rate effect.",3:"The multiplier concerns income responding to injections."},
  misconception:"" },

{ id:"hb-205", mod:"H2", topic:"Free trade agreements", diff:3,
  q:"A criticism of Australia's bilateral free trade agreements is that they",
  options:["create a complex web of different rules of origin for exporters","have raised average tariffs on goods entering Australia","apply only to services and exclude every single category of traded goods","are prohibited under World Trade Organization rules"], answer:0,
  why:"Each agreement sets its own rules for which goods qualify, so exporters must navigate many overlapping regimes. The resulting compliance burden is the 'noodle bowl' problem.",
  distractors:{1:"They lower tariffs between the parties rather than raising them.",2:"They cover goods, services and often investment.",3:"The WTO permits them under specific provisions."},
  misconception:"" },

{ id:"hb-206", mod:"H2", topic:"Foreign liabilities", diff:3, tags:["bop"],
  q:"Australia's foreign debt is considered less risky than the headline figure suggests mainly because",
  options:["most of it is private, hedged, and borrowed in Australian dollars","the Commonwealth government guarantees every private borrowing","the debt is repayable only when Australia chooses to repay it","foreign lenders cannot enforce their claims against Australian firms"], answer:0,
  why:"Debt borrowed in Australian dollars, or hedged into them, carries no exchange rate risk for the borrower, and private borrowers bear their own credit risk rather than the taxpayer.",
  distractors:{1:"There is no such general guarantee, and one would create serious moral hazard.",2:"Debt has contractual repayment dates.",3:"Foreign lenders have ordinary enforceable contractual rights."},
  misconception:"" }

];

ECON.DATA.mcq_h3b = [

{ id:"hb-301", mod:"H3", topic:"Economic growth", diff:3,
  q:"Real GDP grows by 2.4% while the population grows by 1.6%. Real GDP per capita has grown by approximately",
  options:["0.8%","4.0%","1.5%","2.4%"], answer:0,
  why:"Per capita growth is roughly total growth less population growth: 2.4 − 1.6 = 0.8%. Output is rising, but there are more people to share it among.",
  distractors:{1:"Adding the two treats population growth as though it raised income per head.",2:"That divides the two rates rather than subtracting.",3:"That ignores population growth entirely."},
  misconception:"Strong headline growth with strong population growth can still mean stagnant living standards." },

{ id:"hb-302", mod:"H3", topic:"Inflation", diff:3,
  q:"Which combination is hardest for a central bank to respond to?",
  options:["Rising inflation with rising unemployment, caused by a supply shock","Rising inflation with falling unemployment, in a strong expansion","Falling inflation with falling unemployment, after a productivity gain","Falling inflation with rising unemployment, in a demand-driven downturn"], answer:0,
  why:"Stagflation puts the two objectives in direct conflict. Raising rates worsens unemployment, cutting them worsens inflation, and demand-side policy cannot fix a supply-side cause.",
  distractors:{1:"Tightening addresses both, since cooling demand eases inflation.",2:"That combination is the ideal one and needs no correction.",3:"Easing addresses both, since stimulating demand raises employment."},
  misconception:"" },

{ id:"hb-303", mod:"H3", topic:"Unemployment", diff:3,
  q:"The unemployment rate falls from 5.2% to 4.8% while the participation rate falls from 66.5% to 65.2%. This suggests",
  options:["some of the fall reflects people leaving the labour force, not finding work","a strong labour market with no complicating factors at all","a rise in the working-age population over the same period","that both of the two statistics must have been measured incorrectly this quarter"], answer:0,
  why:"A falling participation rate removes people from the denominator. Some of the improvement is discouraged workers being reclassified rather than jobs being created.",
  distractors:{1:"The falling participation rate is exactly the complicating factor.",2:"Population change affects both rates and does not explain the divergence.",3:"The pattern is common and is not evidence of measurement error."},
  misconception:"Never read the unemployment rate without the participation rate beside it." },

{ id:"hb-304", mod:"H3", topic:"Inequality", diff:3,
  q:"Australia's tax and transfer system reduces measured inequality mainly because",
  options:["progressive income tax and means-tested transfers redistribute income","the GST takes a larger share of income from higher earners","every household receives an identical cash payment each year","company tax is levied at a steeply progressive rate on all businesses"], answer:0,
  why:"Progressive rates take proportionally more from high incomes while means-tested payments direct support to low incomes. The two together compress the distribution substantially.",
  distractors:{1:"The GST is regressive against income, so it widens inequality slightly.",2:"Transfers are targeted rather than universal, which is what makes them effective.",3:"Company tax in Australia is a flat rate."},
  misconception:"" },

{ id:"hb-305", mod:"H3", topic:"Environmental sustainability", diff:3, tags:["market-failure"],
  q:"The tragedy of the commons describes a situation in which",
  options:["a shared resource is overused because each user gains all the benefit","a public good is over-supplied by a government agency","a private firm invests too much in protecting the environment","a market allocates a resource to whoever values it most highly"], answer:0,
  why:"Each user takes the full private benefit while the cost of depletion is shared across everyone. Ocean fisheries and common grazing land are the standard examples, and defining property rights or a quota is the usual remedy.",
  distractors:{1:"The problem is over-USE by many parties, not over-supply by one.",2:"Under-investment in protection is the problem, not over-investment.",3:"Efficient allocation is what the tragedy prevents."},
  misconception:"" },

{ id:"hb-306", mod:"H3", topic:"Inflation", diff:3,
  q:"Inflation redistributes real income from",
  options:["lenders on fixed rates to borrowers, whose repayments fall in real terms","borrowers to lenders, because the amount repaid is worth more","employers to employees, because wages always keep pace with prices","exporters to importers, because import prices fall as inflation rises"], answer:0,
  why:"A fixed-rate loan is repaid in dollars that buy less than the dollars borrowed. The borrower gains and the lender loses in real terms, which is why unexpected inflation matters more than expected inflation.",
  distractors:{1:"This reverses the effect: repayments are worth less, not more.",2:"Real wages fall when prices outrun nominal wages, which is common.",3:"Domestic inflation makes imports relatively cheaper, not dearer."},
  misconception:"" }

];

ECON.DATA.mcq_h4b = [

{ id:"hb-401", mod:"H4", topic:"Monetary policy", diff:3, tags:["policy"],
  q:"Monetary policy is described as a blunt instrument because it",
  options:["affects the whole economy rather than any one region or sector","can only be changed once in every calendar year by law","has no effect at all on the level of aggregate demand","is set by the government rather than an independent authority"], answer:0,
  why:"A single cash rate applies everywhere. A rise aimed at a booming property market also hits a struggling regional manufacturer, which is why targeted problems need targeted policy.",
  distractors:{1:"The Reserve Bank board meets and can move rates many times a year.",2:"Influencing aggregate demand is exactly what it does.",3:"It is set by an independent Reserve Bank, not by government."},
  misconception:"" },

{ id:"hb-402", mod:"H4", topic:"Fiscal policy", diff:3, tags:["policy"],
  q:"Financing a budget deficit by borrowing from the domestic private sector may cause",
  options:["crowding out, as higher interest rates deter private investment","an immediate increase in Australia's net foreign debt position","a fall in the money supply that reduces the rate of inflation","the Reserve Bank to be required to purchase the new debt"], answer:0,
  why:"Government competing for the same pool of savings pushes interest rates up, which discourages private investment. The effect is largest when the economy is near capacity and small when there is spare capacity.",
  distractors:{1:"Borrowing domestically does not add to foreign debt.",2:"Domestic borrowing transfers funds rather than destroying money.",3:"The Reserve Bank is not obliged to purchase government debt."},
  misconception:"" },

{ id:"hb-403", mod:"H4", topic:"Policy mix", diff:3, tags:["policy"],
  q:"During a deep recession with the cash rate already near zero, the most useful policy response is",
  options:["expansionary fiscal policy, since interest rates have little room left","further monetary tightening in order to restore confidence in the currency","waiting for automatic stabilisers alone to resolve the downturn","microeconomic reform, which acts quickly on aggregate demand"], answer:0,
  why:"With the cash rate at its effective lower bound, monetary policy has little conventional room. Direct government spending adds to demand without relying on borrowers responding to a rate cut.",
  distractors:{1:"Tightening in a recession would deepen it.",2:"Automatic stabilisers help but are rarely sufficient in a deep downturn.",3:"Microeconomic reform works on supply and acts over years."},
  misconception:"" },

{ id:"hb-404", mod:"H4", topic:"Microeconomic policy", diff:3, tags:["policy"],
  q:"Which is the clearest example of microeconomic reform?",
  options:["Removing barriers to entry in the electricity retail market","Cutting the cash rate in order to stimulate household borrowing","Increasing unemployment benefits during a downturn","Announcing a temporary cash payment to all households"], answer:0,
  why:"Micro reform targets efficiency in a specific market. Increasing competition in electricity retail lowers prices and improves service without changing aggregate spending directly.",
  distractors:{1:"That is monetary policy acting on aggregate demand.",2:"That is fiscal policy and an automatic stabiliser.",3:"That is discretionary fiscal stimulus."},
  misconception:"" },

{ id:"hb-405", mod:"H4", topic:"Environmental policy", diff:3, tags:["market-failure","policy"],
  q:"A carbon tax and a tradeable permit scheme differ in that a carbon tax fixes",
  options:["the price of emitting, leaving the quantity of emissions uncertain","the quantity of emissions, leaving the price of permits uncertain","both the price and the quantity of emissions simultaneously","neither the price nor the quantity, relying on voluntary action"], answer:0,
  why:"A tax sets the price per tonne and lets firms decide how much to abate. A cap-and-trade scheme sets the total quantity and lets the market discover the price. Which is preferable depends on whether certainty about emissions or about cost matters more.",
  distractors:{1:"That describes the permit scheme, not the tax.",2:"No instrument can fix both at once.",3:"Both impose a real, enforceable cost."},
  misconception:"Price instrument or quantity instrument. You can fix one, and the other then floats." },

{ id:"hb-406", mod:"H4", topic:"Fiscal policy", diff:3, tags:["policy"],
  q:"An economy runs deficits every year for a decade while nominal GDP grows faster than debt. Over that period, public debt as a share of GDP",
  options:["falls, because the denominator grew faster than the numerator","rises, because a deficit always increases the debt-to-GDP ratio","stays constant, since deficits and growth exactly offset","cannot be determined without knowing the inflation rate"], answer:0,
  why:"The ratio depends on both terms. Debt can grow in dollars while shrinking relative to the economy, which is how several countries reduced wartime debt burdens without ever running a surplus.",
  distractors:{1:"A deficit raises the dollar amount of debt, not necessarily the ratio.",2:"Nothing here says the two rates are equal.",3:"Nominal GDP growth already includes inflation."},
  misconception:"Debt sustainability is about the RATIO. Growing out of debt is a real strategy, not a trick." }

];
