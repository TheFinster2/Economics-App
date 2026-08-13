/* Multiple choice — Preliminary course (P1–P6).

   Two rules that validate.js enforces and that matter more than they look:

   1. Every question carries a `why` for the correct answer AND a one-line
      reason for every distractor. A question that only says "wrong" teaches
      nothing; the reason a wrong answer is tempting is the actual lesson.

   2. Option lengths are balanced. If the correct answer is reliably the
      longest option, a student who knows no economics can score by counting
      characters, and validate.js fails the build when that happens in more
      than about a third of a topic's questions. */

window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.mcq_p1 = [

{ id:"p1-001", mod:"P1", topic:"Scarcity", diff:1,
  q:"The fundamental economic problem exists because",
  options:["wants are unlimited but the resources to satisfy them are not","governments are unable to distribute income fairly between groups","some countries have far more natural resources than other countries","people are unwilling to work as hard as the economy requires"], answer:0,
  why:"Scarcity is the gap between unlimited wants and limited resources. It is why every choice has an opportunity cost and why economics exists as a discipline at all.",
  distractors:{1:"Distribution is a separate question that arises only because output is scarce in the first place.",2:"Resource-rich countries still face scarcity, because their resources are finite too.",3:"Effort is one input among several and does not create the underlying problem."},
  misconception:"Scarcity is not poverty. A wealthy economy faces scarcity too, because its wants have grown with its income." },

{ id:"p1-002", mod:"P1", topic:"Opportunity cost", diff:2,
  q:"A student spends Saturday studying rather than working a shift worth $120 or going to a concert worth $80 to them. The opportunity cost of studying is",
  options:["$120, the value of the next best alternative given up","$200, the value of both alternatives that were given up","$40, the difference between the two alternatives","zero, because no money was actually spent"], answer:0,
  why:"Opportunity cost counts only the NEXT best alternative, not the sum of everything forgone. The shift at $120 was worth more than the concert, so it is the relevant sacrifice.",
  distractors:{1:"Adding the alternatives double-counts: the student could not have done both anyway.",2:"The difference between two alternatives is not what was sacrificed.",3:"Opportunity cost is about what is forgone, not about cash changing hands."},
  misconception:"Next best. Not all the others added together, and not the cash price." },

{ id:"p1-003", mod:"P1", topic:"Production possibility frontier", diff:2,
  q:"A point inside a production possibility frontier represents",
  options:["unemployed or inefficiently used resources","a combination that is currently unattainable","the most efficient possible allocation of resources","a point that becomes attainable only after economic growth"], answer:0,
  why:"Every point on the frontier uses all resources fully and efficiently. A point inside means output could rise without giving anything up, which is the definition of inefficiency.",
  distractors:{1:"Points inside are attainable; it is points beyond the curve that are not.",2:"Efficient allocations lie on the frontier, not inside it.",3:"Growth is what moves the frontier outward, reaching points beyond it."},
  misconception:"" },

{ id:"p1-004", mod:"P1", topic:"Production possibility frontier", diff:3,
  q:"A production possibility frontier is drawn concave to the origin because",
  options:["resources are not equally suited to producing both goods","technology improves as more of one good is produced","consumers prefer a balanced combination of the two goods","the economy has a fixed quantity of labour available"], answer:0,
  why:"Shifting resources best suited to one good into producing the other yields progressively less, so opportunity cost rises as more is produced. That increasing opportunity cost is what bends the curve.",
  distractors:{1:"Improving technology shifts the frontier outward rather than shaping its curvature.",2:"Preferences determine which point is chosen, not the shape of the constraint.",3:"A fixed quantity of labour alone would give a straight line if labour were equally productive in both uses."},
  misconception:"A straight-line frontier means constant opportunity cost. A curved one means it rises." },

{ id:"p1-005", mod:"P1", topic:"Circular flow", diff:2,
  q:"In the five-sector circular flow model, the leakages are",
  options:["savings, taxation and import spending","savings, investment and government spending","taxation, exports and consumer spending","investment, exports and government spending"], answer:0,
  why:"A leakage is income received but not passed back to domestic firms as spending. Saving, tax and money spent on imports all leave the domestic flow.",
  distractors:{1:"Investment and government spending are injections, not leakages.",2:"Exports are an injection and consumer spending stays in the flow.",3:"All three of these add to the flow rather than withdrawing from it."},
  misconception:"" },

{ id:"p1-006", mod:"P1", topic:"Circular flow", diff:3,
  q:"If total leakages exceed total injections, the level of economic activity will",
  options:["contract until leakages and injections are equal again","expand, because saving finances additional investment","remain unchanged, since the two always balance by definition","expand only if the government also runs a budget surplus"], answer:0,
  why:"More is being withdrawn than returned, so firms' receipts fall, they cut output and employment, incomes fall, and the leakages fall with them until balance is restored at a lower level of income.",
  distractors:{1:"Saving only finances investment if it is actually borrowed and spent; unspent saving is a withdrawal.",2:"They are equal only in equilibrium, which is the state the economy moves towards rather than always occupies.",3:"A surplus increases leakages further and would deepen the contraction."},
  misconception:"Equilibrium in the circular flow does not mean full employment. It only means the level of income is stable." },

{ id:"p1-007", mod:"P1", topic:"Economic systems", diff:2,
  q:"In a market economy, the question of WHAT to produce is answered primarily by",
  options:["the price signals generated by consumer spending decisions","a central authority that plans output for each industry","the historical production patterns of the previous year","the relative political power of producer organisations"], answer:0,
  why:"Prices carry information about what consumers value. Rising prices signal profit, which draws resources in, so consumer spending determines the allocation without anyone directing it.",
  distractors:{1:"Central planning is the defining feature of a command economy.",2:"Tradition answers the question in a traditional economy, not a market one.",3:"Political influence may distort a market but is not the allocating mechanism."},
  misconception:"" },

{ id:"p1-008", mod:"P1", topic:"Economic growth", diff:2,
  q:"Which change would shift an economy's production possibility frontier outward?",
  options:["An improvement in the general level of education and skills","A fall in unemployment from six per cent to four per cent","A decision to produce more capital goods than consumer goods","An increase in consumer demand for both goods at once"], answer:0,
  why:"The frontier depends on the quantity and quality of resources. Better human capital raises what the same number of workers can produce, so the whole constraint moves out.",
  distractors:{1:"Falling unemployment moves the economy from inside the frontier towards it, not beyond it.",2:"That is a movement along the existing frontier, though it may cause growth later.",3:"Demand determines which point is chosen; it does not change what is possible."},
  misconception:"Moving towards the frontier is a recovery. Moving the frontier itself is growth." }

];

