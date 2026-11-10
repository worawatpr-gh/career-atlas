#!/usr/bin/env python3
"""Build the Career Atlas JSON snapshot from the live ILOSTAT API.

The transformations mirror Datahub_2026_live.ipynb:
- ISCO-08 occupation detail only
- shared years across all configured countries and Total/Male/Female
- common occupations complete across countries, shared years and sexes
- employment share uses country/year/sex total employment
- Thailand deep dive includes all reported occupations from the first shared year
- linear trend vs naive backtest for Thailand
"""
from __future__ import annotations

import io
import json
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

import numpy as np
import pandas as pd
import requests

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "career_atlas_data.json"

INDICATOR_ID = "EMP_TEMP_SEX_OC2_NB_A"
TARGET_CODES = ["THA"]
REQUIRED_SEXES = ["Total", "Male", "Female"]
BASE_URL = "https://rplumber.ilo.org/data/indicator/"
REQUIRED_COLUMNS = [
    "ref_area", "ref_area.label", "sex", "sex.label",
    "classif1", "classif1.label", "time", "obs_value",
]
COUNTRY_ORDER = ["Thailand"]
COUNTRY_LABELS = {
    "Thailand": "ประเทศไทย",
    "France": "ฝรั่งเศส",
    "Japan": "ญี่ปุ่น",
    "United States of America": "สหรัฐอเมริกา",
}
OCCUPATION_THAI = {
    "01": "ทหารสัญญาบัตร",
    "02": "ทหารชั้นประทวน",
    "03": "ทหารอื่น ๆ (พลทหาร)",
    "11": "ผู้บริหารระดับสูง เจ้าหน้าที่อาวุโส และสมาชิกสภานิติบัญญัติ",
    "12": "ผู้จัดการด้านการบริหารและการพาณิชย์",
    "13": "ผู้จัดการด้านการผลิตและบริการเฉพาะทาง",
    "14": "ผู้จัดการด้านโรงแรม การค้าปลีก และบริการอื่น ๆ",
    "21": "ผู้ประกอบวิชาชีพด้านวิทยาศาสตร์และวิศวกรรม",
    "22": "ผู้ประกอบวิชาชีพด้านสุขภาพ",
    "23": "ผู้ประกอบวิชาชีพด้านการสอน",
    "24": "ผู้ประกอบวิชาชีพด้านธุรกิจและการบริหาร",
    "25": "ผู้ประกอบวิชาชีพด้านสารสนเทศและการสื่อสาร (ICT)",
    "26": "ผู้ประกอบวิชาชีพด้านกฎหมาย สังคม และวัฒนธรรม",
    "31": "ผู้ช่วยผู้ประกอบวิชาชีพด้านวิทยาศาสตร์และวิศวกรรม",
    "32": "ผู้ช่วยผู้ประกอบวิชาชีพด้านสุขภาพ",
    "33": "ผู้ช่วยผู้ประกอบวิชาชีพด้านธุรกิจและการบริหาร",
    "34": "ผู้ช่วยผู้ประกอบวิชาชีพด้านกฎหมาย สังคม และวัฒนธรรม",
    "35": "เทคนิคเชียนด้านสารสนเทศและการสื่อสาร",
    "41": "เสมียนทั่วไปและเสมียนพิมพ์เอกสาร",
    "42": "พนักงานบริการลูกค้า",
    "43": "เสมียนบันทึกตัวเลขและวัสดุ",
    "44": "พนักงานสนับสนุนงานสำนักงานอื่น ๆ",
    "51": "พนักงานบริการส่วนบุคคล",
    "52": "พนักงานขาย",
    "53": "พนักงานดูแลส่วนบุคคล",
    "54": "เจ้าหน้าที่คุ้มครองความปลอดภัย",
    "61": "ผู้ปฏิบัติงานเกษตรกรรมที่เน้นการผลิตเพื่อจำหน่าย",
    "62": "ผู้ปฏิบัติงานป่าไม้ ประมง และล่าสัตว์ที่เน้นการผลิตเพื่อจำหน่าย",
    "63": "เกษตรกรและผู้หาอาหารเพื่อยังชีพ",
    "71": "ช่างก่อสร้างและช่างในงานที่เกี่ยวข้อง",
    "72": "ช่างโลหะ ช่างเครื่องจักร และช่างงานที่เกี่ยวข้อง",
    "73": "ช่างหัตถกรรมและช่างพิมพ์",
    "74": "ช่างไฟฟ้าและช่างอิเล็กทรอนิกส์",
    "75": "ผู้ปฏิบัติงานแปรรูปอาหาร ไม้ เครื่องนุ่งห่ม และงานฝีมืออื่น ๆ",
    "81": "ผู้ควบคุมเครื่องจักรและโรงงานประจำที่",
    "82": "พนักงานประกอบชิ้นส่วน",
    "83": "ผู้ขับขี่ยานพาหนะและผู้ควบคุมเครื่องจักรเคลื่อนที่",
    "91": "พนักงานทำความสะอาดและผู้ช่วย",
    "92": "แรงงานด้านเกษตรกรรม ป่าไม้ และประมง",
    "93": "ผู้ใช้แรงงานในเหมืองแร่ ก่อสร้าง การผลิต และขนส่ง",
    "94": "ผู้ช่วยเตรียมอาหาร",
    "95": "พนักงานขายและให้บริการริมถนน",
    "96": "ผู้ใช้แรงงานเก็บขยะและงานพื้นฐานอื่น ๆ",
}


