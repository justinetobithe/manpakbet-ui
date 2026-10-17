"use client";

import { Suspense } from "react";
import { Gift, ShieldCheck, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AppLogo } from "@/components/app";
import { useUiStore } from "@/stores";
import AuthForm from "./AuthForm";

const perks = [
    { icon: Gift, text: "100% welcome boost on your first deposit" },
    { icon: Zap, text: "Instant GCash & Maya top-ups" },
    { icon: ShieldCheck, text: "Bank-grade account protection" },
];

export default function AuthDialog() {
    const open = useUiStore((state) => state.authOpen);
    const mode = useUiStore((state) => state.authMode);
    const close = useUiStore((state) => state.closeAuth);
    const setMode = useUiStore((state) => state.setAuthMode);

    return (
        <Dialog open={open} onOpenChange={(value) => (!value ? close() : undefined)}>
            <DialogContent className="surface-strong max-h-[94dvh] w-[calc(100vw-1rem)] overflow-hidden rounded-3xl border-border p-0 sm:max-w-[920px]">
                <DialogTitle className="sr-only">{mode === "login" ? "Log in" : "Create account"}</DialogTitle>
                <DialogDescription className="sr-only">Access your ManpakBet account</DialogDescription>
                <div className="grid max-h-[94dvh] md:grid-cols-[0.9fr_1.1fr]">
                    <AuthShowcase />
                    <div className="overflow-y-auto p-5 sm:p-7">
                        <div className="mb-5 md:hidden">
                            <AppLogo href={null} size="sm" />
                        </div>
                        <h2 className="font-display text-2xl font-extrabold">{mode === "login" ? "Welcome back" : "Join the table"}</h2>
                        <p className="mt-1 mb-5 text-sm text-muted-foreground">
                            {mode === "login" ? "Log in to continue where you left off." : "Create your account in under a minute."}
                        </p>
                        <Suspense>
                            <AuthForm mode={mode} onModeChange={setMode} onSuccess={close} />
                        </Suspense>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function AuthShowcase() {
    return (
        <div className="relative hidden overflow-hidden bg-[#120a1f] text-white md:block">
            <img src="/banners/auth-panel.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0b0613] via-[#0b0613]/50 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-7">
                <AppLogo href={null} inverted />
                <div className="space-y-4">
                    <h3 className="font-display text-3xl leading-tight font-extrabold">
                        Play bold.
                        <br />
                        <span className="bg-linear-to-b from-[#fff1c2] via-[#ffd36b] to-[#f5a524] bg-clip-text text-transparent">Win brighter.</span>
                    </h3>
                    <ul className="space-y-2.5">
                        {perks.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                                <span className="grid size-8 place-items-center rounded-lg bg-gold-400/20 text-[#ffd36b] ring-1 ring-gold-400/30">
                                    <Icon className="size-4" />
                                </span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
