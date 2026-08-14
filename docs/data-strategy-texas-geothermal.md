# Texas Next-Gen Geothermal Data Strategy

**Audience:** Solo founder of a Texas / ERCOT next-gen geothermal opportunity-intelligence MVP  
**Date:** 2026-08-14  
**Status:** Decision document (commercial usefulness over academic completeness)  
**Product context:** Phase 1–2 thin slice already shipped — IHFC gradient/heat-flow + HIFLD transmission + county screening + point/AOI evidence. Scoring v0.3.1. Gradient-primary cohort ≈ **10 counties**.

---

## Blunt opening

**Current thermal evidence is not commercially sufficient.**

An IHFC-only thermal stack that yields ~10 counties with usable geothermal-gradient control, and forces most of Texas onto heat-flow fallback, cannot defend a statewide next-gen shortlist to a serious developer. Buyers will ask: *temperature at what depth?* and *how many BHT / well controls support that?* Sparse global heat-flow points do not answer either.

**Lead with temperature-at-depth (T@depth) and denser BHT / well-temperature control.** Keep IHFC as citation and QC context. Keep HIFLD as an infrastructure proximity proxy. Do not deepen automation, parcels, or layer sprawl until the thermal spine is commercially credible.

This platform’s Phase 1 job is **regional screening / early prospect shortlisting** — not resource assessment, not drill targeting, not NPV.

---

## 1. Opportunity Screening Framework

Industry diligence generally progresses as:

| Stage | Question | Typical evidence | This platform |
|-------|----------|------------------|---------------|
| **Regional screening** | Where in Texas should we even look? | Gradient / T@depth, basin context, grid proximity, coarse constraints | **Phase 1 target (now)** |
| **Prospect identification** | Which corridors / plays deserve a shortlist? | Denser BHT, play fairways, stress, well density, offtake hints | **Data Depth / enhanced screening (next)** |
| **Site evaluation** | Is this AOI worth field diligence? | Local wells, land/lease context, substations, flood/protected flags | Phase 2 site tools (thin AOI evidence already started) |
| **Resource assessment** | What temperature / productivity / reservoir risk? | Corrected BHT programs, conductivity, logs, stimulation analogs | **Out of scope for MVP scoring** |
| **Project development** | Can we interconnect, permit, finance, drill? | Interconnection studies, offtake, title, economics | **Not this product** |

**Lock:** This platform Phase 1 targets **regional screening and early prospect shortlisting**. Scores are relative Texas focus indices with separate confidence — not heat-in-place, not reservoir quality, not interconnection feasibility.

### Multi-lens implications

| Lens | What “good screening” means |
|------|-----------------------------|
| Geothermal geologist | T@depth or gradient with stated depth; control density; play context; honesty about BHT bias |
| Project developer | Shortlist that changes leasing / partner outreach this quarter; infra + offtake adjacency |
| Geospatial data scientist | Stable CRS, reproducible joins, versioned sources, no silent metric blending |
| Energy infrastructure analyst | Grid proximity ≠ interconnection; plants/substations/queue as context, not pseudo-NPV |
| Startup CTO | Solo-dev ingestible public data first; paid Enverus-class only when public path fails commercially |

---

## 2. Top 25 Candidate Datasets

Scores are **next-gen Texas screening value** (not academic prestige). Ease = solo-founder ingest difficulty (Easy / Medium / Hard). Confidence = trust that the dataset, as typically used, supports an explainable screening claim without false precision.

