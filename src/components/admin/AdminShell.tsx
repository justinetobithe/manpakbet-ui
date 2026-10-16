"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AppBadge, AppButton, AppLogo } from "@/components/app";
import { adminNav } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/lib/AuthenticationAPI";
import { initials, titleCase } from "@/lib/format";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores";

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

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const collapsed = useAdminStore((state) => state.sidebarCollapsed);
    const toggle = useAdminStore((state) => state.toggleSidebar);
    const mobileOpen = useAdminStore((state) => state.mobileSidebarOpen);
    const setMobileOpen = useAdminStore((state) => state.setMobileSidebar);
    const { user } = useAuth();
    const logout = useLogout();
    const pathname = usePathname() ?? "/admin";

    const current = adminNav.flatMap((group) => group.items).find((item) => isActivePath(pathname, item.href, item.href === "/admin"));
    const name = user?.name || user?.email || "Admin";

    return (
        <div className="flex min-h-dvh">
            <aside className={cn("surface-strong sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border transition-[width] duration-300 lg:flex", collapsed ? "w-[76px]" : "w-64")}>
                <div className={cn("flex h-16 items-center border-b border-border px-4", collapsed && "justify-center px-0")}>
                    <AppLogo href="/admin" compact={collapsed} size="sm" />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-3">
                    <SidebarNav collapsed={collapsed} />
                </div>
                <div className="border-t border-border p-3">
                    <button
                        type="button"
                        onClick={toggle}
                        className={cn("flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition hover:bg-white/5 hover:text-foreground", collapsed && "justify-center px-0")}
                    >
                        {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
                        {!collapsed ? "Collapse" : null}
                    </button>
                </div>
            </aside>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="surface-strong w-72 border-border p-0 text-foreground">
                    <SheetHeader className="border-b border-border p-4">
                        <SheetTitle asChild>
                            <div>
                                <AppLogo href={null} size="sm" />
                            </div>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto p-3">
                        <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
                    </div>
                </SheetContent>
            </Sheet>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="glass sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border px-3 sm:px-6">
                    <button type="button" onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-xl hover:bg-white/6 lg:hidden" aria-label="Open navigation">
                        <Menu className="size-5" />
                    </button>
                    <div className="min-w-0">
                        <div className="text-[10px] font-bold tracking-[0.2em] text-gold-300/80 uppercase">Admin Console</div>
                        <div className="truncate font-display text-sm font-bold sm:text-base">{current?.label ?? "Dashboard"}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <AppButton asChild tone="surface" size="sm" className="hidden sm:inline-flex">
                            <Link href="/" target="_blank">
                                View site <ExternalLink className="size-3.5" />
                            </Link>
                        </AppButton>
                        <div className="hidden items-center gap-2.5 rounded-xl border border-border bg-white/3 py-1 pr-3 pl-1 md:flex">
                            <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-ember-500 to-gold-500 text-xs font-bold text-white">{initials(name)}</span>
                            <div className="leading-tight">
                                <div className="max-w-32 truncate text-xs font-bold">{name}</div>
                                <AppBadge size="sm" tone="ember" className="mt-0.5">
                                    {titleCase(user?.role ?? "staff")}
                                </AppBadge>
                            </div>
                        </div>
                        <AppButton tone="ghost" size="icon" onClick={() => logout.mutate()} aria-label="Log out" loading={logout.isPending}>
                            {!logout.isPending ? <LogOut /> : null}
                        </AppButton>
                    </div>
                </header>
                <main className="mx-auto w-full max-w-[1500px] flex-1 p-3 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
