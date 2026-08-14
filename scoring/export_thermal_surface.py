"""
Build a constrained local measured heat-flow surface for map overlay.

Source points: IHFC GHFDB heat flow q (mW/m²) only.
  - Geothermal gradient is intentionally excluded (different units; deferred).
  - NOT bottom-hole temperature

Honesty / constraint (do not invent basin-wide heat maps):
  - Only fill a grid cell if ≥ MIN_POINTS control points lie within MAX_RADIUS_KM
  - Value = inverse-distance-weighted mean of those neighbors
  - Cells outside the radius stay empty (transparent on map)

Writes:
  data/processed/thermal_surface.geojson
  web/public/data/thermal_surface.geojson
  web/public/data/thermal_surface_meta.json
"""

from __future__ import annotations

import json
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import box

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
PROCESSED = ROOT / "data" / "processed"
WEB = ROOT / "web" / "public" / "data"

CRS_ANALYSIS = "EPSG:3083"
CRS_WEB = "EPSG:4326"

# ~12 km cells; only interpolate within 25 km of ≥2 controls
CELL_M = 12_000.0
MAX_RADIUS_KM = 25.0
MIN_POINTS = 2
# Soft TX bbox
LON_MIN, LON_MAX = -106.7, -93.5
LAT_MIN, LAT_MAX = 25.8, 36.6


def load_ihfc_heat_flow() -> gpd.GeoDataFrame:
    xlsx = RAW / "thermal" / "IHFC_2024_GHFDB.xlsx"
    if not xlsx.exists():
        baked = WEB / "thermal_points.json"
        if not baked.exists():
            raise FileNotFoundError(f"Missing {xlsx} and {baked}")
        payload = json.loads(baked.read_text(encoding="utf-8"))
        df = pd.DataFrame(payload["points"])
        df = df[df["q"].notna()].copy()
        gdf = gpd.GeoDataFrame(
            df,
            geometry=gpd.points_from_xy(df["lon"], df["lat"]),
            crs=CRS_WEB,
        )
        gdf["value"] = pd.to_numeric(gdf["q"], errors="coerce")
        gdf["metric"] = "heat_flow_mWm2"
        return gdf[gdf["value"].notna()].to_crs(CRS_ANALYSIS)

    df = pd.read_excel(xlsx, sheet_name=0, header=5)
    lat = pd.to_numeric(df["lat_NS"], errors="coerce")
    lon = pd.to_numeric(df["long_EW"], errors="coerce")
    q = pd.to_numeric(df["q"], errors="coerce")
    env = df["environment"].astype(str).str.lower() if "environment" in df.columns else ""

    work = pd.DataFrame({"lat": lat, "lon": lon, "q": q})
    if len(env):
        marine = env.str.contains("marine") | env.str.contains("ocean")
        work = work[~marine.values]
    work = work[
        (work["lon"] >= LON_MIN)
        & (work["lon"] <= LON_MAX)
        & (work["lat"] >= LAT_MIN)
        & (work["lat"] <= LAT_MAX)
    ]
    work.loc[(work["q"] <= 0) | (work["q"] >= 300), "q"] = np.nan
    work = work[work["q"].notna()].copy()
    work["value"] = work["q"]
    work["metric"] = "heat_flow_mWm2"
    gdf = gpd.GeoDataFrame(
        work,
        geometry=gpd.points_from_xy(work["lon"], work["lat"]),
        crs=CRS_WEB,
    )
    return gdf.to_crs(CRS_ANALYSIS)


def idw(values: np.ndarray, dists_m: np.ndarray, power: float = 2.0) -> float:
    d = np.maximum(dists_m, 1.0)  # avoid div0
    w = 1.0 / np.power(d, power)
    return float(np.sum(w * values) / np.sum(w))


def build_surface(points: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    if points.empty:
        return gpd.GeoDataFrame(
            columns=["metric", "unit", "label", "value", "n", "geometry"],
            crs=CRS_ANALYSIS,
        )

    minx, miny, maxx, maxy = points.total_bounds
    minx -= CELL_M
    miny -= CELL_M
    maxx += CELL_M
    maxy += CELL_M

    xs = np.arange(minx, maxx + CELL_M, CELL_M)
    ys = np.arange(miny, maxy + CELL_M, CELL_M)
    sindex = points.sindex
    coords = np.column_stack([points.geometry.x.values, points.geometry.y.values])
    vals = points["value"].to_numpy(dtype=float)

    features = []
    max_r = MAX_RADIUS_KM * 1000.0
    for x in xs:
        for y in ys:
            bbox = (x - max_r, y - max_r, x + max_r, y + max_r)
            idxs = list(sindex.intersection(bbox))
            if len(idxs) < MIN_POINTS:
                continue
            pts = coords[idxs]
            d = np.hypot(pts[:, 0] - x, pts[:, 1] - y)
            mask = d <= max_r
            if int(mask.sum()) < MIN_POINTS:
                continue
            v = idw(vals[idxs][mask], d[mask])
            features.append(
                {
                    "metric": "heat_flow_mWm2",
                    "unit": "mW_m2",
                    "label": "Heat flow",
                    "value": round(v, 2),
                    "n": int(mask.sum()),
                    "geometry": box(
                        x - CELL_M / 2,
                        y - CELL_M / 2,
                        x + CELL_M / 2,
                        y + CELL_M / 2,
                    ),
                }
            )
    print(f"  heat_flow_mWm2: cells={len(features)} from {len(points)} points")
    if not features:
        return gpd.GeoDataFrame(
            columns=["metric", "unit", "label", "value", "n", "geometry"],
            crs=CRS_ANALYSIS,
        )
    return gpd.GeoDataFrame(features, crs=CRS_ANALYSIS)


def main() -> None:
    PROCESSED.mkdir(parents=True, exist_ok=True)
    WEB.mkdir(parents=True, exist_ok=True)
    print("Loading IHFC heat-flow points...")
    pts = load_ihfc_heat_flow()
    print(f"Points: {len(pts)} (heat flow mW/m2 only)")
    print(
        f"Building constrained IDW surface "
        f"(cell~{CELL_M/1000:.0f} km, radius<={MAX_RADIUS_KM:.0f} km, min_n={MIN_POINTS})..."
    )
    surface = build_surface(pts)
    out = surface.to_crs(CRS_WEB)
    out = out[~out.geometry.is_empty & out.geometry.notna()]
    geo_path = PROCESSED / "thermal_surface.geojson"
    out.to_file(geo_path, driver="GeoJSON")
    (WEB / "thermal_surface.geojson").write_bytes(geo_path.read_bytes())

    meta = {
        "layer": "thermal_surface",
        "source": "IHFC Global Heat Flow Database Release 2024",
        "role": "map_context_only",
        "inScreeningScore": False,
        "notBottomHoleTemperature": True,
        "metric": "heat_flow_mWm2",
        "unit": "mW/m²",
        "method": "IDW within radius; cells require ≥min points inside radius",
        "cellKmApprox": CELL_M / 1000.0,
        "maxRadiusKm": MAX_RADIUS_KM,
        "minPoints": MIN_POINTS,
        "nCells": int(len(out)),
        "honesty": (
            "Local measured heat-flow surface only near IHFC q controls. "
            "Gradient excluded (different units). Does not interpolate across sparse regions. "
            "Not BHT. Not a ranking layer."
        ),
    }
    (WEB / "thermal_surface_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    (PROCESSED / "thermal_surface_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"Wrote {geo_path} cells={len(out)}")


if __name__ == "__main__":
    main()
