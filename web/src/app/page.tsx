"use client";

import { SiteShell } from "@/components/SiteShell";
import { api } from "@/lib/api";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="animate-rise mx-auto max-w-2xl py-10 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-yellow/80">
          Workshop hub
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">
          <span className="cf-mark">CF Motorsport</span>
        </h1>
      </section>

      <section className="panel animate-rise mx-auto mt-8 max-w-2xl p-6 text-left md:p-8">
        <h2 className="font-display text-2xl font-bold text-yellow">Contact</h2>
        <div className="mt-4 space-y-4 text-white/75">
          <p>
            <span className="text-white">Phone</span>
            <br />
            07792 875178
          </p>
          <p>
            <span className="text-white">Email</span>
            <br />
            info@cfmotorsport.co.uk
          </p>
          <p>
            <span className="text-white">Address</span>
            <br />
            CF Motorsport
            <br />
            Unit A1, Salcombe Road, Meadow Lane Industrial Estate,
            <br />
            Alfreton, DE55 7RG
          </p>
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-2xl">
        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={() => void api.downloadBackup()}
        >
          <span>Download backup</span>
        </button>
      </div>
    </SiteShell>
  );
}
