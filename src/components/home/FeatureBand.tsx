"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Gauge, Lock, Smartphone } from "lucide-react";
import { AppButton } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { useUiStore } from "@/stores";

const features = [
    { icon: Gauge, title: "Lightning lobby", text: "Instant search, smart filters and favorites that follow you." },
    { icon: Lock, title: "Locked-down wallet", text: "Every deposit and payout is reviewed and fully traceable." },
    { icon: Smartphone, title: "Made for mobile", text: "Thumb-friendly navigation built for one-handed play." },
    { icon: BadgeCheck, title: "Fair & licensed", text: "Certified studios and responsible gaming tools built in." },
];

export default function FeatureBand() {
    const { isAuthenticated } = useAuth();
    const openAuth = useUiStore((state) => state.openAuth);
    const openWallet = useUiStore((state) => state.openWallet);

    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-border bg-linear-to-br from-plum-700/70 via-plum-850 to-plum-900 p-6 sm:p-10">
            <div className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-ember-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-20 size-96 rounded-full bg-gold-400/15 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
                    <div className="text-[11px] font-bold tracking-[0.22em] text-gold-300 uppercase">Why ManpakBet</div>
                    <h2 className="font-display text-3xl leading-tight font-extrabold text-balance sm:text-4xl">
                        A lobby that feels <span className="text-gold">fast, fair</span> and yours.
                    </h2>
                    <p className="max-w-md text-sm text-muted-foreground">
                        Everything from sign-up to cash-out is designed to get out of your way so you can focus on the game.
                    </p>
                    <AppButton size="lg" shine onClick={() => (isAuthenticated ? openWallet("deposit") : openAuth("register"))}>
                        {isAuthenticated ? "Top up wallet" : "Create free account"}
                    </AppButton>
                </motion.div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {features.map(({ icon: Icon, title, text }, index) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
                            whileHover={{ y: -4 }}
                            className="rounded-2xl border border-border bg-black/25 p-5 backdrop-blur"
                        >
                            <div className="mb-3 grid size-11 place-items-center rounded-xl bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/25">
                                <Icon className="size-5" />
                            </div>
                            <div className="font-display font-bold">{title}</div>
                            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
