"""
Build county-level Data Depth feature table (D1–D6).

Outputs:
  data/processed/data_depth_features.csv

Joins to TX counties in EPSG:3083 (same pattern as build_county_features.py).
Does NOT rewrite score_counties.py.
"""

from __future__ import annotations

import json
import zipfile
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
PROCESSED = ROOT / "data" / "processed"

CRS_ANALYSIS = "EPSG:3083"
CRS_WEB = "EPSG:4326"
TX_STATEFP = "48"

# Primary depth band for D1 opportunity prior (documented).
PRIMARY_T_COL_PREFERENCE = ["T_4000m", "T_5000m", "T_3000m"]
PRIMARY_DEPTH_KM = {"T_3000m": 3.0, "T_4000m": 4.0, "T_5000m": 5.0}


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
    for c in columns:
        cl = c.lower().replace(" ", "").replace("_", "")
        for cand in candidates:
            if cand.lower().replace(" ", "").replace("_", "") in cl:
                return c
    return None


def aggregate_stanford(counties: gpd.GeoDataFrame) -> pd.DataFrame:
    """D1: county mean of Stanford cells whose centroids fall in county."""
    path = RAW / "stanford_thermal" / "tx_t_at_depth.csv"
    empty = pd.DataFrame(
        columns=[
            "county_fips",
            "tdepth_C",
            "tdepth_km",
            "tdepth_n",
            "tdepth_std_mean",
            "T_3000m_mean",
            "T_4000m_mean",
            "T_5000m_mean",
            "measured_vs_model",
        ]
    )
    if not path.exists():
        print("Stanford TX extract missing — tdepth columns null")
        return empty

    df = pd.read_csv(path)
    print(f"Stanford TX cells: {len(df)} cols={list(df.columns)}")
    lat_col = _pick_column(list(df.columns), ["Lat", "latitude", "lat"])
    lon_col = _pick_column(list(df.columns), ["Long", "Longitude", "lon", "lng"])
    if not lat_col or not lon_col:
        print("Stanford: no lat/lon — skip")
        return empty

    primary = None
    for cand in PRIMARY_T_COL_PREFERENCE:
        if cand in df.columns:
            primary = cand
            break
    if primary is None:
        # fuzzy: any T_*000m
        for c in df.columns:
            if c.upper().startswith("T_") and c.upper().endswith("M") and "STD" not in c.upper():
                primary = c
                break
    if primary is None:
        print("Stanford: no T@depth columns — skip")
        return empty

    depth_km = PRIMARY_DEPTH_KM.get(primary, 4.0)
    work = df.copy()
    work["_lat"] = pd.to_numeric(work[lat_col], errors="coerce")
    work["_lon"] = pd.to_numeric(work[lon_col], errors="coerce")
    work["_t"] = pd.to_numeric(work[primary], errors="coerce")
    for col in ("T_3000m", "T_4000m", "T_5000m"):
        if col in work.columns:
            work[col] = pd.to_numeric(work[col], errors="coerce")
    std_col = f"T_std_{primary.split('_', 1)[-1]}" if "_" in primary else None
    # e.g. T_4000m -> T_std_4000m
    std_guess = primary.replace("T_", "T_std_") if primary.startswith("T_") else None
    if std_guess and std_guess in work.columns:
        work["_t_std"] = pd.to_numeric(work[std_guess], errors="coerce")
    else:
        work["_t_std"] = np.nan

    work = work.dropna(subset=["_lat", "_lon", "_t"])
    gdf = gpd.GeoDataFrame(
        work,
        geometry=gpd.points_from_xy(work["_lon"], work["_lat"]),
        crs=CRS_WEB,
    ).to_crs(CRS_ANALYSIS)

    joined = gpd.sjoin(
        gdf, counties[["county_fips", "geometry"]], how="inner", predicate="within"
    )
    agg = joined.groupby("county_fips", as_index=False).agg(
        tdepth_C=("_t", "mean"),
        tdepth_n=("_t", "count"),
        tdepth_std_mean=("_t_std", "mean"),
    )
    for col, outname in (
        ("T_3000m", "T_3000m_mean"),
        ("T_4000m", "T_4000m_mean"),
        ("T_5000m", "T_5000m_mean"),
    ):
        if col in joined.columns:
            extra = (
                joined.dropna(subset=[col])
                .groupby("county_fips", as_index=False)
                .agg(**{outname: (col, "mean")})
            )
            agg = agg.merge(extra, on="county_fips", how="left")
        else:
            agg[outname] = np.nan

    agg["tdepth_km"] = depth_km
    agg["measured_vs_model"] = "model_stanford"
    agg["tdepth_source_col"] = primary
    print(
        f"Stanford county means: n={len(agg)} primary={primary} "
        f"tdepth_C median={agg['tdepth_C'].median():.1f}"
    )
    return agg


