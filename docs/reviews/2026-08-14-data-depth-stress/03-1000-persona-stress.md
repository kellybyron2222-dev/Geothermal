# 1000-persona stress — Data Depth live

**Date:** 2026-08-14  
**Method:** Simulated ~1000 reviewers; weighted to primary buyers; deliberately harsh  
**Shipped reality under review:** D1/D2/D6/M0 live; D3/D4/D5 stub; silent False TexNet/PAD-US; scoring 0.4.0 @4 km

---

## Persona mix (n ≈ 1000)

| Persona | n | Weight rationale |
|---------|---:|------------------|
| Geothermal developers (next-gen / EGS / closed-loop) | 220 | Primary buyer |
| Energy project developers (IPP / renewables / corporate PPAs) | 160 | Primary buyer |
| Infrastructure / land investors | 120 | Primary buyer |
| O&G transition / subsurface teams | 90 | Adjacent buyer |
| ERCOT / utility / interconnection planners (public-data posture) | 50 | Infra realism |
| Municipal / industrial offtakers | 40 | Demand-side |
| Skeptical geothermal scientists / senior geo | 100 | Trust veto |
| Researchers | 70 | Secondary |
| Students | 40 | Secondary |
| Policymakers / economic development | 40 | Light |
| GIS power users / data engineers | 70 | Honesty / UX stress |
| **Total** | **1000** | |

---

## Clustered feedback (counts ≈ 1000; multi-label → primary cluster assigned)

### Trust / data honesty — **312**

| Sub-cluster | ≈n | Tone |
|-------------|---:|------|
| Silent False TexNet/PAD-US is diligence fraud | 118 | Hostile |
| Model labels OK but map still overclaims | 95 | Distrust |
| Want measured BHT opportunity, not only confidence n | 55 | Skeptical |
| Methodology 0.4 credible if stubs loud | 44 | Conditional praise |

**Verdict cluster:** Trust is the largest failure mode. Model labeling bought goodwill; **silent clear risk flags spent it**.

### Data sufficiency — **248**

| Sub-cluster | ≈n | Tone |
|-------------|---:|------|
| Need RRC density before calling this “depth” | 78 | Demand NOW |
| TexNet/PAD-US must ship or show Unknown | 72 | Demand NOW |
| T@depth @4 km enough for first shortlist | 52 | Praise |
| Still thin vs Enverus / commercial BHT | 28 | Defer OK |
| Want stress / EGS badges now | 18 | Wishlist (minority) |

**Verdict cluster:** Buyers split — thermal spine sufficient for **regional focus**; “Data Depth complete” claim **rejected** without D3–D5 honesty.

### Function / decision value — **168**

| Sub-cluster | ≈n | Tone |
|-------------|---:|------|
| Can build focus/ignore list faster than IHFC era | 71 | Praise |
| Confidence Low on half of TX → ranks unusable for diligence | 48 | Frustration |
| Site tools don’t feel tied to new spine | 29 | Confusion |
| Substations help infra story | 20 | Praise |

### Usability — **112**

| Sub-cluster | ≈n | Tone |
|-------------|---:|------|
| Too many cohort tabs / banners / caveats | 41 | Fatigue |
| Rank list + map OK once on tdepth tab | 33 | OK |
| Tied 100s / score vs °C unclear | 22 | Confusion |
| Mobile / dense UI | 16 | Annoyance |

### Novelty / differentiation — **85**

| Sub-cluster | ≈n | Tone |
|-------------|---:|------|
| Better than heat-flow choropleth toys | 38 | Mild praise |
| Not novel vs Stanford portal + HIFLD DIY | 27 | Shrug |
| “Intelligence platform” oversell | 20 | Distrust |

### Performance — **45**

| Sub-cluster | ≈n | Tone |
|-------------|---:|------|
| Fine on desktop static demo | 28 | OK |
| Heavy JSON / slow first paint | 17 | Annoyance |

### Phase 3 / automation appetite — **30** (primary cluster; many more mention in passing)

| Sub-cluster | ≈n | Tone |
|-------------|---:|------|
| Do **not** alert/automate yet | 22 | Veto |
| Want watchlists after risk layers | 8 | Later |

---

## Buyer-weighted synthesis (primary personas only, n=590)

| Theme | ≈ share of buyers | Implication |
|-------|------------------:|-------------|
| Keep T@depth labeled spine | ~70% | Do not roll back D1 |
| Fix silent False / ship Unknown | ~65% | **NOW** honesty |
| Ship RRC before “stop” | ~55% | **NOW** D3 |
| Phase 3 still premature | ~80% | **Lock** |
| Stress/ERCOT/parcels now | ~12% | **Defer/Reject** |

---

## Persona quotes (synthetic, representative)

- **Geo developer (hostile):** “False seismicity and park flags are worse than no flags.”  
- **Energy developer:** “I can shortlist Gulf Coast counties; I cannot diligence them.”  
- **Land investor:** “Substations help; ownership still external — fine. Don’t pretend PAD-US is clean.”  
- **Skeptical scientist:** “Labeled model is acceptable. Selling 100.0 as heat is not.”  
- **O&G transition:** “Where is RRC density? That’s table stakes in Texas.”  
- **ERCOT planner:** “Not interconnection — good. Don’t let ranks migrate into deck mythology.”  
- **GIS power user:** “Null vs False is a schema crime.”  
- **Student:** “Cool map; unclear what to do next.”  

---

## Cluster → severity map

| Cluster | ≈n | Maps to red findings |
|---------|---:|----------------------|
| Trust / silent False | 312 | F1, F2, F10 |
| Data sufficiency gaps | 248 | F3, F1 |
| Function / confidence | 168 | F5, F6 |
| Usability | 112 | F8, F11 |
| Novelty | 85 | F10 |
| Performance | 45 | F9 |
| Anti-Phase-3 | 30 | F2, F12 |

**Stress one-liner:** Across ~1000 reviewers, praise for T@depth is real — but **trust + data-sufficiency clusters (~560)** dominate; Phase 3 unlock would fail a buyer jury.
