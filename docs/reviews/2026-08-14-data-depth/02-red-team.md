# Red Team Attack — Texas Geothermal Data Depth Strategy

**Role:** Red team (false confidence / overclaim / complexity attack)  
**Date:** 2026-08-14  
**Scope:** Proposed Data Depth stack from `docs/data-strategy-texas-geothermal.md` (§3 rankings, §7 recommendation) against shipped v0.3.1 reality  
**Thesis check:** What fails, misleads, overclaims, is slow, or is low value / high complexity for a solo-dev Texas next-gen screening MVP?

---

## Attack posture

Blue is right that IHFC-only is commercially thin. Red’s job is to stop Data Depth from becoming **false confidence with better branding** — especially Stanford PIGNN T@depth sold as heat, DIY BHT as opportunity, ERCOT as market magic, and parcels as diligence theater.

---

## Findings (severity-ranked)

### F1 — Stanford Thermal Earth Model as silent opportunity spine (CRITICAL)

| | |
|--|--|
| **Claim under attack** | Stanford GDR 1592 is “highest public T@depth path” (relevance 9) and #1 MVP add NOW |
| **Failure mode** | PIGNN / physics-informed neural net outputs look like measured temperature fields. County means of model cells mint a statewide ladder that *looks* like resource intelligence. Confidence 6 in the strategy table is already a warning; UI will bury it. |
| **Who gets hurt** | Domain skeptics, senior geo developers — bounce permanently if they catch unlabeled ML |
| **Product lock violation risk** | Explainable heuristics preferred; “never silent ML score” |
| **Recommended fix** | If used: **labeled model layer** only; `measured_vs_model_flag`; demote confidence wherever no SMU/IHFC control; never blend model T into the same visual currency as measured BHT; methodology v0.4 must scream this |
| **Enhance / defer / reject fork** | **Enhance with honesty** (NOW-eligible) vs **Reject as core score** if honesty cannot ship in the same PR |

### F2 — DIY BHT correction as opportunity (CRITICAL)

| | |
|--|--|
| **Claim under attack** | SMU/GDR 1704 “optional local means” / opportunity if aggregated carefully |
| **Failure mode** | Solo founder invents correction curves (or silently trusts archive fields) → statewide “corrected BHT opportunity” with no methodology version, no QC flags, no bias disclosure. Strategy already lists DIY BHT→gradient as avoid; pressure to “fill the map” will resurrect it. |
| **Who gets hurt** | Anyone who treats ranks as diligence-grade |
| **Recommended fix** | **Confidence-first path for D2:** n_BHT, nearest control distance, QC flags. Local thermal opportunity from BHT only behind explicit methodology version + documented QC. Default: control densification, not new opportunity juice |
| **Reject** | DIY statewide BHT→gradient/opportunity without versioned QC |

### F3 — Replacing one thin spine with an overfitted multi-factor score (HIGH)

| | |
|--|--|
| **Claim under attack** | §7E sketch: 0.50 Tdepth + 0.25 infra + 0.15 play + 0.10 offtake |
| **Failure mode** | Four knobs before calibration recreate Phase 1 cohort-mixing wounds. Stress + offtake + model thermal + substations = explainability theater. Solo-dev cannot calibrate all weights honestly in one slice. |
| **Recommended fix** | Ship **smallest stack** (§7B) first: T@depth + infra proximity; confidence separate. Play/offtake as badges or SOON weights only after county sanity review |
| **Severity** | High — complexity / false precision |

### F4 — RRC well density as attractiveness (HIGH)

| | |
|--|--|
| **Claim under attack** | RRC relevance 8; “pairs with BHT”; risk of scoring dense Permian/Eagle Ford as geothermal-hot |
| **Failure mode** | Oilfield density ≠ geothermal opportunity. Quiet opportunity weight → East/West TX O&G corridors dominate shortlists for the wrong reason. |
| **Recommended fix** | **Confidence / O&G co-use context only.** UI copy: “evidence / operations context,” not “more wells = better geothermal” |
| **Severity** | High if mis-weighted; Low if locked as confidence |

### F5 — ERCOT GIS / queue as opportunity substitute (HIGH)

| | |
|--|--|
| **Claim under attack** | ERCOT GIS report in Top 10 MVP; “queue / interconnection heat” |
| **Failure mode** | Tabular queue ≠ thermal. Redistribution / portal ToS risk (strategy already flags full ERCOT GIS redistribution). CEII-adjacent temptation. Market heat becomes a fake offtake score. |
| **Product lock** | No ERCOT CEII for public MVP now |
| **Recommended fix** | **DEFER** public MVP scoring use. Optional later dossier summary of *public* xlsx aggregates only, with legal review — never CEII, never score juice in Data Depth v0.4 |
| **Severity** | High (ToS + false signal) |

### F6 — Parcels / GLO / University Lands creep (HIGH)

| | |
|--|--|
| **Claim under attack** | Phase 2 roadmap heritage + strategy Phase 2 enhanced list (UL, GLO) |
| **Failure mode** | Land GIS becomes the product; thermal spine never finishes. Title cosplay destroys thesis (“not GIS”). |
| **Product lock** | No parcels GIS for public MVP now |
| **Recommended fix** | **REJECT** parcels for Data Depth. **DEFER** GLO/UL adjacency until after Data Depth stop (Phase 3 dossier nice) |
| **Severity** | High scope distraction |