def load_ihfc_tx_points() -> gpd.GeoDataFrame:
    """Reuse IHFC as SMU fallback / additional measured control."""
    xlsx = RAW / "thermal" / "IHFC_2024_GHFDB.xlsx"
    if not xlsx.exists():
        return gpd.GeoDataFrame(columns=["geometry"], geometry="geometry", crs=CRS_ANALYSIS)

    xl = pd.ExcelFile(xlsx)
    sheet = xl.sheet_names[0]
    for name in xl.sheet_names:
        if any(k in name.lower() for k in ["data", "ghfdb", "heat", "unique"]):
            sheet = name
            break
    df = pd.read_excel(xlsx, sheet_name=sheet, header=5)
    work = df.copy()
    work["_lat"] = pd.to_numeric(work["lat_NS"], errors="coerce")
    work["_lon"] = pd.to_numeric(work["long_EW"], errors="coerce")
    work = work.dropna(subset=["_lat", "_lon"])
    work = work[
        (work["_lon"] >= -106.7)
        & (work["_lon"] <= -93.5)
        & (work["_lat"] >= 25.8)
        & (work["_lat"] <= 36.6)
    ]
    gdf = gpd.GeoDataFrame(
        work,
        geometry=gpd.points_from_xy(work["_lon"], work["_lat"]),
        crs=CRS_WEB,
    ).to_crs(CRS_ANALYSIS)
    gdf["control_source"] = "ihfc"
    return gdf[["control_source", "geometry"]]


