# Judgment Director — Texas Geothermal Data Depth (pre-persona)

**Date:** 2026-08-14  
**Scope under review:** Data Depth strategy for Texas next-gen screening (replace commercially thin IHFC spine before Phase 3)  
**Director role:** NOW / SOON / DEFER (with WHEN) / REJECT  
**Inputs:** Strategy §3 rankings + §7 · Blue KEEP · Red F1–F13 · product locks · scoring v0.3.1 · Phase 2 complete  
**MVP philosophy:** Actionable geothermal intelligence, not GIS sprawl; solo-dev achievability; explainable heuristics

---

## Verdict

| Question | Judgment |
|----------|----------|
| Is IHFC-only / ~10 gradient counties commercially sufficient? | **No — REJECT that status quo** (Red concedes; Blue critical) |
| Is Data Depth the correct next phase slice? | **Yes — Build now** (before Phase 3) |
| Is strategy §7 “acquire five + stress + OFM306 + ERCOT” the right NOW width? | **No — too wide** (F3, F7, F8, F13). Cap **≤6** concrete backlog items |
| May Phase 3 automation open? | **BLOCKED** until Data Depth stop criteria met (F12) |

**Director stance:** Blue wins on *what problem to solve*. Red wins on *how not to fake solving it*. Ship the **smallest defensible stack** (§7B) with honesty locks, not the full Top-10 wishlist.

---

## Product locks (authoritative for this slice)

1. **Explainable heuristics preferred.** Stanford T@depth allowed only as a **labeled model layer** with confidence demotion vs measured IHFC/SMU points — never a silent ML score (F1).  
2. **No DIY BHT correction as opportunity** without methodology version + QC (F2). Default D2 = control/confidence.  
3. **No ERCOT CEII / parcels GIS / Enverus** for public MVP now (F5, F6, F10).  
4. **Solo-dev achievability** — Easy–Medium public ingest; cut play ontology until thermal honesty ships.  
5. **Phase 3 automation BLOCKED** until Data Depth stop.

---

## Build NOW (max 6) — Data Depth slice

Concrete backlog IDs for builders. Ordered by decision impact.

| ID | Item | Concrete action | Opportunity / Confidence / Gate | Why NOW |
|----|------|-----------------|----------------------------------|---------|
| **D1** | Stanford T@depth (GDR 1592) | Ingest CONUS grids; TX county means at a **play-selected depth band (pick one primary slice in 3–5 km**, document it). Point/AOI sampling optional same vintage. UI + JSON: label **model T@depth (Stanford)**; set `measured_vs_model`. | **Opportunity** (primary thermal prior) + feeds confidence demotion | Answers “hot at what depth?” statewide; only public spine that escapes ~10-county trap |
| **D2** | SMU/GDR 1704 TX BHT/HF | Filter Texas points; county/point control counts + nearest distance; QC flags from archive fields where available. **Do not** invent statewide BHT→gradient opportunity in this slice. | **Confidence** (primary); opportunity only if future QC’d methodology explicitly allows | Densifies measured control; grounds model ranks |
| **D3** | RRC well density | County (and optional AOI) well density / activity proxy from public Digital Map well layers. | **Confidence / O&G co-use context** — **not** attractiveness alone | “Evidence exists here”; pairs with BHT narrative |
| **D4** | TexNet seismicity | Event density / mag near county centroid or AOI → **caution flag** | **Confidence / risk** — never opportunity juice | EGS honesty; cheap relative to stress maps |
| **D5** | PAD-US (TX clip) | % protected / GAP-status demotion or hard exclusion flag | **Gate / friction** — not opportunity | Prevents park/wilderness shortlist embarrassment |
| **D6** | HIFLD substations **or** EIA 860 plants | Prefer **substations** as infra upgrade to lines; EIA plants as **light offtake context** (dossier or ≤ soft secondary factor). Do not ship both as heavy score knobs. | Infra **Opportunity proxy** (substations); offtake **context** (plants) | Fast infra/offtake depth without ERCOT |

**Mandatory companion (counts inside the 6 as methodology, not a 7th dataset):**

| ID | Item | Action |
|----|------|--------|
| **M0** | Methodology → **v0.4** | Rewrite thermal spine: T@depth model prior ± BHT/IHFC/RRC control; IHFC demoted to QC/citation; separate confidence formula; honesty constraints; bump `methodology_version` everywhere UI/docs claim scoring |

**Implementation note:** Treat **M0 as required ship criteria for D1**. If schedule forces a cut inside the 6: keep **D1 + D2 + D3 + D6(substations) + M0**; slip **D4 then D5** to SOON (or keep D5 over D4 if park false-positives appear in top ranks during calibration).

**Hard cap:** Do **not** add stress, ERCOT xlsx, OFM306, aquifers, GLO, UL, or Enverus to this NOW list.

---

## Scoring sketch allowed for NOW (freeze only after TX county sanity)

```text
ScreeningOpportunity ≈
    w_t * S_thermal_Tdepth_model   # labeled Stanford; depth band documented
  + w_i * S_infra                  # min(line, substation) proximity proxy

ScreeningConfidence ← f(
    n_BHT_SMU_local,
    n_IHFC_local,
    well_density_RRC,
    measured_vs_model_flag,        # model-only → demote
    texnet_caution_flag,           # if D4 ships
    padus_gate                     # if D5 ships — hard demote/exclude
)
```

