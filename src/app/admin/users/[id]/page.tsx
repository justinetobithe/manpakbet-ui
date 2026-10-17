"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine, BadgeCheck, Ban, Coins, Dices, History, KeyRound, Pencil, ShieldCheck, Trash2, UserRound, Wallet } from "lucide-react";
import { AppAmount, AppBadge, AppButton, AppCard, AppConfirm, AppEmpty, AppStatCard, AppToast } from "@/components/app";
import { KycStatusBadge } from "@/components/account/KycForm";
import { AccountFormDialog, BalanceDialog } from "@/components/admin/AccountDialogs";
import { KycDetails, KycReviewActions } from "@/components/admin/KycReview";
import HistoryTabs from "@/components/history/HistoryTabs";
import { useAuth } from "@/hooks/useAuth";
import { useAdminDetail, useDeleteAdminRecord, useSaveAdminRecord } from "@/lib/AdminAPI";
import { formatDate, formatDateTime, formatNumber, initials, timeAgo, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminUserDetail } from "@/types/Admin";
import type { User } from "@/types/User";

type Tab = "overview" | "history" | "kyc";

const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
    { id: "overview", label: "Overview", icon: UserRound },
    { id: "history", label: "Cash in/out & bets", icon: History },
    { id: "kyc", label: "KYC", icon: BadgeCheck },
];

