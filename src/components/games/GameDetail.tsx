"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, Gamepad2, Heart, Layers, Play, Share2, Users } from "lucide-react";
import { AppBadge, AppButton, AppEmpty, AppImage, AppSection, AppToast } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { gameImage } from "@/lib/assets";
import { useGame } from "@/lib/CasinoAPI";
import { formatCompact, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores";
import type { GameMode } from "@/types/Casino";
import GameRail from "./GameRail";

export default function GameDetail({ slug }: { slug: string }) {
    const router = useRouter();
    const { data, isLoading, isError } = useGame(slug);
    const { requireAuth } = useAuth();
    const favorite = useGameStore((state) => state.favorites.includes(slug));
    const toggleFavorite = useGameStore((state) => state.toggleFavorite);

    const game = data?.data;

    const play = (mode: GameMode) => requireAuth(() => router.push(`/play/${slug}/launch${mode === "demo" ? "?mode=demo" : ""}`));

    const share = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) await navigator.share({ title: game?.name, url });
            else {
                await navigator.clipboard.writeText(url);
                AppToast.success("Link copied");
            }
        } catch {
            return;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-[340px] animate-pulse rounded-3xl bg-white/5" />
                <div className="h-48 animate-pulse rounded-3xl bg-white/5" />
            </div>
        );
    }

    if (isError || !game) {
        return (
            <AppEmpty
                title="Game not found"
                description="This game may have been removed or is temporarily unavailable."
                action={
                    <AppButton asChild tone="surface">
                        <Link href="/games">Back to lobby</Link>
                    </AppButton>
                }
            />
        );
    }

    const image = gameImage(game);
    const providerName = game.provider_ref?.name ?? game.provider;

    return (
        <div className="space-y-10">
            <section className="relative overflow-hidden rounded-3xl border border-border">
                <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
                <div className="absolute inset-0 bg-linear-to-r from-plum-950 via-plum-950/85 to-plum-950/50" />
                <div className="relative grid gap-6 p-5 sm:p-8 md:grid-cols-[260px_1fr] md:items-center lg:grid-cols-[320px_1fr]">
                    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative mx-auto w-48 sm:w-56 md:w-full">
                        <div className="absolute -inset-3 rounded-[28px] bg-linear-to-br from-gold-400/40 to-ember-500/30 blur-2xl" />
                        <AppImage src={image} alt={game.name} wrapperClassName="relative aspect-[4/5] rounded-3xl ring-1 ring-gold-400/30" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="space-y-4 text-center md:text-left">
                        <Link href="/games" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="size-4" /> Lobby
                        </Link>
                        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                            {game.category ? (
                                <Link href={`/games/${game.category.slug}`}>
                                    <AppBadge tone="gold">{game.category.name}</AppBadge>
                                </Link>
                            ) : null}
                            {game.badge ? <AppBadge tone="ember">{titleCase(game.badge)}</AppBadge> : null}
                            {game.is_featured ? <AppBadge tone="violet">Editor&apos;s pick</AppBadge> : null}
                        </div>
                        <h1 className="font-display text-3xl font-extrabold text-balance sm:text-5xl">{game.name}</h1>
                        <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground md:justify-start">
                            {providerName ? (
                                <span className="inline-flex items-center gap-1.5">
                                    <Layers className="size-4 text-gold-300" /> {providerName}
                                </span>
                            ) : null}
                            <span className="inline-flex items-center gap-1.5">
                                <Users className="size-4 text-gold-300" /> {formatCompact(game.plays_count)} plays
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 pt-2 md:justify-start">
                            <AppButton size="xl" shine leftIcon={<Play className="fill-current" />} onClick={() => play("real")}>
                                Play now
                            </AppButton>
                            {game.has_demo !== false ? (
                                <AppButton size="xl" tone="outline" leftIcon={<Gamepad2 />} onClick={() => play("demo")}>
                                    Try demo
                                </AppButton>
                            ) : null}
                            <AppButton
                                size="xl"
                                tone="surface"
                                onClick={() => toggleFavorite(slug)}
                                leftIcon={<Heart className={cn(favorite && "fill-ember-500 text-ember-500")} />}
                                aria-pressed={favorite}
                            >
                                {favorite ? "Saved" : "Favorite"}
                            </AppButton>
                            <AppButton size="xl" tone="ghost" onClick={share} aria-label="Share game">
                                <Share2 />
                            </AppButton>
                        </div>
                    </motion.div>
                </div>
            </section>

            {data.related?.length ? (
                <AppSection title="You might also like" href={game.category ? `/games/${game.category.slug}` : "/games"}>
                    <GameRail games={data.related} />
                </AppSection>
            ) : null}

        </div>
    );
}
