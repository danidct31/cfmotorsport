"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { JobCalendar } from "@/components/JobCalendar";
import { PrintJobsControl } from "@/components/JobPrintSheet";
import { TrashIcon } from "@/components/TrashIcon";
import { api, type JobItem } from "@/lib/api";

function dueKey(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function JobList({
  kind,
  detailBase,
  showPlanner = false,
  showPriority = false,
}: {
  kind: "primary" | "weekly" | "todo" | "desk";
  detailBase?: string;
  showPlanner?: boolean;
  showPriority?: boolean;
}) {
  const [items, setItems] = useState<JobItem[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const usePriority = showPlanner || showPriority;

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

  const visible = useMemo(() => {
    if (!selectedDate) return items;
    return items.filter((item) => dueKey(item.dueDate) === selectedDate);
  }, [items, selectedDate]);

  async function patch(id: string, data: Partial<JobItem> & { dueDate?: string | null; priority?: number; checked?: boolean }) {
    setItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, ...data } : x))
        .sort((a, b) => (a.priority ?? 3) - (b.priority ?? 3)),
    );
    const updated = await api.updateJob(id, data);
    setItems((prev) => {
      const next = prev.map((x) => (x.id === id ? updated : x));
      return [...next].sort((a, b) => (a.priority ?? 3) - (b.priority ?? 3));
    });
  }

  async function addItem() {
    if (!text.trim()) return;
    try {
      const created = await api.createJob(kind, text.trim());
      setItems((prev) => [...prev, created].sort((a, b) => (a.priority ?? 3) - (b.priority ?? 3)));
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add");
    }
  }

  return (
    <div className="animate-rise space-y-6">
      <div className="no-print space-y-6">
      {showPlanner && (
        <JobCalendar
          items={items}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

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

      {selectedDate && showPlanner && (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setSelectedDate(null)}
        >
          <span>Show all jobs</span>
        </button>
      )}

      {error && <p className="text-sm text-red-300">{error}</p>}
      {loading && <p className="text-mute">Loading…</p>}

      <div className="space-y-3">
        {visible.map((item) => (
          <div
            key={item.id}
            className={`job-row ${item.checked ? "is-checked" : ""} ${dueKey(item.dueDate) === selectedDate ? "is-due" : ""}`}
          >
            {detailBase ? (
              <Link
                href={`${detailBase}?id=${item.id}&text=${encodeURIComponent(item.text)}`}
                className="btn btn-primary job-title"
              >
                <span className="line-clamp-2">{item.text}</span>
              </Link>
            ) : (
              <span className="btn btn-primary job-title">
                <span className="line-clamp-2">{item.text}</span>
              </span>
            )}

            {showPlanner && (
              <input
                type="date"
                className="date-input job-date"
                value={dueKey(item.dueDate)}
                onChange={(e) =>
                  void patch(item.id, {
                    dueDate: e.target.value || null,
                  })
                }
                aria-label={`Date for ${item.text}`}
              />
            )}

            <div className="job-actions">
              {usePriority && (
                <div className="priority-group" role="group" aria-label="Priority">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`priority-btn prio-${level} ${(item.priority ?? 3) === level ? "is-active" : ""}`}
                      onClick={() => void patch(item.id, { priority: level })}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}

              <input
                type="checkbox"
                className="check"
                checked={item.checked}
                onChange={(e) => void patch(item.id, { checked: e.target.checked })}
              />
              <button
                type="button"
                className="btn-trash"
                aria-label={`Delete ${item.text}`}
                onClick={async () => {
                  await api.deleteJob(item.id);
                  setItems((prev) => prev.filter((x) => x.id !== item.id));
                }}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
        {!loading && visible.length === 0 && (
          <p className="text-mute">
            {selectedDate
              ? "No jobs on this date."
              : "No jobs yet — add the first one."}
          </p>
        )}
      </div>
      </div>
      <PrintJobsControl jobs={visible} fetchNotes />
    </div>
  );
}