| # | Dataset name | Owner | Source URL | Coverage | Resolution | Public/Paid | Update frequency | Ease | Relevance 1–10 | Confidence 1–10 |
|---|--------------|-------|------------|----------|------------|-------------|------------------|------|----------------|-----------------|
| 1 | IHFC GHFDB 2024 (in product) | IHFC / GFZ | https://doi.org/10.5880/fidgeo.2024.014 · https://www.ihfc-iugg.org/products/global-heat-flow-database/data | Global (sparse TX) | Point measurements | Public (CC BY 4.0) | Periodic releases (~annual–multi-year) | Easy | 6 | 7 |
| 2 | Stanford Thermal Earth Model (GDR 1592) | Stanford / GDR | https://gdr.openei.org/submissions/1592 · https://stm.stanford.edu | CONUS | ~18 km² cells; T / k / HF at 0–7 km (1 km steps) | Public | Model vintage (2024); not live | Medium | 9 | 6 |
| 3 | SMU NGDS / GDR 1704 heat flow + BHT | SMU Geothermal Lab / GDR | https://gdr.openei.org/submissions/1704 | Nationwide (TX-rich historically) | Well / site points + supporting docs | Public (archive; SMU node offline) | Static archive (migrated 2026) | Medium–Hard | 10 | 7 |
| 4 | HIFLD Electric Power Transmission Lines (in product) | HIFLD / DHS community | https://hifld-geoplatform.opendata.arcgis.com/datasets/electric-power-transmission-lines | U.S. | Line features (~69–765 kV) | Public | Irregular updates | Easy | 8 | 6 |
| 5 | HIFLD Electric Substations | HIFLD / DHS community | https://hifld-geoplatform.opendata.arcgis.com/datasets/electric-substations | U.S. | Point facilities (≥~69 kV emphasis) | Public | Irregular updates | Easy | 7 | 6 |
| 6 | RRC Digital Map — well layers | Railroad Commission of Texas | https://www.rrc.texas.gov/resource-center/research/data-sets-available-for-download/ | Texas (by county) | Well surface/bottom locations (shapefile) | Public | Twice weekly | Medium | 8 | 8 |
| 7 | TexNet earthquake catalog | BEG / UT Austin | https://catalog.texnet.beg.utexas.edu | Texas (2017–present) | Event points (mag, loc, time) | Public | Near-continuous | Easy–Medium | 6 | 8 |
| 8 | Lund Snee / Zoback NA stress (USGS) | USGS / Lundstern & Zoback | https://doi.org/10.5066/P90LS6QF | North America | SHmax points + Aϕ raster | Public | Release vintage (2022–24) | Medium | 8 | 7 |
| 9 | PAD-US protected areas | USGS GAP | https://www.usgs.gov/programs/gap-analysis-project/science/pad-us-data-download · https://doi.org/10.5066/P96WBCHS | U.S. | Polygon inventory (v4.1) | Public | Periodic major versions | Medium | 5 | 8 |
| 10 | TWDB major aquifers | Texas Water Development Board | https://www.twdb.texas.gov/mapping/gisdata.asp | Texas | Polygon aquifers (~1:250k heritage) | Public | Infrequent | Easy | 4 | 7 |
| 11 | EIA Form 860 plants | U.S. EIA | https://www.eia.gov/electricity/data/eia860/ | U.S. | Plant / generator tables (≥1 MW) | Public | Annual (+ monthly 860M) | Easy–Medium | 7 | 8 |
| 12 | USGS Quaternary Fault and Fold Database | USGS | https://www.usgs.gov/programs/earthquake-hazards/faults · https://earthquake.usgs.gov/cfusion/qfault/ | U.S. | Mapped Quaternary structures | Public | Periodic | Medium | 5 | 7 |
| 13 | Geologic Database of Texas / TNRIS | USGS / TNRIS / BEG heritage | https://feature.tnris.org/arcgis/rest/services/Geologic_Database/GeologicDatabaseofTexas/MapServer | Texas | 1:250,000 geology | Public | Static compilation | Medium | 6 | 7 |
| 14 | ERCOT Generator Interconnection Status (GIS) report | ERCOT | https://www.ercot.com/mp/data-products/data-product-details?id=PG7-200-ER | ERCOT | Tabular queue / milestones (xlsx) | Public (portal) | Monthly | Medium | 7 | 7 |
| 15 | NREL Geothermal Prospector / EGS layers | NREL | https://www.nrel.gov/geothermal/data-tools · https://maps.nrel.gov/?da=geothermal-prospector | U.S. | Favorability / resource GIS layers | Public | Tool retired; data still cited/downloadable | Medium | 6 | 5 |
| 16 | BEG OFM306 Gulf Coast geothermal | BEG / UT Austin | https://store.beg.utexas.edu/publications/open-file-map/ofm0306 | Onshore TX Gulf Coast | 1:900,000 T@3 km + depth-to-150°C (+ rasters/shapefiles) | **Mixed / store access — paywall or purchase friction risk** | Product vintage (2025) | Medium | 9 | 7 |
| 17 | FEMA National Flood Hazard Layer (NFHL) | FEMA | https://www.fema.gov/flood-maps/national-flood-hazard-layer | U.S. (effective NFHL) | Flood zones / panels | Public | Continuous effective updates | Medium–Hard | 3 | 8 |
| 18 | University Lands GIS / maps | University Lands (UT System) | https://universitylands.utsystem.edu/Resources/Maps · https://universitylands.utsystem.edu/Resources/GIS | PUF lands (W TX focus) | Lease / survey GIS + viewer | Public viewers; GIS packs limited | Monthly-ish for GIS packs | Medium | 6 | 7 |
| 19 | GLO land / lease viewers | Texas General Land Office | https://www.glo.texas.gov/maps/land-lease-mapping-viewer · https://gisweb.glo.texas.gov/glomapjs/index.html | Texas PSF / GLO lands | Surveys, leases, wells (viewer + some downloads) | Public viewer; downloads vary | Ongoing | Medium | 6 | 6 |
| 20 | World Stress Map | WSM Project (GFZ) | https://www.world-stress-map.org/download/ · https://doi.org/10.5880/WSM.2025.001 | Global | SHmax / regime indicators | Public | Periodic releases (2025 DB) | Easy–Medium | 5 | 6 |
| 21 | TWDB Groundwater Database wells | TWDB | https://www3.twdb.texas.gov/apps/waterdatainteractive/groundwaterdataviewer · https://txwaterdatahub.org/dataset/groundwater-database | Texas (selected wells) | Water-well points + levels/quality | Public | Ongoing | Medium | 4 | 6 |
| 22 | USGS State Geologic Map Compilation (SGMC) | USGS | https://doi.org/10.5066/P1A3DQZK · https://www.usgs.gov/data/state-geologic-map-compilation-sgmc-geodatabase-conterminous-united-states | CONUS | State geology compilation polygons | Public | Infrequent (GeMS update 2026) | Medium | 5 | 7 |
| 23 | SMU temperature-at-depth maps | SMU Geothermal Lab | https://www.smu.edu/dedman/academics/departments/earth-sciences/research/geothermallab/datamaps | U.S. / regional products | Mapped T@depth products (mixed digital access) | **Mixed access** (maps public; digital layers uneven) | Historical + project-based | Hard | 9 | 6 |
| 24 | Historic geopressured fairway docs (digitize) | BEG (Bebout et al.) + SMU derivatives | e.g. BEG RI/GC series via https://store.beg.utexas.edu/ · SMU summaries | TX Gulf Coast fairways | Report maps / fairway polygons (need digitizing) | Public PDFs / store; **vectorization DIY** | Static legacy | Hard | 7 | 5 |
| 25 | Enverus / IHS-class BHT & well temps (contrast) | Enverus / S&P / similar | Vendor portals (commercial) | Dense TX O&G well coverage | Well BHT / logs / attributes | **Paid** | Vendor cadence | Hard (license + ETL) | 10 | 8 |

