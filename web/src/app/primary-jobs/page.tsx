"use client";

import { JobList } from "@/components/JobList";
import { SiteShell } from "@/components/SiteShell";

export default function PrimaryJobsPage() {
  return (
    <SiteShell title="Primary Jobs">
      <JobList kind="primary" detailBase="/job" showPlanner />
    </SiteShell>
  );
}