def download_csv(url: str, tries: int = 3) -> pd.DataFrame:
    last_error = None
    for attempt in range(1, tries + 1):
        try:
            response = requests.get(url, timeout=180)
            response.raise_for_status()
            return pd.read_csv(io.BytesIO(response.content), low_memory=False)
        except Exception as exc:
            last_error = exc
            print(f"Download attempt {attempt}/{tries} failed: {exc}")
            time.sleep(2)
    raise RuntimeError("Unable to download ILOSTAT CSV") from last_error


def fetch_source() -> pd.DataFrame:
    urls = [
        f"{BASE_URL}?id={INDICATOR_ID}&ref_area={'+'.join(TARGET_CODES)}&type=both&format=.csv",
        f"{BASE_URL}?id={INDICATOR_ID}&type=both&format=.csv",
    ]
    for url in urls:
        try:
            raw = download_csv(url)
        except Exception:
            continue
        if not all(col in raw.columns for col in REQUIRED_COLUMNS):
            continue
        filtered = raw[raw["ref_area"].isin(TARGET_CODES)].copy()
        if not filtered.empty:
            missing_countries = sorted(set(TARGET_CODES) - set(filtered["ref_area"].dropna()))
            if missing_countries:
                print(
                    "Response did not include all target countries ("
                    + ", ".join(missing_countries)
                    + "); trying the full-indicator download."
                )
                continue
            return filtered
    raise RuntimeError(
        "ILOSTAT did not return the required indicator data for Thailand"
    )


def records(frame: pd.DataFrame) -> list[dict]:
    clean = frame.replace({np.nan: None})
    return clean.to_dict(orient="records")