### Notes on scores (no fake precision)

- **IHFC relevance 6:** Citable and already shipped, but TX density is too thin for commercial statewide ranking alone.
- **Stanford 9 / confidence 6:** Highest public T@depth path for statewide coverage; model-interpolated — treat as opportunity prior with explicit model uncertainty, not measured truth.
- **SMU/GDR 1704 relevance 10:** Best public denser thermal control path for Texas narrative; archive packaging and QC still cost effort.
- **OFM306 relevance 9:** Decision-grade regional T@depth for Gulf Coast — but access friction and partial geography; do not bet the whole MVP on a paywalled store SKU.
- **NREL confidence 5:** Useful national context; older EGS favorability can overclaim for TX next-gen without local BHT grounding.
- **Enverus relevance 10 / paid:** Commercial ceiling for BHT density; contrast row — acquire only after public densification fails buyer trust.

---

## 3. Dataset Ranking

### Top 10 — MVP data-depth upgrade (**add NOW**)

Goal: make the existing county / point / AOI product **useful to a paying developer**, not merely honest.

| Rank | Dataset | Why now |
|------|---------|---------|
| 1 | **Stanford Thermal Earth Model (GDR 1592)** | Statewide T@depth spine; answers “hot at what depth?” without waiting on Enverus |
| 2 | **SMU NGDS / GDR 1704 (TX BHT / heat-flow subset)** | Dense measured/corrected thermal control; lifts confidence off ~10-county gradient trap |
| 3 | **RRC Digital Map wells** | Well density / drilling activity proxy; pairs with BHT for “where evidence exists” |
| 4 | **HIFLD substations** | Upgrades infra from lines-only to interconnection-adjacent context |
| 5 | **EIA Form 860 plants** | Offtake / colocation signal (industrial load, existing generation) |
| 6 | **Lund Snee / Zoback NA stress** | EGS / stimulation play discriminator; publicly cited industry language |
| 7 | **BEG OFM306 (if obtainable without killing timeline)** | Gulf Coast T@3 km / depth-to-150°C — high signal where coverage exists |
| 8 | **ERCOT GIS report (xlsx)** | Queue / interconnection heat as offtake pressure — tabular, not GIS sprawl |
| 9 | **TexNet catalog** | Induced-seismicity risk flag for EGS-heavy narratives (confidence / caution, not opportunity juice) |
| 10 | **PAD-US (TX clip)** | Cheap hard-constraint layer for “don’t shortlist into parks/wilderness” |

