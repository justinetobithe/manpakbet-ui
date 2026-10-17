"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const subscribe = () => () => undefined;

export default function AppThemeToggle({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = React.useSyncExternalStore(subscribe, () => true, () => false);
    const dark = mounted && resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(dark ? "light" : "dark")}
            className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-fg/4 text-foreground/80 transition hover:bg-fg/8 hover:text-foreground",
                withLabel ? "w-full px-3 text-sm font-semibold" : "w-10",
                className
            )}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span key={dark ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    {dark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px] text-gold-300" />}
                </motion.span>
            </AnimatePresence>
            {withLabel ? <span>{dark ? "Dark mode" : "Light mode"}</span> : null}
        </button>
    );
}
