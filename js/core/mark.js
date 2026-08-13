/* Equilibrium — js/core/mark.js
   Short-answer support. It does NOT mark prose and it never claims to.

   The only thing here that touches the student's writing is `hints()`, which
   reports which criteria *look* like they might be addressed. That output is
   labelled as a guess in the UI, is never pre-ticked, is never coloured red,
   and never reaches the score. (brief §4.1, §4.3)

   Exposes: window.ECON.Mark */
(function (root) {
  "use strict";

  var ECON = root.ECON = root.ECON || {};
  var U = ECON.U || (typeof require !== "undefined" ? require("./util.js") : null);
  var M = {};

  M.DISCLAIMER = "These look like they might be covered — you decide. This is a keyword guess, not a mark.";

  /* Stop words are ignored when deriving keywords from a criterion. */
  var STOP = ("a an the and or of to in for with that this these those is are was were be been being " +
    "it its as at by on from into their they them he she his her which who whom what when how why " +
    "identifies describes explains states outlines relates justifies assesses discusses names gives " +
    "one two three both each any some more most less least than then so such may can will would " +
    "point points mark marks answer response student must should").split(" ");
  var STOPSET = Object.create(null);
  STOP.forEach(function (w) { STOPSET[w] = 1; });

  /* Domain synonym groups. A criterion keyword matches if the student used any
     word in the same group. Deliberately small and hand-checked — a sprawling
     synonym list produces confident nonsense. */
  M.SYNONYMS = [
    ["demand", "quantity demanded", "demanded"],
    ["supply", "quantity supplied", "supplied"],
    ["equilibrium", "market clearing", "clears", "cleared"],
    ["shortage", "excess demand"],
    ["surplus", "excess supply"],
    ["elasticity", "elastic", "inelastic", "responsiveness", "elasticities"],
    ["substitute", "substitutes", "substitution"],
    ["complement", "complements", "complementary"],
    ["opportunity cost", "next best alternative", "forgone", "foregone"],
    ["scarcity", "scarce", "limited resources"],
    ["production possibility frontier", "ppf", "ppc", "production possibility curve"],
    ["factors of production", "resources", "inputs", "land labour capital enterprise"],
    ["externality", "externalities", "spillover", "third party", "social cost", "social benefit"],
    ["market failure", "misallocation", "allocative inefficiency"],
    ["public good", "public goods", "non-excludable", "non-rival", "free rider"],
    ["monopoly", "monopolist", "single seller"],
    ["oligopoly", "few firms", "interdependent"],
    ["perfect competition", "price taker", "price takers"],
    ["economies of scale", "average cost falls", "scale economies"],
    ["fixed cost", "fixed costs", "overheads"],
    ["variable cost", "variable costs"],
    ["total revenue", "revenue", "sales revenue", "turnover"],
    ["productivity", "output per hour", "output per worker", "efficiency"],
    ["circular flow", "flow of income"],
    ["leakage", "leakages", "withdrawal", "withdrawals"],
    ["injection", "injections"],
    ["aggregate demand", "ad", "total spending", "total expenditure"],
    ["aggregate supply", "as", "productive capacity", "capacity"],
    ["multiplier", "multiplied", "multiplier effect"],
    ["marginal propensity to consume", "mpc"],
    ["marginal propensity to save", "mps"],
    ["consumption", "consumer spending", "household spending"],
    ["investment", "capital expenditure", "business investment"],
    ["economic growth", "growth", "real gdp growth"],
    ["gross domestic product", "gdp", "national output", "national income"],
    ["real", "constant prices", "inflation adjusted", "adjusted for inflation"],
    ["nominal", "current prices", "money terms"],
    ["business cycle", "cycle", "expansion", "contraction", "peak", "trough"],
    ["recession", "downturn", "two consecutive quarters"],
    ["inflation", "inflationary", "rising prices", "price level"],
    ["consumer price index", "cpi"],
    ["underlying inflation", "trimmed mean", "core inflation"],
    ["demand-pull", "demand pull", "excess demand inflation"],
    ["cost-push", "cost push", "rising costs"],
    ["deflation", "falling prices"],
    ["unemployment", "unemployed", "jobless"],
    ["labour force", "workforce", "employed plus unemployed"],
    ["participation rate", "participation"],
    ["cyclical unemployment", "demand deficient"],
    ["structural unemployment", "skills mismatch", "mismatch"],
    ["frictional unemployment", "between jobs", "job search"],
    ["hidden unemployment", "discouraged workers", "discouraged"],
    ["underemployment", "underemployed", "want more hours"],
    ["natural rate", "nairu", "full employment"],
    ["phillips curve", "trade-off between inflation and unemployment"],
    ["real wage", "purchasing power of wages"],
    ["nominal wage", "money wage"],
    ["derived demand", "demand for labour depends on"],
    ["award", "awards", "enterprise agreement", "industrial relations"],
    ["minimum wage", "wage floor"],
    ["inequality", "unequal", "distribution of income", "income distribution"],
    ["gini coefficient", "gini"],
    ["lorenz curve", "lorenz"],
    ["poverty", "poverty line", "relative poverty"],
    ["progressive", "progressivity"],
    ["regressive"],
    ["proportional", "flat rate"],
    ["taxation", "tax", "taxes", "revenue measures"],
    ["transfer payment", "transfer payments", "welfare", "benefits"],
    ["budget deficit", "deficit"],
    ["budget surplus", "surplus budget"],
    ["public debt", "government debt", "net debt"],
    ["automatic stabiliser", "automatic stabilisers", "automatic stabilizers", "cyclical component"],
    ["structural component", "discretionary", "policy decisions"],
    ["fiscal policy", "budget", "budgetary policy"],
    ["monetary policy", "cash rate", "interest rate policy"],
    ["reserve bank", "rba", "central bank"],
    ["domestic market operations", "open market operations", "dmo"],
    ["transmission mechanism", "transmission", "channels"],
    ["expansionary", "stimulus", "stimulatory", "loosening"],
    ["contractionary", "tightening", "restrictive"],
    ["crowding out", "crowds out"],
    ["microeconomic reform", "supply side", "structural reform", "deregulation"],
    ["time lag", "lags", "lag"],
    ["globalisation", "globalization", "global integration"],
    ["trade liberalisation", "trade liberalization", "free trade", "removing barriers"],
    ["protection", "protectionism", "protectionist"],
    ["tariff", "tariffs", "import duty"],
    ["quota", "quotas", "import quota"],
    ["subsidy", "subsidies", "subsidised"],
    ["comparative advantage", "lower opportunity cost"],
    ["absolute advantage"],
    ["foreign direct investment", "fdi", "direct investment"],
    ["transnational corporation", "tnc", "multinational", "mnc"],
    ["balance of payments", "bop"],
    ["current account", "current account deficit", "cad"],
    ["capital and financial account", "financial account", "capital account"],
    ["net primary income", "primary income", "servicing costs", "interest and dividends"],
    ["foreign debt", "net foreign debt", "foreign liabilities"],
    ["terms of trade", "tot", "export prices relative to import prices"],
    ["exchange rate", "dollar", "currency"],
    ["depreciation", "depreciate", "weaker dollar", "falls in value"],
    ["appreciation", "appreciate", "stronger dollar", "rises in value"],
    ["devaluation", "revaluation", "fixed exchange rate"],
    ["j-curve", "j curve"],
    ["valuation effect"],
    ["free trade agreement", "fta", "bilateral agreement"],
    ["trade creation", "trade diversion"],
    ["human development index", "hdi"],
    ["sustainability", "sustainable", "ecologically sustainable development", "esd"],
    ["tradeable permits", "emissions trading", "carbon price", "permit scheme"],
    ["market based", "price signal", "incentive"],
    ["regulation", "regulatory", "direct controls"],
    ["standard of living", "living standards", "wellbeing", "quality of life"]
  ];


  var SYN_INDEX = null;
  function synIndex() {
    if (SYN_INDEX) return SYN_INDEX;
    SYN_INDEX = Object.create(null);
    M.SYNONYMS.forEach(function (group, gi) {
      group.forEach(function (term) { SYN_INDEX[U.norm(term)] = gi; });
    });
    return SYN_INDEX;
  }

  /* Keywords a criterion is "about": its content words, plus any explicit
     `keys` the author supplied on the question. */
  M.criterionKeys = function (criterionText, extra) {
    var ws = U.words(criterionText).filter(function (w) {
      return w.length > 3 && !STOPSET[w];
    });
    var terms = U.uniq(ws.concat(extra || []));
    return terms;
  };

  function matches(term, answerNorm, answerWords) {
    var idx = synIndex();
    var t = U.norm(term);
    if (!t) return false;
    if (t.indexOf(" ") >= 0) return answerNorm.indexOf(t) >= 0;

    if (answerWords[t]) return true;
    // simple stem tolerance: plural / -ed / -ing / -s
    var stems = [t, t + "s", t + "es", t + "ed", t + "ing", t.replace(/e$/, "ing"), t.replace(/y$/, "ies")];
    for (var i = 0; i < stems.length; i++) if (answerWords[stems[i]]) return true;
    if (t.length > 5) {
      var pre = t.slice(0, Math.max(5, t.length - 3));
      for (var w in answerWords) if (w.indexOf(pre) === 0) return true;
    }
    // synonym group
    var g = idx[t];
    if (g === undefined) return false;
    var group = M.SYNONYMS[g];
    for (var k = 0; k < group.length; k++) {
      var s = U.norm(group[k]);
      if (!s || s === t) continue;
      if (s.indexOf(" ") >= 0) { if (answerNorm.indexOf(s) >= 0) return true; }
      else if (answerWords[s]) return true;
    }
    return false;
  }

  /* hints(question, text) → [{index, looksCovered, hit:[terms]}]
     A guess. Never a mark. */
  M.hints = function (q, text) {
    var answerNorm = U.norm(text);
    var wordsMap = Object.create(null);
    U.words(text).forEach(function (w) { wordsMap[w] = 1; });

    return (q.criteria || []).map(function (crit, i) {
      var extra = (q.keys && q.keys[i]) || [];
      var terms = M.criterionKeys(crit, extra);
      var hit = terms.filter(function (t) { return matches(t, answerNorm, wordsMap); });
      // require a real share of the criterion's content words, or an explicit key
      var explicitHit = extra.some(function (t) { return matches(t, answerNorm, wordsMap); });
      var share = terms.length ? hit.length / terms.length : 0;
      return {
        index: i,
        looksCovered: explicitHit || (terms.length >= 2 && share >= 0.5) || (terms.length === 1 && hit.length === 1),
        hit: hit
      };
    });
  };

  /* Word count / effort gate used by §4.4. Not a quality judgement — just
     "did anything get written". */
  M.effort = function (text) {
    var t = String(text || "").trim();
    return { chars: t.length, words: t ? t.split(/\s+/).length : 0 };
  };

  M.longEnough = function (text) {
    return M.effort(text).chars >= (ECON.State ? ECON.State.SHORT_MIN_CHARS : 20);
  };

  ECON.Mark = M;
  if (typeof module !== "undefined" && module.exports) module.exports = M;
})(typeof window !== "undefined" ? window : globalThis);
