"use client";

import * as React from "react";
import { Info, Wallet } from "lucide-react";
import { AppCard, AppPageHeader } from "@/components/app";
import WalletForm from "@/components/account/WalletForm";
import type { WalletTab } from "@/stores/useUiStore";

const tips = [
    "Use an account registered under your own name for faster verification.",
    "Keep your transaction reference until the request is completed.",
    "Withdrawals are held from your balance while pending and returned if rejected.",
    "Contact support if a deposit is not credited within 30 minutes.",
];

export default function WalletPage() {
    const [tab, setTab] = React.useState<WalletTab>("deposit");

    return (
        <div className="space-y-5">
            <AppPageHeader icon={<Wallet />} title="Wallet" description="Top up or cash out through your preferred channel." />
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
                <AppCard>
                    <WalletForm tab={tab} onTabChange={setTab} />
                </AppCard>
                <AppCard title="Good to know" icon={<Info />}>
                    <ul className="space-y-3">
                        {tips.map((tip, index) => (
                            <li key={tip} className="flex gap-3 text-sm text-muted-foreground">
                                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold-400/15 text-xs font-bold text-gold-300">{index + 1}</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </AppCard>
            </div>
        </div>
    );
}
