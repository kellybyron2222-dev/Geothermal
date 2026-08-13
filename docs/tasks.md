# Phase 1 Tasks — True MVP

**Authoritative plan:** [red-team-mvp.md](red-team-mvp.md)  
**Window:** ~30–45 days · **Ship:** `v0.1.0` static county screening  

---

## Build order

```text
M0 Repo/infra          ← DONE (Vite/React/TS/MapLibre scaffold)
M1 Data acquisition (critical path — time-box)
M2 Scoring engine v0.2
M3 Static data contract (not FastAPI)
M4 Map choropleth
M5 Explorer UI + methodology
M6 Deploy + GitHub Release
```

Do not start M4–M5 until M2 outputs exist.

Scoring critique (developer lens): [scoring-critique.md](scoring-critique.md)

---

## Milestones (summary)

| M | Goal | Complexity |
|---|------|------------|
| 0 | Repo + static host hello-world | S |
| 1 | County features: thermal + infra + well counts | L |
| 2 | ScreeningScore + Confidence + explanations | M |
| 3 | JSON/GeoJSON schema published into `web/public/data` | S |
| 4 | MapLibre choropleth + selection | M |
| 5 | List + filter + detail panel + methodology | M |
| 6 | `v0.1.0` release + public URL | S–M |

Full tasks, dependencies, acceptance, risks: **Part 4 of [red-team-mvp.md](red-team-mvp.md)**.

---

## If schedule slips

1. Drop well-based confidence → Confidence = Unknown  
2. Keep thermal + infra scores  
3. Still ship Explorer + methodology  
4. Never “catch up” by adding PostGIS or layers  

---

## Definition of done

Part 3 acceptance criteria in [red-team-mvp.md](red-team-mvp.md).
