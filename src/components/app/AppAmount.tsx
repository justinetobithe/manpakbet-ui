"use client";

import { useWalletStore } from "@/stores";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type AppAmountProps = {
    value: number | string | null | undefined;
    className?: string;
    respectPrivacy?: boolean;
    signed?: boolean;
};

export default function AppAmount({ value, className, respectPrivacy = true, signed = false }: AppAmountProps) {
    const hidden = useWalletStore((state) => state.hideBalance);
    const amount = Number(value ?? 0);

    if (respectPrivacy && hidden) return <span className={cn("tabular-nums tracking-widest", className)}>₱ ••••</span>;

    return (
        <span className={cn("tabular-nums", signed && amount > 0 && "text-jade-400", signed && amount < 0 && "text-red-300", className)}>
            {signed && amount > 0 ? "+" : ""}
            {formatMoney(amount)}
        </span>
    );
}
