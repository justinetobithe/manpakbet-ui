"use client";

import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="mx-auto w-full max-w-6xl px-4 pb-10 lg:px-6">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-[160px]">
                            <Image src="/logo.png" alt="ManpakBet" fill className="object-contain object-left" />
                        </div>
                        <div className="text-sm text-white/80">
                            © {new Date().getFullYear()} ManpakBet. All rights reserved.
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-white/70">
                        <Link className="hover:text-white" href="/terms">
                            Terms
                        </Link>
                        <Link className="hover:text-white" href="/privacy">
                            Privacy
                        </Link>
                        <Link className="hover:text-white" href="/support">
                            Support
                        </Link>
                        <div className="ml-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                            <Image src="/pagcor.png" alt="PAGCOR" width={28} height={28} />
                            <span className="text-xs text-white/70">PAGCOR</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
