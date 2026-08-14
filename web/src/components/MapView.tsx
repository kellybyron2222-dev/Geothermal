import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  type LayerToggles,
} from './LayerControls'

export type EvidenceMode = 'county' | 'point' | 'aoi'

export interface SiteClickEvent {
  lat: number
  lon: number
  countyFips: string | null
  countyName: string | null
  countyRank: number | null
  countyScore: number | null
}

export interface AoiMapClickEvent {
  lat: number
  lon: number
  countyFips: string | null
  countyName: string | null
  countyRank: number | null
  countyScore: number | null
}

interface Props {
  selectedFips: string | null
  evidenceMode: EvidenceMode
  siteMarker: { lat: number; lon: number } | null
  aoiRing: [number, number][] | null
  draftVertices: [number, number][] | null
  onSelectCounty: (fips: string) => void
  onSiteClick: (evt: SiteClickEvent) => void
  onAoiMapClick: (evt: AoiMapClickEvent) => void
  /** Close AOI draft when ≥3 vertices (same handler as panel Close / Enter). */
  onAoiClosePolygon?: () => void
  /**
   * FIPS in the active list cohort. When set, non-matching counties are dimmed.
   * Null/undefined = no cohort dimming (show all Texas counties equally).
   */
  visibleFips?: string[] | null
  /** Controlled map layer toggles (owned by left rail). */
  layers: LayerToggles
}

const BASE = import.meta.env.BASE_URL
const GEOJSON_URL = `${BASE}data/prospects.geojson`
const THERMAL_POINTS_URL = `${BASE}data/thermal_points.json`
const THERMAL_SURFACE_URL = `${BASE}data/thermal_surface.geojson`
const GEOLOGY_UNITS_URL = `${BASE}data/geology_units.geojson`
const GEOLOGY_FAULTS_URL = `${BASE}data/geology_faults.geojson`

/** Heat-flow (mW/m²) relative scale — low → high (TX IHFC distribution ~p10–p90). */
export const HEAT_FLOW_COLOR_STOPS: { value: number; color: string }[] = [
  { value: 35, color: '#2f5f8a' },
  { value: 45, color: '#7eb8c9' },
  { value: 55, color: '#f0e6c8' },
  { value: 65, color: '#e89a3c' },
  { value: 80, color: '#c23b2e' },
  { value: 100, color: '#5c0a18' },
]

const HEAT_FLOW_COLOR: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['get', 'q'],
  ...HEAT_FLOW_COLOR_STOPS.flatMap((s) => [s.value, s.color]),
]

const SURFACE_Q_COLOR: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['get', 'value'],
  ...HEAT_FLOW_COLOR_STOPS.flatMap((s) => [s.value, s.color]),
]

const TEXAS_BOUNDS: [[number, number], [number, number]] = [
  [-106.7, 25.8],
  [-93.5, 36.6],
]

/** Score color stops — keep legend anchors in sync. */
export const SCORE_COLOR_STOPS: { value: number; color: string }[] = [
  { value: 20, color: '#f0f0eb' },
  { value: 40, color: '#c8ddd0' },
  { value: 55, color: '#7fad8f' },
  { value: 70, color: '#3d7a52' },
  { value: 85, color: '#1f4d32' },
]

const SCORE_COLOR: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['get', 'screeningScore'],
  ...SCORE_COLOR_STOPS.flatMap((s) => [s.value, s.color]),
]

/** Full paint for live thermal modes; heat-flow muted; missing nearly blank. */
const METRIC_OPACITY: maplibregl.ExpressionSpecification = [
  'match',
  ['get', 'thermalMetric'],
  'gradient_C_per_km',
  0.88,
  'tdepth_C_km4',
  0.88,
  'heat_flow_mWm2',
  0.42,
  0.12,
]

