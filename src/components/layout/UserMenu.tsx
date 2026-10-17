"use client";

import Link from "next/link";
import { BadgeCheck, History, LayoutDashboard, LogOut, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppBadge } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/lib/AuthenticationAPI";
import { initials, titleCase } from "@/lib/format";

export default function UserMenu() {
    const { user, isBackoffice } = useAuth();
    const logout = useLogout();

    if (!user) return null;

    const displayName = user.name || user.email || user.phone || "Player";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative grid size-10 place-items-center rounded-2xl bg-linear-to-br from-ember-500 to-gold-500 p-[1.5px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    aria-label="Account menu"
                >
                    <span className="grid size-full place-items-center rounded-[14px] bg-plum-850 font-display text-sm font-bold text-gold-200">{initials(displayName)}</span>
                    <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-plum-950 bg-jade-400" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-2xl border-border bg-popover/95 p-1.5 backdrop-blur-xl">
                <DropdownMenuLabel className="px-2.5 py-2">
                    <div className="truncate text-sm font-bold text-foreground">{displayName}</div>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="truncate text-xs font-normal text-muted-foreground">{user.email ?? user.phone}</span>
                        <AppBadge size="sm" tone={isBackoffice ? "ember" : "gold"}>
                            {titleCase(user.role)}
                        </AppBadge>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <MenuLink href="/account" icon={<LayoutDashboard />} label="My Account" />
                <MenuLink href="/account/wallet" icon={<Wallet />} label="Wallet" />
                <MenuLink href="/account/history" icon={<History />} label="History" />
                <MenuLink href="/account/verification" icon={<BadgeCheck />} label="Verification" />
                <MenuLink href="/account/profile" icon={<UserRound />} label="Profile & Security" />
                {isBackoffice ? (
                    <>
                        <DropdownMenuSeparator className="bg-border" />
                        <MenuLink href="/admin" icon={<ShieldCheck />} label="Admin Console" />
                    </>
                ) : null}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                    onSelect={() => logout.mutate()}
                    className="cursor-pointer gap-2.5 rounded-xl px-2.5 py-2 text-red-300 focus:bg-destructive/15 focus:text-red-200 [&_svg]:size-4"
                >
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function MenuLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <DropdownMenuItem asChild className="cursor-pointer gap-2.5 rounded-xl px-2.5 py-2 focus:bg-fg/7 [&_svg]:size-4 [&_svg]:text-muted-foreground">
            <Link href={href}>
                {icon}
                {label}
            </Link>
        </DropdownMenuItem>
    );
}
