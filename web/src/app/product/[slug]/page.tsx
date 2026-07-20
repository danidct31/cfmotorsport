import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/ProductActions";
import { SiteHeader } from "@/components/SiteHeader";
import { getProduct, getProducts } from "@/lib/api";
import { formatPrice } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = (await getProducts(product.category))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl flex-1 px-5 py-10 md:px-8 md:py-16">
        <Link
          href="/shop"
          className="text-sm text-mute transition hover:text-ink"
        >
          ← Back to shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[3/4] overflow-hidden bg-mist">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="lg:pt-8">
            <p className="text-xs uppercase tracking-[0.22em] text-mute">
              {product.category}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-xl tabular-nums">
              {formatPrice(product.priceCents)}
            </p>
            <p className="mt-8 max-w-md text-base leading-relaxed text-mute">
              {product.description}
            </p>
            <ProductActions product={product} />
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24 border-t border-line pt-16">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              More in {product.category}
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/product/${item.slug}`} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-mist">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="product-image object-cover"
                      sizes="25vw"
                    />
                  </div>
                  <p className="mt-3 font-display font-semibold">{item.name}</p>
                  <p className="text-sm tabular-nums text-mute">
                    {formatPrice(item.priceCents)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
