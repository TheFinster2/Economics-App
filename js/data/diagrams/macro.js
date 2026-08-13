/* Diagrams — macroeconomic and global (P1, P6, H1, H2, H3).
   Same rules as market.js: viewBox only, an id on every labellable element,
   hx/hy for the 44px hit area, and CSS custom properties for colour. */
window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};
ECON.DATA.diagrams = ECON.DATA.diagrams || {};

ECON.DATA.diagrams.businessCycle = {
  id:"businessCycle", title:"The business cycle", mod:"P6", topic:"Business cycle",
  svg:
  "<svg viewBox='0 0 420 300'>" +
  "<line x1='50' y1='250' x2='396' y2='250' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='50' y1='24' x2='50' y2='250' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='24' y='34' fill='var(--ink-2)' font-size='11'>GDP</text>" +
  "<text x='398' y='270' fill='var(--ink-2)' font-size='11' text-anchor='end'>Time</text>" +
  "<line id='trendLine' x1='58' y1='208' x2='390' y2='72' stroke='var(--ink-3)' stroke-width='2.5' stroke-dasharray='6 5'/>" +
  "<path id='cycleCurve' d='M60 206 C 100 140, 130 118, 158 122 C 190 126, 206 190, 236 194 C 268 198, 288 96, 318 84 C 344 74, 366 96, 388 74' fill='none' stroke='var(--accent)' stroke-width='4'/>" +
  "<circle id='peak' cx='158' cy='122' r='7' fill='var(--warn)' stroke='var(--bg)' stroke-width='2'/>" +
  "<circle id='trough' cx='236' cy='194' r='7' fill='var(--bad)' stroke='var(--bg)' stroke-width='2'/>" +
  "<line id='expansion' x1='72' y1='232' x2='150' y2='232' stroke='var(--good)' stroke-width='7'/>" +
  "<line id='contraction' x1='166' y1='232' x2='228' y2='232' stroke='var(--bad)' stroke-width='7'/>" +
  "<line id='recovery' x1='244' y1='232' x2='314' y2='232' stroke='var(--info)' stroke-width='7'/>" +
  "</svg>",
  parts:[
    { id:"cycleCurve", label:"Actual level of activity", hx:290, hy:112,
      role:"The observed path of real GDP, which fluctuates above and below the long-run trend",
      accept:["actual level of activity","actual gdp","business cycle","cycle","actual output"] },
    { id:"trendLine", label:"Long-run trend", hx:200, hy:150,
      role:"The economy's sustainable growth path, set by its productive capacity",
      accept:["long run trend","trend","trend line","potential output","long term trend"] },
    { id:"peak", label:"Peak", hx:158, hy:104,
      role:"The top of the cycle, where capacity is stretched and inflationary pressure is greatest",
      accept:["peak","boom"] },
    { id:"trough", label:"Trough", hx:236, hy:212,
      role:"The bottom of the cycle, where spare capacity and unemployment are greatest",
      accept:["trough","bottom"] },
    { id:"expansion", label:"Expansion", hx:111, hy:232,
      role:"The phase in which output, employment and incomes are rising",
      accept:["expansion","upswing","boom phase"] },
    { id:"contraction", label:"Contraction", hx:197, hy:232,
      role:"The phase in which output falls and unemployment rises; two negative quarters is conventionally a recession",
      accept:["contraction","downswing","recession"] },
    { id:"recovery", label:"Recovery", hx:279, hy:232,
      role:"The phase after the trough in which activity begins to rise again",
      accept:["recovery","upturn"] }
  ]
};

