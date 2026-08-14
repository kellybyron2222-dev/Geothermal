# Persona synthesis — Texas Geothermal Data Depth strategy

**Date:** 2026-08-14  
**Artifact:** `docs/reviews/2026-08-14-data-depth/04-persona-synthesis.md`  
**Reviewed:** Proposed Data Depth stack (`docs/data-strategy-texas-geothermal.md`) vs shipped product (ScreeningScore 0.60 IHFC + 0.40 HIFLD lines; ~10 gradient counties; Phase 2 evidence tools; scoring v0.3.1)  
**Thesis evaluated:** Will the proposed data stack change focus/ignore decisions — or create false confidence?

---

## 1. Method

**n ≈ 100** simulated independent reviews after a desk brief: current product limitations → strategy Top-10 NOW → §7 smallest stack → honesty constraints (model vs measured, no DIY BHT, no parcels/CEII/Enverus now).

| Persona | Weight | n | Primary JTBD tested |
|---------|--------|---|---------------------|
| Geothermal developer | 28% | 28 | Shortlist counties with credible T@depth + well control |
| Energy project developer | 22% | 22 | Leadership slide: thermal + wires/offtake without fake interconnection |
| Infrastructure / land-adjacent investor | 12% | 12 | Diligence triage; avoid model-hot empty counties |
| Land / minerals investor | 8% | 8 | Where to start outreach (county → land later) |
| Domain skeptic / geothermal scientist | 15% | 15 | Model honesty, BHT bias, false ranking risk |
| Researcher / student | 10% | 10 | Reproducibility / methodology clarity |
| Policymaker | 5% | 5 | Texas next-gen narrative credibility |

**Weighting rule:** Buyer clusters (geo + energy + infra + land ≈ 70%) dominate must-have / dismiss. Skeptics punch above weight on **trust vetoes**. Researchers/policy inform clarity, not roadmap width.

**Stimulus facts reviewers were given:**

- Today: IHFC sparse; gradient cohort ≈ 10; HF fallback dominates  
- Proposal: Stanford T@depth (PIGNN-class model) + SMU/GDR BHT + RRC + substations/plants + TexNet + PAD-US + methodology v0.4  
- Locks: labeled model; no DIY BHT opportunity without QC; no parcels/CEII/Enverus now; Phase 3 blocked  

**Overall reaction mix (≈100):**

| Reaction | ~n | Who drives it |
|----------|----|---------------|
| Strongly support Data Depth before Phase 3 | 41 | Geo, energy, infra, most researchers |
| Support if model/BHT honesty is loud | 27 | Skeptics (conditional), senior geo, infra |
| Lukewarm — want Enverus/stress/land sooner | 14 | Some geo, land investors, EGS-leaning buyers |
| Confused — score stack too many knobs | 10 | Policy, land, junior energy |
| Distrust / dismiss if Stanford unlabeled | 8 | Hard skeptics, senior scientists |

**Net:** Buyers **demand** denser thermal data before automation. Trust bifurcates on **whether Stanford is labeled and demoted vs measured control**. Scope creep (parcels, ERCOT, Enverus, stress-now) splits lukewarm minority.

---

## 2. Clustered feedback

### A. Praise (~what would work)

| Cluster | ≈% of reviewers | Persona drivers | Concrete notes |
|---------|-----------------|-----------------|----------------|
| **T@depth language at last** | ~62% | Geo, energy, infra | “Hot at what depth?” is the first buyer question; IHFC gradient-only fails the interview. |
| **Phase 3 blocked until data** | ~55% | Energy, infra, skeptics | Automating thin ranks is seen as vendor malpractice; lock is praised. |
| **SMU/GDR BHT densification** | ~52% | Geo, skeptics, researchers | Measured control is the credibility bridge; Texas geothermal story expects BHT. |
| **Separate confidence** | ~48% | Infra, skeptics, energy | Model-hot + low control = “watchlist,” not “invest.” Architecture already matches mental model. |
| **Substations over lines-only** | ~40% | Energy, infra | Feels like a real infra upgrade without claiming interconnection. |
| **PAD-US gate** | ~28% | Infra, land, policy | Cheap professionalism; nobody wants parks in a shortlist. |
| **No parcels / no Enverus yet** | ~25% | CTO-minded buyers, energy | Public path first is respected if T@depth+BHT land. |
| **RRC as context** | ~22% | Geo (Sage-like), energy | Well density as ops/data-richness — when clearly not “more oil = more geothermal.” |
| **TexNet caution** | ~20% | EGS-aware geo, skeptics | Risk honesty; only if not inverted into opportunity. |

**Buyer-realistic praise quote (geo):**  
“If you show me 4 km model temperature *and* how many BHT points back the county, I’ll shortlist. If you only paint a neural net, I’ll close the tab.”

---

### B. Confusion (~what didn’t parse)

