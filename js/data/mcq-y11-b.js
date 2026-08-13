/* Multiple choice — Preliminary course, second pass.

   Application-flavoured: most stems give a scenario, a number or a result and
   ask what follows. See mcq-y11.js for the two rules validate.js enforces. */

window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.mcq_p1b = [

{ id:"pb-101", mod:"P1", topic:"Opportunity cost", diff:3,
  q:"A government builds a hospital on land it already owns. The opportunity cost of the project",
  options:["includes the value of the best alternative use of that land","is zero for the land, because no purchase price was paid","equals the total construction cost of the hospital building","cannot be calculated, since the land was not bought recently"], answer:0,
  why:"Opportunity cost is about alternatives forgone, not cash spent. Land already owned could have been sold or used for housing, and that forgone value is a real cost of the hospital.",
  distractors:{1:"Already owning something does not make using it free.",2:"Construction cost is part of the cost but ignores the land entirely.",3:"A current market valuation of comparable land gives the estimate."},
  misconception:"Sunk purchase price is irrelevant. What matters is what the resource could do instead, now." },

{ id:"pb-102", mod:"P1", topic:"Economic systems", diff:3,
  q:"Australia is described as a mixed economy because",
  options:["markets allocate most resources while government corrects some outcomes","half of all output is produced by government-owned enterprises","it trades with both developed and developing economies overseas","it produces both primary commodities and manufactured goods"], answer:0,
  why:"A mixed economy uses the price mechanism as the main allocator but adds government to provide public goods, correct market failure and redistribute income.",
  distractors:{1:"Government production is a small share of Australian output.",2:"Trading partners have nothing to do with the classification.",3:"The mix of industries is unrelated to how resources are allocated."},
  misconception:"" },

{ id:"pb-103", mod:"P1", topic:"Circular flow", diff:3,
  q:"An economy has S = $80b, T = $120b, M = $90b, I = $95b, G = $130b and X = $75b. The economy is",
  options:["expanding, because injections exceed leakages by $10b","contracting, because leakages exceed injections by $10b","in equilibrium, because the two totals are exactly equal","impossible to assess without the level of consumption"], answer:0,
  why:"Leakages are 80 + 120 + 90 = $290b and injections are 95 + 130 + 75 = $300b. Injections exceed leakages by $10b, so income is being added to the flow and activity expands.",
  distractors:{1:"The comparison is the right way round only if you add the wrong three figures — check which letters are leakages.",2:"The two totals differ by $10b, so the economy is not in equilibrium.",3:"Consumption stays within the flow and is not needed to compare leakages with injections."},
  misconception:"Add the three leakages, add the three injections, compare. Consumption never enters the comparison." },

{ id:"pb-104", mod:"P1", topic:"Production possibility frontier", diff:3,
  q:"An economy chooses a point on its PPF with a high proportion of capital goods rather than consumer goods. Over time this is likely to",
  options:["shift the frontier further outward than the alternative choice would","move the economy to a point inside its production possibility frontier","have no effect on the position of the frontier in future years","reduce the economy's productive capacity because less is consumed"], answer:0,
  why:"Capital goods are the tools, machines and infrastructure used to produce future output. Choosing more of them today means more productive capacity tomorrow, which is what shifts the frontier out.",
  distractors:{1:"Both choices are on the frontier, so both use resources fully.",2:"The composition of output is exactly what determines future capacity.",3:"Lower consumption today is the cost of higher capacity later, not a cause of lower capacity."},
  misconception:"" },

{ id:"pb-105", mod:"P1", topic:"Standard of living", diff:3,
  q:"Real GDP per capita rises by three per cent while measured air quality worsens and average working hours rise. This suggests that",
  options:["GDP per capita is an incomplete measure of living standards","living standards have unambiguously improved by three per cent","real GDP has been calculated incorrectly for that year","the population must have fallen over the same period"], answer:0,
  why:"GDP counts output, not wellbeing. It excludes environmental damage, leisure and the distribution of the gain, so income can rise while several components of living standards fall.",
  distractors:{1:"Two of the three indicators moved the wrong way, so the conclusion is not unambiguous.",2:"Nothing here suggests a measurement error in GDP itself.",3:"Per capita income can rise with a growing population if output grows faster."},
  misconception:"" },

{ id:"pb-106", mod:"P1", topic:"Factors of production", diff:2,
  q:"An entrepreneur who combines land, labour and capital to start a business is supplying",
  options:["enterprise, and the return to it is profit","labour, and the return to it is a wage","capital, and the return to it is interest","natural resources, and the return is rent"], answer:0,
  why:"Enterprise is the factor that organises the other three and bears the risk of the venture. Its return is profit, which is residual — what is left after every other factor has been paid.",
  distractors:{1:"Working in the business is labour, but organising it is a separate factor.",2:"Capital is the machinery and equipment used, not the person combining them.",3:"Natural resources are the land and raw materials themselves."},
  misconception:"" },

{ id:"pb-107", mod:"P1", topic:"Economic growth", diff:2,
  q:"Which pair of changes would BOTH increase an economy's productive capacity?",
  options:["Higher net migration of skilled workers and new transport infrastructure","A rise in consumer confidence and a fall in the household saving ratio","An increase in government transfer payments and a cut in income tax","A depreciation of the currency and a rise in export prices received"], answer:0,
  why:"Capacity depends on the quantity and quality of resources. More skilled labour and better infrastructure both raise what the economy can produce, rather than how much is currently being spent.",
  distractors:{1:"Both of these raise aggregate demand without changing capacity.",2:"Transfers and tax cuts move spending power around; they do not add resources.",3:"These change the terms on which output is traded, not how much can be made."},
  misconception:"Capacity is a supply-side idea. Confidence, transfers and exchange rates move demand." },

{ id:"pb-108", mod:"P1", topic:"Scarcity", diff:2,
  q:"Which decision is NOT an answer to one of the three basic economic questions?",
  options:["Which political party will form the next government","How many hospitals rather than schools to build","Whether to use machinery or labour in production","Who receives the goods and services produced"], answer:0,
  why:"The three questions are what to produce, how to produce it, and for whom. Choosing a government may influence the answers, but it is not itself one of them.",
  distractors:{1:"That is a 'what to produce' decision about allocating scarce resources.",2:"That is a 'how to produce' decision about the method of production.",3:"That is a 'for whom' decision about distribution."},
  misconception:"" }

];

