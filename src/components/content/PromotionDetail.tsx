"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, ChevronLeft } from "lucide-react";
import { AppBadge, AppButton, AppEmpty, AppImage } from "@/components/app";
import PromoCard from "@/components/home/PromoCard";
import { usePromotion, usePromotions } from "@/lib/ContentAPI";
import { formatDate } from "@/lib/format";

export default function PromotionDetail({ slug }: { slug: string }) {
    const { data: promotion, isLoading, isError } = usePromotion(slug);
    const { data: others } = usePromotions();

    if (isLoading) return <div className="h-[480px] animate-pulse rounded-3xl bg-white/5" />;

    if (isError || !promotion) {
        return (
            <AppEmpty
                title="Promotion unavailable"
                description="This offer has ended or doesn't exist."
                action={
                    <AppButton asChild tone="surface">
                        <Link href="/promotions">All promotions</Link>
                    </AppButton>
                }
            />
        );
    }

    return (
        <div className="space-y-10">
            <Link href="/promotions" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <ChevronLeft className="size-4" /> Promotions
            </Link>
            <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-border bg-plum-850">
                <div className="relative aspect-[16/7]">
                    <AppImage src={promotion.image} alt={promotion.title} wrapperClassName="absolute inset-0" />
                    <div className="absolute inset-0 bg-linear-to-t from-plum-850 via-plum-850/30 to-transparent" />
                </div>
                <div className="relative -mt-16 space-y-5 p-5 sm:-mt-24 sm:p-10">
                    <div className="flex flex-wrap items-center gap-2">
                        {promotion.tag ? <AppBadge tone="solidGold">{promotion.tag}</AppBadge> : null}
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarClock className="size-3.5" />
                            {promotion.starts_at ? formatDate(promotion.starts_at) : "Now"} – {promotion.ends_at ? formatDate(promotion.ends_at) : "Ongoing"}
                        </span>
                    </div>
                    <h1 className="font-display text-3xl font-extrabold text-balance sm:text-5xl">{promotion.title}</h1>
                    {promotion.summary ? <p className="max-w-2xl text-lg text-foreground/80">{promotion.summary}</p> : null}
                    {promotion.content ? <div className="prose-content max-w-3xl" dangerouslySetInnerHTML={{ __html: promotion.content }} /> : null}
                    {promotion.cta_url ? (
                        <AppButton asChild size="lg" shine>
                            <Link href={promotion.cta_url}>
                                {promotion.cta_label || "Claim now"} <ArrowRight />
                            </Link>
                        </AppButton>
                    ) : null}
                </div>
            </motion.article>

            {others && others.length > 1 ? (
                <div className="space-y-4">
                    <h2 className="font-display text-xl font-extrabold">More offers</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {others
                            .filter((item) => item.slug !== slug)
                            .slice(0, 3)
                            .map((item, index) => (
                                <PromoCard key={item.id} promotion={item} index={index} />
                            ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
