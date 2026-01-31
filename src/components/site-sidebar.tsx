"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AppButton } from "@/components/app-button";
import { Gamepad2, Newspaper, Percent, User, TvMinimalPlay } from "lucide-react";

type NavItem = { href: string; label: string; icon: React.ElementType };

const nav: NavItem[] = [
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/live-games", label: "Live Games", icon: TvMinimalPlay },
    { href: "/promo", label: "Promo", icon: Percent },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/account", label: "Account", icon: User },
];

export function SiteSidebar({ onOpenAuth }: { onOpenAuth: () => void }) {
    const pathname = usePathname();

    const activeHref = useMemo(() => {
        const exact = nav.find((n) => n.href === pathname);
        if (exact) return exact.href;
        const starts = nav.find((n) => pathname?.startsWith(n.href));
        return starts?.href ?? nav[0]?.href ?? "/games";
    }, [pathname]);

    return (
        <aside className="sticky top-0 hidden h-dvh w-[280px] shrink-0 border-r border-white/10 bg-white/[0.03] p-4 lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="relative h-14 w-full">
                    <Image src="/logo.png" alt="ManpakBet" fill className="object-contain object-center" priority />
                </div>

                <AppButton className="mt-4 w-full" onClick={onOpenAuth}>
                    Login / Register
                </AppButton>
            </div>

            <nav className="mt-4 space-y-2">
                {nav.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === activeHref;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition",
                                active
                                    ? "border-primary/35 bg-primary/15 text-white"
                                    : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]"
                            )}
                        >
                            <span className={cn("grid h-9 w-9 place-items-center rounded-xl", active ? "bg-primary/20" : "bg-white/5")}>
                                <Icon className="h-4 w-4" />
                            </span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="text-xs font-semibold text-white/80">Download App</div>
                <div className="mt-2 grid place-items-center rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/60">
                    QR Placeholder
                </div>
            </div>

            <div className="mt-auto pt-4">
                <Separator className="bg-white/10" />
                <div className="mt-3 text-xs text-white/50">© {new Date().getFullYear()} ManpakBet</div>
            </div>
        </aside>
    );
}
