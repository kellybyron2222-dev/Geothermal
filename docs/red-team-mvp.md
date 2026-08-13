# Red Team Review & True MVP (Authoritative)

**Status:** Supersedes prior Phase 1 scope where this document conflicts.  
**Date:** 2026-08-13  
**Constraint:** Solo founder · ~30–45 days · public GitHub MVP · no application code in this doc  

Related updates: [MVP.md](MVP.md) · [scoring-methodology.md](scoring-methodology.md) · [architecture-draft.md](architecture-draft.md) · [prd.md](prd.md) · [tasks.md](tasks.md)

---

# PART 1 — Red Team Review

Assumption of this review: **the current plan is still too large.**

---

## 1. Scope creep

| Problem | Why | Severity | Solution |
|---------|-----|----------|----------|
| “Next-gen open *and* closed loop, colocated *or* standalone, modular *or* utility” reads like four products | Multiplies messaging, scoring caveats, and buyer confusion | **High** | Ship **one** framing: *Texas next-gen geothermal regional screening*. Note open/closed only in methodology FAQ. |
| Dual surfaces: ranked list *and* full map *and* dataset exploration | Map+layers become the product; list gets neglected | **High** | One screen: list primary, choropleth secondary, **no layer explorer** |
| Secondary “evaluate location” workflow | Pulls toward AOI/dossier (Phase 2) | **Medium** | County name filter on the same page only—not a second product |
| Confidence model with 4 inputs + opportunity with 3 factors | Too many knobs before any user validation | **High** | **2 opportunity factors** + **1 simple confidence proxy** |
| Architecture offers Next + FastAPI + PostGIS *and* static escape hatch | Decision paralysis; solo-dev builds the heavy path | **High** | **Static-only Phase 1.** No API server. No PostGIS. |
| “Explore supporting datasets and infrastructure context” in original workflow | Classic GIS trap | **Critical** | Remove. Sources are citations, not interactive layers. |
| Roadmap language (parcels, 3D, reservoir) leaking into MVP mental model | Premature abstractions in data model/UI | **Medium** | County JSON only; no “site” or “parcel” entities |

---

## 2. Unnecessary MVP features

| Feature | Why cut | Severity | Solution |
|---------|---------|----------|----------|
| Toggleable wells / transmission on map | Browser death + weeks of cartography | **High** | Citations + methodology only |
| Place search (geocoder) | Extra dependency; county filter is enough | **Medium** | Client-side county filter |
| Separate `/zones/[id]` route | Extra routing/state for little gain | **Low–Med** | Detail **panel** on one page |
| Dual thermal inputs (heat-flow *and* BHT blending) | Incompatible physics; silent blends destroy trust | **Critical** | **One** thermal source for score |
| Well density as opportunity weight (0.25) | “More wells = better prospect” is scientifically wrong for next-gen | **Critical** | Wells feed **confidence only**, not attractiveness |
| Substations + lines + plants | Acquisition and join complexity | **High** | **One** infra metric: distance to transmission (or km of line in county) |
| `/about` page, polish branding system | Not needed for GitHub MVP | **Low** | README + one-line header |
| Methodology as rich interactive app | Overkill | **Low** | Static `/methodology` markdown-equivalent page |
| FastAPI read endpoints | Zero users need dynamic queries for 254 counties | **High** | `prospects.json` + `prospects.geojson` |

---

## 3. Weak product assumptions

| Assumption | Challenge | Severity | Solution |
|------------|-----------|----------|----------|
| Developers will trust a county score | Counties are not prospects; sophisticated buyers may dismiss it | **High** | Call units **“screening counties”**, not “prospects.” Copy: regional prioritization aid, not drill targets. |
| Discovery-first is what buyers pay for | Many already “know” basins; they want site diligence | **Medium** | Accept Phase 1 as **credibility wedge** + waitlist bait; Phase 2 is monetization shape |
| Investors and developers share one MVP | Investors want land/grid narratives developers don’t | **Medium** | Primary user = **geothermal/energy developer** only |
| Explainable score ⇒ willingness to use | Without calibration vs known interest areas, scores look arbitrary | **High** | Manual top/bottom 15 review notes in release; publish limitations loudly |
| ERCOT colocation is always good | Congested corridors can be *worse* for interconnection | **Medium** | Label infra as **“grid proximity proxy — not interconnection feasibility”** |
| 30–45 days includes “talk to 3 developers” | Relationship time is not engineering time | **Medium** | Feedback is success metric, not ship blocker; ship with documented self-critique |

---

## 4. Weak scoring assumptions