def load_smu_tx_points() -> gpd.GeoDataFrame | None:
    """Parse SMU TX control points from GDR 1704 resource index (preferred).

    Per-well Temperature-Depth CSVs lack lat/lon; the resource index carries
    LatDegree/LongDegree + state for Well Temperature-Depth / Well Data Notes.
    """
    idx = RAW / "smu_gdr_1704" / "resource_index_file_7-1-2026.xlsx"
    if idx.exists():
        try:
            xl = pd.ExcelFile(idx)
            frames = []
            for sheet in xl.sheet_names:
                df = pd.read_excel(idx, sheet_name=sheet)
                lat_col = _pick_column(
                    list(df.columns), ["LatDegree", "lat", "latitude", "Lat"]
                )
                lon_col = _pick_column(
                    list(df.columns), ["LongDegree", "lon", "longitude", "Long"]
                )
                state_col = _pick_column(list(df.columns), ["state", "STATE", "State"])
                if not lat_col or not lon_col:
                    continue
                work = df.copy()
                work["_lat"] = pd.to_numeric(work[lat_col], errors="coerce")
                work["_lon"] = pd.to_numeric(work[lon_col], errors="coerce")
                work = work.dropna(subset=["_lat", "_lon"])
                if state_col:
                    st = work[state_col].astype(str).str.upper().str.strip()
                    work = work[st.isin(["TX", "TEXAS", "48"])]
                else:
                    work = work[
                        (work["_lon"] >= -106.7)
                        & (work["_lon"] <= -93.5)
                        & (work["_lat"] >= 25.8)
                        & (work["_lat"] <= 36.6)
                    ]
                if len(work):
                    work["_sheet"] = sheet
                    frames.append(work)
                    print(f"  SMU index sheet {sheet!r}: TX rows={len(work)}")
            if frames:
                all_pts = pd.concat(frames, ignore_index=True)
                # Deduplicate near-identical coordinates
                all_pts["_rk"] = all_pts["_lat"].round(5).astype(str) + "," + all_pts[
                    "_lon"
                ].round(5).astype(str)
                all_pts = all_pts.drop_duplicates("_rk")
                gdf = gpd.GeoDataFrame(
                    all_pts,
                    geometry=gpd.points_from_xy(all_pts["_lon"], all_pts["_lat"]),
                    crs=CRS_WEB,
                ).to_crs(CRS_ANALYSIS)
                gdf["control_source"] = "smu_gdr_1704"
                print(f"SMU points from resource index (deduped): {len(gdf)}")
                return gdf[["control_source", "geometry"]]
        except Exception as exc:  # noqa: BLE001
            print(f"  SMU index parse failed: {exc}")

    # Fallback: data_index.xlsx if present
    data_idx = RAW / "smu_gdr_1704" / "data_index.xlsx"
    if data_idx.exists():
        try:
            df = pd.read_excel(data_idx)
            lat_col = _pick_column(list(df.columns), ["LatDegree", "lat", "latitude"])
            lon_col = _pick_column(list(df.columns), ["LongDegree", "lon", "longitude"])
            if lat_col and lon_col:
                work = df.copy()
                work["_lat"] = pd.to_numeric(work[lat_col], errors="coerce")
                work["_lon"] = pd.to_numeric(work[lon_col], errors="coerce")
                work = work.dropna(subset=["_lat", "_lon"])
                work = work[
                    (work["_lon"] >= -106.7)
                    & (work["_lon"] <= -93.5)
                    & (work["_lat"] >= 25.8)
                    & (work["_lat"] <= 36.6)
                ]
                if len(work) >= 5:
                    gdf = gpd.GeoDataFrame(
                        work,
                        geometry=gpd.points_from_xy(work["_lon"], work["_lat"]),
                        crs=CRS_WEB,
                    ).to_crs(CRS_ANALYSIS)
                    gdf["control_source"] = "smu_gdr_1704"
                    print(f"SMU points from data_index: {len(gdf)}")
                    return gdf[["control_source", "geometry"]]
        except Exception as exc:  # noqa: BLE001
            print(f"  SMU data_index parse failed: {exc}")

    print("SMU lat/lon index unavailable")
    return None


def aggregate_thermal_control(counties: gpd.GeoDataFrame) -> pd.DataFrame:
    """D2: count measured thermal control points in county (SMU, else IHFC)."""
    smu = load_smu_tx_points()
    ihfc = load_ihfc_tx_points()
    notes = []
    if smu is not None and len(smu) > 0:
        pts = smu
        source = "smu_gdr_1704"
        notes.append(f"using SMU n={len(smu)}")
        if len(ihfc) > 0:
            notes.append(f"IHFC available n={len(ihfc)} (not dual-counted)")
    else:
        pts = ihfc
        source = "ihfc_fallback"
        notes.append("SMU parse failed/missing — IHFC fallback for control counts")
        print(notes[-1])

    if pts is None or len(pts) == 0:
        print("No thermal control points")
        return pd.DataFrame(
            columns=["county_fips", "thermal_control_n", "thermal_control_source"]
        )

    joined = gpd.sjoin(
        pts, counties[["county_fips", "geometry"]], how="inner", predicate="within"
    )
    agg = (
        joined.groupby("county_fips", as_index=False)
        .size()
        .rename(columns={"size": "thermal_control_n"})
    )
    agg["thermal_control_source"] = source
    print(
        f"Thermal control counties={len(agg)} source={source} "
        f"median_n={agg['thermal_control_n'].median():.0f}"
    )
    return agg


def substation_distance_km(counties: gpd.GeoDataFrame) -> pd.DataFrame:
    """D6: distance from county rep point to nearest substation (km)."""
    path = RAW / "substations" / "hifld_tx_substations.geojson"
    if not path.exists():
        print("Substations missing — substation_dist_km null")
        return pd.DataFrame(columns=["county_fips", "substation_dist_km", "substation_n_tx"])

    gdf = gpd.read_file(path)
    if gdf.crs is None:
        gdf = gdf.set_crs(CRS_WEB)
    gdf = gdf.to_crs(CRS_ANALYSIS)
    print(f"Substations: {len(gdf)}")

    centroids = counties.copy()
    centroids["geometry"] = centroids.representative_point()
    pts_union = gdf.union_all() if hasattr(gdf, "union_all") else gdf.unary_union
    dist_m = centroids.geometry.distance(pts_union)
    out = pd.DataFrame(
        {
            "county_fips": counties["county_fips"].values,
            "substation_dist_km": (dist_m / 1000.0).values,
            "substation_n_tx": len(gdf),
        }
    )
    print(
        f"Substation dist km: min={out['substation_dist_km'].min():.2f} "
        f"median={out['substation_dist_km'].median():.2f} "
        f"max={out['substation_dist_km'].max():.2f}"
    )
    return out


