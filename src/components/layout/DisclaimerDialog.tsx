"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Ban, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AppButton, AppLogoMark } from "@/components/app";
import { useUiStore } from "@/stores";

const restricted = [
    "Government officials and employees connected with gaming operations",
    "Members of the Armed Forces of the Philippines and the Philippine National Police",
    "Persons under 21 years of age",
    "Persons listed in the PAGCOR National Database of Restricted Persons",
    "Gaming employees and licensees where applicable",
];

export default function DisclaimerDialog() {
    const accepted = useUiStore((state) => state.disclaimerAccepted);
    const accept = useUiStore((state) => state.acceptDisclaimer);
    const hydrated = React.useSyncExternalStore(
        (onChange) => useUiStore.persist.onFinishHydration(onChange),
        () => useUiStore.persist.hasHydrated(),
        () => false
    );

    return (
        <Dialog open={hydrated && !accepted}>
            <DialogContent
                onEscapeKeyDown={(event) => event.preventDefault()}
                onPointerDownOutside={(event) => event.preventDefault()}
                className="surface-strong w-[calc(100vw-1.5rem)] max-w-lg overflow-hidden rounded-3xl border-border p-0 [&>button]:hidden"
            >
                <div className="relative overflow-hidden px-6 pt-7 pb-5 text-center">
                    <div className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-gold-400/20 blur-3xl" />
                    <AppLogoMark className="relative mx-auto size-14" />
                    <DialogTitle className="relative mt-4 font-display text-xl font-extrabold">Before you enter</DialogTitle>
                    <DialogDescription className="relative mt-1 text-sm text-muted-foreground">
                        ManpakBet is for adults <span className="font-bold text-gold-200">21 years and older</span> only.
                    </DialogDescription>
                </div>

                <div className="max-h-[42dvh] space-y-3 overflow-y-auto px-6">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-ember-400 uppercase">
                        <ShieldAlert className="size-4" />
                        Not allowed to play
                    </div>
                    <ul className="space-y-2">
                        {restricted.map((item) => (
                            <li key={item} className="flex gap-2.5 rounded-xl border border-border bg-fg/2.5 px-3 py-2.5 text-sm text-foreground/80">
                                <Ban className="mt-0.5 size-4 shrink-0 text-ember-400" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center justify-between gap-3 pt-1 pb-2">
                        <Image src="/pagcor-logo.svg" alt="PAGCOR" width={110} height={28} className="h-7 w-auto opacity-85" />
                        <div className="flex gap-3 text-xs">
                            <Link href="/terms" className="font-semibold text-gold-300 hover:underline">
                                Terms
                            </Link>
                            <Link href="/privacy" className="font-semibold text-gold-300 hover:underline">
                                Privacy
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-border bg-fg/5 p-4">
                    <AppButton tone="surface" size="lg" onClick={() => window.location.assign("https://www.google.com")}>
                        I&apos;m under 21
                    </AppButton>
                    <AppButton size="lg" shine onClick={accept}>
                        I&apos;m 21+, enter
                    </AppButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
