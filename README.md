# Geothermal Intelligence Platform

Decision-support for geothermal development — **not a GIS viewer**.

**Thesis:** Datasets and maps are inputs. The product is actionable geothermal intelligence that answers: *Where should I focus development efforts, and why?*

## Beachhead

- **Geography:** Texas / ERCOT  
- **Phase 1:** Next-gen **county screening** (thermal proxy + transmission proximity)  
- **Delivery:** Static web MVP · ~30–45 days · solo founder  

## Start here

| Doc | Purpose |
|-----|---------|
| **[docs/red-team-mvp.md](docs/red-team-mvp.md)** | **Authoritative** red-team review, true MVP, shippable Phase 1, milestones |
| [docs/scoring-critique.md](docs/scoring-critique.md) | Geothermal-developer critique of scoring + map representation |
| [docs/MVP.md](docs/MVP.md) | Short MVP lock |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Play type, JTBD, scope freeze |
| [docs/scoring-methodology.md](docs/scoring-methodology.md) | Scoring v0.2 |
| [docs/architecture-draft.md](docs/architecture-draft.md) | Static stack |
| [docs/prd.md](docs/prd.md) | Requirements |
| [docs/roadmap.md](docs/roadmap.md) | Phases 1–5 |
| [docs/tasks.md](docs/tasks.md) | Milestone pointer |
| [docs/vision.md](docs/vision.md) | Vision / risks |

## Phase 1 in one line

Rank Texas counties for next-gen geothermal screening with two explainable factors—and show why—without building a GIS platform.

## Repo structure (Milestone 0)

```text
docs/           Product + methodology
web/            Vite + React + TypeScript + MapLibre (scaffold)
scoring/        Python ETL (later milestones)
data/raw/       Gitignored downloads
data/processed/ Derived county features / scores
```

```bash
cd web
npm install
npm run dev
```

Developer critique of scoring: [docs/scoring-critique.md](docs/scoring-critique.md)