ECON.DATA.mcq_p2 = [

{ id:"p2-001", mod:"P2", topic:"Consumer decisions", diff:2,
  q:"A household's marginal propensity to consume is 0.8. If income rises by $500, consumption rises by",
  options:["$400, and saving rises by $100","$500, since all extra income is spent","$80, which is a fifth of the increase","$625, once the multiplier is applied"], answer:0,
  why:"MPC is the proportion of each additional dollar that is spent, so 0.8 × $500 = $400. The rest, $100, is saved, which is the MPS of 0.2.",
  distractors:{1:"That would require an MPC of exactly one, meaning nothing is saved.",2:"That is 0.16 of the increase, which corresponds to no stated propensity here.",3:"The multiplier applies to a change in injections across the economy, not to one household's consumption."},
  misconception:"MPC and MPS always add to one, because every extra dollar is either spent or saved." },

{ id:"p2-002", mod:"P2", topic:"Consumer decisions", diff:2,
  q:"As household income rises, the average propensity to consume typically",
  options:["falls, because a larger share of income is saved","rises, because households buy more expensive goods","stays constant, since spending is proportional to income","falls to zero once a certain income level is reached"], answer:0,
  why:"Low-income households spend nearly all their income on necessities. As income rises, spending rises in absolute terms but by less than income, so the proportion saved increases.",
  distractors:{1:"Total spending does rise, but the question asks about the share of income, which falls.",2:"A constant APC would mean the saving ratio never changed with income.",3:"Consumption never falls to zero; it simply grows more slowly than income."},
  misconception:"" },

{ id:"p2-003", mod:"P2", topic:"Business costs", diff:2,
  q:"Which cost is a fixed cost for a bakery in the short run?",
  options:["The lease payment on the shop premises","The flour used to make each loaf","The electricity used by the ovens","The wages of casual weekend staff"], answer:0,
  why:"A fixed cost does not change with output. The lease is owed whether the bakery produces one loaf or a thousand, which is exactly why average fixed cost falls as output rises.",
  distractors:{1:"Flour is consumed in proportion to output, making it variable.",2:"Oven electricity rises with the number of batches baked.",3:"Casual hours are adjusted according to how busy the shop is."},
  misconception:"" },

{ id:"p2-004", mod:"P2", topic:"Economies of scale", diff:3,
  q:"A firm doubles its output and its average cost per unit falls. This is best explained by",
  options:["economies of scale spreading fixed costs over more units","a fall in the market price of the firm's final product","an increase in consumer demand for the firm's product","the firm reducing the quality of its inputs to save money"], answer:0,
  why:"Fixed costs do not change with output, so spreading them across twice as many units halves the fixed cost per unit. Bulk purchasing and specialisation of labour add to the effect.",
  distractors:{1:"The selling price is revenue, not cost, so it does not affect average cost.",2:"Demand explains why output rose but not why cost per unit fell.",3:"Cutting quality is a different action, and the question describes scale alone."},
  misconception:"Economies of scale are about cost per unit, not total cost. Total cost still rises." },

{ id:"p2-005", mod:"P2", topic:"Business goals", diff:2,
  q:"A firm's decision to reduce packaging waste even though it raises costs slightly is best explained as",
  options:["pursuing corporate social responsibility alongside profit","maximising short-run profit at the expense of market share","an example of economies of scale in production","a response to a fall in the price of packaging materials"], answer:0,
  why:"CSR describes voluntary obligations to stakeholders and the environment beyond legal requirements. Firms accept a small cost for reputational, staff and long-term commercial reasons.",
  distractors:{1:"Raising costs reduces short-run profit rather than maximising it.",2:"Economies of scale concern cost per unit as output grows.",3:"Cheaper materials would lower costs, but the question says costs rose."},
  misconception:"" },

{ id:"p2-006", mod:"P2", topic:"Income elasticity", diff:3,
  q:"Demand for a good falls by four per cent when income rises by eight per cent. The good is",
  options:["inferior, with an income elasticity of −0.5","a luxury, with an income elasticity of 2.0","a necessity, with an income elasticity of 0.5","perfectly income inelastic, with an elasticity of zero"], answer:0,
  why:"Income elasticity is −4 ÷ 8 = −0.5. The negative sign is what defines an inferior good: as people can afford better alternatives, they buy less of it.",
  distractors:{1:"A luxury has an elasticity above one and demand rising with income.",2:"A necessity has a positive elasticity below one; here demand fell.",3:"Zero elasticity would mean demand did not change at all."},
  misconception:"The SIGN classifies the good; the SIZE says how strongly it responds." }

];

