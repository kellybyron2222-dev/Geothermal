# Data Depth ETL status — 2026-08-14 (updated NOW fixes)

Offline download + county feature build for Data Depth **D1–D6**.  
Scripts: `scoring/download_data_depth.py`, `scoring/fetch_texnet.py`, `scoring/build_data_depth_features.py`.  
Manifest: `data/raw/_manifest.json`. Output: `data/processed/data_depth_features.csv`.

## Download results

| ID | Source | Artifact | Status | Notes |
|----|--------|----------|--------|-------|
| D1 | Stanford GDR 1592 | `data/raw/stanford_thermal/tx_t_at_depth.csv` | **OK** | Stream-filtered CONUS → TX cells; primary T@4 km. |
| D2 | SMU GDR 1704 | `data/raw/smu_gdr_1704/` | **OK** | Resource index lat/lon → thermal control counts. |
| D3 | RRC well density | proxy via SMU control | **PROXY (not RRC)** | Digital Map not ingested. `well_density = thermal_control_n / area_km2`, tertile bands, `well_density_note=smu_control_density_proxy_rrc_pending`. Meta screams **NOT RRC Digital Map**. |
| D4 | TexNet ArcGIS REST | `data/raw/texnet/texnet_events.json` (+ csv) | **OK (NOW)** | MapServer/0 query `Magnitude>=2.5`, paginated; spatial-join → `texnet_risk_flag` (≥1 event M≥2.5 in county). |
| D5 | PAD-US 2.1 Fee TX | `data/raw/padus/padus21_tx/PADUS2_1Fee_StateTX.shp` | **LIVE** | County `padus_protected_flag=True` iff intersects Fee polygon with **GAP_Sts in {1, 2}**. GAP 3/4 alone do **not** set friction. Vintage `padus_2.1_fee_gap12`; status `loaded`. |
| D6 | HIFLD substations + EIA 860 | geojson + plants | **OK** | Lines + substations in infra proxy. |

## Honesty schema (N1)

| Flag | When loaded | When missing |
|------|-------------|--------------|
| `texnet_risk_flag` | True if county has ≥1 TexNet event M≥2.5; else False | **NaN** + `texnet_status=unknown` |
| `padus_protected_flag` | True if county intersects Fee GAP_Sts ∈ {1, 2}; else False | **NaN** + `padus_status=unknown` |

Scorer exports `texnetCaution` / `padusFriction` as `true|false|null` and `texnetStatus` / `padusStatus` as caution|clear|unknown / friction|clear|unknown. Confidence demotes only when flag is **True**; Unknown does not demote as Clear.

## Feature build QA (post NOW)

| Metric | Value |
|--------|-------|
| Counties | 254 |
| With `tdepth_C` | 254 |
| Primary depth | **4.0 km** (`T_4000m`) |
| TexNet events | **4,463** M≥2.5; **67** counties caution (≥1 event) |
| TexNet status | `loaded` |
| PAD-US | `padus_status=loaded`; **122** counties friction (Fee GAP1–2); vintage `padus_2.1_fee_gap12` |
| Well density | SMU control proxy; note `smu_control_density_proxy_rrc_pending` |

## How to re-run

```text
# TexNet only (fast)
scoring\.venv\Scripts\python.exe scoring\fetch_texnet.py
# or:
scoring\.venv\Scripts\python.exe scoring\download_data_depth.py --texnet-only

scoring\.venv\Scripts\python.exe scoring\build_data_depth_features.py
scoring\.venv\Scripts\python.exe scoring\score_counties_v04.py
```

`VERIFY_SSL=False` matches Phase 1 downloader. Skip-if-exists for large artifacts. PAD-US Fee zip downloads from ScienceBase when missing under `data/raw/padus/`.

## Open follow-ups (still deferred)

1. Real RRC Digital Map density (replace SMU proxy).
2. Evidence surfaces inherit v0.4 spine (E4) before Phase 3 unlock.
3. **Phase 3 remains locked** — Data Depth STOP not met (RRC still proxy).
