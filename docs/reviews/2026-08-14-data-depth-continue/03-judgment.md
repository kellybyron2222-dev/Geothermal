# Judgment Director — Data Depth continue (45-min slice)

**Date:** 2026-08-14  
**Director:** STOP / scorecard update after PAD-US Fee GAP1–2 ship  
**Inputs:** `01-blue-team.md` · `02-red-team.md` · ETL status (122 friction / 67 TexNet caution) · prior `07-post-now-judgment.md`  
**MVP lock:** Actionable geothermal intelligence, not GIS sprawl; Phase 3 blocked until Data Depth STOP

---

## Verdict

| Question | Answer |
|----------|--------|
| **Data Depth STOP met?** | **NO** |
| **Phase 3 unlocked?** | **NO — LOCKED** (unless a later judgment clears STOP) |
| **Slice outcome** | Criterion 4 advanced to **MET**; criterion 2 remains the blocker |

---

## Stop scorecard (this judgment)

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | T@depth labeled (Stanford @ documented band) | **MET** | Unchanged — @4 km |
| 2 | Denser measured control (SMU/GDR **and/or RRC**) | **PARTIAL** | SMU live; **RRC = SMU density proxy** (Digital Map MFT/login not cleared) |
| 3 | Infra: lines + substations | **MET** | Unchanged |
| 4 | Risk/constraint: TexNet **and/or** PAD-US visible | **MET** | TexNet live (~67 caution) **+** PAD-US Fee GAP1–2 live (**122** friction) |
| 5 | Methodology v0.4 published | **MET** | Unchanged |
| 6 | Judgment accepts residual model / layer uncertainty | **PARTIAL** | Residual chrome live; **RRC residual not yet buyer-accepted in writing**; PAD-US calibration residual open |

**Director rule:** STOP requires criterion 2 closed by **either** real RRC Digital Map density **or** an explicit **buyer-accepted residual** (loud UI + methodology). Loading PAD-US alone does **not** unlock Phase 3.

---

## Criterion 2 — decide residual vs require RRC

| Option | Meaning | Director call |
|--------|---------|---------------|
| **A. Real RRC before STOP** | Ingest Digital Map well density (MFT/login path); replace proxy | Valid path; may be multi-session |
| **B. Buyer-accepted residual** | Keep SMU `thermal_control_n / area_km2` tertiles; document as **not** RRC; loud chips + methodology + residual banner; accept for STOP | Valid path **only if** residual is written and product-loud |

**Prefer for this phase:** **STOP not yet** until **either A or B** is complete. Do **not** soft-stop on “proxy is good enough” without the written residual + UI. Default next session: draft residual acceptance package **or** spike RRC access — pick one; do not leave PARTIAL silent.

---

## Keep / Build soon / Defer / Reject

| Decision | Items |
|----------|--------|
| **KEEP** | Stanford T@depth @4 km; SMU confidence; HIFLD line+sub; TexNet caution; PAD-US Fee GAP1–2 loaded flags; nullable honesty schema; residual banner; v0.4; Phase 3 lock |
| **SOON (still 2.5)** | **Tighten PAD-US** to min area fraction (e.g. intersect area / county area **> 1%**) — primary NEXT; RRC path A **or** written residual path B; E4 evidence inherit; E5 cohort demote; E6 raw T beside score |
| **DEFER** | Phase 3 alerts/accounts/prospects; stress factor; ERCOT GIS; GLO/UL adjacency; Enverus; Phase 4/5 |
| **REJECT** | Soft-unlock Phase 3; claim Data Depth complete; treat any-intersect PAD-US as final calibration; silent RRC-as-RRC labeling |

---

## NEXT (ordered)

1. **SOON:** PAD-US min-area-fraction gate (e.g. **> 1%**) to cut over-flag noise (~122 any-intersect).  
2. **STOP blocker:** Real RRC Digital Map **or** explicit buyer-accepted SMU-proxy residual (loud UI + methodology).  
3. **SOON:** E4 site evidence Stanford inherit (before any Phase 3 talk).  
4. **DEFER:** Phase 3 — **LOCKED** until STOP clears.

---

## Director one-liner

**Criterion 4 MET (TexNet + PAD-US); STOP not yet — close criterion 2 via real RRC or loud buyer-accepted proxy residual; NEXT tighten PAD-US area fraction; Phase 3 stays locked.**