| Cluster | ≈% of reviewers | Persona drivers | Concrete notes |
|---------|-----------------|-----------------|----------------|
| **Model vs measured on one ladder** | ~36% | Energy, land, policy | Even with labels, choropleth reads as one currency unless confidence demotion is visually loud. |
| **Which depth band?** | ~30% | Geo, energy | 3 vs 5 vs 7 km changes ranks; “pick one and document” is mandatory or buyers invent their own. |
| **RRC density meaning** | ~24% | Land, policy, some energy | Without copy, “wells” looks like geothermal attractiveness. |
| **Top-10 wishlist vs smallest stack** | ~22% | All buyers under time pressure | Strategy Top-10 NOW feels like a research program; §7B feels like a product. Prefer §7B. |
| **Stress / EGS weights now** | ~18% | Closed-loop buyers vs EGS buyers | Split: closed-loop don’t want Aϕ complexity; EGS want it yesterday. |
| **ERCOT queue in screening** | ~15% | Energy juniors | Confuse market heat with thermal opportunity. |
| **OFM306 vs Stanford** | ~12% | Gulf Coast-focused geo | Unsure if paywalled regional map replaces or supplements model. |

**Buyer-realistic confusion quote (energy):**  
“I support more data. I don’t know if I’m buying a two-factor score or a seven-layer GIS.”

---

### C. Distrust (~what eroded credibility)

| Cluster | ≈% of reviewers | Persona drivers | Concrete notes |
|---------|-----------------|-----------------|----------------|
| **Unlabeled / quiet Stanford PIGNN** | ~44% | Skeptics, senior geo | **Top veto.** Neural net T@depth without measured-vs-model is “AI geothermal” — brand-ending. |
| **DIY BHT corrections** | ~38% | Skeptics, geo | Archive BHT without QC as opportunity = false precision. Confidence-only path restores trust. |
| **IHFC status quo as “done”** | ~35% | Geo, energy | Continuing to sell statewide ranks on ~10 gradient counties is already a trust wound. |
| **Well density as opportunity** | ~27% | Skeptics, geo | Permian cosplay geothermal. |
| **ERCOT / CEII / redistribution** | ~22% | Energy counsel-minded, infra | Legal + overclaim risk; prefer stay away for public MVP. |
| **Parcels-as-progress** | ~20% | Geo thesis allies, energy | Land GIS feels like avoiding the hard thermal problem. |
| **Four-factor weight freeze** | ~18% | Researchers, skeptics | Uncalibrated 0.50/0.25/0.15/0.10 looks like methodology theater. |
| **Enverus before public fails** | ~12% | Cost-sensitive founders/buyers | Smells like buying legitimacy instead of earning it. |

**Buyer-realistic distrust quote (scientist):**  
“Stanford’s model is a prior. If your UI treats it like a thermometer, you’re not a screening tool — you’re a confidence laundering machine.”

---

### D. Missing must-haves (weighted)

| Must-have | ≈ buyer weight | Notes |
|-----------|----------------|-------|
| Documented depth band + labeled model T@depth | Critical | D1 + M0 |
| Local BHT/HF control counts (SMU) | Critical | D2 |
| Confidence demotion when model-only | Critical | M0 / D1+D2 |
| Infra upgrade beyond lines (substations) | High | D6 |
| Explicit “not interconnection / not resource” | High | Copy lock |
| Well density as confidence only | High | D3 |
| PAD-US or equivalent “don’t rank parks” | Medium–High | D5 |
| TexNet for EGS caution | Medium | D4 |
| Stress maps | Medium (EGS subset) | Defer for default posture |
| ERCOT queue / parcels / Enverus | Low for public MVP now | Defer / reject per locks |

---

## 3. Persona-specific skews

| Persona | Skew | Implication |
|---------|------|-------------|
| Geothermal developer | Wants T@depth + BHT; allergic to unlabeled ML | D1 honesty + D2 non-negotiable |
| Energy project developer | Wants slide-ready shortlist + wires/offtake | D1 + D6; hate Phase 3 noise before trust |
| Infra / land investor | Fear empty model-hot counties | Confidence demotion + D3 |
| Land investor | Want GLO/parcels early | **Do not follow** — minority distraction |
| Domain skeptic | Veto power on PIGNN + DIY BHT | Red F1/F2 = stop blockers |
| Researcher | Methodology version + provenance | M0 v0.4 |
| Policymaker | Narrative “Texas geothermal serious” | Depth language helps; score knobs confuse |

---

## 4. Clusters to feed judgment

1. **Build Data Depth now** — consensus (~70%+ buyer-weighted).  
2. **Honesty is the product** — Stanford only if labeled + demoted; BHT default confidence.  
3. **Cut width to §7B + cheap gates** — Top-10 NOW wishlist confuses and delays.  
4. **Defer stress / ERCOT / land / Enverus / OFM306** with clear WHEN.  
5. **Keep Phase 3 blocked** — strong praise cluster.  
6. **RRC/TexNet/PAD-US** — valuable if typed correctly (confidence/risk/gate); harmful if opportunity-juice.

**Persona one-liner:** Buyers will pay attention for T@depth + BHT control; they will leave forever for silent ML or DIY BHT cosplay — so ship a narrow, honest spine, not a data museum.