| Assumption | Challenge | Severity | Solution |
|------------|-----------|----------|----------|
| Weight 0.45/0.25/0.30 is justified | Uncalibrated; control-as-opportunity is wrong | **Critical** | New default: **Thermal 0.60 / Infra 0.40**; control → confidence |
| Min–max Texas scaling is meaningful | Dominated by outliers and basin artifacts | **Medium** | Winsorize P10–P90 then scale; publish |
| Heat-flow grid ≈ project temperature | Heat flow ≠ temperature at depth; smooth grids hide local truth | **High** | Honest labeling: **“regional thermal proxy”**; never “resource grade” |
| BHT correction “policy” is easy | Proper correction is a research project | **Critical** | **Do not use BHT in opportunity score for v1** |
| Separate fancy confidence formula adds trust | Complex confidence can fake rigor | **Medium** | Confidence = f(well count per county) bands only |
| One score for open and closed loop | Different physics | **Medium** | Don’t claim loop-type optimization; screening only |

---

## 5. Dataset acquisition risks

| Risk | Why | Severity | Solution |
|------|-----|----------|----------|
| ERCOT GIS license / redistribution | May block public GitHub hosting of raw extracts | **Critical** | Confirm license Day 0–2; if hostile, use **HIFLD** or other public transmission for Texas; document |
| RRC well DB size/format hell | Solo-dev black hole | **Critical** | Prefer **pre-aggregated** or sampled public well points; or county-level well counts from a simpler published table if available; cap effort at 5 days then degrade confidence to “unknown” |
| SMU/USGS heat-flow access & citation | Format (raster vs points), CRS, terms | **High** | Pick **one** published dataset in Milestone 1; hard deadline |
| Mixing vintages | Silent obsolescence | **Medium** | `data_vintage` fields required |
| No “known good” validation set | Can’t tell if ranks are nonsense | **High** | Hand-build 10 “expected interesting” / 10 “expected dull” counties for sanity check |

---

## 6. Technical risks

| Risk | Why | Severity | Solution |
|------|-----|----------|----------|
| Geospatial rabbit hole (CRS, overlays, tiles) | Burns the calendar | **High** | Counties only; WGS84 display; one projected CRS for distance |
| Building PostGIS “for later” | Ops tax with no Phase 1 need | **High** | Files on disk → static host |
| Next.js + MapLibre hydration pain | Easy to lose days | **Medium** | Prefer **Vite + React** SPA or even static; MapLibre on client only |
| Raster zonal stats unfamiliarity | Blocks thermal factor | **High** | Prefer **vector/point heat-flow** if available; else one simple zonal mean script with a tutorial path |
| Reproducibility without raw data in git | Others can’t rebuild | **Medium** | Script + documented download URLs; commit **processed** outputs only |

---

## 7. Product risks

| Risk | Why | Severity | Solution |
|------|-----|----------|----------|
| Ships as pretty GIS | Fails thesis | **Critical** | Acceptance test: user can explain ranks without legend |
| Overclaim language (“prospect”, “resource”) | Credibility death with domain experts | **Critical** | Glossary: screening score ≠ resource assessment |
| No differentiation vs opening SMU PDF + ERCOT map | Why use this? | **High** | Value = **synthesis + rank + explanation in one place**—keep that ruthless |
| Building for researchers who star repos but don’t buy | Wrong learning | **Medium** | CTA: “Request walkthrough” aimed at developers |
| County grain too coarse to be useful | “So what?” | **High** | Position as **first filter** before desk GIS; Phase 2 goes finer |

---

## 8. Low value / high complexity features

| Feature | Value | Complexity | Verdict |
|---------|-------|------------|---------|
| Interactive well dots | Low | High | **Cut** |
| Fault overlays | Low–Med | High | **Cut** |
| Hot springs | Low | Med | **Cut** |
| Power plants | Med | Med | **Cut** |
| Substations | Med | Med–High | **Cut** |
| Geocoder search | Low | Med | **Cut** |
| FastAPI + PostGIS | Low (Phase 1) | High | **Cut** |
| Dual-loop lenses | Low | Med | **Cut** |
| PDF export | Low | Med | **Cut** |
| Auth | None | High | **Cut** |

---

## 9. Where a solo developer gets stuck

1. **RRC well data wrangling** — cap at 5 days; simplify  
2. **ERCOT license + formats** — decide alternate source early  
3. **Raster processing environment** — avoid if possible  
4. **Map styling perfection** — freeze at “readable choropleth”  
5. **Revisiting weights endlessly** — freeze v0.2 weights until after release  
6. **Premature multi-package monorepo** — one repo, `data/`, `scoring/`, `web/`  

---

# PART 2 — True MVP

## MVP objective

