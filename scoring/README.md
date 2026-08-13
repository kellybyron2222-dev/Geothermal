# Scoring / ETL (Python)

Offline batch pipelines for Phase 1 county screening features.

## Setup

```bash
cd scoring
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run (Milestone 1)

```bash
# from repo root
python scoring/download_data.py
python scoring/build_county_features.py
```

Outputs land in `data/processed/`. Raw downloads stay in `data/raw/` (gitignored).

See `docs/data-sources.md`.