**Still keep in product:** IHFC (QC / citation) + HIFLD lines (infra baseline).

### Top 10 — Phase 2 enhanced screening (broader)

After thermal spine + minimal infra/offtake upgrades:

| Rank | Dataset | Role |
|------|---------|------|
| 1 | SMU T@depth map products (digital where available) | Cross-check Stanford; Texas-branded thermal narrative |
| 2 | Geologic Database of Texas / TNRIS | Play / basin / lithology context for explainability |
| 3 | University Lands GIS | W TX PUF land opportunity corridors |
| 4 | GLO land/lease viewers + downloadable PSF layers | State-land adjacency research (not title certainty) |
| 5 | Historic geopressured fairway digitization | Gulf Coast play-aware priors for open-loop / hybrid stories |
| 6 | USGS Quaternary faults | Structure / hazard context (secondary) |
| 7 | World Stress Map | Sparse fill where NA stress is thin |
| 8 | TWDB major aquifers + GWDB wells | Water / shallow well context; mostly dossier, not score |
| 9 | NREL EGS / prospector remnants | National benchmark overlays (carefully labeled) |
| 10 | Enverus/IHS BHT (if revenue justifies) | Density leap for site diligence and paid tiers |

### Avoid initially (with why)

| Dataset / temptation | Why avoid now |
|----------------------|---------------|
| **FEMA NFHL as score input** | Site diligence noise; flood zones rarely change regional geothermal shortlists |
| **Full statewide CAD / parcels** | Title product distraction; Phase 2+ research pointers already exist |
| **Enverus before public T@depth/BHT path** | Cost, ToS, ETL; buy only when public stack fails sales |
| **DIY BHT→gradient corrections at scale** | False precision; methodology already forbids silent DIY corrections |
| **World Stress Map over Lund Snee/Zoback** | NA-focused USGS release is enough for TX screening |
| **TWDB aquifers in ScreeningScore** | Water story ≠ next-gen heat opportunity |
| **USGS SGMC as primary geology** | Prefer Texas GDT; SGMC is coarser national fallback |
| **NREL favorability as primary thermal** | Opaque composite; use as context only |
| **Full ERCOT GIS redistribution** | ToS / redistribution risk already deferred for public MVP |
| **3D volumes / full log libraries** | Phase 4; does not fix regional shortlist credibility first |

---

## 4. Scoring Methodology Inputs

For the datasets that actually move screening decisions:

| Dataset | Decision signal | Why it matters | Opportunity / Confidence / Both / Neither |
|---------|-----------------|----------------|-------------------------------------------|
| Stanford T@depth | Predicted T at 3–7 km (play-selected depth) | Speaks developer language; fills counties with no IHFC gradient n | **Opportunity** (primary thermal prior); secondary model-uncertainty into **Confidence** |
| SMU/GDR 1704 BHT/HF | Local measured/corrected temps & HF density | Grounds ranks; raises trust where wells exist | **Both** (opportunity if aggregated carefully; confidence via n / QC flags) |
| IHFC GHFDB | Sparse gradient / HF points | Citation + QC; not enough alone | **Both** but **weak opportunity** statewide; better as **Confidence** / validation |
| HIFLD transmission | Distance to HV lines | Early infra filter | **Opportunity** (proxy only) |
| HIFLD substations | Distance / density of substations | Stronger “can we talk interconnection?” cue | **Opportunity** (still proxy) |
| EIA 860 plants | Proximity to large plants / industrial hosts | Offtake / colocated load narrative | **Opportunity** (light weight) or dossier-only |
| RRC wells | Well density / recent activity | Proxies data richness & O&G ops familiarity | Mostly **Confidence**; weak opportunity for co-location plays |
| NA stress (Lund Snee/Zoback) | SHmax azimuth / Aϕ regime | EGS vs closed-loop play filter | **Opportunity** (play-aware) + **Confidence** if sparse |
| TexNet | Event density / magnitude near AOI | Induced seismicity caution | Primarily **Confidence** / risk flag — do **not** juice opportunity |
| PAD-US | % protected / GAP status | Hard exclusion or demotion | **Neither** as opportunity juice — **constraint / gate** |
| ERCOT GIS report | Queue congestion / new gen interest by zone | Market heat | Dossier / soft **Opportunity** context — not a thermal substitute |
| OFM306 | T@3 km / depth to 150°C (Gulf Coast) | Regional decision map aligned with industry | **Opportunity** where covered |
| Enverus BHT | Dense commercial well temps | Site-grade densification | **Both** (paid path) |

