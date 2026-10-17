"use client";

import * as React from "react";
import Link from "next/link";
import { BadgeCheck, ExternalLink, ImageOff, Loader2, XCircle } from "lucide-react";
import { AppBadge, AppButton, AppConfirm, AppDialog, AppToast, inputClass } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { useAdminDetail, useKycFile, useReviewKyc } from "@/lib/AdminAPI";
import { formatDate, formatDateTime, fullName, titleCase } from "@/lib/format";
import type { KycFileType, KycSubmission } from "@/types/Kyc";

const fileLabels: Record<KycFileType, string> = { id_front: "ID front", id_back: "ID back", selfie: "Selfie with ID" };

export const kycTone = (status?: string) => (status === "approved" ? "success" : status === "rejected" ? "danger" : "warning");

function KycImage({ id, type }: { id: number; type: KycFileType }) {
    const { data, isLoading, isError } = useKycFile(id, type);

    return (
        <figure className="space-y-1.5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-black/40">
                {isLoading ? (
                    <Loader2 className="absolute inset-0 m-auto size-6 animate-spin text-gold-300" />
                ) : isError || !data ? (
                    <ImageOff className="absolute inset-0 m-auto size-6 text-muted-foreground" />
                ) : (
                    <a href={data} target="_blank" rel="noreferrer">
                        <img src={data} alt={fileLabels[type]} className="h-full w-full object-contain transition hover:scale-105" />
                    </a>
                )}
            </div>
            <figcaption className="text-center text-xs font-semibold text-muted-foreground">{fileLabels[type]}</figcaption>
        </figure>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border py-2 text-sm last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-semibold">{value || "—"}</span>
        </div>
    );
}

export function KycDetails({ submission }: { submission: KycSubmission }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
                {submission.files.map((type) => (
                    <KycImage key={type} id={submission.id} type={type} />
                ))}
            </div>
            <div className="grid gap-x-6 sm:grid-cols-2">
                <div>
                    <Row label="Full name" value={[submission.first_name, submission.middle_name, submission.last_name].filter(Boolean).join(" ")} />
                    <Row label="Date of birth" value={formatDate(submission.birthdate)} />
                    <Row label="Nationality" value={submission.nationality} />
                    <Row label="Occupation" value={submission.occupation} />
                    <Row label="Source of funds" value={submission.source_of_funds ? titleCase(submission.source_of_funds) : null} />
                </div>
                <div>
                    <Row label="ID type" value={submission.id_type_label} />
                    <Row label="ID number" value={submission.id_number ?? submission.masked_id_number} />
                    <Row label="Address" value={submission.address} />
                    <Row label="City / Province" value={`${submission.city}, ${submission.province}`} />
                    <Row label="ZIP" value={submission.zip_code} />
                </div>
            </div>
            {submission.reviewed_at ? (
                <div className="rounded-xl border border-border bg-white/3 p-3 text-xs text-muted-foreground">
                    Reviewed {formatDateTime(submission.reviewed_at)} by {fullName(submission.reviewer)}
                    {submission.rejection_reason ? <div className="mt-1 text-red-300">Reason: {submission.rejection_reason}</div> : null}
                </div>
            ) : null}
        </div>
    );
}

export function KycReviewActions({ submission, onDone }: { submission: KycSubmission; onDone?: () => void }) {
    const { can } = useAuth();
    const review = useReviewKyc();
    const [approving, setApproving] = React.useState(false);
    const [rejecting, setRejecting] = React.useState(false);
    const [reason, setReason] = React.useState("");

    if (submission.status !== "pending" || !can("kyc.review")) return null;

    const act = async (decision: "approve" | "reject") => {
        if (decision === "reject" && reason.trim().length < 5) {
            AppToast.warning("Please give the player a clear reason.");
            return;
        }
        try {
            const response = await review.mutateAsync({ id: submission.id, decision, reason: decision === "reject" ? reason.trim() : undefined });
            AppToast.success(response.message);
            setApproving(false);
            setRejecting(false);
            setReason("");
            onDone?.();
        } catch (err) {
            AppToast.apiError(err, "Review failed");
        }
    };

    return (
        <>
            <AppButton tone="danger" leftIcon={<XCircle />} onClick={() => setRejecting(true)}>
                Reject
            </AppButton>
            <AppButton tone="success" leftIcon={<BadgeCheck />} onClick={() => setApproving(true)}>
                Approve
            </AppButton>

            <AppConfirm
                open={approving}
                onOpenChange={setApproving}
                tone="gold"
                title="Approve this verification?"
                description={`${submission.first_name} ${submission.last_name} will be marked as verified and can withdraw funds.`}
                confirmLabel="Approve"
                loading={review.isPending}
                onConfirm={() => act("approve")}
            />

            <AppDialog
                open={rejecting}
                onOpenChange={setRejecting}
                size="sm"
                title="Reject verification"
                description="The player will see this reason and can submit again."
                footer={
                    <>
                        <AppButton tone="ghost" onClick={() => setRejecting(false)}>
                            Cancel
                        </AppButton>
                        <AppButton tone="danger" onClick={() => act("reject")} loading={review.isPending}>
                            Reject
                        </AppButton>
                    </>
                }
            >
                <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} placeholder="e.g. The ID photo is blurry. Please upload a clearer image." className={`${inputClass} h-auto py-3`} />
            </AppDialog>
        </>
    );
}

export function KycReviewDialog({ id, onOpenChange }: { id: number | null; onOpenChange: (open: boolean) => void }) {
    const { data, isLoading } = useAdminDetail<KycSubmission>("kyc", id);

    return (
        <AppDialog
            open={Boolean(id)}
            onOpenChange={onOpenChange}
            size="xl"
            title={data ? `${data.first_name} ${data.last_name}` : "Verification request"}
            description={data ? `Submitted ${formatDateTime(data.created_at)}` : undefined}
            footer={
                data ? (
                    <>
                        <AppButton asChild tone="ghost" className="mr-auto">
                            <Link href={`/admin/users/${data.user_id}`}>
                                <ExternalLink /> Open account
                            </Link>
                        </AppButton>
                        <KycReviewActions submission={data} onDone={() => onOpenChange(false)} />
                    </>
                ) : null
            }
        >
            {isLoading || !data ? (
                <div className="h-80 animate-pulse rounded-xl bg-white/5" />
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <AppBadge tone={kycTone(data.status)} dot>
                            {data.status}
                        </AppBadge>
                        <span className="text-sm text-muted-foreground">{data.user?.email ?? data.user?.phone}</span>
                    </div>
                    <KycDetails submission={data} />
                </div>
            )}
        </AppDialog>
    );
}
