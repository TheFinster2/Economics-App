/* Diagrams — microeconomic (P1, P3).
   Hand-authored inline SVG. Rules (brief §3.3):
     • viewBox only — no width/height. CSS sizes it.
     • every labellable part carries an id, and hx/hy give the hotspot centre
       so a thin line still gets a 44px touch target.
     • colours come from CSS custom properties so diagrams follow the theme.

   Economics diagrams are mostly lines, which makes the hotspot rule matter
   more here than it did for anatomy: a 2px stroke is untappable on a phone,
   so hx/hy is placed at a point on the line with clear space around it. */
window.ECON = window.ECON || {}; ECON.DATA = ECON.DATA || {};
ECON.DATA.diagrams = ECON.DATA.diagrams || {};

ECON.DATA.diagrams.supplyDemand = {
  id:"supplyDemand", title:"Market equilibrium", mod:"P3", topic:"Demand and supply",
  svg:
  "<svg viewBox='0 0 420 320'>" +
  "<line id='priceAxis' x1='66' y1='26' x2='66' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line id='quantityAxis' x1='66' y1='268' x2='396' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='42' y='34' fill='var(--ink-2)' font-size='13'>P</text>" +
  "<text x='398' y='286' fill='var(--ink-2)' font-size='13' text-anchor='end'>Q</text>" +
  "<line id='demandCurve' x1='84' y1='48' x2='372' y2='252' stroke='var(--info)' stroke-width='4'/>" +
  "<line id='supplyCurve' x1='84' y1='252' x2='372' y2='48' stroke='var(--warn)' stroke-width='4'/>" +
  "<text x='378' y='250' fill='var(--info)' font-size='13' text-anchor='end'>D</text>" +
  "<text x='378' y='58' fill='var(--warn)' font-size='13' text-anchor='end'>S</text>" +
  "<line id='equilibriumPrice' x1='66' y1='150' x2='228' y2='150' stroke='var(--ink-3)' stroke-width='2' stroke-dasharray='5 4'/>" +
  "<line id='equilibriumQuantity' x1='228' y1='150' x2='228' y2='268' stroke='var(--ink-3)' stroke-width='2' stroke-dasharray='5 4'/>" +
  "<circle id='equilibriumPoint' cx='228' cy='150' r='7' fill='var(--accent)' stroke='var(--bg)' stroke-width='2'/>" +
  "<line id='surplusRegion' x1='140' y1='86' x2='316' y2='86' stroke='var(--bad)' stroke-width='3' stroke-dasharray='3 5'/>" +
  "<line id='shortageRegion' x1='140' y1='216' x2='316' y2='216' stroke='var(--good)' stroke-width='3' stroke-dasharray='3 5'/>" +
  "</svg>",
  parts:[
    { id:"demandCurve", label:"Demand curve", hx:130, hy:82,
      role:"Shows the quantity buyers are willing and able to purchase at each price; slopes downward",
      accept:["demand curve","demand","d"] },
    { id:"supplyCurve", label:"Supply curve", hx:130, hy:222,
      role:"Shows the quantity producers are willing and able to offer at each price; slopes upward",
      accept:["supply curve","supply","s"] },
    { id:"equilibriumPoint", label:"Equilibrium", hx:228, hy:150,
      role:"The only point at which quantity demanded equals quantity supplied, so price has no tendency to change",
      accept:["equilibrium","market equilibrium","equilibrium point"] },
    { id:"equilibriumPrice", label:"Equilibrium price", hx:104, hy:150,
      role:"The market clearing price, read off the vertical axis at the intersection",
      accept:["equilibrium price","market price","clearing price","pe"] },
    { id:"equilibriumQuantity", label:"Equilibrium quantity", hx:228, hy:232,
      role:"The quantity traded at the market clearing price, read off the horizontal axis",
      accept:["equilibrium quantity","market quantity","qe"] },
    { id:"surplusRegion", label:"Surplus", hx:228, hy:86,
      role:"At a price above equilibrium, quantity supplied exceeds quantity demanded and unsold stock builds up",
      accept:["surplus","excess supply"] },
    { id:"shortageRegion", label:"Shortage", hx:228, hy:216,
      role:"At a price below equilibrium, quantity demanded exceeds quantity supplied and buyers bid the price up",
      accept:["shortage","excess demand"] },
    { id:"priceAxis", label:"Price axis", hx:66, hy:60,
      role:"The vertical axis, on which price per unit is measured",
      accept:["price axis","price","vertical axis","y axis"] },
    { id:"quantityAxis", label:"Quantity axis", hx:330, hy:268,
      role:"The horizontal axis, on which quantity per period is measured",
      accept:["quantity axis","quantity","horizontal axis","x axis"] }
  ]
};

