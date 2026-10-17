"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Dices, ListOrdered } from "lucide-react";
import { AppAmount, AppBadge, AppImage, AppTable, statusTone } from "@/components/app";
import { useAdminList } from "@/lib/AdminAPI";
import { gameImage } from "@/lib/assets";
import { useRounds } from "@/lib/CasinoAPI";
import { formatDateTime, titleCase } from "@/lib/format";
import { useTransactions } from "@/lib/WalletAPI";
import { cn } from "@/lib/utils";
import type { GameRound } from "@/types/Casino";
import type { Transaction } from "@/types/Wallet";

export type HistoryTab = "all" | "cash_in" | "cash_out" | "bets";

const tabs: Array<{ id: HistoryTab; label: string; icon: React.ElementType }> = [
    { id: "all", label: "All", icon: ListOrdered },
    { id: "cash_in", label: "Cash in", icon: ArrowDownToLine },
    { id: "cash_out", label: "Cash out", icon: ArrowUpFromLine },
    { id: "bets", label: "Bets", icon: Dices },
];

const transactionSign = (transaction: Transaction) => {
    const amount = Number(transaction.amount);
    if (transaction.type === "withdraw") return -Math.abs(amount);
    if (transaction.type === "adjustment") return amount;
    return Math.abs(amount);
};

const roundSign = (round: GameRound) => (round.type === "bet" ? -1 : 1) * Number(round.amount);

const transactionColumns: ColumnDef<Transaction, unknown>[] = [
    { accessorKey: "reference", header: "Reference", cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.reference}</span> },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <span className="inline-flex items-center gap-1.5 font-semibold">
                {row.original.type === "withdraw" ? <ArrowUpFromLine className="size-3.5 text-red-300" /> : <ArrowDownToLine className="size-3.5 text-jade-400" />}
                {row.original.type === "deposit" ? "Cash in" : row.original.type === "withdraw" ? "Cash out" : titleCase(row.original.type)}
            </span>
        ),
    },
    { accessorKey: "method", header: "Channel", meta: { hideOnMobile: true }, cell: ({ row }) => <span className="text-muted-foreground uppercase">{row.original.method ?? "—"}</span> },
    { accessorKey: "amount", header: "Amount", meta: { align: "right" }, cell: ({ row }) => <AppAmount value={transactionSign(row.original)} signed respectPrivacy={false} className="font-bold" /> },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <AppBadge size="sm" tone={statusTone(row.original.status)} dot>
                {row.original.status}
            </AppBadge>
        ),
    },
    { accessorKey: "created_at", header: "Date", cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.created_at)}</span> },
];

const roundColumns = (adminLinks: boolean): ColumnDef<GameRound, unknown>[] => [
    {
        id: "game",
        header: "Game",
        cell: ({ row }) =>
            row.original.game ? (
                <Link href={adminLinks ? `/admin/games/${row.original.game.id}` : `/play/${row.original.game.slug}`} className="flex items-center gap-3 hover:text-gold-200">
                    <AppImage src={gameImage(row.original.game)} alt="" wrapperClassName="size-9 shrink-0 rounded-lg" />
                    <span className="max-w-[180px] truncate font-semibold">{row.original.game.name}</span>
                </Link>
            ) : (
                "—"
            ),
    },
    {
        accessorKey: "type",
        header: "Result",
        cell: ({ row }) => (
            <AppBadge size="sm" tone={row.original.type === "bet" ? "violet" : row.original.type === "win" ? "success" : "info"}>
                {row.original.type === "bet" ? "Bet" : row.original.type === "win" ? "Win" : "Refund"}
            </AppBadge>
        ),
    },
    { accessorKey: "round_id", header: "Round", meta: { hideOnMobile: true }, cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.round_id ?? "—"}</span> },
    { accessorKey: "amount", header: "Amount", meta: { align: "right" }, cell: ({ row }) => <AppAmount value={roundSign(row.original)} signed respectPrivacy={false} className="font-bold" /> },
    { accessorKey: "balance_after", header: "Balance", meta: { align: "right", hideOnMobile: true }, cell: ({ row }) => <AppAmount value={row.original.balance_after} respectPrivacy={false} /> },
    { accessorKey: "created_at", header: "Time", cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.created_at)}</span> },
];

