"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Star, Clock, Trophy, ArrowRight, ChevronRight } from "lucide-react";
import { homeBanners, homeSections } from "@/data/homeData";

const chips = [
  { label: "Favourite", icon: Star },
  { label: "Recent", icon: Clock },
  { label: "For You", icon: Flame },
  { label: "Jackpot", icon: Trophy },
];

function Badge({ kind }: { kind?: "live" | "new" | "top" }) {
  if (!kind) return null;
  const styles =
    kind === "live"
      ? "bg-rose-500/90"
      : kind === "new"
        ? "bg-emerald-500/90"
        : "bg-sky-500/90";
  const label = kind.toUpperCase();
  return (
    <span className={`absolute left-3 top-3 z-10 rounded-xl px-2.5 py-1 text-[11px] font-semibold text-white ${styles}`}>
      {label}
    </span>
  );
}

function GameCard({
  title,
  image,
  href,
  badge,
}: {
  title: string;
  image: string;
  href: string;
  badge?: "live" | "new" | "top";
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.05]"
    >
      <Badge kind={badge} />

      <div className="relative aspect-[16/7] w-full">
        <Image src={image} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_55%)]" />
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="h-7 w-7 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-[12px] text-white/80">
          ★
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">{title}</div>
        </div>
        <ChevronRight className="h-4 w-4 text-white/55 transition group-hover:translate-x-0.5 group-hover:text-white/80" />
      </div>
    </Link>
  );
}

function Section({
  title,
  href,
  games,
}: {
  title: string;
  href?: string;
  games: Array<{ id: string; title: string; image: string; href: string; badge?: "live" | "new" | "top" }>;
}) {
  return (
    <Card className="panel p-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="text-base font-semibold">{title}</div>
        {href ? (
          <Link href={href}>
            <Button variant="secondary" className="h-9 rounded-2xl bg-white/8 text-white hover:bg-white/12">
              See All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : null}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((g) => (
          <GameCard key={g.id} title={g.title} image={g.image} href={g.href} badge={g.badge} />
        ))}
      </div>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 p-4">
          {chips.map((c) => {
            const Icon = c.icon;
            return (
              <Button
                key={c.label}
                variant="secondary"
                className="h-10 rounded-2xl bg-white/8 text-white hover:bg-white/12"
              >
                <Icon className="mr-2 h-4 w-4" />
                {c.label}
              </Button>
            );
          })}
        </div>

        <div className="soft-divider" />

        <div className="grid gap-4 p-4 lg:grid-cols-3">
          <Link
            href={homeBanners.main.href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-2"
          >
            <div className="relative aspect-[16/6] w-full">
              <Image src={homeBanners.main.image} alt={homeBanners.main.alt} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),transparent_55%)]" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Button className="h-10 rounded-2xl bg-orange-500 text-black hover:bg-orange-400">
                Play Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Link>

          <div className="grid gap-4">
            {homeBanners.side.map((b) => (
              <Link
                key={b.image}
                href={b.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative aspect-[16/7] w-full">
                  <Image src={b.image} alt={b.alt} fill className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),transparent_55%)]" />
                </div>
                <div className="absolute bottom-3 left-3">
                  <Button className="h-9 rounded-2xl bg-orange-500 text-black hover:bg-orange-400">
                    To Play <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="soft-divider" />

        <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
          {chips.map((c) => {
            const Icon = c.icon;
            return (
              <Button key={c.label} variant="secondary" className="h-10 rounded-2xl bg-white/8 text-white hover:bg-white/12">
                <Icon className="mr-2 h-4 w-4" />
                {c.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {homeSections.map((s) => (
          <Section key={s.title} title={s.title} href={s.href} games={s.games} />
        ))}
      </div>

      <div className="panel p-6 text-white">
        <div className="text-base font-semibold">Official License & Responsible Gaming</div>
        <div className="mt-2 text-sm text-soft">
          Play responsibly and follow local regulations. Prohibition to play in open and public places.
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <Image src="/pagcor-logo.svg" alt="PAGCOR" width={180} height={44} className="h-11 w-auto opacity-95" />
          </div>

          <div className="h-2 w-full max-w-[520px] overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full bg-[linear-gradient(90deg,#ff4d6d,#ffb703,#8ac926,#00c2ff,#7c3aed)]" />
          </div>
        </div>

        <div className="mt-3 text-xs text-soft">© {new Date().getFullYear()} ManpakBet</div>
      </div>
    </div>
  );
}
