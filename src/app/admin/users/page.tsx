"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { LayoutGrid, List, Mail, Phone, Plus, Users } from "lucide-react";
import { AppAmount, AppBadge, AppButton, AppEmpty, AppPageHeader, AppSearchInput, AppTable, type AppTableSort } from "@/components/app";
import { KycStatusBadge } from "@/components/account/KycForm";
import { AccountFormDialog } from "@/components/admin/AccountDialogs";
import { DateCell, StatusCell } from "@/components/admin/cells";
import { useAuth } from "@/hooks/useAuth";
import { useAdminList } from "@/lib/AdminAPI";
import { initials, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores";
import type { ListParams } from "@/types/Api";
import type { User } from "@/types/User";

type Tab = "all" | "user" | "staff" | "admin" | "suspended";

const tabs: Array<{ id: Tab; label: string }> = [
    { id: "all", label: "All accounts" },
    { id: "user", label: "Players" },
    { id: "staff", label: "Staff" },
    { id: "admin", label: "Admins" },
    { id: "suspended", label: "Suspended" },
];

const roleTone = (role: string) => (role === "admin" ? "ember" : role === "staff" ? "violet" : "neutral");

export default function AdminAccountsPage() {
    const router = useRouter();
    const { can } = useAuth();
    const pageSize = useAdminStore((state) => state.pageSize);
    const setPageSize = useAdminStore((state) => state.setPageSize);
    const [tab, setTab] = React.useState<Tab>("all");
    const [view, setView] = React.useState<"cards" | "table">("cards");
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("");
    const [sort, setSort] = React.useState<AppTableSort>({ id: "id", desc: true });
    const [creating, setCreating] = React.useState(false);

    const params: ListParams = {
        page,
        per_page: view === "cards" ? 12 : pageSize,
        search: search || undefined,
        sort: sort?.id,
        direction: sort?.desc ? "desc" : "asc",
        role: tab !== "all" && tab !== "suspended" ? tab : undefined,
        is_active: tab === "suspended" ? 0 : undefined,
    };

    const list = useAdminList<User>("users", params);
    const meta = list.data?.meta;

    const columns: ColumnDef<User, unknown>[] = [
        {
            accessorKey: "first_name",
            header: "Account",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-plum-600 to-plum-700 text-xs font-bold">{initials(row.original.name)}</span>
                    <div className="min-w-0">
                        <div className="max-w-[200px] truncate font-semibold">{row.original.name}</div>
                        <div className="max-w-[200px] truncate text-xs text-muted-foreground">{row.original.email ?? row.original.phone}</div>
                    </div>
                </div>
            ),
        },
        {
            id: "role",
            header: "Role",
            enableSorting: false,
            cell: ({ row }) => (
                <AppBadge size="sm" tone={roleTone(row.original.role)}>
                    {row.original.role}
                </AppBadge>
            ),
        },
        { id: "kyc", header: "KYC", enableSorting: false, cell: ({ row }) => <KycStatusBadge status={row.original.kyc_status} /> },
        { accessorKey: "balance", header: "Balance", meta: { align: "right" }, cell: ({ row }) => <AppAmount value={row.original.balance} respectPrivacy={false} className="font-semibold" /> },
        { accessorKey: "last_login_at", header: "Last seen", meta: { hideOnMobile: true }, cell: ({ row }) => <span className="text-muted-foreground">{timeAgo(row.original.last_login_at)}</span> },
        { accessorKey: "created_at", header: "Joined", meta: { hideOnMobile: true }, cell: ({ row }) => <DateCell value={row.original.created_at} /> },
        { accessorKey: "is_active", header: "Status", enableSorting: false, cell: ({ row }) => <StatusCell active={row.original.is_active} off="Suspended" /> },
    ];

    const toolbar = (
        <>
            <AppSearchInput
                value={search}
                onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                placeholder="Search name, email or phone…"
                className="w-full sm:max-w-sm sm:flex-1"
            />
            <div className="flex rounded-xl border border-border bg-black/20 p-1 sm:ml-auto">
                {(["cards", "table"] as const).map((mode) => (
                    <button
                        key={mode}
                        type="button"
                        onClick={() => {
                            setView(mode);
                            setPage(1);
                        }}
                        className={cn("grid size-8 place-items-center rounded-lg transition", view === mode ? "bg-gold text-[#2a1600]" : "text-muted-foreground hover:text-foreground")}
                        aria-label={mode === "cards" ? "Card view" : "Table view"}
                    >
                        {mode === "cards" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
                    </button>
                ))}
            </div>
        </>
    );

    return (
        <div className="space-y-5">
            <AppPageHeader
                icon={<Users />}
                title="Accounts"
                description="Players, staff and administrators. Open an account for history, KYC and balance tools."
                actions={
                    can("users.manage") ? (
                        <AppButton leftIcon={<Plus />} onClick={() => setCreating(true)}>
                            New account
                        </AppButton>
                    ) : null
                }
            />

            <div className="no-scrollbar -mx-3 flex gap-1.5 overflow-x-auto px-3 sm:mx-0 sm:px-0">
                {tabs.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                            setTab(item.id);
                            setPage(1);
                        }}
                        className={cn(
                            "relative h-10 shrink-0 rounded-xl border px-4 text-sm font-semibold transition",
                            tab === item.id ? "border-transparent text-[#2a1600]" : "border-border bg-white/3 text-foreground/70 hover:text-foreground"
                        )}
                    >
                        {tab === item.id ? <motion.span layoutId="accounts-tab" className="bg-gold absolute inset-0 rounded-xl" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                        <span className="relative">{item.label}</span>
                    </button>
                ))}
            </div>

            {view === "table" ? (
                <AppTable
                    columns={columns}
                    data={list.data?.data}
                    meta={meta}
                    isLoading={list.isLoading}
                    isFetching={list.isFetching}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    sort={sort}
                    onSortChange={setSort}
                    onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
                    toolbar={toolbar}
                    emptyTitle="No accounts found"
                />
            ) : (
                <div className="surface overflow-hidden rounded-2xl">
                    <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:p-4">{toolbar}</div>
                    <div className="p-3 sm:p-4">
                        {list.isLoading ? (
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="h-44 animate-pulse rounded-2xl bg-white/5" />
                                ))}
                            </div>
                        ) : list.data?.data.length ? (
                            <div className={cn("grid gap-3 transition-opacity sm:grid-cols-2 xl:grid-cols-3", list.isFetching && "opacity-60")}>
                                {list.data.data.map((user, index) => (
                                    <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-plum-850 p-4 transition hover:-translate-y-0.5 hover:border-gold-400/40"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-ember-500 to-gold-500 font-display font-extrabold text-white">
                                                    {initials(user.name)}
                                                    <span className={cn("absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-plum-850", user.is_active ? "bg-jade-400" : "bg-red-400")} />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate font-bold group-hover:text-gold-200">{user.name}</div>
                                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                                        <AppBadge size="sm" tone={roleTone(user.role)}>
                                                            {user.role}
                                                        </AppBadge>
                                                        <KycStatusBadge status={user.kyc_status} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                {user.email ? (
                                                    <div className="flex items-center gap-2 truncate">
                                                        <Mail className="size-3.5 shrink-0" /> {user.email}
                                                    </div>
                                                ) : null}
                                                {user.phone ? (
                                                    <div className="flex items-center gap-2 truncate">
                                                        <Phone className="size-3.5 shrink-0" /> {user.phone}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-3">
                                                <div>
                                                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Balance</div>
                                                    <AppAmount value={user.balance} respectPrivacy={false} className="font-display text-lg font-extrabold text-gold-200" />
                                                </div>
                                                <div className="text-right text-[11px] text-muted-foreground">Seen {timeAgo(user.last_login_at)}</div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <AppEmpty icon={<Users />} title="No accounts found" />
                        )}
                    </div>
                    {meta && meta.last_page > 1 ? (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
                            <span>
                                {meta.total} accounts · page {meta.current_page} of {meta.last_page}
                            </span>
                            <div className="flex gap-2">
                                <AppButton tone="surface" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                                    Previous
                                </AppButton>
                                <AppButton tone="surface" size="sm" disabled={page >= meta.last_page} onClick={() => setPage((value) => value + 1)}>
                                    Next
                                </AppButton>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            <AccountFormDialog open={creating} onOpenChange={setCreating} onSaved={(user) => router.push(`/admin/users/${user.id}`)} />
        </div>
    );
}
