/* Multiple choice — HSC course (H1–H4).

   Same two rules as the Preliminary file: every distractor carries a reason,
   and option lengths are balanced so that "pick the longest" is not a
   strategy. See the header of mcq-y11.js. */

window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.mcq_h1 = [

{ id:"h1-001", mod:"H1", topic:"Globalisation", diff:2, tags:["globalisation"],
  q:"Which is the clearest evidence of increasing globalisation over recent decades?",
  options:["World trade has grown faster than world output","Average tariff rates have risen across most economies","The number of separate national currencies has increased","Migration between countries has fallen substantially"], answer:0,
  why:"If trade grows faster than output, a rising share of what is produced crosses a border. That is precisely what deepening integration means.",
  distractors:{1:"Tariffs have fallen substantially, which is a cause of globalisation rather than evidence against it.",2:"The number of currencies is unrelated to how integrated economies are.",3:"Labour migration has increased, not fallen."},
  misconception:"" },

{ id:"h1-002", mod:"H1", topic:"Trade theory", diff:3,
  q:"Two countries can both gain from trade even when one produces everything more cheaply, because gains depend on",
  options:["comparative advantage, which compares opportunity costs","absolute advantage, which compares output produced per worker employed","the relative size of the two economies involved","which country has the larger population of consumers"], answer:0,
  why:"A country should specialise where its opportunity cost is lowest. Even a country worse at everything is relatively less bad at something, so both sides can consume beyond their own production possibilities.",
  distractors:{1:"Absolute advantage cannot explain trade when one country holds it in every good.",2:"Economy size affects the volume of trade, not whether gains exist.",3:"Population determines market size, not the direction of specialisation."},
  misconception:"Comparative advantage is about what you give up, not about what you are best at." },

{ id:"h1-003", mod:"H1", topic:"Protection", diff:2, tags:["protection"],
  q:"A tariff on imported steel would be expected to",
  options:["raise the domestic price and increase domestic production","lower the domestic price and increase the volume of steel imported","have no effect on the domestic price of steel","reduce production costs for domestic steel-using firms"], answer:0,
  why:"A tariff is a tax on imports, so the landed price rises. Domestic producers can then sell more at a higher price, which is the intended protective effect.",
  distractors:{1:"A tariff raises rather than lowers the price of imports.",2:"If price were unchanged the tariff would be providing no protection.",3:"Firms that USE steel face higher input costs, not lower."},
  misconception:"Protection helps the protected industry and hurts every industry downstream of it." },

{ id:"h1-004", mod:"H1", topic:"Protection", diff:3, tags:["protection"],
  q:"The main difference in effect between a tariff and an import quota is that a tariff",
  options:["generates revenue for government, while a quota does not","limits the quantity imported, while a quota limits the price","applies only to services, while a quota applies to goods","lowers the domestic price, while a quota raises it"], answer:0,
  why:"Both restrict imports and raise the domestic price. The tariff collects the difference as government revenue, whereas under a quota that margin accrues to whoever holds the import licence.",
  distractors:{1:"This reverses the two: a quota limits quantity, a tariff works through price.",2:"Both instruments are applied mainly to goods.",3:"Both raise the domestic price rather than lowering it."},
  misconception:"" },

{ id:"h1-005", mod:"H1", topic:"Development", diff:3,
  q:"The Human Development Index is preferred to GDP per capita as a development measure because it",
  options:["includes health and education alongside income per head","adjusts national income for the prevailing rate of inflation","measures how income is distributed within a given country","counts unpaid household work in national output"], answer:0,
  why:"Development is broader than output. The HDI combines gross national income per head with life expectancy and years of schooling, so a country cannot score well on income alone.",
  distractors:{1:"Real GDP per capita is already inflation-adjusted; that is not the improvement.",2:"The HDI is an average and does not itself capture distribution, which is what the Gini coefficient measures.",3:"Unpaid work is excluded from both measures."},
  misconception:"" },

{ id:"h1-006", mod:"H1", topic:"Inequality", diff:3,
  q:"A Lorenz curve that moves further away from the 45-degree line indicates",
  options:["greater inequality in the distribution of income","a rise in the average level of national income","faster growth in the country's real GDP","a fall in the proportion of people below the poverty line"], answer:0,
  why:"The diagonal represents perfect equality, where each population share receives an equal income share. The further the curve sags below it, the more unequal the distribution, and the higher the Gini coefficient.",
  distractors:{1:"The curve shows distribution only; the average level does not appear on it.",2:"Growth is not represented on a Lorenz curve.",3:"A poverty measure is a separate statistic and can move independently."},
  misconception:"" },

{ id:"h1-007", mod:"H1", topic:"Global institutions", diff:2,
  q:"The primary role of the World Trade Organization is to",
  options:["administer trade agreements and settle disputes between members","lend to member countries that face a balance of payments crisis","set the exchange rates that apply between member currencies","provide development aid to the world's poorest economies"], answer:0,
  why:"The WTO provides the rules-based framework for trade and a dispute settlement process members agree to be bound by. It negotiates liberalisation rather than lending or granting aid.",
  distractors:{1:"Emergency lending is the role of the International Monetary Fund.",2:"Exchange rates are set by markets or by national authorities.",3:"Development lending is the World Bank's function."},
  misconception:"" },

{ id:"h1-008", mod:"H1", topic:"Globalisation", diff:3, tags:["globalisation"],
  q:"A criticism of globalisation is that its benefits have been distributed unevenly. The strongest evidence for this is that",
  options:["income gaps have widened within many economies even as global poverty fell","world trade volumes have fallen every year since liberalisation began","no developing economy has raised its income per head in recent decades","average tariffs have increased in every major economy over the last twenty years"], answer:0,
  why:"Both things are true at once: hundreds of millions have left extreme poverty, and inequality within many countries has widened as returns flowed to capital and skilled labour. The evidence cuts both ways, which is what makes the debate real.",
  distractors:{1:"Trade volumes have grown substantially over the period.",2:"Several developing economies have raised incomes dramatically, China most obviously.",3:"Average tariffs have fallen rather than risen."},
  misconception:"An honest assessment of globalisation has to hold both findings at once rather than choosing the convenient one." }

];

