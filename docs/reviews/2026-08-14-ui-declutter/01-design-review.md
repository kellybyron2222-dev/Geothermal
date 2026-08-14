# UI declutter — design review (2026-08-14)

**Scope:** Calm chrome around the map. Progressive disclosure. No Phase 3. No capability removal.

## Goal

Map-first explorer: same Point / AOI / Compare / Focus / Ignore / Layers / Methodology, less always-on ink.

## NOW decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Header | Short title; disclaimer off chrome; Tools `<details>` for Point / AOI / Methodology / Data notes; search stays visible in county mode | Stops four equal linkish buttons fighting the title |
| Compare | Mount only when slots or hint exist | Empty panel stole vertical map space on every load |
| Residual / Data Depth | No large banner when status is accepted/live; quiet “Data notes” in Tools → Methodology | Residual text already lives on Methodology |
| Detail panel | Summary-first; Factors / Limitations behind `<details>`; Why open, Factors closed | Decision glance without scrolling factor tables |
| Ranked list | Focus/Ignore only on selected (and hover); other rows = rank / name / score / metric chip | Checklist actions stay, list reads as ranks not a button farm |
| CSS | Tighter header/banner padding; no new card farms / purple / glow | Returns vertical space to the map |

## Explicit non-goals

- Phase 3 opportunity generation
- Removing Focus/Ignore caps or Compare behavior
- Relocating map Layers control (already map-local)

## Judgment

**Build/fix now** — this pass only. Re-evaluate after `npm run build` + visual check.
