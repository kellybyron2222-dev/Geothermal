# Phase 1 Tasks — True MVP

**Authoritative plan:** [red-team-mvp.md](red-team-mvp.md)  
**Window:** ~30–45 days · **Ship:** `v0.1.0` static county screening  

---

## Build order

```text
Phase 1 M0–M6          ← DONE (county screening live)
Phase 2.1 Site dossier ← IN PROGRESS (click-map evaluate)
Phase 2.2 AOI polygon
Phase 2.3 Compare sites
Phase 2.4 Parcels
```

See [phase2.md](phase2.md).

### Thermal roadmap (locked)

| Item | Plan |
|------|------|
| Geothermal gradient as primary thermal factor | **v0.3 (now)** |
| Heat flow as fallback when gradient missing | **v0.3 (now)** |
| DIY BHT→gradient | Not in Phase 1 |
| Always show both gradient + heat flow in panel | Near-term polish |

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
