import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-display text-5xl font-bold tracking-tight md:text-6xl">
            Lisa
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Clothes with presence. Cut clean, made to last, designed for the
            people who notice.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm text-white/70">
          <Link href="/shop" className="nav-link">
            Shop all
          </Link>
          <a href="mailto:hello@lisa.shop" className="nav-link">
            Contact
          </a>
          <span>Ship worldwide</span>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-xs text-white/40 md:px-8">
        © {new Date().getFullYear()} Lisa. Built for Railway.
      </div>
    </footer>
  );
}