def eia_plant_distance_km(counties: gpd.GeoDataFrame) -> pd.DataFrame:
    """Optional light offtake: distance to nearest EIA 860 plant in TX."""
    eia_dir = RAW / "eia860"
    plant_files: list[Path] = []
    if eia_dir.exists():
        plant_files.extend(eia_dir.rglob("*Plant*.xlsx"))
        plant_files.extend(eia_dir.rglob("*plant*.xlsx"))
        plant_files.extend(eia_dir.rglob("*2___Plant*.xlsx"))
    if not plant_files:
        print("EIA plant workbook not found — eia_plant_dist_km null")
        return pd.DataFrame(columns=["county_fips", "eia_plant_dist_km", "eia_plant_n_tx"])

    path = sorted(plant_files, key=lambda p: p.stat().st_mtime, reverse=True)[0]
    print(f"EIA plants from {path}")
    # EIA plant sheets often have header rows; try a few.
    df = None
    for header in (0, 1, 2):
        try:
            tmp = pd.read_excel(path, header=header)
            lat_col = _pick_column(list(tmp.columns), ["Latitude", "lat"])
            lon_col = _pick_column(list(tmp.columns), ["Longitude", "lon"])
            if lat_col and lon_col:
                df = tmp
                break
        except Exception:
            continue
    if df is None:
        print("EIA: could not find lat/lon columns")
        return pd.DataFrame(columns=["county_fips", "eia_plant_dist_km", "eia_plant_n_tx"])

    lat_col = _pick_column(list(df.columns), ["Latitude", "lat"])
    lon_col = _pick_column(list(df.columns), ["Longitude", "lon"])
    state_col = _pick_column(list(df.columns), ["State", "state"])
    work = df.copy()
    work["_lat"] = pd.to_numeric(work[lat_col], errors="coerce")
    work["_lon"] = pd.to_numeric(work[lon_col], errors="coerce")
    work = work.dropna(subset=["_lat", "_lon"])
    if state_col:
        work = work[work[state_col].astype(str).str.upper().isin(["TX", "TEXAS"])]
    else:
        work = work[
            (work["_lon"] >= -106.7)
            & (work["_lon"] <= -93.5)
            & (work["_lat"] >= 25.8)
            & (work["_lat"] <= 36.6)
        ]
    if len(work) == 0:
        print("EIA: no TX plants")
        return pd.DataFrame(columns=["county_fips", "eia_plant_dist_km", "eia_plant_n_tx"])

    gdf = gpd.GeoDataFrame(
        work,
        geometry=gpd.points_from_xy(work["_lon"], work["_lat"]),
        crs=CRS_WEB,
    ).to_crs(CRS_ANALYSIS)
    centroids = counties.copy()
    centroids["geometry"] = centroids.representative_point()
    union = gdf.union_all() if hasattr(gdf, "union_all") else gdf.unary_union
    dist_m = centroids.geometry.distance(union)
    out = pd.DataFrame(
        {
            "county_fips": counties["county_fips"].values,
            "eia_plant_dist_km": (dist_m / 1000.0).values,
            "eia_plant_n_tx": len(gdf),
        }
    )
    print(
        f"EIA plant dist km: n_tx={len(gdf)} "
        f"median={out['eia_plant_dist_km'].median():.2f}"
    )
    return out


