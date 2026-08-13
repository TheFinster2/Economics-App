/* Flashcards — Leitner spaced repetition.

   A card should be answerable in one breath. Where two ideas are routinely
   confused, the card names both and says what separates them, because the
   confusion is the thing worth drilling. Discovery is automatic: the key
   matches the cards_ pattern, so adding a file is the only step needed. */

window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.cards_prelim = [

// ── exam command words ──────────────────────────────────────────────────
{ id:"cd-001", mod:"P1", topic:"Command words", front:"Command word: IDENTIFY", back:"Recognise and name. A few words is enough — no explanation wanted." },
{ id:"cd-002", mod:"P1", topic:"Command words", front:"Command word: OUTLINE", back:"Sketch the main features in general terms. Brief, but in the right order." },
{ id:"cd-003", mod:"P1", topic:"Command words", front:"Command word: DESCRIBE", back:"State the features or characteristics. What happens — not why." },
{ id:"cd-004", mod:"P1", topic:"Command words", front:"Command word: EXPLAIN", back:"Relate cause and effect. Say WHY or HOW. 'Because' should appear in your answer." },
{ id:"cd-005", mod:"P1", topic:"Command words", front:"Command word: ANALYSE", back:"Identify the components and show how they relate to each other. Break the issue apart, then link the parts." },
{ id:"cd-006", mod:"P1", topic:"Command words", front:"Command word: DISCUSS", back:"Put forward issues on more than one side. A one-sided answer cannot be a discussion." },
{ id:"cd-007", mod:"P1", topic:"Command words", front:"Command word: EVALUATE", back:"Weigh strengths against weaknesses and reach an explicit judgement. A list is not an evaluation." },
{ id:"cd-008", mod:"P1", topic:"Command words", front:"Command word: ASSESS", back:"Judge the value or effectiveness of something, supported by evidence. State the verdict." },
{ id:"cd-009", mod:"P1", topic:"Command words", front:"Command word: COMPARE", back:"Show BOTH similarities and differences, on the same criteria for each." },
{ id:"cd-010", mod:"P1", topic:"Command words", front:"Command word: DISTINGUISH", back:"Show the differences only, side by side, using the same criteria." },
{ id:"cd-011", mod:"P1", topic:"Command words", front:"Command word: JUSTIFY", back:"Give reasons and evidence for a position you have taken. Argue for it, don't just state it." },
{ id:"cd-012", mod:"P1", topic:"Command words", front:"Command word: PROPOSE", back:"Put forward a plan or course of action for consideration, and say why it would work." },

// ── P1 Introduction ─────────────────────────────────────────────────────
{ id:"cd-021", mod:"P1", topic:"Scarcity", front:"The economic problem", back:"Unlimited wants against limited resources. Every society must decide what to produce, how to produce it, and for whom." },
{ id:"cd-022", mod:"P1", topic:"Opportunity cost", front:"Opportunity cost", back:"The value of the NEXT BEST alternative given up. Not the sum of everything forgone, and not the cash price." },
{ id:"cd-023", mod:"P1", topic:"Production possibility frontier", front:"Why is a PPF concave to the origin?", back:"Resources are not equally suited to both goods, so opportunity cost rises as more of one is produced. A straight line would mean constant opportunity cost." },
{ id:"cd-024", mod:"P1", topic:"Production possibility frontier", front:"Point inside vs point beyond a PPF", back:"Inside means unemployed or inefficiently used resources. Beyond means unattainable with current resources and technology." },
{ id:"cd-025", mod:"P1", topic:"Factors of production", front:"The four factors of production", back:"Natural resources (rent), labour (wages), capital (interest), enterprise (profit). The return to each is in brackets." },
{ id:"cd-026", mod:"P1", topic:"Circular flow", front:"Leakages and injections", back:"Leakages: Savings, Taxation, iMports. Injections: Investment, Government spending, eXports. Equilibrium is S+T+M = I+G+X." },
{ id:"cd-027", mod:"P1", topic:"Circular flow", front:"Leakages exceed injections — what happens?", back:"Activity contracts. Output, income and employment fall until leakages fall back to match injections, at a LOWER level of income." },
{ id:"cd-028", mod:"P1", topic:"Economic systems", front:"How a market economy answers 'what to produce'", back:"Price signals. Consumer spending raises prices and profits in some industries, drawing resources in. No one directs it." },
{ id:"cd-029", mod:"P1", topic:"Economic growth", front:"Growth vs recovery on a PPF", back:"Moving from inside the frontier towards it is a recovery — using existing resources better. Shifting the frontier outward is growth." },
{ id:"cd-030", mod:"P1", topic:"Standard of living", front:"Why GDP per capita understates living standards", back:"It ignores unpaid work, leisure, distribution, environmental damage and the composition of output. Higher is usually better, but not always." },

// ── P2 Consumers and Business ───────────────────────────────────────────
{ id:"cd-041", mod:"P2", topic:"Consumer decisions", front:"MPC and MPS", back:"Marginal propensity to consume and to save: the share of each EXTRA dollar spent and saved. They always add to one." },
{ id:"cd-042", mod:"P2", topic:"Consumer decisions", front:"APC vs MPC", back:"Average propensity to consume is total spending ÷ total income. Marginal is the change in spending ÷ the change in income." },
{ id:"cd-043", mod:"P2", topic:"Income elasticity", front:"Income elasticity — what the sign means", back:"Positive: normal good. Negative: inferior good. Above one: luxury. Between zero and one: necessity." },
{ id:"cd-044", mod:"P2", topic:"Business costs", front:"Fixed vs variable cost", back:"Fixed does not change with output in the short run (rent, insurance). Variable changes directly with output (materials, casual wages)." },
{ id:"cd-045", mod:"P2", topic:"Economies of scale", front:"Economies of scale", back:"Average cost per unit falls as scale rises — fixed costs spread further, bulk buying, specialisation. TOTAL cost still rises." },
{ id:"cd-046", mod:"P2", topic:"Economies of scale", front:"Diseconomies of scale", back:"Average cost per unit rises once a firm outgrows its efficient size, usually through communication and coordination problems." },
{ id:"cd-047", mod:"P2", topic:"Productivity", front:"Productivity", back:"Output per unit of input, usually output per hour worked. The only sustainable source of higher real wages." },
{ id:"cd-048", mod:"P2", topic:"Business goals", front:"Goals of a firm beyond profit", back:"Market share, growth, meeting shareholder expectations, satisficing, and corporate social responsibility. Profit maximisation is a model, not always the practice." },
{ id:"cd-049", mod:"P2", topic:"Business goals", front:"Corporate social responsibility", back:"Voluntary obligations to stakeholders and the environment beyond what the law requires. Costs money now, protects reputation and licence to operate later." },

// ── P3 Markets ──────────────────────────────────────────────────────────
{ id:"cd-061", mod:"P3", topic:"Demand and supply", front:"Change in demand vs change in quantity demanded", back:"Change in DEMAND shifts the whole curve — caused by income, tastes, related prices, expectations, number of buyers. Change in QUANTITY demanded is a movement along it, caused only by the good's own price." },
{ id:"cd-062", mod:"P3", topic:"Demand and supply", front:"Non-price determinants of demand", back:"Income, tastes and preferences, price of substitutes and complements, expectations of future prices, number of consumers." },
{ id:"cd-063", mod:"P3", topic:"Demand and supply", front:"Non-price determinants of supply", back:"Costs of production, technology, number of sellers, expectations of future prices, government taxes and subsidies, climatic conditions." },
{ id:"cd-064", mod:"P3", topic:"Market equilibrium", front:"Price above equilibrium", back:"Quantity supplied exceeds quantity demanded — a surplus. Unsold stock forces sellers to cut price until the market clears." },
{ id:"cd-065", mod:"P3", topic:"Market equilibrium", front:"Price below equilibrium", back:"Quantity demanded exceeds quantity supplied — a shortage. Unsatisfied buyers bid the price up until the market clears." },
{ id:"cd-066", mod:"P3", topic:"Elasticity", front:"Price elasticity of demand — the formula", back:"%Δ quantity demanded ÷ %Δ price. Always negative. Use the midpoint method so the answer is the same in both directions." },
{ id:"cd-067", mod:"P3", topic:"Elasticity", front:"The total revenue test", back:"Price up and revenue up means demand is INELASTIC. Price up and revenue down means demand is ELASTIC. Revenue unchanged means unit elastic." },
{ id:"cd-068", mod:"P3", topic:"Elasticity", front:"What makes demand elastic?", back:"Close substitutes available, a luxury rather than a necessity, a large share of income, and plenty of time to adjust." },
{ id:"cd-069", mod:"P3", topic:"Elasticity", front:"Why is supply more elastic in the long run?", back:"Given time, firms can change their scale of production and new firms can enter the industry. In the short run at least one input is fixed." },
{ id:"cd-070", mod:"P3", topic:"Elasticity", front:"Cross elasticity of demand — the sign", back:"Positive means substitutes (price of one up, demand for the other up). Negative means complements. Near zero means unrelated." },
{ id:"cd-071", mod:"P3", topic:"Market failure", front:"Public good — the two properties", back:"Non-excludable (you cannot stop non-payers benefiting) and non-rival (one person's use does not reduce another's). Hence free riding, hence no market supply." },
{ id:"cd-072", mod:"P3", topic:"Market failure", front:"Negative externality — the consequence", back:"Private cost is below social cost, so price is too low and the market OVERPRODUCES. A corrective tax internalises the cost." },
{ id:"cd-073", mod:"P3", topic:"Market failure", front:"Positive externality — the consequence", back:"Private benefit is below social benefit, so the market UNDERPRODUCES. Education and vaccination are the standard examples; a subsidy corrects it." },
{ id:"cd-074", mod:"P3", topic:"Government intervention", front:"Price ceiling vs price floor", back:"Ceiling is a legal MAXIMUM below equilibrium, causing a shortage (rent control). Floor is a legal MINIMUM above equilibrium, causing a surplus (minimum wage)." },
{ id:"cd-075", mod:"P3", topic:"Market structures", front:"The four market structures", back:"Perfect competition, monopolistic competition, oligopoly, monopoly — ordered by falling number of firms and rising price-setting power." },
{ id:"cd-076", mod:"P3", topic:"Market structures", front:"Perfect competition vs monopolistic competition", back:"Both have many firms and free entry. Perfect competition has an IDENTICAL product and no price-setting power; monopolistic competition has a differentiated product and a little." },
{ id:"cd-077", mod:"P3", topic:"Market structures", front:"Why oligopoly firms are interdependent", back:"With only a few large firms, each one's pricing and output decisions materially affect the others, so each must anticipate the others' reactions." },

// ── P4 Labour Markets ───────────────────────────────────────────────────
{ id:"cd-091", mod:"P4", topic:"Labour force", front:"Who counts as unemployed?", back:"Of working age, without work, AND actively seeking and available for it. Drop the last condition and you leave the labour force entirely." },
{ id:"cd-092", mod:"P4", topic:"Labour force", front:"Unemployment rate — the denominator", back:"The LABOUR FORCE, not the population. Labour force = employed + unemployed. Dividing by population gives the wrong answer every time." },
{ id:"cd-093", mod:"P4", topic:"Labour force", front:"Participation rate", back:"Labour force ÷ working-age population, as a percentage. Read it alongside the unemployment rate — a falling rate can hide discouraged workers." },
{ id:"cd-094", mod:"P4", topic:"Labour force", front:"Hidden unemployment vs underemployment", back:"Hidden: wants work but has stopped looking, so is not counted. Underemployed: has a job but wants more hours." },
{ id:"cd-095", mod:"P4", topic:"Demand for labour", front:"Derived demand", back:"Firms demand labour only because they can sell what it produces. If demand for the product falls, demand for the labour falls with it." },
{ id:"cd-096", mod:"P4", topic:"Wage determination", front:"Nominal vs real wage", back:"Nominal is the money amount. Real is purchasing power — approximately the nominal change minus the inflation rate." },
{ id:"cd-097", mod:"P4", topic:"Wage determination", front:"Award vs enterprise agreement", back:"An award sets legally enforceable minimum pay and conditions for an industry or occupation. An enterprise agreement is negotiated at the workplace and must leave workers better off overall." },
{ id:"cd-098", mod:"P4", topic:"Labour market outcomes", front:"Why do wages differ between occupations?", back:"Skill and training required, productivity, working conditions, the elasticity of labour supply, unionisation, and discrimination." },

// ── P5 Financial Markets ────────────────────────────────────────────────
{ id:"cd-111", mod:"P5", topic:"Financial markets", front:"Primary vs secondary market", back:"Primary: the security is issued for the first time and the ISSUER receives the funds. Secondary: existing securities change hands between investors and the issuer receives nothing." },
{ id:"cd-112", mod:"P5", topic:"Financial markets", front:"Share vs bond", back:"A share is part OWNERSHIP with a claim on profits and no repayment date. A bond is a LOAN repaid at a set date with interest." },
{ id:"cd-113", mod:"P5", topic:"Interest rates", front:"Nominal vs real interest rate", back:"Real ≈ nominal − inflation. A 6% loan with 2% inflation costs 4% in real purchasing power." },
{ id:"cd-114", mod:"P5", topic:"Interest rates", front:"The cash rate", back:"The interest rate on overnight loans between banks. The Reserve Bank targets it, and every other interest rate in the economy is priced from it." },
{ id:"cd-115", mod:"P5", topic:"Financial markets", front:"What a financial intermediary does", back:"Pools many small, short-term deposits into large, long-term loans, and spreads the risk. Transforms size, term and risk." },
{ id:"cd-116", mod:"P5", topic:"Regulation", front:"APRA vs ASIC", back:"APRA supervises the financial SAFETY of institutions — capital, liquidity, risk. ASIC regulates CONDUCT — disclosure, market integrity, consumer protection." },

// ── P6 Government and the Economy ───────────────────────────────────────
{ id:"cd-131", mod:"P6", topic:"Aggregate demand", front:"The components of aggregate demand", back:"AD = C + I + G + (X − M). Consumption, investment, government spending, and net exports." },
{ id:"cd-132", mod:"P6", topic:"The multiplier", front:"The multiplier formula", back:"k = 1 ÷ MPS = 1 ÷ (1 − MPC). An injection of $1m with an MPS of 0.25 raises income by $4m." },
{ id:"cd-133", mod:"P6", topic:"The multiplier", front:"Why is the multiplier smaller in an open economy?", back:"Imports and taxation are extra leakages, so less of each round of spending is passed on domestically." },
{ id:"cd-134", mod:"P6", topic:"Taxation", front:"Progressive, proportional, regressive", back:"Progressive: average rate RISES with income (income tax). Proportional: constant (company tax). Regressive: FALLS with income (GST as a share of income)." },
{ id:"cd-135", mod:"P6", topic:"Budget", front:"Deficit vs debt", back:"A deficit is a FLOW over one year. Debt is a STOCK, the accumulation of past deficits. Confusing them costs marks every year." },
{ id:"cd-136", mod:"P6", topic:"Budget", front:"Automatic stabilisers", back:"Tax receipts fall and welfare payments rise in a downturn, and the reverse in a boom — all without any policy decision. They moderate the cycle by themselves." },
{ id:"cd-137", mod:"P6", topic:"Business cycle", front:"The four phases of the business cycle", back:"Expansion, peak, contraction, trough — then recovery back to expansion. Two consecutive quarters of negative growth is conventionally a recession." }

];

