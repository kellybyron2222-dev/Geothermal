"""Fetch TexNet M≥2.5 events only (ArcGIS REST) → data/raw/texnet/.

Thin wrapper around download_data_depth.download_texnet for fast re-runs
when Stanford/SMU/HIFLD already exist (skip-if-exists).
"""

from __future__ import annotations

import argparse

from download_data_depth import download_texnet, write_manifest


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch TexNet events only")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-download even if texnet_events.json exists",
    )
    args = parser.parse_args()
    result = download_texnet(force=args.force)
    write_manifest({"texnet": result})
    if not result.get("ok"):
        raise SystemExit(1)
    print(f"OK n_events={result.get('n_events')} path={result.get('path')}")


if __name__ == "__main__":
    main()
