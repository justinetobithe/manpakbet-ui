import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap [&_svg]:size-3", {
    variants: {
        tone: {
            neutral: "bg-fg/7 text-foreground/80 ring-1 ring-fg/10",
            gold: "bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/30",
            ember: "bg-ember-500/15 text-ember-400 ring-1 ring-ember-500/30",
            success: "bg-success/15 text-jade-400 ring-1 ring-success/30",
            warning: "bg-warning/15 text-amber-300 ring-1 ring-warning/30",
            danger: "bg-destructive/15 text-red-300 ring-1 ring-destructive/30",
            info: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30",
            violet: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30",
            solidGold: "bg-gold text-[#2a1600]",
            solidEmber: "bg-ember text-white",
        },
        size: {
            sm: "px-2 py-0.5 text-[10px] tracking-wide uppercase",
            md: "px-2.5 py-1 text-xs",
        },
    },
    defaultVariants: { tone: "neutral", size: "md" },
});

type AppBadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants> & { dot?: boolean };

export default function AppBadge({ className, tone, size, dot, children, ...props }: AppBadgeProps) {
    return (
        <span className={cn(badgeVariants({ tone, size }), className)} {...props}>
            {dot ? <span className="size-1.5 rounded-full bg-current" /> : null}
            {children}
        </span>
    );
}

export const statusTone = (status?: string | null): VariantProps<typeof badgeVariants>["tone"] => {
    switch (status) {
        case "approved":
        case "active":
        case "published":
            return "success";
        case "pending":
            return "warning";
        case "rejected":
        case "inactive":
        case "suspended":
            return "danger";
        default:
            return "neutral";
    }
};
