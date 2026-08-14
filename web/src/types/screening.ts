/**
 * Shared types for county screening payloads (Milestone 2–3 + Data Depth v0.4).
 */
export type ConfidenceBand = 'High' | 'Medium' | 'Low' | 'Unknown'

export type ThermalMode = 'stanford_tdepth' | 'legacy_ihfc'

export interface ScreeningFactor {
  id: 'thermal' | 'infra'
  label: string
  rawValue: number | null
  rawUnit: string
  score0to100: number
  weight: number
  weightedContribution: number
  source: string
  vintage: string
  /** e.g. gradient_C_per_km | heat_flow_mWm2 | tdepth_C_km4 */
  metric?: string
}

export interface ScreeningCounty {
  countyFips: string
  name: string
  rank: number
  screeningScore: number
  confidence: ConfidenceBand
  factors: ScreeningFactor[]
  drivers: string[]
  limitations: string[]
  /** IHFC control-point count (QC / legacy thermal). */
  thermalControlCount?: number
  /** SMU/BHT (and related) measured control for confidence densification. */
  measuredControlCount?: number
  /** True when opportunity thermal is labeled Stanford model T@depth. */
  modelThermal?: boolean
  /** County mean model T@depth (°C), when Data Depth active. */
  tdepthMean?: number | null
  /** Depth slice (km) for model T@depth. */
  tdepthKm?: number | null
  /** PAD-US protected-area friction / gate (not opportunity). null = unknown / not loaded. */
  padusFriction?: boolean | null
  /** TexNet seismicity caution (not opportunity). null = unknown / not loaded. */
  texnetCaution?: boolean | null
  /** PAD-US tri-state: friction | clear | unknown */
  padusStatus?: 'friction' | 'clear' | 'unknown' | string
  /** TexNet tri-state: caution | clear | unknown */
  texnetStatus?: 'caution' | 'clear' | 'unknown' | string
  /** Loud mode flag: stanford_tdepth vs legacy_ihfc fallback. */
  thermalMode?: ThermalMode
  /** Dual-panel context only — not in ScreeningScore. */
  gradientMean?: number | null
  gradientN?: number
  heatflowMean?: number | null
  heatflowN?: number
}

/** Meta chrome for Data Depth residual-risk honesty. */
export interface ScreeningMeta {
  methodologyVersion: string
  disclaimer: string
  weights: { thermal: number; infra: number }
  dataDepth?: boolean
  thermalMode?: string
  dataDepthStatus?: string
  residualRisk?: string
  /** Stable publish id: methodologyVersion + sorted layerVintages. */
  publishId?: string
  /** Phase 3 slice chrome (watchlist / digest / rules — local-first). */
  phase3?: {
    slice: number
    rulesVersion: string
    watchlistLocal?: boolean
  }
  riskLayerStatus?: {
    texnet?: string
    padus?: string
    rrcWellDensity?: string
  }
  layerVintages?: Record<string, string | null | undefined>
}
