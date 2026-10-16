import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type AppEmptyProps = {
    icon?: React.ReactNode;
    title?: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
    compact?: boolean;
};

export default function AppEmpty({ icon, title = "Nothing here yet", description, action, className, compact }: AppEmptyProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center text-center", compact ? "gap-2 py-8" : "gap-3 py-14", className)}>
            <div className="relative grid size-14 place-items-center rounded-2xl bg-white/5 text-gold-300 ring-1 ring-white/10">
                <div className="absolute inset-0 rounded-2xl bg-gold-400/10 blur-xl" />
                <span className="relative [&_svg]:size-6">{icon ?? <Inbox />}</span>
            </div>
            <div className="space-y-1">
                <div className="font-display text-base font-bold">{title}</div>
                {description ? <div className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</div> : null}
            </div>
            {action ? <div className="pt-1">{action}</div> : null}
        </div>
    );
}
