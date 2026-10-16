"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, Banknote, Clock3, Gamepad2, Gift, LayoutDashboard, UserPlus, Users, Wallet } from "lucide-react";
import { AppAmount, AppBadge, AppButton, AppCard, AppEmpty, AppImage, AppPageHeader, AppStatCard, statusTone } from "@/components/app";
import TrendChart from "@/components/admin/TrendChart";
import { useAdminStats } from "@/lib/AdminAPI";
import { gameImage } from "@/lib/assets";
import { formatCompact, formatMoneyCompact, formatNumber, fullName, timeAgo, titleCase } from "@/lib/format";

export default function AdminDashboardPage() {
    const { data, isLoading } = useAdminStats();
    const totals = data?.totals;

    return (
        <div className="space-y-6">
            <AppPageHeader eyebrow="Overview" icon={<LayoutDashboard />} title="Dashboard" description="Live health of players, wallets and the lobby." />

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <AppStatCard index={0} label="Players" value={isLoading ? "—" : formatNumber(totals?.players)} hint={`+${formatNumber(totals?.new_players_today)} today`} icon={<Users />} tone="violet" />
                <AppStatCard index={1} label="Pending requests" value={isLoading ? "—" : formatNumber(totals?.pending_transactions)} hint="Awaiting review" icon={<Clock3 />} tone="ember" />
                <AppStatCard index={2} label="Approved deposits" value={isLoading ? "—" : formatMoneyCompact(totals?.total_deposits)} icon={<ArrowDownToLine />} tone="gold" />
                <AppStatCard index={3} label="Approved payouts" value={isLoading ? "—" : formatMoneyCompact(totals?.total_withdrawals)} icon={<ArrowUpFromLine />} tone="sky" />
                <AppStatCard index={4} label="Player balances" value={isLoading ? "—" : formatMoneyCompact(totals?.player_balance)} icon={<Wallet />} tone="jade" />
                <AppStatCard index={5} label="Active games" value={isLoading ? "—" : formatNumber(totals?.games)} icon={<Gamepad2 />} tone="violet" />
                <AppStatCard index={6} label="Live promotions" value={isLoading ? "—" : formatNumber(totals?.active_promotions)} icon={<Gift />} tone="gold" />
                <AppStatCard index={7} label="New players today" value={isLoading ? "—" : formatNumber(totals?.new_players_today)} icon={<UserPlus />} tone="ember" />
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
                <AppCard title="Cash flow" description="Approved deposits and withdrawals, last 7 days" icon={<Banknote />}>
                    {data?.series ? <TrendChart data={data.series} /> : <div className="h-60 animate-pulse rounded-xl bg-white/4" />}
                </AppCard>

                <AppCard title="Top games" description="By total plays" icon={<Gamepad2 />}>
                    <div className="space-y-2.5">
                        {(data?.top_games ?? []).map((game, index) => (
                            <div key={game.id} className="flex items-center gap-3">
                                <span className="w-5 text-center font-display text-sm font-extrabold text-muted-foreground">{index + 1}</span>
                                <AppImage src={gameImage(game)} alt="" wrapperClassName="size-10 shrink-0 rounded-lg" />
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-semibold">{game.name}</div>
                                    <div className="text-xs text-muted-foreground">{game.category?.name}</div>
                                </div>
                                <span className="text-sm font-bold tabular-nums">{formatCompact(game.plays_count)}</span>
                            </div>
                        ))}
                        {!isLoading && !data?.top_games.length ? <AppEmpty compact title="No games yet" /> : null}
                    </div>
                </AppCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
                <AppCard
                    title="Latest transactions"
                    icon={<Banknote />}
                    actions={
                        <AppButton asChild tone="ghost" size="sm">
                            <Link href="/admin/transactions">Review</Link>
                        </AppButton>
                    }
                >
                    <div className="divide-y divide-border">
                        {(data?.recent_transactions ?? []).map((transaction) => (
                            <div key={transaction.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-semibold">{fullName(transaction.user)}</div>
                                    <div className="truncate text-xs text-muted-foreground">
                                        {titleCase(transaction.type)} · {transaction.method?.toUpperCase()} · {timeAgo(transaction.created_at)}
                                    </div>
                                </div>
                                <AppAmount value={transaction.amount} respectPrivacy={false} className="text-sm font-bold" />
                                <AppBadge size="sm" tone={statusTone(transaction.status)}>
                                    {transaction.status}
                                </AppBadge>
                            </div>
                        ))}
                        {!isLoading && !data?.recent_transactions.length ? <AppEmpty compact title="No transactions yet" /> : null}
                    </div>
                </AppCard>

                <AppCard
                    title="Newest members"
                    icon={<Users />}
                    actions={
                        <AppButton asChild tone="ghost" size="sm">
                            <Link href="/admin/users">Manage</Link>
                        </AppButton>
                    }
                >
                    <div className="divide-y divide-border">
                        {(data?.recent_users ?? []).map((user) => (
                            <div key={user.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-semibold">{user.name}</div>
                                    <div className="truncate text-xs text-muted-foreground">{user.email ?? user.phone}</div>
                                </div>
                                <AppBadge size="sm" tone={user.role === "admin" ? "ember" : user.role === "staff" ? "violet" : "neutral"}>
                                    {user.role}
                                </AppBadge>
                                <span className="w-20 text-right text-xs text-muted-foreground">{timeAgo(user.created_at)}</span>
                            </div>
                        ))}
                    </div>
                </AppCard>
            </div>
        </div>
    );
}
