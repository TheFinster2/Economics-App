# Equilibrium — NSW HSC Economics

An offline-first study app for the NSW HSC Economics course. Zero dependencies,
no build step, no accounts, and no network traffic at runtime. Open
`index.html` from a `file://` URL and it works; install it to a phone home
screen and it works with the aeroplane mode switch on.

It is a sibling of the Biology app in this account and shares its engine —
the router, the reward path, the Leitner scheduler, the diagram/hotspot
engine, the tool tray and the whole test harness are the same code. What is
new here is everything that touches economics: the calculation engine, the
market-shift mode, and all of the content.

## Running it

```
open index.html            # or double-click it
```

No server, no npm install, no build. Scripts load in dependency order from
`index.html` and everything hangs off one global, `window.ECON`.

## The two rules that shape the whole app

**Every reward flows through one function.** `UI.award()` in
`js/core/ui.js` is the only place XP and credits are created. Modes report
what happened; the reward path decides what it is worth. That is what makes
it possible to state, and to test, that a bot answering at random earns
nothing — see `tests/exploit.js`.

**Nothing is graded that cannot be graded.** Written responses are never
marked by the app. `js/core/mark.js` deliberately contains no grading
function. It offers keyword *hints*, labels them as guesses, never pre-ticks
a criterion, never colours anything red, and never scores anything. A keyword
matcher cannot tell a good economics answer from a bad one containing the
right nouns, and pretending otherwise teaches students to write for the
matcher.

## Modes

| Mode | What it does |
|---|---|
| Rapid Fire | Timed multiple choice across the whole bank |
| Topic Drill | One syllabus topic at a time, adaptive |
| Calculation Lab | Elasticity, multipliers, rates and balances — unlimited, all verified |
| Shift It | A shock hits a market: which curve, which way, what happens to price |
| Term Match | Glossary term against definition, against the clock |
| Label It | Label the twelve diagrams the course rests on |
| Data Detective | Read a table or chart and answer from the data |
| Sort It | Classify items into bins under time pressure |
| Process Order | Put the steps of an economic process in sequence |
| Survival | One life, escalating difficulty |
| Mistake Rehab | Only the questions you have got wrong |
| Response Builder | Extended response with self-marking criteria |
| Topic Boss | A gated multi-stage test per syllabus topic |
| Flashcards | Leitner spaced repetition, five boxes |
| Arcade | Three games you rent with credits. They pay nothing — deliberately |

## The calculation engine

`js/core/econcalc.js` is where the app can be *certain* it is right, and it
earns that certainty the hard way: **every value is computed twice, by two
routes that share no intermediate result, and a question whose routes
disagree is discarded rather than shown.**

For example, price elasticity of demand is computed once as percentage
changes divided one by the other, and once as the rearranged slope form
`(ΔQ/ΔP) × ((P₁+P₂)/(Q₁+Q₂))`. The multiplier is computed once as
`1/(1−MPC)` and once by summing the geometric series term by term until the
terms vanish. Those are the same number for the right reasons and different
numbers the moment either is wrong.

`C.build()` also refuses any question where a distractor rounds onto the
correct answer, because two identical options on screen is a question with
two right answers.

Market shift outcomes work the same way. An author of a `shift_` scenario
supplies only the shock, which curve moves and which direction. The effect on
equilibrium price and quantity is **derived** from the four-case table in
`C.shiftOutcome`, and `tests/calc.js` fails if a scenario tries to hard-code
one — an authored outcome is an outcome that can silently go stale.

## Tests

Eleven suites, run individually with `node tests/<name>.js`. Nine need only
Node; `smoke`, `browser`, `tools`, `honest`, `exploit` and `offline` drive a
real Chromium through Playwright.

| Suite | What it proves |
|---|---|
| `validate` | Content integrity: every distractor has a reason, every diagram part exists in its SVG, no near-duplicate questions, no answer-length bias |
| `calc` | Both routes agree over 400 seeds per kind; no distractor collides with the answer; the shift table matches the geometry |
| `coverage` | A coverage pack hides exactly what it claims and never changes payouts or achievement targets |
| `diagram` | Every diagram renders at 360px with 44px hit areas and no overflow |
| `tools` | The tray docks, the keypad never focuses the display, the reference latches and is priced |
| `smoke` | Every screen renders and offers something interactive at 360px and 390px |
| `honest` | A student who knows the economics earns real XP, at broadly consistent rates across modes |
| `exploit` | **A bot answering as fast and as badly as possible earns 0 XP** |
| `offline` | Install, cut the network, and every screen still works |
| `update` | A new build reaches an already-installed device |
| `prove` | Runs every suite once clean and once per injected fault, and fails if any fault goes uncaught |

`prove.js` is the one worth understanding. A test that passes proves very
little; a test that *fails when its fix is removed* proves it is actually
testing something. Twenty fault modes are injected and all twenty must be
caught.

```
node tests/prove.js
```

## Content volume

Shipped so far, against the targets the brief sets. The gaps are authoring,
not engineering — every format is established and validated.

| | shipped | target |
|---|---|---|
| Multiple choice | 71 | 1000 |
| Short answer with criteria | 6 | 150 |
| Flashcards | 113 | 400 |
| Diagrams | 12 | 12 ✓ |
| Calculation templates | 14 | 12 ✓ |
| Market shift scenarios | 17 | — |
| Process sequences | 6 | — |
| Sort sets | 7 | — |
| Datasets | 5 | — |
| Glossary terms | 142 | — |

Calculation templates are worth reading twice: fourteen templates is not
fourteen questions. Each one generates an unbounded family, so Calculation
Lab never repeats itself.

## Syllabus coverage

Ten topics, matching the NSW syllabus structure.

**Year 11 (Preliminary)** — P1 Introduction to Economics · P2 Consumers and
Business · P3 Markets · P4 Labour Markets · P5 Financial Markets ·
P6 Government and the Economy

**Year 12 (HSC)** — H1 The Global Economy · H2 Australia's Place in the
Global Economy · H3 Economic Issues · H4 Economic Policies and Management

## Adding content

Content is **discovered by key pattern**, never listed by hand. Declaring
`ECON.DATA.mcq_anything = [...]` in a new file under `js/data/` and adding
two lines — a `<script>` tag in `index.html` and an entry in the `PRECACHE`
list in `sw.js` — is the whole process.

| Pattern | Kind |
|---|---|
| `mcq_` | Multiple choice |
| `cards_` | Flashcards |
| `short_` | Short answer |
| `seq_` | Process Order |
| `sort_` | Sort It |
| `data_` | Data Detective |
| `calc_` | Calculation templates |
| `shift_` | Shift It scenarios |

`validate.js` fails the build if a data file exists that is not in
`PRECACHE`, because a file the service worker does not cache is a file that
vanishes offline.

**Bump `BUILD`.** It appears in `sw.js` and in `js/core/state.js` and the two
must match — `tests/update.js` fails if they drift. If you change a cached
file and do not bump it, installed devices keep serving the old copy forever
and you will spend a week convinced the bug is in the code.

## Dev panel

For testing with a maxed-out account: `#/dev` in the URL, or
**Ctrl/Cmd + Shift + D** from any screen. Presets for a maxed account, a rich
but unskilled one, a mid-year student, everything-due, and a large rehab
pool, plus individual levers for XP, credits, tickets, streak, achievements
and topic bosses.

Everything in there writes to `State` directly and **never** through
`UI.award()`. That is deliberate: if a debug button went through the reward
path, "the bad bot earns 0 XP" would stop being a property of the app and
start being a property of which buttons the test happened to press. A save
touched by the dev panel is flagged on the You screen.
