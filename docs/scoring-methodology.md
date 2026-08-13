# Scoring Methodology (Phase 1 / v0.2)

**Authoritative revision after red-team.** Prior 3-factor opportunity model is **retired** for Phase 1.  
**Full rationale:** [red-team-mvp.md](red-team-mvp.md)  
**Developer critique:** [scoring-critique.md](scoring-critique.md)

`methodology_version: 0.2.0`

---

## What this score is

A **relative Texas county screening index** for early next-gen geothermal prioritization.

## What this score is not

- Resource assessment or heat-in-place  
- Drill target ranking  
- Open- vs closed-loop optimization  
- Interconnection feasibility or NPV  

---

## Spatial unit

**Texas counties only.** One unit. No grid in Phase 1.

---

## Opportunity factors (2)

### A — Regional thermal proxy (weight **0.60**)

| Item | Detail |
|------|--------|
| Why | Without a thermal signal, grid proximity is irrelevant |
| Dataset | **Exactly one** published heat-flow or gradient product covering Texas |
| Calculation | Aggregate to county → winsorize (P10–P90) → scale to 0–100 within Texas |
| Confidence note | Smooth grids hide local highs; label as proxy |
| **Do not** | Blend BHT into this score in v0.2 |

### B — Transmission proximity (weight **0.40**)

| Item | Detail |
|------|--------|
| Why | Power-oriented next-gen care about grid access context |
| Dataset | **One** redistributable transmission dataset (ERCOT if allowed; else HIFLD/public) |
| Calculation | One metric only (e.g. distance from county centroid to nearest line, **or** line-km per area) → scale 0–100 |
| Label | “Grid proximity proxy — **not** interconnection feasibility” |
| **Do not** | Require substations or power plants for v0.2 |

### Removed from opportunity score

| Former factor | Disposition |
|---------------|-------------|
| Well density @ 0.25 | **Removed** — scientifically misleading as “attractiveness”; wells → confidence only |
| BHT | **Excluded** from opportunity until a credible correction path exists |
| Faults / springs / plants | Excluded |

---

## Formula

```text
ScreeningScore = 0.60 * S_thermal + 0.40 * S_infra

Rank = dense_rank(ScreeningScore DESC)
Tie-break: higher S_thermal, then higher Confidence band
```

---

## Confidence (separate)

```text
High   | well_count >= T_high
Medium | T_low <= well_count < T_high
Low    | well_count < T_low
Unknown| wells unavailable
```

Thresholds `T_low` / `T_high` set once from Texas distribution and documented in release notes.

**Never multiply ScreeningScore by confidence for primary rank.**

---

## Explainability

Per county emit:

- rank, ScreeningScore, confidence  
- each factor: raw value, unit, score_0_100, weight, contribution  
- 2–3 rule-based drivers  
- limitations (always include infra disclaimer; include low-confidence warning when applicable)  
- source name + vintage per factor  

---

## Calibration

Before release: manually review top 15 and bottom 15 counties for georeferencing disasters and obvious nonsense. Adjust data bugs—not weights—first. Freeze weights for `v0.2.0`.

---

## Developer critique

See [scoring-critique.md](scoring-critique.md) for unit, factor sufficiency, strongest datasets, false-confidence traps, and map representation guidance.
