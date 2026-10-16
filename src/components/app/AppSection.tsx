"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AppSectionProps = {
    title: React.ReactNode;
    icon?: React.ReactNode;
    href?: string;
    hrefLabel?: string;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
};

export default function AppSection({ title, icon, href, hrefLabel = "See all", subtitle, actions, className, children }: AppSectionProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn("space-y-3.5", className)}
        >
            <div className="flex items-end justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    {icon ? <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-linear-to-br from-gold-400/30 to-ember-500/20 text-gold-300 ring-1 ring-gold-400/25 [&_svg]:size-4">{icon}</span> : null}
                    <div className="min-w-0">
                        <h2 className="truncate font-display text-lg font-extrabold sm:text-xl">{title}</h2>
                        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                    {href ? (
                        <Link href={href} className="group inline-flex items-center gap-0.5 rounded-full border border-border bg-white/4 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition hover:border-gold-400/40 hover:text-gold-300">
                            {hrefLabel}
                            <ChevronRight className="size-3.5 transition group-hover:translate-x-0.5" />
                        </Link>
                    ) : null}
                </div>
            </div>
            {children}
        </motion.section>
    );
}