**Rule:** Never blend opportunity and confidence into one number. Never treat model T@depth as if it were measured BHT. Never claim interconnection from HIFLD distance.

---

## 5. Competitive Landscape

What next-gen players and Texas-relevant institutions **publicly emphasize** (not private subsurface models):

| Actor | Public emphasis (repeated) | Implication for this product |
|-------|----------------------------|------------------------------|
| **Fervo Energy** | Depth + temperature; horizontal wells; stimulation / EGS; fiber/sensing; grid-scale offtake (e.g. data-center / utility PPAs); drilling performance | Buyers expect **T@depth** and stress/stimulation context, not heat-flow choropleths |
| **Sage Geosystems** | Texas footprint; pressure/thermal storage + power; reuse of wells / existing energy sites; offtake partnerships | **Existing wells + grid/site host** matter early |
| **XGS Energy** | Closed-loop / solid-state heat extraction; “anywhere hot rock”; less dependence on permeability | Closed-loop screening still needs **temperature vs depth**, not hydrothermal surface shows |
| **Eavor** | Closed-loop multilaterals; deep drilling; European pilots; geology-agnostic heat mining claims | Same: depth/T economics > classic hydrothermal markers |
| **HotRock (BEG)** | Resource mapping in sedimentary basins; EGS / closed-loop / storage; play-fairway GIS; techno-economics; grid integration | Academic/consortium bar for “serious Texas geothermal” — **maps + economics language** |
| **GEO / related TX programs & studies** | Gulf Coast gradients, BHT densification, county/fairway assessments, O&G data reuse | Reinforces **BHT-first Texas story** |

### Repeated industry indicators (cluster)

1. **Temperature at depth** (not surface heat flow alone)  
2. **Existing well control / O&G analog density**  
3. **Stress / stimulation feasibility** (especially EGS)  
4. **Grid proximity and interconnection reality**  
5. **Offtake / colocated demand** (load growth, plants, industrials, data centers)  
6. **Land access pathways** (fee / state / PUF) — later than thermal for screening MVP  

If the product cannot speak to (1)–(2) with denser evidence, technical buyers will bounce — regardless of UI polish.

---

## 6. Data Acquisition Strategy

Mapped to product phases. **Data Depth comes before automation.**

### Phase 1 (30–45d) — **already done**

| Item | Status | Gap |
|------|--------|-----|
| Texas counties (TIGER) | Done | — |
| IHFC thermal (gradient preferred / HF fallback) | Done | **~10 gradient counties — commercially thin** |
| HIFLD transmission proximity | Done | Lines only; no substations / plants |
| County ScreeningScore + confidence | Done | Thermal spine weak |
| Point / AOI evidence (thin) | Done | Same thermal limitation at click scale |
| Land = outbound research pointers | Done | Correctly not parcels |

**Phase 1 verdict:** Ship succeeded as an honesty MVP. It did **not** close the commercial thermal gap.

### Phase 2 enhanced screening / **Data Depth** — **NEXT (before automation)**

