# Judgment — UI/UX after map layer toggles (Director)

**Date:** 2026-08-14  
**Role:** Director / judgment layer (authoritative for this slice)  
**Inputs:** `01-blue-team.md` · `02-red-team.md` · `03-1000-persona-uiux.md` · `2026-08-14-map-layers/00-build-stop.md`  
**Hard constraints:**

- **Do not reopen Phase 3**
- **Do not add basement (or any geology) into ScreeningScore**
- Cap **Build NOW ≤ 6** concrete **UI** fixes
- Maps/datasets ≠ product; explainable decisions remain the bar

---

## Executive verdict

| Question | Answer |
|----------|--------|
| Layer **data** slice complete? | **YES** (per map-layers build stop) |
| Layer **UI/UX** slice complete? | **NO** |
| Unlock Phase 3? | **NO — remains locked** |
| Put basement in score? | **REJECT** |
| Immediate work? | **≤6 UI fixes (N1–N6)** then stop this chrome pass |

**Director one-liner:** Keep the toggles and honesty intent; **fix the map grammar** (exclusive fill, full legend, mode/cohort honesty, quieter chrome, mobile collapse). Do not invent new layers or Phase 3.

---

## Decision buckets

### Build NOW (≤6) — this session / immediate UI pass

| ID | Action | Fixes | Why NOW |
|----|--------|-------|---------|
| **N1** | **County fill as exclusive control** (Score · Model T@depth · Outlines) — replace dual checkboxes that lie | F1, confusion ~88 | CRITICAL deception; GIS distrust |
| **N2** | **Complete map legend**: fill scale (numeric score anchors + heat °C) + swatches for thermal points + basement; note active fill | F2 | CRITICAL incompleteness |
| **N3** | **Evidence-mode panel honesty**: disable/annotate fill control when neutral forced; overlays may stay | F4 | Stops “broken toggle” thrash |
| **N4** | **Cohort ↔ map sync cue**: dim non-cohort counties **or** persistent one-line strip (“List = cohort; map = all TX”) | F3 | HIGH list/map dual reality |
| **N5** | **Collapse residual-risk banner** to one compact line (expand detail); keep honesty, cut volume | F5 | Banner blindness / distrust chrome |
| **N6** | **Collapsible Layers panel** + safer mobile placement (default collapsed on narrow, or icon toggle) | F6 | Map readability / mobile ~100 |

**Out of NOW (explicit):** thermal point popups, focus/ignore map marks, header redesign, basement auto-dim under fill, a11y deep pass — see Enhance / Defer.

---

### Enhance soon (still this UI phase family — after N1–N6)

| ID | Item | Notes |
|----|------|-------|
| **E1** | Thermal point hover/popup (q / grad) | F9; properties already on features |
| **E2** | When basement ON, soft-dim county fill or one-click “inspect basement” | F8 |
| **E3** | Focus/Ignore marks on map (simple halo/dot) | F11; decision spatialized |
| **E4** | Short fill-mode helper text under Layers (“fills replace; overlays stack”) | F7 |
| **E5** | Header mode declutter (segmented County / Point / AOI) | F10 |
| **E6** | Non-color cues in legend (patterns/labels) for a11y | F12 |

---

### Defer (later phase / not this session)

| Item | When |
|------|------|
| Full mobile app shell / bottom-sheet explorer | Post UI grammar; capacity |
| Saved views / layer presets | After accounts exist (not Phase 3 unlock) |
| Payload split / lazy layer fetch UX polish | Performance real work later |
| Deep keyboard map exploration | After E1/E6 |
| ComparePanel layout redesign | Separate chrome pass |
| **Phase 3** alerts / accounts / rule prospects | **Locked** — not reopened by UI polish |

---

### Reject

| Item | Why |
|------|-----|
| **Basement (or surface geology) into ScreeningScore** | Build-stop + product constraint; science context ≠ rank |
| **Unlock Phase 3 because layers shipped** | Layers ≠ Data Depth stop ≠ Phase 3 |
| More geology/base layers this week | Sprawl; finish grammar first |
| Remove residual honesty entirely | Trust debt; compress ≠ delete |
| Fake “stacked” score+heat dual fill | Would worsen deception |
| Card-heavy redesign / marketing hero | Explorer is a tool; preserve decision density |

---

## Keep (do not regress)

- Layer toggles exist; basement context-only labeled
- Evidence-mode neutral fill
- Score opacity = metric quality encoding
- Model T@depth “not measured BHT” copy
- Focus/Ignore caps + cohort honesty in list
- Basement unavailable graceful disable

---

## Scope challenge (director)

| Temptation | Ruling |
|------------|--------|
| “Add more layers while we’re here” | **Reject** — UX debt first |
| “Wire basement into heat score” | **Reject** |
| “Ship Phase 3 map alerts on overlays” | **Reject** |
| “Kill residual banner” | **Reject** — collapse only (N5) |
| “Full legend + radio + sync + mobile + popups + focus marks all NOW” | **Cut** — popups/focus → Enhance |

---

## Stop condition for this UI slice

Declare **UI/UX layer-follow-through complete enough** when:

1. N1–N6 landed and briefly re-red-teamed  
2. Persona confusion cluster would plausibly drop (fill lie + legend + evidence contradiction addressed)  
3. No Phase 3 / no score contamination  

Deferrals of E1–E6 are **success**, not failure.

---

## Director decision table

| Decision | Result |
|----------|--------|
| Layer data stop | Accepted (prior) |
| Layer UI/UX stop | **Not yet** — implement N1–N6 |
| Phase 3 | **Locked** |
| Basement in score | **Rejected** |
| Next | Persona loop → finalize NOW list for implementation |
