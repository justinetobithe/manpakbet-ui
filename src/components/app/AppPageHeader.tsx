import * as React from "react";
import { cn } from "@/lib/utils";

type AppPageHeaderProps = {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
};

export default function AppPageHeader({ eyebrow, title, description, actions, icon, className }: AppPageHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
            <div className="flex min-w-0 items-start gap-3.5">
                {icon ? (
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-gold-400/25 to-ember-500/15 text-gold-300 ring-1 ring-gold-400/25 [&_svg]:size-6">
                        {icon}
                    </div>
                ) : null}
                <div className="min-w-0">
                    {eyebrow ? <div className="mb-1 text-[11px] font-bold tracking-[0.2em] text-gold-300/90 uppercase">{eyebrow}</div> : null}
                    <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h1>
                    {description ? <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
                </div>
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
    );
}
