"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Button> & {
    tone?: "primary" | "surface";
};

export function AppButton({ className, tone = "primary", ...props }: Props) {
    return (
        <Button
            {...props}
            className={cn(
                "rounded-2xl border transition active:scale-[0.99]",
                tone === "primary" &&
                "border-white/10 bg-white/10 text-white hover:bg-white/15",
                tone === "surface" &&
                "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]",
                className
            )}
        />
    );
}
