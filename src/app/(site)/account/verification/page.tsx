import type { Metadata } from "next";
import { BadgeCheck, Lock, ShieldCheck, Timer } from "lucide-react";
import { AppCard, AppPageHeader } from "@/components/app";
import KycForm from "@/components/account/KycForm";

export const metadata: Metadata = { title: "Identity verification" };

const reasons = [
    { icon: ShieldCheck, title: "Required by regulation", text: "PAGCOR-licensed operators must confirm every player is 21+ and not restricted." },
    { icon: Lock, title: "Protects your wallet", text: "Verification makes sure only you can withdraw your winnings." },
    { icon: Timer, title: "Quick review", text: "Most submissions are reviewed in under 24 hours." },
];

export default function VerificationPage() {
    return (
        <div className="space-y-5">
            <AppPageHeader icon={<BadgeCheck />} title="Identity verification" description="Verify once to unlock withdrawals and keep your account secure." />
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
                <KycForm />
                <AppCard title="Why we ask">
                    <ul className="space-y-4">
                        {reasons.map(({ icon: Icon, title, text }) => (
                            <li key={title} className="flex gap-3">
                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-400/12 text-gold-300 ring-1 ring-gold-400/20">
                                    <Icon className="size-5" />
                                </span>
                                <span>
                                    <span className="block text-sm font-bold">{title}</span>
                                    <span className="block text-sm text-muted-foreground">{text}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </AppCard>
            </div>
        </div>
    );
}
