"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock } from "lucide-react";
import { AppBadge, AppImage } from "@/components/app";
import { formatDate } from "@/lib/format";
import type { Promotion } from "@/types/Content";

export default function PromoCard({ promotion, index = 0 }: { promotion: Promotion; index?: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06, duration: 0.45 }}>
            <Link
                href={`/promotions/${promotion.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-plum-850 transition hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-[0_24px_50px_-24px_rgba(255,46,116,0.45)]"
            >
                <div className="relative aspect-[16/9] overflow-hidden">
                    <AppImage src={promotion.image} alt={promotion.title} wrapperClassName="absolute inset-0" className="transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-plum-850 via-transparent to-transparent" />
                    {promotion.tag ? (
                        <AppBadge tone="solidGold" size="sm" className="absolute top-3 left-3">
                            {promotion.tag}
                        </AppBadge>
                    ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4 pt-1 sm:p-5 sm:pt-2">
                    <h3 className="font-display text-lg leading-snug font-extrabold group-hover:text-gold-200">{promotion.title}</h3>
                    {promotion.summary ? <p className="line-clamp-2 text-sm text-muted-foreground">{promotion.summary}</p> : null}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <CalendarClock className="size-3.5" />
                            {promotion.ends_at ? `Until ${formatDate(promotion.ends_at)}` : "Ongoing"}
                        </span>
                        <span className="inline-flex items-center gap-1 font-bold text-gold-300">
                            Details <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
