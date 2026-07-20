import type { Metadata } from "next";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteHeader } from "@/components/SiteHeader";
import { getProducts } from "@/lib/api";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop",
};

const categories = [
  { value: "", label: "All" },
  { value: "outerwear", label: "Outerwear" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "accessories", label: "Accessories" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProducts(category);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl flex-1 px-5 py-14 md:px-8 md:py-20">
        <p className="text-xs uppercase tracking-[0.22em] text-mute">Catalog</p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">
          Shop
        </h1>
        <p className="mt-4 max-w-md text-mute">
          Everything in the Lisa wardrobe — coats, knits, denim, and the
          finishing pieces.
        </p>

        <div className="mt-10 flex flex-wrap gap-2 border-b border-line pb-6">
          {categories.map((cat) => {
            const active = (category ?? "") === cat.value;
            const href = cat.value ? `/shop?category=${cat.value}` : "/shop";
            return (
              <Link
                key={cat.label}
                href={href}
                className={`px-4 py-2 text-sm tracking-wide transition ${
                  active
                    ? "bg-ink text-paper"
                    : "text-mute hover:bg-mist hover:text-ink"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <ProductGrid products={products} />
        </div>
      </main>
    </>
  );
}
