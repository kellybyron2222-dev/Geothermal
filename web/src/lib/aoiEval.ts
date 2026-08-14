import {
  lookupInfraDistKm,
  type InfraCell,
  type SiteConfidence,
  type ThermalPoint,
} from './siteEval'

export type LonLat = [number, number]

/** Area (km²) at/above which unweighted means are treated as regional smear. */
export const LARGE_AOI_KM2 = 2000
/** Dense-control companion: large-ish AOI with many inside points. */
export const LARGE_AOI_DENSE_KM2 = 1000
export const LARGE_AOI_DENSE_COUNT = 8

export function isLargeAoiSmear(areaKm2: number, nearbyCount: number): boolean {
  return (
    areaKm2 >= LARGE_AOI_KM2 ||
    (nearbyCount >= LARGE_AOI_DENSE_COUNT && areaKm2 >= LARGE_AOI_DENSE_KM2)
  )
}

export interface AoiCountyContext {
  countyFips: string
  countyName: string
  countyRank: number | null
  countyScore: number | null
  countyThermalMetric: string | null
  countyModelThermal?: boolean
  countyThermalMode?: string | null
  countyTdepthMean?: number | null
  countyTdepthKm?: number | null
}

function isModelTdepthCounty(c: {
  countyThermalMetric: string | null
  countyModelThermal?: boolean
  countyThermalMode?: string | null
}): boolean {
  if (c.countyModelThermal === true) return true
  if (c.countyThermalMode === 'stanford_tdepth') return true
  return !!c.countyThermalMetric?.startsWith('tdepth')
}

export interface AoiDossier {
  ring: LonLat[]
  areaKm2: number
  centroid: { lat: number; lon: number }
  transmissionDistKm: number | null
  nearbyCount: number
  nearestKm: number | null
  siteConfidence: SiteConfidence
  localGradientMean: number | null
  localHeatflowMean: number | null
  gradientPointCount: number
  heatflowPointCount: number
  nearestPoints: Array<{
    lat: number
    lon: number
    distKm: number
    q: number | null
    grad: number | null
  }>
  intersectingCounties: AoiCountyContext[]
  /** True when area / density makes means regional smear (force demotion in UI). */
  largeAoiSmear: boolean
  limitations: string[]
  evidenceVerb:
    | 'Insufficient control'
    | 'Sparse control'
    | 'Moderate control'
    | 'Adequate control to keep investigating'
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

/** Ray-cast point-in-polygon. Ring is [lon, lat][]; open or closed. */
export function pointInRing(lon: number, lat: number, ring: LonLat[]): boolean {
  if (ring.length < 3) return false
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i]![0]
    const yi = ring[i]![1]
    const xj = ring[j]![0]
    const yj = ring[j]![1]
    const intersect =
      yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi + 0.0) + xi
    if (intersect) inside = !inside
  }
  return inside
}

function ensureClosed(ring: LonLat[]): LonLat[] {
  if (ring.length < 3) return ring.slice()
  const first = ring[0]!
  const last = ring[ring.length - 1]!
  if (first[0] === last[0] && first[1] === last[1]) return ring.slice()
  return [...ring, [first[0], first[1]] as LonLat]
}

function openRing(ring: LonLat[]): LonLat[] {
  if (ring.length < 2) return ring.slice()
  const first = ring[0]!
  const last = ring[ring.length - 1]!
  if (first[0] === last[0] && first[1] === last[1]) return ring.slice(0, -1)
  return ring.slice()
}

export function ringCentroid(ring: LonLat[]): { lat: number; lon: number } {
  const pts = openRing(ring)
  if (!pts.length) return { lat: 0, lon: 0 }
  let lon = 0
  let lat = 0
  for (const [x, y] of pts) {
    lon += x
    lat += y
  }
  return { lon: lon / pts.length, lat: lat / pts.length }
}

