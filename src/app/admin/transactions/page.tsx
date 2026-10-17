"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Banknote, Check, Eye, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppAmount, AppBadge, AppButton, AppDialog, AppPageHeader, AppSearchInput, AppTable, AppToast, inputClass, statusTone, type AppTableSort } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { useAdminList, useProcessTransaction } from "@/lib/AdminAPI";
import { formatDateTime, fullName, titleCase } from "@/lib/format";
import { useAdminStore } from "@/stores";
import type { Transaction } from "@/types/Wallet";

type Filters = { type: string; status: string; method: string };

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-semibold">{children}</span>
        </div>
    );
}

export default function AdminTransactionsPage() {
    const { can } = useAuth();
    const canProcess = can("transactions.process");
    const pageSize = useAdminStore((state) => state.pageSize);
    const setPageSize = useAdminStore((state) => state.setPageSize);
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("");
    const [sort, setSort] = React.useState<AppTableSort>({ id: "id", desc: true });
    const [filters, setFilters] = React.useState<Filters>({ type: "", status: "pending", method: "" });
    const [selected, setSelected] = React.useState<Transaction | null>(null);
    const [notes, setNotes] = React.useState("");

    const list = useAdminList<Transaction>("transactions", {
        page,
        per_page: pageSize,
        search: search || undefined,
        sort: sort?.id,
        direction: sort?.desc ? "desc" : "asc",
        ...filters,
    });
    const process = useProcessTransaction();

    const act = async (transaction: Transaction, action: "approve" | "reject") => {
        try {
            const response = await process.mutateAsync({ id: transaction.id, action, notes: notes || undefined });
            AppToast.success(response.message, { description: `${transaction.reference} · ${titleCase(transaction.type)}` });
            setSelected(null);
            setNotes("");
        } catch (err) {
            AppToast.apiError(err, "Could not process transaction");
        }
    };

    const updateFilter = (key: keyof Filters, value: string) => {
        setFilters((current) => ({ ...current, [key]: value === "all" ? "" : value }));
        setPage(1);
    };

    const columns: ColumnDef<Transaction, unknown>[] = [
        { accessorKey: "id", header: "Reference", cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.reference}</span> },
        {
            id: "player",
            header: "Player",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="max-w-[180px] truncate font-semibold">{fullName(row.original.user)}</div>
                    <div className="max-w-[180px] truncate text-xs text-muted-foreground">{row.original.user?.email ?? row.original.user?.phone}</div>
                </div>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
            enableSorting: false,
            cell: ({ row }) => (
                <AppBadge size="sm" tone={row.original.type === "deposit" ? "gold" : row.original.type === "withdraw" ? "violet" : "neutral"}>
                    {row.original.type}
                </AppBadge>
            ),
        },
        { accessorKey: "method", header: "Channel", enableSorting: false, meta: { hideOnMobile: true }, cell: ({ row }) => <span className="uppercase">{row.original.method ?? "—"}</span> },
        { accessorKey: "amount", header: "Amount", meta: { align: "right" }, cell: ({ row }) => <AppAmount value={row.original.amount} respectPrivacy={false} className="font-bold" /> },
        {
            accessorKey: "status",
            header: "Status",
            enableSorting: false,
            cell: ({ row }) => (
                <AppBadge size="sm" tone={statusTone(row.original.status)} dot>
                    {row.original.status}
                </AppBadge>
            ),
        },
        { accessorKey: "created_at", header: "Requested", cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.created_at)}</span> },
        {
            id: "actions",
            header: "",
            enableSorting: false,
            meta: { align: "right" },
            cell: ({ row }) => (
                <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                    {canProcess && row.original.status === "pending" ? (
                        <>
                            <AppButton tone="ghost" size="icon-sm" className="text-jade-400 hover:bg-success/15" onClick={() => act(row.original, "approve")} aria-label="Approve" disabled={process.isPending}>
                                <Check />
                            </AppButton>
                            <AppButton tone="ghost" size="icon-sm" className="text-red-300 hover:bg-destructive/15" onClick={() => setSelected(row.original)} aria-label="Reject">
                                <X />
                            </AppButton>
                        </>
                    ) : null}
                    <AppButton tone="ghost" size="icon-sm" onClick={() => setSelected(row.original)} aria-label="View details">
                        <Eye />
                    </AppButton>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-5">
            <AppPageHeader icon={<Banknote />} title="Transactions" description="Review deposit and withdrawal requests. Approvals update balances instantly." />

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
                sort={sort}
                onSortChange={setSort}
                onRowClick={setSelected}
                emptyTitle={filters.status === "pending" ? "Queue is clear" : "No transactions found"}
                emptyDescription={filters.status === "pending" ? "There are no pending requests right now." : undefined}
                renderMobileCard={(transaction) => (
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="truncate font-semibold">{fullName(transaction.user)}</div>
                            <div className="truncate text-xs text-muted-foreground">
                                {titleCase(transaction.type)} · {transaction.reference}
                            </div>
                        </div>
                        <div className="text-right">
                            <AppAmount value={transaction.amount} respectPrivacy={false} className="text-sm font-bold" />
                            <div>
                                <AppBadge size="sm" tone={statusTone(transaction.status)}>
                                    {transaction.status}
                                </AppBadge>
                            </div>
                        </div>
                    </div>
                )}
                toolbar={
                    <>
                        <AppSearchInput
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                                setPage(1);
                            }}
                            placeholder="Search reference, account or player…"
                            className="w-full sm:max-w-xs sm:flex-1"
                        />
                        <div className="grid grid-cols-3 gap-2 sm:flex">
                            <Select value={filters.status || "all"} onValueChange={(value) => updateFilter("status", value)}>
                                <SelectTrigger className="sm:w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filters.type || "all"} onValueChange={(value) => updateFilter("type", value)}>
                                <SelectTrigger className="sm:w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="deposit">Deposits</SelectItem>
                                    <SelectItem value="withdraw">Withdrawals</SelectItem>
                                    <SelectItem value="adjustment">Adjustments</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filters.method || "all"} onValueChange={(value) => updateFilter("method", value)}>
                                <SelectTrigger className="sm:w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All channels</SelectItem>
                                    <SelectItem value="gcash">GCash</SelectItem>
                                    <SelectItem value="maya">Maya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                }
            />

            <AppDialog
                open={Boolean(selected)}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelected(null);
                        setNotes("");
                    }
                }}
                size="md"
                title={selected ? `${titleCase(selected.type)} request` : "Transaction"}
                description={selected?.reference}
                footer={
                    selected && canProcess && selected.status === "pending" ? (
                        <>
                            <AppButton tone="danger" leftIcon={<X />} onClick={() => act(selected, "reject")} loading={process.isPending}>
                                Reject
                            </AppButton>
                            <AppButton tone="success" leftIcon={<Check />} onClick={() => act(selected, "approve")} loading={process.isPending}>
                                Approve
                            </AppButton>
                        </>
                    ) : null
                }
            >
                {selected ? (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-border bg-fg/3 p-4 text-center">
                            <AppAmount value={selected.amount} respectPrivacy={false} className="font-display text-3xl font-extrabold text-gold-200" />
                            <div className="mt-1">
                                <AppBadge tone={statusTone(selected.status)} dot>
                                    {selected.status}
                                </AppBadge>
                            </div>
                        </div>
                        <div>
                            <Detail label="Player">{fullName(selected.user)}</Detail>
                            <Detail label="Contact">{selected.user?.email ?? selected.user?.phone ?? "—"}</Detail>
                            <Detail label="Channel">{selected.method?.toUpperCase() ?? "—"}</Detail>
                            <Detail label="Account name">{selected.account_name ?? "—"}</Detail>
                            <Detail label="Account number">{selected.account_number ?? "—"}</Detail>
                            <Detail label="Requested">{formatDateTime(selected.created_at)}</Detail>
                            {selected.processed_at ? <Detail label="Processed">{`${formatDateTime(selected.processed_at)} by ${fullName(selected.processor)}`}</Detail> : null}
                            {selected.notes ? <Detail label="Notes">{selected.notes}</Detail> : null}
                        </div>
                        {canProcess && selected.status === "pending" ? (
                            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional note (shown when rejecting)" rows={2} className={`${inputClass} h-auto py-2.5`} />
                        ) : null}
                    </div>
                ) : null}
            </AppDialog>
        </div>
    );
}
