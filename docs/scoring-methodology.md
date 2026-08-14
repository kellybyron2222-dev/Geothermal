# Scoring Methodology (Phase 2.5 Data Depth / v0.4.0)



**Thermal factor:** labeled **model T@depth (Stanford / GDR 1592)** when Data Depth features exist; IHFC gradient/heat-flow only as **legacy fallback** (`thermal_mode=legacy_ihfc`).  

**Locks:** [DECISIONS.md](DECISIONS.md) · Data Depth judgment [reviews/2026-08-14-data-depth/05-judgment-after-personas.md](reviews/2026-08-14-data-depth/05-judgment-after-personas.md) · stress NOW fixes [reviews/2026-08-14-data-depth-stress/06-now-fixes-applied.md](reviews/2026-08-14-data-depth-stress/06-now-fixes-applied.md) · [data-strategy-texas-geothermal.md](data-strategy-texas-geothermal.md)



`methodology_version: 0.4.0` — **live** for thermal spine (Stanford T@depth + SMU confidence + substations). TexNet + PAD-US risk flags live. Well density uses **buyer-accepted SMU proxy** until RRC Digital Map lands. **Phase 3 COMPLETE** (local watchlist / published digests / rule candidates v0 / export-import) — see [phase3.md](phase3.md).

**Scorer:** `scoring/score_counties_v04.py` (left-joins `data/processed/data_depth_features.csv`).

---

## Residual risk (loud)

### Buyer-accepted residual — well density (criterion 2)

RRC Digital Map statewide wells require interactive MFT login; automated fetch is blocked. Until Digital Map density ships:

- Confidence well-density band = **SMU control-point density proxy** (`thermal_control_n / area_km2`, tertiles)
- Labels scream **NOT RRC Digital Map** (`well_density_note=smu_control_density_proxy_rrc_pending`)
- Measured control for confidence still densifies via SMU/GDR points (246 counties) + IHFC QC
- This residual is **accepted for Data Depth STOP**; replacing with real RRC remains **SOON**, not a silent claim

### Risk layers

- TexNet: loaded (M≥2.5 county caution)
- PAD-US: loaded — Fee GAP_Sts **1–2** with **intersect area / county area > 1%** friction gate
- Meta: `residualRisk` + UI banner + county chips (Caution/Friction/Clear/Unknown)

Chrome:

- Meta: `dataDepthStatus` (e.g. `thermal_spine_live_rrc_proxy_accepted` when risk layers loaded + RRC proxy)
- Meta: `residualRisk` chrome text
- UI banner: Data Depth residual / status
- County chips: TexNet Caution/Clear/Unknown · PAD-US Friction/Clear/Unknown



This is **not** accounts / email / cloud sync. Scoped Phase 3 (local cadence) is **complete**.



---

## Phase 3 (watchlist & rules) — COMPLETE

| Item | Behavior |
|------|----------|
| Watchlist | ≤25 counties, localStorage + JSON export/import — no accounts |
| Digest | Auto-runs on Watchlist panel open; compares published score pack to last-seen — not live grids |
| Rule candidates (v0) | T@depth · confidence ≥ Medium · rank ≤ 40 · no PAD-US friction · TexNet badge + stable demote |
| Focus vs Watch | Ranked-list Focus is session triage and does **not** feed digests |
| Point/AOI | County model T@depth shown as **regional context only** — never a site ScreeningScore |

Not ScreeningScore. Rule text changes require a new judgment version.

---



## What this score is



A **relative Texas county screening index** for early next-gen geothermal prioritization, with an explicit **model vs measured** honesty contract.



## What this score is not



- Resource assessment or heat-in-place  

- Drill target ranking  

- Open- vs closed-loop optimization  

- Interconnection feasibility or NPV  

- Parcel ownership, title, or mineral-estate resolution  

- DIY statewide BHT→gradient/opportunity corrections  

- A claim that accounts / email / cloud sync are Phase 3 — those remain deferred; scoped local cadence is complete  

- Geology / Barnes 1992 / basement domains **in ScreeningScore** — map context overlays only; never ranking factors



---



## Spatial unit



**Texas counties only.**



---



## Opportunity factors (2) — Data Depth mode



Active when `data_depth_features.csv` supplies usable `tdepth_mean` (`meta.dataDepth: true`, `thermalMode: stanford_tdepth`).



### A — Model T@depth (weight **0.55**)



| Item | Detail |

|------|--------|

| **Primary** | County mean **model** temperature at a documented depth slice in the **3–5 km** band (Stanford Thermal Earth Model / GDR 1592) |

| Calculation | County mean T@depth (°C) → winsorize P10–P90 → scale 0–100 in Texas (higher = hotter) |

| UI / JSON label | **Model T@depth (Stanford)** |

| Metric id | `tdepth_C_kmX` (e.g. `tdepth_C_km4`); GeoJSON also exports `tdepthKm` |

| Honesty | Always labeled **model**, never silent ML / never presented as measured BHT |

| **Do not** | Blend model T into the same currency as measured control without labeling |



### B — Grid proximity (weight **0.45**)



| Item | Detail |

|------|--------|

| **Inputs** | HIFLD transmission **line** distance (from `county_features`) and HIFLD **substation** distance when present in Data Depth features |

| Calculation | `dist = min(dist_line, dist_substation)` when both exist; else line only → winsorize → scale 0–100 (nearer better) |

| Label | Grid proximity proxy — **not** interconnection feasibility |



### Formula (Data Depth)



```text

ScreeningScore = 0.55 * S_tdepth + 0.45 * S_infra

```



Default posture: **closed-loop-safer**. Stress / offtake play weights are **not** frozen in v0.4.



---



## Legacy fallback (no T@depth yet)



