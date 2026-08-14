"""
Export TX-clipped USGS basement domains (DS-898) for map context only.

NOT used in ScreeningScore. Heat-flow context: crystalline basement domains
(radiogenic heat production + crustal architecture) — not surface sedimentary
'bedrock' geology.

Writes:
  data/processed/basement_domains.geojson
  web/public/data/basement_domains.geojson
  web/public/data/basement_meta.json
"""

from __future__ import annotations

import json
import zipfile
from pathlib import Path

import geopandas as gpd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "basement"
PROCESSED = ROOT / "data" / "processed"
WEB = ROOT / "web" / "public" / "data"

GDB_ZIP = RAW / "Bsmt_CONUS_AK.gdb.zip"
GDB = RAW / "Bsmt_CONUS_AK.gdb"
LAYER = "Bsmnt_CONUS_AK_FINAL"

TX_BBOX = (-106.7, 25.8, -93.5, 36.6)  # lon_min, lat_min, lon_max, lat_max
CRS_WEB = "EPSG:4326"


def ensure_gdb() -> Path:
    RAW.mkdir(parents=True, exist_ok=True)
    if GDB.exists() and any(GDB.iterdir()):
        return GDB
    if not GDB_ZIP.exists():
        raise FileNotFoundError(
            f"Missing {GDB_ZIP}. Download USGS DS-898 Bsmt_CONUS_AK.gdb.zip first."
        )
    with zipfile.ZipFile(GDB_ZIP) as z:
        z.extractall(RAW)
    if not GDB.exists():
        raise FileNotFoundError(f"Extracted but missing {GDB}")
    return GDB


def _pick_name_col(columns: list[str]) -> str | None:
    lower = {c.lower(): c for c in columns}
    for cand in (
        "domain_name",
        "domain",
        "name",
        "bsmnt_dom",
        "alternate_name",
        "ref_id",
        "label",
    ):
        if cand in lower:
            return lower[cand]
    return None


def build() -> None:
    gdb = ensure_gdb()
    gdf = gpd.read_file(gdb, layer=LAYER)
    if gdf.crs is None:
        gdf = gdf.set_crs(CRS_WEB)
    gdf = gdf.to_crs(CRS_WEB)

    # Soft clip to Texas bbox (basement domains are large; keep intersecting polys)
    lon_min, lat_min, lon_max, lat_max = TX_BBOX
    clipped = gdf.cx[lon_min:lon_max, lat_min:lat_max].copy()
    if clipped.empty:
        raise RuntimeError("No basement domains intersect Texas bbox")

    name_col = _pick_name_col(list(clipped.columns))
    # Keep lean properties for web
    keep = [c for c in clipped.columns if c != "geometry"]
    # Prefer a few known attrs
    preferred = [
        c
        for c in keep
        if c.lower()
        in {
            "domain",
            "domain_name",
            "alternate_name",
            "name",
            "crust_type",
            "crust_formation_age",
            "accretion_type",
            "accretion_age",
            "study_region_name",
            "notes",
            "ref_id",
            "id",
        }
        or c == name_col
    ]
    if not preferred and name_col:
        preferred = [name_col]
    if not preferred:
        preferred = keep[:6]

    out = clipped[preferred + ["geometry"]].copy()
    # Normalize a display label
    if name_col and name_col in out.columns:
        out["domain"] = out[name_col].astype(str)
    elif "DOMAIN" in out.columns:
        out["domain"] = out["DOMAIN"].astype(str)
    else:
        out["domain"] = out.index.astype(str)

    # Simplify for web payload (degrees ~ 0.01° ≈ 1 km)
    out["geometry"] = out.geometry.simplify(0.015, preserve_topology=True)
    out = out[~out.geometry.is_empty & out.geometry.notna()]

    PROCESSED.mkdir(parents=True, exist_ok=True)
    WEB.mkdir(parents=True, exist_ok=True)
    geo_path = PROCESSED / "basement_domains.geojson"
    out.to_file(geo_path, driver="GeoJSON")
    (WEB / "basement_domains.geojson").write_bytes(geo_path.read_bytes())

    meta = {
        "layer": "basement_domains",
        "source": "USGS Data Series 898 — Basement domains of the conterminous United States",
        "citation": "https://doi.org/10.3133/ds898",
        "vintage": "DS-898",
        "role": "map_context_only",
        "inScreeningScore": False,
        "honesty": (
            "Crystalline basement domain context for heat architecture "
            "(radiogenic basement / crustal domains). Not surface sedimentary "
            "bedrock, and not used to rank counties."
        ),
        "nFeatures": int(len(out)),
        "bbox": list(TX_BBOX),
    }
    (WEB / "basement_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    (PROCESSED / "basement_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"Basement domains TX: n={len(out)} -> {geo_path}")
    print(f"  domains sample: {out['domain'].head(8).tolist()}")


if __name__ == "__main__":
    build()