| Priority | Dataset | Required / nice | Complexity | Outcome |
|----------|---------|-----------------|------------|---------|
| P0 | Stanford T@depth → county (+ point sampling) | **Required** | Medium | Statewide thermal language |
| P0 | SMU/GDR 1704 TX extract → control density + optional local means | **Required** | Medium–Hard | Confidence + measured densification |
| P0 | Methodology bump: thermal = T@depth prior ± BHT control; IHFC demoted to QC | **Required** | Low–Medium | Trust narrative |
| P1 | HIFLD substations + EIA 860 proximity | **Required** | Easy–Medium | Infra/offtake depth |
| P1 | Lund Snee/Zoback stress as play factor or badge | **Required** for EGS-aware claims | Medium | Play discrimination |
| P1 | RRC well density for confidence | **Required** | Medium | “Evidence exists here” |
| P2 | TexNet risk flag | Nice → soft required for EGS | Easy–Medium | Risk honesty |
| P2 | PAD-US demotion/gate | Nice | Medium | Constraint hygiene |
| P2 | ERCOT GIS xlsx summary by region | Nice | Medium | Market heat context |
| P2 | OFM306 if access is clean | Nice (high value) | Medium | Gulf Coast boost |
| Avoid | Parcels, NFHL scoring, Enverus, full geology ontology | Defer | — | Protect solo-dev focus |

### Phase 3 — prospect intelligence / automation

Only after Data Depth is trusted:

| Item | Required / nice | Complexity |
|------|-----------------|------------|
| Versioned pipelines + watchlists when thermal/infra inputs change | Required | Hard |
| Rule-based prospect generation (thermal P80 + infra + confidence) | Required | Medium |
| GLO / University Lands adjacency in dossiers | Nice | Medium |
| Digitized geopressured fairways as play priors | Nice | Hard |
| Paid BHT densification for premium tier | Nice (revenue-gated) | Hard |
| Alerts without accounts noise | Careful | Medium |

**Do not automate a weak thermal spine.** Automation amplifies wrong rankings.

---

## 7. Final Recommendation

### A. Best stack (credible Texas next-gen screening)

1. **Thermal opportunity:** Stanford T@depth (play-selected depth band) + SMU/GDR BHT densification where available  
2. **Thermal confidence:** BHT/IHFC/RRC control counts + distance-to-nearest control + model vs measured flag  
3. **Infra opportunity:** HIFLD lines **and** substations  
4. **Offtake context:** EIA 860 (+ optional ERCOT queue summary)  
5. **Play factor:** Lund Snee/Zoback stress (EGS-weighted)  
6. **Constraints:** PAD-US (+ TexNet caution for EGS)  
7. **Keep:** IHFC as QC citation; county unit until site scores exist  

### B. Smallest defensible score stack

Minimum commercially non-embarrassing formula inputs:

- **Opportunity:** T@depth (Stanford) + transmission/substation proximity  
- **Confidence (separate):** local BHT/IHFC/RRC control density  

Everything else is badge, dossier, or gate — not required to ship Data Depth.

### C. Three highest signal-to-effort

1. **Stanford T@depth CONUS grids → Texas county means**  
2. **HIFLD substations + EIA 860 plant proximity** (fast infra/offtake upgrade)  
3. **SMU/GDR 1704 Texas BHT subset for confidence (+ optional local thermal)**  

### D. Five acquire first

1. Stanford GDR 1592 tabulated / gridded T@depth  
2. SMU/GDR 1704 archives (filter Texas)  
3. HIFLD substations  
4. EIA Form 860 plant table  
5. USGS Lund Snee/Zoback stress release  

*(Parallel track: RRC well layers for density; OFM306 if store access is quick.)*

### E. Recommended scoring framework (sketch)

Keep **explainable heuristics**. Separate **opportunity** and **confidence**. Be **play-aware**.

```text
# Opportunity (example weights — freeze only after calibration on TX counties)
ScreeningOpportunity ≈
    0.50 * S_thermal_Tdepth      # T at play depth (e.g. 3–5 km closed-loop; 3–6 km EGS)
  + 0.25 * S_infra               # min(line, substation) proximity proxy
  + 0.15 * S_play                # stress favorability for EGS; near-neutral for closed-loop
  + 0.10 * S_offtake             # plant / load adjacency (soft)

# Confidence (never multiply into a fake “truth score” without labeling)
ScreeningConfidence ← f(
    n_BHT_local,
    n_IHFC_local,
    well_density_RRC,
    measured_vs_model_flag,
    texnet_caution_flag
)
```

**Play-aware rules (sketch):**

