"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Flame, Play, Users } from "lucide-react";
import { AppButton, AppImage, AppSection } from "@/components/app";
import GameCard, { GameCardSkeleton } from "@/components/games/GameCard";
import { gameImage } from "@/lib/assets";
import { useLandingGames } from "@/lib/LandingData";
import { formatCompact } from "@/lib/format";

const GRID_SIZE = 16;

export default function HotSpotlight() {
    const hot = useLandingGames("hot", { badge: "hot", per_page: 12 });
    const popular = useLandingGames("popular", { sort: "popular", per_page: 24 });
    const hotGames = hot.data?.data ?? [];
    const [spotlight] = hotGames;
    const seen = new Set(hotGames.map((game) => game.id));
    const grid = [...hotGames.slice(1), ...(popular.data?.data ?? []).filter((game) => !seen.has(game.id))].slice(0, GRID_SIZE);
    const loading = hot.isLoading || popular.isLoading;

    if (!loading && !spotlight) return null;

    return (
        <AppSection title="Hot right now" subtitle="The lobby's most played titles" icon={<Flame />} href="/games/popular" hrefLabel="All hot games">
            <div className="space-y-3">
                {spotlight ? (
                    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                        <Link href={`/play/${spotlight.slug}`} className="group border-gradient relative flex items-center gap-4 overflow-hidden rounded-3xl bg-plum-850 p-3 sm:gap-5 sm:p-4">
                            <img src={gameImage(spotlight)} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-150 object-cover opacity-35 blur-3xl" />
                            <div className="absolute inset-0 bg-linear-to-r from-plum-950/40 via-plum-950/70 to-plum-950/90" />
                            <motion.div
                                className="pointer-events-none absolute -top-16 left-24 size-48 rounded-full bg-gold-400/25 blur-3xl"
                                animate={{ opacity: [0.4, 0.85, 0.4] }}
                                transition={{ duration: 3.2, repeat: Infinity }}
                            />
                            <div className="relative w-24 shrink-0 sm:w-28">
                                <div className="absolute -inset-1.5 rounded-[18px] bg-linear-to-br from-gold-400/70 to-ember-500/60 blur-md transition group-hover:blur-lg" />
                                <AppImage src={gameImage(spotlight)} alt={spotlight.name} wrapperClassName="relative aspect-[4/5] rounded-2xl ring-2 ring-gold-400/70" />
                            </div>
                            <div className="relative min-w-0 flex-1 space-y-1.5">
                                <span className="bg-ember inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-[0.18em] text-white uppercase shadow-lg">
                                    <Crown className="size-3" /> #1 Hottest
                                </span>
                                <h3 className="truncate font-display text-xl font-extrabold sm:text-2xl">{spotlight.name}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/75">
                                    <span className="font-semibold text-gold-200">{spotlight.provider_ref?.name ?? spotlight.provider}</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Users className="size-3.5" /> {formatCompact(spotlight.plays_count)} plays
                                    </span>
                                </div>
                            </div>
                            <AppButton shine leftIcon={<Play className="fill-current" />} className="pointer-events-none relative hidden shrink-0 sm:inline-flex">
                                Play now
                            </AppButton>
                            <span className="bg-gold ring-gold relative grid size-11 shrink-0 place-items-center rounded-full text-[#2a1600] sm:hidden">
                                <Play className="ml-0.5 size-5 fill-current" />
                            </span>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="h-36 animate-pulse rounded-3xl bg-fg/5" />
                )}

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5 lg:grid-cols-8">
                    {loading && !grid.length
                        ? Array.from({ length: GRID_SIZE }).map((_, index) => <GameCardSkeleton key={index} />)
                        : grid.map((game, index) => <GameCard key={game.id} game={game} index={index} compact />)}
                </div>
            </div>
        </AppSection>
    );
}
