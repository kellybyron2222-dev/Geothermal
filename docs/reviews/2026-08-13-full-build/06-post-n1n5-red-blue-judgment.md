# Post N1–N5 red/blue + judgment

**Date:** 2026-08-13  
**Scope:** Retrospective slice stop criteria only (N1–N5). No new features.  
**Code checked:** `App.tsx`, `RankedCountyList.tsx`, `MapView.tsx`, `SiteDossierPanel.tsx`, `Methodology.tsx`  
**Scoring reality (v0.3.1, `minGradientN: 3`):** **10** gradient · **237** heat-flow · **7** none (254 counties)

---

## Blue (brief) — what works now

1. **Rank-first MVP surface** — Left `RankedCountyList` with ~3/3 focus/ignore caps and checklist cue; map is supporting; list hidden in Point check (`App` site-mode layout). Users can leave with a shortlist without treating the map as the product.
2. **Thermal honesty by default** — Cohort tabs default to **Gradient control**; Heat-flow is a separate secondary ladder; **All** carries an explicit non-comparability banner. Min-n gate shipped in scoring (`gradient_n >= 3`) and methodology.
3. **Single choropleth, metric readable** — Fill opacity + outline color encode `thermalMetric` (gradient full, HF muted, none pale); legend states the rule. No second map.
4. **Confidence on the decision surface** — Row badges; Low/Unknown demoted; within-cohort ties labeled; methodology confidence tied to *active* metric n; docs/UI at **0.3.1**.
5. **Point check quarantine** — Score fill forced to neutral; legend says evidence-only; weak local means collapsed behind `<details>` so control quality leads.

---

## Red (brief) — residual risks with severity

| ID | Severity | Residual |
|----|----------|----------|
| **R1** | **Medium** | Gradient primary cohort is **~10 counties**. Honest, but thin for “statewide next-gen focus” JTBD — users may bounce to HF or All and reintroduce cross-metric thinking. |
| **R2** | **Low–Med** | Statewide fused `rank` / ScreeningScore still live in JSON and power **All** (and search rank chips). Defaults + banner mitigate; a curious user can still misuse one ladder. |
| **R3** | **Low** | Several gradient counties are **Low** confidence (e.g. Anderson, Limestone, Van Zandt, Hunt). Demotion helps; top-of-gradient-list still needs a skeptical read. |
| **R4** | **Low** | Map still paints HF counties with score color (muted). Opacity encodes metric, but most of Texas still *looks* like a score choropleth — list remains the trust surface. |
| **R5** | **Low** | Point-check verbs / soft language polish and county infra precision remain deferred (prior S1/S2) — not stop blockers. |

**Not raised to NOW:** Dual choropleths, weight re-open, AOI/compare/parcels.

---

## Judgment — stop / not stop for this retrospective slice

### **STOP — this retrospective slice is closed.**

| # | Stop criterion | Verdict |
|---|----------------|---------|
| 1 | Rank-first list + focus/ignore | **Met** (N1) |
| 2 | Thermal honesty / cohort quarantine + min-n | **Met** (N2 + scoring gate → 10 / 237 / 7) |
| 3 | Metric visibility on single choropleth | **Met** (N3) |
| 4 | Confidence honesty on list + methodology | **Met** (N4 + 0.3.1) |
| 5 | Point check: no score heatmap; weak means not visual lead | **Met** (N5) |
| 6 | No AOI / compare / parcels / dual choropleths | **Met** |

**Thin gradient cohort (~10):** Accept as residual. The gate fixed the n=1 lie; shrinking the preferred cohort is the correct honesty trade. UI defaults (Gradient primary, HF secondary, All warned) prevent systematic misuse. **Do not** reopen dual statewide choropleths. **Do not** invent NOW work to “grow” gradient coverage without new data.

**Primary JTBD call:** ~10 is enough for a *control-quality shortlist* (focus/ignore among well-measured gradient counties), not enough for statewide discovery. Keep HF as **clearly secondary discovery** — enhance-soon dual **panel numbers** (prior S7) if users need both metrics on one county; not a second map.

---

## If not stop: remaining NOW only (max 2)

*N/A — stopped.*

---

## If stop: what is deferred and next allowed phase move

### Deferred (explicit)

- **S1–S6** from `03-judgment.md` (verbs, county infra honesty, tie polish, conflict callout, missing-thermal stigma polish, docs drift pass)
- **S7** — Optional dual **panel** gradient + HF numbers (not dual choropleths) — **enhance soon** if thin-cohort bounce becomes the top complaint
- West TX thermal/infra reweight (F14)
- Tighter Point radius / markers
- AOI (2.2), compare (2.3), parcels (2.4)
- Dual full choropleths — **rejected** for this product phase family

### Next allowed phase move

1. Optional short **persona / smoke** on the shipped N1–N5 UX (no feature build).
2. Then open **enhance-soon** only as needed — prefer **S7 panel numbers** and **S1 verb soften** over any map expansion.
3. **Do not** open Phase **2.2+** (AOI/compare/parcels) until a later judgment explicitly unlocks scope.

**Director one-liner:** Honesty and rank-first landed; accept tiny gradient cohort + fused JSON under quarantine; ship stop; next work is polish/panels, not GIS sprawl.
