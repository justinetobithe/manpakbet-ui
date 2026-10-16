"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Search } from "lucide-react";
import { AppButton, AppLogo } from "@/components/app";
import { primaryNav } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores";
import UserMenu from "./UserMenu";
import WalletChip from "./WalletChip";

export default function SiteHeader() {
    const pathname = usePathname() ?? "/";
    const { isAuthenticated, isLoading } = useAuth();
    const openAuth = useUiStore((state) => state.openAuth);
    const setMobileNav = useUiStore((state) => state.setMobileNav);
    const setSearch = useUiStore((state) => state.setSearch);

    return (
        <header className="glass sticky top-0 z-50 border-b border-border">
            <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-3 sm:gap-3 sm:px-5">
                <button
                    type="button"
                    onClick={() => setMobileNav(true)}
                    className="grid size-10 place-items-center rounded-xl text-foreground/85 transition hover:bg-white/7 lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="size-5" />
                </button>

                <AppLogo size="sm" className="sm:hidden" compact />
                <AppLogo size="md" className="hidden sm:inline-flex" />

                <nav className="ml-4 hidden min-w-0 items-center gap-0.5 lg:flex">
                    {primaryNav.map((item) => {
                        const active = isActivePath(pathname, item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-[13px] font-semibold whitespace-nowrap transition-colors",
                                    active ? "text-gold-200" : "text-foreground/70 hover:text-foreground"
                                )}
                            >
                                {active ? (
                                    <motion.span
                                        layoutId="nav-active"
                                        className="absolute inset-0 rounded-xl bg-linear-to-b from-gold-400/18 to-gold-400/5 ring-1 ring-gold-400/25"
                                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                    />
                                ) : null}
                                <Icon className="relative size-4" />
                                <span className="relative">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                    <button
                        type="button"
                        onClick={() => setSearch(true)}
                        className="hidden h-10 items-center gap-2 rounded-xl border border-border bg-white/4 px-3 text-sm text-muted-foreground transition hover:border-white/20 hover:text-foreground md:inline-flex"
                    >
                        <Search className="size-4" />
                        <span className="hidden xl:inline">Search games</span>
                        <kbd className="hidden rounded-md border border-border bg-black/30 px-1.5 py-0.5 text-[10px] font-semibold xl:inline">/</kbd>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSearch(true)}
                        className="grid size-10 place-items-center rounded-xl text-foreground/85 transition hover:bg-white/7 md:hidden"
                        aria-label="Search games"
                    >
                        <Search className="size-5" />
                    </button>

                    {isLoading ? (
                        <div className="h-10 w-36 animate-pulse rounded-2xl bg-white/6" />
                    ) : isAuthenticated ? (
                        <>
                            <WalletChip />
                            <div className="hidden sm:block">
                                <UserMenu />
                            </div>
                        </>
                    ) : (
                        <>
                            <AppButton tone="surface" size="sm" onClick={() => openAuth("login")} className="h-10">
                                Log in
                            </AppButton>
                            <AppButton tone="gold" size="sm" shine onClick={() => openAuth("register")} className="h-10">
                                Join Now
                            </AppButton>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