ECON.DATA.mcq_p2b = [

{ id:"pb-201", mod:"P2", topic:"Consumer decisions", diff:3,
  q:"A household's income rises from $80 000 to $90 000 and its consumption rises from $70 000 to $77 000. The marginal propensity to consume is",
  options:["0.70","0.86","0.78","1.10"], answer:0,
  why:"MPC is the change in consumption divided by the change in income: 7000 ÷ 10 000 = 0.70. The remaining 0.30 is the marginal propensity to save.",
  distractors:{1:"That is the average propensity to consume at the new income, 77 000 ÷ 90 000.",2:"That is the average propensity to consume at the old income.",3:"That inverts the calculation, dividing income change by consumption change."},
  misconception:"Marginal means the change. Average means the level. The exam asks for one and offers the other." },

{ id:"pb-202", mod:"P2", topic:"Business costs", diff:3,
  q:"A firm's total costs are $50 000 when it produces nothing and $130 000 when it produces 4000 units. Its average variable cost at that output is",
  options:["$20","$32.50","$12.50","$45"], answer:0,
  why:"Cost at zero output is fixed cost, so $50 000 is fixed and $80 000 is variable. Average variable cost is 80 000 ÷ 4000 = $20.",
  distractors:{1:"That is average TOTAL cost, 130 000 ÷ 4000.",2:"That is average fixed cost, 50 000 ÷ 4000.",3:"That adds average fixed and average total cost, which double-counts."},
  misconception:"Cost at zero output is the fixed cost. That one fact unlocks most short-run cost questions." },

{ id:"pb-203", mod:"P2", topic:"Economies of scale", diff:3,
  q:"A firm's long-run average cost curve is U-shaped. The upward-sloping section is caused by",
  options:["diseconomies of scale, chiefly coordination and communication problems","the law of diminishing returns applying to a fixed factor of production","rising fixed costs as the firm builds additional production facilities","a fall in demand for the firm's product at higher output levels"], answer:0,
  why:"In the long run every factor is variable, so diminishing returns cannot apply. Rising long-run average cost comes from the growing difficulty of managing a very large organisation.",
  distractors:{1:"Diminishing returns is a SHORT-run idea requiring at least one fixed factor.",2:"In the long run there are no fixed costs; all costs are variable.",3:"Demand affects revenue, not the cost curve."},
  misconception:"Short run: diminishing returns. Long run: diseconomies of scale. Different mechanisms, similar-looking curves." },

{ id:"pb-204", mod:"P2", topic:"Business goals", diff:2,
  q:"A firm prices below cost to drive a new competitor out of the market. This is best described as",
  options:["predatory pricing, which competition law generally prohibits","price discrimination between different groups of consumers","a natural consequence of economies of scale in production","a temporary shortage caused by excess consumer demand"], answer:0,
  why:"Deliberately selling below cost to eliminate a rival and then raising price once the market is cleared reduces competition, which is why it is restricted under competition law.",
  distractors:{1:"Price discrimination is charging different prices to different buyers for the same good.",2:"Scale economies lower costs; they do not require pricing below them.",3:"Nothing here describes quantity demanded exceeding quantity supplied."},
  misconception:"" },

{ id:"pb-205", mod:"P2", topic:"Productivity", diff:3,
  q:"A firm's output rises 12% while hours worked rise 4%. Labour productivity has risen by approximately",
  options:["8%","12%","3%","16%"], answer:0,
  why:"Productivity is output per hour. If output grows faster than hours, productivity grows by roughly the difference: 12 − 4 = 8%.",
  distractors:{1:"That is output growth alone, ignoring the extra hours worked.",2:"That is the ratio of the two growth rates, not the growth in productivity.",3:"That adds the two rates, which would require hours to have fallen."},
  misconception:"" },

{ id:"pb-206", mod:"P2", topic:"Income elasticity", diff:2,
  q:"During a recession, demand for home-brand groceries rises while demand for restaurant meals falls. This indicates that",
  options:["home-brand groceries are inferior goods and restaurant meals are normal","both goods have positive income elasticity of demand","both goods have negative income elasticity of demand","restaurant meals are inferior and home-brand groceries are luxuries"], answer:0,
  why:"In a recession incomes fall. A good whose demand rises when income falls has negative income elasticity and is inferior; one whose demand falls with income is normal.",
  distractors:{1:"Home-brand demand moved opposite to income, so its elasticity is negative.",2:"Restaurant demand moved with income, so its elasticity is positive.",3:"This reverses both classifications."},
  misconception:"" }

];

