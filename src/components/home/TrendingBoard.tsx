"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { AppImage } from "@/components/app";
import { gameImage } from "@/lib/assets";
import { formatCompact } from "@/lib/format";
import type { Game } from "@/types/Casino";

export default function TrendingBoard({ games, loading }: { games?: Game[]; loading?: boolean }) {
    const list = games?.slice(0, 10) ?? [];

    return (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {loading && !list.length
                ? Array.from({ length: 10 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-white/5" />)
                : list.map((game, index) => (
                      <motion.div
                          key={game.id}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.04 }}
                      >
                          <Link href={`/play/${game.slug}`} className="group flex items-center gap-3 rounded-2xl border border-border bg-white/2.5 p-2 pr-3 transition hover:border-gold-400/40 hover:bg-white/5">
                              <span className={`w-7 shrink-0 text-center font-display text-2xl font-extrabold italic ${index < 3 ? "text-gold" : "text-foreground/25"}`}>{index + 1}</span>
                              <AppImage src={gameImage(game)} alt={game.name} wrapperClassName="size-14 shrink-0 rounded-xl" />
                              <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-bold group-hover:text-gold-200">{game.name}</div>
                                  <div className="truncate text-[11px] text-muted-foreground">
                                      {game.category?.name} · {formatCompact(game.plays_count)} plays
                                  </div>
                              </div>
                              <Play className="size-4 shrink-0 text-muted-foreground transition group-hover:text-gold-300" />
                          </Link>
                      </motion.div>
                  ))}
        </div>
    );
}
