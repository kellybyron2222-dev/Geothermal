"""
Methodology v0.4.0 — Data Depth scoring (Stanford T@depth + infra).

Reads:
  data/processed/county_features.csv
  data/processed/data_depth_features.csv  (optional; left join on county_fips)
  data/processed/tx_counties.geojson

Writes same contract as score_counties.py:
  data/processed/prospects.json | prospects.geojson | meta.json
  web/public/data/* (static publish)

When data_depth_features.csv is missing or has no usable tdepth_mean:
  falls back to IHFC thermal (gradient preferred / heat-flow) with
  thermal_mode=legacy_ihfc (loud in meta + per-county flags).

Expected data_depth_features.csv columns (flexible aliases accepted):
  county_fips (required)
  tdepth_mean          county mean model T at depth (°C)
  tdepth_km            depth slice (km), e.g. 4.0
  tdepth_vintage       Stanford / GDR vintage string
  smu_n | bht_n        measured control counts (confidence)
  rrc_well_density | well_density_per_km2 | well_density_band
  dist_substation_km   HIFLD substation distance (km)
  padus_friction       gate / friction flag (bool-ish)
  texnet_caution       seismicity caution flag (bool-ish)
  *_vintage            optional per-layer vintage strings
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

METHODOLOGY_VERSION = "0.4.0"

# Data Depth opportunity weights (judgment FINAL NOW)
W_TDEPTH = 0.55
W_INFRA_DD = 0.45

# Legacy IHFC opportunity weights (fallback only)
W_THERMAL_LEGACY = 0.60
W_INFRA_LEGACY = 0.40

THERMAL_SOURCE_LEGACY = (
    "IHFC Global Heat Flow Database Release 2024 (gradient preferred; heat flow fallback)"
)
THERMAL_VINTAGE_LEGACY = "2024"
TDEPTH_SOURCE = "Stanford Thermal Earth Model / GDR 1592 (model T@depth — not measured)"
TDEPTH_VINTAGE_DEFAULT = "GDR-1592"
INFRA_SOURCE_LINES = "HIFLD Electric Power Transmission Lines"
INFRA_SOURCE_SUBSTATIONS = "HIFLD Electric Substations"
INFRA_VINTAGE_DEFAULT = "static extract 2026-08-13"

DATA_DEPTH_PATH = PROCESSED / "data_depth_features.csv"


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


def _first_col(df: pd.DataFrame, candidates: list[str]) -> str | None:
    lower = {c.lower(): c for c in df.columns}
    for cand in candidates:
        if cand.lower() in lower:
            return lower[cand.lower()]
    return None


def _as_nullable_bool_series(s: pd.Series) -> pd.Series:
    """Parse bool-ish values; preserve NaN/Unknown as pd.NA (never coerce missing→False)."""
    out = pd.Series(pd.NA, index=s.index, dtype="boolean")
    if s is None:
        return out
    raw = s.copy()
    # Explicit unknown tokens → NA
    as_str = raw.astype(str).str.strip().str.lower()
    unknown_mask = as_str.isin(
        {"", "nan", "none", "null", "<na>", "unknown", "na", "n/a"}
    ) | raw.isna()
    true_mask = as_str.isin({"1", "true", "t", "yes", "y", "caution", "friction", "flag"})
    false_mask = as_str.isin({"0", "false", "f", "no", "n", "clear"})
    if pd.api.types.is_bool_dtype(raw):
        out = raw.astype("boolean")
        return out
    if pd.api.types.is_numeric_dtype(raw):
        numeric = pd.to_numeric(raw, errors="coerce")
        out = pd.Series(pd.NA, index=s.index, dtype="boolean")
        known = numeric.notna()
        out.loc[known] = numeric.loc[known].ne(0)
        return out
    out.loc[true_mask & ~unknown_mask] = True
    out.loc[false_mask & ~unknown_mask] = False
    return out


def _tri_state_status(
    flag: object,
    layer_status: object | None,
    true_label: str,
    false_label: str = "clear",
) -> str:
    """Map nullable flag (+ optional layer status) → caution|friction|clear|unknown."""
    if layer_status is not None and str(layer_status).strip().lower() in (
        "unknown",
        "not_loaded",
        "nan",
        "",
    ):
        return "unknown"
    if flag is None or (isinstance(flag, float) and np.isnan(flag)):
        return "unknown"
    try:
        if pd.isna(flag):
            return "unknown"
    except (TypeError, ValueError):
        pass
    if bool(flag):
        return true_label
    return false_label


def _flag_is_true(val: object) -> bool:
    """True only when explicitly True — Unknown/NA does not demote."""
    if val is None:
        return False
    try:
        if pd.isna(val):
            return False
    except (TypeError, ValueError):
        pass
    return bool(val)


def load_data_depth(county_fips: pd.Series) -> tuple[pd.DataFrame, bool]:
    """Left-joinable frame indexed like features; empty cols if file missing."""
    base = pd.DataFrame({"county_fips": county_fips.astype(str).values})
    if not DATA_DEPTH_PATH.exists():
        print(f"No {DATA_DEPTH_PATH.name} - legacy IHFC thermal fallback.")
        return _empty_depth_frame(base), False

    raw = pd.read_csv(DATA_DEPTH_PATH)
    fips_col = _first_col(raw, ["county_fips", "geoid", "fips"])
    if fips_col is None:
        print("data_depth_features.csv missing county_fips — ignoring file.")
        return _empty_depth_frame(base), False

    raw = raw.copy()
    raw["county_fips"] = raw[fips_col].astype(str)

    out = base.copy()

    tdepth_col = _first_col(raw, ["tdepth_mean", "t_depth_mean", "tdepth_c", "temp_at_depth_c"])
    km_col = _first_col(raw, ["tdepth_km", "depth_km", "t_depth_km"])
    smu_col = _first_col(
        raw,
        ["smu_n", "smu_count", "smu_bht_n", "thermal_control_n", "measured_control_n"],
    )
    bht_col = _first_col(raw, ["bht_n", "bht_count", "measured_bht_n"])
    dens_col = _first_col(
        raw,
        [
            "rrc_well_density",
            "well_density_per_km2",
            "well_density",
            "rrc_density",
            "well_density_band",
        ],
    )
    dens_band_col = _first_col(raw, ["well_density_band", "rrc_density_band"])
    sub_col = _first_col(raw, ["dist_substation_km", "substation_dist_km", "infra_dist_substation_km"])
    padus_col = _first_col(
        raw, ["padus_friction", "padus_gate", "padus_flag", "padus_protected_flag"]
    )
    texnet_col = _first_col(
        raw,
        ["texnet_caution", "texnet_flag", "texnet_caution_flag", "texnet_risk_flag"],
    )
    texnet_status_col = _first_col(raw, ["texnet_status"])
    padus_status_col = _first_col(raw, ["padus_status"])
    merged = out.merge(raw, on="county_fips", how="left", suffixes=("", "_dd"))

    out["tdepth_mean"] = (
        pd.to_numeric(merged[tdepth_col], errors="coerce") if tdepth_col else np.nan
    )
    out["tdepth_km"] = (
        pd.to_numeric(merged[km_col], errors="coerce") if km_col else np.nan
    )
    out["smu_n"] = (
        pd.to_numeric(merged[smu_col], errors="coerce").fillna(0).astype(int) if smu_col else 0
    )
    out["bht_n"] = (
        pd.to_numeric(merged[bht_col], errors="coerce").fillna(0).astype(int) if bht_col else 0
    )
    if dens_col:
        out["rrc_well_density"] = pd.to_numeric(merged[dens_col], errors="coerce")
    else:
        out["rrc_well_density"] = np.nan
    if dens_band_col and dens_band_col != dens_col:
        out["well_density_band"] = merged[dens_band_col].astype(str)
    else:
        out["well_density_band"] = pd.NA
    dens_note_col = _first_col(raw, ["well_density_note", "rrc_density_note"])
    if dens_note_col:
        out["well_density_note"] = merged[dens_note_col].astype(str)
    else:
        out["well_density_note"] = pd.NA
    out["dist_substation_km"] = (
        pd.to_numeric(merged[sub_col], errors="coerce") if sub_col else np.nan
    )
    # Nullable flags: missing → NA (Unknown), never silent False
    if padus_col:
        out["padus_friction"] = _as_nullable_bool_series(merged[padus_col])
    else:
        out["padus_friction"] = pd.Series(pd.NA, index=out.index, dtype="boolean")
    if texnet_col:
        out["texnet_caution"] = _as_nullable_bool_series(merged[texnet_col])
    else:
        out["texnet_caution"] = pd.Series(pd.NA, index=out.index, dtype="boolean")
    if texnet_status_col:
        out["texnet_status"] = merged[texnet_status_col].astype(str)
    else:
        out["texnet_status"] = pd.NA
    if padus_status_col:
        out["padus_status"] = merged[padus_status_col].astype(str)
    else:
        out["padus_status"] = pd.NA

    # Per-layer vintages (optional columns)
    for key, candidates in {
        "tdepth_vintage": ["tdepth_vintage", "stanford_vintage", "gdr1592_vintage"],
        "smu_vintage": ["smu_vintage", "gdr1704_vintage", "bht_vintage"],
        "rrc_vintage": ["rrc_vintage", "well_density_vintage"],
        "substation_vintage": ["substation_vintage", "hifld_substation_vintage"],
        "padus_vintage": ["padus_vintage"],
        "texnet_vintage": ["texnet_vintage"],
        "infra_line_vintage": ["infra_line_vintage", "transmission_vintage"],
    }.items():
        col = _first_col(merged, candidates)
        out[key] = merged[col].astype(str) if col else pd.NA

    n_tdepth = int(out["tdepth_mean"].notna().sum())
    print(
        f"Joined data_depth_features: counties={len(out)} with_tdepth={n_tdepth} "
        f"with_substation={int(out['dist_substation_km'].notna().sum())}"
    )
    return out, True


def _empty_depth_frame(base: pd.DataFrame) -> pd.DataFrame:
    out = base.copy()
    out["tdepth_mean"] = np.nan
    out["tdepth_km"] = np.nan
    out["smu_n"] = 0
    out["bht_n"] = 0
    out["rrc_well_density"] = np.nan
    out["well_density_band"] = pd.NA
    out["well_density_note"] = pd.NA
    out["dist_substation_km"] = np.nan
    out["padus_friction"] = pd.Series(pd.NA, index=out.index, dtype="boolean")
    out["texnet_caution"] = pd.Series(pd.NA, index=out.index, dtype="boolean")
    out["texnet_status"] = "unknown"
    out["padus_status"] = "unknown"
    for key in (
        "tdepth_vintage",
        "smu_vintage",
        "rrc_vintage",
        "substation_vintage",
        "padus_vintage",
        "texnet_vintage",
        "infra_line_vintage",
    ):
        out[key] = pd.NA
    return out


def density_band(series: pd.Series, explicit: pd.Series) -> pd.Series:
    """Return High/Medium/Low/Unknown well-density bands."""
    out = pd.Series("Unknown", index=series.index, dtype=object)
    if explicit.notna().any():
        mapped = (
            explicit.astype(str)
            .str.strip()
            .str.lower()
            .map(
                {
                    "high": "High",
                    "h": "High",
                    "medium": "Medium",
                    "med": "Medium",
                    "m": "Medium",
                    "low": "Low",
                    "l": "Low",
                    "unknown": "Unknown",
                    "nan": "Unknown",
                    "none": "Unknown",
                }
            )
        )
        use = mapped.notna()
        out.loc[use] = mapped.loc[use]
    valid = series.dropna()
    if valid.empty:
        return out
    # Only fill where still Unknown and numeric density present
    need = out.eq("Unknown") & series.notna()
    if not need.any():
        return out
    q_lo, q_hi = valid.quantile([0.33, 0.67])
    vals = series.loc[need]
    bands = pd.Series("Medium", index=vals.index)
    bands.loc[vals <= q_lo] = "Low"
    bands.loc[vals >= q_hi] = "High"
    out.loc[need] = bands
    return out


def confidence_v04(
    ihfc_n: int,
    measured_n: int,
    density_band_name: str,
    model_thermal: bool,
    texnet_caution: bool | None,
    padus_friction: bool | None,
    t_low: float,
    t_high: float,
) -> str:
    """
    Combine IHFC + SMU/BHT measured counts + RRC density bands.
    Demote when opportunity thermal is model-only with thin measured control.
    Nullable risk flags: only demote when True; Unknown does not demote as clear.
    """
    combined = int(ihfc_n) + int(measured_n)
    if combined <= 0 and density_band_name == "Unknown":
        band = "Unknown"
    elif combined >= t_high or (combined >= t_low and density_band_name == "High"):
        band = "High"
    elif combined >= t_low or density_band_name in ("Medium", "High"):
        band = "Medium"
    elif combined > 0 or density_band_name == "Low":
        band = "Low"
    else:
        band = "Unknown"

    # Model-only with low measured → demote at least one step
    if model_thermal and measured_n < max(3, int(t_low)):
        demote = {"High": "Medium", "Medium": "Low", "Low": "Low", "Unknown": "Unknown"}
        band = demote[band]

    # Risk / gate: demote only when explicitly True — Unknown ≠ clear demotion
    if _flag_is_true(texnet_caution) or _flag_is_true(padus_friction):
        demote = {"High": "Medium", "Medium": "Low", "Low": "Low", "Unknown": "Unknown"}
        band = demote[band]

    return band


def tdepth_metric_id(km: float | None) -> str:
    if km is None or (isinstance(km, float) and np.isnan(km)):
        return "tdepth_C_kmX"
    # Prefer integer km labels when close (e.g. 4.0 → km4)
    if abs(km - round(km)) < 1e-6:
        return f"tdepth_C_km{int(round(km))}"
    return f"tdepth_C_km{km:g}"


def drivers_for(row: pd.Series, mode: str) -> list[str]:
    out: list[str] = []
    if mode == "stanford_tdepth":
        if pd.notna(row["s_thermal"]):
            if row["s_thermal"] >= 70:
                out.append("Above-average model T@depth relative to Texas (Stanford)")
            elif row["s_thermal"] <= 30:
                out.append("Below-average model T@depth relative to Texas (Stanford)")
            else:
                out.append("Mid-range model T@depth relative to Texas (Stanford)")
        else:
            out.append("No model T@depth joined for this county")
    else:
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

    infra_raw = row.get("infra_dist_used_km")
    if pd.notna(row["s_infra"]):
        if row["s_infra"] >= 70:
            out.append("Favorable proximity to transmission/substation (grid proximity proxy)")
        elif row["s_infra"] <= 30:
            out.append("Relatively distant from mapped transmission/substation infrastructure")

    if _flag_is_true(row.get("texnet_caution")):
        out.append("TexNet seismicity caution — confidence demoted")
    elif str(row.get("texnet_status_resolved") or "").lower() == "unknown" or (
        not _flag_is_true(row.get("texnet_caution"))
        and (row.get("texnet_caution") is None or pd.isna(row.get("texnet_caution")))
    ):
        out.append("TexNet risk layer unknown / not loaded — do not treat as clear")

    if _flag_is_true(row.get("padus_friction")):
        out.append("PAD-US protected-area friction — treat shortlist with care")
    elif str(row.get("padus_status_resolved") or "").lower() == "unknown" or (
        not _flag_is_true(row.get("padus_friction"))
        and (row.get("padus_friction") is None or pd.isna(row.get("padus_friction")))
    ):
        out.append("PAD-US friction unknown / not loaded — do not treat as clear")

    if row["confidence"] == "Low":
        out.append("Sparse measured thermal control — treat screening score as indicative only")
    elif row["confidence"] == "Unknown":
        out.append("Thermal evidence unavailable — confidence unknown")

    return out[:5]


def limitations_for(row: pd.Series, mode: str) -> list[str]:
    lim = [
        "Screening index only — not a resource assessment or drill recommendation.",
        "Transmission/substation distance is a proximity proxy — not interconnection feasibility.",
    ]
    if mode == "stanford_tdepth":
        lim.append(
            "Thermal opportunity uses model T@depth (Stanford / GDR 1592) — not measured BHT or well temperature."
        )
        lim.append(
            "Measured control (SMU/BHT/IHFC) informs confidence only; it does not replace the model prior in v0.4."
        )
        if int(row.get("measured_control_count", 0) or 0) < 3:
            lim.append("Thin measured control under the model prior — ranks are more uncertain here.")
    else:
        lim.append(
            "Legacy IHFC thermal mode (thermal_mode=legacy_ihfc) — Data Depth T@depth features not available for this run."
        )
        metric = str(row.get("thermal_metric", ""))
        if pd.isna(row.get("thermal_mean")):
            lim.append("No IHFC thermal observations joined to this county; thermal factor set to 0.")
        elif metric == "heat_flow_mWm2":
            lim.append(
                "Geothermal gradient unavailable for this county; thermal factor uses heat-flow fallback."
            )
    if row["confidence"] in ("Low", "Unknown"):
        lim.append("Limited thermal control density in this county.")
    if _flag_is_true(row.get("texnet_caution")):
        lim.append("TexNet caution flag set — seismicity risk context, not opportunity juice.")
    elif row.get("texnet_caution") is None or pd.isna(row.get("texnet_caution")):
        lim.append("TexNet status unknown — missing catalog is not a clean bill of health.")
    if _flag_is_true(row.get("padus_friction")):
        lim.append("PAD-US friction flag set — protected-area gate, not opportunity.")
    elif row.get("padus_friction") is None or pd.isna(row.get("padus_friction")):
        lim.append("PAD-US status unknown — not loaded; do not assume no protected-area friction.")
    note = str(row.get("well_density_note") or "")
    if "smu_control_density_proxy" in note:
        lim.append(
            "Well-density band is an SMU control-point density proxy — NOT RRC Digital Map."
        )
    if row.get("area_km2", 0) and row["area_km2"] > 8000:
        lim.append("Large county — intra-county variation is not resolved at this grain.")
    return lim


def build() -> None:
    features = pd.read_csv(PROCESSED / "county_features.csv")
    features["county_fips"] = features["county_fips"].astype(str)
    counties = gpd.read_file(PROCESSED / "tx_counties.geojson")

    depth, depth_file_present = load_data_depth(features["county_fips"])
    df = features.merge(depth, on="county_fips", how="left")

    use_tdepth = df["tdepth_mean"].notna().any()
    mode = "stanford_tdepth" if use_tdepth else "legacy_ihfc"
    if depth_file_present and not use_tdepth:
        print("data_depth_features present but no tdepth_mean — legacy IHFC thermal fallback.")

    # --- Infra: min(line, substation) when both exist ---
    line_dist = df["infra_dist_km"].astype(float)
    sub_dist = df["dist_substation_km"].astype(float) if "dist_substation_km" in df.columns else pd.Series(np.nan, index=df.index)
    both = line_dist.notna() & sub_dist.notna()
    infra_used = line_dist.copy()
    infra_used.loc[both] = np.minimum(line_dist.loc[both], sub_dist.loc[both])
    # Prefer substation alone only when line missing (rare)
    only_sub = line_dist.isna() & sub_dist.notna()
    infra_used.loc[only_sub] = sub_dist.loc[only_sub]
    df["infra_dist_used_km"] = infra_used
    df["infra_uses_substation"] = both | only_sub

    w_thermal = W_TDEPTH if mode == "stanford_tdepth" else W_THERMAL_LEGACY
    w_infra = W_INFRA_DD if mode == "stanford_tdepth" else W_INFRA_LEGACY

    # --- Opportunity thermal ---
    if mode == "stanford_tdepth":
        s_thermal = scale_0_100(winsorize(df["tdepth_mean"]), higher_is_better=True)
        df["s_thermal"] = s_thermal
        df["model_thermal"] = True
        df["active_thermal_raw"] = df["tdepth_mean"]
        # Keep IHFC columns for confidence / dual-panel context
    else:
        s_thermal = pd.Series(np.nan, index=df.index, dtype=float)
        is_grad = df["thermal_metric"] == "gradient_C_per_km"
        is_hf = df["thermal_metric"] == "heat_flow_mWm2"
        if is_grad.any():
            s_thermal.loc[is_grad] = scale_0_100(winsorize(df.loc[is_grad, "thermal_mean"]))
        if is_hf.any():
            s_thermal.loc[is_hf] = scale_0_100(winsorize(df.loc[is_hf, "thermal_mean"]))
        df["s_thermal"] = s_thermal
        df["model_thermal"] = False
        df["active_thermal_raw"] = df["thermal_mean"]

    s_infra = scale_0_100(winsorize(df["infra_dist_used_km"]), higher_is_better=False)
    df["s_infra"] = s_infra.fillna(0.0)
    thermal_for_score = df["s_thermal"].fillna(0.0)
    df["screening_score"] = w_thermal * thermal_for_score + w_infra * df["s_infra"]

    # --- Confidence ---
    ihfc_n = df["well_count"].fillna(0).astype(int)
    if "thermal_n" in df.columns:
        ihfc_n = df["thermal_n"].fillna(df["well_count"]).fillna(0).astype(int)
    smu_n = df["smu_n"].fillna(0).astype(int) if "smu_n" in df.columns else pd.Series(0, index=df.index)
    bht_n = df["bht_n"].fillna(0).astype(int) if "bht_n" in df.columns else pd.Series(0, index=df.index)
    # Prefer max of smu/bht when both present (may be aliases of same control); else sum distinct
    measured = np.maximum(smu_n.to_numpy(), bht_n.to_numpy())
    # If both columns populated and look independent (both > 0 and unequal often), sum — else max
    both_pos = (smu_n > 0) & (bht_n > 0)
    if both_pos.any() and (smu_n[both_pos] != bht_n[both_pos]).mean() > 0.5:
        measured = (smu_n + bht_n).to_numpy()
    df["measured_control_count"] = measured.astype(int)
    df["ihfc_n"] = ihfc_n

    dens_band = density_band(
        df["rrc_well_density"] if "rrc_well_density" in df.columns else pd.Series(np.nan, index=df.index),
        df["well_density_band"] if "well_density_band" in df.columns else pd.Series(pd.NA, index=df.index),
    )
    df["well_density_band_resolved"] = dens_band

    # Thresholds from positive combined measured+IHFC distribution (or well_count legacy)
    combined_for_thresh = ihfc_n + df["measured_control_count"]
    positive = combined_for_thresh[combined_for_thresh > 0]
    t_low = float(positive.quantile(0.25)) if len(positive) else 5.0
    t_high = float(positive.quantile(0.75)) if len(positive) else 20.0

    # Resolve nullable risk statuses before confidence / record export
    def _resolve_status_col(flag_col: str, status_col: str, true_label: str) -> pd.Series:
        statuses = []
        for i in range(len(df)):
            flag = df[flag_col].iloc[i] if flag_col in df.columns else pd.NA
            layer = df[status_col].iloc[i] if status_col in df.columns else pd.NA
            statuses.append(_tri_state_status(flag, layer, true_label=true_label))
        return pd.Series(statuses, index=df.index)

    df["texnet_status_resolved"] = _resolve_status_col(
        "texnet_caution", "texnet_status", "caution"
    )
    df["padus_status_resolved"] = _resolve_status_col(
        "padus_friction", "padus_status", "friction"
    )

    df["confidence"] = [
        confidence_v04(
            ihfc_n=int(ihfc_n.iloc[i]),
            measured_n=int(df["measured_control_count"].iloc[i]),
            density_band_name=str(dens_band.iloc[i]),
            model_thermal=bool(df["model_thermal"].iloc[i]) and mode == "stanford_tdepth",
            texnet_caution=(
                None
                if "texnet_caution" not in df.columns or pd.isna(df["texnet_caution"].iloc[i])
                else bool(df["texnet_caution"].iloc[i])
            ),
            padus_friction=(
                None
                if "padus_friction" not in df.columns or pd.isna(df["padus_friction"].iloc[i])
                else bool(df["padus_friction"].iloc[i])
            ),
            t_low=t_low,
            t_high=t_high,
        )
        for i in range(len(df))
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

    # Resolve default depth km for metric labeling
    default_km = None
    if mode == "stanford_tdepth":
        kms = df["tdepth_km"].dropna()
        if len(kms):
            default_km = float(kms.mode().iloc[0]) if len(kms.mode()) else float(kms.median())

    tdepth_vintage_global = TDEPTH_VINTAGE_DEFAULT
    if "tdepth_vintage" in df.columns and df["tdepth_vintage"].notna().any():
        tdepth_vintage_global = str(df["tdepth_vintage"].dropna().iloc[0])

    records = []
    for _, row in df.iterrows():
        st = None if pd.isna(row["s_thermal"]) else round(float(row["s_thermal"]), 2)
        raw_present = pd.notna(row["active_thermal_raw"])
        st_score = 0.0 if not raw_present else float(row["s_thermal"])
        si = round(float(row["s_infra"]), 2)
        km_val = None if pd.isna(row.get("tdepth_km")) else float(row["tdepth_km"])
        if km_val is None and default_km is not None:
            km_val = default_km

        if mode == "stanford_tdepth":
            thermal_raw = None if pd.isna(row["tdepth_mean"]) else round(float(row["tdepth_mean"]), 2)
            metric = tdepth_metric_id(km_val)
            thermal_label = "Model T@depth (Stanford)"
            thermal_unit = "°C" + (f" @{km_val:g} km" if km_val is not None else "")
            thermal_source = TDEPTH_SOURCE
            thermal_vintage = (
                str(row["tdepth_vintage"])
                if pd.notna(row.get("tdepth_vintage"))
                else tdepth_vintage_global
            )
        else:
            thermal_raw = None if pd.isna(row["thermal_mean"]) else round(float(row["thermal_mean"]), 2)
            metric = str(row.get("thermal_metric", "heat_flow_mWm2"))
            if metric == "gradient_C_per_km":
                thermal_label = "Geothermal gradient (legacy IHFC)"
                thermal_unit = "°C/km"
            else:
                thermal_label = "Heat-flow fallback (legacy IHFC)"
                thermal_unit = "mW/m²"
            thermal_source = THERMAL_SOURCE_LEGACY
            thermal_vintage = THERMAL_VINTAGE_LEGACY

        infra_raw = (
            None
            if pd.isna(row["infra_dist_used_km"])
            else round(float(row["infra_dist_used_km"]), 2)
        )
        uses_sub = bool(row.get("infra_uses_substation"))
        if uses_sub and pd.notna(row.get("dist_substation_km")) and pd.notna(row.get("infra_dist_km")):
            infra_unit = "km to nearest line or substation (min)"
            infra_source = f"{INFRA_SOURCE_LINES}; {INFRA_SOURCE_SUBSTATIONS}"
        elif uses_sub:
            infra_unit = "km to nearest substation"
            infra_source = INFRA_SOURCE_SUBSTATIONS
        else:
            infra_unit = "km to nearest line"
            infra_source = INFRA_SOURCE_LINES
        infra_vintage = INFRA_VINTAGE_DEFAULT
        if pd.notna(row.get("substation_vintage")) and uses_sub:
            infra_vintage = str(row["substation_vintage"])
        elif pd.notna(row.get("infra_line_vintage")):
            infra_vintage = str(row["infra_line_vintage"])

        factors = [
            {
                "id": "thermal",
                "label": thermal_label,
                "rawValue": thermal_raw,
                "rawUnit": thermal_unit,
                "score0to100": round(st_score, 2),
                "weight": w_thermal,
                "weightedContribution": round(w_thermal * st_score, 2),
                "source": thermal_source,
                "vintage": thermal_vintage,
                "metric": metric,
            },
            {
                "id": "infra",
                "label": "Grid proximity (line/substation)" if uses_sub else "Transmission proximity",
                "rawValue": infra_raw,
                "rawUnit": infra_unit,
                "score0to100": si,
                "weight": w_infra,
                "weightedContribution": round(w_infra * si, 2),
                "source": infra_source,
                "vintage": infra_vintage,
            },
        ]

        # Nullable export: true | false | null (Unknown never coerced to false)
        if "padus_friction" in df.columns and pd.notna(row.get("padus_friction")):
            padus_export: bool | None = bool(row["padus_friction"])
        else:
            padus_export = None
        if "texnet_caution" in df.columns and pd.notna(row.get("texnet_caution")):
            texnet_export: bool | None = bool(row["texnet_caution"])
        else:
            texnet_export = None
        texnet_status = str(row.get("texnet_status_resolved") or "unknown")
        padus_status = str(row.get("padus_status_resolved") or "unknown")
        tdepth_mean = None if pd.isna(row.get("tdepth_mean")) else round(float(row["tdepth_mean"]), 2)

        rec = {
            "countyFips": str(row["county_fips"]),
            "name": str(row["name"]),
            "rank": int(row["rank"]),
            "screeningScore": round(float(row["screening_score"]), 2),
            "confidence": row["confidence"],
            "factors": factors,
            "drivers": drivers_for(row, mode),
            "limitations": limitations_for(row, mode),
            "areaKm2": round(float(row["area_km2"]), 1) if pd.notna(row["area_km2"]) else None,
            "thermalControlCount": int(row["ihfc_n"]) if pd.notna(row["ihfc_n"]) else 0,
            "measuredControlCount": int(row["measured_control_count"]),
            "modelThermal": bool(row["model_thermal"]) and mode == "stanford_tdepth",
            "padusFriction": padus_export,
            "texnetCaution": texnet_export,
            "padusStatus": padus_status,
            "texnetStatus": texnet_status,
            "thermalMode": mode,
        }
        if tdepth_mean is not None:
            rec["tdepthMean"] = tdepth_mean
        if km_val is not None and mode == "stanford_tdepth":
            rec["tdepthKm"] = round(km_val, 2)

        # Dual panel IHFC context (always useful; not in opportunity when model mode)
        if "gradient_mean" in df.columns:
            gm = row.get("gradient_mean")
            gn = row.get("gradient_n")
            rec["gradientMean"] = None if pd.isna(gm) else round(float(gm), 2)
            rec["gradientN"] = 0 if pd.isna(gn) else int(gn)
        if "heatflow_mean" in df.columns:
            hm = row.get("heatflow_mean")
            hn = row.get("heatflow_n")
            rec["heatflowMean"] = None if pd.isna(hm) else round(float(hm), 2)
            rec["heatflowN"] = 0 if pd.isna(hn) else int(hn)

        records.append(rec)

    # Layer vintages for meta
    def _layer_vintage(col: str, default: str | None = None) -> str | None:
        if col in df.columns and df[col].notna().any():
            val = str(df[col].dropna().iloc[0])
            if val.lower() in ("nan", "none", "<na>", ""):
                return default
            return val
        return default

    # Global risk layer posture
    texnet_global = "unknown"
    if "texnet_status_resolved" in df.columns:
        resolved = df["texnet_status_resolved"].astype(str)
        if (resolved == "caution").any() or (resolved == "clear").any():
            texnet_global = "loaded"
        elif (resolved == "unknown").all():
            texnet_global = "unknown"
    padus_global = "unknown"
    if "padus_status_resolved" in df.columns:
        resolved = df["padus_status_resolved"].astype(str)
        if (resolved == "friction").any() or (resolved == "clear").any():
            padus_global = "loaded"
        elif (resolved == "unknown").all():
            padus_global = "unknown"

    well_note = ""
    if "well_density_note" in df.columns and df["well_density_note"].notna().any():
        well_note = str(df["well_density_note"].dropna().iloc[0])
    rrc_is_proxy = "smu_control_density_proxy" in well_note
    rrc_vintage_meta = (
        "proxy_smu_control_not_rrc_digital_map"
        if rrc_is_proxy
        else _layer_vintage("rrc_vintage")
    )
    texnet_vintage_meta = _layer_vintage("texnet_vintage")
    if texnet_global == "unknown":
        texnet_vintage_meta = texnet_vintage_meta or "not_loaded"
    padus_vintage_meta = "not_loaded" if padus_global == "unknown" else _layer_vintage(
        "padus_vintage", "not_loaded"
    )

    # Risk-layer unknown still pending; SMU well-density proxy is buyer-accepted residual (not silent).
    risk_unknown = padus_global == "unknown" or texnet_global == "unknown"
    data_depth_status = (
        "thermal_spine_live_risk_pending"
        if mode == "stanford_tdepth" and risk_unknown
        else (
            "thermal_spine_live_rrc_proxy_accepted"
            if mode == "stanford_tdepth" and rrc_is_proxy
            else ("thermal_spine_live" if mode == "stanford_tdepth" else "legacy_ihfc")
        )
    )
    residual_risk = (
        "Thermal spine live (Stanford T@depth + SMU confidence + substations). "
        "Risk layers: TexNet="
        + texnet_global
        + ", PAD-US="
        + padus_global
        + (
            " (Fee GAP_Sts 1–2; friction if intersect area/county > 1%)"
            if padus_global == "loaded"
            else ""
        )
        + (
            ". Well density = SMU control proxy (NOT RRC Digital Map) — "
            "buyer-accepted residual for Data Depth STOP; replace with RRC Digital Map when MFT access allows."
            if rrc_is_proxy
            else "."
        )
        + (
            " Phase 3 slice 1 shipping (watchlist/digest/rules) — not accounts/email."
            if mode == "stanford_tdepth"
            else ""
        )
    )

    meta = {
        "methodologyVersion": METHODOLOGY_VERSION,
        "dataDepth": mode == "stanford_tdepth",
        "dataDepthStatus": data_depth_status,
        "residualRisk": residual_risk,
        "thermalMode": mode,
        "weights": {"thermal": w_thermal, "infra": w_infra},
        "confidenceThresholds": {"tLow": t_low, "tHigh": t_high},
        "nCounties": len(records),
        "tdepthKm": default_km,
        "phase3": {"slice": 1, "rulesVersion": "v0", "watchlistLocal": True},
        "riskLayerStatus": {
            "texnet": texnet_global,
            "padus": padus_global,
            "rrcWellDensity": "proxy_smu_control" if rrc_is_proxy else "rrc_or_unknown",
        },
        "sources": {
            "thermal": {
                "name": TDEPTH_SOURCE if mode == "stanford_tdepth" else THERMAL_SOURCE_LEGACY,
                "vintage": tdepth_vintage_global if mode == "stanford_tdepth" else THERMAL_VINTAGE_LEGACY,
                "model": mode == "stanford_tdepth",
            },
            "infra": {
                "name": f"{INFRA_SOURCE_LINES}; {INFRA_SOURCE_SUBSTATIONS}",
                "vintage": _layer_vintage("infra_line_vintage", INFRA_VINTAGE_DEFAULT),
            },
            "substations": {
                "name": INFRA_SOURCE_SUBSTATIONS,
                "vintage": _layer_vintage("substation_vintage"),
            },
            "smu_bht": {
                "name": "SMU / GDR 1704 TX BHT-HF (confidence)",
                "vintage": _layer_vintage("smu_vintage"),
            },
            "rrc_wells": {
                "name": (
                    "SMU control-point density PROXY — NOT RRC Digital Map"
                    if rrc_is_proxy
                    else "RRC Digital Map well density (confidence/context)"
                ),
                "vintage": rrc_vintage_meta,
                "proxy": rrc_is_proxy,
                "note": well_note or None,
            },
            "texnet": {
                "name": "TexNet earthquake catalog (caution flag)",
                "vintage": texnet_vintage_meta,
                "status": texnet_global,
            },
            "padus": {
                "name": "PAD-US protected areas (friction gate)",
                "vintage": padus_vintage_meta,
                "status": padus_global,
            },
            "ihfc_qc": {
                "name": THERMAL_SOURCE_LEGACY,
                "vintage": THERMAL_VINTAGE_LEGACY,
                "role": "QC / citation / legacy fallback — not primary opportunity when Data Depth active",
            },
            "counties": {"name": "Census cb_2023_us_county_500k", "vintage": "2023"},
        },
        "layerVintages": {
            "tdepth": tdepth_vintage_global if mode == "stanford_tdepth" else None,
            "ihfc": THERMAL_VINTAGE_LEGACY,
            "transmission": _layer_vintage("infra_line_vintage", INFRA_VINTAGE_DEFAULT),
            "substations": _layer_vintage("substation_vintage"),
            "smu_bht": _layer_vintage("smu_vintage"),
            "rrc": rrc_vintage_meta,
            "texnet": texnet_vintage_meta,
            "padus": padus_vintage_meta,
        },
        "disclaimer": (
            "Thermal spine live (Stanford T@depth + SMU confidence + substations). "
            "TexNet/PAD-US risk layers: see status. "
            "Phase 3 slice 1 shipping (local watchlist, in-app digest, rule candidates) "
            "— not accounts/email. "
            "Regional screening index for next-gen geothermal focus in Texas (methodology 0.4.0). "
            + (
                "Thermal opportunity is labeled model T@depth (Stanford) — not measured temperature. "
                "Measured SMU/BHT/IHFC and well-density band inform confidence only"
                + (
                    " (well density currently SMU control proxy — NOT RRC Digital Map). "
                    if rrc_is_proxy
                    else ". "
                )
                if mode == "stanford_tdepth"
                else "RUNNING IN LEGACY IHFC THERMAL MODE (thermal_mode=legacy_ihfc) — "
                "data_depth_features T@depth not available; replace when Data Depth ETL ships. "
            )
            + "Grid proximity is not interconnection feasibility. Not a resource map or drill recommendation."
        ),
        "honesty": {
            "modelVsMeasured": True,
            "ihfcRole": "qc_citation_or_legacy_fallback",
            "noDiyBhtOpportunity": True,
            "nullableRiskFlags": True,
            "rrcDigitalMap": not rrc_is_proxy,
        },
    }
    # Stable publish id: methodologyVersion + sorted layerVintages (same as web getPublishId).
    _lv = meta.get("layerVintages") or {}
    _parts = [
        f"{k}={'' if _lv[k] is None else _lv[k]}" for k in sorted(_lv.keys())
    ]
    meta["publishId"] = (
        f"{meta['methodologyVersion']}|{'|'.join(_parts)}"
        if _parts
        else str(meta["methodologyVersion"])
    )
    if mode != "stanford_tdepth":
        meta["thermalCohorts"] = {
            "note": "Legacy mode: S_thermal scaled within metric cohorts; do not treat one statewide ladder as cross-metric.",
            "minGradientN": 3,
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
        prop = {
            "countyFips": r["countyFips"],
            "name": r["name"],
            "rank": r["rank"],
            "screeningScore": r["screeningScore"],
            "confidence": r["confidence"],
            "thermalMetric": metric,
            "thermalControlCount": r.get("thermalControlCount", 0),
            "measuredControlCount": r.get("measuredControlCount", 0),
            "modelThermal": bool(r.get("modelThermal")),
            "padusFriction": r.get("padusFriction"),
            "texnetCaution": r.get("texnetCaution"),
            "padusStatus": r.get("padusStatus"),
            "texnetStatus": r.get("texnetStatus"),
        }
        if "tdepthKm" in r:
            prop["tdepthKm"] = r["tdepthKm"]
        if "tdepthMean" in r:
            prop["tdepthMean"] = r["tdepthMean"]
        props.append(prop)
    geo_out = gpd.GeoDataFrame(props, geometry=geo.geometry.values, crs="EPSG:4326")

    PROCESSED.mkdir(parents=True, exist_ok=True)
    WEB_DATA.mkdir(parents=True, exist_ok=True)

    prospects_json = {"meta": meta, "counties": records}
    (PROCESSED / "prospects.json").write_text(json.dumps(prospects_json), encoding="utf-8")
    (PROCESSED / "meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    geo_out.to_file(PROCESSED / "prospects.geojson", driver="GeoJSON")

    shutil.copyfile(PROCESSED / "prospects.json", WEB_DATA / "prospects.json")
    shutil.copyfile(PROCESSED / "prospects.geojson", WEB_DATA / "prospects.geojson")
    shutil.copyfile(PROCESSED / "meta.json", WEB_DATA / "meta.json")

    top = records[:5]
    print(f"Scored {len(records)} counties. methodology={METHODOLOGY_VERSION} mode={mode}")
    print(f"dataDepth={meta['dataDepth']} weights thermal={w_thermal} infra={w_infra}")
    print(f"Confidence thresholds: T_low={t_low:.1f} T_high={t_high:.1f}")
    print("Top 5:")
    for r in top:
        print(f"  #{r['rank']} {r['name']}: {r['screeningScore']} ({r['confidence']})")
    print(f"Wrote {WEB_DATA / 'prospects.json'}")
    print(f"Wrote {WEB_DATA / 'prospects.geojson'}")


if __name__ == "__main__":
    build()
