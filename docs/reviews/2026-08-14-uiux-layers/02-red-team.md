# Red team — UI/UX failures after map layer toggles

**Date:** 2026-08-14  
**Mandate:** Harsh, UI/UX-only. Prefer concrete failure modes over taste.  
**Severity:** CRITICAL · HIGH · MEDIUM · LOW

---

## Executive attack

The layer ship **added capability without finishing the map grammar**. Users get four checkboxes, a half-legend, a loud residual banner, and a list that filters a different universe than the choropleth. Discoverability for first-timers is weak; cognitive load for buyers is high; mobile is an afterthought.

---

## Failures (severityity-tagged)

### F1 — Fill toggles lie (checkbox ≠ independent layers) — **CRITICAL**

`score` and `tdepth` are independent checkboxes, but paint is **mutually exclusive** (`tdepth` wins; else `score`; else outlines). Users can check both and believe they are “layering” score on heat. They are not.

| Symptom | Impact |
|---------|--------|
| Both ON, only heat palette visible | False mental model of multi-layer fill |
| No “active fill” indicator | Users blame data when score “disappeared” |
| Looks like ArcGIS layers; behaves like radio | GIS users especially distrust the chrome |

**Fix direction:** Segmented control / radio for **county fill mode** (Score · Model T@depth · Outlines). Keep points + basement as true overlays.

---

### F2 — Legend incomplete for shipped overlays — **CRITICAL**

Legend covers county fill (sometimes). It does **not** explain:

- Orange measured thermal points (no swatch, no units, no hover values)
- Brown basement domains (no swatch; only click popup if you guess to click)
- Score scale is “Lower / Higher” with **no numeric anchors** (unlike heat ~90–155°C)
- When both fill checkboxes are on, legend title flips to heat with **no note that score fill is suppressed**

**Impact:** Overlay toggles without legend = decorative noise. Skeptical GIS users call it unfinished.

---

### F3 — Cohort list vs map desync — **HIGH**

Ranked list filters by thermal cohort (e.g. T@depth only). Map paints **all Texas counties** by score or statewide `tdepthMean`. Selecting a list row highlights a county; non-cohort counties still shout color on the map.

| Symptom | Impact |
|---------|--------|
| List says “n counties · within cohort” | Map implies statewide comparable paint |
| Focus/Ignore exist only in list | Map never shows decision marks |
| Search filters list; map unchanged | Dual realities |

**Fix direction (UI):** Mute/dim non-cohort counties **or** persistent strip: “List filtered to cohort; map shows all counties.” Do not invent new scoring.

---

### F4 — Evidence mode + layer panel contradiction — **HIGH**

In Point/AOI mode, fills go neutral regardless of toggles, but **LayerControls remain fully interactive**. Toggling score/T@depth appears broken. Legend explains neutrality; the panel does not.

**Impact:** Users thrash toggles; conclude product is buggy.

**Fix direction:** Disable fill-mode controls in evidence mode with one-line reason; leave overlay toggles (points/basement) if still useful.

---

### F5 — Residual / honesty banner noise — **HIGH**

App header disclaimer + residual-risk banner + list cohort notes + detail metric banners + layer notes + legend notes. After Data Depth, residual banner is often **always on**. New layer panel adds another chrome block on the map.

| Symptom | Impact |
|---------|--------|
| First viewport = warnings before map reading | First-timers bounce; buyers skim past all honesty |
| Residual banner competes with ComparePanel | Decision tools pushed down |

**Fix direction:** Compact one-line residual (expand for detail); do not remove honesty — **collapse volume**.

---

### F6 — Toggle placement eats the map — **HIGH** (esp. mobile)

`.layer-controls` top-left + `.map-legend` bottom-left + MapLibre nav top-right. On narrow layouts (`max-width: 1100px`) map is ~45vh with stacked panes; layer card `width: min(220px, …)` covers West Texas. No collapse, no “Layers” affordance that hides when idle.

**Impact:** Mobile users cannot see the state they are coloring. Desktop users lose NW corner permanently.

---

### F7 — Jargon-first labels without onboarding — **MEDIUM**

Labels assume domain fluency: “Model T@depth”, “Screening score”, “Basement domains (heat context)”, “Measured thermal points”. No first-run hint that **fill modes replace each other** and overlays **stack**. No tooltip on score vs T@depth difference beyond Methodology.

**Impact:** Energy/land investors and first-time visitors toggle randomly; distrust scores.

---

### F8 — Basement under opaque county fill is invisible — **MEDIUM**

Basement draws under counties. With score/T@depth at ~0.88 opacity, basement is barely readable unless fills are off. UI never says “turn off county fill to inspect basement” or offers a temporary dim.

**Impact:** Basement toggle “does nothing” → users ignore heat-context geology (the whole point of the layer ship).

---

### F9 — Thermal points are mute dots — **MEDIUM**

Points render; no hover/popup for q/grad despite properties existing. Contrast with basement popup. Users cannot verify what they are looking at.

---

### F10 — Header action cluster cognitive load — **MEDIUM**

Point check · AOI check · search · Methodology share one dense `header-actions` row. Active toggles become “Point check: ON” text buttons. On mobile, header stacks and pushes explorer below fold.

**Impact:** Mode discovery competes with county search; accidental mode entry clears AOI/point state (by design) without strong confirmation.

---

### F11 — Focus/Ignore invisible on map — **MEDIUM**

Decision checklist is list-only. Map selection outline is single-county. Focus set of 3 never appears as map marks → the product’s “leave with a decision” moment is **not spatial**.

---

### F12 — Accessibility gaps — **LOW–MEDIUM**

| Gap | Note |
|-----|------|
| Layer checkboxes OK | Role=group present — keep |
| Color-only score/heat encoding | Opacity helps score; heat palette still color-dependent |
| Popup HTML for basement | Not keyboard-reachable |
| Compare / residual not skip-link structured | Keyboard path long |

---

### F13 — Performance *feel* (UI perception) — **LOW**

Multiple GeoJSON loads (prospects, thermal points, basement, optional features). Overlay toggles feel instant after load; first paint + residual banner + Compare can feel “heavy chrome, slow meaning.” Not a proven FPS issue — a **perceived** clutter tax.

---

## Red summary table

| ID | Failure | Severity |
|----|---------|----------|
| F1 | Score/T@depth checkboxes imply independent fills | CRITICAL |
| F2 | Legend missing overlays + weak score scale | CRITICAL |
| F3 | Cohort list ≠ map universe | HIGH |
| F4 | Evidence mode vs live fill toggles | HIGH |
| F5 | Residual/honesty banner fatigue | HIGH |
| F6 | Layer panel placement / mobile cover | HIGH |
| F7 | Jargon without fill-mode onboarding | MEDIUM |
| F8 | Basement hidden under opaque fill | MEDIUM |
| F9 | Thermal points without value popups | MEDIUM |
| F10 | Header mode clutter | MEDIUM |
| F11 | Focus/Ignore not on map | MEDIUM |
| F12 | A11y / color-only heat | LOW–MEDIUM |
| F13 | Chrome weight → slow-meaning feel | LOW |

---

## What red refuses to soften

Do **not** call the layer ship “done UX.” Capability shipped; **map literacy did not**. Until F1–F2 and at least one of F3/F4/F5/F6 land, overlays remain a GIS demo bolted onto a decision tool.
