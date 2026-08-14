# Blue Team — Data Depth live stress (post-ship)

**Role:** Blue team (decision-value defense)  
**Date:** 2026-08-14  
**Scope:** Shipped Data Depth slice vs Phase 2.5 stop criteria  
**Inputs:** roadmap stop criteria · `meta.json` (0.4.0) · prospects (254) · methodology v0.4 · UI model/cohort honesty · ETL status

---

## Shipped spine (what blue defends)

```text
ScreeningOpportunity ≈ 0.55 × S_Tdepth_model(@4 km) + 0.45 × S_infra(min(line, sub))
ScreeningConfidence  ← f(SMU control, IHFC QC, model demotion; RRC/TexNet/PAD-US intended)
```

| ID | Status | Blue claim |
|----|--------|------------|
| **D1** | **LIVE** | Stanford T@depth @ **4.0 km**, all **254** counties, `modelThermal=true`, labeled model prior |
| **D2** | **LIVE** | SMU/GDR 1704 densifies confidence — **246** counties with `measuredControlCount>0` |
| **D3** | **STUB** | Typed correctly as confidence/context; null density does not juice opportunity |
| **D4** | **STUB** | Intended risk caution only (not opportunity) |
| **D5** | **STUB** | Intended friction gate only (not opportunity) |
| **D6** | **LIVE** | HIFLD substations in infra `min(line, sub)` — stronger grid proxy than lines-only |
| **M0** | **LIVE** | Methodology **0.4.0** + UI Model T@depth labels + tdepth cohort tab |

Sample ladder (relative, winsorized): top Hidalgo / Harrison / Victoria (~100, ~138–146 °C model @4 km, High confidence); bottom Sherman / Dallam / Reagan (~0–3, ~91–93 °C). Panhandle cool / Gulf Coast warmer is not “silly” on first pass.

---

## What works / user value

### 1. Thermal language buyers already speak (KEEP)

Statewide **T@depth at a stated band** replaces IHFC’s ~10-county gradient cohort. Developers can ask “hot enough at ~4 km?” without waiting on Enverus. **Decision value:** focus / ignore shortlists become commercially discussable.

### 2. Model vs measured honesty contract (KEEP)

UI/meta/methodology scream **Model T@depth (Stanford) — not measured BHT**. Cohort tab defaults to **tdepth**; “All” warns against cross-cohort rank theater. Blue treats this as the difference between usable model prior and trust-destroying silent ML.

### 3. Confidence densification without DIY BHT opportunity (KEEP)

D2 raises trust where wells exist; opportunity stays model-labeled. Confidence bands (High 62 / Medium 54 / Low 131 / Unknown 7) show the product still distinguishes thin vs dense control — not a fake uniform “High” map.

### 4. Infra upgrade without interconnection cosplay (KEEP)

Substations in the min-distance proxy answer “is there anything to interconnect *near*?” without CEII or queue claims. Aligns with closed-loop-safer posture and product locks.

### 5. Site tools still present (KEEP)

Point / AOI / Compare / Land remain for site evidence without inventing a site ScreeningScore. Discovery → diligence path still exists.

### 6. Scope discipline held (KEEP)

No parcels GIS, no ERCOT CEII, no DIY BHT→opportunity, no Phase 3 automation on the old IHFC spine. Deferrals (stress, Enverus, GLO) remain correct.

---

## Blue keep list (priority)

1. Labeled Stanford T@depth @4 km as opportunity prior  
2. SMU measured control → confidence only  
3. Methodology 0.4.0 + model banners + tdepth cohort quarantine  
4. Substations in infra proxy with “not interconnection” disclaimer  
5. Reject silent ML and reject Phase 3 unlock until residual honesty gaps close  

---

## Blue concession (honest)

Blue does **not** claim stop criteria are fully met. D3/D4/D5 stubs plus **silent `False`** on TexNet/PAD-US are residual risk that undercuts “risk/constraint visible as flags/gates.” Defend the thermal spine; do not defend the silent-false hygiene failure.

**Blue one-liner:** Data Depth delivered the thermal + infra spine buyers needed; honesty on model labeling largely works — but stop is incomplete until risk/friction and RRC are real *or* loudly unknown, not silently clear.
