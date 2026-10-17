"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock3 } from "lucide-react";
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
        <div className="border-b border-border bg-card/60">
            <div className="mx-auto flex h-16 max-w-350 items-center gap-3 px-3 sm:px-5">
                <div className="flex shrink-0 items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/25">
                        <Clock3 className="size-4" />
                    </span>
                    <span className="hidden text-xs leading-tight font-bold sm:block">
                        Recently
                        <br />
                        played
                    </span>
                </div>
                <div className="mask-fade-x no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 py-2">
                    {games.map((game, index) => (
                        <motion.div key={game.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.03 }} className="shrink-0">
                            <Link
                                href={`/play/${game.slug}`}
                                title={game.name}
                                aria-label={`Play ${game.name}`}
                                className="block overflow-hidden rounded-xl ring-1 ring-border transition hover:-translate-y-0.5 hover:ring-2 hover:ring-gold-400/70"
                            >
                                <AppImage src={gameImage(game)} alt={game.name} wrapperClassName="h-11 w-9 sm:h-12 sm:w-10" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
                <Link href="/games?view=recent" className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                    <span className="hidden sm:inline">See all</span>
                    <ChevronRight className="size-4" />
                </Link>
            </div>
        </div>
    );
}
