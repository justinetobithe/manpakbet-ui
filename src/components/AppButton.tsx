"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppButtonTone = "primary" | "surface" | "ghost" | "danger";
type AppButtonGlow = "none" | "soft";

type Props = React.ComponentProps<typeof Button> & {
    tone?: AppButtonTone;
    glow?: AppButtonGlow;
};

export default function AppButton({
    className,
    tone = "primary",
    glow = "soft",
    ...props
}: Props) {
    const base =
        "group relative inline-flex items-center justify-center gap-2 rounded-2xl font-semibold " +
        "transition-all duration-200 select-none " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/30 focus-visible:ring-offset-0 " +
        "disabled:pointer-events-none disabled:opacity-50 " +
        "active:translate-y-[0.5px] active:scale-[0.99]";

    const tones: Record<AppButtonTone, string> = {
        primary:
            "text-white border border-emerald-200/20 " +
            "bg-gradient-to-r from-emerald-500/85 via-emerald-400/65 to-cyan-400/55 " +
            "shadow-[0_12px_28px_rgba(16,185,129,0.16)] " +
            "hover:brightness-[1.04] hover:saturate-[1.03]",
        surface:
            "text-white border border-white/10 " +
            "bg-white/[0.06] hover:bg-white/[0.10] " +
            "shadow-[0_10px_26px_rgba(0,0,0,0.25)]",
        ghost:
            "text-white/85 border border-transparent " +
            "bg-transparent hover:bg-white/[0.06] " +
            "shadow-none",
        danger:
            "text-white border border-white/10 " +
            "bg-gradient-to-r from-rose-500/90 to-orange-400/85 " +
            "hover:brightness-[1.03] " +
            "shadow-[0_10px_30px_rgba(244,63,94,0.18)]",
    };

    const glowLayer =
        glow === "soft"
            ? "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:opacity-0 " +
            "before:blur-xl before:transition-opacity before:duration-300 group-hover:before:opacity-100 " +
            (tone === "primary"
                ? "before:bg-[radial-gradient(60%_60%_at_50%_50%,rgba(16,185,129,0.22),transparent_70%)]"
                : tone === "danger"
                    ? "before:bg-[radial-gradient(60%_60%_at_50%_50%,rgba(244,63,94,0.25),transparent_70%)]"
                    : "before:bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,255,255,0.12),transparent_70%)]")
            : "";

    const chrome =
        "after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none " +
        "after:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.14),transparent_38%,rgba(0,0,0,0.10))] " +
        "after:opacity-70";

    return (
        <Button {...props} className={cn(base, glowLayer, chrome, tones[tone], className)} />
    );
}