ECON.DATA.diagrams.circularFlow = {
  id:"circularFlow", title:"Five-sector circular flow", mod:"P1", topic:"Circular flow",
  svg:
  "<svg viewBox='0 0 420 330'>" +
  "<rect id='households' x='24' y='128' width='104' height='62' rx='10' fill='var(--card-2)' stroke='var(--accent)' stroke-width='2.5'/>" +
  "<text x='76' y='158' fill='var(--ink)' font-size='12' text-anchor='middle'>Households</text>" +
  "<text x='76' y='174' fill='var(--ink-3)' font-size='10' text-anchor='middle'>consumers</text>" +
  "<rect id='firms' x='292' y='128' width='104' height='62' rx='10' fill='var(--card-2)' stroke='var(--accent)' stroke-width='2.5'/>" +
  "<text x='344' y='158' fill='var(--ink)' font-size='12' text-anchor='middle'>Firms</text>" +
  "<text x='344' y='174' fill='var(--ink-3)' font-size='10' text-anchor='middle'>producers</text>" +
  "<rect id='financialSector' x='176' y='24' width='96' height='46' rx='10' fill='var(--card-3)' stroke='var(--info)' stroke-width='2.5'/>" +
  "<text x='224' y='52' fill='var(--ink)' font-size='11' text-anchor='middle'>Financial</text>" +
  "<rect id='governmentSector' x='176' y='138' width='96' height='46' rx='10' fill='var(--card-3)' stroke='var(--warn)' stroke-width='2.5'/>" +
  "<text x='224' y='166' fill='var(--ink)' font-size='11' text-anchor='middle'>Government</text>" +
  "<rect id='overseasSector' x='176' y='252' width='96' height='46' rx='10' fill='var(--card-3)' stroke='var(--violet)' stroke-width='2.5'/>" +
  "<text x='224' y='280' fill='var(--ink)' font-size='11' text-anchor='middle'>Overseas</text>" +
  "<path id='incomeFlow' d='M128 142 Q 224 100 292 142' fill='none' stroke='var(--good)' stroke-width='3'/>" +
  "<path id='spendingFlow' d='M292 178 Q 224 220 128 178' fill='none' stroke='var(--info)' stroke-width='3'/>" +
  "<line id='leakages' x1='150' y1='210' x2='150' y2='252' stroke='var(--bad)' stroke-width='4'/>" +
  "<line id='injections' x1='298' y1='252' x2='298' y2='210' stroke='var(--good)' stroke-width='4'/>" +
  "<text x='142' y='226' fill='var(--bad)' font-size='10' text-anchor='end'>S T M</text>" +
  "<text x='306' y='226' fill='var(--good)' font-size='10'>I G X</text>" +
  "</svg>",
  parts:[
    { id:"households", label:"Households", hx:76, hy:159,
      role:"Supply the factors of production and receive income; their spending is consumption",
      accept:["households","household sector","consumers"] },
    { id:"firms", label:"Firms", hx:344, hy:159,
      role:"Hire factors of production and produce goods and services",
      accept:["firms","firm sector","producers","business"] },
    { id:"financialSector", label:"Financial sector", hx:224, hy:47,
      role:"Receives savings as a leakage and returns them to the flow as investment",
      accept:["financial sector","financial","banks"] },
    { id:"governmentSector", label:"Government sector", hx:224, hy:161,
      role:"Takes taxation out of the flow and returns government spending to it",
      accept:["government sector","government","public sector"] },
    { id:"overseasSector", label:"Overseas sector", hx:224, hy:275,
      role:"Import spending leaks out to it and export income is injected back from it",
      accept:["overseas sector","overseas","external sector","rest of the world"] },
    { id:"leakages", label:"Leakages", hx:150, hy:231,
      role:"Income withdrawn from the flow: saving, taxation and import spending",
      accept:["leakages","leakage","withdrawals"] },
    { id:"injections", label:"Injections", hx:298, hy:231,
      role:"Spending added to the flow: investment, government spending and export income",
      accept:["injections","injection"] },
    { id:"incomeFlow", label:"Factor income", hx:224, hy:114,
      role:"Wages, rent, interest and profit paid by firms to households for the use of resources",
      accept:["factor income","income","factor payments","wages rent interest profit"] },
    { id:"spendingFlow", label:"Consumption spending", hx:224, hy:206,
      role:"Household spending on goods and services, which returns to firms as revenue",
      accept:["consumption spending","consumption","spending","consumer spending"] }
  ]
};

