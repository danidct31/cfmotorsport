import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-mist">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="product-image object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight">
            {product.name}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-mute">
            {product.category}
          </p>
        </div>
        <p className="text-sm tabular-nums">{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
