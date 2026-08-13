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

export interface SiteDossier {
  lat: number
  lon: number
  countyFips: string | null
  countyName: string | null
  countyRank: number | null
  countyScore: number | null
  transmissionDistKm: number | null
  nearbyCount: number
  localGradientMean: number | null
  localHeatflowMean: number | null
  nearestPoints: Array<{
    lat: number
    lon: number
    distKm: number
    q: number | null
    grad: number | null
  }>
  limitations: string[]
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

export function buildSiteDossier(args: {
  lat: number
  lon: number
  countyFips: string | null
  countyName: string | null
  countyRank: number | null
  countyScore: number | null
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

  const mean = (vals: number[]) =>
    vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null

  const limitations = [
    'Site dossier is indicative screening support — not a resource or drill recommendation.',
    'Transmission distance is interpolated from a precomputed HIFLD proximity grid — not interconnection feasibility.',
  ]
  if (nearby.length === 0) {
    limitations.push(`No IHFC thermal control points within ${radiusKm} km.`)
  }
  if (withGrad.length === 0 && withQ.length > 0) {
    limitations.push('Local geothermal gradient unavailable; heat-flow points shown instead.')
  }

  return {
    lat: args.lat,
    lon: args.lon,
    countyFips: args.countyFips,
    countyName: args.countyName,
    countyRank: args.countyRank,
    countyScore: args.countyScore,
    transmissionDistKm: lookupInfraDistKm(args.lat, args.lon, args.infraCells),
    nearbyCount: nearby.length,
    localGradientMean: mean(withGrad.map((p) => p.grad as number)),
    localHeatflowMean: mean(withQ.map((p) => p.q as number)),
    nearestPoints: nearby.slice(0, 5).map((p) => ({
      lat: p.lat,
      lon: p.lon,
      distKm: Math.round(p.distKm * 10) / 10,
      q: p.q,
      grad: p.grad,
    })),
    limitations,
  }
}