/** Approximate geodesic area (km²) via equirectangular shoelace. */
export function ringAreaKm2(ring: LonLat[]): number {
  const pts = openRing(ring)
  if (pts.length < 3) return 0
  const closed = ensureClosed(pts)
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371
  let sum = 0
  for (let i = 0; i < closed.length - 1; i++) {
    const [lon1, lat1] = closed[i]!
    const [lon2, lat2] = closed[i + 1]!
    sum += toRad(lon2 - lon1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)))
  }
  return Math.abs((sum * R * R) / 2)
}

/** Min haversine from a point to any ring vertex (boundary proxy). */
function distToRingKm(lat: number, lon: number, ring: LonLat[]): number {
  const pts = openRing(ring)
  let best = Infinity
  for (const [x, y] of pts) {
    const d = haversineKm(lat, lon, y, x)
    if (d < best) best = d
  }
  return best
}

function siteConfidence(n: number, nearestKm: number | null): SiteConfidence {
  if (n <= 0) return 'None'
  if (n >= 8 && nearestKm != null && nearestKm <= 15) return 'High'
  if (n >= 3 && nearestKm != null && nearestKm <= 25) return 'Medium'
  return 'Low'
}

function evidenceVerb(conf: SiteConfidence): AoiDossier['evidenceVerb'] {
  if (conf === 'None') return 'Insufficient control'
  if (conf === 'Low') return 'Sparse control'
  if (conf === 'Medium') return 'Moderate control'
  return 'Adequate control to keep investigating'
}

export function parseAoiGeoJson(text: string): { ring: LonLat[]; error?: string } {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ring: [], error: 'Invalid JSON — could not parse file.' }
  }

  const extractPolygon = (geom: unknown): LonLat[] | null => {
    if (!geom || typeof geom !== 'object') return null
    const g = geom as { type?: string; coordinates?: unknown }
    if (g.type === 'MultiPolygon') return null
    if (g.type !== 'Polygon' || !Array.isArray(g.coordinates)) return null
    const outer = g.coordinates[0]
    if (!Array.isArray(outer) || outer.length < 4) return null
    const ring: LonLat[] = []
    for (const pt of outer) {
      if (!Array.isArray(pt) || pt.length < 2) return null
      const lon = Number(pt[0])
      const lat = Number(pt[1])
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null
      ring.push([lon, lat])
    }
    return ring
  }

  if (raw && typeof raw === 'object') {
    const obj = raw as {
      type?: string
      geometry?: unknown
      coordinates?: unknown
      features?: unknown[]
    }

    if (obj.type === 'Polygon') {
      const ring = extractPolygon(obj)
      if (!ring) {
        return {
          ring: [],
          error: 'Polygon must have a closed outer ring with at least 3 vertices.',
        }
      }
      return { ring: ensureClosed(ring) }
    }

    if (obj.type === 'Feature') {
      const geom = (obj as { geometry?: { type?: string } }).geometry
      if (geom?.type === 'MultiPolygon') {
        return { ring: [], error: 'MultiPolygon rejected — upload a single Polygon only.' }
      }
      const ring = extractPolygon(geom)
      if (!ring) {
        return {
          ring: [],
          error: 'Feature must contain a single Polygon geometry.',
        }
      }
      return { ring: ensureClosed(ring) }
    }

    if (obj.type === 'FeatureCollection') {
      const feats = obj.features
      if (!Array.isArray(feats) || feats.length === 0) {
        return { ring: [], error: 'FeatureCollection is empty.' }
      }
      if (feats.length > 1) {
        return {
          ring: [],
          error: `FeatureCollection has ${feats.length} features — upload exactly one Polygon.`,
        }
      }
      const feat = feats[0] as { geometry?: { type?: string } }
      if (feat.geometry?.type === 'MultiPolygon') {
        return { ring: [], error: 'MultiPolygon rejected — upload a single Polygon only.' }
      }
      const ring = extractPolygon(feat.geometry)
      if (!ring) {
        return {
          ring: [],
          error: 'FeatureCollection must contain exactly one Polygon feature.',
        }
      }
      return { ring: ensureClosed(ring) }
    }
  }

  return {
    ring: [],
    error: 'Expected a GeoJSON Polygon, Feature, or single-feature FeatureCollection.',
  }
}

