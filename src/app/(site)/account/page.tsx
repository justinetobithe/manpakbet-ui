"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, ChevronRight, Clock3, Gamepad2, Heart, History, ScanFace, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { AppAmount, AppButton, AppCard, AppEmpty, AppStatCard } from "@/components/app";
import { TransactionRow } from "@/components/account/TransactionList";
import GameRail from "@/components/games/GameRail";
import { useAuth } from "@/hooks/useAuth";
import { useGames } from "@/lib/CasinoAPI";
import { useTransactions, useWallet } from "@/lib/WalletAPI";
import { useGameStore, useUiStore } from "@/stores";

export default function AccountOverviewPage() {
    const { user } = useAuth();
    const { data: wallet } = useWallet();
    const { data: transactions, isLoading } = useTransactions({ per_page: 5 });
    const openWallet = useUiStore((state) => state.openWallet);
    const favorites = useGameStore((state) => state.favorites);
    const favoriteGames = useGames({ slugs: favorites.slice(0, 18).join(","), per_page: 18 }, favorites.length > 0);

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 rounded-3xl border border-border bg-linear-to-r from-plum-800/80 to-plum-850 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <div className="text-sm text-muted-foreground">Good to see you,</div>
                    <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{user?.first_name || user?.name || "Player"}</h1>
                </div>
                <div className="flex gap-2">
                    <AppButton leftIcon={<ArrowDownToLine />} onClick={() => openWallet("deposit")} shine>
                        Deposit
                    </AppButton>
                    <AppButton tone="surface" leftIcon={<ArrowUpFromLine />} onClick={() => openWallet("withdraw")}>
                        Withdraw
                    </AppButton>
                </div>
            </div>

            {wallet && wallet.kyc_status !== "verified" ? (
                <Link
                    href="/account/verification"
                    className="group flex items-center gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 transition hover:border-warning/70"
                >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-warning/20 text-amber-300">
                        <ScanFace className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-display font-extrabold">
                            {wallet.kyc_status === "pending" ? "Verification in review" : wallet.kyc_status === "rejected" ? "Verification needs another look" : "Verify your identity"}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                            {wallet.kyc_status === "pending"
                                ? "We're checking your ID and selfie. This usually takes a few hours."
                                : "Upload a valid government ID and a selfie holding it to unlock withdrawals."}
                        </span>
                    </span>
                    {wallet.kyc_status !== "pending" ? <ChevronRight className="size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5" /> : null}
                </Link>
            ) : null}

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <AppStatCard label="Balance" value={<AppAmount value={wallet?.balance} countUp />} icon={<Wallet />} tone="gold" index={0} />
                <AppStatCard label="Total deposits" value={<AppAmount value={wallet?.total_deposits} respectPrivacy={false} />} icon={<TrendingUp />} tone="jade" index={1} />
                <AppStatCard label="Total withdrawals" value={<AppAmount value={wallet?.total_withdrawals} respectPrivacy={false} />} icon={<TrendingDown />} tone="ember" index={2} />
                <AppStatCard
                    label="Pending"
                    value={<AppAmount value={(wallet?.pending_deposits ?? 0) + (wallet?.pending_withdrawals ?? 0)} respectPrivacy={false} />}
                    icon={<Clock3 />}
                    tone="violet"
                    index={3}
                />
            </div>

            <AppCard
                title="Recent activity"
                icon={<History />}
                actions={
                    <AppButton asChild tone="ghost" size="sm">
                        <Link href="/account/history">View all</Link>
                    </AppButton>
                }
            >
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-12 animate-pulse rounded-xl bg-fg/5" />
                        ))}
                    </div>
                ) : transactions?.data.length ? (
                    <div className="divide-y divide-border">
                        {transactions.data.map((transaction) => (
                            <div key={transaction.id} className="py-3 first:pt-0 last:pb-0">
                                <TransactionRow transaction={transaction} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <AppEmpty compact icon={<Wallet />} title="No transactions yet" description="Make your first deposit to get started." />
                )}
            </AppCard>

            <AppCard title="Your favorites" icon={<Heart />}>
                {favorites.length ? (
                    <GameRail games={favoriteGames.data?.data} loading={favoriteGames.isLoading} />
                ) : (
                    <AppEmpty
                        compact
                        icon={<Gamepad2 />}
                        title="No favorites yet"
                        description="Tap the heart on any game to pin it here."
                        action={
                            <AppButton asChild tone="surface" size="sm">
                                <Link href="/games">Explore games</Link>
                            </AppButton>
                        }
                    />
                )}
            </AppCard>
        </div>
    );
}
