"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const appButtonVariants = cva(
    "group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-semibold transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            tone: {
                gold: "bg-gold text-[#2a1600] ring-gold hover:brightness-110",
                ember: "bg-ember text-white shadow-[0_10px_30px_-10px_rgba(255,46,116,0.7)] hover:brightness-110",
                surface: "border border-border bg-fg/5 text-foreground hover:border-fg/20 hover:bg-fg/9",
                outline: "border border-gold-400/40 bg-transparent text-gold-300 hover:bg-gold-400/10",
                ghost: "bg-transparent text-foreground/80 hover:bg-fg/6 hover:text-foreground",
                danger: "bg-destructive/90 text-white hover:bg-destructive",
                success: "bg-success/90 text-[#00241a] hover:bg-success",
                link: "h-auto bg-transparent p-0 text-gold-300 underline-offset-4 hover:underline",
            },
            size: {
                xs: "h-7 rounded-lg px-2.5 text-xs",
                sm: "h-9 rounded-xl px-3.5 text-[13px]",
                md: "h-10 rounded-xl px-4 text-sm",
                lg: "h-12 rounded-2xl px-6 text-[15px]",
                xl: "h-14 rounded-2xl px-8 text-base",
                icon: "size-10 rounded-xl",
                "icon-sm": "size-8 rounded-lg",
            },
            block: {
                true: "w-full",
            },
        },
        defaultVariants: { tone: "gold", size: "md" },
    }
);

export type AppButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof appButtonVariants> & {
        asChild?: boolean;
        loading?: boolean;
        shine?: boolean;
        leftIcon?: React.ReactNode;
        rightIcon?: React.ReactNode;
    };

export default function AppButton({
    className,
    tone,
    size,
    block,
    asChild = false,
    loading = false,
    shine = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    ...props
}: AppButtonProps) {
    const classes = cn(appButtonVariants({ tone, size, block }), className);

    if (asChild) {
        return (
            <Slot className={classes} {...props}>
                {children}
            </Slot>
        );
    }

    return (
        <button className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
            {shine ? (
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-linear-to-r from-transparent via-fg/45 to-transparent" />
            ) : null}
            {loading ? <Loader2 className="animate-spin" /> : leftIcon}
            {children}
            {!loading ? rightIcon : null}
        </button>
    );
}

export { appButtonVariants };
