"""One-off import from the old PythonAnywhere SQLite DB into the local Nest API."""
from __future__ import annotations

import sqlite3
import sys
import urllib.error
import urllib.request
import json

API = "http://127.0.0.1:4000/api"
DB = r"C:\Users\Admin\Downloads\cfmotorsport\cfmotorsport.db"


def req(method: str, path: str, body: dict | None = None):
    data = None if body is None else json.dumps(body).encode("utf-8")
    request = urllib.request.Request(
        f"{API}{path}",
        data=data,
        method=method,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=30) as res:
        raw = res.read().decode("utf-8")
        return json.loads(raw) if raw else None


def import_list(kind: str, rows: list[tuple]):
    mapping: dict[str, str] = {}
    for old_id, text, checked in rows:
        text = (text or "").strip()
        if not text:
            continue
        created = req("POST", f"/jobs/{kind}", {"text": text})
        new_id = created["id"]
        mapping[str(old_id)] = new_id
        if checked:
            req("PATCH", f"/jobs/item/{new_id}", {"checked": True})
    print(f"{kind}: imported {len(mapping)}")
    return mapping


def import_notes(mapping: dict[str, str], rows: list[tuple]):
    count = 0
    skipped = 0
    for _old_id, parent_old, text, checked in rows:
        parent = mapping.get(str(parent_old))
        if not parent:
            skipped += 1
            continue
        text = (text or "").strip()
        if not text:
            continue
        created = req("POST", f"/notes/{parent}", {"text": text})
        if checked:
            req("PATCH", f"/notes/item/{created['id']}", {"checked": True})
        count += 1
        if count % 100 == 0:
            print(f"  notes progress: {count}")
    print(f"notes: imported {count}, skipped {skipped}")


def main():
    try:
        req("GET", "/health")
    except Exception as e:
        print("API not reachable at", API, e)
        sys.exit(1)

    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    primary = import_list(
        "primary",
        cur.execute("SELECT id, text, checked FROM buttons").fetchall(),
    )
    import_list(
        "weekly",
        cur.execute("SELECT id, text, checked FROM weekly_jobs").fetchall(),
    )
    todos = import_list(
        "todo",
        cur.execute("SELECT id, text, checked FROM jobs_to_be_done").fetchall(),
    )
    import_list(
        "desk",
        cur.execute(
            "SELECT id, buttonText, isChecked FROM desk_content"
        ).fetchall(),
    )

    import_notes(
        primary,
        cur.execute(
            "SELECT id, jobId, buttonText, isChecked FROM job_buttons"
        ).fetchall(),
    )
    import_notes(
        todos,
        cur.execute(
            "SELECT id, mystId, buttonText, isChecked FROM pj_jobstobedone"
        ).fetchall(),
    )

    print("Done.")


if __name__ == "__main__":
    main()
