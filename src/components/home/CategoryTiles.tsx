"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { categoryIcons } from "@/config/site";
import { formatNumber } from "@/lib/format";
import type { GameCategory } from "@/types/Casino";

const accents = [
    "from-ember-500/35 via-ember-500/10",
    "from-gold-400/35 via-gold-400/10",
    "from-violet-500/35 via-violet-500/10",
    "from-jade-500/35 via-jade-500/10",
    "from-sky-500/35 via-sky-500/10",
    "from-fuchsia-500/35 via-fuchsia-500/10",
    "from-amber-500/35 via-amber-500/10",
];

export default function CategoryTiles({ categories, loading }: { categories?: GameCategory[]; loading?: boolean }) {
    if (loading && !categories?.length) {
        return (
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-7">
                {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="aspect-square animate-pulse rounded-2xl bg-white/5 sm:aspect-[4/3]" />
                ))}
            </div>
        );
    }

    if (!categories?.length) return null;

    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-4 gap-2.5 sm:grid-cols-7"
        >
            {categories.map((category, index) => {
                const Icon = categoryIcons[category.icon ?? ""] ?? Gamepad2;
                return (
                    <motion.div
                        key={category.id}
                        variants={{ hidden: { opacity: 0, y: 16, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1 } }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    >
                        <Link
                            href={`/games/${category.slug}`}
                            className="group relative flex aspect-square flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-border bg-plum-850 p-2 text-center transition hover:-translate-y-0.5 hover:border-gold-400/40 sm:aspect-[4/3]"
                        >
                            <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${accents[index % accents.length]} to-transparent opacity-70 transition group-hover:opacity-100`} />
                            <Icon className="relative size-6 text-gold-200 transition duration-300 group-hover:scale-110 sm:size-7" />
                            <div className="relative line-clamp-1 text-[11px] font-bold sm:text-sm">{category.name.replace(/ Games$/i, "")}</div>
                            {category.games_count ? <div className="relative hidden text-[10px] text-muted-foreground sm:block">{formatNumber(category.games_count)} games</div> : null}
                        </Link>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