/** Heat palette stops for county mean model T@depth (°C). */
export const TDEPTH_COLOR_STOPS: { value: number; color: string }[] = [
  { value: 90, color: '#f7f4ea' },
  { value: 110, color: '#f0c36a' },
  { value: 125, color: '#e07a3d' },
  { value: 140, color: '#c23b2e' },
  { value: 155, color: '#7a1520' },
]

const TDEPTH_COLOR: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['coalesce', ['get', 'tdepthMean'], 0],
  ...TDEPTH_COLOR_STOPS.flatMap((s) => [s.value, s.color]),
]

/** High opacity when tdepthMean present; pale when missing. */
const TDEPTH_OPACITY: maplibregl.ExpressionSpecification = [
  'case',
  ['==', ['typeof', ['get', 'tdepthMean']], 'number'],
  0.88,
  0.12,
]

const NEUTRAL_FILL = '#d8d6d0'
const COHORT_DIM_OPACITY = 0.07

const EMPTY_FC: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

const SCORE_OUTLINE_COLOR: maplibregl.ExpressionSpecification = [
  'match',
  ['get', 'thermalMetric'],
  'gradient_C_per_km',
  '#1f4d32',
  'tdepth_C_km4',
  '#1f4d32',
  'heat_flow_mWm2',
  '#9a7b3c',
  '#889088',
]

const SCORE_OUTLINE_WIDTH: maplibregl.ExpressionSpecification = [
  'match',
  ['get', 'thermalMetric'],
  'gradient_C_per_km',
  0.7,
  'tdepth_C_km4',
  0.7,
  'heat_flow_mWm2',
  0.45,
  0.35,
]

function withCohortDim(
  opacity: maplibregl.ExpressionSpecification | number,
  visibleFips: string[] | null | undefined,
): maplibregl.ExpressionSpecification | number {
  if (!visibleFips || visibleFips.length === 0) return opacity
  return [
    'case',
    ['in', ['get', 'countyFips'], ['literal', visibleFips]],
    opacity,
    COHORT_DIM_OPACITY,
  ]
}

/**
 * County fill rule (exclusive modes):
 * - score → screeningScore palette
 * - tdepth → model T@depth heat palette
 * - outlines → transparent fill, keep outlines
 * Evidence (point/AOI) mode forces neutral fill regardless of fill mode.
 * When visibleFips is set, non-cohort counties are dimmed.
 */
function applyCountyFillPaint(
  map: maplibregl.Map,
  layers: LayerToggles,
  evidenceActive: boolean,
  visibleFips: string[] | null | undefined,
) {
  if (!map.getLayer('counties-fill')) return

  if (evidenceActive) {
    map.setPaintProperty('counties-fill', 'fill-color', NEUTRAL_FILL)
    map.setPaintProperty('counties-fill', 'fill-opacity', 0.18)
    map.setPaintProperty('counties-outline', 'line-color', '#889088')
    map.setPaintProperty('counties-outline', 'line-width', 0.4)
    return
  }

  const cohortFips = visibleFips && visibleFips.length > 0 ? visibleFips : null
  const overlayDim = layers.geology ? 0.45 : 1

  if (layers.fill === 'tdepth') {
    map.setPaintProperty('counties-fill', 'fill-color', TDEPTH_COLOR)
    map.setPaintProperty(
      'counties-fill',
      'fill-opacity',
      withCohortDim(
        ['*', TDEPTH_OPACITY, overlayDim] as maplibregl.ExpressionSpecification,
        cohortFips,
      ),
    )
    map.setPaintProperty('counties-outline', 'line-color', '#8a4a28')
    map.setPaintProperty('counties-outline', 'line-width', 0.55)
  } else if (layers.fill === 'score') {
    map.setPaintProperty('counties-fill', 'fill-color', SCORE_COLOR)
    map.setPaintProperty(
      'counties-fill',
      'fill-opacity',
      withCohortDim(
        ['*', METRIC_OPACITY, overlayDim] as maplibregl.ExpressionSpecification,
        cohortFips,
      ),
    )
    map.setPaintProperty('counties-outline', 'line-color', SCORE_OUTLINE_COLOR)
    map.setPaintProperty('counties-outline', 'line-width', SCORE_OUTLINE_WIDTH)
  } else {
    map.setPaintProperty('counties-fill', 'fill-color', '#ffffff')
    map.setPaintProperty('counties-fill', 'fill-opacity', 0)
    map.setPaintProperty('counties-outline', 'line-color', SCORE_OUTLINE_COLOR)
    map.setPaintProperty('counties-outline', 'line-width', SCORE_OUTLINE_WIDTH)
  }
}

