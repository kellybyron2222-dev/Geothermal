# Persona synthesis — Full build (county screen + point evidence check)

**Date:** 2026-08-13  
**Artifact:** `docs/reviews/2026-08-13-full-build/04-persona-synthesis.md`  
**Product reviewed:** Texas next-gen county ScreeningScore (0.60 thermal + 0.40 transmission) + Point evidence check  
**Thesis evaluated:** Not GIS — answer *where to focus* and *why*

---

## 1. Method

**n ≈ 100** simulated independent reviews after a 15–20 minute desk walkthrough (county choropleth → search/select → detail panel → map click point check → methodology skim).

| Persona | Weight | n | Primary JTBD tested |
|---------|--------|---|---------------------|
| Geothermal developer | 25% | 25 | Shortlist counties / AOIs worth a geology afternoon |
| Energy project developer | 20% | 20 | Brief leadership; thermal + wires screening for ERCOT |
| Infrastructure / land-adjacent investor | 15% | 15 | Diligence triage; avoid false-hot empty counties |
| Land investor | 10% | 10 | Where to start outreach (county → parcel later) |
| Domain skeptic / geothermal scientist | 15% | 15 | Metric honesty, physics frame, false ranking risk |
| Researcher / student | 10% | 10 | Teaching / reproducibility / methodology clarity |
| Policymaker | 5% | 5 | Texas diversification narrative / actionable ask |

**Scoring product facts reviewers were told (and saw):**

- ScreeningScore = `0.60 * S_thermal + 0.40 * S_infra`
- Gradient preferred; **~25 / 254** counties with gradient control; **~222** heat-flow fallback
- **Separate cohort scaling**, then **one choropleth / one leaderboard framing**
- UI: map + search + detail panel with metric banner; **no ranked county list**
- Confidence exists but is **separate and under-shown**
- Point check: control quality first; ~40 km thermal means; transmission as ~km to coarse grid; county context demoted; honesty copy after harden

**Weighting rule:** Buyer clusters (geo + energy + infra + land ≈ 70%) dominate “must-have” and “dismiss” calls. Researchers/policymakers inform clarity and narrative, not roadmap priority.

**Overall reaction mix (≈100):**

| Reaction | ~n | Who drives it |
|----------|----|---------------|
| Useful — would keep open / try in a real shortlist pass | 30 | Energy developers, some geo + land, researchers |
| Lukewarm — credible but thin / not yet decision-changing | 31 | Geo developers, infra investors, energy developers |
| Confused — unclear decision or comparable ranking | 16 | Policymakers, land investors, junior researchers, some energy |
| Distrust — overclaim, metric contamination, or wrong precision | 15 | Domain skeptics, senior geo developers |
| Dismiss / close tab | 8 | Hard skeptics + sophisticated geo developers |

**Net:** Honesty and Texas focus buy a second look. Trust still breaks on **cohort-mixed ranking + missing list + quiet confidence**. Point check helps more than the county map alone.

---

## 2. Clustered feedback

### A. Praise (~what worked)

| Cluster | ≈% of reviewers | Persona drivers | Concrete notes |
|---------|-----------------|-----------------|----------------|
| **Honest limits / hardened copy** | ~45% | All buyers + skeptics | “Not resource assessment / not interconnection / not pad pick” reduces vendor-theater reflex. Point-check honesty after harden lands especially well. |
| **Texas / ERCOT beachhead** | ~40% | Energy, geo, infra | Focused geography feels like a product, not a continental wallpaper map. |
| **Explainable 60/40 formula** | ~35% | Infra, energy, researchers | Auditable beats “AI geothermal.” Buyers can argue with weights; they can’t argue with a black box. |
| **Gradient preferred (in principle)** | ~32% | Geo developers, skeptics (conditional) | °C/km matches next-gen intuition. Praise is for *intent*, not for current coverage. |
| **Point check: control quality first** | ~30% | Geo, skeptics, researchers | Local n / neighborhood framing feels more like evidence than county paint. County demotion in the point panel is correctly prioritized for siting instincts. |
| **Transmission as second axis** | ~28% | Energy, infra | “Thermal without wires is tourism” resonates even when distance is only a proxy. |
| **Metric banner on county detail** | ~22% | Geo, energy | Seeing gradient vs heat-flow fallback labeled in the panel is a trust win vs unlabeled choropleth alone. |
| **Fast / static / shareable** | ~18% | Energy, infra, researchers | Good for a diligence Slack link; no login tax. |
| **Thesis alignment (“not GIS”)** | ~15% | Product-sympathetic buyers | When the UI feels like a decision path, thesis is believed. When ranking is opaque, thesis is mocked. |

**Buyer-realistic praise quote (geo):**  
“I’ll use this to decide which five counties deserve a real afternoon — if I can trust the thermal axis.”

---

### B. Confusion (~what didn’t parse)

