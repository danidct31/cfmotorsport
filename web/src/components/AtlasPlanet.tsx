"use client";

import Link from "next/link";
import { useState } from "react";

type Territory = {
  id: string;
  name: string;
  href: string;
  blurb: string;
  path: string;
  labelX: number;
  labelY: number;
};

const territories: Territory[] = [
  {
    id: "home",
    name: "Home",
    href: "/",
    blurb: "Capital — the landing shore",
    path: "M210 95 C245 70 295 68 330 95 C355 118 360 155 340 185 C310 220 250 225 215 195 C185 165 180 120 210 95 Z",
    labelX: 265,
    labelY: 145,
  },
  {
    id: "shop",
    name: "Shop",
    href: "/shop",
    blurb: "The great market plain",
    path: "M340 185 C380 170 430 175 455 210 C475 245 465 295 430 320 C390 350 330 345 300 310 C275 280 290 220 340 185 Z",
    labelX: 380,
    labelY: 255,
  },
  {
    id: "outerwear",
    name: "Outerwear",
    href: "/shop?category=outerwear",
    blurb: "Northern coat ranges",
    path: "M145 130 C180 115 210 130 215 165 C220 200 195 235 155 245 C115 255 85 220 90 180 C95 145 115 140 145 130 Z",
    labelX: 145,
    labelY: 185,
  },
  {
    id: "dresses",
    name: "Dresses",
    href: "/shop?category=dresses",
    blurb: "Eastern silk isles",
    path: "M430 320 C470 310 510 330 520 370 C530 410 505 450 460 455 C415 460 380 430 375 390 C370 350 395 330 430 320 Z",
    labelX: 450,
    labelY: 390,
  },
  {
    id: "tops",
    name: "Tops",
    href: "/shop?category=tops",
    blurb: "Western knit coast",
    path: "M90 180 C115 200 130 240 125 280 C120 320 90 350 60 340 C30 330 20 285 35 245 C50 205 65 185 90 180 Z",
    labelX: 75,
    labelY: 265,
  },
  {
    id: "bottoms",
    name: "Bottoms",
    href: "/shop?category=bottoms",
    blurb: "Southern denim basin",
    path: "M215 300 C255 290 300 310 310 350 C320 390 295 430 250 440 C205 450 165 420 160 380 C155 340 180 310 215 300 Z",
    labelX: 235,
    labelY: 370,
  },
  {
    id: "accessories",
    name: "Accessories",
    href: "/shop?category=accessories",
    blurb: "Archipelago of details",
    path: "M300 310 C335 300 365 320 370 355 C375 385 350 410 320 405 C290 400 275 370 280 345 C285 320 285 315 300 310 Z",
    labelX: 325,
    labelY: 355,
  },
  {
    id: "contact",
    name: "Contact",
    href: "mailto:hello@lisa.shop",
    blurb: "Harbor of messages",
    path: "M155 245 C185 250 205 275 200 305 C195 335 165 350 135 340 C105 330 100 295 115 270 C125 255 140 245 155 245 Z",
    labelX: 155,
    labelY: 295,
  },
];

