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
Phase 2.3 Compare      ← DONE (stop; see docs/reviews/2026-08-13-phase2.3/)
Phase 2.4 Land context ← DONE (honesty stop; see docs/reviews/2026-08-13-phase2.4/)
```

See [phase2.md](phase2.md).  
**Phase 2 site-eval track (2.1–2.4):** complete for MVP.  
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

**2.3 residual SOON (not a 2.4 gate):** S1–S7 from phase2.3 judgment (limitations row, soft parity, kind labels, etc.).

### Phase 2.2 (completed — reference)

| ID | Deliverable | Status |
|----|-------------|--------|
| **A1–A5** | AOI mode, upload, honesty panel, map quarantine, methodology | Done |
| **A6** | Softened shared evidence verbs | Done (where touched) |

**2.2 residual SOON (not a 2.4 gate):** S1 large-AOI smear · S2 means≠score copy · S3 draw-close · S4 upload caveat · S5 county probe miss.

### Thermal roadmap (locked)

| Item | Plan |
|------|------|
| Geothermal gradient as primary thermal factor | **v0.3 (now)** |
| Heat flow as fallback when gradient missing | **v0.3 (now)** |
| DIY BHT→gradient | Not in Phase 1 |
| Always show both gradient + heat flow in panel | Near-term polish (S7 — enhance-soon, not 2.4 gate) |

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