ECON.DATA.diagrams.lorenzCurve = {
  id:"lorenzCurve", title:"Lorenz curve", mod:"H1", topic:"Inequality",
  svg:
  "<svg viewBox='0 0 340 320'>" +
  "<line x1='56' y1='24' x2='56' y2='266' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='56' y1='266' x2='306' y2='266' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='28' y='36' fill='var(--ink-2)' font-size='10'>% income</text>" +
  "<text x='308' y='288' fill='var(--ink-2)' font-size='10' text-anchor='end'>% population</text>" +
  "<line id='equalityLine' x1='56' y1='266' x2='296' y2='30' stroke='var(--ink-3)' stroke-width='3' stroke-dasharray='6 5'/>" +
  "<path id='lorenzLine' d='M56 266 Q 190 250 296 30' fill='none' stroke='var(--accent)' stroke-width='4'/>" +
  "<path id='giniArea' d='M56 266 Q 190 250 296 30 L 56 266 Z' fill='var(--accent)' opacity='0.18' stroke='none'/>" +
  "<circle id='poorestFifth' cx='104' cy='262' r='6' fill='var(--bad)' stroke='var(--bg)' stroke-width='2'/>" +
  "<circle id='richestFifth' cx='248' cy='104' r='6' fill='var(--good)' stroke='var(--bg)' stroke-width='2'/>" +
  "</svg>",
  parts:[
    { id:"equalityLine", label:"Line of perfect equality", hx:176, hy:148,
      role:"The 45-degree diagonal, on which each share of the population receives an equal share of income",
      accept:["line of perfect equality","perfect equality","equality line","45 degree line","diagonal"] },
    { id:"lorenzLine", label:"Lorenz curve", hx:200, hy:220,
      role:"The actual cumulative distribution of income; the further it sags below the diagonal, the greater the inequality",
      accept:["lorenz curve","lorenz","actual distribution"] },
    { id:"giniArea", label:"Area used for the Gini coefficient", hx:150, hy:230,
      role:"The area between the diagonal and the curve, divided by the whole triangle, gives the Gini coefficient",
      accept:["area used for the gini coefficient","gini","gini coefficient","area of inequality"] },
    { id:"poorestFifth", label:"Poorest quintile", hx:104, hy:262,
      role:"The bottom twenty per cent of the population and the small share of income they receive",
      accept:["poorest quintile","poorest fifth","bottom quintile","lowest quintile"] },
    { id:"richestFifth", label:"Richest quintile", hx:248, hy:104,
      role:"The top twenty per cent of the population and the large share of income they receive",
      accept:["richest quintile","richest fifth","top quintile","highest quintile"] }
  ]
};

ECON.DATA.diagrams.phillipsCurve = {
  id:"phillipsCurve", title:"Phillips curve", mod:"H3", topic:"Phillips curve",
  svg:
  "<svg viewBox='0 0 400 300'>" +
  "<line x1='60' y1='24' x2='60' y2='248' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='60' y1='248' x2='376' y2='248' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='24' y='36' fill='var(--ink-2)' font-size='10'>Inflation</text>" +
  "<text x='378' y='270' fill='var(--ink-2)' font-size='10' text-anchor='end'>Unemployment</text>" +
  "<path id='shortRunCurve' d='M78 44 Q 160 200 356 230' fill='none' stroke='var(--accent)' stroke-width='4'/>" +
  "<line id='longRunCurve' x1='228' y1='30' x2='228' y2='248' stroke='var(--warn)' stroke-width='3.5' stroke-dasharray='7 5'/>" +
  "<circle id='naturalRate' cx='228' cy='248' r='7' fill='var(--warn)' stroke='var(--bg)' stroke-width='2'/>" +
  "<circle id='tightLabourMarket' cx='120' cy='102' r='7' fill='var(--bad)' stroke='var(--bg)' stroke-width='2'/>" +
  "<circle id='slackLabourMarket' cx='312' cy='226' r='7' fill='var(--info)' stroke='var(--bg)' stroke-width='2'/>" +
  "</svg>",
  parts:[
    { id:"shortRunCurve", label:"Short-run Phillips curve", hx:180, hy:170,
      role:"The short-run inverse relationship between unemployment and inflation",
      accept:["short run phillips curve","phillips curve","short run curve","srpc"] },
    { id:"longRunCurve", label:"Long-run Phillips curve", hx:228, hy:70,
      role:"Vertical at the natural rate: in the long run there is no trade-off, only the inflation rate changes",
      accept:["long run phillips curve","long run curve","lrpc","vertical curve"] },
    { id:"naturalRate", label:"Natural rate of unemployment", hx:250, hy:238,
      role:"The rate that remains at full capacity, made up of frictional, structural and seasonal unemployment",
      accept:["natural rate of unemployment","natural rate","nairu","full employment rate"] },
    { id:"tightLabourMarket", label:"Tight labour market", hx:120, hy:102,
      role:"Unemployment below the natural rate, where competition for workers bids wages and prices up",
      accept:["tight labour market","tight labour","overheating","low unemployment high inflation"] },
    { id:"slackLabourMarket", label:"Slack labour market", hx:312, hy:226,
      role:"Unemployment above the natural rate, where spare capacity keeps inflation low",
      accept:["slack labour market","slack labour","spare capacity","high unemployment low inflation"] }
  ]
};

