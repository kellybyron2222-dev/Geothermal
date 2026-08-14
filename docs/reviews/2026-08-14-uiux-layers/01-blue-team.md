# Blue team — UI/UX after map layer toggles

**Date:** 2026-08-14  
**Scope:** Explorer chrome, `LayerControls`, map legend, ranked list, detail panel honesty — **UI/UX only**  
**Inputs:** `MapView.tsx` · `LayerControls.tsx` · `App.tsx` · `RankedCountyList` · `DetailPanel` · `index.css` · `2026-08-14-map-layers/00-build-stop.md`

---

## Verdict (keep)

Layer toggles successfully make the map **interrogable**, not just a static choropleth. Honesty chrome (disclaimers, model labels, basement “not in ranking”) is present and mostly consistent with product thesis: explainable screening, not a resource map.

---

## What works

### 1) Explorer composition (decision workspace)

| Keep | Why it creates value |
|------|----------------------|
| Three-pane county mode (list · map · detail) | Matches buyer workflow: scan ranks → locate → read drivers |
| Site/AOI mode collapses list pane | Correct mode switch: evidence surfaces get map + dossier |
| Header disclaimer + Methodology link | Frames product as screening index, not GIS tourism |
| County search in header (county mode) | Fast jump without hunting the list |

**User/decision value:** A geothermal developer can leave with ~3 focus / ~3 ignore counties without leaving the page.

### 2) Layer toggles (new ship)

| Keep | Why |
|------|-----|
| Explicit **Layers** group on-map | Discoverable for GIS-literate users; no buried menu yet |
| Four clear intents: score fill · model T@depth · measured points · basement context | Separates **ranking paint** from **heat context** overlays |
| Basement disabled + “unavailable” when ETL missing | Honest empty state — no fake geology |
| Basement copy: “Not used in ranking.” | Directly supports product constraint (context ≠ score) |
| Default: score ON, overlays OFF | Safe first paint; progressive disclosure |

**User/decision value:** User can answer “where is the score?” vs “where is the model heat?” vs “where are measured points?” without opening Methodology.

### 3) Fill priority + evidence neutrality (science-aligned UX)

| Keep | Why |
|------|-----|
| T@depth fill overrides score when both on | Prefer heat-readable palette over mixed nonsense |
| Evidence modes force **neutral** county fill | Stops users reading score colors as site/AOI quality |
| Legend title switches with mode (“Point check — neutral basemap”) | Mode awareness without hunting the panel |

### 4) Legend (partial but real)

| Keep | Why |
|------|-----|
| Score bar + opacity note (gradient / heat-flow / pale) | Teaches metric confidence via paint — rare and valuable |
| Heat bar with ~90–155°C + “not measured BHT” | Aligns map with DetailPanel model banner |
| “Outlines only” / evidence notes | Explains empty fills instead of silent blank map |

### 5) Honesty chrome (list + detail)

| Keep | Why |
|------|-----|
| Cohort tabs / depth note when legacy cohorts hidden | Prevents mixed-metric ranking theater |
| Focus/Ignore checklist cue with caps | Decision artifact, not endless browsing |
| DetailPanel model banner + risk chips (including Unknown) | Trust-building when data is incomplete |
| Residual-risk banner when risk pending | Loud incompleteness — preferred to silent clear |

### 6) Interaction basics

| Keep | Why |
|------|-----|
| Selected county outline | Map ↔ list selection feedback |
| Pointer vs crosshair by mode | Mode affordance on the canvas |
| Basement click popup with “heat context only” | Reinforces non-score geology |

---

## Blue-team keep list (do not regress)

1. Layer toggles for score / T@depth / points / basement (context-only basement).
2. Evidence-mode neutral fill (never recolor as site quality).
3. Score opacity encoding of thermal metric quality.
4. Explicit “not in ranking” / “not measured BHT” copy near heat layers.
5. Three-pane explorer + focus/ignore decision checklist.
6. Graceful basement unavailable state.

---

## Blue caveats (not praise)

Honesty volume is high; several keep items **compete for attention** with the map itself. Red team owns that tension — blue does not claim the chrome is already elegant.