ECON.DATA.mcq_p3b = [

{ id:"pb-301", mod:"P3", topic:"Demand and supply", diff:3,
  q:"Both demand and supply for a good increase. The effect on equilibrium is",
  options:["quantity definitely rises; the effect on price is ambiguous","price definitely rises; the effect on quantity is ambiguous","both price and quantity definitely rise together","both price and quantity definitely fall together"], answer:0,
  why:"Rising demand pushes price up and rising supply pushes it down, so the net effect depends on which shift is larger. Both shifts push quantity in the same direction, so quantity must rise.",
  distractors:{1:"The two shifts push price in opposite directions, so it is price that is ambiguous.",2:"Price could rise, fall or stay the same depending on the relative shifts.",3:"Both shifts increase quantity, so it cannot fall."},
  misconception:"When both curves shift, one variable is determined and the other is ambiguous. Work out which by checking the direction each shift pushes it." },

{ id:"pb-302", mod:"P3", topic:"Elasticity", diff:3,
  q:"A government wants a tax on a good to fall mainly on producers rather than consumers. This happens when demand is",
  options:["elastic and supply is inelastic, so producers cannot pass the tax on","inelastic and supply is elastic, so consumers must absorb the tax","elastic and supply is also elastic, so the burden is shared equally","inelastic and supply is also inelastic, so nobody bears the burden"], answer:0,
  why:"Tax incidence falls on the side that is less able to respond. If buyers can easily walk away and producers cannot easily reduce output, producers must absorb most of the tax to keep selling.",
  distractors:{1:"That combination puts the burden on consumers, which is the opposite of what is wanted.",2:"Equal elasticities share the burden roughly evenly rather than loading it onto producers.",3:"A tax is always borne by someone; it does not vanish."},
  misconception:"The burden falls on whoever is less able to change their behaviour." },

{ id:"pb-303", mod:"P3", topic:"Elasticity", diff:2,
  q:"Demand for a good is perfectly inelastic. A ten per cent price rise will",
  options:["leave quantity demanded unchanged and raise revenue by ten per cent","reduce quantity demanded by ten per cent, leaving revenue unchanged","reduce quantity demanded to zero as buyers leave the market","reduce revenue, because quantity always falls when price rises"], answer:0,
  why:"Perfectly inelastic demand means quantity does not respond to price at all, so revenue rises in exact proportion to the price. It is a limiting case rather than a common one.",
  distractors:{1:"A ten per cent quantity fall would be unit elastic demand.",2:"Quantity falling to zero is perfectly ELASTIC demand.",3:"Quantity does not fall at all in this limiting case."},
  misconception:"" },

{ id:"pb-304", mod:"P3", topic:"Market structures", diff:3,
  q:"A firm in perfect competition is described as a price taker because",
  options:["its output is a tiny share of the market and its product is identical","government regulation prevents it from setting its own prices","it has agreed with rival firms not to compete on price","it produces at the lowest point on its average cost curve"], answer:0,
  why:"With many small firms selling an identical product and full information, any firm charging above the market price sells nothing, and it can already sell all it wants at the market price.",
  distractors:{1:"No regulation is involved; the market structure itself removes pricing power.",2:"An agreement between firms is collusion, which belongs to oligopoly.",3:"Producing at minimum average cost is a result of competition, not the reason for price taking."},
  misconception:"" },

{ id:"pb-305", mod:"P3", topic:"Market failure", diff:3, tags:["market-failure"],
  q:"Vaccination generates a positive externality. Left to the market, the quantity consumed will be",
  options:["below the socially optimal level, so a subsidy can correct it","above the socially optimal level, so a tax can correct it","at the socially optimal level once consumers are informed","zero, because private benefits are always outweighed by costs"], answer:0,
  why:"Individuals weigh their own benefit and ignore the protection they give others by not transmitting the disease. Private benefit is below social benefit, so too little is consumed.",
  distractors:{1:"Overconsumption is the result of a NEGATIVE externality.",2:"Information helps, but the third-party benefit still does not accrue to the buyer.",3:"Private benefit is real and substantial; many people vaccinate without any subsidy."},
  misconception:"Positive externality means too little. Negative externality means too much. Subsidise the first, tax the second." },

{ id:"pb-306", mod:"P3", topic:"Government intervention", diff:3,
  q:"A tax of $3 per unit raises the price consumers pay by $2. The producer bears",
  options:["$1 of the tax per unit, so demand is more inelastic than supply","$3 of the tax per unit, since producers remit the tax to government","$2 of the tax per unit, matching the price rise consumers face","none of the tax, because the price rise passes it fully to buyers"], answer:0,
  why:"Consumers pay $2 more and the total tax is $3, so producers absorb the remaining $1. The larger share falling on consumers indicates demand is the less responsive side.",
  distractors:{1:"Who physically remits the tax has no bearing on who bears its economic burden.",2:"The $2 is the consumer's share, not the producer's.",3:"The price rose by $2, not by the full $3, so producers absorbed the difference."},
  misconception:"Legal incidence is who writes the cheque. Economic incidence is who ends up worse off. They are rarely the same." },

{ id:"pb-307", mod:"P3", topic:"Market failure", diff:2, tags:["market-failure"],
  q:"Which is the clearest example of asymmetric information causing market failure?",
  options:["A used car seller knows about a fault the buyer cannot detect","A firm has patented a production process its rivals cannot use","Two supermarkets charge different prices in different suburbs","A tax on fuel raises the price motorists pay at the bowser"], answer:0,
  why:"Asymmetric information means one party knows materially more than the other. Buyers who cannot verify quality discount every car, which drives good cars out of the market.",
  distractors:{1:"A patent is a legal barrier to entry, a different source of market power.",2:"Price differences across locations reflect different costs and demand.",3:"A tax changes price without any information problem."},
  misconception:"" },

{ id:"pb-308", mod:"P3", topic:"Elasticity", diff:3,
  q:"Which good's demand is most likely to become MORE elastic over time?",
  options:["Petrol, as households gradually switch to more efficient vehicles","Bread, because it remains a staple food regardless of price","Salt, since the quantity used in cooking is essentially fixed","Emergency medical treatment, which cannot be postponed at all"], answer:0,
  why:"Elasticity rises with the time available to adjust. In a week motorists must drive; over years they can buy a smaller car, move closer to work, or change to public transport.",
  distractors:{1:"Staple foods have few substitutes at any time horizon.",2:"Salt is a tiny share of spending and has no substitute.",3:"Urgency is precisely what makes demand inelastic."},
  misconception:"" }

];