function setLayerVisibility(map: maplibregl.Map, id: string, visible: boolean) {
  if (!map.getLayer(id)) return
  map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildAoiGeoJson(
  aoiRing: [number, number][] | null,
  draftVertices: [number, number][] | null,
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = []

  if (aoiRing && aoiRing.length >= 4) {
    features.push({
      type: 'Feature',
      properties: { kind: 'aoi' },
      geometry: { type: 'Polygon', coordinates: [aoiRing] },
    })
  }

  if (draftVertices && draftVertices.length >= 2) {
    features.push({
      type: 'Feature',
      properties: { kind: 'draft-line' },
      geometry: { type: 'LineString', coordinates: draftVertices },
    })
  }

  if (draftVertices && draftVertices.length >= 1) {
    features.push({
      type: 'Feature',
      properties: { kind: 'draft-verts' },
      geometry: {
        type: 'MultiPoint',
        coordinates: draftVertices,
      },
    })
  }

  return { type: 'FeatureCollection', features }
}

function thermalPointsToGeoJson(
  points: Array<{ lat: number; lon: number; q?: number | null }>,
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: points
      .filter((p) => p.q != null && !Number.isNaN(p.q))
      .map((p, i) => ({
        type: 'Feature' as const,
        id: i,
        properties: { q: p.q },
        geometry: {
          type: 'Point' as const,
          coordinates: [p.lon, p.lat],
        },
      })),
  }
}

function fillModeLabel(fill: LayerToggles['fill']): string {
  if (fill === 'tdepth') return 'Model T@depth (°C)'
  if (fill === 'outlines') return 'Outlines only'
  return 'Screening score'
}

