"""
Export Phase 2.1 static assets for site dossiers:
  - thermal_points.json  (TX IHFC points)
  - infra_grid.json      (distance to HIFLD transmission, degrees grid)

Writes to data/processed/ and web/public/data/
"""

from __future__ import annotations

import json
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import Point

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
PROCESSED = ROOT / "data" / "processed"
WEB = ROOT / "web" / "public" / "data"

CRS_ANALYSIS = "EPSG:3083"
CRS_WEB = "EPSG:4326"


def export_thermal_points() -> Path:
    """Export IHFC heat-flow (q, mW/m²) points only — do not mix with gradient."""
    xlsx = RAW / "thermal" / "IHFC_2024_GHFDB.xlsx"
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
        (work["lon"] >= -106.7)
        & (work["lon"] <= -93.5)
        & (work["lat"] >= 25.8)
        & (work["lat"] <= 36.6)
    ]
    work.loc[(work["q"] <= 0) | (work["q"] >= 300), "q"] = np.nan
    work = work[work["q"].notna()].copy()

    points = [
        {
            "lat": round(float(r.lat), 5),
            "lon": round(float(r.lon), 5),
            "q": round(float(r.q), 2),
        }
        for r in work.itertuples(index=False)
    ]
    payload = {
        "n": len(points),
        "points": points,
        "source": "IHFC_2024_GHFDB",
        "metric": "heat_flow_mWm2",
        "unit": "mW/m²",
        "note": "Heat flow only — geothermal gradient points deferred until a clean source.",
    }
    out = PROCESSED / "thermal_points.json"
    out.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    WEB.mkdir(parents=True, exist_ok=True)
    (WEB / "thermal_points.json").write_text(out.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"Thermal points (heat flow only): {len(points)} -> {out}")
    return out


def export_infra_grid(step_deg: float = 0.15) -> Path:
    """Precompute distance (km) to nearest transmission on a lon/lat grid."""
    lines_path = RAW / "transmission" / "hifld_tx_transmission.geojson"
    lines = gpd.read_file(lines_path)
    if lines.crs is None:
        lines = lines.set_crs(CRS_WEB)
    lines = lines.to_crs(CRS_ANALYSIS)
    line_union = lines.union_all() if hasattr(lines, "union_all") else lines.unary_union

    lons = np.arange(-106.7, -93.5 + 1e-9, step_deg)
    lats = np.arange(25.8, 36.6 + 1e-9, step_deg)
    cells = []
    for lat in lats:
        for lon in lons:
            pt = gpd.GeoSeries([Point(lon, lat)], crs=CRS_WEB).to_crs(CRS_ANALYSIS).iloc[0]
            dist_km = float(pt.distance(line_union) / 1000.0)
            cells.append(
                {
                    "lat": round(float(lat), 4),
                    "lon": round(float(lon), 4),
                    "distKm": round(dist_km, 2),
                }
            )

    payload = {
        "stepDeg": step_deg,
        "bbox": [-106.7, 25.8, -93.5, 36.6],
        "n": len(cells),
        "cells": cells,
        "source": "HIFLD Electric Power Transmission Lines",
    }
    out = PROCESSED / "infra_grid.json"
    text = json.dumps(payload, separators=(",", ":"))
    out.write_text(text, encoding="utf-8")
    (WEB / "infra_grid.json").write_text(text, encoding="utf-8")
    print(f"Infra grid: {len(cells)} cells step={step_deg} -> {out} ({len(text):,} bytes)")
    return out


def main() -> None:
    PROCESSED.mkdir(parents=True, exist_ok=True)
    WEB.mkdir(parents=True, exist_ok=True)
    export_thermal_points()
    export_infra_grid(0.15)


if __name__ == "__main__":
    main()