ECON.DATA.diagrams.fxMarket = {
  id:"fxMarket", title:"Market for the Australian dollar", mod:"H2", topic:"Exchange rates",
  svg:
  "<svg viewBox='0 0 420 320'>" +
  "<line x1='66' y1='26' x2='66' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='66' y1='268' x2='396' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='22' y='36' fill='var(--ink-2)' font-size='10'>US$ per A$</text>" +
  "<text x='398' y='288' fill='var(--ink-2)' font-size='10' text-anchor='end'>Quantity of A$</text>" +
  "<line id='demandAud' x1='84' y1='48' x2='372' y2='252' stroke='var(--info)' stroke-width='4'/>" +
  "<line id='supplyAud' x1='84' y1='252' x2='372' y2='48' stroke='var(--warn)' stroke-width='4'/>" +
  "<line id='demandShift' x1='128' y1='42' x2='396' y2='232' stroke='var(--good)' stroke-width='2.5' stroke-dasharray='6 4'/>" +
  "<circle id='exchangeRate' cx='228' cy='150' r='7' fill='var(--accent)' stroke='var(--bg)' stroke-width='2'/>" +
  "<circle id='appreciation' cx='258' cy='128' r='7' fill='var(--good)' stroke='var(--bg)' stroke-width='2'/>" +
  "</svg>",
  parts:[
    { id:"demandAud", label:"Demand for Australian dollars", hx:130, hy:82,
      role:"Comes from exports, foreign investment inflow and overseas borrowing by Australians",
      accept:["demand for australian dollars","demand","demand for aud","d"] },
    { id:"supplyAud", label:"Supply of Australian dollars", hx:130, hy:222,
      role:"Comes from imports, Australian investment abroad and interest paid on foreign debt",
      accept:["supply of australian dollars","supply","supply of aud","s"] },
    { id:"exchangeRate", label:"Equilibrium exchange rate", hx:210, hy:162,
      role:"The rate at which the quantity of dollars demanded equals the quantity supplied under a float",
      accept:["equilibrium exchange rate","exchange rate","equilibrium rate"] },
    { id:"demandShift", label:"Increase in demand", hx:320, hy:180,
      role:"A rightward shift, caused for example by higher commodity prices or a rise in Australian interest rates",
      accept:["increase in demand","demand shift","rise in demand","shift right"] },
    { id:"appreciation", label:"Appreciation", hx:276, hy:112,
      role:"The higher exchange rate that results: the dollar buys more foreign currency, so imports get cheaper and exports less competitive",
      accept:["appreciation","appreciate","stronger dollar"] }
  ]
};

