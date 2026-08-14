# Judgment after personas — Texas Geothermal Data Depth (FINAL)

**Date:** 2026-08-14  
**Scope:** Final build-now vs build-later for Data Depth  
**Inputs:** `01-blue-team.md` · `02-red-team.md` · `03-judgment.md` · `04-persona-synthesis.md` · strategy §3/§7 · product locks  
**Director role:** Authoritative prioritization; challenge scope; preserve MVP philosophy

---

## Final verdict

| Decision | Result |
|----------|--------|
| **Data Depth slice** | **BUILD NOW** — commercially required before Phase 3 |
| **IHFC-only status quo** | **REJECT** as sufficient |
| **NOW width** | **Max 6** concrete items (D1–D6) + mandatory methodology v0.4 acceptance on D1 |
| **Phase 3 automation** | **BLOCKED** until Data Depth stop clears |
| **Persona delta vs pre-persona judgment** | Confirms narrow §7B spine; **strengthens** unlabeled-Stanford and DIY-BHT vetoes; **keeps** D4/D5 as typed flags (not cuts); **does not** promote stress/ERCOT/land/Enverus into NOW |

**Stop philosophy:** Ship the honest thermal spine that changes focus/ignore — then stop. Deferrals are success.

---

## FINAL NOW list (build now)

Ordered for implementation. Cap = **6** dataset outcomes; methodology bump is required acceptance criteria for D1.

| ID | Build now | Role | Honesty lock |
|----|-----------|------|--------------|
| **D1** | **Stanford T@depth (GDR 1592)** — pick **one primary depth slice in 3–5 km**; TX county means (+ point/AOI sample if cheap) | Thermal **opportunity** prior | UI/JSON: **model T@depth (Stanford)**; never silent ML; demote confidence when measured control thin |
| **D2** | **SMU/GDR 1704 TX BHT/HF points** | **Confidence** densification (n, nearest, QC flags) | **No DIY BHT→opportunity/opportunity** in this slice |
| **D3** | **RRC well density** | **Confidence / O&G co-use context** | **Not** attractiveness-alone opportunity |
| **D4** | **TexNet seismicity overlay** | **Risk / confidence caution** | Never opportunity juice |
| **D5** | **PAD-US exclusion / friction flags** | **Gate** | Not opportunity |
| **D6** | **HIFLD substations** (primary infra upgrade); **EIA 860 plants** only as light offtake **context** (not a heavy fourth opportunity knob) | Infra **opportunity proxy** + offtake context | Still not interconnection / NPV |
| **M0** | **Methodology → v0.4** | Contract for all of the above | Model vs measured; confidence formula; IHFC demoted to QC/citation; version bump everywhere |

### Minimal opportunity formula allowed at stop

```text
ScreeningOpportunity ≈ w_t * S_Tdepth_model + w_i * S_infra(line, substation)
ScreeningConfidence  ← f(n_BHT, n_IHFC, RRC_density, measured_vs_model, TexNet_flag, PADUS_gate)
```

Do **not** freeze stress/offtake play weights in v0.4 without calibration. Default posture: **closed-loop-safer**.

### Schedule slip rule (still Data Depth)

If capacity forces a cut inside D1–D6: ship **D1 + D2 + D3 + D6 + M0** first; slip **D4 then D5** to SOON with written residual risk. Never slip D1/D2/M0.

---

## FINAL SOON (enhance soon — still this phase family after NOW stop)

| ID | Item | WHEN |
|----|------|------|
| **S1** | EIA plants as soft scored offtake (if still dossier-only) | Buyer pull after D1–D3 live |
| **S2** | Stress (Lund Snee/Zoback) as badge → optional EGS factor | After explicit EGS posture; post–NOW stop |
| **S3** | Dual panel: model T + measured control on county/point/AOI | Immediately after D1+D2 if not in first PR train |
| **S4** | Finish any slipped D4/D5 | Next slice after NOW stop |
| **S5** | Evidence surfaces fully inherit v0.4 spine | Before Phase 3 unlock |

---

## FINAL DEFER (with WHEN)

| Item | WHEN |
|------|------|
| Stress maps as scored opportunity | After Data Depth stop + EGS mode decision |
| TWDB aquifers / GWDB | Later dossier; never ScreeningScore |
| ERCOT GIS xlsx summaries | After ToS/legal comfort + Data Depth stop; dossier only — **no CEII** |
| GLO land/lease adjacency | Phase 3 dossier nice — after Data Depth stop |
| University Lands GIS | Phase 3 dossier nice — after thermal trust |
| BEG OFM306 | After D1 ships **and** store access clean (≤2 days) — else post-revenue/partner |
| Historic geopressured fairway digitization | Phase 3+ |
| Geology ontology / SMU T@depth map cross-check | After spine trusted |
| Enverus / IHS BHT | **After revenue** + public path fails sales |
| **Phase 3 automation / watchlists / rule prospects** | **Only after Data Depth stop criteria** |
| FEMA NFHL in score | Not regional screening |
| NREL favorability as primary thermal | Never primary |

---

## FINAL REJECT

| Item | Why |
|------|-----|
| IHFC-only / ~10 gradient counties as commercially sufficient | Buyer bounce; persona consensus |
| Silent Stanford PIGNN / unlabeled model as measured T | Trust veto (~44% distrust cluster) |
| DIY statewide BHT opportunity/correction without versioned QC | False precision |
| ERCOT CEII / full GIS redistribution in public MVP | ToS + false signal |
| Parcels GIS / mineral title scoring now | GIS distraction |
| Enverus for public MVP now | Premature paid path |
| RRC density or queue heat as primary opportunity | Wrong causal story |
| Uncalibrated four-factor opportunity freeze (§7E full sketch) | Methodology theater |
| Phase 3 on current spine | Automates wrong ranks |
| Aquifers / NFHL / NREL composite in ScreeningScore | Low value / opacity |

---

## Data Depth stop criteria (unchanged; authoritative)

1. D1 labeled Stanford T@depth at documented 3–5 km band  
2. D2 SMU control densifies confidence without DIY BHT opportunity  
3. D3 RRC = confidence/context only  
4. D6 substations (± light EIA context) with proxy honesty  
5. Methodology **v0.4** shipped and matched in UI/docs  
6. D4 and D5 shipped as risk/gate **or** explicitly SOON with residual risk noted  
7. No parcels / Enverus / ERCOT CEII / Phase 3 opened  
8. Top/bottom ~15 county sanity review passes “not silly”

**Then STOP.** Re-run short red/blue on the shipped slice. Unlock Phase 3 only on a later judgment.

---

## Persona → judgment traceability

| Persona cluster | Judgment response |
|-----------------|-------------------|
| Demand T@depth before Phase 3 | NOW Data Depth; Phase 3 blocked |
| Veto unlabeled Stanford | D1 honesty lock + M0 |
| Want BHT control | D2 confidence-first |
| Confuse Top-10 wishlist | Cap NOW at D1–D6; defer stress/ERCOT/OFM306 |
| Fear well-density attractiveness | D3 typed as confidence/context |
| Want parks/seismicity hygiene | D4/D5 as gate/risk |
| Minority land/Enverus pull | DEFER/REJECT for now |

---

## Director one-liner (FINAL)

**NOW = D1 Stanford T@depth (labeled) + D2 SMU BHT control + D3 RRC confidence + D4 TexNet risk + D5 PAD-US gate + D6 substations (± light EIA) + methodology v0.4; defer stress/ERCOT/land/OFM306/Enverus; Phase 3 stays blocked until this spine stops.**
