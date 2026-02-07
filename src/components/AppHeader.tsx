"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Bell, Search, Headphones, Inbox } from "lucide-react";
import AppButton from "@/components/AppButton";

export default function AppHeader({ onOpenAuth }: { onOpenAuth: () => void }) {
    const { data } = useSession();
    const isAuthed = !!data?.user;

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/10 backdrop-blur-xl">
            <div className="flex h-16 w-full items-center gap-3 px-4 lg:px-6">
                <div className="flex items-center gap-3">
                    <div className="relative h-9 w-40">
                        <Image
                            src="/logo.png"
                            alt="ManpakBet"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </div>

                <div className="hidden lg:flex min-w-0 flex-1 items-center justify-center px-6">
                    <div className="relative w-full max-w-[720px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                        <Input
                            placeholder="Search games"
                            className="h-10 w-full rounded-2xl border-white/10 bg-white/[0.06] pl-10 text-white placeholder:text-white/45 focus-visible:ring-white/20"
                        />
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden lg:flex items-center gap-2">
                        <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/10">
                            <Bell className="h-5 w-5" />
                        </button>

                        {!isAuthed ? (
                            <AppButton
                                onClick={onOpenAuth}
                                tone="primary"
                                className="h-10 px-5"
                            >
                                Login / Register
                            </AppButton>
                        ) : (
                            <div className="text-sm text-white/70">
                                Hi, {(data.user as any)?.first_name ?? data.user?.email}
                            </div>
                        )}
                    </div>

                    <div className="flex lg:hidden items-center gap-2">
                        {!isAuthed ? (
                            <AppButton
                                onClick={onOpenAuth}
                                tone="primary"
                                className="h-10 px-5"
                            >
                                Login / Register
                            </AppButton>
                        ) : (
                            <>
                                <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/10">
                                    <Headphones className="h-5 w-5" />
                                </button>
                                <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/10">
                                    <Inbox className="h-5 w-5" />
                                </button>
                                <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/10">
                                    <Search className="h-5 w-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
