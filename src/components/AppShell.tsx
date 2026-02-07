"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";
import AppBottomTabs from "@/components/AppBottomTabs";
import AppFooter from "@/components/AppFooter";
import AuthDialog from "@/components/AuthDialog";
import DisclaimerDialog from "@/components/DisclaimerDialog";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [authOpen, setAuthOpen] = useState(false);

    return (
        <div className="min-h-dvh bg-[radial-gradient(1200px_circle_at_18%_8%,rgba(34,197,94,0.16),transparent_42%),radial-gradient(1200px_circle_at_82%_28%,rgba(59,130,246,0.14),transparent_45%),radial-gradient(1100px_circle_at_55%_92%,rgba(245,158,11,0.12),transparent_52%),linear-gradient(to_bottom,rgba(7,34,46,1),rgba(6,18,28,1))] text-white">
            <DisclaimerDialog />

            <div className="sticky top-0 z-50 w-full">
                <AppHeader onOpenAuth={() => setAuthOpen(true)} />
            </div>

            <div className="flex min-h-[calc(100dvh-64px)]">
                <aside className="hidden lg:block w-[260px] shrink-0">
                    <div className="sticky top-16 h-[calc(100dvh-64px)]">
                        <AppSidebar onOpenAuth={() => setAuthOpen(true)} />
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    <main className="mx-auto w-full max-w-[1150px] px-4 py-6 lg:px-6">
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 md:p-6">
                            {children}
                        </div>

                        <div className="mt-6">
                            <AppFooter />
                        </div>

                        <div className="h-24 lg:hidden" />
                    </main>
                </div>
            </div>

            <div className="lg:hidden">
                <AppBottomTabs />
            </div>

            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
        </div>
    );
}
