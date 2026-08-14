"""
Download Data Depth (D1–D6) raw datasets into data/raw/.

Priority: D1 Stanford GDR 1592, D2 SMU GDR 1704, D6 HIFLD substations (+ EIA 860).
Optional: TexNet / PAD-US stubs if fetch fails.
Skip-if-exists for all artifacts. VERIFY_SSL=False (same pattern as download_data.py).
"""

from __future__ import annotations

import csv
import io
import json
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
VERIFY_SSL = False

TX_BBOX = {
    "xmin": -106.7,
    "ymin": 25.8,
    "xmax": -93.5,
    "ymax": 36.6,
}

STANFORD_SUBMISSION = "https://gdr.openei.org/submissions/1592"
STANFORD_CANDIDATES = [
    # Ver3/Ver2/Ver1 aliases appear on the submission page but often 404;
    # real hosted names (prefer thinner CONUS model file, then COMPLETE).
    "https://gdr.openei.org/files/1592/thermal_model_inputs_outputs_Ver3.csv",
    "https://gdr.openei.org/files/1592/thermal_model_inputs_outputs_Ver2.csv",
    "https://gdr.openei.org/files/1592/thermal_model_inputs_outputs_Ver1.csv",
    "https://gdr.openei.org/files/1592/stanford_thermal_model_inputs_outputs.csv",
    "https://gdr.openei.org/files/1592/stanford_thermal_model_inputs_outputs_COMPLETE_VERSION2.csv",
]
STANFORD_BHT = "https://gdr.openei.org/files/1592/Raw_BHT_aggregated_data.csv"

SMU_FILES = [
    ("01_README-v2.txt", "https://gdr.openei.org/files/1704/01_README-v2.txt"),
    ("data_index.xlsx", "https://gdr.openei.org/files/1704/data_index.xlsx"),
    (
        "resource_index_file_7-1-2026.xlsx",
        "https://gdr.openei.org/files/1704/resource_index_file_7-1-2026.xlsx",
    ),
    (
        "Well Temperature-Depth data - TX.zip",
        "https://gdr.openei.org/files/1704/Well%20Temperature-Depth%20data%20-%20TX.zip",
    ),
]

# Full HIFLD-style substations (~75k US). Prefer STATE='TX' query.
HIFLD_SUBSTATIONS_QUERY = (
    "https://services5.arcgis.com/HDRa0B57OVrv2E1q/arcgis/rest/services/"
    "Electric_Substations/FeatureServer/0/query"
)

EIA860_CANDIDATES = [
    "https://www.eia.gov/electricity/data/eia860/xls/eia8602025ER.zip",
    "https://www.eia.gov/electricity/data/eia860/xls/eia8602024.zip",
    "https://www.eia.gov/electricity/data/eia860/xls/eia8602024ER.zip",
    "https://www.eia.gov/electricity/data/eia860/xls/eia8602023.zip",
]

# TexNet ArcGIS REST catalog (M≥2.5). CSV export endpoints historically fail.
TEXNET_ARCGIS_QUERY = (
    "https://maps.texnet.beg.utexas.edu/arcgis/rest/services/"
    "catalog/catalog_all/MapServer/0/query"
)
TEXNET_MIN_MAG = 2.5
TEXNET_PAGE_SIZE = 2000
TEXNET_MAX_EVENTS = 20_000

# PAD-US 2.1 TX Fee shapefile (USGS ScienceBase item 60259839d34eb12031138e1e).
PADUS_TX_ZIP_URL = (
    "https://www.sciencebase.gov/catalog/file/get/60259839d34eb12031138e1e"
    "?f=__disk__fa%2F70%2F68%2Ffa706810cb4f7b0a5b1c34c2be2524871258a57e"
)
PADUS_TX_EXTRACT_DIR = "padus21_tx"
PADUS_TX_FEE_SHP_NAME = "PADUS2_1Fee_StateTX.shp"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def download_file(url: str, dest: Path, timeout: int = 600) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        print(f"  skip (exists): {dest}")
        return dest
    print(f"  GET {url}")
    r = requests.get(url, timeout=timeout, stream=True, verify=VERIFY_SSL)
    r.raise_for_status()
    tmp = dest.with_suffix(dest.suffix + ".partial")
    with open(tmp, "wb") as f:
        for chunk in r.iter_content(chunk_size=1 << 20):
            if chunk:
                f.write(chunk)
    tmp.replace(dest)
    print(f"  wrote {dest} ({dest.stat().st_size:,} bytes)")
    return dest


