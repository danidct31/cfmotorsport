"use client";

import { useEffect, useState } from "react";
import { api, type JobItem } from "@/lib/api";

export function NoteList({ parentId, title }: { parentId: string; title: string }) {
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

  return (
    <div className="animate-rise space-y-6">
      <p className="text-lg text-white/80">
        Job: <span className="cf-mark font-display font-bold">{title}</span>
      </p>

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
          <div key={item.id} className="job-row">
            <p className="text-left font-semibold whitespace-pre-wrap">{item.text}</p>
            <input
              type="checkbox"
              className="check"
              checked={item.checked}
              onChange={async (e) => {
                const checked = e.target.checked;
                setItems((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, checked } : x)),
                );
                await api.updateNote(item.id, { checked });
              }}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={async () => {
                await api.deleteNote(item.id);
                setItems((prev) => prev.filter((x) => x.id !== item.id));
              }}
            >
              <span>Delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