ECON.DATA.cards_hsc = [

// ── H1 The Global Economy ───────────────────────────────────────────────
{ id:"cd-201", mod:"H1", topic:"Globalisation", front:"Globalisation — the five flows", back:"Trade in goods and services, financial flows, investment and transnational corporations, technology, and labour migration." },
{ id:"cd-202", mod:"H1", topic:"Trade theory", front:"Comparative vs absolute advantage", back:"Absolute: producing MORE with the same resources. Comparative: producing at a lower OPPORTUNITY COST. Trade patterns follow comparative advantage." },
{ id:"cd-203", mod:"H1", topic:"Protection", front:"Arguments FOR protection", back:"Infant industry, defence and self-sufficiency, protecting domestic employment, preventing dumping, and the need to respond to others' protection." },
{ id:"cd-204", mod:"H1", topic:"Protection", front:"Arguments AGAINST protection", back:"Higher prices for consumers, resources kept in inefficient industries, retaliation, and higher input costs for every downstream industry." },
{ id:"cd-205", mod:"H1", topic:"Protection", front:"Tariff vs quota vs subsidy", back:"Tariff: a tax on imports, raises price, RAISES REVENUE. Quota: a quantity limit, raises price, revenue goes to licence holders. Subsidy: a payment to domestic producers, COSTS revenue." },
{ id:"cd-206", mod:"H1", topic:"Development", front:"Economic growth vs economic development", back:"Growth is more output. Development is a sustained improvement in wellbeing — income, health, education, and the structure of the economy." },
{ id:"cd-207", mod:"H1", topic:"Development", front:"Human Development Index — the three components", back:"Gross national income per capita, life expectancy at birth, and mean and expected years of schooling. Scored between 0 and 1." },
{ id:"cd-208", mod:"H1", topic:"Inequality", front:"Gini coefficient", back:"Zero is perfect equality, one is perfect inequality. It is the area between the Lorenz curve and the diagonal, over the whole triangle." },
{ id:"cd-209", mod:"H1", topic:"Global institutions", front:"WTO, IMF and World Bank", back:"WTO administers trade rules and settles disputes. IMF lends to countries in balance of payments crisis. World Bank lends for long-term development." },
{ id:"cd-210", mod:"H1", topic:"Globalisation", front:"Trade bloc types", back:"Free trade area (no internal tariffs), customs union (plus a common external tariff), common market (plus free factor movement), economic union (plus common policy)." },

// ── H2 Australia in the Global Economy ──────────────────────────────────
{ id:"cd-231", mod:"H2", topic:"Balance of payments", front:"The two halves of the balance of payments", back:"Current account (goods, services, primary income, secondary income) and capital and financial account (assets and liabilities). Under a float they sum to zero." },
{ id:"cd-232", mod:"H2", topic:"Balance of payments", front:"What goes in the current account?", back:"Balance on goods and services, plus NET PRIMARY INCOME (interest and dividends paid abroad), plus net secondary income (transfers)." },
{ id:"cd-233", mod:"H2", topic:"Balance of payments", front:"Why does Australia run a primary income deficit?", back:"Decades of foreign borrowing and foreign ownership mean large interest and dividend payments flow overseas each year. It is the servicing cost of past financing." },
{ id:"cd-234", mod:"H2", topic:"Foreign liabilities", front:"Net foreign debt vs net foreign liabilities", back:"Debt is borrowing net of lending. Liabilities is debt PLUS net foreign equity — everything owed and everything foreign-owned, netted off." },
{ id:"cd-235", mod:"H2", topic:"Terms of trade", front:"Terms of trade", back:"Export price index ÷ import price index × 100. A rise means each unit of exports buys more imports, raising national income." },
{ id:"cd-236", mod:"H2", topic:"Exchange rates", front:"Effects of a DEPRECIATION", back:"Exports cheaper abroad and more competitive; imports dearer at home; inflation pressure rises; foreign-currency debt costs more in A$ (valuation effect)." },
{ id:"cd-237", mod:"H2", topic:"Exchange rates", front:"Effects of an APPRECIATION", back:"Imports cheaper; exports less competitive; downward pressure on inflation; the A$ value of foreign-currency debt falls." },
{ id:"cd-238", mod:"H2", topic:"Exchange rates", front:"Depreciation vs devaluation", back:"Depreciation happens through MARKET forces under a float. Devaluation is a deliberate GOVERNMENT decision under a fixed rate. Same direction, different cause." },
{ id:"cd-239", mod:"H2", topic:"Exchange rates", front:"The J-curve effect", back:"After a depreciation the trade balance worsens first, because prices adjust before volumes do, then improves as buyers respond. Named for the shape it traces." },
{ id:"cd-240", mod:"H2", topic:"Exchange rates", front:"What determines demand for the A$?", back:"Export earnings, foreign investment inflow, Australian borrowing from overseas, speculation, and interest rate differentials." },
{ id:"cd-241", mod:"H2", topic:"Free trade agreements", front:"Trade creation vs trade diversion", back:"Creation: trade shifts from a high-cost domestic producer to a lower-cost partner — a gain. Diversion: trade shifts from the lowest-cost world producer to a preferred partner — a loss." },

// ── H3 Economic Issues ──────────────────────────────────────────────────
{ id:"cd-261", mod:"H3", topic:"Economic growth", front:"Real vs nominal GDP", back:"Nominal uses current prices and rises with inflation. Real holds prices constant, so it measures the change in VOLUME of output." },
{ id:"cd-262", mod:"H3", topic:"Economic growth", front:"Sources of economic growth", back:"More labour, more capital, better technology, better skills, and microeconomic reform that raises how efficiently the inputs are combined." },
{ id:"cd-263", mod:"H3", topic:"Inflation", front:"Demand-pull vs cost-push inflation", back:"Demand-pull: spending outruns capacity, prices AND output rise. Cost-push: input costs rise, prices rise while output FALLS. The second is far harder to treat." },
{ id:"cd-264", mod:"H3", topic:"Inflation", front:"Headline vs underlying inflation", back:"Headline is the full CPI. Underlying strips out the most volatile items so the persistent trend shows. The Reserve Bank targets underlying." },
{ id:"cd-265", mod:"H3", topic:"Inflation", front:"Costs of inflation", back:"Erodes purchasing power and savings, distorts investment towards speculation, worsens international competitiveness, and redistributes from lenders to borrowers." },
{ id:"cd-266", mod:"H3", topic:"Unemployment", front:"Types of unemployment", back:"Cyclical (weak demand), structural (skills mismatch), frictional (between jobs), seasonal, long-term, hidden and underemployment." },
{ id:"cd-267", mod:"H3", topic:"Unemployment", front:"Match the cause to the cure", back:"Cyclical → expansionary macro policy. Structural → training, mobility, microeconomic reform. Frictional → better job matching and information. Stimulus does nothing for structural unemployment." },
{ id:"cd-268", mod:"H3", topic:"Unemployment", front:"Natural rate of unemployment", back:"What remains at full capacity: frictional + structural + seasonal. Pushing below it generates accelerating inflation." },
{ id:"cd-269", mod:"H3", topic:"Phillips curve", front:"The Phillips curve", back:"Short run: an inverse trade-off between unemployment and inflation. Long run: vertical at the natural rate, so only inflation changes." },
{ id:"cd-270", mod:"H3", topic:"Inequality", front:"Causes of income inequality in Australia", back:"Differences in education and skills, occupation and hours, age, capital and property income, family structure, and location." },
{ id:"cd-271", mod:"H3", topic:"Environmental sustainability", front:"Ecologically sustainable development", back:"Meeting present needs without reducing future generations' capacity to meet theirs. It constrains the composition of growth rather than prohibiting growth." },
{ id:"cd-272", mod:"H3", topic:"Environmental sustainability", front:"The tragedy of the commons", back:"A shared resource with no ownership is overused, because each user gets the full private benefit while the cost is spread across everyone." },

// ── H4 Policies ─────────────────────────────────────────────────────────
{ id:"cd-291", mod:"H4", topic:"Fiscal policy", front:"Reading the fiscal STANCE", back:"Look at the CHANGE, not the level. A deficit that grows is expansionary; a deficit that shrinks is contractionary even though it is still a deficit." },
{ id:"cd-292", mod:"H4", topic:"Fiscal policy", front:"Structural vs cyclical budget component", back:"Structural: the result of deliberate policy decisions. Cyclical: the automatic result of the business cycle acting on revenue and spending." },
{ id:"cd-293", mod:"H4", topic:"Fiscal policy", front:"How a deficit can be financed", back:"Borrowing from the domestic private sector, borrowing from overseas, or selling assets. Each has different effects on interest rates and foreign liabilities." },
{ id:"cd-294", mod:"H4", topic:"Monetary policy", front:"How the RBA changes the cash rate", back:"Domestic market operations: SELLING government securities drains cash and pushes the rate UP; BUYING adds cash and pushes it down." },
{ id:"cd-295", mod:"H4", topic:"Monetary policy", front:"The transmission mechanism", back:"Cash rate → borrowing costs and cash flow → asset prices and wealth → the exchange rate → expectations → aggregate demand → inflation and employment." },
{ id:"cd-296", mod:"H4", topic:"Monetary policy", front:"The RBA's inflation target", back:"Underlying inflation of 2–3% on average over time. The flexibility of 'on average over time' is what lets the Bank look through temporary shocks." },
{ id:"cd-297", mod:"H4", topic:"Microeconomic policy", front:"Microeconomic reform — what it targets", back:"Aggregate SUPPLY. Competition policy, deregulation, tax reform, infrastructure and labour market reform, all aimed at raising productive efficiency." },
{ id:"cd-298", mod:"H4", topic:"Policy mix", front:"Time lags in policy", back:"Recognition, decision, implementation and impact lags. Monetary policy is quicker to implement; fiscal policy can be quicker to bite once it does." },
{ id:"cd-299", mod:"H4", topic:"Policy conflicts", front:"The main conflict between policy objectives", back:"Growth and low unemployment pull against low inflation and a lower current account deficit. Demand-side policy moves them together; only supply-side reform eases the trade-off." },
{ id:"cd-300", mod:"H4", topic:"Environmental policy", front:"Tradeable permits vs regulation", back:"A cap fixes total emissions; trading lets abatement occur wherever it is cheapest, so the target is met at the lowest total cost. Regulation gets the outcome but not the least-cost path." },
{ id:"cd-301", mod:"H4", topic:"Fiscal policy", front:"Crowding out", back:"Government borrowing raises interest rates, which discourages private investment. It matters most when the economy is near capacity and least when there is spare capacity." }

];
