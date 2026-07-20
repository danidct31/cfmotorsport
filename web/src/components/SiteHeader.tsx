import Link from "next/link";
import { LisaLogo } from "@/components/LisaLogo";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=outerwear", label: "Outerwear" },
  { href: "/shop?category=dresses", label: "Dresses" },
  { href: "/shop?category=accessories", label: "Accessories" },
];

export function SiteHeader({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  return (
    <header
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-50"
          : "sticky top-0 z-50 border-b border-white/10 bg-ink"
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <nav className="hidden items-center gap-8 text-sm tracking-wide text-white/85 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <LisaLogo size="nav" />
        </div>

        <div className="flex items-center gap-5 text-sm tracking-wide text-white/85">
          <Link href="/shop" className="nav-link md:hidden">
            Shop
          </Link>
          <button
            type="button"
            className="nav-link"
            aria-label="Bag (coming soon)"
          >
            Bag (0)
          </button>
        </div>
      </div>
    </header>
  );
}