ECON.DATA.mcq_p3 = [

{ id:"p3-001", mod:"P3", topic:"Demand and supply", diff:2,
  q:"A fall in the price of a good, other things equal, causes",
  options:["a movement along the demand curve to a higher quantity","the whole demand curve to shift bodily to the right","the supply curve to shift to the right","both curves to shift in the same direction"], answer:0,
  why:"Price is on the axis, so a price change moves you along the curve. Only a change in a non-price determinant — income, tastes, related prices, expectations, number of buyers — shifts the curve itself.",
  distractors:{1:"A shift requires a non-price determinant to change, which nothing here does.",2:"A price fall reduces quantity supplied along the existing supply curve.",3:"Neither curve shifts when the good's own price is what changed."},
  misconception:"Change in demand shifts the curve. Change in quantity demanded moves along it. Examiners test this distinction relentlessly." },

{ id:"p3-002", mod:"P3", topic:"Market equilibrium", diff:2,
  q:"If the price of a good is set below the equilibrium price, the result is",
  options:["a shortage, which puts upward pressure on the price","a surplus, which puts downward pressure on the price","no change, because the market is already in balance","an immediate shift of the supply curve to the right"], answer:0,
  why:"At a low price, quantity demanded exceeds quantity supplied. Unsatisfied buyers bid the price up, which reduces quantity demanded and increases quantity supplied until they meet.",
  distractors:{1:"A surplus arises when the price is ABOVE equilibrium.",2:"A price away from equilibrium is by definition not in balance.",3:"A price change causes movement along the supply curve, not a shift of it."},
  misconception:"" },

{ id:"p3-003", mod:"P3", topic:"Elasticity", diff:3,
  q:"A firm raises its price by ten per cent and its total revenue falls. Demand for its product over that range is",
  options:["elastic, because quantity fell proportionally more than price rose","inelastic, because consumers had very few close alternatives available to them","unit elastic, since revenue responded to the price change","perfectly inelastic, because quantity fell when price rose"], answer:0,
  why:"Revenue is price times quantity. If revenue falls when price rises, the fall in quantity must have outweighed the rise in price, which is exactly what elasticity greater than one means.",
  distractors:{1:"With inelastic demand, raising price RAISES total revenue.",2:"Unit elastic demand leaves total revenue unchanged.",3:"Perfectly inelastic demand means quantity does not change at all."},
  misconception:"The revenue test: price and revenue move together when demand is inelastic, and in opposite directions when it is elastic." },

{ id:"p3-004", mod:"P3", topic:"Elasticity", diff:2,
  q:"Which good is most likely to have inelastic demand?",
  options:["Insulin for a person with type 1 diabetes","One particular brand of soft drink among many","Restaurant meals in a large city","Overseas holiday travel"], answer:0,
  why:"Demand is inelastic when a good is a necessity with no substitute and takes a small share of income. A life-sustaining medicine meets all three conditions.",
  distractors:{1:"One brand among many has close substitutes, so demand is highly elastic.",2:"Eating out is easily postponed or replaced by cooking at home.",3:"Travel is a luxury and a large share of income, so demand is elastic."},
  misconception:"" },

{ id:"p3-005", mod:"P3", topic:"Elasticity", diff:3,
  q:"Supply is usually more elastic in the long run than in the short run because firms can",
  options:["change their scale of production and enter or leave the industry","raise prices more easily once consumers become accustomed to them","predict future demand with much greater accuracy over time","reduce their fixed costs to zero given a long enough period"], answer:0,
  why:"In the short run at least one input is fixed, so output can only be stretched. Given time, firms can build capacity and new firms can enter, so quantity responds much more to a price change.",
  distractors:{1:"Elasticity of supply is about quantity response, not about price setting.",2:"Better forecasting does not change the physical ability to adjust output.",3:"Fixed costs become variable in the long run but do not vanish."},
  misconception:"" },

{ id:"p3-006", mod:"P3", topic:"Market failure", diff:2,
  q:"Street lighting is usually provided by government rather than by private firms because it is",
  options:["non-excludable, so firms cannot charge those who benefit","too expensive for any private firm to construct or maintain","a good that consumers do not value highly enough to buy","a natural monopoly with steeply falling average costs"], answer:0,
  why:"A public good is non-excludable and non-rival. Because no one can be prevented from benefiting, everyone has an incentive to free ride, and no private firm can collect enough revenue to supply it.",
  distractors:{1:"Cost is not the barrier; private firms build far more expensive infrastructure.",2:"Consumers value street lighting; they simply cannot be made to pay for it individually.",3:"Natural monopoly is a different market failure, and lighting is not rival in consumption."},
  misconception:"The problem with a public good is not the cost. It is that you cannot charge for it." },

{ id:"p3-007", mod:"P3", topic:"Market failure", diff:3,
  q:"A factory's production pollutes a nearby river. Left alone, the market will",
  options:["overproduce the good, because the cost to third parties is not in the price","underproduce the good, because pollution raises the firm's costs","produce the socially optimal quantity once consumers learn of the pollution","stop producing entirely once the external cost becomes known"], answer:0,
  why:"A negative externality means the private cost the firm faces is less than the true social cost. Price is set too low, so the quantity traded exceeds the socially optimal level.",
  distractors:{1:"The pollution costs fall on third parties, not on the firm, so its costs are unaffected.",2:"Awareness alone does not force the firm to bear the cost; that requires intervention.",3:"The firm continues producing precisely because it does not pay the external cost."},
  misconception:"Negative externality means too much is produced. Positive externality means too little." },

{ id:"p3-008", mod:"P3", topic:"Market structures", diff:2,
  q:"Which feature distinguishes monopolistic competition from perfect competition?",
  options:["Products are differentiated rather than identical","There are only two or three firms in the market","Firms face significant barriers to entering the market","One firm supplies the entire output of the market"], answer:0,
  why:"Both have many firms and easy entry. The difference is product differentiation, which gives each firm a small degree of price-setting power over its own loyal customers.",
  distractors:{1:"A handful of large firms describes oligopoly.",2:"Entry is relatively free in monopolistic competition.",3:"A single supplier is a monopoly."},
  misconception:"" },

{ id:"p3-009", mod:"P3", topic:"Government intervention", diff:3,
  q:"A government sets a maximum rent below the market equilibrium. The most likely result is",
  options:["a persistent shortage of rental housing over time","an increase in the number of dwellings offered for rent","rents settling at the equilibrium level within a few months","a surplus of vacant dwellings that landlords cannot let"], answer:0,
  why:"A binding price ceiling holds the price below equilibrium, so quantity demanded exceeds quantity supplied. Over time supply falls further as landlords withdraw or fail to maintain properties, deepening the shortage.",
  distractors:{1:"A lower controlled rent reduces the incentive to supply rental housing.",2:"A legal maximum prevents the price rising to clear the market.",3:"A surplus results from a price FLOOR, not a ceiling."},
  misconception:"" },

{ id:"p3-010", mod:"P3", topic:"Elasticity", diff:3,
  q:"The cross elasticity of demand between two goods is −1.4. The goods are",
  options:["complements, since a price rise in one reduces demand for the other","substitutes, since consumers switch readily between one and the other","unrelated, because the value is close to negative one","inferior goods, as shown by the negative sign"], answer:0,
  why:"A negative cross elasticity means the two move in opposite directions: raise the price of one and demand for the other falls. That is the signature of goods consumed together.",
  distractors:{1:"Substitutes have a POSITIVE cross elasticity.",2:"Unrelated goods have a cross elasticity near zero, not near −1.4.",3:"The inferior classification comes from INCOME elasticity, not cross elasticity."},
  misconception:"Cross elasticity sign: positive means substitutes, negative means complements." }

];