| Play posture | Thermal | Stress | Seismicity |
|--------------|---------|--------|------------|
| Closed-loop / AGS-leaning | Emphasize T@depth | Low weight | Low weight |
| EGS-leaning | T@depth + stimulable regime | Higher weight on Aϕ / SHmax consistency | TexNet demotes confidence / flags risk |
| Hybrid / unknown | Default closed-loop-safer weights; show EGS badges separately | — | — |

**Honesty constraints:**

- Label model T@depth vs measured BHT  
- Do not DIY statewide BHT corrections in v1 Data Depth  
- Do not call HIFLD “interconnection”  
- Do not score parcels or mineral title  
- Bump `methodology_version` on every thermal spine change  

---

## Director judgment (now / enhance / defer / reject)

| Decision | Item |
|----------|------|
| **Build now** | Stanford T@depth + SMU/GDR BHT densification + substations/plants + methodology rewrite |
| **Enhance soon** | Stress play factor; RRC density; TexNet flag; PAD-US gate; ERCOT queue summary |
| **Defer** | Enverus, parcels, NFHL-in-score, full geology ontology, automation/alerts, 3D |
| **Reject** | Treating IHFC-only / ~10 gradient counties as commercially sufficient; black-box ML suitability as MVP core |

---

## One-line mandate

**Replace “sparse global heat-flow ranking” with “Texas T@depth + denser BHT control,” keep infra as a proxy, keep confidence separate — then, and only then, automate.**

---

## 8. Data storage, caching, and refresh cadence

### Problem

Users need **fast Explorer loads**. Source downloads (IHFC XLSX, Stanford grids, SMU archives, RRC shapefiles, PAD-US) are **slow, large, and fragile**. Live browser fetches of upstream APIs would make the product feel broken and risk ToS / rate limits.

Users also need **fresh-enough** data. Shipping frozen JSON forever creates silent staleness (especially RRC wells, TexNet, EIA plants, HIFLD).

**Goal:** Never download raw sources at request time. Cache offline. Refresh on a **preset cadence**. Serve only slim, precomputed assets to the browser. Show **vintages** so “cached” ≠ “lying.”

### Options reviewed

| Option | How it works | Pros | Cons | Verdict |
|--------|--------------|------|------|---------|
| **A. Static bake (current)** | Python ETL → `web/public/data/*` → GitHub Pages | Instant UX; no backend; reproducible | Manual refresh unless automated; repo size grows | **Keep as delivery path** |
| **B. Scheduled ETL (CI cache)** | GitHub Actions on cron downloads → process → commit or upload artifact | Preset freshness; still static UX | CI minutes; secrets; careful with large binaries | **Adopt for Data Depth** |
| **C. Object store + CDN** | Raw/processed on S3/R2; Pages serves app + `meta.json` pointing to CDN URLs | Scales large assets; keeps git small | Extra ops; CORS; still need ETL | **SOON if assets > ~50–100 MB** |
| **D. Live upstream from browser** | MapLibre / fetch hits HIFLD, ERCOT, GDR live | Always “fresh” | Slow; brittle; ToS; no offline; kills UX | **Reject** |
| **E. App DB (PostGIS/Supabase)** | Query server per session | Flexible AOI | Solo-dev ops; cold starts; contradicts static MVP | **Defer to Phase 3+ only if needed** |
| **F. Browser HTTP / SW cache** | Cache `prospects.json` on repeat visits | Faster returns | Stale client copy; version skew | **Optional polish**; always key off `meta.json` / methodology version |

### Recommended architecture (Data Depth → Phase 3)

```text
Upstream sources (slow)
        │
        ▼  scheduled / manual download (never in browser)
 data/raw/          ← gitignored cache of source files + download stamps
        │
        ▼  Python ETL (scoring/)
 data/processed/    ← derived tables, county features, grids (optional commit)
        │
        ▼  export slim client contract
 web/public/data/   ← prospects.json, geojson, thermal_points, infra_grid, meta.json
        │
        ▼
 GitHub Pages (or CDN)  ← user loads only these; milliseconds
```

**Browser never talks to GDR / RRC / HIFLD / TexNet directly for scoring.**

### Storage layout (locks)

| Path | Contents | Git? | Role |
|------|----------|------|------|
| `data/raw/<source>/` | Upstream downloads | **No** (gitignore) | Offline cache |
| `data/raw/_manifest.json` | Per-source: URL, retrieved_at, checksum, license note | **Yes** (small) | Freshness audit |
| `data/processed/` | County features, joins, intermediate grids | Optional | Rebuild inputs |
| `web/public/data/` | Client payloads only | **Yes** (or CDN) | UX delivery |
| `web/public/data/meta.json` | methodology_version, weights, **per-layer vintages**, next_refresh_hint | **Yes** | Honesty + cache busting |

