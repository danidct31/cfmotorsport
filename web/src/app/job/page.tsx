"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { NoteList } from "@/components/NoteList";
import { SiteShell } from "@/components/SiteShell";

function JobDetailInner() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const text = params.get("text") ?? "Job";

  if (!id) {
    return <p className="text-mute">Missing job id.</p>;
  }

  return <NoteList parentId={id} title={text} />;
}

export default function JobDetailPage() {
  return (
    <SiteShell title="Primary job">
      <Suspense fallback={<p className="text-mute">Loading…</p>}>
        <JobDetailInner />
      </Suspense>
    </SiteShell>
  );
}
