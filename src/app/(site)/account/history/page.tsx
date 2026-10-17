"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownToLine, ArrowUpFromLine, Dices, History, Wallet } from "lucide-react";
import { AppAmount, AppPageHeader, AppStatCard } from "@/components/app";
import HistoryTabs, { type HistoryTab } from "@/components/history/HistoryTabs";
import { useHistorySummary } from "@/lib/ProfileAPI";

const TABS: HistoryTab[] = ["all", "cash_in", "cash_out", "bets"];

function HistoryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requested = searchParams.get("tab") as HistoryTab | null;
    const initialTab = requested && TABS.includes(requested) ? requested : "all";
    const { data } = useHistorySummary();

    return (
        <div className="space-y-5">
            <AppPageHeader icon={<History />} title="History" description="Your cash in, cash out and bet history in one place." />

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <AppStatCard index={0} label="Balance" value={<AppAmount value={data?.balance} />} icon={<Wallet />} tone="gold" />
                <AppStatCard index={1} label="Total cash in" value={<AppAmount value={data?.cash_in} respectPrivacy={false} />} icon={<ArrowDownToLine />} tone="jade" />
                <AppStatCard index={2} label="Total cash out" value={<AppAmount value={data?.cash_out} respectPrivacy={false} />} icon={<ArrowUpFromLine />} tone="ember" />
                <AppStatCard
                    index={3}
                    label="Net from games"
                    value={<AppAmount value={data?.net_gaming} signed respectPrivacy={false} />}
                    hint={data ? `${data.rounds} rounds played` : undefined}
                    icon={<Dices />}
                    tone="violet"
                />
            </div>

            <HistoryTabs
                initialTab={initialTab}
                onTabChange={(tab) => router.replace(tab === "all" ? "/account/history" : `/account/history?tab=${tab}`, { scroll: false })}
            />
        </div>
    );
}

export default function HistoryPage() {
    return (
        <Suspense>
            <HistoryContent />
        </Suspense>
    );
}
