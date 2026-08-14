# Build review + next-step judgment (2026-08-14 PM)

**Inputs:** Roadmap status · Data Depth STOP · UI declutter/layers stops · session map work (heat-flow-only, IDW surface, Barnes 1992 geology)  
**Director role:** Prioritize actionable geothermal intelligence; challenge GIS sprawl.

---

## Blue team — what works

| Keep | Why |
|------|-----|
| County ScreeningScore v0.4 (T@depth @4 km + infra) | Answers “where next” with labeled model + grid |
| Cohort / honesty chrome (model ≠ BHT; SMU proxy residual) | Trust with technical buyers |
| Point / AOI / Compare (evidence, not site scores) | Site workflow without fake precision |
| Left rail + exclusive fill radios | Map is interrogable without chrome sprawl |
| Barnes 1992 geology + IHFC q overlays (context only) | **Must-have KEEP** (D5) — structural geology context; not in score |

**Value:** Discovery shortlist + explainable drivers + optional geology/heat-flow inspection.

---

## Red team — what fails / misleads / is low value

| Sev | Finding | Fix / enhance / defer |
|-----|---------|----------------------|
| **HIGH** | Phase 3 is **eligible** but undefined — temptation to keep adding map layers instead of closing the decision loop | **Build now:** Phase 3 judgment pass (scope only; no code until locked) |
| **MED** | Barnes geology + constrained IDW surface shipped **without** red/blue folder (basement wrongly tried first; IDW historically rejected as black-box) | **Enhance soon:** thin honesty stop — confirm context-only, no score, no “resource map” claim; then STOP map layering |
| **MED** | Roadmap body still says “2.5 STOP not met / Phase 3 locked” while snapshot + `05-stop-judgment` say STOP MET | **Fix now:** sync `docs/roadmap.md` Phase 2.5 section + README scoring version |
| **MED** | Methodology / residual UI copy can lag “STOP accepted” | **Enhance soon:** align Methodology residual language with accepted SMU proxy |
| **LOW** | More geology (GDT 250k, Ewing tectonic $20, gravity) still available | **Defer** — Barnes is enough unless a buyer asks for finer fabric |
| **LOW** | Point/AOI still IHFC-local; county spine is Stanford T@depth | **Enhance soon** after Phase 3 judgment (or with it): inherit labeled model thermal into dossiers |

---

## Persona clusters (compressed ~100)

| Cluster | Signal |
|---------|--------|
| Geothermal / energy developers | “Show me the shortlist and why” — Phase 3 watchlists/rules if they don’t invent prospects |
| Infra / land investors | Residual SMU proxy OK if labeled; want return cadence (alerts) |
| Researchers | Want more geology layers — **do not** let this drive roadmap |
| Skeptical scientists | Barnes surface ≠ heat source; keep out of score (already) |
| Policymakers | Light — methodology honesty enough |

---

## Judgment (authoritative)

| Decision | Item |
|----------|------|
| **BUILD / FIX NOW** | (1) Sync roadmap + README with Data Depth STOP / Phase 3 eligible. (2) Open **Phase 3 judgment** (scope: watchlists / rule-based prospects / versioned alerts — no CEII, no parcels, no ML black box). |
| **ENHANCE SOON** | Thin honesty pass on Barnes + heat-flow IDW (context-only labels already mostly present). Optional: Point/AOI inherit v0.4 thermal spine. |
| **DEFER** | GDT 250k, Ewing SM0001GIS, gravity/magnetic, basement domains re-wire, more map chrome. Phase 4–5. |
| **REJECT** | Putting Barnes / IDW / basement into ScreeningScore. National expansion. Parcel GIS. Silent interconnection claims. |

### Director call — where to go next

**Primary next:** **Phase 3 judgment session** (document first, code second). Data Depth STOP is met; further map layers are GIS gravity, not product progress.

**Do not start Phase 3 implementation** until that judgment locks: alert semantics, prospect rules (T@depth + infra + confidence), account necessity, and explicit non-goals.

**Secondary (same week, thin):** doc sync + optional overlay honesty stop — then **stop** map-layer iteration.

---

## Stop condition for this review

This review slice is **done**. Next workstream = Phase 3 judgment artifact under `docs/reviews/`.
