# Architecture Draft (Phase 1) — Static MVP

**Authoritative after red-team:** [red-team-mvp.md](red-team-mvp.md)  
**Rule:** No application server. No PostGIS. No auth.

---

## Stack

| Layer | Choice |
|-------|--------|
| Frontend | Vite + React + MapLibre |
| Backend | **None** (static files) |
| Database | **None** |
| Scoring / ETL | Python + GeoPandas / shapely (+ rasterio only if required) |
| Hosting | GitHub Pages / Cloudflare Pages / Netlify / Vercel static |
| Auth | None |

```text
scoring/  →  web/public/data/*.json|geojson  →  static web app
```

---

## App structure

```text
/               Explorer: ranked list + choropleth + detail panel
/methodology    Formula, weights, datasets, limitations
```

---

## Data contract (Milestone 3)

Static files only, e.g.:

- `prospects.json` — ranked list + factor payloads  
- `prospects.geojson` — county polygons + score properties  
- `meta.json` — methodology_version, vintages, weight table  

---

## Explicit non-choices (Phase 1)

FastAPI · PostGIS · Supabase · Next.js requirement · tile servers · microservices · interactive well layers  

Add API/DB only when Phase 2 AOI queries require them.

---

## Ops

- `data/raw/` gitignored — offline cache of upstream downloads  
- `data/raw/_manifest.json` committed — retrieved_at / checksum / cadence audit  
- Commit or release **processed client** outputs under `web/public/data/`  
- Refresh on **preset cadence** (ETL/CI), never live upstream from the browser  
- Document download URLs, licenses, and cadences in [data-sources.md](data-sources.md) + [data-strategy-texas-geothermal.md](data-strategy-texas-geothermal.md) §8  
