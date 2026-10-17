"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Dices } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppAmount, AppBadge, AppImage, AppPageHeader, AppTable } from "@/components/app";
import { useAdminList } from "@/lib/AdminAPI";
import { gameImage } from "@/lib/assets";
import { formatDateTime, fullName } from "@/lib/format";
import { useAdminStore } from "@/stores";
import type { AdminRound } from "@/types/Admin";

const signed = (round: AdminRound) => (round.type === "bet" ? -1 : 1) * Number(round.amount);

const columns: ColumnDef<AdminRound, unknown>[] = [
    {
        id: "player",
        header: "Player",
        cell: ({ row }) =>
            row.original.user ? (
                <Link href={`/admin/users/${row.original.user.id}`} className="block max-w-[180px] truncate font-semibold hover:text-gold-200">
                    {fullName(row.original.user)}
                </Link>
            ) : (
                "—"
            ),
    },
    {
        id: "game",
        header: "Game",
        cell: ({ row }) =>
            row.original.game ? (
                <Link href={`/admin/games/${row.original.game.id}`} className="flex items-center gap-2.5 hover:text-gold-200">
                    <AppImage src={gameImage(row.original.game)} alt="" wrapperClassName="size-8 shrink-0 rounded-lg" />
                    <span className="max-w-[160px] truncate">{row.original.game.name}</span>
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
                {row.original.type}
            </AppBadge>
        ),
    },
    { accessorKey: "round_id", header: "Round", meta: { hideOnMobile: true }, cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.round_id ?? "—"}</span> },
    { accessorKey: "amount", header: "Amount", meta: { align: "right" }, cell: ({ row }) => <AppAmount value={signed(row.original)} signed respectPrivacy={false} className="font-bold" /> },
    { accessorKey: "balance_after", header: "Balance after", meta: { align: "right", hideOnMobile: true }, cell: ({ row }) => <AppAmount value={row.original.balance_after} respectPrivacy={false} /> },
    {
        accessorKey: "status",
        header: "Status",
        meta: { hideOnMobile: true },
        cell: ({ row }) => (
            <AppBadge size="sm" tone={row.original.status === "completed" ? "neutral" : "warning"}>
                {row.original.status.replace("_", " ")}
            </AppBadge>
        ),
    },
    { accessorKey: "created_at", header: "Time", cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.created_at)}</span> },
];

export default function AdminRoundsPage() {
    const pageSize = useAdminStore((state) => state.pageSize);
    const setPageSize = useAdminStore((state) => state.setPageSize);
    const [page, setPage] = React.useState(1);
    const [type, setType] = React.useState("");
    const list = useAdminList<AdminRound>("rounds", { page, per_page: pageSize, type: type || undefined });

    return (
        <div className="space-y-5">
            <AppPageHeader icon={<Dices />} title="Bet History" description="Every bet, win and refund reported by game providers." />
            <AppTable
                columns={columns}
                data={list.data?.data}
                meta={list.data?.meta}
                isLoading={list.isLoading}
                isFetching={list.isFetching}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
                emptyTitle="No rounds yet"
                emptyDescription="Rounds appear once a connected provider reports bets."
                emptyIcon={<Dices />}
                toolbar={
                    <Select
                        value={type || "all"}
                        onValueChange={(value) => {
                            setType(value === "all" ? "" : value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="sm:w-44">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All results</SelectItem>
                            <SelectItem value="bet">Bets</SelectItem>
                            <SelectItem value="win">Wins</SelectItem>
                            <SelectItem value="refund">Refunds</SelectItem>
                        </SelectContent>
                    </Select>
                }
                renderMobileCard={(round) => (
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="truncate font-semibold">{round.game?.name ?? "Game"}</div>
                            <div className="truncate text-xs text-muted-foreground">
                                {fullName(round.user)} · {formatDateTime(round.created_at)}
                            </div>
                        </div>
                        <AppAmount value={signed(round)} signed respectPrivacy={false} className="text-sm font-bold" />
                    </div>
                )}
            />
        </div>
    );
}