ECON.DATA.mcq_p4 = [

{ id:"p4-001", mod:"P4", topic:"Labour force", diff:2,
  q:"A person who has given up looking for work after two years of searching is classified as",
  options:["not in the labour force, so not counted as unemployed","unemployed, since they still want a job","employed, because they are of working age","underemployed, as they are working fewer hours than desired"], answer:0,
  why:"To be counted as unemployed a person must be actively seeking and available for work. Discouraged workers fail the first test, which is why the measured unemployment rate can understate the problem.",
  distractors:{1:"Wanting a job is not enough; active search is required by the definition.",2:"Being of working age says nothing about whether a person has a job.",3:"Underemployment applies to people who are working but want more hours."},
  misconception:"This is hidden unemployment, and it is why a falling unemployment rate can coincide with a falling participation rate." },

{ id:"p4-002", mod:"P4", topic:"Labour force", diff:3,
  q:"During a recession, the measured unemployment rate sometimes falls even as employment falls. This happens because",
  options:["discouraged workers leave the labour force, shrinking the denominator","the population of working age falls sharply during downturns","the government changes the definition of unemployment","employers reclassify full-time roles as part-time positions"], answer:0,
  why:"The rate is unemployed ÷ labour force. If people stop searching they leave both the numerator and the labour force, and the rate can fall without a single job being created.",
  distractors:{1:"The working-age population changes slowly and is not affected by the cycle.",2:"The ABS definition is stable and internationally standardised.",3:"Reclassifying hours affects underemployment, not the headline unemployment rate."},
  misconception:"Always read the unemployment rate alongside the participation rate." },

{ id:"p4-003", mod:"P4", topic:"Demand for labour", diff:2,
  q:"Demand for labour is described as derived demand because it depends on",
  options:["demand for the goods and services that labour produces","the wage that workers are prepared to accept","the number of people available to work in the industry","the level of education and training of the workforce"], answer:0,
  why:"Firms do not want workers for their own sake. They hire because output can be sold, so if demand for the product falls, demand for the labour that makes it falls with it.",
  distractors:{1:"The wage affects the quantity of labour demanded, not the origin of the demand.",2:"The number available is the supply of labour, not the demand for it.",3:"Skills affect productivity and therefore the wage, but not why the demand exists."},
  misconception:"" },

{ id:"p4-004", mod:"P4", topic:"Wage determination", diff:3,
  q:"Nominal wages rise by three per cent while inflation is four per cent. Real wages have",
  options:["fallen by about one per cent","risen by about one per cent","risen by about seven per cent","remained unchanged in purchasing power"], answer:0,
  why:"Real wage change is approximately the nominal change less inflation: 3 − 4 = −1. The pay packet is larger but buys less than it did.",
  distractors:{1:"The subtraction is the wrong way round; inflation exceeded the wage rise.",2:"Adding the two figures treats inflation as though it increased purchasing power.",3:"Purchasing power is unchanged only when the two rates are equal."},
  misconception:"" },

{ id:"p4-005", mod:"P4", topic:"Labour market outcomes", diff:2,
  q:"A national minimum wage set above the market clearing wage is most likely to",
  options:["raise incomes for those employed while reducing quantity of labour demanded","increase both employment and the wages of low-paid workers","have no effect on employment because labour demand is fixed","reduce the wages of workers in higher-paid occupations"], answer:0,
  why:"A binding wage floor lifts pay for those who keep their jobs, but at a higher wage firms demand less labour. The debate is about how large that employment effect actually is.",
  distractors:{1:"A higher wage raises the cost of labour, so quantity demanded falls rather than rises.",2:"Labour demand responds to price like any other demand.",3:"Minimum wages act at the bottom of the distribution, not the top."},
  misconception:"" },

{ id:"p4-006", mod:"P4", topic:"Labour market outcomes", diff:3,
  q:"Which is the main long-run source of sustained increases in real wages?",
  options:["Growth in labour productivity","More frequent industrial disputes","A steady rise in the general price level","A fall in the participation rate over time"], answer:0,
  why:"Real wages can rise sustainably only if each hour worked produces more. Anything else redistributes existing output or is eroded by inflation.",
  distractors:{1:"Disputes may shift the share of output to labour temporarily, but they do not create more output.",2:"A rising price level erodes real wages unless nominal wages rise faster.",3:"Fewer people participating does not make each worker more productive."},
  misconception:"" }

];

