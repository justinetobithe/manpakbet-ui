"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { formatDate, formatMoney, formatMoneyCompact } from "@/lib/format";

type Point = { date: string; deposits: number; withdrawals: number };

const SERIES = [
    { key: "deposits", label: "Deposits", color: "#bf800a" },
    { key: "withdrawals", label: "Withdrawals", color: "#8b5cf6" },
] as const;

const HEIGHT = 220;
const PAD = { top: 12, right: 8, bottom: 28, left: 56 };

const niceMax = (value: number) => {
    if (value <= 0) return 1000;
    const exponent = Math.pow(10, Math.floor(Math.log10(value)));
    const fraction = value / exponent;
    const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    return nice * exponent;
};

export default function TrendChart({ data }: { data: Point[] }) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [width, setWidth] = React.useState(640);
    const [hover, setHover] = React.useState<number | null>(null);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const max = niceMax(Math.max(0, ...data.flatMap((point) => [point.deposits, point.withdrawals])));
    const innerW = width - PAD.left - PAD.right;
    const innerH = HEIGHT - PAD.top - PAD.bottom;
    const groupW = innerW / Math.max(data.length, 1);
    const barW = Math.min(22, Math.max(6, (groupW - 14) / 2 - 1));
    const y = (value: number) => PAD.top + innerH - (value / max) * innerH;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ratio * max);

    const barPath = (x: number, value: number) => {
        const top = y(value);
        const h = PAD.top + innerH - top;
        if (h <= 0) return "";
        const r = Math.min(4, h, barW / 2);
        const bottom = PAD.top + innerH;
        return `M${x} ${bottom}V${top + r}Q${x} ${top} ${x + r} ${top}H${x + barW - r}Q${x + barW} ${top} ${x + barW} ${top + r}V${bottom}Z`;
    };

    const active = hover !== null ? data[hover] : null;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {SERIES.map((series) => (
                    <span key={series.key} className="inline-flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm" style={{ background: series.color }} />
                        {series.label}
                    </span>
                ))}
            </div>
            <div ref={ref} className="relative" onMouseLeave={() => setHover(null)}>
                <svg width={width} height={HEIGHT} role="img" aria-label="Approved deposits and withdrawals over the last 7 days" className="block overflow-visible">
                    {ticks.map((tick) => (
                        <g key={tick}>
                            <line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} stroke="currentColor" className="text-fg/10" strokeDasharray={tick === 0 ? undefined : "3 4"} />
                            <text x={PAD.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[10px]">
                                {formatMoneyCompact(tick)}
                            </text>
                        </g>
                    ))}
                    {data.map((point, index) => {
                        const groupX = PAD.left + index * groupW;
                        const start = groupX + (groupW - (barW * 2 + 2)) / 2;
                        return (
                            <g key={point.date}>
                                {hover === index ? <rect x={groupX + 2} y={PAD.top} width={groupW - 4} height={innerH} rx={8} className="fill-white/4" /> : null}
                                {SERIES.map((series, seriesIndex) => (
                                    <motion.path
                                        key={series.key}
                                        d={barPath(start + seriesIndex * (barW + 2), point[series.key])}
                                        fill={series.color}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: hover === null || hover === index ? 1 : 0.45 }}
                                        transition={{ duration: 0.3, delay: hover === null ? index * 0.04 : 0 }}
                                    />
                                ))}
                                <text x={groupX + groupW / 2} y={HEIGHT - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                                    {formatDate(point.date, { weekday: "short" })}
                                </text>
                                <rect x={groupX} y={PAD.top} width={groupW} height={innerH + PAD.bottom} fill="transparent" onMouseEnter={() => setHover(index)} onFocus={() => setHover(index)} tabIndex={0} />
                            </g>
                        );
                    })}
                </svg>
                {active && hover !== null ? (
                    <div
                        className="pointer-events-none absolute top-0 z-10 w-44 rounded-xl border border-border bg-popover/95 p-3 text-xs shadow-xl backdrop-blur"
                        style={{ left: Math.min(Math.max(PAD.left + hover * groupW + groupW / 2 - 88, 0), width - 176) }}
                    >
                        <div className="mb-2 font-bold text-foreground">{formatDate(active.date, { weekday: "long", month: "short", day: "numeric" })}</div>
                        {SERIES.map((series) => (
                            <div key={series.key} className="flex items-center justify-between gap-2 py-0.5">
                                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                    <span className="size-2 rounded-sm" style={{ background: series.color }} />
                                    {series.label}
                                </span>
                                <span className="font-semibold text-foreground tabular-nums">{formatMoney(active[series.key])}</span>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
            <table className="sr-only">
                <caption>Approved deposits and withdrawals by day</caption>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Deposits</th>
                        <th>Withdrawals</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((point) => (
                        <tr key={point.date}>
                            <td>{point.date}</td>
                            <td>{formatMoney(point.deposits)}</td>
                            <td>{formatMoney(point.withdrawals)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