def main() -> None:
    fetched_at = datetime.now(timezone(timedelta(hours=7)))
    fetched_label = fetched_at.strftime("%d/%m/%Y %H:%M:%S (เวลาไทย)")
    df = fetch_source()
    raw_rows, raw_columns = len(df), len(df.columns)

    df["time"] = pd.to_numeric(df["time"], errors="coerce")
    df["obs_value"] = pd.to_numeric(df["obs_value"], errors="coerce")
    df_clean = df.dropna(subset=["obs_value", "time"]).copy()
    df_clean["time"] = df_clean["time"].astype(int)

    is_isco08 = df_clean["classif1.label"].astype(str).str.contains(
        "ISCO-08", case=False, na=False
    )
    df_isco08 = df_clean[is_isco08].copy()
    is_total_occupation = df_isco08["classif1.label"].astype(str).str.contains(
        r":\s*Total\s*$", case=False, na=False
    )
    df_isco08_total = df_isco08[is_total_occupation].copy()
    df_isco08_detail = df_isco08[~is_total_occupation].copy()

    countries_found = (
        df_isco08_detail[["ref_area", "ref_area.label"]]
        .drop_duplicates()
        .set_index("ref_area")["ref_area.label"]
        .to_dict()
    )
    if set(TARGET_CODES) - set(countries_found):
        raise RuntimeError("At least one target country has no ISCO-08 occupation detail")

    selected_countries = sorted(countries_found.values())
    year_sets = []
    for code in TARGET_CODES:
        country = countries_found[code]
        for sex in REQUIRED_SEXES:
            subset = df_isco08_detail[
                (df_isco08_detail["ref_area.label"] == country)
                & (df_isco08_detail["sex.label"] == sex)
            ]
            years = set(subset["time"].dropna().astype(int).unique())
            if not years:
                raise RuntimeError(f"No {sex} observations for {country}; refusing partial update")
            year_sets.append(years)
    selected_years = sorted(set.intersection(*year_sets))
    if not selected_years:
        raise RuntimeError("No shared Thailand years across all three sex categories")

    df_selected = df_isco08_detail[
        df_isco08_detail["ref_area.label"].isin(selected_countries)
        & df_isco08_detail["time"].isin(selected_years)
        & df_isco08_detail["sex.label"].isin(REQUIRED_SEXES)
    ].copy()

    # Match Notebook cell 21 exactly: keep only numeric 2-digit ISCO-08 groups.
    has_code = df_selected["classif1.label"].astype(str).str.contains(
        r"level:\\s*\\d{2}\\s*-", regex=True, na=False
    )
    df_selected_codes = df_selected[has_code].copy()
    if df_selected_codes.empty:
        raise RuntimeError("No numeric 2-digit ISCO-08 occupation groups were found")

    # One occupation classification must have one row per country/year/sex.
    occupation_coverage = (
        df_selected_codes[["classif1", "ref_area", "time", "sex"]]
        .drop_duplicates()
        .groupby("classif1").size()
    )
    expected_combinations = len(TARGET_CODES) * len(selected_years) * len(REQUIRED_SEXES)
    common_codes = occupation_coverage[occupation_coverage == expected_combinations].index.tolist()
    if not common_codes:
        raise RuntimeError("No Thailand occupation groups meet the complete year/sex coverage rule")

    df_comparable = df_selected_codes[df_selected_codes["classif1"].isin(common_codes)].copy()
    key = ["ref_area", "time", "sex", "classif1"]
    if df_comparable.duplicated(key).any():
        dup_count = int(df_comparable.duplicated(key).sum())
        raise RuntimeError(f"Found {dup_count} duplicate country/year/sex/occupation records")

    parts = df_comparable["classif1.label"].astype(str).str.extract(
        r"level:\s*(\d{2})\s*-\s*(.+?)\s*$"
    )
    df_comparable["occupation_code"] = parts[0]
    df_comparable["occupation_name"] = parts[1].str.strip()
    if df_comparable[["occupation_code", "occupation_name"]].isna().any().any():
        raise RuntimeError("Could not parse one or more ISCO-08 occupation labels")
    df_comparable["occupation_name_th"] = (
        df_comparable["occupation_code"].map(OCCUPATION_THAI)
        .fillna(df_comparable["occupation_name"])
    )

    occupation_reference = (
        df_comparable[["occupation_code", "occupation_name", "occupation_name_th"]]
        .drop_duplicates()
        .sort_values("occupation_code")
    )
    if occupation_reference["occupation_code"].duplicated().any():
        raise RuntimeError("An ISCO code maps to multiple occupation labels")

    employment_total_ref = (
        df_isco08_total[
            ["ref_area.label", "time", "sex.label", "obs_value"]
        ]
        .rename(columns={"obs_value": "employment_total"})
        .drop_duplicates(["ref_area.label", "time", "sex.label"])
    )
    df_comparable = df_comparable.merge(
        employment_total_ref,
        on=["ref_area.label", "time", "sex.label"],
        how="left",
    )
    covered_sum = df_comparable.groupby(
        ["ref_area.label", "time", "sex.label"]
    )["obs_value"].transform("sum")
    missing_total = df_comparable["employment_total"].isna()
    if missing_total.any():
        df_comparable.loc[missing_total, "employment_total"] = covered_sum[missing_total]
    if (df_comparable["employment_total"] <= 0).any():
        raise RuntimeError("Invalid or non-positive employment_total denominator")
    df_comparable["coverage_pct"] = (
        covered_sum / df_comparable["employment_total"] * 100
    )
    df_comparable["occupation_share"] = (
        df_comparable["obs_value"] / df_comparable["employment_total"] * 100
    )

    df_total = df_comparable[df_comparable["sex.label"] == "Total"].copy()
    if df_total.empty:
        raise RuntimeError("No Total-sex observations in comparable data")

    # Preserve the existing website schema and legacy sex labels.
    sex_legacy = {"Total": "Sex: Total", "Male": "Sex: Male", "Female": "Sex: Female"}
    common_data = []
    for _, row in df_comparable.iterrows():
        common_data.append({
            "country": row["ref_area.label"],
            "year": int(row["time"]),
            "sex": sex_legacy.get(row["sex.label"], row["sex.label"]),
            "code": row["occupation_code"],
            "nameEn": row["occupation_name"],
            "nameTh": row["occupation_name_th"],
            "value": float(row["obs_value"]),
            "total": float(row["employment_total"]),
            "share": float(row["occupation_share"]),
            "coverage": float(row["coverage_pct"]),
        })

    country_order = [c for c in COUNTRY_ORDER if c in selected_countries]
    heatmap_source = (
        df_total.groupby(
            ["occupation_code", "occupation_name_th", "ref_area.label"],
            as_index=False
        )["occupation_share"].mean()
    )
    heatmap_pivot = heatmap_source.pivot(
        index=["occupation_code", "occupation_name_th"],
        columns="ref_area.label",
        values="occupation_share",
    ).reindex(columns=country_order).dropna(axis=0, how="any")
    if "Thailand" in heatmap_pivot.columns:
        heatmap_pivot = heatmap_pivot.sort_values("Thailand", ascending=False)
    heatmap = [
        {
            "code": str(code),
            "nameTh": name_th,
            "values": [float(row[c]) for c in country_order],
        }
        for (code, name_th), row in heatmap_pivot.iterrows()
    ]

    # Gender Gap mirrors Notebook cell 48: Thailand, common occupations,
    # average of annual within-sex employment shares across shared years.
    gender_source = df_comparable[
        (df_comparable["ref_area.label"] == "Thailand")
        & df_comparable["sex.label"].isin(["Female", "Male"])
    ]
    gender_avg = (
        gender_source.groupby(
            ["occupation_code", "occupation_name_th", "sex.label"],
            as_index=False
        )["occupation_share"].mean()
    )
    gender_pivot = gender_avg.pivot(
        index=["occupation_code", "occupation_name_th"],
        columns="sex.label",
        values="occupation_share",
    ).dropna(subset=["Female", "Male"])
    gender_gap = [
        {
            "code": str(code),
            "nameTh": name_th,
            "female": float(row["Female"]),
            "male": float(row["Male"]),
            "difference": float(row["Female"] - row["Male"]),
        }
        for (code, name_th), row in gender_pivot.iterrows()
    ]

    # Thailand Deep Dive mirrors Notebook cell 21: all reported Thai
    # ISCO-08 occupation groups from the first shared year onward.
    thai_all = df_isco08_detail[
        (df_isco08_detail["ref_area.label"] == "Thailand")
        & (df_isco08_detail["sex.label"] == "Total")
        & (df_isco08_detail["time"] >= min(selected_years))
    ].copy()
    thai_parts = thai_all["classif1.label"].astype(str).str.extract(
        r"level:\s*(\d{2})\s*-\s*(.+?)\s*$"
    )
    thai_all["occupation_code"] = thai_parts[0]
    thai_all["occupation_name"] = thai_parts[1].str.strip()
    thai_all = thai_all.dropna(subset=["occupation_code"]).copy()
    thai_all["occupation_name_th"] = (
        thai_all["occupation_code"].map(OCCUPATION_THAI)
        .fillna(thai_all["occupation_name"])
    )
    thai_total_ref = employment_total_ref[
        (employment_total_ref["ref_area.label"] == "Thailand")
        & (employment_total_ref["sex.label"] == "Total")
    ][["ref_area.label", "time", "employment_total"]]
    thai_all = thai_all.merge(
        thai_total_ref, on=["ref_area.label", "time"], how="left"
    ).dropna(subset=["employment_total"])
    thai_all["share"] = thai_all["obs_value"] / thai_all["employment_total"] * 100
    thai_all = thai_all.sort_values(["occupation_code", "time"])
    if thai_all.empty:
        raise RuntimeError("No Thailand deep-dive observations available")
    thai_data = [
        {
            "year": int(row.time),
            "code": str(row.occupation_code),
            "nameEn": row.occupation_name,
            "nameTh": row.occupation_name_th,
            "value": float(row.obs_value),
            "total": float(row.employment_total),
            "share": float(row.share),
        }
        for row in thai_all.itertuples(index=False)
    ]

    # Backtest mirrors Notebook cell 46: linear trend versus last-value Naive,
    # training on the shared-year window, testing on later Thai observations.
    train_start, train_end = min(selected_years), min(max(selected_years), 2023)
    train = thai_all[thai_all["time"].between(train_start, train_end)].copy()
    test = thai_all[thai_all["time"] > train_end].copy()
    bt_rows = []
    if not test.empty:
        for code, group in train.groupby("occupation_code"):
            group = group.sort_values("time")
            if group["time"].nunique() < 8:
                continue
            slope, intercept = np.polyfit(
                group["time"].astype(float), group["share"].astype(float), 1
            )
            last_value = float(group["share"].iloc[-1])
            actual_test = test[test["occupation_code"] == code]
            for row in actual_test.itertuples(index=False):
                trend = float(slope * float(row.time) + intercept)
                actual = float(row.share)
                bt_rows.append({
                    "code": str(code),
                    "nameTh": row.occupation_name_th,
                    "year": int(row.time),
                    "actual": actual,
                    "trend": trend,
                    "naive": last_value,
                    "trendError": abs(trend - actual),
                    "naiveError": abs(last_value - actual),
                })
    bt = pd.DataFrame(bt_rows)
    backtest_summary = []
    backtest_worst = []
    better_pct = None
    testing_years = []
    if not bt.empty:
        for year, group in bt.groupby("year"):
            backtest_summary.append({
                "year": int(year),
                "trendMAE": float(group["trendError"].mean()),
                "naiveMAE": float(group["naiveError"].mean()),
                "count": int(len(group)),
            })
        testing_years = sorted(int(y) for y in bt["year"].unique())
        better_pct = float((bt["trendError"] < bt["naiveError"]).mean() * 100)
        worst_rows = (
            bt.sort_values("trendError", ascending=False)
            .head(5)[["code", "nameTh", "year", "actual", "trend", "naive", "trendError"]]
            .to_dict(orient="records")
        )
        backtest_worst = [
            {
                "code": str(row["code"]),
                "nameTh": str(row["nameTh"]),
                "year": int(row["year"]),
                "actual": float(row["actual"]),
                "trend": float(row["trend"]),
                "naive": float(row["naive"]),
                "trendError": float(row["trendError"]),
            }
            for row in worst_rows
        ]

    latest_shared_year = max(selected_years)
    coverage = (
        df_total[df_total["time"] == latest_shared_year]
        .drop_duplicates("ref_area.label")
        .set_index("ref_area.label")["coverage_pct"]
        .to_dict()
    )
    sources_by_country = {}
    if "source.label" in df.columns:
        for country, group in df.groupby("ref_area.label"):
            sources_by_country[country] = sorted(
                str(x) for x in group["source.label"].dropna().unique()
            )
    japan_notes = []
    if "note_classif.label" in df_selected.columns:
        japan_notes = sorted(
            str(x) for x in df_selected.loc[
                df_selected["ref_area.label"] == "Japan", "note_classif.label"
            ].dropna().unique()
        )

    meta = {
        "dataset": INDICATOR_ID,
        "datasetName": "Employment by sex and occupation - ISCO level 2 (thousands)",
        "source": "ILOSTAT · International Labour Organization",
        "fetchedAt": fetched_label,
        "updatedAt": fetched_at.isoformat(),
        "rawRows": int(raw_rows),
        "rawColumns": int(raw_columns),
        "missingObsValue": int(df["obs_value"].isna().sum()),
        "cleanRows": int(len(df_clean)),
        "iscoRows": int(len(df_isco08)),
        "countries": selected_countries,
        "countryLabels": COUNTRY_LABELS,
        "countryOrder": country_order,
        "sourcesByCountry": sources_by_country,
        "sharedYears": [int(y) for y in selected_years],
        "occupationCount": int(len(common_codes)),
        "commonRows": int(len(common_data)),
        "occupationReference": [
            {
                "code": str(row.occupation_code),
                "nameEn": row.occupation_name,
                "nameTh": row.occupation_name_th,
            }
            for row in occupation_reference.itertuples(index=False)
        ],
        "coverageByCountry": {k: float(v) for k, v in coverage.items()},
        "thaiRows": int(len(thai_data)),
        "thaiOccupationCount": int(thai_all["occupation_code"].nunique()),
        "thaiYears": [int(thai_all["time"].min()), int(thai_all["time"].max())],
        "japanNotes": japan_notes,
        "trainingYears": [int(train_start), int(train_end)],
        "testingYears": testing_years,
        "backtestTrendBetterPct": better_pct,
        "backtestSummary": backtest_summary,
        "backtestWorst": backtest_worst,
    }

    payload = {
        "meta": meta,
        "commonData": common_data,
        "heatmap": heatmap,
        "heatmapCountries": country_order,
        "genderGap": gender_gap,
        "thaiData": thai_data,
    }

    # Validate key invariants before replacing the published snapshot.
    expected_rows = len(TARGET_CODES) * len(selected_years) * len(REQUIRED_SEXES) * len(common_codes)
    if len(common_data) != expected_rows:
        raise RuntimeError(
            f"Common data row-count mismatch: expected {expected_rows}, got {len(common_data)}"
        )
    if len(country_order) != 1 or country_order[0] != "Thailand":
        raise RuntimeError("Thailand-only country scope is incomplete; snapshot was not replaced")
    if not heatmap or not gender_gap:
        raise RuntimeError("One or more chart datasets are empty; snapshot was not replaced")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    temp_output = OUTPUT.with_suffix(".json.tmp")
    temp_output.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":"), allow_nan=False),
        encoding="utf-8",
    )
    temp_output.replace(OUTPUT)
    print(
        f"Updated {OUTPUT}: {len(common_data):,} comparable rows, "
        f"{len(heatmap)} heatmap occupations, {len(thai_data):,} Thailand rows; "
        f"Thailand years {min(selected_years)}–{max(selected_years)}; fetched {fetched_label}"
    )


if __name__ == "__main__":
    main()