When `data_depth_features.csv` is missing or has no usable `tdepth_mean`:



- `thermalMode: legacy_ihfc` (loud in `meta.json`, per-county `thermalMode`, and limitations)

- `dataDepth: false`

- Opportunity uses prior IHFC path: **0.60 × S_thermal + 0.40 × S_infra**

- Thermal: geothermal **gradient** preferred (`gradient_n >= 3`), else heat-flow fallback; scaled **within** metric cohorts

- UI labels: “Geothermal gradient (legacy IHFC)” / “Heat-flow fallback (legacy IHFC)”



---



## Confidence (separate — never blended into a fake “truth score”)



```text

ScreeningConfidence ← f(

    n_IHFC,                 # thermal_n / well_count from county_features

    n_SMU / n_BHT,          # from data_depth_features when present

    well-density band,      # High / Medium / Low / Unknown (RRC or documented proxy)

    model vs measured,      # demote when model thermal + thin measured n

    TexNet caution flag,    # demote only when True — Unknown ≠ Clear demotion

    PAD-US friction gate    # demote only when True — Unknown ≠ Clear demotion

)

```



Bands (after demotions):



```text

High   | combined measured+IHFC >= T_high (or Medium+ with High density)

Medium | combined >= T_low or density Medium/High

Low    | thin positive control / after demotion

Unknown| no control and unknown density

```



**Model-only demotion:** if opportunity thermal is Stanford T@depth and measured control (`smu_n`/`bht_n`) is below `max(3, T_low)`, confidence is demoted at least one step.



**Well density:** when RRC Digital Map is absent, v0.4 may use an **SMU control-point density proxy** (`thermal_control_n / area_km2`, tertile bands) with note `smu_control_density_proxy_rrc_pending`. This is **not** RRC Digital Map.



IHFC remains **QC / citation** (and legacy opportunity fallback) — not the Data Depth opportunity spine.



---



## Risk flags (nullable)



| Field | Values | Meaning |

|-------|--------|---------|

| `texnetCaution` | `true` / `false` / `null` | Caution / Clear / Unknown |

| `padusFriction` | `true` / `false` / `null` | Friction / Clear / Unknown |

| `texnetStatus` | `caution` \| `clear` \| `unknown` | Loud status for UI chips |

| `padusStatus` | `friction` \| `clear` \| `unknown` | Loud status for UI chips |



**TexNet rule (when catalog loaded):** county caution if ≥1 event with M≥2.5 inside the county.



Missing layers must never export as silent `false`.



---



## Payload fields (v0.4)



County records may include:



| Field | Role |

|-------|------|

| `tdepthMean` / `tdepthKm` | Model T@depth context |

| `modelThermal` | `true` when opportunity uses Stanford prior |

| `measuredControlCount` | SMU/BHT densification for confidence |

| `thermalControlCount` | IHFC control count (QC / legacy) |

| `padusFriction` / `texnetCaution` | Nullable gate / risk flags |

| `padusStatus` / `texnetStatus` | Tri-state status strings |

| `thermalMode` | `stanford_tdepth` \| `legacy_ihfc` |

| `factors[].metric` | `tdepth_C_kmX` or legacy IHFC metrics |



`meta.json`: `methodologyVersion: "0.4.0"`, `dataDepth`, `dataDepthStatus`, `residualRisk`, `thermalMode`, `layerVintages`, per-layer `sources`, honesty flags.



GeoJSON properties: existing `thermalMetric` plus `tdepthKm` / nullable risk fields when present.



---



## Expected `data_depth_features.csv` (ETL contract)



Join key: `county_fips`.



| Column | Required for Data Depth mode | Notes |

|--------|------------------------------|-------|

| `tdepth_C` / `tdepth_mean` | **Yes** (to activate mode) | County mean model T (°C) |

| `tdepth_km` | Recommended | Depth slice (km) |

| `thermal_control_n` / `smu_n` | Recommended | Measured control for confidence |

| `well_density` / `well_density_band` | Optional | Confidence; may be SMU proxy |

| `well_density_note` | Recommended when proxy | e.g. `smu_control_density_proxy_rrc_pending` |

| `substation_dist_km` | Optional | Infra upgrade vs lines-only |

| `padus_protected_flag` | Optional | Nullable gate flag |

| `texnet_risk_flag` | Optional | Nullable risk flag |

| `texnet_status` / `padus_status` | Recommended | `loaded` \| `unknown` |

| `*_vintage` | Optional | Copied into `meta.layerVintages` |



---



## Point / AOI / Compare / Land (unchanged honesty)



Point check, AOI evidence, Compare, and Land context remain **not** ScreeningScores. Containing-county labeled model T@depth is shown as **regional context** on Point/AOI (shipped); never invents a site score.



---



## Build plan note



| Step | Status |

|------|--------|

| v0.2 heat-flow-only thermal | Shipped (interim) |

| v0.3 / v0.3.1 gradient-preferred IHFC | Shipped — **legacy fallback only** under v0.4 |

| v0.4 Data Depth thermal spine | **Live** (Stanford + SMU + substations) |

| Nullable TexNet/PAD-US + residual chrome | **Live** (NOW fixes) |

| Real RRC Digital Map density | SOON — SMU proxy buyer-accepted for STOP |
| PAD-US Fee GAP1–2 frac>1% | **Live** (44 friction counties) |

| Dual panel: model T + measured control | SOON |

| Stress / offtake as opportunity knobs | Deferred (not frozen in v0.4) |



---



## Calibration



Review top/bottom ~15 counties (“not silly”), confirm model labels everywhere, keep residual risk loud until risk layers are complete or explicitly Unknown. Change thermal spine or weights only with a methodology version bump.


