"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ShieldCheck, Wallet } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AppAmount, AppButton, AppLogo } from "@/components/app";
import { categoryIcons, primaryNav, secondaryNav } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/lib/AuthenticationAPI";
import { useCategories } from "@/lib/CasinoAPI";
import { isActivePath } from "@/lib/navigation";
import { useWallet } from "@/lib/WalletAPI";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores";
import { Gamepad2 } from "lucide-react";

export default function MobileNav() {
    const pathname = usePathname() ?? "/";
    const open = useUiStore((state) => state.mobileNavOpen);
    const setOpen = useUiStore((state) => state.setMobileNav);
    const openAuth = useUiStore((state) => state.openAuth);
    const openWallet = useUiStore((state) => state.openWallet);
    const { user, isAuthenticated, isBackoffice } = useAuth();
    const { data: categories } = useCategories();
    const { data: wallet } = useWallet(isAuthenticated);
    const logout = useLogout();

    const close = () => setOpen(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="surface-strong flex w-[86vw] max-w-sm flex-col gap-0 border-border p-0 text-foreground">
                <SheetHeader className="border-b border-border p-4">
                    <SheetTitle asChild>
                        <div>
                            <AppLogo href={null} />
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    {isAuthenticated ? (
                        <div className="border-gradient relative overflow-hidden rounded-2xl bg-linear-to-br from-plum-700 to-plum-850 p-4">
                            <div className="text-xs text-muted-foreground">Welcome back,</div>
                            <div className="truncate font-display text-lg font-bold">{user?.name || "Player"}</div>
                            <div className="mt-3 flex items-end justify-between gap-3">
                                <div>
                                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Balance</div>
                                    <AppAmount value={wallet?.balance} className="text-xl font-extrabold text-gold-200" />
                                </div>
                                <AppButton size="sm" leftIcon={<Wallet />} onClick={() => openWallet("deposit")}>
                                    Deposit
                                </AppButton>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <AppButton tone="surface" onClick={() => openAuth("login")}>
                                Log in
                            </AppButton>
                            <AppButton shine onClick={() => openAuth("register")}>
                                Join Now
                            </AppButton>
                        </div>
                    )}

                    <NavGroup title="Lobby">
                        {primaryNav.map((item) => (
                            <NavLink key={item.href} href={item.href} label={item.label} icon={<item.icon />} active={isActivePath(pathname, item.href)} onClick={close} />
                        ))}
                    </NavGroup>

                    {categories?.length ? (
                        <NavGroup title="Categories">
                            <div className="grid grid-cols-2 gap-1.5">
                                {categories.map((category) => {
                                    const Icon = categoryIcons[category.icon ?? ""] ?? Gamepad2;
                                    return (
                                        <Link
                                            key={category.id}
                                            href={`/games/${category.slug}`}
                                            onClick={close}
                                            className={cn(
                                                "flex items-center gap-2 rounded-xl border border-border bg-white/3 px-2.5 py-2 text-xs font-semibold transition hover:border-gold-400/40",
                                                isActivePath(pathname, `/games/${category.slug}`) && "border-gold-400/40 text-gold-200"
                                            )}
                                        >
                                            <Icon className="size-3.5 text-gold-300" />
                                            <span className="truncate">{category.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </NavGroup>
                    ) : null}

                    <NavGroup title="More">
                        {secondaryNav.map((item) => (
                            <NavLink key={item.href} href={item.href} label={item.label} icon={<item.icon />} active={isActivePath(pathname, item.href, true)} onClick={close} />
                        ))}
                        {isBackoffice ? <NavLink href="/admin" label="Admin Console" icon={<ShieldCheck />} active={false} onClick={close} /> : null}
                    </NavGroup>
                </div>

                {isAuthenticated ? (
                    <div className="border-t border-border p-4">
                        <AppButton tone="surface" block leftIcon={<LogOut />} onClick={() => logout.mutate()} loading={logout.isPending}>
                            Log out
                        </AppButton>
                    </div>
                ) : null}
            </SheetContent>
        </Sheet>
    );
}

function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mt-6">
            <div className="mb-2 px-1 text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">{title}</div>
            <div className="space-y-1">{children}</div>
        </div>
    );
}

function NavLink({ href, label, icon, active, onClick }: { href: string; label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition [&_svg]:size-[18px]",
                active ? "bg-gold-400/12 text-gold-200 ring-1 ring-gold-400/25" : "text-foreground/80 hover:bg-white/5"
            )}
        >
            {icon}
            {label}
        </Link>
    );
}
