"""
Build county-level feature table for Phase 1 screening.

Outputs:
  data/processed/county_features.csv
  data/processed/county_features.parquet
  data/processed/tx_counties.geojson  (geometries only + ids)
"""

from __future__ import annotations

import json
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
PROCESSED = ROOT / "data" / "processed"

# Texas Centric Albers Equal Area — good for distance / area in TX
CRS_ANALYSIS = "EPSG:3083"
CRS_WEB = "EPSG:4326"
TX_STATEFP = "48"


def load_tx_counties() -> gpd.GeoDataFrame:
    shp = RAW / "counties" / "cb_2023_us_county_500k" / "cb_2023_us_county_500k.shp"
    if not shp.exists():
        raise FileNotFoundError(f"Missing counties shapefile: {shp}. Run download_data.py")
    gdf = gpd.read_file(shp)
    gdf = gdf[gdf["STATEFP"] == TX_STATEFP].copy()
    gdf["county_fips"] = gdf["GEOID"].astype(str)
    gdf["name"] = gdf["NAME"].astype(str)
    gdf = gdf.to_crs(CRS_ANALYSIS)
    gdf["area_km2"] = gdf.geometry.area / 1e6
    print(f"Counties: {len(gdf)}")
    return gdf[["county_fips", "name", "area_km2", "geometry"]]


def _pick_column(columns: list[str], candidates: list[str]) -> str | None:
    lower = {c.lower(): c for c in columns}
    for cand in candidates:
        if cand.lower() in lower:
            return lower[cand.lower()]
    # fuzzy contains
    for c in columns:
        cl = c.lower().replace(" ", "").replace("_", "")
        for cand in candidates:
            if cand.lower().replace(" ", "").replace("_", "") in cl:
                return c
    return None


def load_thermal_points() -> gpd.GeoDataFrame:
    """Load IHFC GHFDB 2024 TX points with heat flow and optional gradient."""
    xlsx = RAW / "thermal" / "IHFC_2024_GHFDB.xlsx"
    if not xlsx.exists():
        raise FileNotFoundError(f"Missing thermal workbook: {xlsx}. Run download_data.py")

    xl = pd.ExcelFile(xlsx)
    sheet = xl.sheet_names[0]
    for name in xl.sheet_names:
        if any(k in name.lower() for k in ["data", "ghfdb", "heat", "unique"]):
            sheet = name
            break
    df = pd.read_excel(xlsx, sheet_name=sheet, header=5)
    print(f"Thermal sheet={sheet!r} rows={len(df)}")

    work = df.copy()
    work["_lat"] = pd.to_numeric(work["lat_NS"], errors="coerce")
    work["_lon"] = pd.to_numeric(work["long_EW"], errors="coerce")
    work["_hf"] = pd.to_numeric(work["q"], errors="coerce")
    # Prefer corrected gradient when present; else mean gradient.
    g_cor = pd.to_numeric(work.get("T_grad_mean_cor"), errors="coerce")
    g_mean = pd.to_numeric(work.get("T_grad_mean"), errors="coerce")
    work["_grad"] = g_cor.where(g_cor.notna(), g_mean)

    work = work.dropna(subset=["_lat", "_lon"])

    if "environment" in work.columns:
        dom = work["environment"].astype(str).str.lower()
        marine = dom.str.contains("marine") | dom.str.contains("ocean")
        if marine.any() and (~marine).any():
            work = work[~marine]

    work = work[
        (work["_lon"] >= -106.7)
        & (work["_lon"] <= -93.5)
        & (work["_lat"] >= 25.8)
        & (work["_lat"] <= 36.6)
    ]

    # Physical gates
    work.loc[(work["_hf"] <= 0) | (work["_hf"] >= 300), "_hf"] = np.nan
    work.loc[(work["_grad"] < 5) | (work["_grad"] > 150), "_grad"] = np.nan

    work = work[work["_hf"].notna() | work["_grad"].notna()]

    gdf = gpd.GeoDataFrame(
        work,
        geometry=gpd.points_from_xy(work["_lon"], work["_lat"]),
        crs=CRS_WEB,
    ).to_crs(CRS_ANALYSIS)
    print(
        f"Thermal TX points: {len(gdf)} "
        f"(heatflow={gdf['_hf'].notna().sum()}, gradient={gdf['_grad'].notna().sum()})"
    )
    return gdf[["_hf", "_grad", "geometry"]].rename(
        columns={"_hf": "heatflow", "_grad": "gradient"}
    )


