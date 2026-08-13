"""
Download Phase 1 raw datasets into data/raw/.

Sources documented in docs/data-sources.md.
"""

from __future__ import annotations

import json
import zipfile
from pathlib import Path

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"

# Some Windows / corporate TLS setups fail leaf verification.
VERIFY_SSL = False

CENSUS_COUNTIES_ZIP = (
    "https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip"
)

# IHFC Global Heat Flow Database Release 2024 (open backup download)
IHFC_XLSX = "https://www.ihfc-iugg.org/user/downloads/data/R2024/IHFC_2024_GHFDB.xlsx"
IHFC_PDF = (
    "https://www.ihfc-iugg.org/user/downloads/data/R2024/"
    "GHFDB-AG_etal._2024_release_data_description.pdf"
)

# HIFLD Electric Power Transmission Lines (open FeatureServer)
HIFLD_QUERY = (
    "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/"
    "Electric_Power_Transmission_Lines/FeatureServer/0/query"
)

TX_BBOX = {
    "xmin": -106.7,
    "ymin": 25.8,
    "xmax": -93.5,
    "ymax": 36.6,
}


def download_file(url: str, dest: Path, timeout: int = 300) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        print(f"  skip (exists): {dest}")
        return dest
    print(f"  GET {url}")
    r = requests.get(url, timeout=timeout, stream=True, verify=VERIFY_SSL)
    r.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in r.iter_content(chunk_size=1 << 20):
            if chunk:
                f.write(chunk)
    print(f"  wrote {dest} ({dest.stat().st_size:,} bytes)")
    return dest


def download_counties() -> Path:
    print("\n== Counties (Census TIGER) ==")
    zpath = RAW / "counties" / "cb_2023_us_county_500k.zip"
    download_file(CENSUS_COUNTIES_ZIP, zpath)
    out_dir = RAW / "counties" / "cb_2023_us_county_500k"
    if not (out_dir / "cb_2023_us_county_500k.shp").exists():
        with zipfile.ZipFile(zpath, "r") as zf:
            zf.extractall(out_dir)
        print(f"  extracted -> {out_dir}")
    else:
        print(f"  skip extract (exists): {out_dir}")
    return out_dir


def download_thermal() -> Path:
    print("\n== Thermal (IHFC GHFDB 2024) ==")
    out_dir = RAW / "thermal"
    download_file(IHFC_XLSX, out_dir / "IHFC_2024_GHFDB.xlsx")
    try:
        download_file(IHFC_PDF, out_dir / "IHFC_2024_data_description.pdf")
    except Exception as exc:  # noqa: BLE001
        print(f"  warning: could not download description PDF ({exc})")
    return out_dir


def download_hifld_transmission() -> Path:
    print("\n== Transmission (HIFLD, Texas bbox) ==")
    out_dir = RAW / "transmission"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "hifld_tx_transmission.geojson"

    if out_path.exists() and out_path.stat().st_size > 1000:
        print(f"  skip (exists): {out_path}")
        return out_path

    features: list[dict] = []
    offset = 0
    page_size = 2000
    while True:
        params = {
            "where": "1=1",
            "geometry": json.dumps(
                {
                    "xmin": TX_BBOX["xmin"],
                    "ymin": TX_BBOX["ymin"],
                    "xmax": TX_BBOX["xmax"],
                    "ymax": TX_BBOX["ymax"],
                    "spatialReference": {"wkid": 4326},
                }
            ),
            "geometryType": "esriGeometryEnvelope",
            "inSR": 4326,
            "spatialRel": "esriSpatialRelIntersects",
            "outFields": "*",
            "returnGeometry": "true",
            "outSR": 4326,
            "f": "geojson",
            "resultOffset": offset,
            "resultRecordCount": page_size,
        }
        print(f"  query offset={offset}")
        r = requests.get(HIFLD_QUERY, params=params, timeout=180, verify=VERIFY_SSL)
        r.raise_for_status()
        payload = r.json()
        if "error" in payload:
            raise RuntimeError(payload["error"])
        batch = payload.get("features") or []
        features.extend(batch)
        if len(batch) < page_size:
            break
        offset += page_size
        if offset > 100_000:
            raise RuntimeError("HIFLD pagination safety stop")

    geojson = {"type": "FeatureCollection", "features": features}
    out_path.write_text(json.dumps(geojson), encoding="utf-8")
    print(f"  wrote {out_path} ({len(features)} features)")
    return out_path


def write_manifest() -> None:
    manifest = {
        "retrieved": "2026-08-13",
        "sources": [
            "census_cb_2023_us_county_500k",
            "ihfc_2024_ghfdb",
            "hifld_electric_power_transmission_lines",
        ],
        "docs": "docs/data-sources.md",
    }
    path = RAW / "manifest.json"
    path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"\nWrote {path}")


def main() -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    download_counties()
    download_thermal()
    download_hifld_transmission()
    write_manifest()
    print("\nDone. Next: python scoring/build_county_features.py")


if __name__ == "__main__":
    main()