ECON.DATA.mcq_p5 = [

{ id:"p5-001", mod:"P5", topic:"Financial markets", diff:2,
  q:"When a company issues new shares to raise funds for expansion, the transaction takes place in",
  options:["the primary market, because new funds reach the issuer","the secondary market, because shares are being traded","the foreign exchange market, if any investors are overseas","the money market, since the funds are needed immediately"], answer:0,
  why:"The primary market is where a security is issued for the first time and the proceeds go to the issuer. Later trades between investors happen in the secondary market and raise nothing new for the company.",
  distractors:{1:"Secondary market trades move ownership between investors only.",2:"Foreign participation does not change which market the issue occurs in.",3:"The money market deals in short-term debt, not equity issues."},
  misconception:"Buying shares on the ASX gives the company no money. That money changed hands when the shares were first issued." },

{ id:"p5-002", mod:"P5", topic:"Interest rates", diff:3,
  q:"The nominal interest rate is 6% and inflation is 2%. A borrower's real cost of borrowing is approximately",
  options:["4%","8%","3%","12%"], answer:0,
  why:"The real rate is the nominal rate less inflation, so 6 − 2 = 4%. Inflation erodes the real value of the amount repaid, which is why it is subtracted.",
  distractors:{1:"Adding inflation would mean rising prices made borrowing more expensive, which is backwards.",2:"That is the nominal rate divided by inflation, which has no meaning here.",3:"Multiplying the two rates is not how the real rate is calculated."},
  misconception:"" },

{ id:"p5-003", mod:"P5", topic:"Financial markets", diff:2,
  q:"The main role of a financial intermediary such as a bank is to",
  options:["channel funds from savers to borrowers, transforming size and term","set the general level of interest rates throughout the whole economy","guarantee that every loan it makes will be repaid in full","issue the nation's currency and manage the exchange rate"], answer:0,
  why:"Savers want small, safe, short-term deposits; borrowers want large, long-term loans. An intermediary pools deposits and transforms them, which is a service neither side could perform alone.",
  distractors:{1:"The Reserve Bank sets the cash rate; banks respond to it.",2:"Credit risk is inherent in lending and cannot be eliminated.",3:"Currency issue and exchange rate management are central bank functions."},
  misconception:"" },

{ id:"p5-004", mod:"P5", topic:"Regulation", diff:3,
  q:"APRA and ASIC differ in that APRA is chiefly concerned with",
  options:["the financial safety of institutions, while ASIC oversees conduct","consumer complaints handling, while ASIC supervises bank capital levels","setting interest rates, while ASIC collects taxation revenue","international trade rules, while ASIC manages the exchange rate"], answer:0,
  why:"APRA is the prudential regulator: it supervises capital, liquidity and risk so institutions can meet their obligations. ASIC regulates market integrity, disclosure and consumer protection.",
  distractors:{1:"This reverses the two roles.",2:"Interest rates are the Reserve Bank's responsibility and tax is the ATO's.",3:"Neither body handles trade rules or the exchange rate."},
  misconception:"" }

];

