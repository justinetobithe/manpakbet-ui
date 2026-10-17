"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { BadgeCheck, Eye } from "lucide-react";
import { AppBadge, AppButton, AppPageHeader, AppSearchInput, AppTable } from "@/components/app";
import { KycReviewDialog, kycTone } from "@/components/admin/KycReview";
import { useAdminList } from "@/lib/AdminAPI";
import { formatDate, formatDateTime, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores";
import type { KycSubmission } from "@/types/Kyc";

const tabs = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "", label: "All" },
];

export default function AdminKycPage() {
    const pageSize = useAdminStore((state) => state.pageSize);
    const setPageSize = useAdminStore((state) => state.setPageSize);
    const [status, setStatus] = React.useState("pending");
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("");
    const [reviewing, setReviewing] = React.useState<number | null>(null);
    const list = useAdminList<KycSubmission>("kyc", { page, per_page: pageSize, status: status || undefined, search: search || undefined });

    const columns: ColumnDef<KycSubmission, unknown>[] = [
        {
            id: "player",
            header: "Player",
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="max-w-[220px] truncate font-semibold">
                        {row.original.first_name} {row.original.last_name}
                    </div>
                    <div className="max-w-[220px] truncate text-xs text-muted-foreground">{row.original.user?.email ?? row.original.user?.phone}</div>
                </div>
            ),
        },
        { accessorKey: "id_type_label", header: "Document", cell: ({ row }) => <span>{row.original.id_type_label}</span> },
        { accessorKey: "masked_id_number", header: "ID number", meta: { hideOnMobile: true }, cell: ({ row }) => <span className="font-mono text-xs">{row.original.masked_id_number}</span> },
        { accessorKey: "birthdate", header: "Birthdate", meta: { hideOnMobile: true }, cell: ({ row }) => formatDate(row.original.birthdate) },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <AppBadge size="sm" tone={kycTone(row.original.status)} dot>
                    {row.original.status}
                </AppBadge>
            ),
        },
        { accessorKey: "created_at", header: "Submitted", cell: ({ row }) => <span className="text-muted-foreground" title={formatDateTime(row.original.created_at)}>{timeAgo(row.original.created_at)}</span> },
        {
            id: "actions",
            header: "",
            meta: { align: "right" },
            cell: ({ row }) => (
                <AppButton tone={row.original.status === "pending" ? "gold" : "ghost"} size="sm" leftIcon={<Eye />} onClick={() => setReviewing(row.original.id)}>
                    {row.original.status === "pending" ? "Review" : "View"}
                </AppButton>
            ),
        },
    ];

    return (
        <div className="space-y-5">
            <AppPageHeader icon={<BadgeCheck />} title="KYC Review" description="Verify player identities before they can withdraw." />

            <div className="no-scrollbar -mx-3 flex gap-1.5 overflow-x-auto px-3 sm:mx-0 sm:px-0">
                {tabs.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                            setStatus(item.id);
                            setPage(1);
                        }}
                        className={cn("relative h-10 shrink-0 rounded-xl border px-4 text-sm font-semibold transition", status === item.id ? "border-transparent text-[#2a1600]" : "border-border bg-fg/3 text-foreground/70 hover:text-foreground")}
                    >
                        {status === item.id ? <motion.span layoutId="kyc-tab" className="bg-gold absolute inset-0 rounded-xl" /> : null}
                        <span className="relative">{item.label}</span>
                    </button>
                ))}
            </div>

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
                onRowClick={(submission) => setReviewing(submission.id)}
                emptyTitle={status === "pending" ? "No pending verifications" : "No requests found"}
                emptyIcon={<BadgeCheck />}
                toolbar={
                    <AppSearchInput
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        placeholder="Search name, ID number or email…"
                        className="w-full sm:max-w-sm"
                    />
                }
                renderMobileCard={(submission) => (
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="truncate font-semibold">
                                {submission.first_name} {submission.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {submission.id_type_label} · {timeAgo(submission.created_at)}
                            </div>
                        </div>
                        <AppBadge size="sm" tone={kycTone(submission.status)}>
                            {submission.status}
                        </AppBadge>
                    </div>
                )}
            />

            <KycReviewDialog id={reviewing} onOpenChange={(open) => (!open ? setReviewing(null) : undefined)} />
        </div>
    );
}
