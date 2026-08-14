# Geothermal Intelligence Platform

Decision-support for geothermal development — **not a GIS viewer**.

**Thesis:** Datasets and maps are inputs. The product is actionable geothermal intelligence that answers: *Where should I focus development efforts, and why?*

## Beachhead

- **Geography:** Texas / ERCOT  
- **Phase 1:** Next-gen **county screening** — geothermal **gradient** preferred (heat-flow fallback) + transmission proximity  
- **Live app (after Pages deploy):** https://kellybyron2222-dev.github.io/Geothermal/  

## Try it locally

```bash
cd web
npm install
npm run dev
```

Open http://127.0.0.1:5173/

Rebuild scores:

```bash
scoring\.venv\Scripts\python.exe scoring\build_county_features.py
scoring\.venv\Scripts\python.exe scoring\score_counties.py
```

## Docs

| Doc | Purpose |
|-----|---------|
| [docs/red-team-mvp.md](docs/red-team-mvp.md) | Authoritative MVP / milestones |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Locks (incl. gradient as thermal factor) |
| [docs/BUILD_FRAMEWORK.md](docs/BUILD_FRAMEWORK.md) | Parallel build + red/blue + judgment + persona loop |
| [docs/roadmap.md](docs/roadmap.md) | Phases 1–5 · **Phase 3 COMPLETE** |
| [docs/phase2.md](docs/phase2.md) | Phase 2 site evaluation (**COMPLETE**) |
| [docs/phase3.md](docs/phase3.md) | Phase 3 automation (**COMPLETE**) |
| [docs/scoring-methodology.md](docs/scoring-methodology.md) | Scoring v0.4 (Data Depth) |
| [docs/data-sources.md](docs/data-sources.md) | Datasets + licenses |
| [docs/tasks.md](docs/tasks.md) | Build status |

## Repo layout

```text
docs/           Product + methodology
web/            Vite + React + TypeScript + MapLibre Explorer
scoring/        Python download / features / score
data/raw/       Gitignored downloads
data/processed/ Derived features (optional commit)
```
