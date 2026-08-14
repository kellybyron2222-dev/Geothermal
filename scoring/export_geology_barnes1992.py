"""
Export Barnes 1992 Geologic Map of Texas (USGS DS 170) for map context only.

Source: USGS Data Series 170 — digital of BEG Geologic Map of Texas
(Barnes / Hartmann & Scranton, 1992), 1:500,000.

NOT used in ScreeningScore. Surface geology / structural fabric context overlay.

Writes:
  data/processed/geology_units.geojson
  data/processed/geology_faults.geojson
  web/public/data/geology_units.geojson
  web/public/data/geology_faults.geojson
  web/public/data/geology_meta.json
"""

from __future__ import annotations

import json
import zipfile
from pathlib import Path

import geopandas as gpd
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "geology"
PROCESSED = ROOT / "data" / "processed"
WEB = ROOT / "web" / "public" / "data"

ZIP = RAW / "170.zip"
EXTRACT = RAW / "extracted" / "170"
SHP_DIR = EXTRACT / "texas_shp"
CRS_WEB = "EPSG:4326"

# ~600 m — web overlay; not for cadastral use
SIMPLIFY_DEG = 0.006
COORD_DECIMALS = 4


def _round_geom(geom):
    from shapely.ops import transform

    def _r(x, y, z=None):
        if z is None:
            return (round(float(x), COORD_DECIMALS), round(float(y), COORD_DECIMALS))
        return (
            round(float(x), COORD_DECIMALS),
            round(float(y), COORD_DECIMALS),
            z,
        )

    return transform(_r, geom)


def ensure_shapefiles() -> Path:
    RAW.mkdir(parents=True, exist_ok=True)
    if not (SHP_DIR / "texas_p.shp").exists():
        if not ZIP.exists():
            raise FileNotFoundError(
                f"Missing {ZIP}. Download https://pubs.usgs.gov/ds/2005/170/downloads/170.zip"
            )
        EXTRACT.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(ZIP) as z:
            z.extractall(EXTRACT.parent)
        nested = EXTRACT / "texas_shp.zip"
        if nested.exists() and not (SHP_DIR / "texas_p.shp").exists():
            with zipfile.ZipFile(nested) as z:
                z.extractall(SHP_DIR)
    if not (SHP_DIR / "texas_p.shp").exists():
        raise FileNotFoundError(f"Missing texas_p.shp under {SHP_DIR}")
    return SHP_DIR


def era_from_label(label: str) -> str:
    s = (label or "").strip()
    if not s or s.lower() in {"water", "bar&ball", "null"}:
        return "other"
    # Multi-letter age codes first
    if s.startswith(("QTb", "QT", "Q")):
        return "cenozoic"
    if s.startswith(("To", "Ti", "Tv", "T")):
        return "cenozoic"
    if s.startswith(("K",)):
        return "mesozoic"
    if s.startswith(("J", "Tr", "R")):
        return "mesozoic"
    if s.startswith(("P", "IP", "M", "D", "S", "O", "C", "pC", "pЄ", "p")):
        # pC / Precambrian often coded pC or similar
        if s.lower().startswith("pc") or "recambrian" in s.lower():
            return "precambrian"
        if s.startswith(("P", "IP")):
            return "paleozoic"
        if s.startswith(("M", "D", "S", "O", "C")):
            return "paleozoic"
        return "paleozoic"
    unit = s.lower()
    if "recambrian" in unit:
        return "precambrian"
    if any(k in unit for k in ("quaternary", "tertiary", "ogallala", "goliad", "wilcox")):
        return "cenozoic"
    if any(k in unit for k in ("cretaceous", "jurassic", "triassic", "eagle ford", "austin")):
        return "mesozoic"
    if any(k in unit for k in ("permian", "pennsylvanian", "mississippian", "ordovician", "cambrian")):
        return "paleozoic"
    return "other"


ERA_COLOR = {
    "cenozoic": "#e8b84a",
    "mesozoic": "#7fad6b",
    "paleozoic": "#6b7db8",
    "precambrian": "#c45c7a",
    "other": "#b0a898",
}


