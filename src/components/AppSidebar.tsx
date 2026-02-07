"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
    Home,
    Gamepad2,
    Trophy,
    Newspaper,
    User,
    ChevronDown,
    ChevronRight,
    Video,
    Dice5,
    Fish,
    Volleyball,
    Spade,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: any };

const mainItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/promo", label: "Promotions", icon: Trophy },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/account", label: "Account", icon: User },
];

const gameItems: NavItem[] = [
    { href: "/games/live", label: "Live Games", icon: Video },
    { href: "/games/slot-machines", label: "Slot Machines", icon: Dice5 },
    { href: "/games/slot", label: "Slot Games", icon: Gamepad2 },
    { href: "/games/poker", label: "Poker", icon: Spade },
    { href: "/games/fishing", label: "Fishing", icon: Fish },
    { href: "/games/sports", label: "Sports", icon: Volleyball },
];

export default function AppSidebar({ onOpenAuth }: { onOpenAuth: () => void }) {
    const pathname = usePathname();
    const [gamesOpen, setGamesOpen] = useState(true);

    const isActive = useMemo(() => {
        return (href: string) => pathname === href || pathname?.startsWith(href + "/");
    }, [pathname]);

    const itemBase =
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] leading-none transition";
    const subItemBase =
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] leading-none transition";

    const iconBase = "h-[18px] w-[18px]";

    return (
        <aside className="h-full w-[260px] border-r border-white/10 bg-black/10 backdrop-blur-xl">
            <nav className="h-full px-3 py-4">
                <div className="space-y-1">
                    <Link
                        href="/"
                        className={[
                            itemBase,
                            isActive("/") ? "bg-white/12 text-white" : "text-white/80 hover:bg-white/10",
                        ].join(" ")}
                    >
                        <Home className={iconBase} />
                        Home
                    </Link>

                    <button
                        onClick={() => setGamesOpen((v) => !v)}
                        className={[itemBase, "w-full text-white/80 hover:bg-white/10"].join(" ")}
                    >
                        <Gamepad2 className={iconBase} />
                        <span className="flex-1 text-left">Games</span>
                        {gamesOpen ? (
                            <ChevronDown className={iconBase} />
                        ) : (
                            <ChevronRight className={iconBase} />
                        )}
                    </button>

                    {gamesOpen ? (
                        <div className="ml-2 space-y-1 border-l border-white/10 pl-2">
                            {gameItems.map((it) => {
                                const Icon = it.icon;
                                return (
                                    <Link
                                        key={it.href}
                                        href={it.href}
                                        className={[
                                            subItemBase,
                                            isActive(it.href) ? "bg-white/12 text-white" : "text-white/75 hover:bg-white/10",
                                        ].join(" ")}
                                    >
                                        <Icon className={iconBase} />
                                        {it.label}
                                    </Link>
                                );
                            })}
                        </div>
                    ) : null}

                    {mainItems
                        .filter((x) => x.href !== "/")
                        .map((it) => {
                            const Icon = it.icon;
                            return (
                                <Link
                                    key={it.href}
                                    href={it.href}
                                    className={[
                                        itemBase,
                                        isActive(it.href) ? "bg-white/12 text-white" : "text-white/80 hover:bg-white/10",
                                    ].join(" ")}
                                >
                                    <Icon className={iconBase} />
                                    {it.label}
                                </Link>
                            );
                        })}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs text-white/60">Guest mode</div>
                    <div className="mt-2 text-sm text-white/80">Login to access wallet & account.</div>
                    <button
                        onClick={onOpenAuth}
                        className="mt-3 w-full rounded-2xl bg-white/10 px-3 py-2.5 text-[14px] text-white hover:bg-white/15"
                    >
                        Login / Register
                    </button>
                </div>
            </nav>
        </aside>
    );
}
