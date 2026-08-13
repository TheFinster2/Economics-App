/* Short answer with marking criteria.

   READ THIS BEFORE ADDING A QUESTION. The app never grades prose and never
   implies that it has. `criteria` is a checklist the STUDENT ticks against
   their own answer. `keys` are keyword hints only — mark.js uses them to say
   "these look like they might be covered", labels that as a guess, and never
   pre-ticks anything, never colours anything red, and never scores it.

   That restraint is the whole design. A keyword matcher cannot tell a good
   economics answer from a bad one that happens to contain "aggregate demand",
   and pretending otherwise would teach students to write for the matcher. */

window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};

ECON.DATA.short_prelim = [

{ id:"sa-001", mod:"P3", topic:"Elasticity", marks:6,
  q:"Explain why the price elasticity of demand for a good matters to a firm deciding whether to raise its price, and to a government deciding what to tax.",
  criteria:[
    "Defines price elasticity of demand as the responsiveness of quantity demanded to a change in price",
    "Explains that if demand is inelastic, a price rise increases total revenue because quantity falls proportionally less",
    "Explains that if demand is elastic, a price rise reduces total revenue because quantity falls proportionally more",
    "Explains that a government seeking stable revenue taxes goods with inelastic demand, since consumption changes little",
    "Explains that a government seeking to change behaviour needs demand that is elastic enough for the tax to reduce consumption",
    "Notes that the two government objectives conflict, since a tax that raises steady revenue is one that has not changed much behaviour"
  ],
  keys:[["elasticity","responsiveness","percentage change","quantity demanded"],["inelastic","revenue rises","price up","proportionally less"],["elastic","revenue falls","proportionally more"],["tax","stable revenue","inelastic","tobacco","fuel"],["change behaviour","reduce consumption","elastic enough","deterrent"],["conflict","cannot do both","tension","trade-off"]],
  sample:"Price elasticity of demand measures how strongly quantity demanded responds to a price change, calculated as the percentage change in quantity divided by the percentage change in price. For a firm the practical question is what happens to total revenue, which is price times quantity. If demand is inelastic — few substitutes, a necessity, a small share of income — a ten per cent price rise costs the firm less than ten per cent of its sales, so revenue rises. If demand is elastic, the same price rise costs more than ten per cent of sales and revenue falls, which is why a single brand in a crowded market has far less pricing freedom than a utility. A government faces the same arithmetic from the other side, but with two different objectives that pull apart. If the aim is revenue, the sensible target is a good with inelastic demand: tobacco, fuel and alcohol raise large and predictable sums precisely because consumption barely moves when the tax rises. If the aim is to change behaviour — to reduce smoking, or emissions, or sugar consumption — then inelastic demand is a problem, because the tax raises money without achieving much. The government needs demand elastic enough at the margin for the price signal to bite. The tension is unavoidable: a tax that succeeds completely in changing behaviour eventually raises no revenue at all, and a tax that raises steady revenue year after year is evidence that behaviour has not changed much.",
  common:["States the formula without ever linking elasticity to total revenue",
          "Treats the revenue objective and the behaviour objective as though a single tax achieves both equally well"] },

{ id:"sa-002", mod:"P3", topic:"Market failure", marks:6,
  q:"Explain why a market with a significant negative externality does not produce the socially optimal quantity, and assess one policy response.",
  criteria:[
    "Defines a negative externality as a cost falling on a third party that is not reflected in the market price",
    "Explains that marginal private cost is below marginal social cost, so the supply curve understates the true cost",
    "Explains that price is therefore too low and the quantity produced exceeds the socially optimal level",
    "Identifies a policy response such as a corrective tax, regulation or tradeable permits, and explains its mechanism",
    "Identifies a limitation of that policy, such as difficulty valuing the externality or the burden falling on lower income households",
    "Reaches a judgement about the policy that is supported by the points made"
  ],
  keys:[["externality","third party","not in the price","spillover"],["private cost","social cost","below","understates"],["price too low","overproduce","above optimal","too much"],["tax","permit","regulation","internalise","mechanism"],["limitation","hard to value","regressive","enforcement","difficult"],["judgement","on balance","effective","conclude"]],
  sample:"A negative externality is a cost of production or consumption that falls on someone outside the transaction and is not reflected in the price. A factory discharging waste into a river bears the cost of its inputs and labour but not the cost borne by downstream users, so its marginal private cost is below the marginal social cost. Because the supply curve reflects only private cost, it sits below where a true social cost curve would sit. The market clears at the intersection of demand and private cost, which occurs at a lower price and a higher quantity than the intersection of demand and social cost. The market therefore overproduces, and every unit between the market quantity and the social optimum imposes more cost on society than the benefit it creates. A corrective tax set equal to the external cost per unit is the classic response. It raises the private cost the firm faces to the social cost, shifting supply left so the market outcome coincides with the social optimum. It has the advantage of leaving the choice of how to abate with the firm, which is likely to find the cheapest method. Its main limitation is informational: setting the tax correctly requires valuing the external damage in dollars, which is genuinely difficult and contested for something like air quality or biodiversity. A tax that is too low leaves overproduction in place, and one that is too high causes underproduction. Consumption taxes of this kind are also regressive, since lower-income households spend a larger share of income on the taxed goods. On balance a corrective tax is the better instrument where the damage can be reasonably estimated and monitored, because it achieves the reduction at the lowest total cost; where valuation is impossible, a quantity instrument such as a tradeable permit scheme has the advantage of fixing the environmental outcome even though the price is then uncertain.",
  common:["Says the externality raises the firm's costs, when the point is that it does not",
          "Describes the policy without ever reaching the judgement 'assess' requires"] },

{ id:"sa-003", mod:"P6", topic:"The multiplier", marks:5,
  q:"Explain how the multiplier process works, and explain two factors that reduce its size in the Australian economy.",
  criteria:[
    "Explains that an initial injection becomes income for its recipients",
    "Explains that recipients spend a fraction of that income determined by the marginal propensity to consume, creating further income",
    "Explains that each successive round is smaller because of leakages, so the series converges",
    "States that the multiplier equals 1 ÷ MPS and applies it to an example",
    "Identifies two leakages that reduce its size, such as a high import propensity or progressive taxation, and explains the mechanism of each"
  ],
  keys:[["injection","becomes income","recipients","initial"],["mpc","spend a fraction","further income","respent"],["each round smaller","leakage","converge","diminish"],["1 ÷ mps","formula","example","multiplied"],["imports","taxation","saving","reduce","open economy"]],
  sample:"The multiplier describes the fact that an injection into the circular flow raises national income by more than the injection itself. Suppose the government spends an extra one billion dollars on construction. That billion is income for the contractors and their employees. They spend a fraction of it, determined by the marginal propensity to consume, and what they spend becomes income for retailers, suppliers and service providers, who in turn spend a fraction of what they receive. Each round is smaller than the one before, because some of every dollar received leaks out of the domestic flow, and the sum of the rounds converges on a finite total. That total is the injection multiplied by 1 ÷ MPS: with an MPS of 0.25, a one billion dollar injection eventually raises national income by four billion. Two features of the Australian economy make the effective multiplier smaller than that simple formula suggests. The first is import propensity. Australia imports a substantial share of consumer goods, so a meaningful part of each round of spending goes to foreign producers and leaves the domestic flow immediately, adding nothing to Australian income. The second is progressive taxation. Because average tax rates rise with income, each round of extra income is taxed at a higher average rate than the last, which withdraws a growing share before it can be respent. Both are leakages in exactly the sense the model requires, and both mean that in an open economy with a substantial tax system the realistic multiplier is well below the value implied by the marginal propensity to save alone.",
  common:["Quotes the formula without describing the rounds of respending that generate it",
          "Names leakages without explaining how each one shrinks the successive rounds"] }

];