def build_units(shp_dir: Path) -> gpd.GeoDataFrame:
    gdf = gpd.read_file(shp_dir / "texas_p.shp")
    gdf = gdf.to_crs(CRS_WEB)
    # Drop cartographic decoration polygons
    name = gdf["UNIT_NAME"].astype(str)
    label = gdf["ORIG_LABEL"].astype(str)
    mask = ~(
        name.str.lower().isin(["bar&ball", "water"])
        | label.str.lower().isin(["bar&ball", "water", ""])
    )
    gdf = gdf.loc[mask].copy()
    gdf["unit"] = name.str.strip()
    gdf["label"] = label.str.strip()
    gdf["era"] = gdf["label"].map(era_from_label)
    # Fix Precambrian by unit name
    gdf.loc[gdf["unit"].str.contains("recambrian", case=False, na=False), "era"] = "precambrian"
    gdf["color"] = gdf["era"].map(ERA_COLOR).fillna(ERA_COLOR["other"])

    # Dissolve identical label+unit to cut feature count
    dissolved = (
        gdf[["label", "unit", "era", "color", "geometry"]]
        .dissolve(by=["label", "unit", "era", "color"], as_index=False)
    )
    dissolved["geometry"] = dissolved.geometry.simplify(SIMPLIFY_DEG, preserve_topology=True)
    dissolved["geometry"] = dissolved.geometry.map(_round_geom)
    dissolved = dissolved[~dissolved.geometry.is_empty & dissolved.geometry.notna()].copy()
    return dissolved


def build_faults(shp_dir: Path) -> gpd.GeoDataFrame:
    gdf = gpd.read_file(shp_dir / "fault_l.shp")
    gdf = gdf.to_crs(CRS_WEB)
    geom = gdf.geometry.simplify(SIMPLIFY_DEG, preserve_topology=True).map(_round_geom)
    out = gpd.GeoDataFrame(
        {
            "faultType": gdf["ORIG_LINE_"].astype(str).str.strip(),
            "geometry": geom,
        },
        crs=CRS_WEB,
    )
    return out[~out.geometry.is_empty & out.geometry.notna()].copy()


def main() -> None:
    PROCESSED.mkdir(parents=True, exist_ok=True)
    WEB.mkdir(parents=True, exist_ok=True)
    shp_dir = ensure_shapefiles()
    print("Building geology units...")
    units = build_units(shp_dir)
    print(f"  units features={len(units)} eras={units['era'].value_counts().to_dict()}")
    print("Building faults...")
    faults = build_faults(shp_dir)
    print(f"  faults={len(faults)}")

    units_path = PROCESSED / "geology_units.geojson"
    faults_path = PROCESSED / "geology_faults.geojson"
    units.to_file(units_path, driver="GeoJSON")
    faults.to_file(faults_path, driver="GeoJSON")
    (WEB / "geology_units.geojson").write_bytes(units_path.read_bytes())
    (WEB / "geology_faults.geojson").write_bytes(faults_path.read_bytes())

    meta = {
        "layer": "geology_barnes_1992",
        "source": "USGS Data Series 170 (digitized BEG Geologic Map of Texas, Barnes/Hartmann/Scranton 1992)",
        "scale": "1:500,000",
        "role": "map_context_only",
        "inScreeningScore": False,
        "nUnits": int(len(units)),
        "nFaults": int(len(faults)),
        "eras": {k: ERA_COLOR[k] for k in ERA_COLOR},
        "honesty": (
            "Surface geologic map (Barnes 1992). Context overlay for structural / stratigraphic "
            "fabric. Not used in ScreeningScore. Not measured temperature."
        ),
        "downloads": {
            "usgsDs170": "https://pubs.usgs.gov/ds/2005/170/",
            "zip": "https://pubs.usgs.gov/ds/2005/170/downloads/170.zip",
        },
    }
    (WEB / "geology_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    (PROCESSED / "geology_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"Wrote {units_path} ({units_path.stat().st_size // 1024} KB)")
    print(f"Wrote {faults_path} ({faults_path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
