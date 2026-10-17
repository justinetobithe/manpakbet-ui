"use client";

import * as React from "react";
import { Gift } from "lucide-react";
import { motion } from "framer-motion";
import { AppEmpty, AppPageHeader } from "@/components/app";
import PromoCard from "@/components/home/PromoCard";
import { usePromotions } from "@/lib/ContentAPI";
import { cn } from "@/lib/utils";

export default function PromotionsView() {
    const { data, isLoading } = usePromotions();
    const [tag, setTag] = React.useState("all");

    const tags = React.useMemo(() => ["all", ...Array.from(new Set((data ?? []).map((item) => item.tag).filter(Boolean) as string[]))], [data]);
    const list = (data ?? []).filter((item) => tag === "all" || item.tag === tag);

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-gradient relative overflow-hidden rounded-3xl bg-linear-to-br from-ember-600/25 via-plum-850 to-gold-500/15 p-6 sm:p-10"
            >
                <div className="pointer-events-none absolute -top-16 -right-10 size-72 animate-float rounded-full bg-gold-400/20 blur-3xl" />
                <AppPageHeader eyebrow="Rewards" icon={<Gift />} title="Promotions" description="Boosts, cashback and rewards refreshed regularly. Claim what fits your play style." />
            </motion.div>

            <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0">
                {tags.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setTag(item)}
                        className={cn(
                            "h-9 shrink-0 rounded-full border px-4 text-xs font-bold capitalize transition",
                            tag === item ? "bg-gold border-transparent text-[#2a1600]" : "border-border text-foreground/70 hover:text-foreground"
                        )}
                    >
                        {item === "all" ? "All offers" : item}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-80 animate-pulse rounded-3xl bg-fg/5" />
                    ))}
                </div>
            ) : list.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((promotion, index) => (
                        <PromoCard key={promotion.id} promotion={promotion} index={index} />
                    ))}
                </div>
            ) : (
                <AppEmpty icon={<Gift />} title="No promotions right now" description="Check back soon — new offers drop every week." />
            )}
        </div>
    );
}
