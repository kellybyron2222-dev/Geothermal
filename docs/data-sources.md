# Data Sources — Phase 1

**Milestone:** 1  
**Retrieved:** 2026-08-13  
**CRS for analysis:** EPSG:3083 (NAD83 / Texas Centric Albers Equal Area)  
**CRS for web:** EPSG:4326 (WGS84)

Transmission choice: **HIFLD** (open / redistributable for public demos). ERCOT GIS is deferred due to redistribution risk for a public GitHub MVP.

Thermal choice: **IHFC Global Heat Flow Database 2024** (citable, open download). GDR/SMU NGDS archive (submission 1704) was preferred historically but direct file URLs were not reliably fetchable at build time.

---

## 1. Texas county boundaries

| Field | Value |
|-------|--------|
| Source | U.S. Census Bureau TIGER/Line Cartographic Boundary Files |
| Product | `cb_2023_us_county_500k` (filter `STATEFP = 48`) |
| URL | https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip |
| License | Public domain (U.S. Government work) |
| Role | Spatial unit |
| Vintage | 2023 |
| Local path | `data/raw/counties/cb_2023_us_county_500k/` |

---

## 2. Thermal proxy (opportunity factor)

| Field | Value |
|-------|--------|
| Source | International Heat Flow Commission (IHFC) |
| Product | Global Heat Flow Database Release 2024 |
| URL | https://www.ihfc-iugg.org/user/downloads/data/R2024/IHFC_2024_GHFDB.xlsx |
| DOI | https://doi.org/10.5880/fidgeo.2024.014 |
| **Primary metric** | Geothermal gradient `T_grad_mean` (°C/km); prefer `T_grad_mean_cor` when present |
| **Fallback metric** | Heat flow `q` (mW/m²) when county has no gradient control |
| License | CC BY 4.0 (per GFZ Data Services) |
| Method | Filter TX points → county mean → prefer gradient for ScreeningScore |
| Gate | Drop gradient points outside ~5–150 °C/km; heat flow outside 0–300 mW/m² |
| Local path | `data/raw/thermal/IHFC_2024_GHFDB.xlsx` |

---

## 3. Transmission (opportunity factor)

| Field | Value |
|-------|--------|
| Source | Homeland Infrastructure Foundation-Level Data (HIFLD) |
| Product | Electric Power Transmission Lines |
| Access | ArcGIS FeatureServer query clipped to Texas bbox |
| License | Public HIFLD open data (informational; not for engineering survey) |
| Role | Distance from county representative point to nearest transmission line (km) |
| Label in product | Grid proximity proxy — **not** interconnection feasibility |
| Why not ERCOT | Redistribution / ToS risk for public GitHub hosting |
| Local path | `data/raw/transmission/hifld_tx_transmission.geojson` |

---

## 4. Confidence (not opportunity)

| Field | Value |
|-------|--------|
| Source | IHFC heat-flow control points in each county |
| Role | Count of heat-flow observations per county (`well_count` / thermal_n) |
| Rationale | Evidence density for the thermal factor — not O&G reservoir quality |
| Fallback | `Unknown` / zero count if no points |

---

## Hard gates

1. Do not commit `data/raw/**` (gitignored).  
2. Prefer HIFLD over ERCOT for Phase 1 public repo.  
3. One thermal product only — no silent BHT blending.
