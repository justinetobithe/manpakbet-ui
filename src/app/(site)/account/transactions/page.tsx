"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { History } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppAmount, AppBadge, AppPageHeader, AppTable, statusTone } from "@/components/app";
import { TransactionRow } from "@/components/account/TransactionList";
import { formatDateTime, titleCase } from "@/lib/format";
import { useTransactions, type TransactionFilters } from "@/lib/WalletAPI";
import type { Transaction } from "@/types/Wallet";

const columns: ColumnDef<Transaction, unknown>[] = [
    { accessorKey: "reference", header: "Reference", cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.reference}</span> },
    { accessorKey: "type", header: "Type", cell: ({ row }) => <span className="font-semibold">{titleCase(row.original.type)}</span> },
    { accessorKey: "method", header: "Channel", cell: ({ row }) => <span className="text-muted-foreground uppercase">{row.original.method ?? "—"}</span> },
    {
        accessorKey: "amount",
        header: "Amount",
        meta: { align: "right" },
        cell: ({ row }) => <AppAmount value={Number(row.original.amount) * (row.original.type === "withdraw" ? -1 : 1)} signed respectPrivacy={false} className="font-bold" />,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <AppBadge size="sm" tone={statusTone(row.original.status)}>
                {row.original.status}
            </AppBadge>
        ),
    },
    { accessorKey: "created_at", header: "Date", cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.created_at)}</span> },
];

export default function TransactionsPage() {
    const [filters, setFilters] = React.useState<TransactionFilters>({ page: 1, per_page: 10, type: "", status: "" });
    const { data, isLoading, isFetching } = useTransactions(filters);

    const update = (patch: Partial<TransactionFilters>) => setFilters((current) => ({ ...current, page: 1, ...patch }));

    return (
        <div className="space-y-5">
            <AppPageHeader icon={<History />} title="Transaction history" description="Every deposit, withdrawal and adjustment on your account." />
            <AppTable
                columns={columns}
                data={data?.data}
                meta={data?.meta}
                isLoading={isLoading}
                isFetching={isFetching}
                onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
                onPageSizeChange={(per_page) => update({ per_page })}
                renderMobileCard={(transaction) => <TransactionRow transaction={transaction} />}
                emptyTitle="No transactions found"
                emptyIcon={<History />}
                toolbar={
                    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                        <Select value={filters.type || "all"} onValueChange={(value) => update({ type: value === "all" ? "" : (value as TransactionFilters["type"]) })}>
                            <SelectTrigger className="sm:w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All types</SelectItem>
                                <SelectItem value="deposit">Deposits</SelectItem>
                                <SelectItem value="withdraw">Withdrawals</SelectItem>
                                <SelectItem value="adjustment">Adjustments</SelectItem>
                                <SelectItem value="bonus">Bonuses</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filters.status || "all"} onValueChange={(value) => update({ status: value === "all" ? "" : (value as TransactionFilters["status"]) })}>
                            <SelectTrigger className="sm:w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                }
            />
        </div>
    );
}
