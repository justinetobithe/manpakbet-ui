"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Button>;

export function AppButton({ className, ...props }: Props) {
    return (
        <Button
            className={cn(
                "rounded-2xl bg-primary text-primary-foreground shadow-sm",
                "hover:bg-primary/90 active:bg-primary/85",
                "focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-0",
                className
            )}
            {...props}
        />
    );
}