- Default posture: **closed-loop-safer** (stress weight ≈ 0 until SOON).  
- Do **not** freeze 0.50/0.25/0.15/0.10 from §7E in this slice.  
- Weights change only with methodology version bump + top/bottom-15 review.

---

## Enhance SOON (still Data Depth / enhanced screening — after NOW stop)

| ID | Item | WHEN trigger |
|----|------|----------------|
| **S1** | EIA 860 plants as soft offtake factor (if D6 was substations-only) | After D1–D3 honesty live and buyers ask for host/offtake in rank |
| **S2** | Lund Snee / Zoback stress as **badge** then optional EGS play factor | After explicit EGS product posture; not before D1 model labeling proven |
| **S3** | Dual panel: model T@depth + measured control summary on county/point | After D1+D2 ship (UI honesty polish) |
| **S4** | TexNet or PAD-US if slipped from NOW | Immediately after NOW stop if cut for schedule |
| **S5** | Point/AOI evidence inherit new thermal spine consistently | Same PR train as D1/D2 — if incomplete, finish SOON before Phase 3 |

---

## DEFER (with WHEN)

| Item | WHEN |
|------|------|
| **Lund Snee / Zoback stress as scored opportunity** | After Data Depth NOW stop + EGS mode decision (not default closed-loop) |
| **TWDB aquifers / GWDB** | Dossier-only in later site diligence; never ScreeningScore |
| **ERCOT GIS report (xlsx) summaries** | After legal/ToS comfort + Data Depth stop; dossier/soft context only — **never CEII** |
| **GLO land/lease adjacency** | Phase 3 dossier nice — after Data Depth stop |
| **University Lands GIS** | Phase 3 dossier nice — W TX corridor research after thermal trust |
| **BEG OFM306** | If store access clean within ≤2 days **after** D1 path ships; else after first revenue or partner access |
| **Historic geopressured fairway digitization** | Phase 3+ play priors |
| **SMU T@depth map products / GDT geology ontology** | Cross-check / explainability after spine trusted |
| **Enverus / IHS-class BHT** | **After revenue** and public SMU/Stanford path fails buyer trust |
| **Phase 3 automation / watchlists / rule prospects** | **Only after Data Depth stop** (see stop criteria) |
| **FEMA NFHL in score** | Not for regional screening; site diligence much later |
| **Full statewide parcels / CAD** | Reject for now; earliest Phase 2+ land research — not this slice |
| **NREL favorability as primary thermal** | Never as primary; optional national context later |

---

## REJECT (do not build)

| Item | Why |
|------|-----|
| Treating IHFC-only / ~10 gradient counties as commercially sufficient | Strategy blunt opening; buyer bounce |
| Silent / unlabeled Stanford PIGNN as measured thermal | Black-box ML; trust ending (F1) |
| DIY statewide BHT→gradient or BHT opportunity without versioned QC | False precision (F2) |
| ERCOT CEII or full ERCOT GIS redistribution in public MVP | ToS / lock (F5) |
| Parcels GIS / mineral title scoring in Data Depth | GIS distraction (F6) |
| Enverus for public MVP before public densification fails | Cost / ToS (F10) |
| RRC density or queue heat as primary opportunity | Wrong causal story (F4, F5) |
| Four-factor opportunity freeze without calibration | False precision (F3) |
| Phase 3 automation on current spine | Amplifies wrong ranks (F12) |
| NFHL / aquifers / NREL composite as ScreeningScore inputs | Low signal / opacity (F11) |

---

## Explicit stop criteria — Data Depth slice

Stop when **ALL** are true:

1. **D1** shipped: county (and evidence surfaces as applicable) show **labeled** Stanford T@depth at documented depth band.  
2. **D2** shipped: SMU/GDR TX control densifies confidence (n / nearest / flags); no silent DIY BHT opportunity.  
3. **D3** shipped: RRC density contributes to **confidence/context**, not attractiveness-alone opportunity.  
4. **D6** shipped: substations (preferred) and/or EIA plants as infra/offtake **proxy/context** with honesty copy.  
5. **M0:** `methodology_version` **0.4** documents model vs measured, confidence formula, and demotion rules.  
6. **D4 and/or D5** either shipped as flags/gates **or** explicitly slipped to SOON with written residual risk.  
7. **Scope lock:** No parcels, no Enverus, no ERCOT CEII, no Phase 3 automation opened.  
8. Top/bottom ~15 counties reviewed for “not silly” under model+control stack.

**Then stop.** Run red/blue + personas on the shipped Data Depth slice. **Do not** open Phase 3 until that pass clears.

---

## Ordered builder backlog (NOW)

1. **M0 scaffolding** — methodology v0.4 draft contracts (model label, confidence inputs) before ETL freezes claims  
2. **D1** — Stanford T@depth → TX counties (3–5 km primary slice)  
3. **D2** — SMU/GDR 1704 TX extract → control/confidence  
4. **D3** — RRC well density → confidence/context  
5. **D6** — HIFLD substations (primary); EIA plants light/context  
6. **D5** — PAD-US gate (prefer over D4 if only one constraint seat left)  
7. **D4** — TexNet caution flag (same seat competition as D5; both preferred if capacity allows)

*Cap deliverable set at six dataset/methodology outcomes: D1–D6 with M0 required for D1 acceptance. If capacity <6 datasets, drop D4 then D5 per note above.*

---

## Director one-liner (pre-persona)

**Build the labeled T@depth + measured-control confidence spine now; upgrade infra proxies; gate parks/seismicity cheaply; defer stress/ERCOT/land/Enverus; block Phase 3 until Data Depth stops.**