### Refresh cadence (preset)

Cadence is **ETL schedule**, not browser TTL. Conservative defaults; refresh early when a source ships a major release.

| Layer / source | Typical upstream change | Recommended ETL cadence | Notes |
|----------------|-------------------------|-------------------------|-------|
| Stanford T@depth (GDR 1592) | Rare (model vintage) | **On release / quarterly check** | Static model; bump methodology when swapped |
| SMU/GDR 1704 archive | Static archive | **Once + ad hoc if GDR revises** | Not a live feed |
| IHFC GHFDB | Periodic releases | **On new IHFC release / semi-annual check** | QC citation layer |
| HIFLD lines / substations | Irregular | **Monthly** | Proximity proxy; not CEII |
| EIA Form 860 | Annual (+ 860M) | **After annual release; optional monthly 860M** | Plants context |
| RRC Digital Map wells | ~twice weekly | **Weekly** | Density/confidence; don’t over-fetch |
| TexNet catalog | Continuous | **Weekly aggregate** (daily only if EGS-heavy) | Risk flag, not live UI tickers |
| PAD-US | Major versions rare | **On new PAD-US version / annual** | Constraint gate |
| Stress (Lund Snee/Zoback) | Release vintage | **On new USGS release / annual** | Play badge |
| ERCOT GIS xlsx (if used) | Monthly | **Monthly** (dossier only) | After ToS OK |
| Counties (TIGER) | Annual | **Annual** | Rare rebuild |

**Default Data Depth CI proposal:** one GitHub Actions workflow:

- `schedule: cron` **weekly** (e.g. Sunday 06:00 UTC) for **RRC + TexNet + HIFLD** refresh checks  
- Manual `workflow_dispatch` for full rebuild (Stanford / SMU / IHFC / rescore)  
- **Quarterly** job/reminder: check Stanford, IHFC, PAD-US, EIA annual  

### Freshness UX (required)

Surface in Explorer methodology / detail factors / `meta.json`:

- `methodologyVersion`  
- Per factor: `source`, `vintage` / `retrievedAt`  
- Soft banner only if a **required** layer exceeds SLA (e.g. RRC density > 21 days): “data refresh overdue” — not a hard block  

Users should feel: **fast map, dated evidence** — not live GIS.

### What “cache” means at each layer

| Layer | Cache behavior |
|-------|----------------|
| `data/raw` | Download if missing **or** older than cadence **or** checksum policy says refresh |
| `data/processed` | Rebuild when raw stamp or methodology version changes |
| `web/public/data` | Publish only after successful score; deploy with Pages |
| Browser | HTTP cache OK; bust via deploy hashes and/or `meta.json` version |

### Solo-dev ops rules

1. **No live upstream in the React app** for screening or point/AOI thermal.  
2. Prefer **precomputed grids** (like today’s `infra_grid.json`) over shipping raw HIFLD/RRC to the browser.  
3. Keep raw out of git; keep **manifest + processed client JSON** in git until CDN is justified.  
4. Every refresh writes `retrieved_at` into manifest + factor vintages in `meta.json`.  
5. Methodology version bumps when **formula** changes; vintage updates when **data** refreshes without formula change.  
6. Do not build PostGIS “for freshness” — cadence + static bake solves UX first.

### Phase mapping

| Phase | Storage / refresh posture |
|-------|---------------------------|
| **Now (Data Depth)** | Keep static bake; add `_manifest.json` + documented cadences; weekly GH Action for RRC/TexNet/HIFLD |
| **Soon** | Full scheduled ETL → PR or artifact deploy; CDN if payloads bloat |
| **Phase 3** | Versioned pipelines + alerts when vintages/scores move; alerts watch **published** artifacts, not live APIs |

### Decision lock (for build)

| Decision | Choice |
|----------|--------|
| User-facing delivery | **Precomputed static JSON/GeoJSON** (Pages/CDN) |
| Upstream access | **Offline ETL only** (local + CI) |
| Freshness mechanism | **Preset refresh cadence** + vintages in `meta.json` |
| Live browser downloads of source data | **Reject** |
| Database for MVP Data Depth | **Reject** |
