"use client";

import { Check, Minus } from "lucide-react";
import { AppBadge, AppImage } from "@/components/app";
import { formatDate } from "@/lib/format";

export function StatusCell({ active, on = "Active", off = "Hidden" }: { active: boolean; on?: string; off?: string }) {
    return (
        <AppBadge size="sm" tone={active ? "success" : "neutral"} dot>
            {active ? on : off}
        </AppBadge>
    );
}

export function BoolCell({ value }: { value: boolean }) {
    return value ? <Check className="size-4 text-jade-400" /> : <Minus className="size-4 text-muted-foreground" />;
}

export function MediaCell({ image, title, subtitle, wide = false }: { image?: string | null; title: string; subtitle?: string | null; wide?: boolean }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <AppImage src={image} alt="" wrapperClassName={wide ? "h-10 w-16 shrink-0 rounded-lg" : "size-10 shrink-0 rounded-lg"} />
            <div className="min-w-0">
                <div className="max-w-[240px] truncate font-semibold">{title}</div>
                {subtitle ? <div className="max-w-[240px] truncate text-xs text-muted-foreground">{subtitle}</div> : null}
            </div>
        </div>
    );
}

export function DateCell({ value }: { value?: string | null }) {
    return <span className="text-muted-foreground">{formatDate(value)}</span>;
}

export const activeFilter = {
    key: "is_active",
    label: "Status",
    options: [
        { label: "Active", value: "1" },
        { label: "Hidden", value: "0" },
    ],
};
