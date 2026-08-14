# NOW fixes applied — UI/UX layers (N1–N6)

**Date:** 2026-08-14  
**Scope:** `web/` only · Phase 3 untouched · basement not in score  
**Source:** `04-judgment.md` · `05-persona-loop.md`

---

## Landed

| ID | Fix | Where | Behavior |
|----|-----|-------|----------|
| **N1** | Exclusive county fill | `LayerControls.tsx`, `MapView.tsx` | Radio group: **Screening score** \| **Model T@depth** \| **Outlines only**. Default = Screening score. Thermal points + basement remain independent overlay checkboxes. Paint uses `layers.fill` exclusively (no dual-checkbox lie). |
| **N2** | Complete legend | `MapView.tsx`, `index.css` | Active fill label always shown. Score mode: numeric anchors **20 / 40 / 55 / 70 / 85** (from `SCORE_COLOR_STOPS`). T@depth: **90° / 110° / 125° / 140° / 155°**. Overlay swatches when thermal points and/or basement are on. |
| **N3** | Evidence-mode honesty | `LayerControls.tsx`, `MapView.tsx` | Point/AOI: fill radios disabled + note “Evidence mode: county fill muted”. Map still forces neutral fill. Overlays stay toggleable. |
| **N4** | Cohort ↔ map sync | `App.tsx`, `MapView.tsx` | App passes `visibleFips` for the active cohort (null when cohort = all). Non-matching counties get lower fill-opacity. One-line strip: “List filtered by cohort · non-matching counties muted on map”. |
| **N5** | Compact residual banner | `App.tsx`, `index.css` | One strong line kept; residualRisk text behind **Details** expand. Honesty signal retained. |
| **N6** | Collapsible Layers | `LayerControls.tsx`, `index.css` | Collapse/Expand with `aria-expanded` / `aria-controls`. Default **expanded** when viewport &gt; 720px, **collapsed** at `max-width: 720px`. |

---

## Explicitly not changed

- Phase 3 / alerts / accounts
- Basement → ScreeningScore
- Thermal point popups (E1), basement auto-dim (E2), focus marks on map (E3), etc.

---

## Verify

- `npm run build` in `web/`