ECON.DATA.diagrams.adAs = {
  id:"adAs", title:"Aggregate demand and aggregate supply", mod:"P6", topic:"Aggregate demand",
  svg:
  "<svg viewBox='0 0 420 320'>" +
  "<line x1='66' y1='26' x2='66' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='66' y1='268' x2='396' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='16' y='36' fill='var(--ink-2)' font-size='10'>Price level</text>" +
  "<text x='398' y='288' fill='var(--ink-2)' font-size='10' text-anchor='end'>Real output</text>" +
  "<line id='adCurve' x1='84' y1='54' x2='356' y2='248' stroke='var(--info)' stroke-width='4'/>" +
  "<line id='adShift' x1='132' y1='48' x2='396' y2='236' stroke='var(--good)' stroke-width='2.5' stroke-dasharray='6 4'/>" +
  "<path id='asCurve' d='M84 250 L 232 176 Q 300 140 312 30' fill='none' stroke='var(--warn)' stroke-width='4'/>" +
  "<line id='fullCapacity' x1='312' y1='26' x2='312' y2='268' stroke='var(--bad)' stroke-width='2.5' stroke-dasharray='5 5'/>" +
  "<circle id='macroEquilibrium' cx='196' cy='134' r='7' fill='var(--accent)' stroke='var(--bg)' stroke-width='2'/>" +
  "<line id='spareCapacity' x1='84' y1='250' x2='232' y2='176' stroke='var(--good)' stroke-width='8' opacity='0.25'/>" +
  "</svg>",
  parts:[
    { id:"adCurve", label:"Aggregate demand", hx:120, hy:82,
      role:"Total planned spending on domestic output at each price level: C + I + G + (X − M)",
      accept:["aggregate demand","ad","demand"] },
    { id:"asCurve", label:"Aggregate supply", hx:150, hy:216,
      role:"Total output firms are willing to produce at each price level; it steepens as capacity is approached",
      accept:["aggregate supply","as","supply"] },
    { id:"macroEquilibrium", label:"Macroeconomic equilibrium", hx:178, hy:150,
      role:"The price level and level of real output at which aggregate demand equals aggregate supply",
      accept:["macroeconomic equilibrium","equilibrium","macro equilibrium"] },
    { id:"spareCapacity", label:"Spare capacity", hx:158, hy:213,
      role:"The flat range in which output can rise with little effect on prices, because resources are unemployed",
      accept:["spare capacity","flat range","keynesian range","unemployment range"] },
    { id:"fullCapacity", label:"Full capacity", hx:312, hy:200,
      role:"The vertical limit set by the economy's productive capacity; beyond it extra demand raises only prices",
      accept:["full capacity","full employment","capacity constraint","potential output"] },
    { id:"adShift", label:"Increase in aggregate demand", hx:340, hy:200,
      role:"A rightward shift from higher C, I, G or net exports; its effect on prices depends on how much spare capacity exists",
      accept:["increase in aggregate demand","ad shift","rise in demand","shift right"] }
  ]
};

ECON.DATA.diagrams.tariff = {
  id:"tariff", title:"Effect of a tariff", mod:"H1", topic:"Protection",
  svg:
  "<svg viewBox='0 0 420 320'>" +
  "<line x1='66' y1='26' x2='66' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='66' y1='268' x2='396' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='40' y='34' fill='var(--ink-2)' font-size='13'>P</text>" +
  "<text x='398' y='288' fill='var(--ink-2)' font-size='13' text-anchor='end'>Q</text>" +
  "<line id='domesticDemand' x1='84' y1='48' x2='372' y2='252' stroke='var(--info)' stroke-width='4'/>" +
  "<line id='domesticSupply' x1='84' y1='252' x2='372' y2='48' stroke='var(--warn)' stroke-width='4'/>" +
  "<line id='worldPrice' x1='66' y1='214' x2='388' y2='214' stroke='var(--good)' stroke-width='3.5'/>" +
  "<line id='tariffPrice' x1='66' y1='176' x2='388' y2='176' stroke='var(--bad)' stroke-width='3.5'/>" +
  "<line id='domesticProduction' x1='138' y1='268' x2='192' y2='268' stroke='var(--warn)' stroke-width='8'/>" +
  "<line id='imports' x1='192' y1='268' x2='288' y2='268' stroke='var(--info)' stroke-width='8'/>" +
  "<rect id='tariffRevenue' x='192' y='176' width='96' height='38' fill='var(--bad)' opacity='0.3' stroke='var(--bad)' stroke-width='1.5'/>" +
  "</svg>",
  parts:[
    { id:"worldPrice", label:"World price", hx:352, hy:214,
      role:"The price at which the good is freely available from overseas, before any tariff is applied",
      accept:["world price","free trade price","international price"] },
    { id:"tariffPrice", label:"Price with the tariff", hx:352, hy:176,
      role:"The world price plus the tariff, which is what domestic consumers now pay",
      accept:["price with the tariff","tariff price","domestic price","price after tariff"] },
    { id:"domesticProduction", label:"Domestic production", hx:165, hy:268,
      role:"The quantity local producers supply; it rises when the tariff lifts the price they receive",
      accept:["domestic production","domestic supply","local production"] },
    { id:"imports", label:"Imports", hx:240, hy:268,
      role:"The gap between domestic demand and domestic supply, which the tariff narrows",
      accept:["imports","imported quantity"] },
    { id:"tariffRevenue", label:"Tariff revenue", hx:240, hy:195,
      role:"The tariff per unit multiplied by the quantity still imported, collected by government",
      accept:["tariff revenue","government revenue","revenue"] },
    { id:"domesticSupply", label:"Domestic supply", hx:120, hy:230,
      role:"What local producers will offer at each price",
      accept:["domestic supply","supply","s"] },
    { id:"domesticDemand", label:"Domestic demand", hx:120, hy:74,
      role:"What local consumers will buy at each price",
      accept:["domestic demand","demand","d"] }
  ]
};

