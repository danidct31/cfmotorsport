import Link from "next/link";

type LisaLogoProps = {
  size?: "nav" | "hero" | "footer";
  href?: string | null;
  className?: string;
};

const sizeClass = {
  nav: "text-2xl md:text-3xl",
  hero: "text-[18vw] md:text-[11rem] leading-[0.85]",
  footer: "text-5xl md:text-6xl",
};

export function LisaLogo({
  size = "nav",
  href = "/",
  className = "",
}: LisaLogoProps) {
  const mark = (
    <span
      className={`lisa-logo font-display font-bold tracking-tight ${sizeClass[size]} ${className}`}
      aria-label="Lisa"
    >
      Lisa
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="inline-block" aria-label="Lisa home">
      {mark}
    </Link>
  );
}
