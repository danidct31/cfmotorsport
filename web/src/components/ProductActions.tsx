"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

export function ProductActions({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-10 space-y-6">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-mute">
          Size
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`min-w-12 border px-3 py-2 text-sm transition ${
                size === s
                  ? "border-ink bg-ink text-paper"
                  : "border-line hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1800);
        }}
        className="w-full bg-ink px-6 py-4 text-sm font-semibold tracking-wide text-paper transition hover:bg-acid hover:text-acid-ink md:w-auto md:min-w-64"
      >
        {added ? "Added to bag" : "Add to bag"}
      </button>
    </div>
  );
}