def rrc_well_density(counties: gpd.GeoDataFrame, control: pd.DataFrame) -> pd.DataFrame:
    """D3: RRC Digital Map density when present; else honest SMU-control proxy.

    Proxy is NOT RRC Digital Map — meta/notes scream this loudly.
    """
    rrc_dir = RAW / "rrc"
    rrc_candidates: list[Path] = []
    if rrc_dir.exists():
        rrc_candidates.extend(rrc_dir.glob("*.shp"))
        rrc_candidates.extend(rrc_dir.glob("*.geojson"))
        rrc_candidates.extend(rrc_dir.glob("**/*.shp"))

    if rrc_candidates:
        print(
            f"RRC files present ({rrc_candidates[0].name}) but parser not implemented — "
            "falling through to SMU-control density proxy"
        )

    # Honest proxy: thermal_control_n / area_km2 (SMU control points, not RRC wells)
    print(
        "D3: RRC Digital Map unavailable — computing HONEST PROXY "
        "well_density = SMU thermal_control_n / area_km2 "
        "(well_density_note=smu_control_density_proxy_rrc_pending). "
        "THIS IS NOT RRC Digital Map well density."
    )
    out = counties[["county_fips", "area_km2"]].copy()
    ctrl = control[["county_fips", "thermal_control_n"]].copy() if not control.empty else pd.DataFrame(
        columns=["county_fips", "thermal_control_n"]
    )
    out = out.merge(ctrl, on="county_fips", how="left")
    out["thermal_control_n"] = out["thermal_control_n"].fillna(0)
    out["well_density"] = out["thermal_control_n"] / out["area_km2"].replace(0, np.nan)
    # Tertile bands across Texas (High / Medium / Low)
    valid = out["well_density"].dropna()
    if len(valid) >= 3:
        q_lo, q_hi = valid.quantile([1 / 3, 2 / 3])
        bands = pd.Series("Medium", index=out.index, dtype=object)
        bands.loc[out["well_density"].isna()] = "Unknown"
        bands.loc[out["well_density"] <= q_lo] = "Low"
        bands.loc[out["well_density"] >= q_hi] = "High"
        out["well_density_band"] = bands
    else:
        out["well_density_band"] = "Unknown"
    out["well_density_note"] = "smu_control_density_proxy_rrc_pending"
    out["rrc_vintage"] = "proxy_smu_control_not_rrc_digital_map"
    out = out.drop(columns=["area_km2", "thermal_control_n"])
    print(
        f"  proxy well_density: n={out['well_density'].notna().sum()} "
        f"median={out['well_density'].median():.4f} /km2 "
        f"(NOT RRC Digital Map)"
    )
    return out


def _load_texnet_events() -> pd.DataFrame | None:
    """Load TexNet M≥2.5 events from JSON or CSV."""
    json_path = RAW / "texnet" / "texnet_events.json"
    csv_path = RAW / "texnet" / "texnet_events.csv"
    legacy_csv = RAW / "texnet" / "texnet_catalog.csv"

    if json_path.exists() and json_path.stat().st_size > 100:
        try:
            payload = json.loads(json_path.read_text(encoding="utf-8"))
            events = payload.get("events") or []
            if events:
                df = pd.DataFrame(events)
                print(f"TexNet JSON: {len(df)} events from {json_path.name}")
                return df
        except Exception as exc:  # noqa: BLE001
            print(f"  TexNet JSON parse failed: {exc}")

    for path in (csv_path, legacy_csv):
        if path.exists() and path.stat().st_size > 0:
            try:
                df = pd.read_csv(path)
                print(f"TexNet CSV: {len(df)} rows from {path.name}")
                return df
            except Exception as exc:  # noqa: BLE001
                print(f"  TexNet CSV parse failed ({path.name}): {exc}")
    return None