ECON.DATA.mcq_p4b = [

{ id:"pb-401", mod:"P4", topic:"Labour force", diff:3,
  q:"An economy has 12 million employed, 800 000 unemployed and 6 million of working age not in the labour force. The participation rate is",
  options:["68.1%","6.3%","66.7%","93.7%"], answer:0,
  why:"Labour force is 12.8m and working-age population is 18.8m, so 12.8 ÷ 18.8 = 68.1%.",
  distractors:{1:"That is the unemployment rate, 0.8 ÷ 12.8.",2:"That uses employed only over the working-age population, omitting the unemployed.",3:"That is the employment-to-labour-force ratio, the complement of the unemployment rate."},
  misconception:"Participation uses the working-age population as the denominator. Unemployment uses the labour force. Getting the denominator right is most of the question." },

{ id:"pb-402", mod:"P4", topic:"Wage determination", diff:3,
  q:"A trade union negotiates a wage rise not matched by higher productivity. In a competitive labour market this is most likely to",
  options:["raise unit labour costs, reducing the quantity of labour demanded","increase employment, because a higher wage attracts more workers into the industry","leave employment unchanged, since demand for labour is fixed","reduce the wage paid to workers in other industries immediately"], answer:0,
  why:"Unit labour cost is the wage divided by output per hour. A rise in the numerator without a rise in the denominator makes each unit dearer to produce, so firms hire less labour.",
  distractors:{1:"Attracting workers increases supply; it is demand that determines how many are hired.",2:"Labour demand responds to price like any other demand.",3:"Effects on other industries occur over time, not immediately, and are not the direct result."},
  misconception:"Wage rises are affordable when productivity rises with them. Unit labour cost is the number that decides it." },

{ id:"pb-403", mod:"P4", topic:"Labour market outcomes", diff:3,
  q:"Which explanation for the gender pay gap is a compositional effect rather than direct discrimination?",
  options:["Women are over-represented in lower-paid occupations and industries","Two workers doing identical work are paid different hourly rates by the same firm","A firm refuses to promote women to senior management roles","Job advertisements specify a preferred gender for applicants"], answer:0,
  why:"A compositional effect arises from where people work rather than from unequal treatment within the same job. Both compositional and discriminatory factors contribute to the measured gap.",
  distractors:{1:"Unequal pay for identical work is direct discrimination.",2:"Blocking promotion on the basis of gender is direct discrimination.",3:"Gendered advertising is direct discrimination and is unlawful."},
  misconception:"" },

{ id:"pb-404", mod:"P4", topic:"Demand for labour", diff:2,
  q:"Automation of a routine task in an industry is most likely to",
  options:["reduce demand for labour in that task and raise it for technical skills","reduce total employment across the whole economy permanently","increase demand for labour in the automated task itself","leave the structure of labour demand completely unchanged"], answer:0,
  why:"Technology substitutes for some kinds of labour and complements others. The task disappears, but designing, installing and maintaining the technology creates different demand — which is why the resulting unemployment is structural.",
  distractors:{1:"Historically technology has changed the composition of employment rather than its total.",2:"Automation replaces labour in the task rather than requiring more of it.",3:"The composition of demand is exactly what changes."},
  misconception:"" },

{ id:"pb-405", mod:"P4", topic:"Labour force", diff:3,
  q:"Which change would raise the participation rate without changing the unemployment rate?",
  options:["Discouraged workers return to searching and find jobs immediately","Employed workers have their hours reduced to part-time","Unemployed workers give up searching and leave the labour force","The working-age population grows while the labour force is unchanged"], answer:0,
  why:"Adding people to both the labour force and employment raises participation while leaving the ratio of unemployed to labour force roughly unchanged.",
  distractors:{1:"Hours changes affect underemployment, not the participation rate.",2:"That lowers both the participation rate and the unemployment rate.",3:"That lowers the participation rate rather than raising it."},
  misconception:"" }

];

