"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import AppButton from "./AppButton";
import AppDialog from "./AppDialog";

type AppConfirmProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: React.ReactNode;
    confirmLabel?: string;
    tone?: "danger" | "gold";
    loading?: boolean;
    onConfirm: () => void;
    children?: React.ReactNode;
};

export default function AppConfirm({
    open,
    onOpenChange,
    title = "Are you sure?",
    description,
    confirmLabel = "Confirm",
    tone = "danger",
    loading,
    onConfirm,
    children,
}: AppConfirmProps) {
    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            size="sm"
            title={title}
            footer={
                <>
                    <AppButton tone="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </AppButton>
                    <AppButton tone={tone} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </AppButton>
                </>
            }
        >
            <div className="flex gap-4">
                <div className={tone === "danger" ? "grid size-11 shrink-0 place-items-center rounded-2xl bg-destructive/15 text-red-300" : "grid size-11 shrink-0 place-items-center rounded-2xl bg-gold-400/15 text-gold-300"}>
                    <AlertTriangle className="size-5" />
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                    {description ? <div>{description}</div> : null}
                    {children}
                </div>
            </div>
        </AppDialog>
    );
}
