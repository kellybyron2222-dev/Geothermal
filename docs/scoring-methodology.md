# Scoring Methodology (Phase 1 / v0.3.1)

**Thermal factor:** geothermal **temperature gradient** (preferred), heat flow fallback.  
**Locks:** [DECISIONS.md](DECISIONS.md) D4 · [scoring-critique.md](scoring-critique.md)

`methodology_version: 0.3.1`

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

**Texas counties only.**

---

## Opportunity factors (2)

### A — Thermal potential (weight **0.60**) — gradient preferred

| Item | Detail |
|------|--------|
| **Primary** | Geothermal gradient (°C/km) from IHFC `T_grad_mean` |
| Why gradient | Matches next-gen intuition: temperature rise with depth |
| Calculation | County mean of valid gradient points → winsorize P10–P90 → scale 0–100 in Texas |
| Valid range gate | Drop absurd point values outside ~5–150 °C/km before aggregate |
| **Min-n gate** | Prefer gradient only when `gradient_n >= 3`; thinner gradient control uses heat-flow fallback |
| **Fallback** | If gradient gate fails or no gradient control, use county mean **heat flow** (`q`, mW/m²) with the same winsorize/scale path |
| UI label | “Geothermal gradient” or “Heat-flow fallback” depending on `thermal_metric` |
| **Cross-metric** | `S_thermal` is scaled **within** each cohort. Do **not** treat one statewide ladder as scientifically comparable across metrics. Explorer defaults to the **gradient cohort** list. |
| **Do not** | DIY BHT→gradient corrections |

### B — Transmission proximity (weight **0.40**)

Unchanged: HIFLD distance to nearest transmission line (km); nearer is better.  
Label: grid proximity proxy — **not** interconnection feasibility.

---

## Formula

```text
ScreeningScore = 0.60 * S_thermal + 0.40 * S_infra
```

`S_thermal` is always 0–100 relative Texas scale, but the **raw unit** is either °C/km (preferred) or mW/m² (fallback).

---

## Confidence (separate)

From **thermal control count** used for the active metric (gradient_n if gradient, else heatflow_n):

```text
High   | count >= T_high
Medium | T_low <= count < T_high
Low    | 0 < count < T_low
Unknown| count == 0
```

---

## Build plan note

| Step | Status |
|------|--------|
| v0.2 heat-flow-only thermal | Shipped (interim) |
| v0.3 gradient-preferred thermal | **Active** |
| Later | Optional dual display (show both gradient and heat flow always) |

---

## Calibration

Review top/bottom 15 after gradient switch. Freeze weights; change metric with methodology version bump only.
