"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { toAssetUrl } from "@/lib/assets";
import type { Banner } from "@/types/Content";

export default function SideBanners({ banners, loading }: { banners?: Banner[]; loading?: boolean }) {
    if (loading && !banners?.length) {
        return (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="aspect-[2/1] animate-pulse rounded-3xl bg-fg/5" />
                <div className="aspect-[2/1] animate-pulse rounded-3xl bg-fg/5" />
            </div>
        );
    }

    if (!banners?.length) return null;

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
            {banners.slice(0, 2).map((banner, index) => (
                <motion.div key={banner.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + index * 0.1, duration: 0.5 }}>
                    <Link
                        href={banner.link_url || "/games"}
                        className="group relative flex aspect-[2/1] h-full overflow-hidden rounded-3xl border border-border bg-[#120a1f] text-white shadow-[0_18px_40px_-28px_rgba(29,21,48,0.6)] transition hover:border-gold-400/40 lg:aspect-auto"
                    >
                        <img src={toAssetUrl(banner.image)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-linear-to-r from-[#0b0613]/85 via-[#0b0613]/40 to-transparent" />
                        <div className="relative flex flex-col justify-end p-5">
                            <div className="font-display text-xl font-extrabold">{banner.title}</div>
                            {banner.subtitle ? <div className="mt-1 line-clamp-2 max-w-[16rem] text-xs text-white/75">{banner.subtitle}</div> : null}
                            <span className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-bold text-[#ffd36b]">
                                {banner.cta_label || "Explore"}
                                <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
