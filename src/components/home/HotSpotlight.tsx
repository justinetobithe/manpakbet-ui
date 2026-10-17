"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Flame, Play, Users } from "lucide-react";
import { AppButton, AppImage, AppSection } from "@/components/app";
import GameCard, { GameCardSkeleton } from "@/components/games/GameCard";
import { gameImage } from "@/lib/assets";
import { useGames } from "@/lib/CasinoAPI";
import { formatCompact } from "@/lib/format";

export default function HotSpotlight() {
    const { data, isLoading } = useGames({ badge: "hot", per_page: 12 });
    const games = data?.data ?? [];
    const [spotlight, ...rest] = games;

    if (!isLoading && !spotlight) return null;

    return (
        <AppSection title="Hot right now" subtitle="The lobby's most played titles" icon={<Flame />} href="/games/popular" hrefLabel="All hot games">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
                {spotlight ? (
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="h-full">
                        <Link
                            href={`/play/${spotlight.slug}`}
                            className="group border-gradient relative flex aspect-[4/5] h-full w-full overflow-hidden rounded-3xl bg-plum-850 sm:aspect-[16/10] lg:aspect-auto"
                        >
                            <AppImage
                                src={gameImage(spotlight)}
                                alt={spotlight.name}
                                wrapperClassName="absolute inset-0"
                                className="object-cover transition duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-plum-950 via-plum-950/40 to-transparent" />
                            <motion.div
                                className="pointer-events-none absolute -bottom-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-gold-400/25 blur-3xl"
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 3.2, repeat: Infinity }}
                            />
                            <span className="bg-ember absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold tracking-[0.18em] text-white uppercase shadow-lg">
                                <Crown className="size-3.5" /> #1 Hottest
                            </span>
                            <div className="relative mt-auto w-full space-y-2.5 p-4 sm:p-5">
                                <h3 className="font-display text-2xl leading-tight font-extrabold text-balance drop-shadow-lg sm:text-3xl">{spotlight.name}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/80">
                                    <span className="font-semibold text-gold-200">{spotlight.provider_ref?.name ?? spotlight.provider}</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Users className="size-3.5" /> {formatCompact(spotlight.plays_count)} plays
                                    </span>
                                </div>
                                <AppButton size="md" block shine leftIcon={<Play className="fill-current" />} className="pointer-events-none">
                                    Play now
                                </AppButton>
                            </div>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="aspect-[4/5] animate-pulse rounded-3xl bg-white/5 lg:aspect-auto" />
                )}

                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
                    {isLoading && !rest.length
                        ? Array.from({ length: 8 }).map((_, index) => <GameCardSkeleton key={index} />)
                        : rest.slice(0, 8).map((game, index) => <GameCard key={game.id} game={game} index={index} />)}
                </div>
            </div>
        </AppSection>
    );
}