ECON.DATA.diagrams.ppf = {
  id:"ppf", title:"Production possibility frontier", mod:"P1", topic:"Production possibility frontier",
  svg:
  "<svg viewBox='0 0 420 320'>" +
  "<line x1='66' y1='26' x2='66' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='66' y1='268' x2='396' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='30' y='36' fill='var(--ink-2)' font-size='12'>Capital</text>" +
  "<text x='398' y='288' fill='var(--ink-2)' font-size='12' text-anchor='end'>Consumer goods</text>" +
  "<path id='frontier' d='M76 44 Q 250 70 356 264' fill='none' stroke='var(--accent)' stroke-width='4'/>" +
  "<path id='grownFrontier' d='M76 26 Q 300 52 392 260' fill='none' stroke='var(--good)' stroke-width='2.5' stroke-dasharray='7 5'/>" +
  "<circle id='efficientPoint' cx='233' cy='118' r='7' fill='var(--accent)' stroke='var(--bg)' stroke-width='2'/>" +
  "<circle id='inefficientPoint' cx='150' cy='210' r='7' fill='var(--warn)' stroke='var(--bg)' stroke-width='2'/>" +
  "<circle id='unattainablePoint' cx='330' cy='70' r='7' fill='var(--bad)' stroke='var(--bg)' stroke-width='2'/>" +
  "</svg>",
  parts:[
    { id:"frontier", label:"Production possibility frontier", hx:180, hy:76,
      role:"Every combination of the two goods that can be produced with all resources fully and efficiently used",
      accept:["production possibility frontier","ppf","frontier","production possibility curve","ppc"] },
    { id:"efficientPoint", label:"Efficient point", hx:233, hy:118,
      role:"A point on the curve: all resources are employed and no more of one good can be made without making less of the other",
      accept:["efficient point","efficient","on the curve"] },
    { id:"inefficientPoint", label:"Inefficient point", hx:150, hy:210,
      role:"A point inside the curve, indicating unemployed or badly allocated resources",
      accept:["inefficient point","inefficient","unemployment","inside the curve"] },
    { id:"unattainablePoint", label:"Unattainable point", hx:330, hy:70,
      role:"A point beyond the curve, which cannot be reached with current resources and technology",
      accept:["unattainable point","unattainable","beyond the curve"] },
    { id:"grownFrontier", label:"Frontier after growth", hx:300, hy:80,
      role:"An outward shift caused by more or better resources, or improved technology — this is economic growth",
      accept:["frontier after growth","economic growth","growth","new frontier","outward shift"] }
  ]
};

ECON.DATA.diagrams.externality = {
  id:"externality", title:"Negative production externality", mod:"P3", topic:"Market failure",
  svg:
  "<svg viewBox='0 0 420 320'>" +
  "<line x1='66' y1='26' x2='66' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='66' y1='268' x2='396' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='40' y='34' fill='var(--ink-2)' font-size='13'>P</text>" +
  "<text x='398' y='288' fill='var(--ink-2)' font-size='13' text-anchor='end'>Q</text>" +
  "<line id='demandCurve' x1='84' y1='48' x2='372' y2='252' stroke='var(--info)' stroke-width='4'/>" +
  "<line id='privateCost' x1='84' y1='252' x2='340' y2='58' stroke='var(--warn)' stroke-width='4'/>" +
  "<line id='socialCost' x1='120' y1='252' x2='376' y2='58' stroke='var(--bad)' stroke-width='4'/>" +
  "<text x='344' y='56' fill='var(--warn)' font-size='12'>MPC</text>" +
  "<text x='380' y='56' fill='var(--bad)' font-size='12' text-anchor='end'>MSC</text>" +
  "<circle id='marketOutcome' cx='227' cy='149' r='7' fill='var(--warn)' stroke='var(--bg)' stroke-width='2'/>" +
  "<circle id='socialOptimum' cx='253' cy='131' r='7' fill='var(--good)' stroke='var(--bg)' stroke-width='2'/>" +
  "<line id='overproduction' x1='227' y1='268' x2='253' y2='268' stroke='var(--bad)' stroke-width='7'/>" +
  "</svg>",
  parts:[
    { id:"privateCost", label:"Marginal private cost", hx:150, hy:220,
      role:"The cost the producer actually pays, which excludes the cost imposed on third parties",
      accept:["marginal private cost","private cost","mpc","supply"] },
    { id:"socialCost", label:"Marginal social cost", hx:200, hy:200,
      role:"Private cost plus the external cost; it lies above private cost because pollution is a cost to society",
      accept:["marginal social cost","social cost","msc"] },
    { id:"demandCurve", label:"Demand", hx:130, hy:82,
      role:"Marginal social benefit, showing what buyers are willing to pay at each quantity",
      accept:["demand","demand curve","marginal social benefit","msb"] },
    { id:"marketOutcome", label:"Market outcome", hx:210, hy:162,
      role:"Where the market settles when producers ignore the external cost — quantity is too high and price too low",
      accept:["market outcome","market equilibrium","private optimum"] },
    { id:"socialOptimum", label:"Socially optimal outcome", hx:272, hy:118,
      role:"Where marginal social cost equals marginal social benefit; the quantity society would choose",
      accept:["socially optimal outcome","social optimum","socially optimal","optimum"] },
    { id:"overproduction", label:"Overproduction", hx:240, hy:268,
      role:"The excess quantity produced because the external cost is not reflected in the market price",
      accept:["overproduction","excess production","welfare loss","market failure"] }
  ]
};

