# Phase 1 Tasks — True MVP

**Authoritative plan:** [red-team-mvp.md](red-team-mvp.md)  
**Window:** ~30–45 days · **Ship:** `v0.1.0` static county screening  

---

## Build order

```text
Phase 1 M0–M6          ← DONE (county screening live)
Phase 1 honesty harden ← DONE (N1–N5; see docs/reviews/2026-08-13-full-build/)
Phase 2.1 Point check  ← DONE
Phase 2.2 AOI evidence ← DONE (+ SOON closeout)
Phase 2.3 Compare      ← DONE (+ SOON closeout)
Phase 2.4 Land context ← DONE (+ SOON closeout)
Phase 2 residual polish← DONE (see docs/reviews/2026-08-14-phase2-closeout/)
```

See [phase2.md](phase2.md).  
**Phase 2 (2.1–2.4 + residuals): COMPLETE for MVP.**  
**Closeout:** [reviews/2026-08-14-phase2-closeout/](reviews/2026-08-14-phase2-closeout/)  
**2.4 reviews:** [reviews/2026-08-13-phase2.4/](reviews/2026-08-13-phase2.4/)  
**2.3 reviews:** [reviews/2026-08-13-phase2.3/](reviews/2026-08-13-phase2.3/)  
**2.2 reviews:** [reviews/2026-08-13-phase2.2/](reviews/2026-08-13-phase2.2/)

### Phase 2.4 (completed — land context honesty, not parcels)

| ID | Deliverable | Status |
|----|-------------|--------|
| **L1–L5** | Land context block, CAD/RRC/GLO citations, AOI≠parcel, methodology, Compare row | Done |

**Reject remains:** statewide parcels · CAD scrapes · commercial APIs · ownership/title claims · mineral estate UI · cadastral layers.

### Phase 2.3 (completed — reference)

| ID | Deliverable | Status |
|----|-------------|--------|
| **C1–C5** | Pin ≤3 snapshots, honesty table, no winner, methodology, clear/remove | Done |
| **SOON closeout** | Limitations row, softMeans n≤1, kind labels, AOI labels, anti-rank, county expand | Done |

### Phase 2.2 (completed — reference)

| ID | Deliverable | Status |
|----|-------------|--------|
| **A1–A5** | AOI mode, upload, honesty panel, map quarantine, methodology | Done |
| **A6** | Softened shared evidence verbs | Done |
| **SOON closeout** | Large-AOI smear, means≠score, draw close, upload/probe caveats | Done |

### Thermal / county polish (Phase 2 closeout)

| Item | Status |
|------|--------|
| Dual panel gradient + heat-flow context numbers | Done (in score vs context only) |
| County infra ~km honesty | Done |
| Point conflict callout (strong county / weak local) | Done |

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
