"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck, Banknote, Bell, ChevronRight, ExternalLink, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Settings, UserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AppBadge, AppLogo } from "@/components/app";
import { adminNav } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { useAdminStats } from "@/lib/AdminAPI";
import { useLogout } from "@/lib/AuthenticationAPI";
import { initials, titleCase } from "@/lib/format";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores";

const SEGMENT_LABELS: Record<string, string> = {
    admin: "Dashboard",
    users: "Accounts",
    kyc: "KYC Review",
    transactions: "Cash In / Out",
    rounds: "Bet History",
    games: "Games",
    providers: "Providers",
    categories: "Categories",
    banners: "Banners",
    promotions: "Promotions",
    news: "News",
    settings: "Settings",
    roles: "Roles & Access",
    profile: "My Profile",
    new: "New",
};

function useBreadcrumbs() {
    const pathname = usePathname() ?? "/admin";
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => ({
        href: `/${segments.slice(0, index + 1).join("/")}`,
        label: SEGMENT_LABELS[segment] ?? (/^\d+$/.test(segment) ? `#${segment}` : titleCase(segment)),
        last: index === segments.length - 1,
    }));
}

function SidebarNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
    const pathname = usePathname() ?? "/admin";
    const { can } = useAuth();

    return (
        <nav className="space-y-5">
            {adminNav.map((group) => {
                const items = group.items.filter((item) => !item.permission || can(item.permission));
                if (!items.length) return null;
                return (
                    <div key={group.title}>
                        {!collapsed ? <div className="mb-1.5 px-3 text-[10px] font-bold tracking-[0.18em] text-muted-foreground/80 uppercase">{group.title}</div> : <div className="divider-fade mx-2 mb-2" />}
                        <div className="space-y-0.5">
                            {items.map((item) => {
                                const active = isActivePath(pathname, item.href, item.href === "/admin");
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onNavigate}
                                        title={collapsed ? item.label : undefined}
                                        className={cn(
                                            "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                                            collapsed && "justify-center px-0",
                                            active ? "bg-linear-to-r from-gold-400/18 to-transparent text-gold-200" : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                                        )}
                                    >
                                        {active ? <span className="bg-gold absolute top-2 bottom-2 left-0 w-1 rounded-full" /> : null}
                                        <item.icon className="size-[18px] shrink-0" />
                                        {!collapsed ? <span className="truncate">{item.label}</span> : null}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </nav>
    );
}

function ProfileCard({ collapsed }: { collapsed: boolean }) {
    const { user } = useAuth();
    const pathname = usePathname() ?? "";
    const name = user?.name || user?.email || "Admin";

    return (
        <Link
            href="/admin/profile"
            className={cn(
                "flex items-center gap-3 rounded-2xl border border-border bg-white/3 p-2 transition hover:border-gold-400/40",
                collapsed && "justify-center border-0 bg-transparent p-0",
                pathname.startsWith("/admin/profile") && "border-gold-400/40"
            )}
            title={collapsed ? "My profile" : undefined}
        >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-ember-500 to-gold-500 text-xs font-bold text-white">{initials(name)}</span>
            {!collapsed ? (
                <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{name}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">{titleCase(user?.role ?? "staff")}</span>
                </span>
            ) : null}
        </Link>
    );
}

function NotificationsMenu() {
    const { can } = useAuth();
    const { data } = useAdminStats(can("dashboard.view"));
    const enabled = can("dashboard.view");
    const pendingCash = data?.totals.pending_transactions ?? 0;
    const pendingKyc = data?.totals.pending_kyc ?? 0;
    const total = enabled ? pendingCash + pendingKyc : 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button type="button" className="relative grid size-10 place-items-center rounded-xl border border-border bg-white/3 transition hover:bg-white/7" aria-label="Notifications">
                    <Bell className="size-[18px]" />
                    {total ? <span className="bg-ember absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold text-white">{total > 99 ? "99+" : total}</span> : null}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10} className="w-72 rounded-2xl border-border bg-popover/95 p-1.5 backdrop-blur-xl">
                <DropdownMenuLabel className="px-2.5 py-2 text-xs tracking-wider text-muted-foreground uppercase">Needs attention</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                {can("transactions.view") ? (
                    <DropdownMenuItem asChild className="cursor-pointer gap-3 rounded-xl px-2.5 py-2.5 focus:bg-white/7">
                        <Link href="/admin/transactions">
                            <span className="grid size-9 place-items-center rounded-lg bg-gold-400/15 text-gold-300">
                                <Banknote className="size-4" />
                            </span>
                            <span className="flex-1">
                                <span className="block text-sm font-semibold">Cash in / out requests</span>
                                <span className="block text-xs text-muted-foreground">{pendingCash} pending review</span>
                            </span>
                        </Link>
                    </DropdownMenuItem>
                ) : null}
                {can("kyc.review") ? (
                    <DropdownMenuItem asChild className="cursor-pointer gap-3 rounded-xl px-2.5 py-2.5 focus:bg-white/7">
                        <Link href="/admin/kyc">
                            <span className="grid size-9 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
                                <BadgeCheck className="size-4" />
                            </span>
                            <span className="flex-1">
                                <span className="block text-sm font-semibold">Identity verifications</span>
                                <span className="block text-xs text-muted-foreground">{pendingKyc} waiting</span>
                            </span>
                        </Link>
                    </DropdownMenuItem>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function AccountMenu() {
    const { user, can } = useAuth();
    const logout = useLogout();
    const name = user?.name || user?.email || "Admin";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-2.5 rounded-xl border border-border bg-white/3 py-1 pr-3 pl-1 transition hover:bg-white/7">
                    <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-ember-500 to-gold-500 text-xs font-bold text-white">{initials(name)}</span>
                    <span className="hidden text-left leading-tight md:block">
                        <span className="block max-w-32 truncate text-xs font-bold">{name}</span>
                        <span className="block text-[10px] text-muted-foreground">{titleCase(user?.role ?? "staff")}</span>
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10} className="w-60 rounded-2xl border-border bg-popover/95 p-1.5 backdrop-blur-xl">
                <DropdownMenuLabel className="px-2.5 py-2">
                    <div className="truncate text-sm font-bold">{name}</div>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
                        <AppBadge size="sm" tone="ember">
                            {user?.role}
                        </AppBadge>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem asChild className="cursor-pointer gap-2.5 rounded-xl px-2.5 py-2 focus:bg-white/7 [&_svg]:size-4 [&_svg]:text-muted-foreground">
                    <Link href="/admin/profile">
                        <UserRound /> My profile
                    </Link>
                </DropdownMenuItem>
                {can("settings.manage") ? (
                    <DropdownMenuItem asChild className="cursor-pointer gap-2.5 rounded-xl px-2.5 py-2 focus:bg-white/7 [&_svg]:size-4 [&_svg]:text-muted-foreground">
                        <Link href="/admin/settings">
                            <Settings /> Settings
                        </Link>
                    </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem asChild className="cursor-pointer gap-2.5 rounded-xl px-2.5 py-2 focus:bg-white/7 [&_svg]:size-4 [&_svg]:text-muted-foreground">
                    <Link href="/" target="_blank">
                        <ExternalLink /> View site
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onSelect={() => logout.mutate()} className="cursor-pointer gap-2.5 rounded-xl px-2.5 py-2 text-red-300 focus:bg-destructive/15 focus:text-red-200 [&_svg]:size-4">
                    <LogOut /> Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const collapsed = useAdminStore((state) => state.sidebarCollapsed);
    const toggle = useAdminStore((state) => state.toggleSidebar);
    const mobileOpen = useAdminStore((state) => state.mobileSidebarOpen);
    const setMobileOpen = useAdminStore((state) => state.setMobileSidebar);
    const crumbs = useBreadcrumbs();
    const title = crumbs.at(-1)?.label ?? "Dashboard";

    return (
        <div className="flex min-h-dvh bg-plum-950">
            <aside className={cn("surface-strong sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border transition-[width] duration-300 lg:flex", collapsed ? "w-[76px]" : "w-64")}>
                <div className={cn("flex h-16 items-center justify-between border-b border-border px-4", collapsed && "justify-center px-0")}>
                    <AppLogo href="/admin" compact={collapsed} size="sm" />
                    {!collapsed ? (
                        <AppBadge size="sm" tone="ember">
                            Admin
                        </AppBadge>
                    ) : null}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-3">
                    <SidebarNav collapsed={collapsed} />
                </div>
                <div className="space-y-2 border-t border-border p-3">
                    <ProfileCard collapsed={collapsed} />
                    <button
                        type="button"
                        onClick={toggle}
                        className={cn("flex h-9 w-full items-center gap-3 rounded-xl px-3 text-xs font-semibold text-muted-foreground transition hover:bg-white/5 hover:text-foreground", collapsed && "justify-center px-0")}
                    >
                        {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
                        {!collapsed ? "Collapse sidebar" : null}
                    </button>
                </div>
            </aside>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="surface-strong flex w-72 flex-col border-border p-0 text-foreground">
                    <SheetHeader className="border-b border-border p-4">
                        <SheetTitle asChild>
                            <div className="flex items-center justify-between">
                                <AppLogo href={null} size="sm" />
                                <AppBadge size="sm" tone="ember">
                                    Admin
                                </AppBadge>
                            </div>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="min-h-0 flex-1 overflow-y-auto p-3">
                        <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
                    </div>
                    <div className="border-t border-border p-3" onClick={() => setMobileOpen(false)}>
                        <ProfileCard collapsed={false} />
                    </div>
                </SheetContent>
            </Sheet>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="glass sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border px-3 sm:px-6">
                    <button type="button" onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-xl hover:bg-white/6 lg:hidden" aria-label="Open navigation">
                        <Menu className="size-5" />
                    </button>
                    <div className="min-w-0">
                        <nav className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex" aria-label="Breadcrumb">
                            {crumbs.map((crumb) => (
                                <React.Fragment key={crumb.href}>
                                    {crumb.last ? (
                                        <span className="truncate font-semibold text-foreground/80">{crumb.label}</span>
                                    ) : (
                                        <>
                                            <Link href={crumb.href} className="truncate hover:text-foreground">
                                                {crumb.label}
                                            </Link>
                                            <ChevronRight className="size-3 shrink-0" />
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>
                        <div className="truncate font-display text-base font-bold sm:text-lg">{title}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <NotificationsMenu />
                        <AccountMenu />
                    </div>
                </header>
                <main className="mx-auto w-full max-w-[1500px] flex-1 p-3 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
