"use client";

import { JobList } from "@/components/JobList";
import { SiteShell } from "@/components/SiteShell";

export default function WeeklyJobsPage() {
  return (
    <SiteShell title="Weekly Jobs">
      <JobList kind="weekly" showPlanner />
    </SiteShell>
  );
}