ECON.DATA.mcq_p6 = [

{ id:"p6-001", mod:"P6", topic:"Aggregate demand", diff:2,
  q:"Aggregate demand in an open economy is the sum of",
  options:["consumption, investment, government spending and net exports","consumption, saving, taxation and imports","wages, rent, interest and profit received by households","the output of the primary, secondary and tertiary sectors"], answer:0,
  why:"AD measures total planned spending on domestic output. Net exports appear as exports minus imports because import spending goes to foreign producers.",
  distractors:{1:"Saving, taxation and imports are leakages, not components of spending on domestic output.",2:"That is the income method of measuring GDP, not aggregate demand.",3:"That is the production method of measuring output."},
  misconception:"" },

{ id:"p6-002", mod:"P6", topic:"The multiplier", diff:3,
  q:"If the marginal propensity to save is 0.25, the simple multiplier is",
  options:["4","2.5","1.33","0.75"], answer:0,
  why:"The multiplier is 1 ÷ MPS = 1 ÷ 0.25 = 4. An injection of $1 million eventually raises national income by $4 million as it is respent round after round.",
  distractors:{1:"That would correspond to an MPS of 0.4.",2:"That would correspond to an MPS of 0.75, which is the MPC here.",3:"That is the MPC itself rather than the multiplier."},
  misconception:"Divide into one. The multiplier can never be less than one." },

{ id:"p6-003", mod:"P6", topic:"Taxation", diff:2,
  q:"Australia's personal income tax is progressive, which means that as income rises",
  options:["a higher proportion of income is paid in tax","the total amount of tax paid stays the same","a smaller proportion of income is paid in tax","tax is levied at a single flat rate on all income"], answer:0,
  why:"Progressive means the average rate rises with income. Higher marginal rates apply only to income above each threshold, which is why the average rate is always below the top marginal rate.",
  distractors:{1:"Tax paid rises with income under any of the three structures.",2:"A falling proportion describes a regressive tax such as the GST.",3:"A single flat rate is a proportional tax."},
  misconception:"Moving into a higher bracket does not tax all your income at the higher rate — only the part above the threshold." },

{ id:"p6-004", mod:"P6", topic:"Budget", diff:3,
  q:"During a recession, the budget deficit tends to widen even before any new policy is announced because",
  options:["tax receipts fall and welfare payments rise automatically","the government always announces a stimulus package immediately","public debt interest payments rise as the economy weakens","the Reserve Bank instructs the Treasury to increase spending"], answer:0,
  why:"These are automatic stabilisers. Lower incomes and profits reduce tax revenue while unemployment benefits rise with the number of claimants, both without any decision being taken.",
  distractors:{1:"Discretionary stimulus is a separate, later decision.",2:"Interest costs rise only after the debt has grown, not immediately.",3:"The Reserve Bank is independent and does not direct fiscal policy."},
  misconception:"The cyclical component moves by itself. Only the structural component reflects deliberate policy." },

{ id:"p6-005", mod:"P6", topic:"Business cycle", diff:2,
  q:"During the contraction phase of the business cycle, you would expect",
  options:["unemployment rising and inflationary pressure easing","unemployment falling and inflationary pressure building","both unemployment and inflation falling to zero","output growing faster than its long-run trend rate"], answer:0,
  why:"Falling aggregate demand reduces output, so firms shed labour and unemployment rises. With spare capacity appearing, price pressure eases.",
  distractors:{1:"That describes an expansion approaching its peak.",2:"Neither variable reaches zero in a normal contraction.",3:"Above-trend growth is an expansion, not a contraction."},
  misconception:"" },

{ id:"p6-006", mod:"P6", topic:"Government intervention", diff:3,
  q:"A government imposes a tax on a good with a strong negative externality. The intended effect is to",
  options:["raise the private cost towards the social cost, reducing output to the optimum","raise revenue without changing consumer or producer behaviour at all","increase supply of the good by compensating producers for the externality","eliminate the externality entirely by banning production of the good"], answer:0,
  why:"The market fails because the price does not include the external cost. A corrective tax internalises it, shifting supply left so that the quantity traded falls towards the socially optimal level.",
  distractors:{1:"If behaviour did not change, the externality would be untouched and the tax would not correct anything.",2:"A tax reduces supply; a subsidy would increase it.",3:"A tax reduces the quantity produced rather than prohibiting it."},
  misconception:"The point of a corrective tax is the behaviour change, not the revenue." }

];
