import Link from "next/link";
import { AtlasPlanet } from "@/components/AtlasPlanet";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteHeader } from "@/components/SiteHeader";
import { getFeaturedProducts } from "@/lib/api";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <SiteHeader transparent />
      <Hero />
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-mute">
              Featured
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              The edit
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm tracking-wide underline decoration-line underline-offset-4 transition hover:decoration-ink"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="relative overflow-hidden bg-ink px-5 py-24 text-paper md:px-8 md:py-32">
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-yellow-400/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.22em] text-white/50">
            Why Lisa
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Fewer pieces.
            <br />
            Stronger presence.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
            We design and curate clothes that do one job well: make you look
            considered without trying. Quality fabric, clean cuts, no noise.
          </p>
        </div>
      </section>

      <AtlasPlanet />
    </>
  );
}
