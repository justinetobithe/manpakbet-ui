"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AppButton } from "@/components/app-button";
import { NAV } from "@/components/site-nav";

export function SiteSidebar({ onOpenAuth }: { onOpenAuth: () => void }) {
    const pathname = usePathname();

    const activeHref = useMemo(() => {
        const exact = NAV.find((n) => n.href === pathname);
        if (exact) return exact.href;
        const starts = NAV.find((n) => pathname?.startsWith(n.href));
        return starts?.href ?? NAV[0]?.href ?? "/games";
    }, [pathname]);

    return (
        <aside className="sticky top-0 hidden h-dvh w-[280px] shrink-0 border-r border-white/10 bg-white/[0.03] p-4 lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="grid place-items-center">
                    <div className="relative h-16 w-[210px]">
                        <Image
                            src="/logo.png"
                            alt="ManpakBet"
                            fill
                            priority
                            className="object-contain object-center"
                        />
                    </div>
                </div>

                <AppButton className="mt-4 h-11 w-full" onClick={onOpenAuth}>
                    Login / Register
                </AppButton>
            </div>

            <nav className="mt-4 space-y-2">
                {NAV.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === activeHref;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition",
                                active
                                    ? "border-white/20 bg-white/10 text-white"
                                    : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]"
                            )}
                        >
                            <span
                                className={cn(
                                    "grid h-9 w-9 place-items-center rounded-xl",
                                    active ? "bg-white/10" : "bg-white/5"
                                )}
                            >
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
                <div className="mt-3 text-xs text-white/50">
                    © {new Date().getFullYear()} ManpakBet
                </div>
            </div>
        </aside>
    );
}