ECON.DATA.mcq_h2 = [

{ id:"h2-001", mod:"H2", topic:"Balance of payments", diff:2, tags:["bop"],
  q:"Which transaction is recorded in the current account of Australia's balance of payments?",
  options:["Interest paid to overseas holders of Australian bonds","An overseas firm purchasing an Australian office building","An Australian bank borrowing funds from a foreign lender","A foreign investor buying shares in an Australian company"], answer:0,
  why:"The current account records goods, services, primary income and secondary income. Interest paid abroad is primary income — a servicing cost on past borrowing, not a new transaction in assets.",
  distractors:{1:"Buying property is a financial account transaction in assets.",2:"Borrowing creates a liability and is recorded in the financial account.",3:"Share purchases are portfolio investment in the financial account."},
  misconception:"Income FROM assets is current account. Buying or selling the assets themselves is financial account." },

{ id:"h2-002", mod:"H2", topic:"Balance of payments", diff:3, tags:["bop"],
  q:"A persistent current account deficit must be matched by",
  options:["a surplus on the capital and financial account","a budget deficit of the same size","a depreciation of the exchange rate each year","an equal deficit in the terms of trade"], answer:0,
  why:"The balance of payments balances by construction under a floating exchange rate. A country spending more abroad than it earns must be selling assets or borrowing to finance it, which is a financial account inflow.",
  distractors:{1:"The budget balance and the external balance are separate accounts that need not match.",2:"A deficit may persist for decades without continuous depreciation.",3:"The terms of trade is a price ratio, not an account with a balance."},
  misconception:"" },

{ id:"h2-003", mod:"H2", topic:"Exchange rates", diff:2,
  q:"An appreciation of the Australian dollar would be expected to",
  options:["make imports cheaper and exports less competitive overseas","make exports cheaper and imports more expensive at home","raise the domestic price of both exports and imports","have no effect on the price of internationally traded goods"], answer:0,
  why:"A stronger dollar buys more foreign currency, so imports cost less in Australian dollars. The same dollar makes Australian goods cost more in foreign currency, so export competitiveness falls.",
  distractors:{1:"This describes a depreciation, not an appreciation.",2:"Import prices fall rather than rise when the currency strengthens.",3:"The exchange rate is precisely what translates between domestic and foreign prices."},
  misconception:"Strong dollar: good for importers and travellers, bad for exporters and import-competing firms." },

{ id:"h2-004", mod:"H2", topic:"Exchange rates", diff:3,
  q:"A depreciation often worsens the trade balance before improving it. This pattern is called",
  options:["the J-curve effect, because volumes adjust more slowly than prices","the valuation effect, because foreign debt is revalued upward","the terms of trade effect, because export prices are index-linked","crowding out, because government borrowing displaces private borrowing"], answer:0,
  why:"Immediately after a depreciation, contracts are already priced, so the same volume of imports simply costs more. Only as buyers respond over months do volumes shift and the balance improve.",
  distractors:{1:"The valuation effect is about the Australian-dollar value of foreign-currency debt, not trade volumes.",2:"The terms of trade measures a price ratio and does not describe this timing pattern.",3:"Crowding out concerns domestic investment and interest rates."},
  misconception:"" },

{ id:"h2-005", mod:"H2", topic:"Terms of trade", diff:2,
  q:"Australia's terms of trade improve when",
  options:["export prices rise relative to import prices","the volume of exports rises relative to imports","the exchange rate depreciates against major currencies","the current account deficit narrows over the year"], answer:0,
  why:"The terms of trade is an index of export prices divided by import prices. An improvement means each unit of exports buys more imports, which raises national income even if volumes are unchanged.",
  distractors:{1:"Volumes affect the trade balance, not the price ratio.",2:"A depreciation changes prices in both directions and does not define the index.",3:"The current account balance is a separate measure."},
  misconception:"Terms of trade is about PRICES. The trade balance is about values." },

{ id:"h2-006", mod:"H2", topic:"Foreign liabilities", diff:3, tags:["bop"],
  q:"Australia's net foreign debt is best described as",
  options:["a stock measured at a point in time, built up by past borrowing","a flow measured over a year, equal to the current account deficit","the total value of Australian assets owned by foreign investors","the difference between export and import values in a given year"], answer:0,
  why:"Debt is a stock: the accumulated outstanding amount. Each year's current account deficit is a flow that adds to it, which is why the two are related but not the same measure.",
  distractors:{1:"The deficit is the annual flow that adds to the stock, not the stock itself.",2:"Foreign ownership of assets is equity, which together with debt makes up net foreign liabilities.",3:"That is the balance on goods, a flow measure."},
  misconception:"Deficit is a flow, debt is a stock. Confusing them is one of the most costly errors in this topic." },

{ id:"h2-007", mod:"H2", topic:"Free trade agreements", diff:3,
  q:"A concern about bilateral free trade agreements is that they may cause trade diversion, which means",
  options:["trade shifts to a partner that is not the lowest-cost world producer","total world trade falls because tariffs are removed too slowly","imports rise faster than exports, worsening the trade balance","the agreement covers services but excludes agricultural goods"], answer:0,
  why:"Preferential access can make a partner's goods cheaper than a more efficient outsider's only because the outsider still faces the tariff. Resources are then allocated on the basis of policy rather than comparative advantage.",
  distractors:{1:"Bilateral agreements generally increase trade rather than reducing it.",2:"A change in the trade balance is a separate issue from diversion.",3:"Coverage gaps are a limitation of such deals, but they are not what diversion means."},
  misconception:"Trade creation is the gain, trade diversion is the loss. A bilateral deal produces both." }

];