ECON.DATA.diagrams.labourMarket = {
  id:"labourMarket", title:"The labour market and a minimum wage", mod:"P4", topic:"Labour market outcomes",
  svg:
  "<svg viewBox='0 0 420 320'>" +
  "<line x1='66' y1='26' x2='66' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='66' y1='268' x2='396' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='26' y='36' fill='var(--ink-2)' font-size='10'>Wage</text>" +
  "<text x='398' y='288' fill='var(--ink-2)' font-size='10' text-anchor='end'>Quantity of labour</text>" +
  "<line id='labourDemand' x1='84' y1='48' x2='372' y2='252' stroke='var(--info)' stroke-width='4'/>" +
  "<line id='labourSupply' x1='84' y1='252' x2='372' y2='48' stroke='var(--warn)' stroke-width='4'/>" +
  "<circle id='marketWage' cx='228' cy='150' r='7' fill='var(--accent)' stroke='var(--bg)' stroke-width='2'/>" +
  "<line id='minimumWage' x1='66' y1='102' x2='388' y2='102' stroke='var(--bad)' stroke-width='3.5'/>" +
  "<line id='unemploymentGap' x1='160' y1='102' x2='296' y2='102' stroke='var(--bad)' stroke-width='9' opacity='0.35'/>" +
  "<line id='quantityEmployed' x1='160' y1='102' x2='160' y2='268' stroke='var(--ink-3)' stroke-width='2' stroke-dasharray='5 4'/>" +
  "</svg>",
  parts:[
    { id:"labourDemand", label:"Demand for labour", hx:120, hy:78,
      role:"Derived from demand for the goods labour produces; firms hire more only at a lower wage",
      accept:["demand for labour","labour demand","demand","d"] },
    { id:"labourSupply", label:"Supply of labour", hx:120, hy:226,
      role:"The hours workers offer at each wage; more is offered as the wage rises",
      accept:["supply of labour","labour supply","supply","s"] },
    { id:"marketWage", label:"Market clearing wage", hx:252, hy:150,
      role:"The wage at which the quantity of labour demanded equals the quantity supplied",
      accept:["market clearing wage","equilibrium wage","market wage"] },
    { id:"minimumWage", label:"Minimum wage", hx:352, hy:102,
      role:"A legal wage floor set above the market clearing wage",
      accept:["minimum wage","wage floor","award wage"] },
    { id:"unemploymentGap", label:"Unemployment created", hx:228, hy:102,
      role:"The excess of labour supplied over labour demanded at the higher wage",
      accept:["unemployment created","unemployment","excess supply of labour","surplus of labour"] },
    { id:"quantityEmployed", label:"Quantity employed", hx:160, hy:230,
      role:"How many are actually hired at the minimum wage — fewer than at the market clearing wage",
      accept:["quantity employed","employment","number employed"] }
  ]
};
