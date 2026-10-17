"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Search } from "lucide-react";
import { AppButton, AppLogo, AppThemeToggle } from "@/components/app";
import { primaryNav, secondaryNav } from "@/config/site";
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
            <div className="mx-auto flex h-16 max-w-350 items-center gap-2 px-3 sm:gap-4 sm:px-5">
                <button
                    type="button"
                    onClick={() => setMobileNav(true)}
                    className="-ml-1 grid size-10 shrink-0 place-items-center rounded-xl text-foreground/85 transition hover:bg-fg/7 lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="size-5" />
                </button>

                <div className="shrink-0">
                    <AppLogo size="md" textClassName="hidden sm:inline" />
                </div>

                <button
                    type="button"
                    onClick={() => setSearch(true)}
                    className="mx-auto hidden h-11 w-full max-w-md items-center gap-3 rounded-2xl border border-border bg-fg/4 px-4 text-sm text-muted-foreground transition hover:border-gold-400/35 hover:bg-fg/6 md:flex"
                >
                    <Search className="size-4 shrink-0 text-gold-300" />
                    <span className="flex-1 truncate text-left">Search slots, live tables, studios…</span>
                    <kbd className="rounded-md border border-border bg-fg/5 px-1.5 py-0.5 text-[10px] font-semibold">/</kbd>
                </button>

                <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 md:ml-0">
                    <button
                        type="button"
                        onClick={() => setSearch(true)}
                        className="grid size-10 place-items-center rounded-xl text-foreground/85 transition hover:bg-fg/7 md:hidden"
                        aria-label="Search games"
                    >
                        <Search className="size-5" />
                    </button>

                    <AppThemeToggle className="hidden sm:inline-flex" />

                    {isLoading ? (
                        <div className="h-10 w-40 animate-pulse rounded-2xl bg-fg/6" />
                    ) : isAuthenticated ? (
                        <>
                            <WalletChip />
                            <div className="hidden sm:block">
                                <UserMenu />
                            </div>
                        </>
                    ) : (
                        <>
                            <AppButton tone="surface" size="sm" onClick={() => openAuth("login")} className="h-10 px-3 sm:px-4">
                                Log in
                            </AppButton>
                            <AppButton tone="gold" size="sm" shine onClick={() => openAuth("register")} className="h-10 px-3 sm:px-4">
                                Join Now
                            </AppButton>
                        </>
                    )}
                </div>
            </div>

            <nav className="hidden border-t border-border/60 bg-fg/5 lg:block">
                <div className="mx-auto flex h-12 max-w-350 items-center justify-between gap-4 px-5">
                    <div className="flex items-center gap-1">
                        {primaryNav.map((item) => {
                            const active = isActivePath(pathname, item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative inline-flex h-12 items-center gap-2 px-3.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors",
                                        active ? "text-gold-200" : "text-foreground/65 hover:text-foreground"
                                    )}
                                >
                                    <Icon className={cn("size-4", active ? "text-gold-300" : "text-foreground/45")} />
                                    {item.label}
                                    {active ? (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="bg-gold absolute inset-x-3 bottom-0 h-0.5 rounded-full shadow-[0_0_12px_rgba(255,194,61,0.7)]"
                                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                                        />
                                    ) : null}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-1">
                        {secondaryNav.map((item) => {
                            const active = isActivePath(pathname, item.href, true);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold whitespace-nowrap transition",
                                        active ? "bg-fg/8 text-foreground" : "text-muted-foreground hover:bg-fg/5 hover:text-foreground"
                                    )}
                                >
                                    <Icon className="size-3.5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </header>
    );
}
