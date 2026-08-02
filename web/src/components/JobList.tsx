"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type JobItem } from "@/lib/api";

export function JobList({
  kind,
  detailBase,
}: {
  kind: "primary" | "weekly" | "todo" | "desk";
  detailBase?: string;
}) {
  const [items, setItems] = useState<JobItem[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      setItems(await api.listJobs(kind));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [kind]);

  async function addItem() {
    if (!text.trim()) return;
    try {
      const created = await api.createJob(kind, text.trim());
      setItems((prev) => [created, ...prev]);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add");
    }
  }

  return (
    <div className="animate-rise space-y-6">
      <div className="panel flex flex-col gap-3 p-4 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void addItem()}
          placeholder="Enter job text"
          className="min-w-0 flex-1 border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow"
        />
        <button type="button" className="btn btn-primary" onClick={() => void addItem()}>
          <span>Add</span>
        </button>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}
      {loading && <p className="text-mute">Loading…</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="job-row">
            {detailBase ? (
              <Link
                href={`${detailBase}?id=${item.id}&text=${encodeURIComponent(item.text)}`}
                className="btn btn-primary justify-self-stretch text-left"
              >
                <span className="line-clamp-2">{item.text}</span>
              </Link>
            ) : (
              <p className="text-left font-semibold">{item.text}</p>
            )}
            <input
              type="checkbox"
              className="check"
              checked={item.checked}
              onChange={async (e) => {
                const checked = e.target.checked;
                setItems((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, checked } : x)),
                );
                await api.updateJob(item.id, { checked });
              }}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={async () => {
                await api.deleteJob(item.id);
                setItems((prev) => prev.filter((x) => x.id !== item.id));
              }}
            >
              <span>Delete</span>
            </button>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-mute">No jobs yet — add the first one.</p>
        )}
      </div>
    </div>
  );
}
