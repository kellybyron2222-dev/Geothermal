# NOW fixes applied — Data Depth stress (2026-08-14)

**Inputs:** judgment `04-judgment.md` / `05-persona-judgment-loop.md` (N1–N5 + optional E1).  
**Phase 3:** **LOCKED** (unchanged). Data Depth STOP: **not met**.

---

## Landed (this pass)

| ID | Item | What shipped |
|----|------|----------------|
| **N1** | Honesty schema D4/D5 | Nullable `texnet_risk_flag` / `padus_protected_flag` (NaN when missing); `texnet_status` / `padus_status`; JSON `true\|false\|null` + status chips |
| **N2 (honest proxy)** | D3 well density | SMU `thermal_control_n / area_km2` + tertile bands; note `smu_control_density_proxy_rrc_pending`; meta marks **NOT RRC Digital Map** |
| **N3** | User-facing residual risk | App banner under disclaimer; Methodology residual section; meta `residualRisk` + `dataDepthStatus` |
| **N4** | Freeze stop narrative | Roadmap + methodology: thermal spine live; STOP not met; Phase 3 locked |
| **N5** | Layer vintages / draft drop | `layerVintages` mark RRC=proxy, PAD-US=`not_loaded`, TexNet vintage when loaded; methodology header no longer “draft” |
| **E1 (partial)** | TexNet real ingest | ArcGIS REST pagination → `texnet_events.json`; county join ≥1 M≥2.5 → caution |

## Still deferred

| Item | Why deferred |
|------|----------------|
| Real **RRC Digital Map** density | Proxy only; Digital Map ETL not in this train |
| **PAD-US TX clip** friction join (E2) | Still Unknown / not loaded |
| Evidence inherit v0.4 spine (E4) | Before Phase 3 unlock |
| Dual-panel polish (E3), cohort demote (E5), raw tdepth beside score (E6) | SOON |
| Stress / ERCOT / GLO / Enverus / Phase 3 | Rejected or deferred per judgment |

## Stop scorecard (after fixes)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | T@depth labeled | **MET** |
| 2 | Denser measured control (± RRC) | **PARTIAL** (SMU live; RRC = proxy) |
| 3 | Lines + substations | **MET** |
| 4 | TexNet and/or PAD-US visible | **PARTIAL** (TexNet live; PAD-US Unknown loud) |
| 5 | Methodology v0.4 | **MET** (finalized wording) |
| 6 | D4/D5 real **or** Unknown loud | **PARTIAL** (TexNet real; PAD-US Unknown; residual chrome live) |
| Phase 3 | — | **LOCKED** |

**Director posture:** Do not claim Data Depth complete. Re-judge stop after real RRC and/or PAD-US, with residual risk still honest if either slips.
