"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, History } from "lucide-react";
import { AppImage } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { gameImage } from "@/lib/assets";
import { useGames } from "@/lib/CasinoAPI";
import { useGameStore } from "@/stores";

const LIMIT = 16;

export default function RecentlyPlayedBar() {
    const { isAuthenticated } = useAuth();
    const recent = useGameStore((state) => state.recent);
    const slugs = recent.slice(0, LIMIT);
    const { data } = useGames({ slugs: slugs.join(","), per_page: LIMIT }, isAuthenticated && slugs.length > 0);

    const games = (data?.data ?? []).slice().sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug));

    if (!isAuthenticated || !games.length) return null;

    return (
        <div className="border-b border-border bg-card">
            <div className="mx-auto flex max-w-350 items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-5">
                <div className="flex shrink-0 flex-col items-center gap-0.5 sm:flex-row sm:gap-2">
                    <span className="grid size-7 place-items-center rounded-lg bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/25 sm:size-8">
                        <History className="size-3.5 sm:size-4" />
                    </span>
                    <span className="text-[9px] font-bold tracking-wide text-muted-foreground uppercase sm:text-xs sm:tracking-normal sm:text-foreground sm:normal-case">Recent</span>
                </div>
                <span className="h-9 w-px shrink-0 bg-border" />
                <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-0.5">
                    {games.map((game, index) => (
                        <motion.div key={game.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="shrink-0">
                            <Link
                                href={`/play/${game.slug}`}
                                title={game.name}
                                aria-label={`Play ${game.name}`}
                                className="group block rounded-xl p-0.5 ring-1 ring-border transition hover:ring-2 hover:ring-gold-400/70"
                            >
                                <AppImage src={gameImage(game)} alt={game.name} wrapperClassName="size-10 rounded-[10px] sm:size-11" className="transition duration-300 group-hover:scale-110" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
                <Link
                    href="/games?view=recent"
                    aria-label="See all recently played"
                    className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-full border border-border px-2 text-xs font-semibold text-muted-foreground transition hover:border-gold-400/50 hover:text-foreground sm:px-3"
                >
                    <span className="hidden sm:inline">See all</span>
                    <ChevronRight className="size-4" />
                </Link>
            </div>
        </div>
    );
}
