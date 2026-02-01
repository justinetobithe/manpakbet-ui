"use client";

import Image from "next/image";
import { AppButton } from "@/components/app-button";
import { MobileMenuSheet } from "@/components/mobile-menu-sheet";
import { Search } from "lucide-react";

export function SiteHeader({ onOpenAuth }: { onOpenAuth: () => void }) {
    return (
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="mx-auto flex w-full items-center gap-3 px-3 py-3 lg:px-6">
                <div className="flex items-center gap-3 lg:hidden">
                    <MobileMenuSheet onOpenAuth={onOpenAuth} />
                    <div className="relative h-9 w-[140px]">
                        <Image src="/logo.png" alt="ManpakBet" fill className="object-contain object-left" />
                    </div>
                </div>

                <div className="hidden flex-1 items-center gap-3 lg:flex">
                    <div className="relative w-full max-w-[520px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                        <input
                            className="h-10 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-9 pr-3 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/20"
                            placeholder="Search games..."
                        />
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <AppButton className="h-10 px-4" onClick={onOpenAuth}>
                        Login
                    </AppButton>
                </div>
            </div>
        </header>
    );
}
