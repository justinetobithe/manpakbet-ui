"use client";

import * as React from "react";
import { animate, useReducedMotion } from "framer-motion";
import { useWalletStore } from "@/stores";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type AppAmountProps = {
    value: number | string | null | undefined;
    className?: string;
    respectPrivacy?: boolean;
    signed?: boolean;
    countUp?: boolean;
    duration?: number;
};

function CountUp({ value, duration }: { value: number; duration: number }) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const current = React.useRef(0);
    const reduced = useReducedMotion();

    React.useEffect(() => {
        const controls = animate(current.current, value, {
            duration: reduced ? 0 : duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => {
                current.current = latest;
                if (ref.current) ref.current.textContent = formatMoney(latest);
            },
        });
        return () => controls.stop();
    }, [value, duration, reduced]);

    return <span ref={ref}>{formatMoney(0)}</span>;
}

export default function AppAmount({ value, className, respectPrivacy = true, signed = false, countUp = false, duration = 1.4 }: AppAmountProps) {
    const hidden = useWalletStore((state) => state.hideBalance);
    const amount = Number(value ?? 0);

    if (respectPrivacy && hidden) return <span className={cn("tabular-nums tracking-widest", className)}>₱ ••••</span>;

    return (
        <span className={cn("tabular-nums", signed && amount > 0 && "text-jade-400", signed && amount < 0 && "text-red-300", className)}>
            {signed && amount > 0 ? "+" : ""}
            {countUp ? <CountUp value={amount} duration={duration} /> : formatMoney(amount)}
        </span>
    );
}
