"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Wallet, LogIn, Search } from "lucide-react";

export function Topbar() {
    return (
        <header className="border-b border-white/10">
            <div className="px-4 py-3 md:px-6">
                <div className="flex items-center gap-3">
                    <div className="panel hidden h-11 w-[360px] items-center gap-2 rounded-2xl px-3 md:flex">
                        <Search className="h-4 w-4 text-white/70" />
                        <input
                            className="h-10 w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                            placeholder="Search games..."
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="secondary" className="rounded-2xl bg-white/8 text-white hover:bg-white/12">
                            <Wallet className="mr-2 h-4 w-4" />
                            Wallet
                        </Button>

                        <Button variant="secondary" className="rounded-2xl bg-white/8 text-white hover:bg-white/12">
                            <Bell className="mr-2 h-4 w-4" />
                            Alerts
                        </Button>

                        <Link href="/auth">
                            <Button className="rounded-2xl bg-gradient-to-r from-primary to-accent text-black hover:opacity-95">
                                <LogIn className="mr-2 h-4 w-4" />
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-3 md:hidden">
                    <div className="panel flex h-11 items-center gap-2 rounded-2xl px-3">
                        <Search className="h-4 w-4 text-white/70" />
                        <input
                            className="h-10 w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                            placeholder="Search games..."
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
