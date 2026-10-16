"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, UserPlus } from "lucide-react";
import { bottomTabs } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores";

export default function AppBottomTabs() {
    const pathname = usePathname() ?? "/";
    const { isAuthenticated } = useAuth();
    const openAuth = useUiStore((state) => state.openAuth);
    const openWallet = useUiStore((state) => state.openWallet);

    const [left, right] = [bottomTabs.slice(0, 2), bottomTabs.slice(2)];

    const renderTab = (tab: (typeof bottomTabs)[number]) => {
        const active = isActivePath(pathname, tab.href);
        const Icon = tab.icon;
        const guarded = tab.href === "/account" && !isAuthenticated;

        const content = (
            <>
                {active ? <motion.span layoutId="tab-active" className="absolute inset-x-3 -top-px h-0.5 rounded-full bg-gold shadow-[0_0_14px_rgba(255,194,61,0.8)]" /> : null}
                <Icon className={cn("size-[22px] transition", active ? "text-gold-300" : "text-foreground/60")} />
                <span className={cn("text-[10.5px] font-semibold", active ? "text-gold-200" : "text-foreground/60")}>{tab.label}</span>
            </>
        );

        const className = "relative flex flex-1 flex-col items-center justify-center gap-1 py-2 active:scale-95 transition";

        if (guarded) {
            return (
                <button key={tab.href} type="button" onClick={() => openAuth("login")} className={className}>
                    {content}
                </button>
            );
        }

        return (
            <Link key={tab.href} href={tab.href} className={className}>
                {content}
            </Link>
        );
    };

    return (
        <nav className="glass pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border lg:hidden">
            <div className="mx-auto flex h-16 max-w-xl items-stretch px-2">
                {left.map(renderTab)}
                <div className="relative flex w-20 shrink-0 justify-center">
                    <button
                        type="button"
                        onClick={() => (isAuthenticated ? openWallet("deposit") : openAuth("register"))}
                        className="bg-gold ring-gold absolute -top-5 grid size-14 animate-pulse-ring place-items-center rounded-2xl border-4 border-plum-950 text-[#2a1600] transition active:scale-95"
                        aria-label={isAuthenticated ? "Deposit" : "Join now"}
                    >
                        {isAuthenticated ? <Plus className="size-6" strokeWidth={2.75} /> : <UserPlus className="size-6" strokeWidth={2.5} />}
                    </button>
                    <span className="absolute bottom-2 text-[10.5px] font-bold text-gold-200">{isAuthenticated ? "Deposit" : "Join"}</span>
                </div>
                {right.map(renderTab)}
            </div>
        </nav>
    );
}
