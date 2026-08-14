import { useEffect, useMemo, useRef, useState } from 'react'
import type { ScreeningCounty, ScreeningMeta } from '../types/screening'
import {
  EXPORT_FORMAT,
  PROSPECT_RULES_TEXT,
  RULES_VERSION,
  WATCH_CAP,
  applyProspectRules,
  buildDigest,
  exportWatchlist,
  formatPublishPackLabel,
  getPublishId,
  importWatchlist,
  markSeen,
  saveStore,
  toggleWatch,
  type DigestItem,
  type DigestResult,
  type Phase3Store,
} from '../lib/phase3'

interface Props {
  counties: ScreeningCounty[]
  meta: ScreeningMeta
  store: Phase3Store
  onStoreChange: (next: Phase3Store) => void
  selectedFips: string | null
  onSelectCounty: (fips: string) => void
  onClose?: () => void
}

function DigestList({
  items,
  selectedFips,
  onSelectCounty,
}: {
  items: DigestItem[]
  selectedFips: string | null
  onSelectCounty: (fips: string) => void
}) {
  if (items.length === 0) {
    return <p className="muted tiny">No changes among watched counties.</p>
  }
  return (
    <ul className="phase3-list">
      {items.map((it, i) => (
        <li key={`${it.countyFips}-${it.kind}-${i}`}>
          <button
            type="button"
            className={
              it.countyFips === selectedFips
                ? 'phase3-row selected'
                : 'phase3-row'
            }
            onClick={() => onSelectCounty(it.countyFips)}
          >
            <span className="phase3-row-main">
              <span className="phase3-kind">{it.kind}</span> {it.name}
            </span>
            <span className="muted tiny">{it.summary}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function Phase3Panel({
  counties,
  meta,
  store,
  onStoreChange,
  selectedFips,
  onSelectCounty,
  onClose,
}: Props) {
  const publishId = getPublishId(meta)
  const pack = formatPublishPackLabel(publishId)
  const methodologyVersion = meta.methodologyVersion ?? '—'
  const [digest, setDigest] = useState<DigestResult | null>(null)
  const [watchHint, setWatchHint] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const watchedCounties = useMemo(() => {
    const by = new Map(counties.map((c) => [c.countyFips, c]))
    return store.watchlist
      .map((fips) => by.get(fips))
      .filter((c): c is ScreeningCounty => Boolean(c))
      .sort((a, b) => a.rank - b.rank)
  }, [counties, store.watchlist])

  const candidatesAll = useMemo(() => applyProspectRules(counties), [counties])
  const candidates = useMemo(() => candidatesAll.slice(0, 12), [candidatesAll])

  const runDigest = () => {
    const result = buildDigest({
      currentPublishId: publishId,
      methodologyVersion,
      counties,
      store,
    })
    setDigest(result)
  }

  // P3-6: auto-run digest once when panel opens (component remounts each open)
  useEffect(() => {
    setDigest(
      buildDigest({
        currentPublishId: publishId,
        methodologyVersion,
        counties,
        store,
      }),
    )
    // Intentionally once on mount — Refresh digest / Mark as seen handle later updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onMarkSeen = () => {
    const next = markSeen(store, {
      publishId,
      methodologyVersion,
      counties,
    })
    saveStore(next)
    onStoreChange(next)
    setDigest(
      buildDigest({
        currentPublishId: publishId,
        methodologyVersion,
        counties,
        store: next,
      }),
    )
  }

  const onExport = () => {
    const payload = exportWatchlist(store)
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${EXPORT_FORMAT}.json`
    a.click()
    URL.revokeObjectURL(url)
    setWatchHint('Exported watchlist JSON.')
  }

  const onImportFile = async (file: File | null) => {
    if (!file) return
    try {
      const text = await file.text()
      const parsed: unknown = JSON.parse(text)
      const preview = importWatchlist(parsed, {
        merge: false,
        current: store,
      })
      if (preview.error) {
        setWatchHint(preview.error)
        return
      }
      const nIn = preview.store.watchlist.length
      const nCur = store.watchlist.length
      const ok = window.confirm(
        `Replace current watchlist (${nCur} counties) and last-seen snapshot with import (${nIn} counties)? This cannot be undone except by re-importing a prior export.`,
      )
      if (!ok) {
        setWatchHint('Import cancelled.')
        return
      }
      const next = preview.store
      saveStore(next)
      onStoreChange(next)
      setWatchHint(
        preview.truncated
          ? `Imported (capped at ${WATCH_CAP}).`
          : `Imported ${next.watchlist.length} watched counties.`,
      )
      setDigest(
        buildDigest({
          currentPublishId: publishId,
          methodologyVersion,
          counties,
          store: next,
        }),
      )
    } catch {
      setWatchHint('Import failed — invalid JSON.')
    }
  }

  const removeWatch = (fips: string) => {
    const { store: next } = toggleWatch(fips, store)
    saveStore(next)
    onStoreChange(next)
    setWatchHint(null)
    setDigest(
      buildDigest({
        currentPublishId: publishId,
        methodologyVersion,
        counties,
        store: next,
      }),
    )
  }

  const digestStatusLine = (d: DigestResult): string => {
    if (d.status === 'county_deltas') {
      return `Methodology v${methodologyVersion} · ${d.items.length} change(s) among watched counties`
    }
    if (d.status === 'vintage_only') {
      return `Methodology v${methodologyVersion} · new published vintage — no changes among watched counties`
    }
    return `Methodology v${methodologyVersion} · no published updates since last seen`
  }

  return (
    <div className="detail-panel phase3-panel">
      <div className="phase3-header">
        {onClose && (
          <button type="button" className="linkish phase3-back" onClick={onClose}>
            ← Back to county
          </button>
        )}
        <h2>Watchlist / updates</h2>
        <p className="muted tiny">
          Ranked-list <strong>Focus</strong> is a session shortlist and does not feed this digest.
          Only <strong>Watch</strong> does.
        </p>
      </div>

      <section className="phase3-section">
        <h3>Publish pack</h3>
        <div className="phase3-vintage muted tiny">
          <div>
            <span className="label">{pack.label}</span>{' '}
            <code title={pack.fullId}>{pack.shortId}</code>
          </div>
          <div>
            <span className="label">methodology</span> v{methodologyVersion}
            {meta.phase3?.rulesVersion ? (
              <span> · rules {meta.phase3.rulesVersion}</span>
            ) : (
              <span> · rules {RULES_VERSION}</span>
            )}
          </div>
          {store.lastSeen && (
            <div>
              Last seen: {store.lastSeen.publishId === publishId ? 'current' : 'older'}{' '}
              vintage
              {store.lastSeen.seenAt
                ? ` · ${new Date(store.lastSeen.seenAt).toLocaleString()}`
                : ''}
            </div>
          )}
        </div>
      </section>

      <section className="phase3-section">
        <h3>
          Watchlist{' '}
          <span className="muted">
            ({store.watchlist.length}/{WATCH_CAP})
          </span>
        </h3>
        <p className="muted tiny">Local only — no accounts. Cap ≤{WATCH_CAP} counties.</p>
        <div className="phase3-actions">
          <button type="button" className="linkish" onClick={onExport}>
            Export JSON
          </button>
          <button
            type="button"
            className="linkish"
            onClick={() => fileRef.current?.click()}
          >
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="phase3-file-input"
            onChange={(e) => {
              void onImportFile(e.target.files?.[0] ?? null)
              e.target.value = ''
            }}
          />
        </div>
        {watchHint && <p className="muted tiny">{watchHint}</p>}
        {watchedCounties.length === 0 ? (
          <p className="muted">
            No watched counties. Open a county detail and use <strong>Watch</strong>.
          </p>
        ) : (
          <ul className="phase3-list">
            {watchedCounties.map((c) => (
              <li key={c.countyFips}>
                <div
                  className={
                    c.countyFips === selectedFips
                      ? 'phase3-row-static selected'
                      : 'phase3-row-static'
                  }
                >
                  <button
                    type="button"
                    className="phase3-row-link"
                    onClick={() => onSelectCounty(c.countyFips)}
                  >
                    <span>
                      #{c.rank} {c.name}
                    </span>
                    <span className="muted">{c.screeningScore.toFixed(1)}</span>
                  </button>
                  <button
                    type="button"
                    className="linkish phase3-remove"
                    onClick={() => removeWatch(c.countyFips)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="phase3-section">
        <h3>Change digest</h3>
        <p className="muted tiny">
          Runs when this panel opens. Compares published pack to your last-seen snapshot — not
          live grids.
        </p>
        <div className="phase3-actions">
          <button type="button" className="linkish" onClick={runDigest}>
            Refresh digest
          </button>
          {digest && (
            <button type="button" className="linkish" onClick={onMarkSeen}>
              Mark as seen
            </button>
          )}
        </div>
        {digest && (
          <div className="phase3-digest">
            <p className="muted tiny">{digestStatusLine(digest)}</p>
            {digest.status === 'county_deltas' ? (
              <DigestList
                items={digest.items}
                selectedFips={selectedFips}
                onSelectCounty={onSelectCounty}
              />
            ) : null}
          </div>
        )}
      </section>

      <section className="phase3-section">
        <h3>Rule candidates (v0)</h3>
        <p className="muted tiny phase3-honesty">
          Not a score · not Focus · rules {RULES_VERSION}
          {candidatesAll.length > 12
            ? ` · showing 12 of ${candidatesAll.length} matching`
            : candidatesAll.length > 0
              ? ` · ${candidatesAll.length} matching`
              : ''}
          {' · TexNet demoted'}
        </p>
        <pre className="phase3-rules">{PROSPECT_RULES_TEXT}</pre>
        {candidates.length === 0 ? (
          <p className="muted">No counties match frozen rules right now.</p>
        ) : (
          <ul className="phase3-list">
            {candidates.map((c) => (
              <li key={c.countyFips}>
                <button
                  type="button"
                  className={
                    c.countyFips === selectedFips
                      ? 'phase3-row selected'
                      : 'phase3-row'
                  }
                  onClick={() => onSelectCounty(c.countyFips)}
                >
                  <span className="phase3-row-main">
                    #{c.rank} {c.name}
                    {c.texnetCaution === true && (
                      <span className="phase3-texnet-badge" title="TexNet caution — badge + demote">
                        TexNet
                      </span>
                    )}
                  </span>
                  <span className="muted tiny">
                    {c.screeningScore.toFixed(1)} · {c.confidence}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