ECON.DATA.mcq_h3 = [

{ id:"h3-001", mod:"H3", topic:"Economic growth", diff:2,
  q:"Real GDP is preferred to nominal GDP as a measure of economic growth because it",
  options:["removes the effect of price changes, so it measures volume","includes the value of unpaid work performed in households","accounts for the distribution of income across the population","measures income per person rather than total national output"], answer:0,
  why:"Nominal GDP rises with inflation even when nothing extra is produced. Holding prices constant isolates the change in the quantity of goods and services, which is what growth means.",
  distractors:{1:"Neither measure includes unpaid household work.",2:"Neither measure captures distribution; that requires a Gini coefficient.",3:"Adjusting for population gives GDP per capita, a separate adjustment."},
  misconception:"" },

{ id:"h3-002", mod:"H3", topic:"Inflation", diff:3,
  q:"A sustained rise in the price of imported oil that raises costs across the economy causes",
  options:["cost-push inflation, with output falling as prices rise","demand-pull inflation, with output rising as prices rise","deflation, because households have less to spend on other goods","no inflation, since oil is only one item in the CPI basket"], answer:0,
  why:"A supply-side shock raises production costs across many industries at once. Aggregate supply shifts left, so the price level rises while output falls — the combination that makes it so difficult to respond to.",
  distractors:{1:"Demand-pull inflation comes from spending outrunning capacity, and output rises with prices.",2:"Prices are rising, which is inflation, not deflation.",3:"Oil is an input to transport and production, so its effect spreads far beyond its own weight in the basket."},
  misconception:"Cost-push inflation raises prices AND unemployment, which is why neither fiscal nor monetary policy handles it comfortably." },

{ id:"h3-003", mod:"H3", topic:"Inflation", diff:2,
  q:"The Reserve Bank targets underlying inflation rather than headline inflation because underlying inflation",
  options:["strips out volatile items and shows the persistent trend","is always lower than the headline rate in every quarter","includes items that headline inflation leaves out entirely","is calculated by the Treasury rather than by the ABS"], answer:0,
  why:"Headline CPI swings on petrol prices and seasonal produce, which monetary policy cannot influence and which reverse within months. Removing them shows the trend policy can actually act on.",
  distractors:{1:"Underlying inflation can be above or below the headline rate.",2:"It uses the same basket with volatile components trimmed, not extra items.",3:"Both measures are produced by the Australian Bureau of Statistics."},
  misconception:"" },

{ id:"h3-004", mod:"H3", topic:"Unemployment", diff:3,
  q:"A worker whose manufacturing job was automated and who lacks the skills for available roles is experiencing",
  options:["structural unemployment, caused by a mismatch of skills","cyclical unemployment, caused by weak aggregate demand","frictional unemployment, caused by the time taken to find work","seasonal unemployment, caused by regular annual variation"], answer:0,
  why:"Structural unemployment arises when the jobs available do not match the skills workers have. It persists through the cycle and responds to training and mobility policy, not to demand stimulus.",
  distractors:{1:"Cyclical unemployment disappears when demand recovers; this does not.",2:"Frictional unemployment is short-term job search, not a skills gap.",3:"Seasonal unemployment follows a predictable annual pattern."},
  misconception:"Match the cause to the cure. Stimulus fixes cyclical unemployment and does nothing for structural." },

{ id:"h3-005", mod:"H3", topic:"Unemployment", diff:3,
  q:"The natural rate of unemployment is best described as the rate that",
  options:["remains when the economy is operating at full capacity","would be observed if the government offered a job to everyone","occurs only during the trough of the business cycle","reflects the number of people who choose not to work at all"], answer:0,
  why:"Even at full capacity, people are between jobs, mismatched in skills, or affected by seasonal patterns. That frictional, structural and seasonal residue is the natural rate, and pushing below it generates inflation.",
  distractors:{1:"A guaranteed-job scheme would change the definition of the labour market entirely.",2:"The trough is when CYCLICAL unemployment is at its highest.",3:"People who choose not to work are outside the labour force and are not counted at all."},
  misconception:"" },

{ id:"h3-006", mod:"H3", topic:"Phillips curve", diff:3,
  q:"The short-run Phillips curve suggests that a policy which reduces unemployment below the natural rate will",
  options:["raise inflation, because tighter labour markets push up wages","lower inflation, because more people are earning and saving","leave inflation unchanged, since the two are unrelated","reduce both inflation and unemployment simultaneously"], answer:0,
  why:"When labour is scarce, employers bid wages up to attract staff, and those costs pass into prices. That short-run trade-off is why central banks care about how far unemployment is below the natural rate.",
  distractors:{1:"More saving does not offset the wage pressure from a tight labour market.",2:"The observed short-run relationship is inverse, not absent.",3:"That combination is possible only if the curve itself shifts, through a supply-side improvement."},
  misconception:"The trade-off is short-run. In the long run the curve is close to vertical at the natural rate." },

{ id:"h3-007", mod:"H3", topic:"Inequality", diff:2,
  q:"Which measure would best show whether income inequality in Australia had worsened?",
  options:["A rise in the Gini coefficient over the period","A rise in real GDP per capita over the period","A fall in the unemployment rate over the period","A rise in the consumer price index over the period"], answer:0,
  why:"The Gini coefficient is a direct measure of distribution, running from zero at perfect equality to one at perfect inequality. The others describe the average, the labour market and prices.",
  distractors:{1:"Average income can rise while the distribution worsens.",2:"Lower unemployment usually helps equality, but it is not a measure of it.",3:"The CPI measures prices, not distribution."},
  misconception:"" },

{ id:"h3-008", mod:"H3", topic:"Environmental sustainability", diff:3, tags:["market-failure"],
  q:"Ecologically sustainable development requires that",
  options:["present needs are met without reducing future generations' capacity","economic growth is stopped in order to protect the environment","all natural resources are left completely unused indefinitely","environmental policy is set entirely by international agreement"], answer:0,
  why:"The Brundtland definition is about intergenerational equity: using resources at a rate that does not foreclose the options of those who come later. It permits growth but constrains its composition.",
  distractors:{1:"Sustainability is about the nature of growth, not its prohibition.",2:"Leaving resources entirely unused is neither required nor practical.",3:"Domestic policy plays a major role alongside international agreements."},
  misconception:"" }

];

