"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV } from "@/components/site-nav";

export function MobileTabs() {
    const pathname = usePathname();

    const activeHref =
        NAV.find((n) => n.href === pathname)?.href ??
        NAV.find((n) => pathname?.startsWith(n.href))?.href ??
        NAV[0]?.href ??
        "/games";

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#061824]/95 backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-[560px] grid-cols-5 gap-1 px-2 py-2">
                {NAV.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === activeHref;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] transition",
                                active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", active ? "text-white" : "text-white/70")} />
                            <span className="leading-none">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
