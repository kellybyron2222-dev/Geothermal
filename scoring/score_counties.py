"""
Milestone 2: ScreeningScore + confidence + explanations.

Reads data/processed/county_features.* and tx_counties.geojson.
Writes:
  data/processed/prospects.json
  data/processed/prospects.geojson
  data/processed/meta.json
  web/public/data/* (static contract for the app)
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
PROCESSED = ROOT / "data" / "processed"
WEB_DATA = ROOT / "web" / "public" / "data"

METHODOLOGY_VERSION = "0.3.1"
W_THERMAL = 0.60
W_INFRA = 0.40

THERMAL_SOURCE = "IHFC Global Heat Flow Database Release 2024 (gradient preferred; heat flow fallback)"
THERMAL_VINTAGE = "2024"
INFRA_SOURCE = "HIFLD Electric Power Transmission Lines"
INFRA_VINTAGE = "static extract 2026-08-13"


def winsorize(series: pd.Series, lo: float = 0.10, hi: float = 0.90) -> pd.Series:
    valid = series.dropna()
    if valid.empty:
        return series
    p_lo, p_hi = valid.quantile([lo, hi])
    return series.clip(lower=p_lo, upper=p_hi)


def scale_0_100(series: pd.Series, higher_is_better: bool = True) -> pd.Series:
    """Min-max scale to 0–100 within Texas. NaN stays NaN."""
    s = series.astype(float)
    valid = s.dropna()
    if valid.empty:
        return s
    vmin, vmax = valid.min(), valid.max()
    if vmax == vmin:
        out = s.copy()
        out.loc[valid.index] = 50.0
        return out
    scaled = (s - vmin) / (vmax - vmin) * 100.0
    if not higher_is_better:
        scaled = 100.0 - scaled
    return scaled


def confidence_band(count: int, t_low: float, t_high: float) -> str:
    if count <= 0:
        return "Unknown"
    if count >= t_high:
        return "High"
    if count >= t_low:
        return "Medium"
    return "Low"


def drivers_for(row: pd.Series) -> list[str]:
    out: list[str] = []
    metric = str(row.get("thermal_metric", ""))
    if pd.notna(row["s_thermal"]):
        if metric == "gradient_C_per_km":
            if row["s_thermal"] >= 70:
                out.append("Above-average geothermal gradient relative to Texas")
            elif row["s_thermal"] <= 30:
                out.append("Below-average geothermal gradient relative to Texas")
            else:
                out.append("Mid-range geothermal gradient relative to Texas")
        else:
            if row["s_thermal"] >= 70:
                out.append("Above-average heat-flow proxy (gradient unavailable; fallback)")
            elif row["s_thermal"] <= 30:
                out.append("Below-average heat-flow proxy (gradient unavailable; fallback)")
            else:
                out.append("Mid-range heat-flow proxy (gradient unavailable; fallback)")
    else:
        out.append("No thermal control points in this county")

    if row["s_infra"] >= 70:
        out.append("Favorable proximity to transmission (grid proximity proxy)")
    elif row["s_infra"] <= 30:
        out.append("Relatively distant from mapped transmission lines")

    if row["confidence"] == "Low":
        out.append("Sparse thermal control — treat screening score as indicative only")
    elif row["confidence"] == "Unknown":
        out.append("Thermal evidence unavailable — confidence unknown")

    return out[:3]


def limitations_for(row: pd.Series) -> list[str]:
    lim = [
        "Screening index only — not a resource assessment or drill recommendation.",
        "Transmission distance is a proximity proxy — not interconnection feasibility.",
    ]
    metric = str(row.get("thermal_metric", ""))
    if pd.isna(row["thermal_mean"]):
        lim.append("No IHFC thermal observations joined to this county; thermal factor set to 0.")
    elif metric == "heat_flow_mWm2":
        lim.append(
            "Geothermal gradient unavailable for this county; thermal factor uses heat-flow fallback."
        )
    if row["confidence"] in ("Low", "Unknown"):
        lim.append("Limited thermal control density in this county.")
    if row.get("area_km2", 0) and row["area_km2"] > 8000:
        lim.append("Large county — intra-county variation is not resolved at this grain.")
    return lim


def build() -> None:
    features = pd.read_csv(PROCESSED / "county_features.csv")
    counties = gpd.read_file(PROCESSED / "tx_counties.geojson")

    # Confidence thresholds from positive well_count distribution
    positive = features.loc[features["well_count"] > 0, "well_count"]
    t_low = float(positive.quantile(0.25)) if len(positive) else 5.0
    t_high = float(positive.quantile(0.75)) if len(positive) else 20.0

    thermal_w = winsorize(features["thermal_mean"])
    # Scale gradient and heat-flow cohorts separately (different units).
    s_thermal = pd.Series(np.nan, index=features.index, dtype=float)
    is_grad = features["thermal_metric"] == "gradient_C_per_km"
    is_hf = features["thermal_metric"] == "heat_flow_mWm2"
    if is_grad.any():
        s_thermal.loc[is_grad] = scale_0_100(winsorize(features.loc[is_grad, "thermal_mean"]))
    if is_hf.any():
        s_thermal.loc[is_hf] = scale_0_100(winsorize(features.loc[is_hf, "thermal_mean"]))

    infra_w = winsorize(features["infra_dist_km"])
    s_infra = scale_0_100(infra_w, higher_is_better=False)  # nearer = better

    df = features.copy()
    df["s_thermal"] = s_thermal
    df["s_infra"] = s_infra.fillna(0.0)
    thermal_for_score = df["s_thermal"].fillna(0.0)
    df["screening_score"] = W_THERMAL * thermal_for_score + W_INFRA * df["s_infra"]
    df["confidence"] = [
        confidence_band(int(c), t_low, t_high) for c in df["well_count"].fillna(0)
    ]

    df["conf_rank"] = df["confidence"].map(
        {"High": 3, "Medium": 2, "Low": 1, "Unknown": 0}
    )
    df = df.sort_values(
        by=["screening_score", "s_thermal", "conf_rank"],
        ascending=[False, False, False],
        na_position="last",
    ).reset_index(drop=True)
    df["rank"] = np.arange(1, len(df) + 1)

    records = []
    for _, row in df.iterrows():
        st = None if pd.isna(row["s_thermal"]) else round(float(row["s_thermal"]), 2)
        st_score = 0.0 if pd.isna(row["thermal_mean"]) else float(row["s_thermal"])
        si = round(float(row["s_infra"]), 2)
        thermal_raw = None if pd.isna(row["thermal_mean"]) else round(float(row["thermal_mean"]), 2)
        metric = str(row.get("thermal_metric", "heat_flow_mWm2"))
        if metric == "gradient_C_per_km":
            thermal_label = "Geothermal gradient"
            thermal_unit = "°C/km"
        else:
            thermal_label = "Heat-flow fallback"
            thermal_unit = "mW/m²"
        factors = [
            {
                "id": "thermal",
                "label": thermal_label,
                "rawValue": thermal_raw,
                "rawUnit": thermal_unit,
                "score0to100": round(st_score, 2),
                "weight": W_THERMAL,
                "weightedContribution": round(W_THERMAL * st_score, 2),
                "source": THERMAL_SOURCE,
                "vintage": THERMAL_VINTAGE,
                "metric": metric,
            },
            {
                "id": "infra",
                "label": "Transmission proximity",
                "rawValue": round(float(row["infra_dist_km"]), 2),
                "rawUnit": "km to nearest line",
                "score0to100": si,
                "weight": W_INFRA,
                "weightedContribution": round(W_INFRA * si, 2),
                "source": INFRA_SOURCE,
                "vintage": INFRA_VINTAGE,
            },
        ]
        rec = {
            "countyFips": str(row["county_fips"]),
            "name": str(row["name"]),
            "rank": int(row["rank"]),
            "screeningScore": round(float(row["screening_score"]), 2),
            "confidence": row["confidence"],
            "factors": factors,
            "drivers": drivers_for(row),
            "limitations": limitations_for(row),
            "areaKm2": round(float(row["area_km2"]), 1) if pd.notna(row["area_km2"]) else None,
            "thermalControlCount": int(row["well_count"]) if pd.notna(row["well_count"]) else 0,
        }
        records.append(rec)

    meta = {
        "methodologyVersion": METHODOLOGY_VERSION,
        "weights": {"thermal": W_THERMAL, "infra": W_INFRA},
        "confidenceThresholds": {"tLow": t_low, "tHigh": t_high},
        "nCounties": len(records),
        "sources": {
            "thermal": {"name": THERMAL_SOURCE, "vintage": THERMAL_VINTAGE},
            "infra": {"name": INFRA_SOURCE, "vintage": INFRA_VINTAGE},
            "counties": {"name": "Census cb_2023_us_county_500k", "vintage": "2023"},
        },
        "disclaimer": (
            "Regional screening index for next-gen geothermal focus in Texas. "
            "Gradient and heat-flow counties are separate cohorts — scores are not "
            "scientifically comparable across thermal metrics. "
            "Not a resource map, not interconnection feasibility, not a drill recommendation."
        ),
        "thermalCohorts": {
            "note": "S_thermal scaled within metric cohorts; do not treat one statewide ladder as cross-metric.",
            "minGradientN": 3,
        },
    }

    # GeoJSON with score properties
    score_lookup = {r["countyFips"]: r for r in records}
    geo = counties.copy()
    geo["county_fips"] = geo["county_fips"].astype(str)
    props = []
    for _, g in geo.iterrows():
        r = score_lookup[str(g["county_fips"])]
        thermal = next((f for f in r["factors"] if f["id"] == "thermal"), None)
        metric = (thermal or {}).get("metric") or "none"
        if thermal is None or thermal.get("rawValue") is None:
            metric = "none"
        props.append(
            {
                "countyFips": r["countyFips"],
                "name": r["name"],
                "rank": r["rank"],
                "screeningScore": r["screeningScore"],
                "confidence": r["confidence"],
                "thermalMetric": metric,
                "thermalControlCount": r.get("thermalControlCount", 0),
            }
        )
    geo_out = gpd.GeoDataFrame(props, geometry=geo.geometry.values, crs="EPSG:4326")

    PROCESSED.mkdir(parents=True, exist_ok=True)
    WEB_DATA.mkdir(parents=True, exist_ok=True)

    prospects_json = {"meta": meta, "counties": records}
    (PROCESSED / "prospects.json").write_text(json.dumps(prospects_json), encoding="utf-8")
    (PROCESSED / "meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    geo_out.to_file(PROCESSED / "prospects.geojson", driver="GeoJSON")

    # Publish static contract
    shutil.copyfile(PROCESSED / "prospects.json", WEB_DATA / "prospects.json")
    shutil.copyfile(PROCESSED / "prospects.geojson", WEB_DATA / "prospects.geojson")
    shutil.copyfile(PROCESSED / "meta.json", WEB_DATA / "meta.json")

    top = records[:5]
    print(f"Scored {len(records)} counties. methodology={METHODOLOGY_VERSION}")
    print(f"Confidence thresholds: T_low={t_low:.1f} T_high={t_high:.1f}")
    print("Top 5:")
    for r in top:
        print(f"  #{r['rank']} {r['name']}: {r['screeningScore']} ({r['confidence']})")
    print(f"Wrote {WEB_DATA / 'prospects.json'}")
    print(f"Wrote {WEB_DATA / 'prospects.geojson'}")


if __name__ == "__main__":
    build()