export interface CountyFeatureLike {
  type?: string
  properties?: {
    countyFips?: string
    name?: string
    rank?: number
    screeningScore?: number
    thermalMetric?: string
    modelThermal?: boolean
    thermalMode?: string
    tdepthMean?: number | null
    tdepthKm?: number | null
  }
  geometry?: {
    type: string
    coordinates: unknown
  }
}

export type CountyScreeningLookup = {
  name: string
  rank: number
  screeningScore: number
  thermalMetric: string | null
  modelThermal?: boolean
  thermalMode?: string | null
  tdepthMean?: number | null
  tdepthKm?: number | null
}

function countyContainsPoint(
  lon: number,
  lat: number,
  geometry: CountyFeatureLike['geometry'],
): boolean {
  if (!geometry) return false
  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates as LonLat[][]
    const outer = rings?.[0]
    if (!outer) return false
    return pointInRing(lon, lat, outer as LonLat[])
  }
  if (geometry.type === 'MultiPolygon') {
    const polys = geometry.coordinates as LonLat[][][]
    for (const poly of polys) {
      const outer = poly?.[0]
      if (outer && pointInRing(lon, lat, outer as LonLat[])) return true
    }
  }
  return false
}

/**
 * Counties that contain the AOI centroid or any AOI vertex.
 * Caps at 8. Uses screening rows when available for rank/score.
 */
export function countiesIntersectingAoi(
  ring: LonLat[],
  countyFeatures: CountyFeatureLike[],
  countiesByFips: Map<string, CountyScreeningLookup>,
): AoiCountyContext[] {
  const samples = openRing(ring)
  const c = ringCentroid(ring)
  const probe: LonLat[] = [[c.lon, c.lat], ...samples]

  const out: AoiCountyContext[] = []
  const seen = new Set<string>()

  for (const feat of countyFeatures) {
    const fips = feat.properties?.countyFips
    if (!fips || seen.has(fips)) continue
    let hit = false
    for (const [lon, lat] of probe) {
      if (countyContainsPoint(lon, lat, feat.geometry)) {
        hit = true
        break
      }
    }
    if (!hit) continue
    seen.add(fips)
    const row = countiesByFips.get(fips)
    const props = feat.properties
    out.push({
      countyFips: fips,
      countyName: row?.name ?? props?.name ?? fips,
      countyRank: row?.rank ?? (typeof props?.rank === 'number' ? props.rank : null),
      countyScore:
        row?.screeningScore ??
        (typeof props?.screeningScore === 'number' ? props.screeningScore : null),
      countyThermalMetric: row?.thermalMetric ?? props?.thermalMetric ?? null,
      countyModelThermal: row?.modelThermal ?? props?.modelThermal,
      countyThermalMode: row?.thermalMode ?? props?.thermalMode ?? null,
      countyTdepthMean:
        row?.tdepthMean ??
        (typeof props?.tdepthMean === 'number' ? props.tdepthMean : null),
      countyTdepthKm:
        row?.tdepthKm ?? (typeof props?.tdepthKm === 'number' ? props.tdepthKm : null),
    })
    if (out.length >= 8) break
  }

  return out.sort((a, b) => (a.countyRank ?? 9999) - (b.countyRank ?? 9999))
}