ECON.DATA.diagrams.priceControls = {
  id:"priceControls", title:"Price ceiling and price floor", mod:"P3", topic:"Government intervention",
  svg:
  "<svg viewBox='0 0 420 320'>" +
  "<line x1='66' y1='26' x2='66' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<line x1='66' y1='268' x2='396' y2='268' stroke='var(--ink-2)' stroke-width='2.5'/>" +
  "<text x='40' y='34' fill='var(--ink-2)' font-size='13'>P</text>" +
  "<text x='398' y='288' fill='var(--ink-2)' font-size='13' text-anchor='end'>Q</text>" +
  "<line id='demandCurve' x1='84' y1='48' x2='372' y2='252' stroke='var(--info)' stroke-width='4'/>" +
  "<line id='supplyCurve' x1='84' y1='252' x2='372' y2='48' stroke='var(--warn)' stroke-width='4'/>" +
  "<circle id='equilibriumPoint' cx='228' cy='150' r='6' fill='var(--accent)' stroke='var(--bg)' stroke-width='2'/>" +
  "<line id='priceFloor' x1='66' y1='94' x2='388' y2='94' stroke='var(--bad)' stroke-width='3.5'/>" +
  "<line id='priceCeiling' x1='66' y1='206' x2='388' y2='206' stroke='var(--good)' stroke-width='3.5'/>" +
  "<line id='floorSurplus' x1='149' y1='94' x2='307' y2='94' stroke='var(--bad)' stroke-width='9' opacity='0.35'/>" +
  "<line id='ceilingShortage' x1='149' y1='206' x2='307' y2='206' stroke='var(--good)' stroke-width='9' opacity='0.35'/>" +
  "</svg>",
  parts:[
    { id:"priceFloor", label:"Price floor", hx:352, hy:94,
      role:"A legal minimum price set above equilibrium, such as a minimum wage; it creates a persistent surplus",
      accept:["price floor","minimum price","floor"] },
    { id:"priceCeiling", label:"Price ceiling", hx:352, hy:206,
      role:"A legal maximum price set below equilibrium, such as rent control; it creates a persistent shortage",
      accept:["price ceiling","maximum price","ceiling"] },
    { id:"floorSurplus", label:"Surplus from the floor", hx:228, hy:94,
      role:"The excess of quantity supplied over quantity demanded created by holding price above equilibrium",
      accept:["surplus from the floor","surplus","excess supply"] },
    { id:"ceilingShortage", label:"Shortage from the ceiling", hx:228, hy:206,
      role:"The excess of quantity demanded over quantity supplied created by holding price below equilibrium",
      accept:["shortage from the ceiling","shortage","excess demand"] },
    { id:"equilibriumPoint", label:"Free market equilibrium", hx:250, hy:150,
      role:"The price and quantity the market would reach with no intervention",
      accept:["free market equilibrium","equilibrium","market equilibrium"] },
    { id:"supplyCurve", label:"Supply", hx:120, hy:230,
      role:"Quantity producers will offer at each price",
      accept:["supply","supply curve","s"] },
    { id:"demandCurve", label:"Demand", hx:120, hy:74,
      role:"Quantity buyers will purchase at each price",
      accept:["demand","demand curve","d"] }
  ]
};
