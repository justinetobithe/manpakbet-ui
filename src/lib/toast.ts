import React from "react";
import { toast as sonnerToast } from "sonner";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

type Variant = "default" | "success" | "destructive" | "warning";

export function toast(opts: {
    title?: string;
    description?: string;
    variant?: Variant;
    duration?: number;
}) {
    const title = opts.title?.trim();
    const description = opts.description?.trim();
    const duration = opts.duration;

    const Icon =
        opts.variant === "success"
            ? CheckCircle2
            : opts.variant === "destructive"
                ? XCircle
                : opts.variant === "warning"
                    ? AlertTriangle
                    : Info;

    const className =
        opts.variant === "success"
            ? "h-4 w-4 text-emerald-400"
            : opts.variant === "destructive"
                ? "h-4 w-4 text-rose-400"
                : opts.variant === "warning"
                    ? "h-4 w-4 text-amber-400"
                    : "h-4 w-4 text-sky-300";

    const baseOptions = {
        duration,
        icon: React.createElement(Icon, { className }),
    };

    if (opts.variant === "success") {
        return sonnerToast.success(title ?? "Success", { ...baseOptions, description });
    }

    if (opts.variant === "destructive") {
        return sonnerToast.error(title ?? "Error", { ...baseOptions, description });
    }

    if (opts.variant === "warning") {
        return sonnerToast.warning(title ?? "Warning", { ...baseOptions, description });
    }

    if (title) return sonnerToast(title, { ...baseOptions, description });
    if (description) return sonnerToast(description, { ...baseOptions });
    return sonnerToast("", { ...baseOptions });
}