ECON.DATA.mcq_p5b = [

{ id:"pb-501", mod:"P5", topic:"Interest rates", diff:3,
  q:"Bond prices and market interest rates move in opposite directions because a bond's",
  options:["fixed coupon becomes less attractive when new bonds pay more","issuer raises the coupon whenever market rates increase","face value is adjusted downward as interest rates rise","maturity date is extended when interest rates change"], answer:0,
  why:"A bond paying a fixed $5 a year is worth less once new bonds pay $7, so buyers will only take it at a lower price. The price falls until the effective yield matches the market.",
  distractors:{1:"The coupon on an existing bond is fixed for its life.",2:"Face value is fixed and repaid in full at maturity.",3:"Maturity is set at issue and does not change."},
  misconception:"The coupon cannot change, so the price must. That is the whole relationship." },

{ id:"pb-502", mod:"P5", topic:"Financial markets", diff:3,
  q:"Which is the clearest example of the financial system performing maturity transformation?",
  options:["A bank funds 25-year mortgages using at-call deposits","A firm issues new shares to fund an expansion project","A household buys shares on the secondary share market","An investor converts Australian dollars into US dollars"], answer:0,
  why:"Depositors want their money available immediately; borrowers want funds for decades. The bank bridges that gap, which is also why a loss of depositor confidence is so dangerous.",
  distractors:{1:"A share issue raises equity and involves no maturity mismatch.",2:"A secondary trade transfers an existing asset between investors.",3:"That is a foreign exchange transaction, not maturity transformation."},
  misconception:"" },

{ id:"pb-503", mod:"P5", topic:"Interest rates", diff:2,
  q:"An investor requires a real return of 3%. If inflation is expected to be 4%, the nominal rate they need is approximately",
  options:["7%","4%","3%","1.33%"], answer:0,
  why:"Real ≈ nominal − inflation, so nominal ≈ real + inflation = 3 + 4 = 7%. Anything less leaves the investor worse off in purchasing power.",
  distractors:{1:"That quotes the inflation rate, which would leave a real return of zero.",2:"That quotes the required real return, ignoring inflation entirely.",3:"That divides the two figures instead of adding them."},
  misconception:"" },

{ id:"pb-504", mod:"P5", topic:"Financial markets", diff:3,
  q:"Superannuation has made Australian households significant participants in financial markets. A consequence is that",
  options:["household wealth is now more exposed to movements in asset prices","banks no longer play any role in channelling funds to borrowers","the Reserve Bank has lost the ability to influence interest rates","Australia no longer relies on any capital raised from overseas"], answer:0,
  why:"Compulsory superannuation means most households hold equities and property indirectly, so a market downturn reduces household wealth and consumption even for people who never bought a share.",
  distractors:{1:"Banks remain the dominant intermediary for household and business lending.",2:"Monetary policy operates through the cash rate regardless of superannuation.",3:"Australia continues to run a financial account surplus funded from overseas."},
  misconception:"" }

];

