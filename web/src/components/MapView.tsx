import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export interface SiteClickEvent {
  lat: number
  lon: number
  countyFips: string | null
  countyName: string | null
  countyRank: number | null
  countyScore: number | null
}

interface Props {
  selectedFips: string | null
  siteMode: boolean
  siteMarker: { lat: number; lon: number } | null
  onSelectCounty: (fips: string) => void
  onSiteClick: (evt: SiteClickEvent) => void
}

const GEOJSON_URL = `${import.meta.env.BASE_URL}data/prospects.geojson`

const TEXAS_BOUNDS: [[number, number], [number, number]] = [
  [-106.7, 25.8],
  [-93.5, 36.6],
]

export function MapView({
  selectedFips,
  siteMode,
  siteMarker,
  onSelectCounty,
  onSiteClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const siteModeRef = useRef(siteMode)
  const onSelectCountyRef = useRef(onSelectCounty)
  const onSiteClickRef = useRef(onSiteClick)
  siteModeRef.current = siteMode
  onSelectCountyRef.current = onSelectCounty
  onSiteClickRef.current = onSiteClick

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
          'fill-color': [
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
          ],
          'fill-opacity': 0.82,
        },
      })

      map.addLayer({
        id: 'counties-outline',
        type: 'line',
        source: 'counties',
        paint: {
          'line-color': '#334',
          'line-width': 0.4,
          'line-opacity': 0.5,
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

        if (siteModeRef.current) {
          onSiteClickRef.current({
            lat: e.lngLat.lat,
            lon: e.lngLat.lng,
            countyFips: fips,
            countyName: name,
            countyRank: Number.isFinite(rank) ? rank : null,
            countyScore: Number.isFinite(score) ? score : null,
          })
          return
        }

        if (fips) onSelectCountyRef.current(fips)
      })

      map.on('mouseenter', 'counties-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'counties-fill', () => {
        map.getCanvas().style.cursor = siteModeRef.current ? 'crosshair' : ''
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
    map.getCanvas().style.cursor = siteMode ? 'crosshair' : ''
  }, [siteMode])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedFips || siteMode) return
    const apply = () => {
      if (!map.getLayer('counties-selected')) return
      map.setFilter('counties-selected', ['==', ['get', 'countyFips'], selectedFips])
    }
    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [selectedFips, siteMode])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (!siteMarker) {
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
  }, [siteMarker])

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map-canvas" />
      <div className="map-legend">
        <div className="legend-title">
          {siteMode ? 'Site evaluate — click map' : 'Screening score'}
        </div>
        <div className="legend-bar" />
        <div className="legend-scale">
          <span>Lower</span>
          <span>Higher</span>
        </div>
        <div className="legend-note">County choropleth · not a resource map</div>
      </div>
    </div>
  )
}
