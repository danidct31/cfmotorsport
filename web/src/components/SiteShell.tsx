"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const links = [
  { href: "/", label: "Home" },
  { href: "/primary-jobs", label: "Primary Jobs" },
  { href: "/weekly-jobs", label: "Weekly Jobs" },
  { href: "/jobs-to-be-done", label: "Jobs to be done" },
  { href: "/office", label: "Office" },
];

export function SiteShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(pathname === "/login");

  useEffect(() => {
    if (pathname === "/login") {
      setReady(true);
      return;
    }
    api
      .me()
      .then((me) => {
        if (!me.authenticated) router.replace("/login");
        else setReady(true);
      })
      .catch(() => router.replace("/login"));
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="shell grid min-h-svh place-items-center">
        <div className="shell-bg" />
        <p className="cf-mark font-display text-3xl font-bold">CF</p>
      </div>
    );
  }

  if (pathname === "/login") {
    return (
      <div className="shell">
        <div className="shell-bg" />
        {children}
      </div>
    );
  }

  return (
    <div className="shell">
      <div className="shell-bg no-print" />
      <header className="no-print mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <Link href="/" className="relative block h-14 w-40 md:h-16 md:w-52">
          <Image
            src="/cf-logo.svg"
            alt="CF Motorsport"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpen((v) => !v)}
        >
          <span>Menu</span>
        </button>
      </header>

      {open && (
        <div className="no-print fixed inset-0 z-40 bg-black/70" onClick={() => setOpen(false)}>
          <nav
            className="panel absolute left-1/2 top-28 w-[min(92vw,22rem)] -translate-x-1/2 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`btn w-full ${
                      pathname === link.href ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  onClick={async () => {
                    await api.downloadBackup();
                    setOpen(false);
                  }}
                >
                  <span>Download backup</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="btn btn-danger w-full"
                  onClick={async () => {
                    await api.logout();
                    router.replace("/login");
                  }}
                >
                  <span>Log out</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-5 pb-16">
        {title && (
          <h1 className="animate-rise mb-8 font-display text-4xl font-bold tracking-tight md:text-5xl">
            <span className="cf-mark">{title}</span>
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
