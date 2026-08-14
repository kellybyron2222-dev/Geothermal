#!/usr/bin/env python3
"""Stamp Phase 3 slice-1 fields onto existing meta.json + prospects.json meta.

Does not re-score. Writes processed + web/public/data copies.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROCESSED = ROOT / "data" / "processed"
WEB_DATA = ROOT / "web" / "public" / "data"

PHASE3 = {"slice": 1, "rulesVersion": "v0", "watchlistLocal": True}

RESIDUAL_PHASE3 = (
    " Phase 3 slice 1 shipping (watchlist/digest/rules) — not accounts/email."
)
DISCLAIMER_PHASE3 = (
    "Phase 3 slice 1 shipping (local watchlist, in-app digest, rule candidates) "
    "— not accounts/email. "
)


def publish_id(meta: dict) -> str:
    version = str(meta.get("methodologyVersion") or "")
    vintages = meta.get("layerVintages") or {}
    if not isinstance(vintages, dict):
        vintages = {}
    parts = [
        f"{k}={'' if vintages[k] is None else vintages[k]}"
        for k in sorted(vintages.keys())
    ]
    return f"{version}|{'|'.join(parts)}" if parts else version


def soften_residual(text: str | None) -> str:
    base = (text or "").strip()
    # Drop deferred / not-built Phase 3 clause; append shipping note once.
    for needle in (
        " Phase 3 is eligible after Data Depth STOP but deferred pending a Phase 3 judgment pass (not built yet).",
        "Phase 3 is eligible after Data Depth STOP but deferred pending a Phase 3 judgment pass (not built yet).",
    ):
        base = base.replace(needle, "")
    base = base.rstrip()
    if "Phase 3 slice 1 shipping" not in base:
        base = (base + RESIDUAL_PHASE3).strip()
    return base


def soften_disclaimer(text: str | None) -> str:
    base = (text or "").strip()
    base = base.replace("Not Phase 3 complete. ", DISCLAIMER_PHASE3)
    if "Phase 3 slice 1 shipping" not in base:
        base = DISCLAIMER_PHASE3 + base
    return base


def stamp_meta(meta: dict) -> dict:
    out = dict(meta)
    out["publishId"] = publish_id(out)
    out["phase3"] = dict(PHASE3)
    out["residualRisk"] = soften_residual(out.get("residualRisk"))
    out["disclaimer"] = soften_disclaimer(out.get("disclaimer"))
    return out


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, obj: object, *, indent: int | None = 2) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if indent is None:
        path.write_text(json.dumps(obj), encoding="utf-8")
    else:
        path.write_text(json.dumps(obj, indent=indent) + "\n", encoding="utf-8")


def main() -> None:
    meta_paths = [PROCESSED / "meta.json", WEB_DATA / "meta.json"]
    prospects_paths = [PROCESSED / "prospects.json", WEB_DATA / "prospects.json"]

    # Prefer processed meta as source of truth when present.
    src_meta_path = PROCESSED / "meta.json"
    if not src_meta_path.exists():
        src_meta_path = WEB_DATA / "meta.json"
    meta = stamp_meta(load_json(src_meta_path))

    for p in meta_paths:
        write_json(p, meta, indent=2)
        print(f"Wrote {p} publishId={meta['publishId']}")

    for p in prospects_paths:
        if not p.exists():
            print(f"Skip missing {p}")
            continue
        payload = load_json(p)
        payload["meta"] = stamp_meta(payload.get("meta") or meta)
        # prospects.json is large — keep compact
        write_json(p, payload, indent=None)
        print(f"Wrote {p} meta.publishId={payload['meta']['publishId']}")


if __name__ == "__main__":
    main()
