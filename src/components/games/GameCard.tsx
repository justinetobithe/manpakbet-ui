"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Heart, Play, Sparkles, Star, Trophy } from "lucide-react";
import { AppImage } from "@/components/app";
import { gameImage } from "@/lib/assets";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores";
import type { Game, GameBadge } from "@/types/Casino";

const badgeMeta: Record<GameBadge, { label: string; icon: typeof Flame; className: string }> = {
    hot: { label: "Hot", icon: Flame, className: "bg-ember text-white" },
    new: { label: "New", icon: Sparkles, className: "bg-linear-to-r from-jade-500 to-emerald-400 text-[#00241a]" },
    top: { label: "Top", icon: Star, className: "bg-linear-to-r from-violet-500 to-fuchsia-500 text-white" },
    jackpot: { label: "Jackpot", icon: Trophy, className: "bg-gold text-[#2a1600]" },
};

type GameCardProps = {
    game: Game;
    className?: string;
    priority?: boolean;
    index?: number;
    compact?: boolean;
};

export default function GameCard({ game, className, index = 0, compact = false }: GameCardProps) {
    const favorite = useGameStore((state) => state.favorites.includes(game.slug));
    const toggleFavorite = useGameStore((state) => state.toggleFavorite);
    const badge = game.badge ? badgeMeta[game.badge] : null;
    const providerName = game.provider_ref?.name ?? game.provider;

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: Math.min(index, 12) * 0.03 }}
            className={cn("group relative", className)}
        >
            <Link
                href={`/play/${game.slug}`}
                className={cn("block overflow-hidden border border-border bg-plum-850 transition duration-300 hover:-translate-y-1 hover:border-gold-400/45 hover:shadow-[0_18px_40px_-18px_rgba(255,194,61,0.45)]", compact ? "rounded-xl" : "rounded-2xl")}
            >
                <div className="relative aspect-[4/5]">
                    <AppImage src={gameImage(game)} alt={game.name} wrapperClassName="absolute inset-0" className="transition duration-500 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/40" />

                    {badge ? (
                        <span className={cn("absolute inline-flex items-center gap-1 rounded-full font-extrabold tracking-wide uppercase shadow-lg", compact ? "top-1.5 left-1.5 px-1.5 py-px text-[9px]" : "top-2 left-2 px-2 py-0.5 text-[10px]", badge.className)}>
                            <badge.icon className="size-3" />
                            {badge.label}
                        </span>
                    ) : null}

                    <div className="absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100">
                        <span className={cn("bg-gold ring-gold grid scale-75 place-items-center rounded-full text-[#2a1600] transition duration-300 group-hover:scale-100", compact ? "size-9" : "size-12")}>
                            <Play className="ml-0.5 size-5 fill-current" />
                        </span>
                    </div>

                </div>
                <div className={compact ? "px-2 pt-1.5 pb-2" : "px-2.5 pt-2 pb-2.5"}>
                    <div className={cn("truncate leading-tight font-bold text-foreground transition group-hover:text-gold-200", compact ? "text-xs" : "text-[13px]")}>{game.name}</div>
                    <div className="mt-1 flex items-center justify-between gap-2 text-[10px] font-semibold text-muted-foreground">
                        <span className="truncate uppercase">{providerName ?? game.category?.name ?? "ManpakBet"}</span>
                        {game.plays_count ? <span className="hidden shrink-0 sm:inline">{formatCompact(game.plays_count)}</span> : null}
                    </div>
                </div>
            </Link>

            <button
                type="button"
                onClick={() => toggleFavorite(game.slug)}
                className={cn(
                    "absolute grid place-items-center rounded-full backdrop-blur-md transition",
                    compact ? "top-1.5 right-1.5 size-7" : "top-2 right-2 size-8",
                    favorite ? "bg-ember-500/90 text-white" : "bg-black/45 text-white/80 opacity-100 hover:bg-black/70 sm:opacity-0 sm:group-hover:opacity-100"
                )}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={favorite}
            >
                <Heart className={cn("size-4", favorite && "fill-current")} />
            </button>
        </motion.div>
    );
}

export function GameCardSkeleton({ className }: { className?: string }) {
    return <div className={cn("aspect-[2/3] animate-pulse rounded-2xl bg-fg/5", className)} />;
}
