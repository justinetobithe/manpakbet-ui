"use client";

import Link from "next/link";
import { Home, Gamepad2, Trophy, User } from "lucide-react";

const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/promo", label: "Promo", icon: Trophy },
    { href: "/account", label: "Account", icon: User },
];

export default function AppBottomTabs() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/30 backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-[700px] grid-cols-4 px-2 py-2">
                {tabs.map((t) => {
                    const Icon = t.icon;
                    return (
                        <Link key={t.href} href={t.href} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-white/75 hover:bg-white/10">
                            <Icon className="h-5 w-5" />
                            <span className="text-[11px]">{t.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
