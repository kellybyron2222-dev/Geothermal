# UI declutter — NOW applied (2026-08-14)

## Changes

### 1. Slim header (`App.tsx` + CSS)
- Title shortened to **Texas Next-Gen Screening**
- Long disclaimer removed from always-visible header
- Point check, AOI check, About / Methodology, and Data notes grouped under **Tools** disclosure
- County search remains visible in county mode
- Summary label reflects active mode (`Tools · Point` / `Tools · AOI`)

### 2. Hide empty Compare (`App.tsx` + `ComparePanel.tsx`)
- Compare mounts only when `compareSlots.length > 0` **or** `compareHint` is set
- Empty state with no hint → zero height (component returns `null`)

### 3. Quiet residual / Data Depth chrome (`App.tsx`)
- Large residual banner suppressed for accepted/live statuses (e.g. `thermal_spine_live_rrc_proxy_accepted`)
- Replaced with **Data notes** under Tools → opens Methodology (full residual text)
- Pending/partial risk statuses still get a residual banner; error/loading banners unchanged

### 4. Detail panel summary-first (`DetailPanel.tsx`)
- Default: name, rank, score, confidence, compact risk chips, metric chip, top 1–2 drivers
- **Why this rank** (open), **Factors** (closed), **Limitations** (closed) via `<details>`
- Factor tables, thermal companions, infra notes, full limitations preserved

### 5. Calm list rows (`RankedCountyList.tsx`)
- Non-selected rows: rank, name, score, one metric chip
- Focus / Ignore shown on selected row (and hover); caps/behavior unchanged
- Selected row keeps confidence + Model/Meas chips

### 6. CSS (`index.css`)
- Tighter header / banner padding; tools dropdown styles; detail-section disclosure; quieter row marks
- No purple / glow / card-farm additions

## Docs
- `docs/reviews/2026-08-14-ui-declutter/01-design-review.md`
- `docs/reviews/2026-08-14-ui-declutter/02-now-applied.md` (this file)

## Verify
- `npm run build` in `web/` must pass
