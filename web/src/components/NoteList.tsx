"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PrintJobsControl } from "@/components/JobPrintSheet";
import { TrashIcon } from "@/components/TrashIcon";
import { api, type JobItem } from "@/lib/api";

export function NoteList({
  parentId,
  title,
  backHref,
}: {
  parentId: string;
  title: string;
  backHref: string;
}) {
  const [items, setItems] = useState<JobItem[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listNotes(parentId)
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [parentId]);

  async function addItem() {
    if (!text.trim()) return;
    const created = await api.createNote(parentId, text.trim());
    setItems((prev) => [created, ...prev]);
    setText("");
  }

  async function patch(id: string, data: { checked: boolean }) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...data } : x)));
    await api.updateNote(id, data);
  }

  return (
    <div className="animate-rise space-y-6">
      <div className="no-print space-y-6">
      <div className="flex items-center gap-3">
        <Link href={backHref} className="back-arrow" aria-label="Back">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <p className="text-lg text-white/80">
          Job: <span className="cf-mark font-display font-bold">{title}</span>
        </p>
      </div>

      <div className="panel flex flex-col gap-3 p-4 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void addItem()}
          placeholder="Add a task for this job"
          className="min-w-0 flex-1 border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow"
        />
        <button type="button" className="btn btn-primary" onClick={() => void addItem()}>
          <span>Add</span>
        </button>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className={`job-row ${item.checked ? "is-checked" : ""}`}>
            <span className="btn btn-primary job-title">
              <span className="line-clamp-2">{item.text}</span>
            </span>

            <div className="job-actions">
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
                  await api.deleteNote(item.id);
                  setItems((prev) => prev.filter((x) => x.id !== item.id));
                }}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
      <PrintJobsControl
        jobs={[
          {
            id: parentId,
            text: title,
            checked: false,
            notes: items,
          },
        ]}
      />
    </div>
  );
}
