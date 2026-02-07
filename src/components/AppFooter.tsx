"use client";

import Image from "next/image";
import Link from "next/link";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm text-white/65 transition hover:text-white">
            {children}
        </Link>
    );
}

export default function AppFooter() {
    return (
        <footer className="w-full px-2 pb-10 lg:px-0">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-6">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
                    <div className="space-y-4">
                        <div className="relative h-10 w-[170px]">
                            <Image src="/logo.png" alt="ManpakBet" fill className="object-contain object-left" />
                        </div>

                        <p className="text-sm leading-relaxed text-white/65">
                            Play your favorite games with a smooth, secure experience. Please play responsibly and follow local
                            regulations.
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
                                21+ Only
                            </span>
                            <span className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
                                Responsible Gaming
                            </span>
                            <span className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
                                Secure Access
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-sm font-semibold text-white">Quick Links</div>
                        <div className="grid gap-2">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/games">Games</FooterLink>
                            <FooterLink href="/promo">Promotions</FooterLink>
                            <FooterLink href="/news">News</FooterLink>
                            <FooterLink href="/account">Account</FooterLink>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-sm font-semibold text-white">Legal</div>
                        <div className="grid gap-2">
                            <FooterLink href="/terms">Terms</FooterLink>
                            <FooterLink href="/privacy">Privacy</FooterLink>
                            <FooterLink href="/support">Support</FooterLink>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <div className="text-xs leading-relaxed text-white/70">
                                Gambling can be addictive. Play responsibly. Prohibition to play in open and public places.
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <Image src="/pagcor-logo.svg" alt="PAGCOR" width={160} height={40} className="h-10 w-auto" />
                                </div>

                                <div className="h-2 w-[160px] overflow-hidden rounded-full bg-white/10">
                                    <div className="h-full w-full bg-[linear-gradient(90deg,#ff4d6d,#ffb703,#8ac926,#00c2ff,#7c3aed)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-6 h-px w-full bg-white/10" />

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="text-xs text-white/60">© {new Date().getFullYear()} ManpakBet. All rights reserved.</div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60">
                        <span>Prohibition to play in open and public places.</span>
                        <span className="hidden lg:inline text-white/20">•</span>
                        <span>Customer Support available 24/7</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
