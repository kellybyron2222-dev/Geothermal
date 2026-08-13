/**
 * Shared types for county screening payloads (populated in Milestone 2–3).
 */
export type ConfidenceBand = 'High' | 'Medium' | 'Low' | 'Unknown'

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
}
