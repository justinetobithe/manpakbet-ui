"use client";

import { Bell, CreditCard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/app-button";

export function SiteHeader({ onOpenAuth }: { onOpenAuth: () => void }) {
    return (
        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 lg:px-6">
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative w-full max-w-[520px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                        <input
                            className="h-10 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-9 pr-3 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-primary/35"
                            placeholder="Search games..."
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        className="rounded-2xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                    >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Wallet
                    </Button>

                    <Button
                        variant="secondary"
                        className="rounded-2xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                    >
                        <Bell className="mr-2 h-4 w-4" />
                        Alerts
                    </Button>

                    <AppButton onClick={onOpenAuth}>Login</AppButton>
                </div>
            </div>
        </header>
    );
}
