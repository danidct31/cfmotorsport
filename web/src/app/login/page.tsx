"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.login(password.trim());
      router.replace("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (
        message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        message.includes("fetch")
      ) {
        const local =
          typeof window !== "undefined" &&
          window.location.hostname === "localhost";
        setError(
          local
            ? "Cannot reach the API. In a second terminal run: cd api → npm run start"
            : "Cannot reach the API. On Railway, set web variable NEXT_PUBLIC_API_URL to https://YOUR-API-DOMAIN/api and redeploy web.",
        );
      } else if (message.includes("401") || message.includes("Incorrect")) {
        setError("Incorrect password. Access denied.");
      } else {
        setError(message || "Incorrect password. Access denied.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <div className="grid min-h-[80svh] place-items-center">
        <form
          onSubmit={onSubmit}
          className="panel animate-rise w-full max-w-md space-y-5 p-8"
        >
          <h1 className="font-display text-3xl font-bold">
            <span className="cf-mark">CF Motorsport</span>
          </h1>
          <p className="text-sm text-white/65">Enter password to access</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow"
            placeholder="Password"
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            <span>{loading ? "Checking…" : "Enter"}</span>
          </button>
        </form>
      </div>
    </SiteShell>
  );
}
