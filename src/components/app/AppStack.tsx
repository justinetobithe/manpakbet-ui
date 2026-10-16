import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const stackVariants = cva("flex", {
    variants: {
        direction: {
            row: "flex-row",
            col: "flex-col",
            responsive: "flex-col md:flex-row",
        },
        gap: {
            0: "gap-0",
            1: "gap-1",
            2: "gap-2",
            3: "gap-3",
            4: "gap-4",
            5: "gap-5",
            6: "gap-6",
            8: "gap-8",
            10: "gap-10",
        },
        align: {
            start: "items-start",
            center: "items-center",
            end: "items-end",
            stretch: "items-stretch",
            baseline: "items-baseline",
        },
        justify: {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
        },
        wrap: {
            true: "flex-wrap",
        },
    },
    defaultVariants: { direction: "col", gap: 4 },
});

type AppStackProps = React.HTMLAttributes<HTMLElement> &
    VariantProps<typeof stackVariants> & {
        as?: "div" | "section" | "header" | "footer" | "ul" | "nav" | "article" | "aside" | "main" | "form";
    };

export default function AppStack({ as: Comp = "div", className, direction, gap, align, justify, wrap, ...props }: AppStackProps) {
    return <Comp className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)} {...props} />;
}
