# Phase 1 Tasks — True MVP

**Authoritative plan:** [red-team-mvp.md](red-team-mvp.md)  
**Window:** ~30–45 days · **Ship:** `v0.1.0` static county screening  

---

## Build order

```text
Phase 1 M0–M6          ← DONE (county screening live)
Phase 1 honesty harden ← DONE (N1–N5; see docs/reviews/2026-08-13-full-build/)
Phase 2.1 Point check  ← DONE (stop criteria cleared post-N1–N5)
Phase 2.2 AOI evidence ← DONE (stop; see docs/reviews/2026-08-13-phase2.2/)
Phase 2.3 Compare sites ← next candidate (judgment must open)
Phase 2.4 Parcels       ← locked until later judgment
```

See [phase2.md](phase2.md).  
**2.2 reviews:** [reviews/2026-08-13-phase2.2/](reviews/2026-08-13-phase2.2/)

### Phase 2.2 NOW backlog (scoped)

| ID | Deliverable | Priority |
|----|-------------|----------|
| **A1** | AOI mode + draw one polygon | Must |
| **A2** | Upload single Polygon GeoJSON only | Should (after A1) |
| **A3** | Evidence panel = Point check honesty hierarchy | Must |
| **A4** | Evidence-only map quarantine in AOI mode | Must |
| **A5** | Methodology: AOI rules; no AOI ScreeningScore | Must (docs) |
| **A6** | Soften shared evidence verbs (optional free) | Free-if-touching |

**Slip:** A1 + A3 + A4 before A2/A5.  
**Reject in 2.2:** AOI ScreeningScore · parcels · compare · geocoder · full HIFLD · MultiPolygon campaigns · ML surfaces.

### Thermal roadmap (locked)

| Item | Plan |
|------|------|
| Geothermal gradient as primary thermal factor | **v0.3 (now)** |
| Heat flow as fallback when gradient missing | **v0.3 (now)** |
| DIY BHT→gradient | Not in Phase 1 |
| Always show both gradient + heat flow in panel | Near-term polish (S7 — enhance-soon, not 2.2 gate) |

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