| Cluster | ≈% of reviewers | Persona drivers | Concrete notes |
|---------|-----------------|-----------------|----------------|
| **Where is the ranked list?** | ~38% | Energy, infra, land, policy | D2-shaped expectation: “focus where” implies an ordered shortlist. Map + search + panel feels like GIS with a score. Buyers ask: *What do I do on Monday?* |
| **One leaderboard from two thermal cohorts** | ~34% | Geo, skeptics, infra | ~25 gradient vs ~222 heat-flow, separately scaled then merged: “Are #12 and #40 even the same kind of number?” Metric banner helps *after* click; choropleth still reads as one currency. |
| **Score vs confidence relationship** | ~28% | Infra, energy, land | Confidence under-shown → hot colors read as high conviction. Investors overweight empty/sparse counties. |
| **What decision changes after point click?** | ~22% | Land, policy, some energy | Point check shows evidence quality but doesn’t say pass/fail or “promote/demote county.” Feels educational, not decisive. |
| **~40 km mean meaning** | ~18% | Non-geo buyers, students | “Is this the site or the neighborhood?” Copy helps; first impression still over-localizes. |
| **Search + panel as substitute for ranking** | ~15% | Infra, energy | Power users can search known counties; discovery users don’t know what to type. |

**Buyer-realistic confusion quote (energy):**  
“I get the thesis. I still don’t know the top ten counties to put on a slide without hunting the map.”

---

### C. Distrust (~what eroded credibility)

| Cluster | ≈% of reviewers | Persona drivers | Concrete notes |
|---------|-----------------|-----------------|----------------|
| **Cohort mixing = false comparability** | ~36% | Skeptics, senior geo, infra | Biggest credibility wound. Separate scaling into one paint job is seen as methodological sleight-of-hand unless visually screamed. |
| **Transmission km ≠ interconnection** | ~33% | Energy, infra, geo | Proxy language accepted in abstract; any UI that looks like “grid readiness” triggers distrust. Harden copy helps but doesn’t eliminate the reflex. |
| **Sparse IHFC / 40 km smear as “site”** | ~30% | Geo, skeptics | Means over large radius = basin gossip. Control-quality-first mitigates; calling it precise site intelligence would destroy trust. |
| **Confidence buried while score is loud** | ~27% | Infra, skeptics, energy | Score-first design reads as false precision. “Intelligence platform” brand amplifies this. |
| **No calibration to known interest areas** | ~24% | Geo, energy | Top/bottom counties without a narrative (“sparse data vs real signal”) look arbitrary. |
| **County unit sold as focus answer** | ~20% | Geo, land | Acceptable for screening *if* framed as desk shortlist; oversold as development focus → distrust. |
| **Brand/job mismatch** | ~16% | Skeptics, senior geo | Two-factor static index marketed as platform intelligence. Honesty copy reduces but doesn’t erase the gap. |

**Buyer-realistic distrust quote (scientist):**  
“Gradient preferred is fine. Putting 25 gradient counties and 222 heat-flow counties on one choropleth after separate scaling is how you mint false rankings.”

---

### D. Missing must-haves (~would block continued use)

| Must-have | ≈% calling it blocking | Persona drivers | Why it blocks |
|-----------|------------------------|-----------------|---------------|
| **First-class gradient vs fallback differentiation on the map** (not only panel banner) | ~42% | Geo, skeptics, infra | Panel-only label is too late; eye trusts the choropleth. |
| **Confidence as a visual co-equal (or filter)** | ~40% | Infra, energy, skeptics | Without it, score is unsafe for diligence. |
| **Explicit ordered shortlist** (top N + drivers) | ~38% | Energy, infra, land | Map-only discovery fails the “where do I focus Monday” test. |
| **Cohort honesty in ranking** (split views, badges, or dual scales — not silent merge) | ~35% | Geo, skeptics | Comparability is the thermal product’s integrity. |
| **Clear JTBD one-liner in-product** (“desk shortlist / evidence check — not pad pick”) | ~30% | All buyers | Reduces misuse by juniors and overclaim by sales. |
| **Point check: n, nearest control km, metric type, always above the fold** | ~28% | Geo, skeptics | Quality-first is right; must be impossible to miss. |
| **Grid proxy cues beyond distance** (voltage class later, or louder “coarse grid only”) | ~22% | Energy, infra | Distance-only still invites interconnection cosplay. |
| **Export shortlist / dossier snapshot** | ~18% | Energy, infra, land | Without handoff, tool dies after the demo. |
| **Depth / temp-at-target / cost framing** | ~25% want it; **blocking for ~12%** hard geo | Geo developers | Many accept “not yet” if JTBD is narrow; hardcore dismiss without a subsurface story. |
| **Land / mineral / surface-use** | ~15% | Land, some policy | Blocking for land-first buyers; deferrable for geo/energy wedge. |

**Nice-to-haves (mentioned, not blocking for primary buyers):** dual always-on gradient+heat-flow display, known project pins, offtake/load proxy, CSV/PDF export polish, neighbor-state peek, policy/jobs narrative.

---

## 3. Top dismiss triggers

Ordered by how fast sophisticated **geothermal developers** and **hard skeptics** close the tab (~8 dismissers; many lukewarm share the same triggers at lower intensity):