export function AtlasPlanet() {
  const [active, setActive] = useState<string | null>("shop");
  const current = territories.find((t) => t.id === active) ?? territories[1];

  return (
    <section className="atlas-section relative overflow-hidden bg-[#0a1628] px-5 py-24 text-paper md:px-8 md:py-32">
      <div className="atlas-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-yellow-200/70">
            Atlas of Lisa
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            The shop as a world
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
            Every territory is a page. Hover a country, then travel — an old
            atlas for a new wardrobe.
          </p>

          <div className="atlas-legend mt-10 border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-200/60">
              Selected territory
            </p>
            <p className="mt-3 font-display text-3xl font-bold text-yellow-100">
              {current.name}
            </p>
            <p className="mt-2 text-sm text-white/55">{current.blurb}</p>
            <Link href={current.href} className="btn btn-primary mt-6">
              <span>
                {current.href.startsWith("mailto:")
                  ? "Send signal"
                  : `Travel to ${current.name}`}
              </span>
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {territories.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`btn-chip border-white/20 text-white/80 ${
                    active === t.id ? "is-active !border-yellow-300" : ""
                  }`}
                  onMouseEnter={() => setActive(t.id)}
                  onFocus={() => setActive(t.id)}
                  onClick={() => setActive(t.id)}
                >
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="atlas-orb-wrap relative mx-auto w-full max-w-[560px]">
          <div className="atlas-orb-glow" aria-hidden />
          <svg
            viewBox="0 0 560 560"
            className="atlas-orb relative z-10 h-auto w-full drop-shadow-2xl"
            role="img"
            aria-label="Atlas map of the Lisa website"
          >
            <defs>
              <radialGradient id="ocean" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="55%" stopColor="#0f2744" />
                <stop offset="100%" stopColor="#071018" />
              </radialGradient>
              <radialGradient id="landIdle" cx="40%" cy="35%" r="80%">
                <stop offset="0%" stopColor="#3d5a40" />
                <stop offset="100%" stopColor="#243528" />
              </radialGradient>
              <radialGradient id="landHot" cx="40%" cy="35%" r="80%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="55%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </radialGradient>
              <clipPath id="globeClip">
                <circle cx="280" cy="280" r="230" />
              </clipPath>
              <filter id="softEdge" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sphere */}
            <circle cx="280" cy="280" r="230" fill="url(#ocean)" />
            <circle
              cx="280"
              cy="280"
              r="230"
              fill="none"
              stroke="rgba(254,249,195,0.25)"
              strokeWidth="1.5"
            />

            <g clipPath="url(#globeClip)">
              {/* Lat/long atlas lines */}
              {[70, 120, 170, 220, 280, 340, 390, 440, 490].map((x) => (
                <path
                  key={`lon-${x}`}
                  d={`M${x} 50 Q280 280 ${x} 510`}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              ))}
              {[100, 160, 220, 280, 340, 400, 460].map((y) => (
                <ellipse
                  key={`lat-${y}`}
                  cx="280"
                  cy={y}
                  rx={Math.max(40, 230 - Math.abs(280 - y) * 0.55)}
                  ry="14"
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1"
                />
              ))}

              {/* Continents / countries */}
              {territories.map((t) => {
                const isHot = active === t.id;
                return (
                  <a
                    key={t.id}
                    href={t.href}
                    className="atlas-country"
                    onMouseEnter={() => setActive(t.id)}
                    onFocus={() => setActive(t.id)}
                  >
                    <path
                      d={t.path}
                      fill={isHot ? "url(#landHot)" : "url(#landIdle)"}
                      stroke={
                        isHot
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(254,249,195,0.35)"
                      }
                      strokeWidth={isHot ? 2 : 1}
                      className="atlas-land"
                    />
                    <text
                      x={t.labelX}
                      y={t.labelY}
                      textAnchor="middle"
                      className="atlas-label pointer-events-none"
                      fill={isHot ? "#0c0c0c" : "rgba(255,255,255,0.75)"}
                      fontSize={isHot ? 13 : 11}
                      fontWeight="700"
                      style={{ fontFamily: "var(--font-syne), sans-serif" }}
                    >
                      {t.name}
                    </text>
                  </a>
                );
              })}
            </g>

            {/* Gloss + limb */}
            <ellipse
              cx="210"
              cy="190"
              rx="90"
              ry="55"
              fill="rgba(255,255,255,0.07)"
              className="pointer-events-none"
            />
            <circle
              cx="280"
              cy="280"
              r="230"
              fill="none"
              stroke="rgba(0,0,0,0.35)"
              strokeWidth="18"
              className="pointer-events-none"
            />
            <text
              x="280"
              y="530"
              textAnchor="middle"
              fill="rgba(254,249,195,0.45)"
              fontSize="10"
              letterSpacing="3"
              style={{ fontFamily: "var(--font-figtree), sans-serif" }}
            >
              LISA · WEB ATLAS · EST. MMXXVI
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
