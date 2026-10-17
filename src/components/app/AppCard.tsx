import * as React from "react";
import { cn } from "@/lib/utils";

type AppCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    icon?: React.ReactNode;
    padded?: boolean;
    glow?: boolean;
    bodyClassName?: string;
};

export default function AppCard({ title, description, actions, icon, padded = true, glow = false, className, bodyClassName, children, ...props }: AppCardProps) {
    const hasHeader = Boolean(title || description || actions);

    return (
        <div className={cn("surface relative overflow-hidden rounded-2xl", glow && "border-gradient", className)} {...props}>
            {hasHeader ? (
                <div className={cn("flex flex-wrap items-start justify-between gap-3", padded ? "px-4 pt-4 sm:px-5 sm:pt-5" : "px-4 pt-4")}>
                    <div className="flex min-w-0 items-start gap-3">
                        {icon ? <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-fg/6 text-gold-300 ring-1 ring-fg/10">{icon}</div> : null}
                        <div className="min-w-0">
                            {title ? <h3 className="text-base font-bold text-foreground">{title}</h3> : null}
                            {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
                        </div>
                    </div>
                    {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
                </div>
            ) : null}
            <div className={cn(padded && "p-4 sm:p-5", hasHeader && padded && "pt-4 sm:pt-4", bodyClassName)}>{children}</div>
        </div>
    );
}