Ship a **public, explainable Texas county screening tool** that helps a geothermal/energy developer produce a **short focus list and an ignore list**, with transparent drivers—in ~30–45 days.

## Core value proposition

**“See which Texas counties look relatively more attractive for next-gen geothermal screening—and why—without assembling your own GIS.”**

Not: resource certification, drill targets, interconnection studies, or a map toy.

## Primary user

**Geothermal or energy project developer** doing early regional prioritization.

(Investors may watch; they do not drive Phase 1 UX.)

## Primary workflow

```text
1. Open the app → Texas counties ranked by Screening Score
2. Scan top ranks + confidence badges
3. Click a county (list or map)
4. Read: score, 2 factors, plain-language drivers, limitations, sources
5. Leave with ~3 focus counties and ~3 ignore counties
```

## Secondary workflow

```text
1. Filter/find a county by name
2. Open the same explanation panel
```

No geocoder. No AOI. No custom score.

## Features included

- Precomputed **Screening Score** for all Texas counties  
- Separate **Confidence** badge (data density)  
- Ranked list (primary UX)  
- County choropleth map (orientation only)  
- Explanation panel (factors, weights, drivers, sources, limitations)  
- Methodology page  
- Static deploy + GitHub README with limitations  

## Features removed (from prior plan)

- Well density as an opportunity factor  
- BHT in the opportunity score  
- Substations, power plants, faults, hot springs  
- Interactive context layers  
- FastAPI, PostGIS, auth  
- Separate zone route as required architecture  
- Open vs closed loop product modes  
- “Explore datasets” workflow  

## Features postponed

| Item | When |
|------|------|
| AOI / site dossier / compare | Phase 2 |
| Parcels / minerals | Phase 2 |
| BHT-enhanced thermal (carefully) | Phase 1.5+ after credibility |
| Substations / plants as factors | Phase 2–3 |
| Accounts, alerts, automation | Phase 3 |
| Grid / finer prospects | Phase 2 |
| 3D / reservoir | Phase 4–5 |
| Backend API + PostGIS | When dynamic AOI requires it |

## Why this is the correct starting point

1. **Decides something** — focus vs ignore — in one session  
2. **Fits Texas next-gen** — thermal proxy + grid proximity, not hydrothermal folklore  
3. **Scientifically safer** — does not pretend well count is reservoir quality; does not “correct” BHT badly  
4. **Solo-shipable** — 2 factors, counties, static files, one UI page  
5. **Preserves the vision** — same explainable-intelligence wedge; finer intelligence layers on later  

---

# PART 3 — Phase 1 Shippable Product (GitHub Release brief)

## Release name

**`v0.1.0` — Texas Next-Gen County Screening**

### Tagline

Explainable county-level screening scores for next-gen geothermal focus in Texas.

---

## User experience

### What users see first

A single application view:

- **Left (or top):** ranked table of Texas counties — rank, name, Screening Score, Confidence  
- **Right (or main):** choropleth map of Screening Score  
- Header: product name + link to Methodology + clear disclaimer  

### Main workflows

1. Discover via rank + map  
2. Click county → explanation panel  
3. Filter counties by name  

### Expected outcomes

User can state:

- Three counties to prioritize for further desk work  
- Three to deprioritize  
- Why, in plain language tied to thermal proxy and grid proximity  
- Where confidence is weak  

---

## Application pages / screens

| Screen | Purpose |
|--------|---------|
| **`/` Explorer** | Ranked list + map + detail panel (the product) |
| **`/methodology`** | Formula, weights, datasets, limitations, vintages |
| **README (GitHub)** | Install/demo link, thesis, what this is not |

**Not in release:** auth pages, upload, compare, settings, layer manager, about microsite.

Detail panel contents:

- County name, rank, Screening Score, Confidence  
- Factor A: thermal proxy (raw + 0–100 + weight + contribution)  
- Factor B: infra proximity (raw + 0–100 + weight + contribution)  
- Top drivers (rule-generated)  
- Limitations  
- Source citations + vintages  

---

## Datasets

### Included

| Dataset | Role |
|---------|------|
| Texas county boundaries | Spatial unit |
| **One** statewide thermal proxy (prefer published heat-flow / gradient product covering TX) | Opportunity factor |
| **One** public transmission dataset usable for Texas (ERCOT extract *if redistributable*, else HIFLD or equivalent) | Opportunity factor |
| Public well points **or** county well counts (lightweight) | Confidence only |

### Excluded

- Faults, hot springs, geothermal site catalogs (as score inputs)  
- Power plants, substations (unless transmission-only path fails and substations are *easier*—unlikely)  
- Parcels, minerals, protected areas  
- Commercial well DBs  
- Live ERCOT feeds  
- BHT as opportunity input  

