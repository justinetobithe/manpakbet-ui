"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AppStatCardProps = {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    hint?: React.ReactNode;
    tone?: "gold" | "ember" | "jade" | "violet" | "sky";
    className?: string;
    index?: number;
};

const tones = {
    gold: "from-gold-400/25 text-gold-300",
    ember: "from-ember-500/25 text-ember-400",
    jade: "from-jade-500/25 text-jade-400",
    violet: "from-violet-500/25 text-violet-300",
    sky: "from-sky-500/25 text-sky-300",
};

export default function AppStatCard({ label, value, icon, hint, tone = "gold", className, index = 0 }: AppStatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={cn("surface relative overflow-hidden rounded-2xl p-4 sm:p-5", className)}
        >
            <div className={cn("pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-linear-to-br to-transparent blur-2xl", tones[tone])} />
            <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</div>
                    <div className="mt-2 truncate font-display text-2xl font-extrabold tabular-nums">{value}</div>
                    {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
                </div>
                {icon ? <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br to-fg/2 ring-1 ring-fg/10 [&_svg]:size-5", tones[tone])}>{icon}</div> : null}
            </div>
        </motion.div>
    );
}
