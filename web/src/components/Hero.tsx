import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2400&q=80"
          alt="Lisa campaign — model in tailored black"
          fill
          priority
          className="animate-drift object-cover object-[center_20%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,245,66,0.18),transparent_45%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-20">
        <p className="font-display animate-rise text-[18vw] font-bold leading-[0.85] tracking-tight md:text-[11rem]">
          Lisa
        </p>
        <div className="mt-6 flex max-w-xl flex-col gap-6 md:mt-4 md:flex-row md:items-end md:justify-between md:max-w-none">
          <p className="animate-rise-delay-1 text-base leading-relaxed text-white/80 md:max-w-md md:text-lg">
            New season essentials — sharp coats, soft silks, pieces that hold
            their own.
          </p>
          <div className="animate-rise-delay-2 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center bg-acid px-6 py-3 text-sm font-semibold tracking-wide text-acid-ink transition hover:brightness-95"
            >
              Shop the edit
            </Link>
            <Link
              href="/shop?category=outerwear"
              className="inline-flex items-center border border-white/35 px-6 py-3 text-sm tracking-wide text-white transition hover:border-white hover:bg-white/5"
            >
              Outerwear
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
