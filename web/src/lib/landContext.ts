/**
 * Phase 2.4 — static Texas land-research citation pointers.
 * No parcel GIS, no CAD scrape/API, no ownership resolution.
 */

export type LandCitation = {
  id: string
  label: string
  href: string
  why: string
}

export const LAND_CONTEXT_DISCLAIMER =
  'Ownership, title, and mineral estate are not in this app.'

export const LAND_CONTEXT_EXTERNAL_NOTE =
  'External records; not verified by this product.'

export const AOI_PARCEL_BOUNDARY_CAVEAT =
  'Drawn/uploaded AOI is not a verified parcel boundary.'

/** Curated outbound research pointers only — do not fetch these at runtime. */
export const LAND_CITATIONS: LandCitation[] = [
  {
    id: 'cad',
    label: 'Texas Comptroller — CAD / county directory',
    href: 'https://comptroller.texas.gov/taxes/property-tax/county-directory/',
    why: 'Find the county appraisal district (CAD) to research surface ownership and appraisal records.',
  },
  {
    id: 'rrc',
    label: 'Railroad Commission of Texas — data & research',
    href: 'https://www.rrc.texas.gov/resource-center/research/data-sets-available-for-download/',
    why: 'Public oil & gas datasets and research tools as a mineral-context pointer — not mineral ownership.',
  },
  {
    id: 'glo',
    label: 'Texas General Land Office',
    href: 'https://www.glo.texas.gov/',
    why: 'State land office research pointer for public/state land context.',
  },
]