---

## Features

### Included

- Screening Score + Confidence  
- Rank + choropleth + explain panel  
- County name filter  
- Methodology page  
- Precomputed static data package  

### Excluded

- APIs, DB, auth, uploads, layer toggles, geocoder, exports, ML, 3D, multi-state  

---

## Scoring (v0.2 — revised)

### What makes a county attractive (Phase 1)

Relatively **higher regional thermal proxy** and **closer / denser transmission proximity** than other Texas counties—**with stated confidence** based on well-data density.

### Formula

```text
S_thermal ∈ [0, 100]   # winsorized regional thermal proxy, Texas-scaled
S_infra   ∈ [0, 100]   # transmission proximity / exposure, Texas-scaled

ScreeningScore = 0.60 * S_thermal + 0.40 * S_infra

Confidence:
  High   if well_count >= T_high
  Medium if T_low <= well_count < T_high
  Low    if well_count < T_low
  (thresholds documented; wells do NOT enter ScreeningScore)
```

### Explanation

- Show both factor contributions  
- Rule-based drivers (e.g. “Above-average thermal proxy”, “Strong transmission proximity”, “Low well control — treat as indicative”)  
- Mandatory disclaimer: not a resource assessment; not interconnection feasibility; not a drill recommendation  

---

## Architecture (Phase 1 final)

| Layer | Choice |
|-------|--------|
| Frontend | Vite + React + MapLibre (or equivalent thin SPA) |
| Backend | **None** (static hosting) |
| Database | **None** |
| Geospatial | Offline Python (GeoPandas/shapely; rasterio only if required) → GeoJSON/JSON |
| Hosting | GitHub Pages, Cloudflare Pages, or Netlify/Vercel static |
| Data | `public/data/prospects.json` + `prospects.geojson` committed or released as artifacts |

```text
scoring/ (Python batch) → web/public/data/* → static web app
```

---

## Acceptance criteria (Phase 1 complete)

1. All Texas counties have Screening Score + Confidence + factor breakdown.  
2. Explorer shows sortable/ranked list and choropleth; click opens explanation.  
3. Methodology page matches shipped formula/weights/vintages.  
4. No interactive well/transmission layers required for the demo path.  
5. README states limitations and “what this is not.”  
6. Public URL works without login.  
7. Manual sanity check: top 15 / bottom 15 reviewed; no obvious georeferencing disasters.  
8. A new user can produce focus/ignore lists and explain *why* in &lt; 15 minutes.  
9. Repo contains scoring scripts + documented data download steps (raw data may be gitignored).  
10. Language audit: no “proven resource” / “ready to drill” claims.

---

# PART 4 — Implementation Roadmap (developer-ready)

> Milestone names match the requested structure. **Milestone 3 is deliberately a static data contract**, not a FastAPI build.

---

## Milestone 0 — Repository & Infrastructure Setup

**Goal:** Empty product-ready repo with folders, ignore rules, and deploy target—not an app.

**Tasks:**

- Init git repo; README stub pointing to docs  
- Folders: `docs/`, `scoring/`, `web/`, `data/raw/` (gitignored), `data/processed/`  
- Choose static host; hello-world deploy  
- Freeze scope pointer to this document  

**Dependencies:** None  

**Outputs:** Repo skeleton; blank Pages/Netlify site  

**Acceptance:** Clone → see structure; `/` shows placeholder; raw data cannot be accidentally committed  

**Complexity:** S  

**Risks:** Over-scaffolding Next/monorepo—keep flat  

---

## Milestone 1 — Data Acquisition & Processing

**Goal:** County features table with thermal + infra (+ well counts for confidence).

**Tasks:**

- License check transmission source (ERCOT vs HIFLD) — **hard gate**  
- Download county boundaries  
- Download **one** thermal proxy; join/aggregate to county  
- Download transmission; compute **one** county infra metric  
- Acquire lightweight well counts/points; aggregate counts only  
- Write `county_features.parquet/csv` + lineage notes  

**Dependencies:** M0  

**Outputs:** `data/processed/county_features.*`; `docs/data-sources.md` (urls, licenses, vintages)  

**Acceptance:** 254 counties (or full TX set) with non-null thermal & infra; well count present or explicitly null; CRS documented  

**Complexity:** L (highest risk milestone)  

**Risks:** License block; RRC time sink; raster tooling—**time-box 10–12 days max**  

---

## Milestone 2 — Prospect Scoring Engine

**Goal:** Deterministic ScreeningScore + Confidence + explanations.

**Tasks:**

