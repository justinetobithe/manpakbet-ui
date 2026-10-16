"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AppButton } from "@/components/app";
import { toAssetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types/Content";

const INTERVAL = 6500;

export default function HeroCarousel({ banners, loading }: { banners?: Banner[]; loading?: boolean }) {
    const slides = banners ?? [];
    const [[index, direction], setState] = React.useState<[number, number]>([0, 1]);
    const [paused, setPaused] = React.useState(false);
    const count = slides.length;
    const active = count ? ((index % count) + count) % count : 0;

    const paginate = React.useCallback((step: number) => setState(([current]) => [current + step, step]), []);

    React.useEffect(() => {
        if (count < 2 || paused) return;
        const timer = setTimeout(() => paginate(1), INTERVAL);
        return () => clearTimeout(timer);
    }, [index, count, paused, paginate]);

    const onDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x < -60 || info.velocity.x < -400) paginate(1);
        else if (info.offset.x > 60 || info.velocity.x > 400) paginate(-1);
    };

    if (loading && !count) return <div className="aspect-[16/9] w-full animate-pulse rounded-3xl bg-white/5 sm:aspect-[21/8]" />;
    if (!count) return null;

    const slide = slides[active];

    return (
        <div
            className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border bg-plum-900 sm:aspect-[21/8]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={`${slide.id}-${index}`}
                    custom={direction}
                    variants={{
                        enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0.4 }),
                        center: { x: 0, opacity: 1 },
                        exit: (dir: number) => ({ x: dir > 0 ? "-35%" : "35%", opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    drag={count > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    onDragEnd={onDragEnd}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                    <motion.img
                        src={toAssetUrl(slide.image)}
                        alt=""
                        draggable={false}
                        initial={{ scale: 1.12 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 7, ease: "linear" }}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-plum-950/95 via-plum-950/60 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-t from-plum-950/80 via-transparent to-transparent" />

                    <div className="relative flex h-full max-w-xl flex-col justify-end gap-3 p-5 pb-12 sm:justify-center sm:gap-4 sm:p-10 lg:p-14">
                        <motion.span
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ember-500/20 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-ember-400 uppercase ring-1 ring-ember-500/35"
                        >
                            <span className="size-1.5 animate-pulse rounded-full bg-ember-400" />
                            Featured
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            className="font-display text-[26px] leading-[1.05] font-extrabold text-balance sm:text-4xl lg:text-5xl"
                        >
                            {slide.title}
                        </motion.h2>
                        {slide.subtitle ? (
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.6 }}
                                className="line-clamp-2 max-w-md text-sm text-foreground/75 sm:text-base"
                            >
                                {slide.subtitle}
                            </motion.p>
                        ) : null}
                        {slide.link_url ? (
                            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="pt-1">
                                <AppButton asChild size="lg" shine className="w-fit">
                                    <Link href={slide.link_url}>
                                        {slide.cta_label || "Play now"}
                                        <ArrowRight />
                                    </Link>
                                </AppButton>
                            </motion.div>
                        ) : null}
                    </div>
                </motion.div>
            </AnimatePresence>

            {count > 1 ? (
                <>
                    <div className="absolute right-0 bottom-4 left-0 z-10 flex justify-center gap-1.5 sm:right-auto sm:left-10 lg:left-14">
                        {slides.map((item, i) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setState([i, i > active ? 1 : -1])}
                                className="relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all"
                                style={{ width: i === active ? 40 : 14 }}
                                aria-label={`Go to slide ${i + 1}`}
                            >
                                {i === active ? (
                                    <motion.span
                                        key={`${index}-${paused}`}
                                        className="bg-gold absolute inset-y-0 left-0"
                                        initial={{ width: "0%" }}
                                        animate={{ width: paused ? "0%" : "100%" }}
                                        transition={{ duration: paused ? 0 : INTERVAL / 1000, ease: "linear" }}
                                    />
                                ) : null}
                            </button>
                        ))}
                    </div>
                    <NavButton side="left" onClick={() => paginate(-1)} />
                    <NavButton side="right" onClick={() => paginate(1)} />
                </>
            ) : null}
        </div>
    );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "glass absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-border opacity-0 transition group-hover:opacity-100 hover:border-gold-400/50 hover:text-gold-200 sm:grid",
                side === "left" ? "left-4" : "right-4"
            )}
            aria-label={side === "left" ? "Previous slide" : "Next slide"}
        >
            {side === "left" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
        </button>
    );
}
