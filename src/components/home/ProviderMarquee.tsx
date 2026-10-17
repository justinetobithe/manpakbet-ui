"use client";

import Link from "next/link";
import type { GameProvider } from "@/types/Casino";

const tints = ["text-gold-200", "text-ember-400", "text-violet-300", "text-jade-400", "text-sky-300"];

export default function ProviderMarquee({ providers }: { providers?: GameProvider[] }) {
    if (!providers?.length) return null;

    const row = Array.from({ length: Math.max(2, Math.ceil(10 / providers.length)) }, () => providers).flat();
    const items = [...row, ...row];

    return (
        <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]" style={{ ["--marquee-duration" as string]: `${row.length * 4}s` }}>
                {items.map((provider, index) => (
                    <Link
                        key={`${provider.id}-${index}`}
                        href={`/games?provider=${provider.slug}`}
                        className="flex h-16 min-w-44 items-center justify-center gap-3 rounded-2xl border border-border bg-fg/3 px-5 transition hover:border-gold-400/40 hover:bg-fg/6"
                    >
                        <span className={`font-display text-lg font-extrabold tracking-tight ${tints[provider.id % tints.length]}`}>{provider.name}</span>
                        {provider.games_count ? <span className="rounded-full bg-fg/6 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{provider.games_count}</span> : null}
                    </Link>
                ))}
            </div>
        </div>
    );
}