def url_ok(url: str, timeout: int = 60) -> bool:
    try:
        r = requests.head(url, timeout=timeout, verify=VERIFY_SSL, allow_redirects=True)
        if r.status_code < 400 and "html" not in (r.headers.get("content-type") or "").lower():
            return True
        # Some hosts block HEAD; try ranged GET.
        r = requests.get(
            url,
            headers={"Range": "bytes=0-64"},
            timeout=timeout,
            verify=VERIFY_SSL,
            stream=True,
        )
        ok = r.status_code in (200, 206) and "html" not in (r.headers.get("content-type") or "").lower()
        r.close()
        return ok
    except Exception:  # noqa: BLE001
        return False


def scrape_stanford_links() -> list[str]:
    try:
        r = requests.get(STANFORD_SUBMISSION, timeout=90, verify=VERIFY_SSL)
        r.raise_for_status()
        hrefs = re.findall(r'href=["\']([^"\']+)["\']', r.text, re.I)
        out: list[str] = []
        for h in hrefs:
            if "files/1592/" not in h:
                continue
            if not h.lower().endswith(".csv"):
                continue
            if h.startswith("http"):
                out.append(h)
            else:
                out.append("https://gdr.openei.org" + h)
        return out
    except Exception as exc:  # noqa: BLE001
        print(f"  warning: could not scrape submission page ({exc})")
        return []


def _col_idx(header: list[str], names: list[str]) -> int | None:
    lower = {h.lower(): i for i, h in enumerate(header)}
    for n in names:
        if n.lower() in lower:
            return lower[n.lower()]
    return None


