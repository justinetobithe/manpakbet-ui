"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AppAmount, AppBadge } from "@/components/app";
import { accountNav } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { initials, titleCase } from "@/lib/format";
import { isActivePath } from "@/lib/navigation";
import { useWallet } from "@/lib/WalletAPI";
import { cn } from "@/lib/utils";

export default function AccountShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() ?? "/account";
    const { user } = useAuth();
    const { data: wallet } = useWallet(Boolean(user));
    const name = user?.name || user?.email || user?.phone || "Player";

    return (
        <div className="grid gap-5 lg:grid-cols-[280px_1fr] lg:gap-6">
            <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
                <div className="border-gradient relative overflow-hidden rounded-3xl bg-linear-to-br from-plum-700 via-plum-850 to-plum-900 p-5">
                    <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-gold-400/15 blur-2xl" />
                    <div className="relative flex items-center gap-3">
                        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-ember-500 to-gold-500 font-display text-lg font-extrabold text-white">{initials(name)}</div>
                        <div className="min-w-0">
                            <div className="truncate font-display font-bold">{name}</div>
                            <AppBadge size="sm" tone="gold">
                                {titleCase(user?.role ?? "player")}
                            </AppBadge>
                        </div>
                    </div>
                    <div className="relative mt-4 rounded-2xl bg-black/30 p-3">
                        <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Balance</div>
                        <AppAmount value={wallet?.balance} className="font-display text-2xl font-extrabold text-gold-200" />
                    </div>
                </div>

                <nav className="no-scrollbar -mx-3 flex gap-1.5 overflow-x-auto px-3 lg:mx-0 lg:flex-col lg:px-0">
                    {accountNav.map((item) => {
                        const active = isActivePath(pathname, item.href, item.href === "/account");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative inline-flex h-11 shrink-0 items-center gap-2.5 rounded-xl px-4 text-sm font-semibold transition",
                                    active ? "text-gold-200" : "text-foreground/70 hover:bg-white/4 hover:text-foreground"
                                )}
                            >
                                {active ? <motion.span layoutId="account-nav" className="absolute inset-0 rounded-xl bg-gold-400/12 ring-1 ring-gold-400/30" /> : null}
                                <item.icon className="relative size-4" />
                                <span className="relative">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <div className="min-w-0">{children}</div>
        </div>
    );
}
