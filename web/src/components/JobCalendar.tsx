"use client";

import { useState } from "react";
import type { JobItem } from "@/lib/api";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthLabel(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1)).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function JobCalendar({
  items,
  selectedDate,
  onSelectDate,
}: {
  items: JobItem[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}) {
  const today = toKey(new Date());
  const initial = selectedDate
    ? new Date(`${selectedDate}T12:00:00Z`)
    : new Date();
  const [cursor, setCursor] = useState({
    year: initial.getUTCFullYear(),
    month: initial.getUTCMonth(),
  });

  const first = new Date(Date.UTC(cursor.year, cursor.month, 1));
  const startWeekday = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(
    Date.UTC(cursor.year, cursor.month + 1, 0),
  ).getUTCDate();

  const jobsByDay = new Map<string, JobItem[]>();
  for (const item of items) {
    if (!item.dueDate) continue;
    const key = toKey(item.dueDate);
    const list = jobsByDay.get(key) ?? [];
    list.push(item);
    jobsByDay.set(key, list);
  }

  const cells: Array<{ day: number; key: string } | null> = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ day, key });
  }

  const selectedJobs = selectedDate ? (jobsByDay.get(selectedDate) ?? []) : [];

  return (
    <section className="panel calendar">
      <div className="calendar-head">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() =>
            setCursor((c) =>
              c.month === 0
                ? { year: c.year - 1, month: 11 }
                : { year: c.year, month: c.month - 1 },
            )
          }
        >
          <span>‹</span>
        </button>
        <h2 className="font-display text-2xl font-bold text-yellow">
          {monthLabel(cursor.year, cursor.month)}
        </h2>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() =>
            setCursor((c) =>
              c.month === 11
                ? { year: c.year + 1, month: 0 }
                : { year: c.year, month: c.month + 1 },
            )
          }
        >
          <span>›</span>
        </button>
      </div>

      <div className="calendar-grid calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((cell, index) => {
          if (!cell) return <div key={`empty-${index}`} />;
          const jobs = jobsByDay.get(cell.key) ?? [];
          const isToday = cell.key === today;
          const isSelected = cell.key === selectedDate;
          const topPriority = jobs.reduce(
            (min, job) => Math.min(min, job.priority ?? 3),
            3,
          );
          return (
            <button
              key={cell.key}
              type="button"
              className={`calendar-day ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""} ${jobs.length ? `has-jobs prio-${topPriority}` : ""}`}
              onClick={() => onSelectDate(isSelected ? null : cell.key)}
            >
              <span className="calendar-day-num">{cell.day}</span>
              {jobs.length > 0 && (
                <span className="calendar-dots">
                  {jobs.slice(0, 3).map((job) => (
                    <i
                      key={job.id}
                      className={`dot prio-${job.priority ?? 3}`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="calendar-hint">
        {selectedDate
          ? selectedJobs.length
            ? `${selectedJobs.length} job${selectedJobs.length === 1 ? "" : "s"} on ${selectedDate}`
            : `No jobs on ${selectedDate} — set a date next to a job`
          : "Click a day to see jobs due then. Set a date next to each job."}
      </p>
    </section>
  );
}
