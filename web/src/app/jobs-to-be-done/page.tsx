"use client";

import { JobList } from "@/components/JobList";
import { SiteShell } from "@/components/SiteShell";

export default function JobsToBeDonePage() {
  return (
    <SiteShell title="Jobs to be done">
      <JobList kind="todo" detailBase="/todo-job" />
    </SiteShell>
  );
}
