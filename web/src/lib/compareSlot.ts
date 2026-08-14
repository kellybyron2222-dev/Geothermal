import type { AoiDossier } from './aoiEval'
import type { SiteConfidence, SiteDossier } from './siteEval'

export const MAX_COMPARE = 3

export type CompareSlot = {
  kind: 'point' | 'aoi'
  id: string
  label: string
  evidenceVerb: string
  siteConfidence: SiteConfidence
  nearbyCount: number
  nearestKm: number | null
  localGradientMean: number | null
  localHeatflowMean: number | null
  gradientPointCount: number
  heatflowPointCount: number
  transmissionDistKm: number | null
  /** County name(s) shown inline. */
  countyNames: string
  /** Rank / screening digits — shown behind expand only. */
  countyScreeningDetail: string | null
  /** Demoted land-context honesty — never an ownership score. */
  landSummary: string
  /** First limitations carried for compare expand (full list preserved). */
  limitations: string[]
  lat?: number
  lon?: number
  areaKm2?: number
  centroidLat?: number
  centroidLon?: number
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function pointCountyNames(d: SiteDossier): string {
  if (!d.countyName) return 'No containing scored county'
  return `${d.countyName} County`
}

function pointCountyScreening(d: SiteDossier): string | null {
  if (!d.countyName) return null
  const bits: string[] = []
  if (d.countyRank != null) bits.push(`rank #${d.countyRank}`)
  if (d.countyScore != null) bits.push(`screening ${d.countyScore.toFixed(1)}`)
  return bits.length ? bits.join(' · ') : null
}

function aoiCountyNames(d: AoiDossier): string {
  if (!d.intersectingCounties.length) return 'No intersecting scored counties'
  return d.intersectingCounties
    .slice(0, 4)
    .map((c) => c.countyName)
    .join('; ')
}

function aoiCountyScreening(d: AoiDossier): string | null {
  if (!d.intersectingCounties.length) return null
  const bits = d.intersectingCounties
    .slice(0, 4)
    .map((c) => {
      const parts = [c.countyName]
      if (c.countyRank != null) parts.push(`#${c.countyRank}`)
      if (c.countyScore != null) parts.push(c.countyScore.toFixed(1))
      return parts.join(' ')
    })
    .join('; ')
  return bits
}

function pointLandSummary(d: SiteDossier): string {
  if (!d.countyName) return 'Not in-app — see CAD/RRC'
  return `${d.countyName} County · ownership not in-app — see CAD/RRC`
}

function aoiLandSummary(d: AoiDossier): string {
  if (!d.intersectingCounties.length) return 'Not in-app — see CAD/RRC'
  const names = d.intersectingCounties
    .slice(0, 4)
    .map((c) => c.countyName)
    .join('; ')
  return `${names} · ownership not in-app — see CAD/RRC`
}

function aoiLabel(d: AoiDossier): string {
  const area = `≈${d.areaKm2.toLocaleString()} km²`
  const lat = d.centroid.lat.toFixed(3)
  const lonAbs = Math.abs(d.centroid.lon).toFixed(3)
  const hemi = d.centroid.lon < 0 ? 'W' : 'E'
  const centroid = `${lat}°N, ${lonAbs}°${hemi}`
  const top = d.intersectingCounties[0]?.countyName
  const countyBit = top ? ` · ${top}` : ''
  return `AOI · ${area} · ${centroid}${countyBit}`
}

export function fromSiteDossier(d: SiteDossier): CompareSlot {
  return {
    kind: 'point',
    id: uid('point'),
    label: `Point · ${d.lat.toFixed(4)}°N, ${Math.abs(d.lon).toFixed(4)}°W`,
    evidenceVerb: d.evidenceVerb,
    siteConfidence: d.siteConfidence,
    nearbyCount: d.nearbyCount,
    nearestKm: d.nearestKm,
    localGradientMean: d.localGradientMean,
    localHeatflowMean: d.localHeatflowMean,
    gradientPointCount: d.gradientPointCount,
    heatflowPointCount: d.heatflowPointCount,
    transmissionDistKm: d.transmissionDistKm,
    countyNames: pointCountyNames(d),
    countyScreeningDetail: pointCountyScreening(d),
    landSummary: pointLandSummary(d),
    limitations: [...d.limitations],
    lat: d.lat,
    lon: d.lon,
  }
}

export function fromAoiDossier(d: AoiDossier): CompareSlot {
  return {
    kind: 'aoi',
    id: uid('aoi'),
    label: aoiLabel(d),
    evidenceVerb: d.evidenceVerb,
    siteConfidence: d.siteConfidence,
    nearbyCount: d.nearbyCount,
    nearestKm: d.nearestKm,
    localGradientMean: d.localGradientMean,
    localHeatflowMean: d.localHeatflowMean,
    gradientPointCount: d.gradientPointCount,
    heatflowPointCount: d.heatflowPointCount,
    transmissionDistKm: d.transmissionDistKm,
    countyNames: aoiCountyNames(d),
    countyScreeningDetail: aoiCountyScreening(d),
    landSummary: aoiLandSummary(d),
    limitations: [...d.limitations],
    areaKm2: d.areaKm2,
    centroidLat: d.centroid.lat,
    centroidLon: d.centroid.lon,
  }
}

const POINT_EPS = 0.0005

export function isDuplicate(slots: CompareSlot[], next: CompareSlot): boolean {
  if (next.kind === 'point') {
    if (next.lat == null || next.lon == null) return false
    return slots.some(
      (s) =>
        s.kind === 'point' &&
        s.lat != null &&
        s.lon != null &&
        Math.abs(s.lat - next.lat!) <= POINT_EPS &&
        Math.abs(s.lon - next.lon!) <= POINT_EPS,
    )
  }

  // Light AOI dup: same rounded area + centroid when available
  if (next.areaKm2 == null) return false
  const areaKey = Math.round(next.areaKm2)
  return slots.some((s) => {
    if (s.kind !== 'aoi' || s.areaKm2 == null) return false
    if (Math.round(s.areaKm2) !== areaKey) return false
    if (
      next.centroidLat != null &&
      next.centroidLon != null &&
      s.centroidLat != null &&
      s.centroidLon != null
    ) {
      return (
        Math.abs(s.centroidLat - next.centroidLat) <= POINT_EPS &&
        Math.abs(s.centroidLon - next.centroidLon) <= POINT_EPS
      )
    }
    return true
  })
}