def aggregate_thermal(counties: gpd.GeoDataFrame, points: gpd.GeoDataFrame) -> pd.DataFrame:
    joined = gpd.sjoin(points, counties[["county_fips", "geometry"]], how="inner", predicate="within")

    hf = (
        joined.dropna(subset=["heatflow"])
        .groupby("county_fips", as_index=False)
        .agg(heatflow_mean=("heatflow", "mean"), heatflow_n=("heatflow", "count"))
    )
    gr = (
        joined.dropna(subset=["gradient"])
        .groupby("county_fips", as_index=False)
        .agg(gradient_mean=("gradient", "mean"), gradient_n=("gradient", "count"))
    )
    agg = hf.merge(gr, on="county_fips", how="outer")

    # Prefer gradient for scoring raw thermal; else heat-flow fallback.
    use_grad = agg["gradient_n"].fillna(0) > 0
    agg["thermal_mean"] = np.where(use_grad, agg["gradient_mean"], agg["heatflow_mean"])
    agg["thermal_n"] = np.where(use_grad, agg["gradient_n"], agg["heatflow_n"]).astype(float)
    agg["thermal_metric"] = np.where(use_grad, "gradient_C_per_km", "heat_flow_mWm2")
    agg["thermal_median"] = agg["thermal_mean"]  # placeholder for schema compat

    print(
        f"Counties with gradient: {int(use_grad.sum())}; "
        f"heat-flow fallback only: {int((~use_grad & agg['heatflow_n'].fillna(0).gt(0)).sum())}"
    )
    return agg


def load_transmission() -> gpd.GeoDataFrame:
    path = RAW / "transmission" / "hifld_tx_transmission.geojson"
    if not path.exists():
        raise FileNotFoundError(f"Missing transmission geojson: {path}")
    gdf = gpd.read_file(path)
    if gdf.crs is None:
        gdf = gdf.set_crs(CRS_WEB)
    gdf = gdf.to_crs(CRS_ANALYSIS)
    print(f"Transmission features: {len(gdf)}")
    return gdf


def infra_distance_km(counties: gpd.GeoDataFrame, lines: gpd.GeoDataFrame) -> pd.DataFrame:
    """Distance from county centroid to nearest transmission line (km)."""
    centroids = counties.copy()
    centroids["geometry"] = centroids.representative_point()
    # unary union of lines for nearest
    line_union = lines.union_all() if hasattr(lines, "union_all") else lines.unary_union
    dist_m = centroids.geometry.distance(line_union)
    out = pd.DataFrame(
        {
            "county_fips": counties["county_fips"].values,
            "infra_dist_km": (dist_m / 1000.0).values,
        }
    )
    print(
        f"Infra distance km: min={out['infra_dist_km'].min():.2f} "
        f"median={out['infra_dist_km'].median():.2f} max={out['infra_dist_km'].max():.2f}"
    )
    return out


def build() -> pd.DataFrame:
    PROCESSED.mkdir(parents=True, exist_ok=True)
    counties = load_tx_counties()
    thermal_pts = load_thermal_points()
    thermal = aggregate_thermal(counties, thermal_pts)
    lines = load_transmission()
    infra = infra_distance_km(counties, lines)

    features = counties.drop(columns="geometry").merge(thermal, on="county_fips", how="left")
    features = features.merge(infra, on="county_fips", how="left")

    # Confidence uses thermal control count (documented in data-sources.md)
    features["well_count"] = features["thermal_n"].fillna(0).astype(int)
    features["thermal_mean"] = features["thermal_mean"].astype(float)
    features["infra_dist_km"] = features["infra_dist_km"].astype(float)

    features["crs_analysis"] = CRS_ANALYSIS
    features["lineage"] = json.dumps(
        {
            "counties": "census_cb_2023_us_county_500k",
            "thermal": "ihfc_2024_ghfdb",
            "transmission": "hifld_electric_power_transmission_lines",
            "confidence": "thermal_control_point_count",
            "retrieved": "2026-08-13",
        }
    )

    # QA
    n = len(features)
    assert n >= 250, f"Expected ~254 TX counties, got {n}"
    null_infra = features["infra_dist_km"].isna().sum()
    null_thermal = features["thermal_mean"].isna().sum()
    print(f"QA: counties={n} null_thermal={null_thermal} null_infra={null_infra}")

    csv_path = PROCESSED / "county_features.csv"
    pq_path = PROCESSED / "county_features.parquet"
    features.drop(columns=["lineage"]).to_csv(csv_path, index=False)
    features.drop(columns=["lineage"]).to_parquet(pq_path, index=False)

    # Web counties geojson (ids + names only; scores come later)
    web = counties.to_crs(CRS_WEB)[["county_fips", "name", "geometry"]]
    web_path = PROCESSED / "tx_counties.geojson"
    web.to_file(web_path, driver="GeoJSON")

    meta = {
        "n_counties": int(n),
        "n_with_thermal": int((~features["thermal_mean"].isna()).sum()),
        "thermal_metric": str(features["thermal_metric"].dropna().iloc[0])
        if features["thermal_metric"].notna().any()
        else None,
        "crs_analysis": CRS_ANALYSIS,
        "outputs": [str(csv_path), str(pq_path), str(web_path)],
    }
    (PROCESSED / "county_features_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"Wrote {csv_path}")
    print(f"Wrote {pq_path}")
    print(f"Wrote {web_path}")
    return features


def main() -> None:
    build()


if __name__ == "__main__":
    main()
