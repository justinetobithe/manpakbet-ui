"use client";

import * as React from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Gamepad2, Gift, Layers, Users } from "lucide-react";
import { formatNumber } from "@/lib/format";

type Stat = { label: string; value: number; icon: React.ElementType; suffix?: string };

function Counter({ value }: { value: number }) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);
    const display = useTransform(motionValue, (latest) => formatNumber(Math.round(latest)));

    React.useEffect(() => {
        if (!inView) return;
        const controls = animate(motionValue, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
        return () => controls.stop();
    }, [inView, value, motionValue]);

    return <motion.span ref={ref}>{display}</motion.span>;
}

export default function LobbyStats({ games, providers, categories, promotions }: { games: number; providers: number; categories: number; promotions: number }) {
    const stats: Stat[] = [
        { label: "Games in lobby", value: games, icon: Gamepad2, suffix: "+" },
        { label: "Game studios", value: providers, icon: Users },
        { label: "Categories", value: categories, icon: Layers },
        { label: "Live promotions", value: promotions, icon: Gift },
    ];

    return (
        <div className="border-gradient relative overflow-hidden rounded-3xl bg-linear-to-r from-plum-800/80 via-plum-850 to-plum-800/80">
            <div className="pointer-events-none absolute -top-20 left-1/4 size-60 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-1/4 size-60 rounded-full bg-ember-500/10 blur-3xl" />
            <div className="relative grid grid-cols-2 divide-border lg:grid-cols-4 lg:divide-x">
                {stats.map(({ label, value, icon: Icon, suffix }, index) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                        className="flex items-center gap-3 p-4 sm:p-5"
                    >
                        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-gold-400/25 to-ember-500/10 text-gold-300 ring-1 ring-gold-400/25">
                            <Icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-gold font-display text-2xl font-extrabold tabular-nums sm:text-3xl">
                                <Counter value={value} />
                                {suffix && value ? suffix : ""}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">{label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
