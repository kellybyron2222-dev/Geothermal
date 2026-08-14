import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

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
}

const GEOJSON_URL = `${import.meta.env.BASE_URL}data/prospects.geojson`

const TEXAS_BOUNDS: [[number, number], [number, number]] = [
  [-106.7, 25.8],
  [-93.5, 36.6],
]

const SCORE_COLOR: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['get', 'screeningScore'],
  20,
  '#f0f0eb',
  40,
  '#c8ddd0',
  55,
  '#7fad8f',
  70,
  '#3d7a52',
  85,
  '#1f4d32',
]

/** Gradient full paint; heat-flow muted; missing thermal nearly blank. */
const METRIC_OPACITY: maplibregl.ExpressionSpecification = [
  'match',
  ['get', 'thermalMetric'],
  'gradient_C_per_km',
  0.88,
  'heat_flow_mWm2',
  0.42,
  0.12,
]

const NEUTRAL_FILL = '#d8d6d0'

const EMPTY_FC: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

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

export function MapView({
  selectedFips,
  evidenceMode,
  siteMarker,
  aoiRing,
  draftVertices,
  onSelectCounty,
  onSiteClick,
  onAoiMapClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const evidenceModeRef = useRef(evidenceMode)
  const onSelectCountyRef = useRef(onSelectCounty)
  const onSiteClickRef = useRef(onSiteClick)
  const onAoiMapClickRef = useRef(onAoiMapClick)
  evidenceModeRef.current = evidenceMode
  onSelectCountyRef.current = onSelectCounty
  onSiteClickRef.current = onSiteClick
  onAoiMapClickRef.current = onAoiMapClick

  const evidenceActive = evidenceMode === 'point' || evidenceMode === 'aoi'

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

    const resize = () => map.resize()
    resize()
    requestAnimationFrame(resize)
    const ro = new ResizeObserver(() => resize())
    ro.observe(container)

    map.on('load', () => {
      resize()
      map.fitBounds(TEXAS_BOUNDS, { padding: 28, duration: 0 })

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
          'line-color': [
            'match',
            ['get', 'thermalMetric'],
            'gradient_C_per_km',
            '#1f4d32',
            'heat_flow_mWm2',
            '#9a7b3c',
            '#889088',
          ],
          'line-width': [
            'match',
            ['get', 'thermalMetric'],
            'gradient_C_per_km',
            0.7,
            'heat_flow_mWm2',
            0.45,
            0.35,
          ],
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

      map.on('click', (e) => {
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
    })

    return () => {
      ro.disconnect()
      markerRef.current?.remove()
      markerRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.getCanvas().style.cursor = evidenceActive ? 'crosshair' : ''

    const applyPaint = () => {
      if (!map.getLayer('counties-fill')) return
      if (evidenceActive) {
        map.setPaintProperty('counties-fill', 'fill-color', NEUTRAL_FILL)
        map.setPaintProperty('counties-fill', 'fill-opacity', 0.18)
        map.setPaintProperty('counties-outline', 'line-color', '#889088')
        map.setPaintProperty('counties-outline', 'line-width', 0.4)
      } else {
        map.setPaintProperty('counties-fill', 'fill-color', SCORE_COLOR)
        map.setPaintProperty('counties-fill', 'fill-opacity', METRIC_OPACITY)
        map.setPaintProperty('counties-outline', 'line-color', [
          'match',
          ['get', 'thermalMetric'],
          'gradient_C_per_km',
          '#1f4d32',
          'heat_flow_mWm2',
          '#9a7b3c',
          '#889088',
        ])
        map.setPaintProperty('counties-outline', 'line-width', [
          'match',
          ['get', 'thermalMetric'],
          'gradient_C_per_km',
          0.7,
          'heat_flow_mWm2',
          0.45,
          0.35,
        ])
      }
    }

    if (map.isStyleLoaded()) applyPaint()
    else map.once('load', applyPaint)
  }, [evidenceActive])

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

  const legendTitle =
    evidenceMode === 'point'
      ? 'Point check — neutral basemap'
      : evidenceMode === 'aoi'
        ? 'AOI check — neutral basemap'
        : 'Screening score'

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map-canvas" />
      <div className="map-legend">
        <div className="legend-title">{legendTitle}</div>
        {evidenceMode === 'county' && (
          <>
            <div className="legend-bar" />
            <div className="legend-scale">
              <span>Lower</span>
              <span>Higher</span>
            </div>
            <div className="legend-note">
              Full opacity = gradient · muted = heat-flow fallback · pale = no thermal
            </div>
          </>
        )}
        {evidenceMode === 'point' && (
          <div className="legend-note">Score fill off — evidence only, not site quality</div>
        )}
        {evidenceMode === 'aoi' && (
          <div className="legend-note">Score fill off — evidence only, not AOI quality</div>
        )}
      </div>
    </div>
  )
}
