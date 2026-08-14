# Blue Team Defense — Full Build (Phase 1 + Phase 2.1)

**Role:** Blue team (decision-value defense)  
**Date:** 2026-08-13  
**Scope:** Everything shipped — Texas next-gen **county screening MVP** + hardened **Point evidence check**  
**Thesis check:** Maps/datasets are inputs. The product answers: *Where should I focus geothermal development, and why?*

---

## 1. What works — and why it creates user/decision value

### 1.1 The product asks the right question and refuses the wrong job

Header disclaimer: regional screening index — not a resource map, not interconnection feasibility, not a drill recommendation.

**Decision value:** Developers leave with focus/ignore framing without mistaking the artifact for resource certification or pad picking.

### 1.2 Phase 1 ScreeningScore is a real prioritization instrument

```text
ScreeningScore = 0.60 × S_thermal + 0.40 × S_infra
```

- Thermal 0.60: IHFC gradient preferred; heat-flow fallback; cohorts scaled separately  
- Infra 0.40: HIFLD proximity proxy  
- Confidence separate from opportunity  

**Decision value:** Comparable statewide ranking with two auditable knobs.

### 1.3 Honesty about metric mix is product value

UI differentiates gradient vs heat-flow fallback (detail banner, factor labels, drivers, limitations). Sophisticated buyers can re-weight trust.

### 1.4 Explanation panel is the decision surface

Rank + score + confidence + drivers + factor contributions + limitations. Search supports known-county lookup.

### 1.5 Phase 2.1 Point check closes county coarseness without a second product

Evidence verbs, control quality first, ~km grid transmission, county demoted to context, decoupled loads.

### 1.6 Scope discipline is itself decision value

Texas only · counties · 2 factors · no parcels/AOI/compare · static delivery · Methodology documents rules.

---

## 2. KEEP list (must preserve)

1. North-star copy: focus/ignore — never resource/drill/interconnection claims  
2. Texas / next-gen beachhead  
3. Counties as screening units  
4. Two opportunity factors: thermal 0.60 + transmission 0.40  
5. Confidence separate from ScreeningScore  
6. Gradient preferred / heat-flow fallback with explicit UI differentiation  
7. No DIY BHT→gradient  
8. Transmission = grid proximity proxy language  
9. Explanation-first Explorer; no layer explorer  
10. Static delivery  
11. Point check = evidence, not a site ScreeningScore  
12. Control quality before thermal means  
13. County rank demoted on point panel  
14. Coarse infra honesty (~km + grid disclaimer)  
15. Decoupled loads  
16. Limitations always visible  
17. Out of scope stays out: AOI, compare, parcels, queues, ML surfaces  

---

## 3. Strengths vs JTBD

| JTBD | Strength |
|------|----------|
| Which counties to focus on / why? | Two-factor score + drivers |
| What about this pin? | Point evidence without inventing a site score |
| Solo-dev ship | Static JSON + Pages |

---

## 4. Good enough for this phase

Phase 1: focus/ignore in &lt;15 min with explainable drivers; metric honesty visible; confidence usable.  
Phase 2.1: county≠site; control before means; transmission not survey-grade; county path survives site-asset failure.

**Blue verdict:** Concept and locks are correct. Residual thinness is honest scope **if** ranking honesty and list-primary UX hold. Deferrals (AOI/compare/parcels) are success.