ECON.DATA.short_hsc = [

{ id:"sa-101", mod:"H2", topic:"Balance of payments", marks:6,
  q:"Explain why Australia has run persistent current account deficits, and assess whether they represent a problem.",
  criteria:[
    "Explains that the current account records trade in goods and services plus primary and secondary income",
    "Explains that Australia's net primary income deficit reflects servicing costs on past foreign borrowing and foreign ownership",
    "Explains the savings-investment gap: domestic saving is insufficient to fund domestic investment, so the shortfall is funded from abroad",
    "Explains that a deficit financed by productive investment differs from one financed by consumption",
    "Identifies a risk such as the valuation effect on foreign-currency debt, or a sudden loss of investor confidence",
    "Reaches a judgement about whether the deficit is a problem, supported by the distinction drawn"
  ],
  keys:[["current account","goods and services","primary income","components"],["net primary income","interest","dividends","servicing","past borrowing"],["savings investment gap","domestic saving","insufficient","funded from abroad"],["productive investment","consumption","pitchford","self-correcting"],["valuation effect","confidence","risk","depreciation","credit rating"],["judgement","on balance","not necessarily","conclude"]],
  sample:"The current account records Australia's trade in goods and services together with primary income, which is largely interest and dividends flowing to foreign lenders and owners, and secondary income. Australia's balance on goods and services has often been in surplus, particularly during commodity booms. What drives the persistent deficit is the primary income component, which has been consistently and substantially negative because decades of foreign borrowing and foreign ownership of Australian assets generate a large annual servicing outflow. Underlying this is a savings-investment gap. Australia has abundant investment opportunities, particularly in resource extraction and infrastructure, and domestic saving has not been sufficient to fund them. The shortfall is met by foreign capital, which appears as a financial account surplus, and the return paid on that capital appears as the primary income deficit. In that sense the current account deficit is the accounting mirror of a genuine and largely voluntary investment decision. Whether it is a problem depends on what the borrowing funded. Borrowing that finances productive investment raises the economy's future capacity to produce and to service the debt, and the private parties involved bear the risk of their own decisions — the argument associated with the Pitchford thesis. Borrowing that funds current consumption raises future obligations without raising future capacity, and is far harder to justify. There are real risks either way. A large stock of foreign-currency-denominated debt is exposed to the valuation effect: a depreciation increases its Australian dollar value overnight. A sudden loss of investor confidence could force a sharp adjustment through the exchange rate and interest rates. The reasonable judgement is that a current account deficit of the composition Australia has run is not in itself a problem, because it is largely private, largely hedged, and largely investment-driven; but the size of the accumulated foreign liabilities is a genuine vulnerability that makes the economy more sensitive to global financial conditions than it would otherwise be.",
  common:["Treats the current account deficit as though it were a government budget deficit",
          "Concludes 'it is a problem' or 'it is not' without distinguishing what the borrowing funded"] },

{ id:"sa-102", mod:"H4", topic:"Monetary policy", marks:6,
  q:"Explain how monetary policy is implemented in Australia and how a change in the cash rate affects economic activity.",
  criteria:[
    "States that the Reserve Bank sets a target for the cash rate, the overnight interbank lending rate",
    "Explains that the target is achieved through domestic market operations that alter the supply of exchange settlement funds",
    "Explains that selling securities drains cash and raises the rate, while buying securities adds cash and lowers it",
    "Explains at least two channels of the transmission mechanism, such as borrowing costs, asset prices or the exchange rate",
    "Explains that the effect on aggregate demand feeds through to inflation and employment",
    "Explains that the transmission takes one to two years, which is why policy must be set on forecasts rather than current data"
  ],
  keys:[["cash rate","target","overnight","interbank","reserve bank"],["domestic market operations","exchange settlement","supply of funds"],["sell securities","drain","raise","buy","add","lower"],["borrowing costs","asset prices","exchange rate","wealth","cash flow"],["aggregate demand","inflation","employment","spending"],["lag","one to two years","forecast","ahead"]],
  sample:"The Reserve Bank board sets a target for the cash rate, which is the interest rate on unsecured overnight loans between banks. It does not decree that rate; it makes it happen by controlling the supply of exchange settlement funds through domestic market operations. If the board wants a higher rate, the Bank sells government securities to the banks, draining cash from the settlement system. Cash becomes scarcer relative to demand and the overnight rate is bid up to the new target. Buying securities does the reverse. Because the cash rate is the reference point from which every other interest rate in the economy is priced, banks then reprice mortgages, business loans and deposits. From there the change reaches activity through several channels. The most direct is the cost of borrowing and the cash flow of existing borrowers: a household on a variable mortgage has less disposable income the month after a rise, and firms considering an investment face a higher hurdle rate. The second is asset prices — higher rates reduce the present value of future income streams, so housing and equity prices soften, and the wealth effect reduces consumption. The third is the exchange rate: higher Australian rates attract capital inflow, the dollar tends to appreciate, imports become cheaper and exports less competitive, which lowers net exports and directly reduces imported inflation. Expectations run alongside all three, since a credible tightening changes what households and firms expect prices to do. Together these reduce aggregate demand, easing pressure on capacity and so on inflation, at the cost of slower employment growth. The critical practical point is timing. The full effect takes roughly one to two years to work through, so the Bank is always setting policy for conditions that do not yet exist. That is why decisions are made on forecasts, why the Bank moves in small increments, and why it looks through temporary price shocks it cannot influence.",
  common:["Says the Reserve Bank 'sets interest rates' for mortgages directly",
          "Lists the channels without explaining how any of them changes spending"] },

{ id:"sa-103", mod:"H3", topic:"Unemployment", marks:5,
  q:"Distinguish between cyclical and structural unemployment, and explain why the appropriate policy response differs.",
  criteria:[
    "Defines cyclical unemployment as caused by a fall in aggregate demand below the economy's capacity",
    "Defines structural unemployment as caused by a mismatch between the skills workers have and those employers need",
    "Explains that cyclical unemployment falls when demand recovers, whereas structural unemployment persists through the cycle",
    "Explains that expansionary fiscal or monetary policy is the appropriate response to cyclical unemployment",
    "Explains that structural unemployment requires supply-side responses such as training, mobility assistance and microeconomic reform, and that stimulus alone would raise inflation without reducing it"
  ],
  keys:[["cyclical","aggregate demand","downturn","recession"],["structural","mismatch","skills","technology","industry decline"],["recovers","persists","through the cycle","remains"],["expansionary","stimulus","fiscal","monetary","demand side"],["training","retraining","mobility","microeconomic reform","supply side","inflation"]],
  sample:"Cyclical unemployment is caused by a deficiency of aggregate demand. When spending falls below what the economy can produce, firms find stock accumulating, cut output, and shed labour. It rises in a contraction and falls in an expansion, which is why it is named for the cycle. Structural unemployment has a different cause entirely: the jobs that exist do not match the workers who are available. Technological change, the decline of an industry, or the geographic concentration of new jobs away from where displaced workers live all produce it. The distinguishing test is what happens when demand recovers. Cyclical unemployment disappears, because the same workers with the same skills are hired back into the same kinds of jobs. Structural unemployment does not, because the vacancies being created require skills the unemployed do not have, or exist in places they cannot reach. The policy implication follows directly. Cyclical unemployment responds to demand-side policy: an expansionary fiscal stance or lower interest rates raise spending, firms rehire, and the problem resolves. Applying the same treatment to structural unemployment does not work. Stimulating demand in an economy where the unemployed cannot fill the vacancies bids up wages in the sectors that are already tight, generating inflation, while leaving the structurally unemployed exactly where they were. What structural unemployment requires is supply-side action: retraining and vocational education aimed at the skills actually in demand, assistance with relocation, recognition of qualifications, and microeconomic reform that makes labour and product markets more flexible. These work slowly and are politically unrewarding, which is part of why structural unemployment is so persistent. Diagnosing which type dominates at a given moment is therefore the first task, because the wrong instrument does not simply fail — it makes inflation worse while achieving nothing.",
  common:["Describes both types without ever explaining why the remedies differ",
          "Suggests stimulus as the answer to every kind of unemployment"] }

];
