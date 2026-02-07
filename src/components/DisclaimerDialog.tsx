"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AppButton from "@/components/AppButton";

export default function DisclaimerDialog() {
    const [open, setOpen] = useState(false);
    const storageKey = "mpb_disclaimer_accepted_v2";
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const accepted = localStorage.getItem(storageKey);
        if (!accepted) setOpen(true);
    }, []);

    useEffect(() => {
        if (open) requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
    }, [open]);

    const accept = () => {
        localStorage.setItem(storageKey, "1");
        setOpen(false);
    };

    const exit = () => {
        window.location.href = "https://www.google.com";
    };

    const onOpenChange = (v: boolean) => {
        if (!v) return;
        setOpen(true);
    };

    const items = useMemo(
        () => [
            "Government officials and employees connected with government operations and agencies.",
            "Members of the Armed Forces of the Philippines and Philippine National Police.",
            "Persons under 21 years of age.",
            "Persons included in the PAGCOR National Database of Restricted Persons (NDRP).",
            "Gaming employees and license holders where applicable.",
        ],
        []
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="fixed left-1/2 top-1/2 w-[calc(100vw-16px)] max-w-[760px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(900px_380px_at_18%_-10%,rgba(34,211,238,0.18),transparent_60%),radial-gradient(900px_380px_at_92%_0%,rgba(59,130,246,0.14),transparent_55%),linear-gradient(to_bottom,rgba(10,18,28,0.985),rgba(6,12,20,0.985))] p-0 text-white shadow-2xl outline-none max-h-[92dvh] sm:max-h-[86dvh] [&>button]:hidden">
                <div className="flex max-h-[92dvh] sm:max-h-[86dvh] flex-col">
                    <div className="shrink-0 px-4 pt-4 sm:px-7 sm:pt-7">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-xs text-white/60">Welcome</div>
                                    <div className="mt-0.5 text-base font-semibold tracking-tight sm:text-xl">
                                        Eligibility & Responsible Gaming Notice
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="rounded-full bg-white/6 px-3 py-2 ring-1 ring-white/10">
                                        <div className="text-[11px] text-white/60 leading-none">Age</div>
                                        <div className="text-xs font-semibold leading-none">21+</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <div className="rounded-full bg-white/6 px-3 py-2 ring-1 ring-white/10">
                                    <div className="text-[11px] text-white/60 leading-none">PAGCOR</div>
                                    <div className="text-xs font-semibold leading-none">Compliant</div>
                                </div>
                                <div className="rounded-full bg-white/6 px-3 py-2 ring-1 ring-white/10">
                                    <div className="text-[11px] text-white/60 leading-none">Play</div>
                                    <div className="text-xs font-semibold leading-none">Responsibly</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3 sm:px-7 sm:pb-6 sm:pt-4"
                    >
                        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 sm:p-5">
                            <div className="flex items-center justify-center">
                                <img
                                    src="/pagcor-logo.svg"
                                    alt="PAGCOR"
                                    className="h-8 w-auto opacity-95 sm:h-9"
                                />
                            </div>

                            <div className="mt-3 text-sm text-white/80 text-center leading-relaxed">
                                The following individuals are{" "}
                                <span className="font-semibold text-emerald-300">NOT ALLOWED</span>{" "}
                                to register and/or play on this online gaming platform:
                            </div>

                            <ul className="mt-4 space-y-3">
                                {items.map((t, idx) => (
                                    <li key={`${idx}-${t}`} className="flex gap-3 text-sm text-white/75 leading-relaxed">
                                        <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-emerald-400/90" />
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 text-xs text-white/55 leading-relaxed">
                                Funds or credits in the account of a player found ineligible to play may be forfeited in
                                favor of the Government, subject to applicable rules.
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 text-xs">
                                <a
                                    href="/terms"
                                    className="text-emerald-300/90 hover:text-emerald-200 underline underline-offset-4"
                                >
                                    Terms & Conditions
                                </a>
                                <a
                                    href="/privacy"
                                    className="text-emerald-300/90 hover:text-emerald-200 underline underline-offset-4"
                                >
                                    Privacy Policy
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-white/10 bg-black/10 px-4 py-3 sm:px-7 sm:py-4">
                        <div className="text-xs text-white/45 leading-relaxed">
                            By clicking <span className="text-white/70">Accept</span>, you confirm you meet the eligibility
                            requirements.
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <AppButton type="button" tone="surface" glow="none" className="w-full" onClick={exit}>
                                Exit
                            </AppButton>
                            <AppButton type="button" tone="primary" glow="soft" className="w-full" onClick={accept}>
                                Accept
                            </AppButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