### F7 — Stress maps forced into NOW (MEDIUM–HIGH)

| | |
|--|--|
| **Claim under attack** | Lund Snee/Zoback in Top 10 NOW and “Required for EGS-aware claims” |
| **Failure mode** | Correct science, wrong timing. Closed-loop-safer default doesn’t need Aϕ weights yet. Medium ingest + play ontology expands methodology surface area before T@depth honesty is proven. |
| **Recommended fix** | **DEFER / SOON:** badge or dossier first; opportunity weight only after D1–D2 honesty ships and EGS posture is an explicit product mode |
| **Severity** | Medium–High (solo-dev / premature play complexity) |

### F8 — OFM306 as timeline hostage (MEDIUM)

| | |
|--|--|
| **Claim under attack** | Relevance 9; “if obtainable without killing timeline” |
| **Failure mode** | Paywall / store friction stalls the whole spine. Partial Gulf Coast coverage creates another cohort-mixing trap. |
| **Recommended fix** | **DEFER with WHEN:** after Stanford+SMU path ships; add only if access is clean within ≤2 days wall-clock |
| **Severity** | Medium |

### F9 — TexNet / PAD-US opportunity contamination (MEDIUM)

| | |
|--|--|
| **Claim under attack** | Nice→soft required items in strategy P2 |
| **Failure mode** | Seismicity or protected % inverted into “safer = hotter” or silent demotion without labels. Or both layers deferred forever while ranks overclaim EGS corridors / park-adjacent counties. |
| **Recommended fix** | If NOW: **flags/gates only**. If schedule slips: DEFER TexNet before PAD-US (PAD-US is cheaper embarrassment prevention) |
| **Severity** | Medium |

### F10 — Enverus “relevance 10” gravity well (MEDIUM)

| | |
|--|--|
| **Claim under attack** | Contrast row relevance 10; buyer pressure for dense BHT |
| **Failure mode** | License + ETL before public path fails sales → cash/time sink; ToS blocks public MVP |
| **Recommended fix** | **DEFER until revenue** justifies paid tier; public SMU/Stanford path must fail commercially first |
| **Severity** | Medium (spend / lock-in) |

### F11 — Aquifers / NREL / FEMA / geology ontology as screening (LOW–MEDIUM)

| | |
|--|--|
| **Claim under attack** | TWDB aquifers, NREL favorability, NFHL, full GDT ontology temptations |
| **Failure mode** | Water story ≠ next-gen heat; NREL composite opacity; flood noise; geology encyclopedia |
| **Recommended fix** | Stay in strategy **Avoid initially** list — **REJECT** for score; aquifers dossier-only later |
| **Severity** | Low–Medium |

### F12 — Phase 3 automation before Data Depth stop (CRITICAL process)

| | |
|--|--|
| **Claim under attack** | Roadmap Phase 3 / watchlists / prospect generation |
| **Failure mode** | Automating wrong ranks at scale; alert noise on model drift; methodology versioning theater |
| **Recommended fix** | **Hard block:** Phase 3 not opened until Data Depth judgment stop clears |
| **Severity** | Critical |

### F13 — “Acquire five first” still too wide for solo week (MEDIUM)

| | |
|--|--|
| **Claim under attack** | §7D: Stanford + SMU + substations + EIA + stress (+ RRC + OFM306 parallel) |
| **Failure mode** | Seven ingest streams = half-done honesty on all. Especially stress + EIA + OFM306 in parallel with Stanford QC. |
| **Recommended fix** | Cap **NOW ≤6** concrete backlog items; merge substations/plants; push stress/ERCOT/OFM306 out |
| **Severity** | Medium (execution) |

---

## Red KEEP attacks (must not ship)

1. Unlabeled Stanford / PIGNN as if measured T  
2. DIY BHT opportunity without methodology version + QC  
3. ERCOT CEII or full GIS redistribution in public MVP  
4. Parcels GIS / mineral title scoring  
5. Enverus before public path fails sales  
6. Well density or queue heat as primary opportunity  
7. Phase 3 automation on the current ~10-county gradient spine  
8. Four-factor opportunity weights frozen without county calibration  

---

## What red concedes (do not attack into paralysis)

- IHFC-only / ~10 gradient counties is **not** commercially sufficient — rejecting Data Depth entirely is wrong  
- HIFLD lines-only is a weak infra story — substations are a legitimate Easy upgrade  
- Separate confidence is the right architecture — attack *inputs to confidence*, not the separation  
- Strategy’s honesty constraints (§7E) are correct; red attacks **execution risk**, not the written locks  

---

## Red priority map for judgment

| Priority | Finding | Ask of judgment |
|----------|---------|-----------------|
| P0 | F1, F2, F12 | Honesty locks + Phase 3 block |
| P1 | F3, F4, F5, F6 | Smallest score stack; no ERCOT/parcels/well-attractiveness |
| P2 | F7, F8, F9, F13 | Cut NOW width; defer stress/OFM306/ERCOT |
| P3 | F10, F11 | Revenue/dossier later |

**Red one-liner:** Data Depth without labeled-model discipline and BHT-QC gates is a prettier way to lie; with those locks, cut the NOW list ruthlessly and refuse Phase 3 until the spine is real.