export default function AccountDetailPage() {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const router = useRouter();
    const { can, user: me } = useAuth();
    const { data, isLoading, isError, refetch } = useAdminDetail<AdminUserDetail>("users", id);
    const save = useSaveAdminRecord<User>("users");
    const remove = useDeleteAdminRecord("users");
    const [tab, setTab] = React.useState<Tab>("overview");
    const [editing, setEditing] = React.useState(false);
    const [balance, setBalance] = React.useState(false);
    const [toggling, setToggling] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    if (isLoading) return <div className="h-96 animate-pulse rounded-2xl bg-white/5" />;

    if (isError || !data) {
        return (
            <AppEmpty
                title="Account not found"
                action={
                    <AppButton asChild tone="surface">
                        <Link href="/admin/users">Back to accounts</Link>
                    </AppButton>
                }
            />
        );
    }

    const { user, stats } = data;
    const isSelf = me?.id === String(user.id);

    const toggleActive = async () => {
        try {
            const response = await save.mutateAsync({
                id: user.id,
                payload: { first_name: user.first_name, last_name: user.last_name, email: user.email, phone: user.phone, role: user.role, is_active: !user.is_active },
            });
            AppToast.success(user.is_active ? "Account suspended" : "Account reactivated", { description: response.message });
            setToggling(false);
            void refetch();
        } catch (err) {
            AppToast.apiError(err, "Update failed");
        }
    };

    const destroy = async () => {
        try {
            const response = await remove.mutateAsync(user.id);
            AppToast.success(response.message);
            router.replace("/admin/users");
        } catch (err) {
            AppToast.apiError(err, "Delete failed");
        }
    };

    return (
        <div className="space-y-5">
            <div className="border-gradient relative overflow-hidden rounded-3xl bg-linear-to-br from-plum-700/70 via-plum-850 to-plum-900 p-5 sm:p-6">
                <div className="pointer-events-none absolute -top-16 -right-10 size-60 rounded-full bg-gold-400/12 blur-3xl" />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <AppButton asChild tone="surface" size="icon">
                            <Link href="/admin/users" aria-label="Back">
                                <ArrowLeft />
                            </Link>
                        </AppButton>
                        <span className="relative grid size-16 shrink-0 place-items-center rounded-3xl bg-linear-to-br from-ember-500 to-gold-500 font-display text-xl font-extrabold text-white">
                            {initials(user.name)}
                            <span className={cn("absolute -right-0.5 -bottom-0.5 size-4 rounded-full border-2 border-plum-850", user.is_active ? "bg-jade-400" : "bg-red-400")} />
                        </span>
                        <div className="min-w-0">
                            <h1 className="truncate font-display text-2xl font-extrabold">{user.name}</h1>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <AppBadge size="sm" tone={user.role === "admin" ? "ember" : user.role === "staff" ? "violet" : "neutral"}>
                                    {user.role}
                                </AppBadge>
                                <KycStatusBadge status={user.kyc_status} />
                                <AppBadge size="sm" tone={user.is_active ? "success" : "danger"} dot>
                                    {user.is_active ? "Active" : "Suspended"}
                                </AppBadge>
                            </div>
                            <div className="mt-1 truncate text-xs text-muted-foreground">
                                {user.email ?? user.phone} · joined {formatDate(user.created_at)}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {can("users.balance") ? (
                            <AppButton tone="surface" leftIcon={<Coins />} onClick={() => setBalance(true)}>
                                Adjust balance
                            </AppButton>
                        ) : null}
                        {can("users.manage") ? (
                            <>
                                <AppButton tone="surface" leftIcon={<Pencil />} onClick={() => setEditing(true)}>
                                    Edit
                                </AppButton>
                                {!isSelf ? (
                                    <>
                                        <AppButton tone={user.is_active ? "outline" : "success"} leftIcon={user.is_active ? <Ban /> : <ShieldCheck />} onClick={() => setToggling(true)}>
                                            {user.is_active ? "Suspend" : "Activate"}
                                        </AppButton>
                                        <AppButton tone="danger" size="icon" onClick={() => setDeleting(true)} aria-label="Delete account">
                                            <Trash2 />
                                        </AppButton>
                                    </>
                                ) : null}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <AppStatCard index={0} label="Balance" value={<AppAmount value={user.balance} respectPrivacy={false} />} icon={<Wallet />} tone="gold" />
                <AppStatCard index={1} label="Total cash in" value={<AppAmount value={stats.total_deposits} respectPrivacy={false} />} icon={<ArrowDownToLine />} tone="jade" />
                <AppStatCard index={2} label="Total cash out" value={<AppAmount value={stats.total_withdrawals} respectPrivacy={false} />} hint={stats.pending_transactions ? `${stats.pending_transactions} pending` : undefined} icon={<ArrowUpFromLine />} tone="ember" />
                <AppStatCard index={3} label="Bets / wins" value={<AppAmount value={stats.total_bets} respectPrivacy={false} />} hint={<>Won <AppAmount value={stats.total_wins} respectPrivacy={false} /></>} icon={<Dices />} tone="violet" />
            </div>

            <div className="no-scrollbar -mx-3 flex gap-1.5 overflow-x-auto px-3 sm:mx-0 sm:px-0">
                {tabs.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setTab(item.id)}
                        className={cn("relative inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition", tab === item.id ? "border-transparent text-[#2a1600]" : "border-border bg-white/3 text-foreground/70 hover:text-foreground")}
                    >
                        {tab === item.id ? <motion.span layoutId="account-detail-tab" className="bg-gold absolute inset-0 rounded-xl" /> : null}
                        <item.icon className="relative size-4" />
                        <span className="relative">{item.label}</span>
                        {item.id === "kyc" && user.kyc_status === "pending" ? <span className="relative size-2 rounded-full bg-amber-400" /> : null}
                    </button>
                ))}
            </div>

            {tab === "overview" ? (
                <div className="grid gap-5 lg:grid-cols-2">
                    <AppCard title="Profile" icon={<UserRound />}>
                        <Detail label="First name" value={user.first_name} />
                        <Detail label="Last name" value={user.last_name} />
                        <Detail label="Email" value={user.email} />
                        <Detail label="Mobile" value={user.phone} />
                        <Detail label="Birthdate" value={user.birthdate ? formatDate(user.birthdate) : null} />
                        <Detail label="Last login" value={user.last_login_at ? `${formatDateTime(user.last_login_at)} (${timeAgo(user.last_login_at)})` : null} />
                    </AppCard>
                    <div className="space-y-5">
                        <AppCard title="Gaming activity" icon={<Dices />}>
                            <Detail label="Sessions" value={`${formatNumber(stats.sessions)} (${formatNumber(stats.demo_sessions)} demo)`} />
                            <Detail label="Rounds" value={formatNumber(stats.rounds)} />
                            <Detail label="Net for house" value={<AppAmount value={stats.ggr} signed respectPrivacy={false} />} />
                            <Detail label="Last played" value={stats.last_played_at ? timeAgo(stats.last_played_at) : "Never"} />
                        </AppCard>
                        <AppCard title="Access" icon={<KeyRound />}>
                            <div className="mb-2 text-sm text-muted-foreground">{titleCase(user.role)} role</div>
                            {user.permissions.length ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {user.permissions.map((permission) => (
                                        <AppBadge key={permission} size="sm" tone="violet">
                                            {permission}
                                        </AppBadge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Player account. No back-office access.</p>
                            )}
                        </AppCard>
                    </div>
                </div>
            ) : tab === "history" ? (
                <HistoryTabs userId={user.id} />
            ) : (
                <AppCard
                    title="Identity verification"
                    icon={<BadgeCheck />}
                    actions={user.kyc ? <KycReviewActions submission={user.kyc} onDone={() => void refetch()} /> : null}
                >
                    {user.kyc ? <KycDetails submission={user.kyc} /> : <AppEmpty compact icon={<BadgeCheck />} title="No documents submitted" description="The player hasn't started verification yet." />}
                </AppCard>
            )}

            <AccountFormDialog open={editing} onOpenChange={setEditing} account={user} onSaved={() => void refetch()} />
            <BalanceDialog user={balance ? user : null} onClose={() => setBalance(false)} onDone={() => void refetch()} />
            <AppConfirm
                open={toggling}
                onOpenChange={setToggling}
                tone={user.is_active ? "danger" : "gold"}
                title={user.is_active ? "Suspend this account?" : "Reactivate this account?"}
                description={user.is_active ? "The player is signed out immediately and cannot log in until reactivated." : "The player will be able to log in again."}
                confirmLabel={user.is_active ? "Suspend" : "Reactivate"}
                loading={save.isPending}
                onConfirm={toggleActive}
            />
            <AppConfirm
                open={deleting}
                onOpenChange={setDeleting}
                title="Delete this account?"
                description="This permanently removes the account, its wallet history and sessions."
                confirmLabel="Delete account"
                loading={remove.isPending}
                onConfirm={destroy}
            />
        </div>
    );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-semibold">{value || "—"}</span>
        </div>
    );
}
