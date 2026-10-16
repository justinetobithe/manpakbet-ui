"use client";

import { ArrowDownToLine, ArrowUpFromLine, Gift, SlidersHorizontal } from "lucide-react";
import { AppAmount, AppBadge, statusTone } from "@/components/app";
import { formatDateTime, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/Wallet";

const typeMeta = {
    deposit: { icon: ArrowDownToLine, className: "bg-jade-500/15 text-jade-400", sign: 1 },
    withdraw: { icon: ArrowUpFromLine, className: "bg-ember-500/15 text-ember-400", sign: -1 },
    bonus: { icon: Gift, className: "bg-gold-400/15 text-gold-300", sign: 1 },
    adjustment: { icon: SlidersHorizontal, className: "bg-violet-500/15 text-violet-300", sign: 1 },
};

export function TransactionRow({ transaction }: { transaction: Transaction }) {
    const meta = typeMeta[transaction.type] ?? typeMeta.adjustment;
    const Icon = meta.icon;
    const amount = Number(transaction.amount) * meta.sign;

    return (
        <div className="flex items-center gap-3">
            <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl", meta.className)}>
                <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{titleCase(transaction.type)}</span>
                    {transaction.method ? <span className="text-xs text-muted-foreground uppercase">{transaction.method}</span> : null}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                    {transaction.reference} · {formatDateTime(transaction.created_at)}
                </div>
            </div>
            <div className="text-right">
                <AppAmount value={amount} signed respectPrivacy={false} className="text-sm font-bold" />
                <div className="mt-0.5">
                    <AppBadge size="sm" tone={statusTone(transaction.status)}>
                        {transaction.status}
                    </AppBadge>
                </div>
            </div>
        </div>
    );
}