ECON.DATA.mcq_p6b = [

{ id:"pb-601", mod:"P6", topic:"Aggregate demand", diff:3,
  q:"Which change would shift aggregate demand to the RIGHT?",
  options:["A cut in personal income tax rates that raises disposable income","A rise in the cash rate that increases mortgage repayments","An appreciation of the exchange rate that reduces net exports","An increase in the household saving ratio at every level of income earned"], answer:0,
  why:"Aggregate demand is C + I + G + (X − M). Higher disposable income raises consumption at every price level, moving the whole curve right.",
  distractors:{1:"Higher repayments reduce disposable income and consumption, shifting AD left.",2:"Weaker net exports reduce the (X − M) component, shifting AD left.",3:"Saving more means consuming less, which shifts AD left."},
  misconception:"" },

{ id:"pb-602", mod:"P6", topic:"The multiplier", diff:3,
  q:"An economy has an MPC of 0.8, a marginal tax rate of 0.2 and a marginal propensity to import of 0.1. Compared with the simple multiplier of 5, the actual multiplier is",
  options:["smaller, because tax and imports are additional leakages","larger, because more sectors are now involved in respending","unchanged, since only saving affects the multiplier's size","smaller only if the government also runs a budget surplus"], answer:0,
  why:"Each round of respending now loses income to tax and to foreign producers as well as to saving. More leakage per round means faster convergence and a smaller total.",
  distractors:{1:"Extra sectors here are places income leaks TO, not extra rounds of spending.",2:"Every leakage reduces the multiplier, not saving alone.",3:"The leakages operate regardless of the budget outcome."},
  misconception:"Any leakage shrinks the multiplier. Saving is just the one the simple formula names." },

{ id:"pb-603", mod:"P6", topic:"Taxation", diff:3,
  q:"Two households pay the same $4000 in GST. One earns $50 000 and the other $200 000. This illustrates that the GST is",
  options:["regressive, because it takes a larger share of the lower income","progressive, because both of the households pay an identical dollar amount","proportional, since the same rate applies to every purchase","not a tax at all, because it is collected by businesses"], answer:0,
  why:"Regressiveness is judged against income, not against spending. The same dollar amount is 8% of one income and 2% of the other, so the burden falls more heavily on the lower earner.",
  distractors:{1:"Paying the same amount from a smaller income is the opposite of progressive.",2:"The rate is flat on SPENDING, but the question asks about income.",3:"The GST is a tax; businesses remit it but consumers bear it."},
  misconception:"Always ask 'as a share of what?'. Flat on spending can still be regressive on income." },

{ id:"pb-604", mod:"P6", topic:"Budget", diff:3,
  q:"A budget deficit narrows from $60b to $40b during a strong expansion. The most likely explanation is",
  options:["the cyclical component improving as revenue rises with activity","a deliberate contractionary decision by the government alone","rising unemployment reducing the cost of welfare payments","an increase in government spending on new infrastructure projects nationwide"], answer:0,
  why:"Strong activity raises income, company profits and consumption, all of which lift tax revenue automatically, while welfare payments fall. That is the cyclical component doing the work.",
  distractors:{1:"Deliberate decisions are the structural component; the expansion makes the cyclical explanation more likely.",2:"Unemployment falls in an expansion rather than rising.",3:"More spending would widen the deficit, not narrow it."},
  misconception:"" },

{ id:"pb-605", mod:"P6", topic:"Business cycle", diff:2,
  q:"An economy grows at 1.5% while its long-run trend rate is 3%. This means",
  options:["output is rising but spare capacity is increasing","the economy is in recession with output falling","output has reached its full productive capacity","the trend rate has been measured incorrectly"], answer:0,
  why:"Growing below trend means the economy is producing less than it could. Output rises but capacity rises faster, so the output gap widens and unemployment tends to increase.",
  distractors:{1:"Growth of 1.5% is positive, so output is rising rather than falling.",2:"Growth below trend means capacity is NOT being fully used.",3:"Nothing here suggests a measurement problem."},
  misconception:"Positive growth below trend still means the economy is falling behind. Slow growth and recession are different things." },

{ id:"pb-606", mod:"P6", topic:"Government intervention", diff:3, tags:["market-failure"],
  q:"A government provides free primary education. The strongest economic justification is that education",
  options:["generates positive externalities the market would under-supply","is a pure public good that is both non-rival and fully non-excludable","has perfectly inelastic demand at every possible price level","costs nothing to provide once the schools have been built"], answer:0,
  why:"A more educated population raises productivity, civic participation and health, benefits that accrue to everyone rather than only to the student. Private decisions ignore those, so provision would be too low.",
  distractors:{1:"Education is rival and excludable — a classroom place can be denied and filled by only one student.",2:"Demand for private education clearly responds to price.",3:"Teaching, maintenance and materials are substantial ongoing costs."},
  misconception:"Government provides many things that are not public goods. The externality argument does far more work than the public goods one." }

];