1. **Metric contamination** — heat-flow fallback counties competing with gradient counties on one score paint without unmistakable map-level differentiation.  
2. **False precision** — loud ScreeningScore + quiet confidence; relative Texas index read as opportunity certainty.  
3. **Missing ranked shortlist** — “where to focus” thesis with GIS-shaped UX (map/search/panel only) feels like a poster, not a desk tool.  
4. **Interconnection cosplay** — any residual sense that km-to-line ≈ deliverability / queue / POI quality.  
5. **40 km means presented as site truth** — even with honesty copy, if the visual hierarchy implies pad-level answer.  
6. **Uncalibrated top counties** — no story when ranks contradict known next-gen interest / data sparsity.  
7. **Brand oversell** — “Intelligence Platform” for a thin two-factor static index.  
8. **Workflow dead-end** — click → panel → nowhere to export, compare, or hand to a geologist.

**Dismiss threshold (condensed):**  
*If thermal isn’t obviously comparable, confidence isn’t first-class, and “where” isn’t a shortlist, serious operators treat it as a student map and leave.*

---

## 4. What would convert skeptics

Not “more layers.” Narrow, integrity-first moves:

| Conversion lever | Why skeptics soften | Who it unlocks |
|------------------|---------------------|----------------|
| **Split or badge the thermal cohorts on the map** (gradient cohort vs fallback cohort; or dual choropleths) | Removes the false-currency objection | Scientists, senior geo, infra |
| **Confidence filter / hatch / co-legend** default-on | Stops overweighting sparse “hot” counties | Infra, energy, skeptics |
| **Top-15 / Bottom-15 ranked list with factor breakdown + metric type + confidence** | Makes thesis operational; map becomes evidence, not the product | Energy, infra, geo |
| **Calibration note** on leaderboard (why a surprising county ranks; sparsity vs signal) | Shows judgment, not just math | Geo, energy |
| **Point check pass criteria** (e.g. “evidence weak — do not promote”) | Turns click into a decision, not a fact dump | Geo, energy |
| **Keep (and tighten) honesty copy** at score and grid | Already helping; don’t dilute with platform language | All skeptics |
| **Methodology version + freeze story** in UI (60/40 why; what would reshuffle) | Auditors need change control | Infra, researchers |
| **Explicit non-goals chip** on every score surface | Aligns brand with artifact | Scientists, senior geo |

**What will *not* convert them this phase:** more GIS layers, ML ranking, multi-state expansion, policy dashboards, land ownership depth, or interconnection queue theater.

**Skeptic conversion quote (conditional):**  
“Show me gradient counties as their own race, confidence on the paint, and a top-fifteen with drivers — then I’ll argue about weights instead of throwing out the tool.”

---

## 5. Implications for judgment (feed into red/blue again)

| Finding cluster | Severity | Suggested judgment lean | Rationale |
|-----------------|----------|-------------------------|-----------|
| Cohort merge → one choropleth without map-level differentiation | **Critical** | **Fix now** | Primary distrust driver; undermines thermal integrity for geo + skeptics + infra |
| Confidence under-shown vs score-loud UI | **High** | **Fix now** | Diligence buyers will misuse or discard; cheap trust win |
| No ranked shortlist (map+search+panel only) | **High** | **Fix now** | Directly contradicts live thesis / D2 “where to focus”; top buyer confusion |
| Point check quality-first + honesty harden | **Positive** | **Keep** | Strong praise; continue demoting county wallpaper in point mode |
| Metric banner on county panel | **Positive / incomplete** | **Enhance soon** | Good after click; insufficient alone — push signal to map/list |
| Grid distance proxy + honesty copy | **Medium** | **Keep now; enhance soon** | Copy OK; add voltage class or stronger “coarse grid only” cue later |
| Export / compare / handoff | **Medium** | **Enhance soon** | Unlocks energy/infra workflow; not physics integrity |
| Depth / cost / EGS vs closed-loop framing | **High for hard geo; medium overall** | **Defer** (with louder JTBD) | Don’t fake subsurface; narrow the claimed job instead |
| Land / mineral / permitting | **Medium for land; low for wedge** | **Defer** | Land investors are secondary; don’t sprawl GIS |
| Offtake / load / policy narrative | **Low–medium** | **Defer / reject for phase** | Not the beachhead JTBD |
| Multi-state / layer explorer / ML | — | **Reject for this phase** | Violates Texas focus + explainable heuristics + solo-dev constraint |

### Red/blue re-entry prompts

**Blue team should defend:** honesty harden, Texas lock, 60/40 explainability, point-check quality-first, metric banner, static speed.  
**Red team should attack:** silent cohort comparability, score-without-confidence hierarchy, missing shortlist vs thesis, residual interconnection reading, brand/job gap.  
**Judgment should prioritize:** *comparability + confidence + shortlist* before any new data theme. Defer subsurface/land/offtake until the ranking is trusted enough that buyers argue about weights, not whether the number is real.

### Stop-condition hint for this slice

Phase slice is **not** done while: (1) fallback and gradient share one undifferentiated paint, (2) confidence is easy to miss, and (3) “where to focus” has no ordered answer. Point-check polish alone does not close the county-screen trust gap.
