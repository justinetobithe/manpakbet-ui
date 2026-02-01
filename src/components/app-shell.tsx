"use client";

import { useState } from "react";
import { SiteSidebar } from "@/components/site-sidebar";
import { SiteHeader } from "@/components/site-header";
import { MobileTabs } from "@/components/mobile-tabs";
import { AuthDialog } from "@/components/auth-dialog";

export function AppShell({ children }: { children: React.ReactNode }) {
    const [authOpen, setAuthOpen] = useState(false);

    return (
        <div className="min-h-dvh bg-[radial-gradient(1200px_circle_at_18%_8%,rgba(34,197,94,0.16),transparent_42%),radial-gradient(1200px_circle_at_82%_28%,rgba(59,130,246,0.14),transparent_45%),radial-gradient(1100px_circle_at_55%_92%,rgba(245,158,11,0.12),transparent_52%),linear-gradient(to_bottom,rgba(7,34,46,1),rgba(6,18,28,1))] text-white">
            <div className="flex">
                <div className="hidden lg:block">
                    <SiteSidebar onOpenAuth={() => setAuthOpen(true)} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="hidden lg:block">
                        <SiteHeader onOpenAuth={() => setAuthOpen(true)} />
                    </div>

                    <main className="mx-auto w-full px-4 py-6 lg:px-6">
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 md:p-6">{children}</div>
                    </main>

                    <div className="h-20 lg:hidden" />
                </div>
            </div>

            <MobileTabs />
            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
        </div>
    );
}
