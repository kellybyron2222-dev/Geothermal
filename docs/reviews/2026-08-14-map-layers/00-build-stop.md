# Layer build stop — basement domains + heat toggles (2026-08-14)

## Confirmation (science)

Heat distribution in Texas sedimentary basins is driven mainly by:

1. **Crystalline basement** radiogenic heat production (granitic / sialic domains)
2. Mantle heat flux through the crust
3. Secondary: sedimentary radiogenic contribution + groundwater advection

**Surface “bedrock” / GAT sedimentary geology is not the primary heat control.**  
We therefore ship **USGS DS-898 basement domains** (TX clip: Great Plains, Mazatzal, Shawnee, Sabine) as the 2D heat-context geology layer — **not** surface formation maps.

## Build shipped (then STOP)

| Item | Status |
|------|--------|
| `scoring/export_basement_domains.py` | Live |
| `web/public/data/basement_domains.geojson` + `basement_meta.json` | Live |
| Map toggles: Screening score / Model T@depth / Measured thermal points / Basement domains | Live |
| In ScreeningScore? | **No** |
| `npm run build` | Pass |

## Explicit STOP

Layer feature slice complete. Next: UI/UX 1000-persona iterative loop (separate).
