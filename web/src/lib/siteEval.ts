export interface ThermalPoint {
  lat: number
  lon: number
  q: number | null
  grad: number | null
}

export interface InfraCell {
  lat: number
  lon: number
  distKm: number
}

export type SiteConfidence = 'High' | 'Medium' | 'Low' | 'None'

export interface SiteDossier {
  lat: number
  lon: number
  countyFips: string | null
  countyName: string | null
  countyRank: number | null
  countyScore: number | null
  countyThermalMetric: string | null
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

export function lookupInfraDistKm(
  lat: number,
  lon: number,
  cells: InfraCell[],
): number | null {
  if (!cells.length) return null
  let best = cells[0]!
  let bestD = Infinity
  for (const c of cells) {
    const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2
    if (d < bestD) {
      bestD = d
      best = c
    }
  }
  return best.distKm
}

function siteConfidence(n: number, nearestKm: number | null): SiteConfidence {
  if (n <= 0) return 'None'
  if (n >= 8 && nearestKm != null && nearestKm <= 15) return 'High'
  if (n >= 3 && nearestKm != null && nearestKm <= 25) return 'Medium'
  return 'Low'
}

function evidenceVerb(conf: SiteConfidence): SiteDossier['evidenceVerb'] {
  if (conf === 'None') return 'Insufficient control'
  if (conf === 'Low') return 'Sparse control'
  if (conf === 'Medium') return 'Moderate control'
  return 'Adequate control to keep investigating'
}

export function buildSiteDossier(args: {
  lat: number
  lon: number
  countyFips: string | null
  countyName: string | null
  countyRank: number | null
  countyScore: number | null
  countyThermalMetric: string | null
  thermalPoints: ThermalPoint[]
  infraCells: InfraCell[]
  radiusKm?: number
}): SiteDossier {
  const radiusKm = args.radiusKm ?? 40
  const nearby = args.thermalPoints
    .map((p) => ({
      ...p,
      distKm: haversineKm(args.lat, args.lon, p.lat, p.lon),
    }))
    .filter((p) => p.distKm <= radiusKm)
    .sort((a, b) => a.distKm - b.distKm)

  const withGrad = nearby.filter((p) => p.grad != null)
  const withQ = nearby.filter((p) => p.q != null)
  const nearestKm = nearby[0]?.distKm ?? null
  const conf = siteConfidence(nearby.length, nearestKm)

  const mean = (vals: number[]) =>
    vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null

  const limitations: string[] = [
    'Point evidence check only — not a site resource assessment or drill recommendation.',
    'Transmission distance is nearest cell on a ~0.15° (~15 km) HIFLD proximity grid — not survey-grade and not interconnection feasibility.',
    `Thermal “local” means use an unweighted disk of radius ${radiusKm} km — regional smear, not pad-level geology.`,
  ]

  if (nearby.length === 0) {
    limitations.unshift('Insufficient local thermal control — no IHFC points in radius.')
  } else if (nearby.length === 1) {
    limitations.unshift('Only one IHFC control point in radius — treat means as indicative only.')
  }

  if (withGrad.length === 0 && withQ.length > 0) {
    limitations.push('No local geothermal gradient points; heat-flow observations only.')
  }

  if (args.countyThermalMetric === 'heat_flow_mWm2') {
    limitations.push(
      'Containing county screening used heat-flow fallback (gradient unavailable at county scale).',
    )
  }

  if (args.countyRank != null) {
    limitations.push(
      'County screening rank/score is regional context — not a score for this click point.',
    )
  }

  return {
    lat: args.lat,
    lon: args.lon,
    countyFips: args.countyFips,
    countyName: args.countyName,
    countyRank: args.countyRank,
    countyScore: args.countyScore,
    countyThermalMetric: args.countyThermalMetric,
    transmissionDistKm: lookupInfraDistKm(args.lat, args.lon, args.infraCells),
    nearbyCount: nearby.length,
    nearestKm: nearestKm == null ? null : Math.round(nearestKm * 10) / 10,
    siteConfidence: conf,
    localGradientMean: mean(withGrad.map((p) => p.grad as number)),
    localHeatflowMean: mean(withQ.map((p) => p.q as number)),
    gradientPointCount: withGrad.length,
    heatflowPointCount: withQ.length,
    nearestPoints: nearby.slice(0, 5).map((p) => ({
      lat: p.lat,
      lon: p.lon,
      distKm: Math.round(p.distKm * 10) / 10,
      q: p.q,
      grad: p.grad,
    })),
    limitations,
    evidenceVerb: evidenceVerb(conf),
  }
}
