"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Dices } from "lucide-react";
import { AppAmount, AppBadge, AppImage, AppPageHeader, AppTable } from "@/components/app";
import { gameImage } from "@/lib/assets";
import { useRounds } from "@/lib/CasinoAPI";
import { formatDateTime } from "@/lib/format";
import type { GameRound } from "@/types/Casino";

const typeTone = { bet: "violet", win: "success", refund: "info" } as const;

const signed = (round: GameRound) => Number(round.amount) * (round.type === "bet" ? -1 : 1);

const columns: ColumnDef<GameRound, unknown>[] = [
    {
        id: "game",
        header: "Game",
        cell: ({ row }) =>
            row.original.game ? (
                <Link href={`/play/${row.original.game.slug}`} className="flex items-center gap-3 hover:text-gold-200">
                    <AppImage src={gameImage(row.original.game)} alt="" wrapperClassName="size-9 shrink-0 rounded-lg" />
                    <span className="max-w-[200px] truncate font-semibold">{row.original.game.name}</span>
                </Link>
            ) : (
                "—"
            ),
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <AppBadge size="sm" tone={typeTone[row.original.type]}>
                {row.original.type}
            </AppBadge>
        ),
    },
    { accessorKey: "round_id", header: "Round", meta: { hideOnMobile: true }, cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.round_id ?? "—"}</span> },
    { accessorKey: "amount", header: "Amount", meta: { align: "right" }, cell: ({ row }) => <AppAmount value={signed(row.original)} signed respectPrivacy={false} className="font-bold" /> },
    { accessorKey: "balance_after", header: "Balance", meta: { align: "right" }, cell: ({ row }) => <AppAmount value={row.original.balance_after} respectPrivacy={false} /> },
    { accessorKey: "created_at", header: "Time", cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.created_at)}</span> },
];

export default function GameHistoryPage() {
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(15);
    const { data, isLoading, isFetching } = useRounds(page, perPage);

    return (
        <div className="space-y-5">
            <AppPageHeader icon={<Dices />} title="Game history" description="Every bet, win and refund reported by the game studios." />
            <AppTable
                columns={columns}
                data={data?.data}
                meta={data?.meta}
                isLoading={isLoading}
                isFetching={isFetching}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPerPage(size);
                    setPage(1);
                }}
                emptyTitle="No game rounds yet"
                emptyDescription="Rounds appear here once you play a connected game."
                emptyIcon={<Dices />}
                renderMobileCard={(round) => (
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="truncate font-semibold">{round.game?.name ?? "Game"}</div>
                            <div className="text-xs text-muted-foreground">{formatDateTime(round.created_at)}</div>
                        </div>
                        <div className="text-right">
                            <AppAmount value={signed(round)} signed respectPrivacy={false} className="text-sm font-bold" />
                            <div>
                                <AppBadge size="sm" tone={typeTone[round.type]}>
                                    {round.type}
                                </AppBadge>
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
