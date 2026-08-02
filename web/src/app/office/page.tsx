"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { JobList } from "@/components/JobList";
import { SiteShell } from "@/components/SiteShell";
import { api } from "@/lib/api";

export default function OfficePage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.me().then((me) => {
      if (me.office) setAllowed(true);
    });
  }, []);

  if (!allowed) {
    return (
      <SiteShell title="Office">
        <form
          className="panel max-w-md space-y-4 p-6"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const result = await api.login(password);
              if (!result.office) {
                setError("That password opens the site, not the office.");
                return;
              }
              setAllowed(true);
            } catch {
              setError("Incorrect office password.");
            }
          }}
        >
          <p className="text-white/70">Enter the office password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-white/15 bg-black/40 px-4 py-3 outline-none focus:border-yellow"
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary">
              <span>Unlock</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => router.push("/")}
            >
              <span>Back</span>
            </button>
          </div>
        </form>
      </SiteShell>
    );
  }

  return (
    <SiteShell title="Office">
      <JobList kind="desk" />
    </SiteShell>
  );
}
