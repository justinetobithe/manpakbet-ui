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
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,2fr)]">
                {spotlight ? (
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <Link
                            href={`/play/${spotlight.slug}`}
                            className="group border-gradient relative flex h-full min-h-72 overflow-hidden rounded-3xl bg-plum-850"
                        >
                            <img src={gameImage(spotlight)} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-2xl" />
                            <div className="absolute inset-0 bg-linear-to-br from-ember-600/35 via-plum-950/70 to-plum-950" />
                            <motion.div
                                className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-gold-400/25 blur-3xl"
                                animate={{ opacity: [0.5, 0.9, 0.5] }}
                                transition={{ duration: 3.2, repeat: Infinity }}
                            />
                            <div className="relative flex w-full items-center gap-4 p-4 sm:gap-6 sm:p-6">
                                <motion.div whileHover={{ rotate: -2, scale: 1.03 }} className="relative w-32 shrink-0 sm:w-44">
                                    <div className="absolute -inset-2 rounded-[22px] bg-linear-to-br from-gold-400/60 to-ember-500/50 blur-lg" />
                                    <AppImage src={gameImage(spotlight)} alt={spotlight.name} wrapperClassName="relative aspect-[4/5] rounded-2xl ring-2 ring-gold-400/60" />
                                </motion.div>
                                <div className="min-w-0 space-y-3">
                                    <span className="bg-ember inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold tracking-[0.18em] text-white uppercase shadow-lg">
                                        <Crown className="size-3.5" /> #1 Hottest
                                    </span>
                                    <h3 className="font-display text-2xl leading-tight font-extrabold text-balance sm:text-3xl">{spotlight.name}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/70">
                                        <span className="font-semibold text-gold-200">{spotlight.provider_ref?.name ?? spotlight.provider}</span>
                                        <span className="inline-flex items-center gap-1">
                                            <Users className="size-3.5" /> {formatCompact(spotlight.plays_count)} plays
                                        </span>
                                    </div>
                                    <AppButton size="md" shine leftIcon={<Play className="fill-current" />} className="pointer-events-none">
                                        Play now
                                    </AppButton>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="min-h-72 animate-pulse rounded-3xl bg-white/5" />
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