type HistoryTabsProps = {
    userId?: number;
    initialTab?: HistoryTab;
    onTabChange?: (tab: HistoryTab) => void;
};

export default function HistoryTabs({ userId, initialTab = "all", onTabChange }: HistoryTabsProps) {
    const admin = Boolean(userId);
    const [tab, setTab] = React.useState<HistoryTab>(initialTab);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);

    const type = tab === "cash_in" ? "deposit" : tab === "cash_out" ? "withdraw" : "";
    const isBets = tab === "bets";

    const playerTransactions = useTransactions({ page, per_page: perPage, type: type as "" | "deposit" | "withdraw" }, !admin && !isBets);
    const playerRounds = useRounds(page, perPage, !admin && isBets);
    const adminTransactions = useAdminList<Transaction>("transactions", { page, per_page: perPage, user_id: userId, type: type || undefined }, admin && !isBets);
    const adminRounds = useAdminList<GameRound>("rounds", { page, per_page: perPage, user_id: userId }, admin && isBets);

    const transactions = admin ? adminTransactions : playerTransactions;
    const rounds = admin ? adminRounds : playerRounds;

    const change = (next: HistoryTab) => {
        setTab(next);
        setPage(1);
        onTabChange?.(next);
    };

    const pageSizeChange = (size: number) => {
        setPerPage(size);
        setPage(1);
    };

    return (
        <div className="space-y-4">
            <div className="no-scrollbar -mx-3 flex gap-1.5 overflow-x-auto px-3 sm:mx-0 sm:px-0">
                {tabs.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => change(item.id)}
                        className={cn(
                            "relative inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition",
                            tab === item.id ? "border-transparent text-[#2a1600]" : "border-border bg-white/3 text-foreground/70 hover:text-foreground"
                        )}
                    >
                        {tab === item.id ? <motion.span layoutId={`history-tab-${userId ?? "me"}`} className="bg-gold absolute inset-0 rounded-xl" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                        <item.icon className="relative size-4" />
                        <span className="relative">{item.label}</span>
                    </button>
                ))}
            </div>

            {isBets ? (
                <AppTable
                    columns={roundColumns(admin)}
                    data={rounds.data?.data}
                    meta={rounds.data?.meta}
                    isLoading={rounds.isLoading}
                    isFetching={rounds.isFetching}
                    onPageChange={setPage}
                    onPageSizeChange={pageSizeChange}
                    emptyTitle="No bets yet"
                    emptyDescription="Bets and wins appear once a connected game is played."
                    emptyIcon={<Dices />}
                    renderMobileCard={(round) => (
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="truncate font-semibold">{round.game?.name ?? "Game"}</div>
                                <div className="text-xs text-muted-foreground">{formatDateTime(round.created_at)}</div>
                            </div>
                            <AppAmount value={roundSign(round)} signed respectPrivacy={false} className="text-sm font-bold" />
                        </div>
                    )}
                />
            ) : (
                <AppTable
                    columns={transactionColumns}
                    data={transactions.data?.data}
                    meta={transactions.data?.meta}
                    isLoading={transactions.isLoading}
                    isFetching={transactions.isFetching}
                    onPageChange={setPage}
                    onPageSizeChange={pageSizeChange}
                    emptyTitle={tab === "cash_in" ? "No cash in yet" : tab === "cash_out" ? "No cash out yet" : "No transactions yet"}
                    renderMobileCard={(transaction) => (
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="truncate font-semibold">{transaction.type === "deposit" ? "Cash in" : transaction.type === "withdraw" ? "Cash out" : titleCase(transaction.type)}</div>
                                <div className="truncate text-xs text-muted-foreground">
                                    {transaction.reference} · {formatDateTime(transaction.created_at)}
                                </div>
                            </div>
                            <div className="text-right">
                                <AppAmount value={transactionSign(transaction)} signed respectPrivacy={false} className="text-sm font-bold" />
                                <div>
                                    <AppBadge size="sm" tone={statusTone(transaction.status)}>
                                        {transaction.status}
                                    </AppBadge>
                                </div>
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    );
}
