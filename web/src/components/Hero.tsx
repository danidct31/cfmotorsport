import Image from "next/image";
import Link from "next/link";
import { LisaLogo } from "@/components/LisaLogo";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <div className="hero-media">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2400&q=80"
          alt="Lisa campaign — model in tailored black"
          fill
          priority
          className="hero-media-image object-cover object-[center_20%]"
          sizes="100vw"
        />
        <div className="hero-shimmer-band" aria-hidden />
        <div className="hero-glow-wash" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-20">
        <div className="animate-rise">
          <LisaLogo size="hero" href={null} />
        </div>
        <div className="mt-6 flex max-w-xl flex-col gap-6 md:mt-4 md:flex-row md:items-end md:justify-between md:max-w-none">
          <p className="animate-rise-delay-1 text-base leading-relaxed text-white/80 md:max-w-md md:text-lg">
            New season essentials — sharp coats, soft silks, pieces that hold
            their own.
          </p>
          <div className="animate-rise-delay-2 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">
              <span>Shop the edit</span>
            </Link>
            <Link href="/shop?category=outerwear" className="btn btn-ghost">
              <span>Outerwear</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