def optional_flags(counties: gpd.GeoDataFrame) -> pd.DataFrame:
    """TexNet / PAD-US flags — NaN + status=unknown when data missing (never silent False).

    TexNet rule (documented): county has texnet_risk_flag=True if ≥1 event with M≥2.5
    falls inside the county polygon; else False when catalog loaded.
    """
    out = counties[["county_fips"]].copy()

    # --- TexNet ---
    texnet_df = _load_texnet_events()
    if texnet_df is None or len(texnet_df) == 0:
        print("TexNet missing — texnet_risk_flag=NaN, texnet_status=unknown")
        out["texnet_risk_flag"] = np.nan
        out["texnet_status"] = "unknown"
        out["texnet_event_n"] = np.nan
        out["texnet_vintage"] = "not_loaded"
        out["texnet_data_present"] = False
    else:
        lat_col = _pick_column(list(texnet_df.columns), ["Latitude", "lat", "Lat"])
        lon_col = _pick_column(list(texnet_df.columns), ["Longitude", "lon", "Long", "lng"])
        mag_col = _pick_column(list(texnet_df.columns), ["Magnitude", "mag", "Mag"])
        if not lat_col or not lon_col:
            print("TexNet present but no lat/lon — treating as unknown")
            out["texnet_risk_flag"] = np.nan
            out["texnet_status"] = "unknown"
            out["texnet_event_n"] = np.nan
            out["texnet_vintage"] = "parse_failed"
            out["texnet_data_present"] = False
        else:
            work = texnet_df.copy()
            work["_lat"] = pd.to_numeric(work[lat_col], errors="coerce")
            work["_lon"] = pd.to_numeric(work[lon_col], errors="coerce")
            if mag_col:
                work["_mag"] = pd.to_numeric(work[mag_col], errors="coerce")
                work = work[work["_mag"].isna() | (work["_mag"] >= 2.5)]
            work = work.dropna(subset=["_lat", "_lon"])
            # TX bbox soft filter (catalog is regional; keep near-TX)
            work = work[
                (work["_lon"] >= -107.5)
                & (work["_lon"] <= -93.0)
                & (work["_lat"] >= 25.5)
                & (work["_lat"] <= 37.0)
            ]
            gdf = gpd.GeoDataFrame(
                work,
                geometry=gpd.points_from_xy(work["_lon"], work["_lat"]),
                crs=CRS_WEB,
            ).to_crs(CRS_ANALYSIS)
            joined = gpd.sjoin(
                gdf, counties[["county_fips", "geometry"]], how="inner", predicate="within"
            )
            counts = (
                joined.groupby("county_fips", as_index=False)
                .size()
                .rename(columns={"size": "texnet_event_n"})
            )
            # Rule: ≥1 event M≥2.5 in county → caution True
            out = out.merge(counts, on="county_fips", how="left")
            out["texnet_event_n"] = out["texnet_event_n"].fillna(0).astype(int)
            out["texnet_risk_flag"] = out["texnet_event_n"] >= 1
            out["texnet_status"] = "loaded"
            out["texnet_vintage"] = "texnet_arcgis_mge2.5"
            out["texnet_data_present"] = True
            n_caution = int(out["texnet_risk_flag"].sum())
            print(
                f"TexNet spatial join: events_in_tx_counties={int(out['texnet_event_n'].sum())} "
                f"counties_with_ge1_Mge2.5={n_caution} "
                f"(rule: >=1 event -> texnet_risk_flag=True)"
            )

    # --- PAD-US (Fee layer, GAP_Sts 1–2 + min area fraction) ---
    # Rule: friction True if Fee GAP_Sts in {1,2} intersect area / county area > 1%.
    # GAP 3/4 alone do NOT set friction. Any-touch without area gate over-flags (~122 TX).
    PADUS_MIN_FRAC = 0.01
    padus_root = RAW / "padus"
    fee_candidates: list[Path] = []
    if padus_root.exists():
        fee_candidates.extend(padus_root.rglob("PADUS*Fee*.shp"))
        fee_candidates.extend(padus_root.rglob("PADUS*Fee*.geojson"))
    fee_path = sorted(set(fee_candidates))[0] if fee_candidates else None

    if fee_path is None:
        print("PAD-US missing — padus_protected_flag=NaN, padus_status=unknown")
        out["padus_protected_flag"] = np.nan
        out["padus_status"] = "unknown"
        out["padus_vintage"] = "not_loaded"
        out["padus_data_present"] = False
        out["padus_gap12_n"] = np.nan
        out["padus_frac"] = np.nan
    else:
        try:
            print(f"PAD-US Fee layer: {fee_path}")
            padus = gpd.read_file(fee_path)
            if padus.crs is None:
                # PAD-US 2.1 Fee TX ships in USGS Albers (ESRI:102039)
                padus = padus.set_crs("ESRI:102039")
            padus = padus.to_crs(CRS_ANALYSIS)
            gap_col = _pick_column(list(padus.columns), ["GAP_Sts", "GAP_STATUS", "GAP_Status"])
            if gap_col is None:
                raise RuntimeError(f"PAD-US Fee missing GAP_Sts column; cols={list(padus.columns)}")
            padus["_gap"] = pd.to_numeric(padus[gap_col], errors="coerce")
            gap12 = padus[padus["_gap"].isin([1, 2])].copy()
            gap12 = gap12[~gap12.geometry.is_empty & gap12.geometry.notna()].copy()
            print(
                f"PAD-US Fee: n={len(padus)} GAP1-2={len(gap12)} "
                f"(friction rule: Fee GAP_Sts in {{1,2}} AND intersect_area/county > "
                f"{PADUS_MIN_FRAC:.0%}; GAP 3/4 alone do NOT set friction)"
            )
            county_areas = counties[["county_fips", "geometry"]].copy()
            county_areas["_carea"] = county_areas.geometry.area
            if len(gap12) == 0:
                out["padus_protected_flag"] = False
                out["padus_gap12_n"] = 0
                out["padus_frac"] = 0.0
            else:
                # Count intersecting polys (context) + area fraction (gate)
                joined = gpd.sjoin(
                    counties[["county_fips", "geometry"]],
                    gap12[["geometry"]],
                    how="inner",
                    predicate="intersects",
                )
                counts = (
                    joined.groupby("county_fips", as_index=False)
                    .size()
                    .rename(columns={"size": "padus_gap12_n"})
                )
                inter = gpd.overlay(
                    county_areas,
                    gap12[["geometry"]],
                    how="intersection",
                    keep_geom_type=False,
                )
                inter["_ia"] = inter.geometry.area
                area_sum = inter.groupby("county_fips", as_index=False)["_ia"].sum()
                area_sum = area_sum.merge(
                    county_areas[["county_fips", "_carea"]], on="county_fips", how="left"
                )
                area_sum["padus_frac"] = area_sum["_ia"] / area_sum["_carea"].replace(0, np.nan)
                out = out.merge(counts, on="county_fips", how="left")
                out = out.merge(
                    area_sum[["county_fips", "padus_frac"]], on="county_fips", how="left"
                )
                out["padus_gap12_n"] = out["padus_gap12_n"].fillna(0).astype(int)
                out["padus_frac"] = out["padus_frac"].fillna(0.0)
                out["padus_protected_flag"] = out["padus_frac"] > PADUS_MIN_FRAC
            out["padus_status"] = "loaded"
            out["padus_vintage"] = "padus_2.1_fee_gap12_frac01"
            out["padus_data_present"] = True
            n_friction = int(out["padus_protected_flag"].fillna(False).astype(bool).sum())
            n_touch = int((out.get("padus_gap12_n", pd.Series(dtype=int)).fillna(0) > 0).sum())
            print(
                f"PAD-US spatial join: touch={n_touch} friction_frac>{PADUS_MIN_FRAC:.0%}="
                f"{n_friction} (vintage=padus_2.1_fee_gap12_frac01)"
            )
        except Exception as exc:  # noqa: BLE001
            print(
                f"PAD-US Fee present but join failed ({exc}) — "
                "padus_protected_flag=NaN, padus_status=unknown"
            )
            out["padus_protected_flag"] = np.nan
            out["padus_status"] = "unknown"
            out["padus_vintage"] = "file_present_parse_failed"
            out["padus_data_present"] = True
            out["padus_gap12_n"] = np.nan
            out["padus_frac"] = np.nan

    return out


