import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface Props {
  selectedFips: string | null
  onSelect: (fips: string) => void
}

const GEOJSON_URL = `${import.meta.env.BASE_URL}data/prospects.geojson`

/** Approximate Texas bounds [west, south, east, north] */
const TEXAS_BOUNDS: [[number, number], [number, number]] = [
  [-106.7, 25.8],
  [-93.5, 36.6],
]

export function MapView({ selectedFips, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

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

    const resize = () => {
      map.resize()
    }

    // Grid layout often mounts with 0×0; resize once layout settles.
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

      map.on('click', 'counties-fill', (e) => {
        const fips = e.features?.[0]?.properties?.countyFips
        if (typeof fips === 'string') onSelectRef.current(fips)
      })

      map.on('mouseenter', 'counties-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'counties-fill', () => {
        map.getCanvas().style.cursor = ''
      })
    })

    return () => {
      ro.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedFips) return
    const apply = () => {
      if (!map.getLayer('counties-selected')) return
      map.setFilter('counties-selected', ['==', ['get', 'countyFips'], selectedFips])
    }
    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [selectedFips])

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map-canvas" />
      <div className="map-legend">
        <div className="legend-title">Screening score</div>
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