export function MapView({
  selectedFips,
  evidenceMode,
  siteMarker,
  aoiRing,
  draftVertices,
  onSelectCounty,
  onSiteClick,
  onAoiMapClick,
  onAoiClosePolygon,
  visibleFips = null,
  layers,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const evidenceModeRef = useRef(evidenceMode)
  const draftVerticesRef = useRef(draftVertices)
  const aoiRingRef = useRef(aoiRing)
  const onSelectCountyRef = useRef(onSelectCounty)
  const onSiteClickRef = useRef(onSiteClick)
  const onAoiMapClickRef = useRef(onAoiMapClick)
  const onAoiClosePolygonRef = useRef(onAoiClosePolygon)
  const layersRef = useRef<LayerToggles>(layers)
  const visibleFipsRef = useRef<string[] | null>(visibleFips ?? null)
  const geologyLoadedRef = useRef(false)

  evidenceModeRef.current = evidenceMode
  draftVerticesRef.current = draftVertices
  aoiRingRef.current = aoiRing
  onSelectCountyRef.current = onSelectCounty
  onSiteClickRef.current = onSiteClick
  onAoiMapClickRef.current = onAoiMapClick
  onAoiClosePolygonRef.current = onAoiClosePolygon
  layersRef.current = layers
  visibleFipsRef.current = visibleFips ?? null

  const evidenceActive = evidenceMode === 'point' || evidenceMode === 'aoi'
  const cohortDimActive =
    !evidenceActive && Boolean(visibleFips && visibleFips.length > 0)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const container = containerRef.current
    const map = new maplibregl.Map({
      container,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      bounds: TEXAS_BOUNDS,
      fitBoundsOptions: { padding: 28, duration: 0 },
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    mapRef.current = map
    popupRef.current = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: '220px',
    })

    const resize = () => map.resize()
    resize()
    requestAnimationFrame(resize)
    const ro = new ResizeObserver(() => resize())
    ro.observe(container)

    map.on('load', () => {
      resize()
      map.fitBounds(TEXAS_BOUNDS, { padding: 28, duration: 0 })

      // Surface geology under counties (Barnes 1992 / DS 170 — context only).
      map.addSource('geology-units', {
        type: 'geojson',
        data: EMPTY_FC,
      })
      map.addSource('geology-faults', {
        type: 'geojson',
        data: EMPTY_FC,
      })
      map.addLayer({
        id: 'geology-fill',
        type: 'fill',
        source: 'geology-units',
        layout: { visibility: 'none' },
        paint: {
          'fill-color': ['coalesce', ['get', 'color'], '#b0a898'],
          'fill-opacity': 0.55,
        },
      })
      map.addLayer({
        id: 'geology-outline',
        type: 'line',
        source: 'geology-units',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#5a5046',
          'line-width': 0.35,
          'line-opacity': 0.35,
        },
      })
      map.addLayer({
        id: 'geology-faults',
        type: 'line',
        source: 'geology-faults',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#3a2a1a',
          'line-width': 0.9,
          'line-opacity': 0.75,
        },
      })

      map.addSource('counties', {
        type: 'geojson',
        data: GEOJSON_URL,
        promoteId: 'countyFips',
      })

      map.addLayer({
        id: 'counties-fill',
        type: 'fill',
        source: 'counties',
        paint: {
          'fill-color': SCORE_COLOR,
          'fill-opacity': METRIC_OPACITY,
        },
      })

      map.addLayer({
        id: 'counties-outline',
        type: 'line',
        source: 'counties',
        paint: {
          'line-color': SCORE_OUTLINE_COLOR,
          'line-width': SCORE_OUTLINE_WIDTH,
          'line-opacity': 0.65,
        },
      })

      map.addLayer({
        id: 'counties-selected',
        type: 'line',
        source: 'counties',
        paint: {
          'line-color': '#0b1f14',
          'line-width': 2.5,
        },
        filter: ['==', ['get', 'countyFips'], ''],
      })

      map.addSource('thermal-points', {
        type: 'geojson',
        data: EMPTY_FC,
      })
      map.addLayer({
        id: 'thermal-points',
        type: 'circle',
        source: 'thermal-points',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 3.4,
          'circle-color': HEAT_FLOW_COLOR,
          'circle-opacity': 0.9,
          'circle-stroke-width': 0.6,
          'circle-stroke-color': '#ffffff',
        },
      })

      map.addSource('thermal-surface', {
        type: 'geojson',
        data: EMPTY_FC,
      })
      map.addLayer({
        id: 'thermal-surface-q',
        type: 'fill',
        source: 'thermal-surface',
        filter: ['==', ['get', 'metric'], 'heat_flow_mWm2'],
        layout: { visibility: 'none' },
        paint: {
          'fill-color': SURFACE_Q_COLOR,
          'fill-opacity': 0.48,
        },
      })

      map.addSource('aoi-draw', {
        type: 'geojson',
        data: EMPTY_FC,
      })

      map.addLayer({
        id: 'aoi-fill',
        type: 'fill',
        source: 'aoi-draw',
        filter: ['==', ['get', 'kind'], 'aoi'],
        paint: {
          'fill-color': '#2f6b45',
          'fill-opacity': 0.18,
        },
      })

      map.addLayer({
        id: 'aoi-outline',
        type: 'line',
        source: 'aoi-draw',
        filter: ['==', ['get', 'kind'], 'aoi'],
        paint: {
          'line-color': '#1f4d32',
          'line-width': 2,
        },
      })

      map.addLayer({
        id: 'aoi-draft-line',
        type: 'line',
        source: 'aoi-draw',
        filter: ['==', ['get', 'kind'], 'draft-line'],
        paint: {
          'line-color': '#1f4d32',
          'line-width': 2,
          'line-dasharray': [1.5, 1.5],
        },
      })

      map.addLayer({
        id: 'aoi-draft-verts',
        type: 'circle',
        source: 'aoi-draw',
        filter: ['==', ['get', 'kind'], 'draft-verts'],
        paint: {
          'circle-radius': 5,
          'circle-color': '#1f4d32',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
        },
      })

      // Load measured thermal points once.
      fetch(THERMAL_POINTS_URL)
        .then((r) => {
          if (!r.ok) throw new Error(`thermal_points.json (${r.status})`)
          return r.json()
        })
        .then((payload: { points?: Array<{ lat: number; lon: number }> }) => {
          const src = map.getSource('thermal-points') as maplibregl.GeoJSONSource | undefined
          if (src) src.setData(thermalPointsToGeoJson(payload.points ?? []))
        })
        .catch(() => {
          /* points stay empty; toggle still works with no features */
        })

      fetch(THERMAL_SURFACE_URL)
        .then((r) => {
          if (!r.ok) throw new Error(`thermal_surface.geojson (${r.status})`)
          return r.json()
        })
        .then((gj: GeoJSON.FeatureCollection) => {
          const src = map.getSource('thermal-surface') as maplibregl.GeoJSONSource | undefined
          if (src) src.setData(gj)
        })
        .catch(() => {
          /* surface unavailable — toggle shows empty */
        })

      map.on('click', (e) => {
        if (
          layersRef.current.thermalPoints &&
          map.getLayoutProperty('thermal-points', 'visibility') === 'visible'
        ) {
          const tFeats = map.queryRenderedFeatures(e.point, { layers: ['thermal-points'] })
          const props = tFeats[0]?.properties
          if (props && popupRef.current) {
            const q = props.q != null && props.q !== '' ? Number(props.q) : null
            const lines: string[] = [
              '<strong>IHFC heat flow</strong>',
              '<div class="muted tiny">Measured q (mW/m²) — not BHT, not gradient</div>',
            ]
            if (q != null && !Number.isNaN(q)) {
              lines.push(`${q.toFixed(1)} mW/m²`)
            }
            popupRef.current.setLngLat(e.lngLat).setHTML(lines.join('<br/>')).addTo(map)
            return
          }
        }

        if (
          layersRef.current.geology &&
          map.getLayoutProperty('geology-fill', 'visibility') === 'visible'
        ) {
          const gFeats = map.queryRenderedFeatures(e.point, { layers: ['geology-fill'] })
          const gp = gFeats[0]?.properties
          if (gp && popupRef.current) {
            const unit = typeof gp.unit === 'string' ? gp.unit : ''
            const label = typeof gp.label === 'string' ? gp.label : ''
            const era = typeof gp.era === 'string' ? gp.era : ''
            const lines = [
              `<strong>${escapeHtml(unit || label || 'Geologic unit')}</strong>`,
              '<div class="muted tiny">Barnes 1992 / USGS DS 170 — not in ranking</div>',
            ]
            if (label) lines.push(`Map label: ${escapeHtml(label)}`)
            if (era) lines.push(`Era group: ${escapeHtml(era)}`)
            popupRef.current.setLngLat(e.lngLat).setHTML(lines.join('<br/>')).addTo(map)
            // Fall through so county select still works under geology
          }
        }

        const feats = map.queryRenderedFeatures(e.point, { layers: ['counties-fill'] })
        const props = feats[0]?.properties
        const fips = typeof props?.countyFips === 'string' ? props.countyFips : null
        const name = typeof props?.name === 'string' ? props.name : null
        const rank = typeof props?.rank === 'number' ? props.rank : Number(props?.rank)
        const score =
          typeof props?.screeningScore === 'number'
            ? props.screeningScore
            : Number(props?.screeningScore)

        const countyBits = {
          countyFips: fips,
          countyName: name,
          countyRank: Number.isFinite(rank) ? rank : null,
          countyScore: Number.isFinite(score) ? score : null,
        }

        const mode = evidenceModeRef.current
        if (mode === 'point') {
          onSiteClickRef.current({
            lat: e.lngLat.lat,
            lon: e.lngLat.lng,
            ...countyBits,
          })
          return
        }

        if (mode === 'aoi') {
          onAoiMapClickRef.current({
            lat: e.lngLat.lat,
            lon: e.lngLat.lng,
            ...countyBits,
          })
          return
        }

        if (fips) onSelectCountyRef.current(fips)
      })

      map.on('dblclick', (e) => {
        if (evidenceModeRef.current !== 'aoi') return
        if (aoiRingRef.current) return
        const draft = draftVerticesRef.current
        if (!draft || draft.length < 3) return
        e.preventDefault()
        onAoiClosePolygonRef.current?.()
      })

      map.on('mouseenter', 'counties-fill', () => {
        const mode = evidenceModeRef.current
        map.getCanvas().style.cursor =
          mode === 'point' || mode === 'aoi' ? 'crosshair' : 'pointer'
      })
      map.on('mouseleave', 'counties-fill', () => {
        const mode = evidenceModeRef.current
        map.getCanvas().style.cursor =
          mode === 'point' || mode === 'aoi' ? 'crosshair' : ''
      })

      applyCountyFillPaint(map, layersRef.current, false, visibleFipsRef.current)
    })

    return () => {
      ro.disconnect()
      markerRef.current?.remove()
      markerRef.current = null
      popupRef.current?.remove()
      popupRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.getCanvas().style.cursor = evidenceActive ? 'crosshair' : ''

    if (evidenceMode === 'aoi') map.doubleClickZoom.disable()
    else map.doubleClickZoom.enable()

    const apply = () =>
      applyCountyFillPaint(map, layersRef.current, evidenceActive, visibleFipsRef.current)
    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [evidenceActive, evidenceMode])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const apply = () => {
      applyCountyFillPaint(map, layers, evidenceActive, visibleFips)
      setLayerVisibility(map, 'thermal-points', layers.thermalPoints)
      setLayerVisibility(map, 'thermal-surface-q', layers.thermalSurface)
      setLayerVisibility(map, 'geology-fill', layers.geology)
      setLayerVisibility(map, 'geology-outline', layers.geology)
      setLayerVisibility(map, 'geology-faults', layers.geology)
    }

    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [layers, evidenceActive, visibleFips])

  // Lazy-load Barnes geology only when the overlay is first turned on.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !layers.geology || geologyLoadedRef.current) return

    let cancelled = false
    Promise.all([
      fetch(GEOLOGY_UNITS_URL).then((r) => {
        if (!r.ok) throw new Error(`geology_units.geojson (${r.status})`)
        return r.json()
      }),
      fetch(GEOLOGY_FAULTS_URL).then((r) => {
        if (!r.ok) throw new Error(`geology_faults.geojson (${r.status})`)
        return r.json()
      }),
    ])
      .then(([units, faults]) => {
        if (cancelled) return
        const uSrc = map.getSource('geology-units') as maplibregl.GeoJSONSource | undefined
        const fSrc = map.getSource('geology-faults') as maplibregl.GeoJSONSource | undefined
        if (uSrc) uSrc.setData(units as GeoJSON.FeatureCollection)
        if (fSrc) fSrc.setData(faults as GeoJSON.FeatureCollection)
        geologyLoadedRef.current = true
      })
      .catch(() => {
        /* geology stays empty if assets missing */
      })

    return () => {
      cancelled = true
    }
  }, [layers.geology])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedFips || evidenceActive) return
    const apply = () => {
      if (!map.getLayer('counties-selected')) return
      map.setFilter('counties-selected', ['==', ['get', 'countyFips'], selectedFips])
    }
    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [selectedFips, evidenceActive])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (evidenceMode !== 'point' || !siteMarker) {
      markerRef.current?.remove()
      markerRef.current = null
      return
    }

    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({ color: '#1f4d32' })
        .setLngLat([siteMarker.lon, siteMarker.lat])
        .addTo(map)
    } else {
      markerRef.current.setLngLat([siteMarker.lon, siteMarker.lat])
    }
  }, [siteMarker, evidenceMode])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const data = buildAoiGeoJson(aoiRing, draftVertices)
    const apply = () => {
      const src = map.getSource('aoi-draw') as maplibregl.GeoJSONSource | undefined
      if (src) src.setData(data)
    }
    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [aoiRing, draftVertices])

  const activeFillLabel = evidenceActive
    ? evidenceMode === 'point'
      ? 'Point check — neutral basemap'
      : 'AOI check — neutral basemap'
    : fillModeLabel(layers.fill)

  const legendScore = !evidenceActive && layers.fill === 'score'
  const legendHeat = !evidenceActive && layers.fill === 'tdepth'
  const legendOutlines = !evidenceActive && layers.fill === 'outlines'
  const showThermalSwatch = layers.thermalPoints
  const showThermalSurface = layers.thermalSurface
  const showGeology = layers.geology

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map-canvas" />
      {cohortDimActive && (
        <div className="map-cohort-strip" role="status">
          List filtered by cohort · non-matching counties muted on map
        </div>
      )}
      <div className="map-legend">
        <div className="legend-title">{activeFillLabel}</div>
        {legendScore && (
          <>
            <div className="legend-bar" />
            <div className="legend-scale legend-scale-anchors">
              {SCORE_COLOR_STOPS.map((s) => (
                <span key={s.value}>{s.value}</span>
              ))}
            </div>
            <div className="legend-note">
              Full opacity = T@depth / gradient · muted = heat-flow fallback · pale =
              no thermal
            </div>
          </>
        )}
        {legendHeat && (
          <>
            <div className="legend-bar legend-bar-heat" />
            <div className="legend-scale legend-scale-anchors">
              {TDEPTH_COLOR_STOPS.map((s) => (
                <span key={s.value}>{s.value}°</span>
              ))}
            </div>
            <div className="legend-note">County mean model T@depth — not measured BHT</div>
          </>
        )}
        {legendOutlines && (
          <div className="legend-note">County fill off — outlines retained</div>
        )}
        {evidenceActive && (
          <div className="legend-note">
            {evidenceMode === 'point'
              ? 'Score fill off — evidence only, not site quality'
              : 'Score fill off — evidence only, not AOI quality'}
          </div>
        )}
        {(showThermalSwatch || showThermalSurface || showGeology) && (
          <div className="legend-overlays">
            {(showThermalSwatch || showThermalSurface) && (
              <>
                <div className="legend-note">Heat flow (mW/m²) — low → high</div>
                <div className="legend-bar legend-bar-heatflow" />
                <div className="legend-scale legend-scale-anchors">
                  {HEAT_FLOW_COLOR_STOPS.map((s) => (
                    <span key={s.value}>{s.value}</span>
                  ))}
                </div>
                <div className="legend-note">
                  IHFC q only — not BHT
                  {showThermalSurface ? ' · surface IDW ≤25 km, ≥2 controls' : ''}
                </div>
              </>
            )}
            {showGeology && (
              <>
                <div className="legend-swatch-row">
                  <span className="legend-swatch legend-swatch-geo-cenozoic" aria-hidden />
                  <span>Cenozoic</span>
                </div>
                <div className="legend-swatch-row">
                  <span className="legend-swatch legend-swatch-geo-mesozoic" aria-hidden />
                  <span>Mesozoic</span>
                </div>
                <div className="legend-swatch-row">
                  <span className="legend-swatch legend-swatch-geo-paleozoic" aria-hidden />
                  <span>Paleozoic</span>
                </div>
                <div className="legend-swatch-row">
                  <span className="legend-swatch legend-swatch-geo-precambrian" aria-hidden />
                  <span>Precambrian</span>
                </div>
                <div className="legend-note">Barnes 1992 surface geology — not ranked</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