def build() -> pd.DataFrame:
    PROCESSED.mkdir(parents=True, exist_ok=True)
    counties = load_tx_counties()

    stanford = aggregate_stanford(counties)
    control = aggregate_thermal_control(counties)
    subst = substation_distance_km(counties)
    eia = eia_plant_distance_km(counties)
    rrc = rrc_well_density(counties, control)
    flags = optional_flags(counties)

    features = counties.drop(columns="geometry").copy()
    for part in (stanford, control, subst, eia, rrc, flags):
        if part is None or part.empty:
            continue
        features = features.merge(part, on="county_fips", how="left")

    # Ensure required columns exist — nullable flags stay NaN when unknown
    for col, default in [
        ("tdepth_C", np.nan),
        ("tdepth_km", np.nan),
        ("tdepth_n", 0),
        ("thermal_control_n", 0),
        ("substation_dist_km", np.nan),
        ("eia_plant_dist_km", np.nan),
        ("well_density", np.nan),
        ("well_density_band", "Unknown"),
        ("well_density_note", "unknown"),
        ("texnet_risk_flag", np.nan),
        ("padus_protected_flag", np.nan),
        ("padus_gap12_n", np.nan),
        ("texnet_status", "unknown"),
        ("padus_status", "unknown"),
        ("measured_vs_model", "model_stanford"),
    ]:
        if col not in features.columns:
            features[col] = default

    texnet_loaded = (features.get("texnet_status") == "loaded").any() if "texnet_status" in features.columns else False
    padus_loaded = (features.get("padus_status") == "loaded").any() if "padus_status" in features.columns else False
    well_note = (
        str(features["well_density_note"].dropna().iloc[0])
        if "well_density_note" in features.columns and features["well_density_note"].notna().any()
        else "unknown"
    )

    features["crs_analysis"] = CRS_ANALYSIS
    features["lineage"] = json.dumps(
        {
            "d1": "stanford_gdr_1592_tx_t_at_depth",
            "d2": "smu_gdr_1704_or_ihfc_fallback",
            "d3": well_note,
            "d3_honesty": (
                "NOT_RRC_Digital_Map"
                if "smu_control_density_proxy" in well_note
                else "rrc_or_other"
            ),
            "d4_texnet": "loaded" if texnet_loaded else "unknown",
            "d5_padus": "loaded" if padus_loaded else "unknown",
            "d6": "hifld_substations_plus_eia860_optional",
            "texnet_rule": "county_caution_if_ge1_event_Mge2.5",
            "padus_rule": "county_friction_if_intersects_fee_GAP_Sts_in_1_or_2",
            "primary_tdepth_preference": PRIMARY_T_COL_PREFERENCE,
        }
    )

    n = len(features)
    assert n >= 250, f"Expected ~254 TX counties, got {n}"
    out_path = PROCESSED / "data_depth_features.csv"
    # Drop geometry-free lineage from CSV; keep columns including nullable flags
    features.drop(columns=["lineage"], errors="ignore").to_csv(out_path, index=False)

    meta = {
        "n_counties": int(n),
        "n_with_tdepth": int(features["tdepth_C"].notna().sum()),
        "n_with_control": int((features["thermal_control_n"].fillna(0) > 0).sum()),
        "n_with_substation_dist": int(features["substation_dist_km"].notna().sum()),
        "n_texnet_caution": int(features["texnet_risk_flag"].fillna(False).astype(bool).sum())
        if texnet_loaded
        else None,
        "n_padus_friction": int(features["padus_protected_flag"].fillna(False).astype(bool).sum())
        if padus_loaded
        else None,
        "texnet_status": "loaded" if texnet_loaded else "unknown",
        "padus_status": "loaded" if padus_loaded else "unknown",
        "padus_vintage": (
            str(features["padus_vintage"].dropna().iloc[0])
            if "padus_vintage" in features.columns and features["padus_vintage"].notna().any()
            else None
        ),
        "well_density_note": well_note,
        "well_density_honesty": (
            "SMU control-point density proxy — NOT RRC Digital Map well density"
            if "smu_control_density_proxy" in well_note
            else None
        ),
        "primary_tdepth_km": float(features["tdepth_km"].dropna().iloc[0])
        if features["tdepth_km"].notna().any()
        else None,
        "crs_analysis": CRS_ANALYSIS,
        "output": str(out_path),
    }
    (PROCESSED / "data_depth_features_meta.json").write_text(
        json.dumps(meta, indent=2), encoding="utf-8"
    )
    print(f"Wrote {out_path}")
    print(f"QA: {meta}")
    return features


def main() -> None:
    build()


if __name__ == "__main__":
    main()
