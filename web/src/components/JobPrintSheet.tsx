"use client";

import { useEffect, useState } from "react";
import { api, type JobItem } from "@/lib/api";

export type PrintableJob = JobItem & { notes: JobItem[] };

function dueKey(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function formatPrintDate(value?: string | null) {
  const key = dueKey(value);
  if (!key) return "";
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return key;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function JobPrintSheet({ jobs }: { jobs: PrintableJob[] }) {
  if (jobs.length === 0) return null;

  return (
    <div className="print-sheet">
      {jobs.map((job) => (
        <section key={job.id} className="print-job">
          <div className="print-job-head">
            <p className="print-job-title">{job.text}</p>
            <p className="print-job-date">{formatPrintDate(job.dueDate) || "—"}</p>
            <div className="print-hours">
              <span className="print-hours-label">Hours</span>
              <span className="print-hours-box" />
            </div>
          </div>
          {job.notes.length > 0 ? (
            <ul className="print-subs">
              {job.notes.map((note) => (
                <li key={note.id}>{note.text}</li>
              ))}
            </ul>
          ) : (
            <p className="print-subs-empty">No sub-jobs</p>
          )}
        </section>
      ))}
    </div>
  );
}

export function PrintJobsControl({
  jobs,
  fetchNotes = false,
}: {
  jobs: PrintableJob[] | JobItem[];
  fetchNotes?: boolean;
}) {
  const [printing, setPrinting] = useState(false);
  const [sheet, setSheet] = useState<PrintableJob[]>([]);
  const [printNonce, setPrintNonce] = useState(0);

  useEffect(() => {
    if (printNonce === 0) return;
    window.print();
    setPrinting(false);
  }, [printNonce]);

  async function onPrint() {
    if (jobs.length === 0 || printing) return;
    setPrinting(true);
    try {
      const prepared: PrintableJob[] = fetchNotes
        ? await Promise.all(
            jobs.map(async (job) => {
              try {
                return { ...job, notes: await api.listNotes(job.id) };
              } catch {
                return { ...job, notes: [] };
              }
            }),
          )
        : jobs.map((job) => ({
            ...job,
            notes: "notes" in job && Array.isArray(job.notes) ? job.notes : [],
          }));
      setSheet(prepared);
      setPrintNonce((n) => n + 1);
    } catch {
      setPrinting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary no-print"
        onClick={() => void onPrint()}
        disabled={jobs.length === 0 || printing}
      >
        <span>{printing ? "Preparing print…" : "Print jobs"}</span>
      </button>
      <JobPrintSheet jobs={sheet} />
    </>
  );
}
