"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Expand, Gamepad2, Minimize, Plug, Plus, RotateCcw, Wallet, X } from "lucide-react";
import { AppAmount, AppBadge, AppButton, AppImage, AppLogoMark } from "@/components/app";
import { gameImage } from "@/lib/assets";
import apiError from "@/lib/apiError";
import { useEndGameSession, useGame, useLaunchGame } from "@/lib/CasinoAPI";
import { useWallet } from "@/lib/WalletAPI";
import { cn } from "@/lib/utils";
import { useGameStore, useUiStore } from "@/stores";
import type { GameLaunch, GameMode } from "@/types/Casino";

type LaunchState = { status: "loading" } | { status: "ready"; launch: GameLaunch; message: string } | { status: "error"; message: string; code?: string };

export default function GameLauncher({ slug }: { slug: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode: GameMode = searchParams.get("mode") === "demo" ? "demo" : "real";
    const { data: gameData } = useGame(slug);
    const { data: wallet, refetch: refetchWallet } = useWallet();
    const launch = useLaunchGame();
    const endSession = useEndGameSession();
    const pushRecent = useGameStore((state) => state.pushRecent);
    const openWallet = useUiStore((state) => state.openWallet);
    const [state, setState] = React.useState<LaunchState>({ status: "loading" });
    const [attempt, setAttempt] = React.useState(0);
    const [fullscreen, setFullscreen] = React.useState(false);
    const stageRef = React.useRef<HTMLDivElement>(null);
    const tokenRef = React.useRef<string | null>(null);
    const launchRef = React.useRef(launch.mutateAsync);
    const endRef = React.useRef(endSession.mutate);

    React.useEffect(() => {
        launchRef.current = launch.mutateAsync;
        endRef.current = endSession.mutate;
    });

    React.useEffect(() => {
        let cancelled = false;

        launchRef
            .current({ slug, mode })
            .then((response) => {
                if (cancelled) return;
                tokenRef.current = response.data.session.token;
                pushRecent(slug);
                setState({ status: "ready", launch: response.data, message: response.message });
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                const code = (err as { response?: { data?: { data?: { code?: string } } } })?.response?.data?.data?.code;
                setState({ status: "error", message: apiError(err, "Unable to start this game"), code });
            });

        return () => {
            cancelled = true;
            if (tokenRef.current) {
                endRef.current(tokenRef.current);
                tokenRef.current = null;
            }
        };
    }, [slug, mode, attempt, pushRecent]);

    React.useEffect(() => {
        if (state.status !== "ready" || mode !== "real") return;
        const timer = window.setInterval(() => void refetchWallet(), 10000);
        return () => window.clearInterval(timer);
    }, [state.status, mode, refetchWallet]);

    React.useEffect(() => {
        const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    const toggleFullscreen = () => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void stageRef.current?.requestFullscreen?.();
    };

    const retry = () => {
        setState({ status: "loading" });
        setAttempt((value) => value + 1);
    };

    const close = () => router.push(`/play/${slug}`);

    const game = state.status === "ready" ? state.launch.game : gameData?.data;
    const image = game ? gameImage(game) : null;

    return (
        <div className="flex h-dvh flex-col bg-plum-950">
            <header className="glass relative z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border px-2 sm:h-16 sm:gap-3 sm:px-4">
                <Link href={`/play/${slug}`} className="grid size-10 shrink-0 place-items-center rounded-xl text-foreground/80 transition hover:bg-fg/7" aria-label="Back to game">
                    <ArrowLeft className="size-5" />
                </Link>
                <div className="flex min-w-0 items-center gap-2.5">
                    {image ? <AppImage src={image} alt="" wrapperClassName="size-9 shrink-0 rounded-lg ring-1 ring-border" /> : <AppLogoMark className="size-9 shrink-0" />}
                    <div className="min-w-0">
                        <div className="truncate text-sm font-bold">{game?.name ?? "Loading game…"}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <AppBadge size="sm" tone={mode === "demo" ? "violet" : "gold"}>
                                {mode === "demo" ? "Demo" : "Real money"}
                            </AppBadge>
                            <span className="hidden truncate sm:inline">{game?.provider_ref?.name ?? game?.provider}</span>
                        </div>
                    </div>
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
                    {mode === "real" ? (
                        <div className="hidden items-center gap-2 rounded-xl border border-border bg-fg/5 px-3 py-1.5 sm:flex">
                            <Wallet className="size-4 text-gold-300" />
                            <AppAmount value={wallet?.balance} className="text-sm font-bold text-gold-200" />
                        </div>
                    ) : null}
                    <AppButton size="sm" leftIcon={<Plus />} onClick={() => openWallet("deposit")} className="h-9">
                        <span className="hidden sm:inline">Deposit</span>
                    </AppButton>
                    {state.status === "ready" && state.launch.launch_url ? (
                        <AppButton tone="ghost" size="icon-sm" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
                            {fullscreen ? <Minimize /> : <Expand />}
                        </AppButton>
                    ) : null}
                    <AppButton tone="surface" size="icon-sm" onClick={close} aria-label="Close game">
                        <X />
                    </AppButton>
                </div>
            </header>

            <div ref={stageRef} className="relative min-h-0 flex-1 bg-black">
                {image ? <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-3xl" /> : null}

                <AnimatePresence mode="wait">
                    {state.status === "loading" ? (
                        <Panel key="loading">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, ease: "linear", repeat: Infinity }} className="size-16 rounded-full border-4 border-gold-400/20 border-t-gold-400" />
                            <div className="space-y-1">
                                <div className="font-display text-xl font-extrabold">Opening your table…</div>
                                <p className="text-sm text-muted-foreground">Connecting to the game studio securely.</p>
                            </div>
                        </Panel>
                    ) : state.status === "error" ? (
                        <Panel key="error">
                            <div className="grid size-16 place-items-center rounded-2xl bg-destructive/15 text-red-300 ring-1 ring-destructive/30">
                                <AlertTriangle className="size-8" />
                            </div>
                            <div className="space-y-1">
                                <div className="font-display text-xl font-extrabold">{state.code === "INSUFFICIENT_FUNDS" ? "Top up to play" : "Couldn't start the game"}</div>
                                <p className="max-w-sm text-sm text-muted-foreground">{state.message}</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {state.code === "INSUFFICIENT_FUNDS" ? (
                                    <>
                                        <AppButton leftIcon={<Plus />} onClick={() => openWallet("deposit")}>
                                            Deposit now
                                        </AppButton>
                                        {game?.has_demo !== false ? (
                                            <AppButton tone="surface" onClick={() => router.replace(`/play/${slug}/launch?mode=demo`)}>
                                                Try demo
                                            </AppButton>
                                        ) : null}
                                    </>
                                ) : (
                                    <AppButton tone="surface" leftIcon={<RotateCcw />} onClick={retry}>
                                        Try again
                                    </AppButton>
                                )}
                            </div>
                        </Panel>
                    ) : state.launch.launch_url ? (
                        <motion.iframe
                            key="frame"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={state.launch.launch_url}
                            title={state.launch.game.name}
                            allow="autoplay; fullscreen; clipboard-write"
                            className="relative h-full w-full border-0"
                        />
                    ) : (
                        <Panel key="offline">
                            <div className="relative">
                                <div className="absolute -inset-3 rounded-[26px] bg-linear-to-br from-gold-400/40 to-ember-500/30 blur-xl" />
                                {image ? <AppImage src={image} alt="" wrapperClassName="relative aspect-[4/5] w-36 rounded-2xl ring-2 ring-gold-400/50" /> : <Gamepad2 className="relative size-16 text-gold-300" />}
                            </div>
                            <div className="space-y-2">
                                <AppBadge tone="warning" dot>
                                    <Plug className="size-3" /> Studio not connected
                                </AppBadge>
                                <div className="font-display text-2xl font-extrabold">Your seat is reserved</div>
                                <p className="max-w-md text-sm text-muted-foreground">
                                    A secure game session was created, but this game&apos;s studio isn&apos;t connected yet, so it can&apos;t open. No money was
                                    taken from your balance.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                <AppButton asChild tone="surface">
                                    <Link href="/games">Browse other games</Link>
                                </AppButton>
                                <AppButton leftIcon={<RotateCcw />} onClick={retry}>
                                    Check again
                                </AppButton>
                            </div>
                        </Panel>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function Panel({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className={cn("relative flex h-full flex-col items-center justify-center gap-5 p-6 text-center")}
        >
            {children}
        </motion.div>
    );
}