- Implement winsorize + scale  
- Apply weights 0.60 / 0.40  
- Confidence bands from well counts  
- Emit drivers/limitations  
- Export `prospects.json` + `prospects.geojson`  
- Manual top/bottom 15 review checklist  

**Dependencies:** M1  

**Outputs:** Processed score files; `methodology_version: 0.2.0`  

**Acceptance:** Ranks stable on re-run; explanations present for every county; review notes filed  

**Complexity:** M  

**Risks:** Endless weight tweaking—freeze after one sanity pass  

---

## Milestone 3 — Backend APIs

**Goal:** Define and publish a **static read contract** (not a server).

**Tasks:**

- Finalize JSON schema for list + detail fields  
- Place files under `web/public/data/`  
- Optional: tiny `meta.json` (methodology version, vintages)  
- Document fetch paths in README  
- Explicitly **do not** stand up FastAPI/PostGIS  

**Dependencies:** M2  

**Outputs:** Versioned static data API (files); schema snippet in docs  

**Acceptance:** App can load data via HTTP GET of static files; schema documented  

**Complexity:** S  

**Risks:** Sneaking in a real backend “while we’re here”—reject  

---

## Milestone 4 — Map Experience

**Goal:** Readable county choropleth that supports selection—not cartographic perfection.

**Tasks:**

- MapLibre map centered on Texas  
- Color counties by ScreeningScore  
- Click → select county (shared state with list)  
- Basic legend + disclaimer on map  

**Dependencies:** M3 data files  

**Outputs:** Map working in Explorer  

**Acceptance:** All counties render; click selects; performance OK on laptop  

**Complexity:** M  

**Risks:** Basemap rabbit holes; don’t add layer toggles  

---

## Milestone 5 — Prospect Explorer

**Goal:** Complete primary UX: list + filter + explanation panel + methodology page.

**Tasks:**

- Ranked table with score + confidence  
- County name filter  
- Detail panel wired to selection  
- `/methodology` page content from scoring doc  
- Header disclaimer  

**Dependencies:** M3–M4  

**Outputs:** Complete SPA  

**Acceptance:** Meets Part 3 acceptance criteria 1–5, 8  

**Complexity:** M  

**Risks:** Building a design system—use minimal CSS  

---

## Milestone 6 — Deployment & GitHub Release

**Goal:** Public `v0.1.0` people can try and critique.

**Tasks:**

- Production static deploy  
- README: demo link, thesis, limitations, data notices  
- Tag `v0.1.0` with release notes (this Part 3 summary)  
- Language audit  
- Optional: simple feedback form link  

**Dependencies:** M5  

**Outputs:** GitHub Release + live URL  

**Acceptance:** Part 3 acceptance criteria all checked  

**Complexity:** S–M  

**Risks:** Shipping without disclaimer; hosting raw restricted data—verify  

---

### Suggested calendar (45 days)

| Days | Milestone |
|------|-----------|
| 1–2 | M0 |
| 3–14 | M1 |
| 15–20 | M2 |
| 21–22 | M3 |
| 23–30 | M4 |
| 31–40 | M5 |
| 41–45 | M6 |

If M1 slips past day 14: **cut well confidence to optional**, keep thermal+infra only, still ship.

---

# PART 5 — Final Executive Summary

### 1. Final recommended MVP

A **static web app** that ranks **Texas counties** for **next-gen geothermal screening** using **two explainable factors** (regional thermal proxy 60% + transmission proximity 40%), shows a **simple confidence badge** from well-data density, and explains every result—**no backend, no PostGIS, no layer GIS, no BHT-in-score, no parcels.**

### 2. Biggest remaining risk

**Dataset acquisition + licensing (especially transmission redistribution and well-data wrangling)** eating the calendar—or shipping ranks that domain experts dismiss because thermal proxy is over-sold.

### 3. First milestone to build

**Milestone 0 (repo/infra)**, then immediately **Milestone 1 (data)**—the true critical path. Do not start the map UI before county features exist.

### 4. First GitHub release definition

**`v0.1.0 — Texas Next-Gen County Screening`:** live Explorer (list + choropleth + explain) + methodology + static score data + honest limitations. Success = a developer can leave with a focus/ignore county list and reasons.

### 5. Three things to avoid building too early

1. **PostGIS / FastAPI / auth** — premature platform  
2. **Interactive wells, faults, and “data exploration”** — GIS trap  
3. **BHT-corrected temperature or multi-factor “resource” models** — credibility and schedule trap  

---

## Document control

This red-team revision **narrows** Phase 1 relative to earlier docs. When conflicts exist, **this file wins** until explicitly re-opened.