ECON.DATA.mcq_h4 = [

{ id:"h4-001", mod:"H4", topic:"Fiscal policy", diff:2, tags:["policy"],
  q:"An expansionary fiscal policy stance would be indicated by",
  options:["a budget deficit that is larger than the previous year's","a budget surplus that is larger than the previous year's","an unchanged budget balance across two consecutive years","a fall in government debt as a share of nominal GDP"], answer:0,
  why:"The STANCE is read from the change in the balance, not its level. A deficit growing larger means the budget is adding more to aggregate demand than it did before.",
  distractors:{1:"A growing surplus withdraws demand and is contractionary.",2:"An unchanged balance is a neutral stance.",3:"Falling debt as a share of GDP says nothing directly about this year's stance."},
  misconception:"Read the CHANGE, not the level. A deficit that shrinks is a contractionary stance even though it is still a deficit." },

{ id:"h4-002", mod:"H4", topic:"Fiscal policy", diff:3, tags:["policy"],
  q:"Separating the structural from the cyclical component of the budget matters because it shows",
  options:["how much of the outcome came from deliberate policy decisions","how much of the deficit will be financed by overseas borrowing","which government department is responsible for each dollar spent","whether the Reserve Bank approves of the government's spending"], answer:0,
  why:"Revenue and welfare spending move with the cycle automatically. Stripping that out reveals the underlying position, which is what tells you whether policy is sustainable once the economy returns to trend.",
  distractors:{1:"The financing source is a separate question from the composition of the outcome.",2:"Departmental responsibility is an administrative matter.",3:"The Reserve Bank is independent and does not approve fiscal decisions."},
  misconception:"" },

{ id:"h4-003", mod:"H4", topic:"Monetary policy", diff:2, tags:["policy"],
  q:"To implement a tightening of monetary policy, the Reserve Bank would",
  options:["sell government securities to reduce cash in the banking system","buy government securities to increase cash in the banking system","instruct commercial banks to raise their mortgage rates directly","reduce the level of government spending in the next budget"], answer:0,
  why:"Selling securities drains exchange settlement funds, making cash scarcer, which pushes the overnight rate up to the new target. Domestic market operations are the mechanism; the cash rate is the instrument.",
  distractors:{1:"Buying securities adds cash and eases policy.",2:"The Bank influences rates through the market rather than by direction.",3:"Government spending is fiscal policy, set by the Treasurer."},
  misconception:"" },

{ id:"h4-004", mod:"H4", topic:"Monetary policy", diff:3, tags:["policy"],
  q:"Which is NOT part of the transmission mechanism of monetary policy?",
  options:["The rate of company tax paid on business profits","The cost of borrowing faced by households and firms","The exchange rate and its effect on net exports","Asset prices and the wealth effect on consumption"], answer:0,
  why:"Company tax is a fiscal instrument set in the budget. The transmission mechanism runs through borrowing costs, cash flow, asset prices, the exchange rate and expectations.",
  distractors:{1:"Borrowing cost is the most direct channel of all.",2:"A rate change alters capital flows and so the exchange rate.",3:"Higher asset prices raise wealth and so consumption."},
  misconception:"" },

{ id:"h4-005", mod:"H4", topic:"Policy mix", diff:3, tags:["policy"],
  q:"A limitation shared by both fiscal and monetary policy is that",
  options:["time lags mean the effect may arrive after conditions have changed","neither can influence the level of aggregate demand at all","both are controlled by the same government department","neither has any effect on the rate of inflation over time"], answer:0,
  why:"Recognition, implementation and impact lags mean a policy set for today's problem may take effect a year later, when the problem may have reversed. This is the main argument for gradualism.",
  distractors:{1:"Influencing aggregate demand is precisely what both policies do.",2:"Fiscal policy is set by government; monetary policy by an independent Reserve Bank.",3:"Both affect inflation, which is why the policy mix is debated at all."},
  misconception:"" },

{ id:"h4-006", mod:"H4", topic:"Microeconomic policy", diff:3, tags:["policy"],
  q:"Microeconomic reform differs from fiscal and monetary policy in that it aims primarily to",
  options:["raise aggregate supply by improving efficiency in individual markets","increase aggregate demand quickly during a severe downturn","alter the exchange rate to improve export competitiveness","redistribute income from higher to lower income households"], answer:0,
  why:"Demand-side policies move spending; microeconomic reform moves the economy's capacity. Competition policy, deregulation and infrastructure raise productivity, allowing growth without inflation.",
  distractors:{1:"Micro reform works slowly and is a poor tool for a downturn.",2:"The exchange rate floats and is not a micro policy target.",3:"Redistribution is chiefly done through the tax and transfer system."},
  misconception:"Demand-side policy manages the cycle. Supply-side policy raises the speed limit." },

{ id:"h4-007", mod:"H4", topic:"Policy conflicts", diff:3, tags:["policy"],
  q:"A government pursuing both lower unemployment and lower inflation faces a conflict because",
  options:["stimulating demand to create jobs also adds to price pressure","reducing inflation always requires higher government spending","lower unemployment automatically reduces labour productivity","the two objectives are measured by the same statistical agency"], answer:0,
  why:"Demand-side policy moves both variables in the same direction. Expansion cuts unemployment while adding to inflation; contraction does the reverse. Escaping the trade-off requires supply-side improvement.",
  distractors:{1:"Reducing inflation generally requires spending restraint, not expansion.",2:"Productivity does not automatically fall as employment rises.",3:"Sharing a statistical agency creates no economic conflict."},
  misconception:"" },

{ id:"h4-008", mod:"H4", topic:"Environmental policy", diff:3, tags:["market-failure","policy"],
  q:"An advantage of a tradeable permit scheme over direct regulation of emissions is that it",
  options:["lets abatement happen wherever it is cheapest to achieve","guarantees that emissions will fall to zero within a set period","removes the need for government to monitor emissions at all","raises no revenue and so imposes no cost on any firm"], answer:0,
  why:"A cap fixes the total, and trading lets firms with low abatement costs cut more and sell permits to firms where cutting is expensive. The environmental outcome is achieved at the lowest total cost.",
  distractors:{1:"The cap sets a positive limit; zero emissions is not the design.",2:"Monitoring and enforcement are essential for permits to have value.",3:"Permits impose a real cost — that cost is what changes behaviour."},
  misconception:"" }

];