export function buildAoiDossier(args: {
  ring: LonLat[]
  thermalPoints: ThermalPoint[]
  infraCells: InfraCell[]
  intersectingCounties: AoiCountyContext[]
}): AoiDossier {
  const ring = ensureClosed(args.ring)
  const centroid = ringCentroid(ring)
  const areaKm2 = Math.round(ringAreaKm2(ring) * 10) / 10

  const inside = args.thermalPoints
    .filter((p) => pointInRing(p.lon, p.lat, ring))
    .map((p) => ({
      ...p,
      distKm: haversineKm(centroid.lat, centroid.lon, p.lat, p.lon),
    }))
    .sort((a, b) => a.distKm - b.distKm)

  let nearestKm: number | null = null
  if (inside.length > 0) {
    nearestKm = 0
  } else {
    let best = Infinity
    for (const p of args.thermalPoints) {
      const d = distToRingKm(p.lat, p.lon, ring)
      if (d < best) best = d
    }
    nearestKm = Number.isFinite(best) ? Math.round(best * 10) / 10 : null
  }

  const withGrad = inside.filter((p) => p.grad != null)
  const withQ = inside.filter((p) => p.q != null)
  const conf = siteConfidence(inside.length, nearestKm)

  const mean = (vals: number[]) =>
    vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null

  const samplePts: LonLat[] = [
    [centroid.lon, centroid.lat],
    ...openRing(ring).filter((_, i) => i % 3 === 0).slice(0, 6),
  ]
  let transmissionDistKm: number | null = null
  for (const [lon, lat] of samplePts) {
    const d = lookupInfraDistKm(lat, lon, args.infraCells)
    if (d == null) continue
    if (transmissionDistKm == null || d < transmissionDistKm) transmissionDistKm = d
  }

  const largeAoiSmear = isLargeAoiSmear(areaKm2, inside.length)

  const limitations: string[] = [
    'AOI evidence check only — not an AOI ScreeningScore, resource assessment, or drill recommendation.',
    'Drawn/uploaded AOI is not a verified parcel boundary.',
    'Ownership, title, and mineral estate are not resolved in this app.',
    'Transmission distance is nearest cell on a ~0.15° (~15 km) HIFLD proximity grid — not survey-grade and not interconnection feasibility.',
    'Thermal control counts IHFC points inside the polygon (point-in-polygon) — regional smear, not pad-level geology.',
  ]

  if (inside.length === 0) {
    limitations.unshift('Insufficient local thermal control — no IHFC points inside the AOI.')
  } else if (inside.length === 1) {
    limitations.unshift('Only one IHFC control point inside the AOI — treat means as indicative only.')
  }

  if (largeAoiSmear) {
    limitations.unshift(
      'Large AOI — unweighted means are regional smear, not an AOI grade.',
    )
  }

  if (withGrad.length === 0 && withQ.length > 0) {
    limitations.push('No local geothermal gradient points; heat-flow observations only.')
  }

  if (args.intersectingCounties.length > 0) {
    limitations.push(
      'County screening rank/score is regional context for intersecting counties — not a score for this AOI.',
    )
  }

  const modelCounties = args.intersectingCounties.filter(isModelTdepthCounty)
  if (modelCounties.length > 0) {
    limitations.push(
      'IHFC points inside the AOI are measured control / QC — not a Stanford T@depth site or AOI opportunity score.',
    )
    limitations.push(
      'Intersecting county screening uses model T@depth (Stanford) — regional context only; this panel does not invent an AOI score from the model.',
    )
    const withT = modelCounties.find((c) => c.countyTdepthMean != null)
    if (withT?.countyTdepthMean != null) {
      const depthBit =
        withT.countyTdepthKm != null ? ` @ ${withT.countyTdepthKm} km` : ''
      limitations.push(
        `Example county model T@depth (${withT.countyName}): mean ${withT.countyTdepthMean.toFixed(1)} °C${depthBit} — not measured for this AOI.`,
      )
    }
  } else if (
    args.intersectingCounties.some((c) => c.countyThermalMetric === 'heat_flow_mWm2')
  ) {
    limitations.push(
      'At least one intersecting county used heat-flow fallback for county screening (gradient unavailable at county scale).',
    )
  }

  return {
    ring,
    areaKm2,
    centroid,
    transmissionDistKm,
    nearbyCount: inside.length,
    nearestKm,
    siteConfidence: conf,
    localGradientMean: mean(withGrad.map((p) => p.grad as number)),
    localHeatflowMean: mean(withQ.map((p) => p.q as number)),
    gradientPointCount: withGrad.length,
    heatflowPointCount: withQ.length,
    nearestPoints: inside.slice(0, 5).map((p) => ({
      lat: p.lat,
      lon: p.lon,
      distKm: Math.round(p.distKm * 10) / 10,
      q: p.q,
      grad: p.grad ?? null,
    })),
    intersectingCounties: args.intersectingCounties,
    largeAoiSmear,
    limitations,
    evidenceVerb: evidenceVerb(conf),
  }
}
