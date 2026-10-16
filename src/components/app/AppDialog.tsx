"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const sizes = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    full: "sm:max-w-6xl",
};

type AppDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    size?: keyof typeof sizes;
    className?: string;
    bodyClassName?: string;
    hideHeader?: boolean;
    children: React.ReactNode;
};

export default function AppDialog({ open, onOpenChange, title, description, footer, size = "md", className, bodyClassName, hideHeader, children }: AppDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "surface-strong flex max-h-[92dvh] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden rounded-3xl border-border p-0 text-foreground shadow-2xl shadow-black/60",
                    sizes[size],
                    className
                )}
            >
                <DialogHeader className={cn("shrink-0 border-b border-border px-5 py-4 text-left sm:px-6", hideHeader && "sr-only")}>
                    <DialogTitle className="font-display text-lg font-bold">{title ?? "Dialog"}</DialogTitle>
                    {description ? <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription> : null}
                </DialogHeader>
                <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6", bodyClassName)}>{children}</div>
                {footer ? <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-black/20 px-5 py-4 sm:px-6">{footer}</div> : null}
            </DialogContent>
        </Dialog>
    );
}