def stream_stanford_tx_extract(url: str, dest: Path) -> dict:
    """Stream CONUS CSV and write TX bbox rows with T@3/4/5 km columns."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 1000:
        print(f"  skip (exists): {dest}")
        return {"path": str(dest), "skipped": True, "source_url": url}

    # Remove stale partials from prior failed runs
    partial = dest.with_suffix(dest.suffix + ".partial")
    if partial.exists():
        partial.unlink()

    print(f"  STREAM-FILTER TX from {url}")
    r = requests.get(url, timeout=1200, stream=True, verify=VERIFY_SSL)
    r.raise_for_status()

    def _decode_line(raw):
        if raw is None:
            return None
        if isinstance(raw, bytes):
            return raw.decode("utf-8", errors="replace")
        return str(raw)

    # Manual decode — decode_unicode is unreliable across urllib3 versions.
    line_iter = (_decode_line(x) for x in r.iter_lines())
    try:
        header_line = next(line_iter)
    except StopIteration as exc:
        raise RuntimeError("Stanford CSV empty") from exc
    while header_line is not None and not header_line.strip():
        header_line = next(line_iter, None)
    if not header_line:
        raise RuntimeError("Stanford CSV missing header")

    header = next(csv.reader([header_line]))
    lat_i = _col_idx(header, ["Lat", "latitude", "lat"])
    lon_i = _col_idx(header, ["Long", "Longitude", "lon", "lng"])
    keep_names = [
        "Lat",
        "Long",
        "T_3000m",
        "T_4000m",
        "T_5000m",
        "T_std_3000m",
        "T_std_4000m",
        "T_std_5000m",
        "Q",
        "K",
    ]
    keep_idx = []
    out_header = []
    for name in keep_names:
        i = _col_idx(header, [name])
        if i is not None:
            keep_idx.append(i)
            out_header.append(header[i])

    if lat_i is None or lon_i is None:
        raise RuntimeError(f"Could not find Lat/Long in Stanford header: {header[:20]}")
    if not any(h.upper().startswith("T_") for h in out_header):
        raise RuntimeError(f"No T_* depth columns found in {out_header}")

    n_in = 0
    n_out = 0
    xmin, xmax = TX_BBOX["xmin"], TX_BBOX["xmax"]
    ymin, ymax = TX_BBOX["ymin"], TX_BBOX["ymax"]

    with open(partial, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(out_header)
        for line in line_iter:
            if line is None or not str(line).strip():
                continue
            n_in += 1
            if n_in % 200_000 == 0:
                print(f"    scanned {n_in:,} kept {n_out:,}")
                f.flush()
            try:
                row = next(csv.reader([line]))
            except Exception:
                continue
            try:
                lat = float(row[lat_i])
                lon = float(row[lon_i])
            except (ValueError, IndexError):
                continue
            if not (ymin <= lat <= ymax and xmin <= lon <= xmax):
                continue
            writer.writerow([row[i] if i < len(row) else "" for i in keep_idx])
            n_out += 1

    partial.replace(dest)
    print(f"  wrote {dest} rows_in={n_in:,} rows_tx={n_out:,} ({dest.stat().st_size:,} bytes)")
    return {
        "path": str(dest),
        "source_url": url,
        "rows_scanned": n_in,
        "rows_tx": n_out,
        "columns": out_header,
    }


def download_stanford() -> dict:
    print("\n== D1 Stanford GDR 1592 (T@depth) ==")
    out_dir = RAW / "stanford_thermal"
    out_dir.mkdir(parents=True, exist_ok=True)
    result: dict = {"ok": False, "artifacts": []}

    tx_path = out_dir / "tx_t_at_depth.csv"
    # Prefer scrape order then hard-coded candidates (smaller CONUS file first).
    urls: list[str] = []
    scraped = scrape_stanford_links()
    # Prefer non-COMPLETE, non-across_depths first.
    def rank(u: str) -> tuple[int, str]:
        ul = u.lower()
        if "across_depths" in ul:
            return (9, u)
        if "complete" in ul:
            return (5, u)
        if "raw_bht" in ul:
            return (8, u)
        if "inputs_outputs" in ul and ul.endswith(".csv"):
            return (0, u)
        return (3, u)

    for u in sorted(set(scraped + STANFORD_CANDIDATES), key=rank):
        if u not in urls:
            urls.append(u)

    chosen = None
    for u in urls:
        if "raw_bht" in u.lower():
            continue
        if "across_depths" in u.lower():
            continue  # ~13 GB — skip
        print(f"  probing {u}")
        if url_ok(u):
            chosen = u
            break
        print("    not available")

    if chosen is None:
        print("  ERROR: no Stanford model CSV reachable")
        result["error"] = "no_url"
        return result

    try:
        meta = stream_stanford_tx_extract(chosen, tx_path)
        result["artifacts"].append(meta)
        result["ok"] = True
        result["source_url"] = chosen
    except Exception as exc:  # noqa: BLE001
        print(f"  ERROR streaming Stanford ({exc})")
        result["error"] = str(exc)
        return result

    # Companion BHT aggregate (useful QC / optional densification)
    bht_path = out_dir / "Raw_BHT_aggregated_data.csv"
    try:
        download_file(STANFORD_BHT, bht_path, timeout=600)
        result["artifacts"].append({"path": str(bht_path), "source_url": STANFORD_BHT})
    except Exception as exc:  # noqa: BLE001
        print(f"  warning: Raw_BHT download failed ({exc})")

    return result


def download_smu() -> dict:
    print("\n== D2 SMU GDR 1704 (TX well temps + indexes) ==")
    out_dir = RAW / "smu_gdr_1704"
    out_dir.mkdir(parents=True, exist_ok=True)
    result: dict = {"ok": False, "artifacts": []}
    ok_any = False
    for fname, url in SMU_FILES:
        dest = out_dir / fname
        try:
            download_file(url, dest, timeout=600)
            result["artifacts"].append({"path": str(dest), "source_url": url, "bytes": dest.stat().st_size})
            ok_any = True
            if fname.endswith(".zip"):
                extract_dir = out_dir / "well_temp_tx"
                if not extract_dir.exists() or not any(extract_dir.iterdir()):
                    extract_dir.mkdir(parents=True, exist_ok=True)
                    with zipfile.ZipFile(dest, "r") as zf:
                        zf.extractall(extract_dir)
                    print(f"  extracted -> {extract_dir}")
                else:
                    print(f"  skip extract (exists): {extract_dir}")
        except Exception as exc:  # noqa: BLE001
            print(f"  warning: failed {fname} ({exc})")
    result["ok"] = ok_any
    return result


def download_hifld_substations() -> dict:
    print("\n== D6 HIFLD Electric Substations (TX) ==")
    out_dir = RAW / "substations"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "hifld_tx_substations.geojson"
    result: dict = {"ok": False, "path": str(out_path)}

    if out_path.exists() and out_path.stat().st_size > 1000:
        print(f"  skip (exists): {out_path}")
        result["ok"] = True
        result["skipped"] = True
        return result

    features: list[dict] = []
    offset = 0
    page_size = 2000
    try:
        while True:
            params = {
                "where": "STATE='TX'",
                "outFields": "*",
                "returnGeometry": "true",
                "outSR": 4326,
                "f": "geojson",
                "resultOffset": offset,
                "resultRecordCount": page_size,
            }
            print(f"  query offset={offset}")
            r = requests.get(
                HIFLD_SUBSTATIONS_QUERY, params=params, timeout=180, verify=VERIFY_SSL
            )
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
                raise RuntimeError("HIFLD substations pagination safety stop")

        # Fallback to bbox if STATE filter returned nothing
        if not features:
            print("  STATE filter empty; falling back to TX bbox")
            offset = 0
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
                print(f"  bbox query offset={offset}")
                r = requests.get(
                    HIFLD_SUBSTATIONS_QUERY, params=params, timeout=180, verify=VERIFY_SSL
                )
                r.raise_for_status()
                payload = r.json()
                if "error" in payload:
                    raise RuntimeError(payload["error"])
                batch = payload.get("features") or []
                features.extend(batch)
                if len(batch) < page_size:
                    break
                offset += page_size

        geojson = {"type": "FeatureCollection", "features": features}
        out_path.write_text(json.dumps(geojson), encoding="utf-8")
        print(f"  wrote {out_path} ({len(features)} features)")
        result["ok"] = True
        result["n_features"] = len(features)
        result["source_url"] = HIFLD_SUBSTATIONS_QUERY
    except Exception as exc:  # noqa: BLE001
        print(f"  ERROR substations ({exc})")
        result["error"] = str(exc)
    return result


def download_eia860() -> dict:
    print("\n== D6 EIA Form 860 (plants) ==")
    out_dir = RAW / "eia860"
    out_dir.mkdir(parents=True, exist_ok=True)
    result: dict = {"ok": False}

    existing = list(out_dir.glob("eia860*.zip"))
    if existing:
        print(f"  skip (exists): {existing[0]}")
        result["ok"] = True
        result["path"] = str(existing[0])
        result["skipped"] = True
        return result

    for url in EIA860_CANDIDATES:
        fname = url.rsplit("/", 1)[-1]
        dest = out_dir / fname
        try:
            if not url_ok(url):
                print(f"  skip unavailable: {fname}")
                continue
            download_file(url, dest, timeout=600)
            # Extract plant workbook if present
            extract_dir = out_dir / dest.stem
            extract_dir.mkdir(parents=True, exist_ok=True)
            with zipfile.ZipFile(dest, "r") as zf:
                zf.extractall(extract_dir)
            print(f"  extracted -> {extract_dir}")
            result["ok"] = True
            result["path"] = str(dest)
            result["extract_dir"] = str(extract_dir)
            result["source_url"] = url
            return result
        except Exception as exc:  # noqa: BLE001
            print(f"  warning: {fname} failed ({exc})")
    result["error"] = "no_eia860_zip"
    return result


def download_texnet(force: bool = False) -> dict:
    """Paginate TexNet ArcGIS REST for M≥2.5 events → texnet_events.json + CSV."""
    print("\n== TexNet catalog (ArcGIS REST, M>=2.5) ==")
    out_dir = RAW / "texnet"
    out_dir.mkdir(parents=True, exist_ok=True)
    dest_json = out_dir / "texnet_events.json"
    dest_csv = out_dir / "texnet_events.csv"
    result: dict = {
        "ok": False,
        "path": str(dest_json),
        "csv_path": str(dest_csv),
        "source_url": TEXNET_ARCGIS_QUERY,
        "min_magnitude": TEXNET_MIN_MAG,
    }

    if (
        not force
        and dest_json.exists()
        and dest_json.stat().st_size > 100
        and dest_csv.exists()
        and dest_csv.stat().st_size > 0
    ):
        print(f"  skip (exists): {dest_json}")
        result["ok"] = True
        result["skipped"] = True
        try:
            prior = json.loads(dest_json.read_text(encoding="utf-8"))
            result["n_events"] = len(prior.get("events") or [])
            result["retrieved_at"] = prior.get("retrieved_at")
        except Exception:  # noqa: BLE001
            pass
        return result

    events: list[dict] = []
    offset = 0
    try:
        while True:
            params = {
                "where": f"Magnitude>={TEXNET_MIN_MAG}",
                "outFields": "Latitude,Longitude,Magnitude,Event_Date,EventId,RegionName",
                "returnGeometry": "false",
                "f": "json",
                "resultOffset": offset,
                "resultRecordCount": TEXNET_PAGE_SIZE,
                "orderByFields": "Event_Date ASC",
            }
            print(f"  query offset={offset}")
            r = requests.get(
                TEXNET_ARCGIS_QUERY, params=params, timeout=180, verify=VERIFY_SSL
            )
            r.raise_for_status()
            payload = r.json()
            if "error" in payload:
                raise RuntimeError(payload["error"])
            batch = payload.get("features") or []
            for feat in batch:
                attrs = feat.get("attributes") or {}
                try:
                    lat = float(attrs.get("Latitude"))
                    lon = float(attrs.get("Longitude"))
                    mag = float(attrs.get("Magnitude"))
                except (TypeError, ValueError):
                    continue
                if mag < TEXNET_MIN_MAG:
                    continue
                events.append(
                    {
                        "EventId": attrs.get("EventId"),
                        "Latitude": lat,
                        "Longitude": lon,
                        "Magnitude": mag,
                        "OriginDate": attrs.get("Event_Date"),
                        "RegionName": attrs.get("RegionName"),
                    }
                )
            if len(batch) < TEXNET_PAGE_SIZE:
                break
            offset += TEXNET_PAGE_SIZE
            if offset >= TEXNET_MAX_EVENTS:
                print(f"  pagination cap at {TEXNET_MAX_EVENTS} — stopping")
                break

        envelope = {
            "retrieved_at": utc_now_iso(),
            "source_url": TEXNET_ARCGIS_QUERY,
            "where": f"Magnitude>={TEXNET_MIN_MAG}",
            "n_events": len(events),
            "events": events,
        }
        dest_json.write_text(json.dumps(envelope, indent=2), encoding="utf-8")
        with open(dest_csv, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(
                f,
                fieldnames=[
                    "EventId",
                    "Latitude",
                    "Longitude",
                    "Magnitude",
                    "OriginDate",
                    "RegionName",
                ],
            )
            writer.writeheader()
            writer.writerows(events)
        print(f"  wrote {dest_json} ({len(events)} events)")
        print(f"  wrote {dest_csv}")
        result["ok"] = True
        result["n_events"] = len(events)
        result["retrieved_at"] = envelope["retrieved_at"]
    except Exception as exc:  # noqa: BLE001
        print(f"  ERROR TexNet ({exc})")
        result["error"] = str(exc)
    return result


# Backward-compatible alias for older call sites / docs
def download_texnet_optional() -> dict:
    return download_texnet(force=False)


def download_padus_optional() -> dict:
    """Download PAD-US 2.1 TX Fee shapefile from ScienceBase if missing.

    Skip when any nested PADUS*Fee*.shp already exists under data/raw/padus/
    (including padus21_tx/). Friction join uses GAP_Sts in {1, 2} only.
    """
    print("\n== Optional PAD-US 2.1 TX Fee ==")
    out_dir = RAW / "padus"
    out_dir.mkdir(parents=True, exist_ok=True)
    extract_dir = out_dir / PADUS_TX_EXTRACT_DIR
    fee_shp = extract_dir / PADUS_TX_FEE_SHP_NAME
    result: dict = {
        "ok": False,
        "path": str(fee_shp),
        "source_url": PADUS_TX_ZIP_URL,
        "vintage": "padus_2.1_fee_gap12",
    }

    existing_fee = list(out_dir.rglob("PADUS*Fee*.shp"))
    if existing_fee or (fee_shp.exists() and fee_shp.stat().st_size > 0):
        found = existing_fee[0] if existing_fee else fee_shp
        print(f"  skip (Fee shp exists): {found}")
        result["ok"] = True
        result["skipped"] = True
        result["path"] = str(found)
        return result

    zip_dest = out_dir / "PADUS2_1_StateTX_Shapefile.zip"
    try:
        download_file(PADUS_TX_ZIP_URL, zip_dest, timeout=900)
        extract_dir.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(zip_dest, "r") as zf:
            zf.extractall(extract_dir)
        print(f"  extracted -> {extract_dir}")
        # ScienceBase zips sometimes nest one extra folder; locate Fee shp.
        fee_hits = list(out_dir.rglob("PADUS*Fee*.shp"))
        if not fee_hits:
            raise FileNotFoundError(
                f"ZIP extracted but no PADUS*Fee*.shp under {out_dir}"
            )
        result["ok"] = True
        result["path"] = str(fee_hits[0])
        result["n_fee_shp"] = len(fee_hits)
    except Exception as exc:  # noqa: BLE001
        print(f"  ERROR PAD-US download ({exc})")
        result["error"] = str(exc)
        note = out_dir / "README_STUB.txt"
        if not note.exists():
            note.write_text(
                "PAD-US TX Fee download failed. Place PADUS*Fee*.shp under "
                "data/raw/padus/ (e.g. padus21_tx/) to enable GAP1-2 friction flags.\n",
                encoding="utf-8",
            )
    return result


def write_manifest(results: dict) -> Path:
    manifest = {
        "retrieved_at": utc_now_iso(),
        "phase": "data_depth_d1_d6",
        "results": results,
        "notes": [
            "Stanford CONUS CSV stream-filtered to TX bbox (Lat/Long + T_3/4/5km).",
            "SMU prefers TX well-temperature zip + indexes (not full Curated Well Data).",
            "HIFLD substations: STATE='TX' FeatureServer query.",
            "RRC well density: honest SMU-control density proxy when Digital Map missing.",
            "TexNet: ArcGIS REST MapServer/0 query Magnitude>=2.5 → texnet_events.json.",
            "PAD-US: ScienceBase 2.1 TX Fee shapefile; friction = Fee GAP_Sts in {1,2} only.",
        ],
    }
    path = RAW / "_manifest.json"
    # Merge with prior if present
    if path.exists():
        try:
            prior = json.loads(path.read_text(encoding="utf-8"))
            manifest["prior_retrieved_at"] = prior.get("retrieved_at")
        except Exception:  # noqa: BLE001
            pass
    path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"\nWrote {path}")
    return path


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Download Data Depth raw datasets")
    parser.add_argument(
        "--texnet-only",
        action="store_true",
        help="Only fetch TexNet ArcGIS events (skip Stanford/SMU/HIFLD)",
    )
    parser.add_argument(
        "--force-texnet",
        action="store_true",
        help="Re-download TexNet even if texnet_events.json exists",
    )
    args = parser.parse_args()

    RAW.mkdir(parents=True, exist_ok=True)

    if args.texnet_only:
        results = {"texnet": download_texnet(force=args.force_texnet)}
        write_manifest(results)
        print("\nDone (texnet-only). Next: build_data_depth_features.py")
        return

    # Smaller assets first; Stanford stream last (largest).
    results = {
        "smu_d2": download_smu(),
        "substations_d6": download_hifld_substations(),
        "eia860_d6": download_eia860(),
        "texnet": download_texnet(force=args.force_texnet),
        "padus_optional": download_padus_optional(),
        "stanford_d1": download_stanford(),
    }
    write_manifest(results)
    print("\nDone. Next: scoring/.venv/Scripts/python.exe scoring/build_data_depth_features.py")


if __name__ == "__main__":
    main()
