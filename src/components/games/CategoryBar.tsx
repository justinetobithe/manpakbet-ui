"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Clock3, Gamepad2, Heart, LayoutGrid } from "lucide-react";
import { categoryIcons } from "@/config/site";
import { useCategories } from "@/lib/CasinoAPI";
import { cn } from "@/lib/utils";

type CategoryBarProps = {
    activeSlug?: string | null;
    view?: string | null;
    className?: string;
};

export default function CategoryBar({ activeSlug, view, className }: CategoryBarProps) {
    const pathname = usePathname() ?? "/";
    const { data: categories, isLoading } = useCategories();

    const items = [
        { key: "all", label: "All Games", href: "/games", icon: LayoutGrid, active: pathname === "/games" && !view },
        { key: "favorites", label: "Favorites", href: "/games?view=favorites", icon: Heart, active: view === "favorites" },
        { key: "recent", label: "Recent", href: "/games?view=recent", icon: Clock3, active: view === "recent" },
        ...(categories ?? []).map((category) => ({
            key: category.slug,
            label: category.name,
            href: `/games/${category.slug}`,
            icon: categoryIcons[category.icon ?? ""] ?? Gamepad2,
            active: activeSlug === category.slug,
        })),
    ];

    return (
        <div className={cn("no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 py-1 sm:mx-0 sm:px-0", className)}>
            {items.map((item) => (
                <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                        "relative inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-[13px] font-semibold whitespace-nowrap transition",
                        item.active ? "border-transparent text-[#2a1600]" : "border-border bg-fg/3.5 text-foreground/75 hover:border-fg/20 hover:text-foreground"
                    )}
                >
                    {item.active ? <motion.span layoutId="category-active" className="bg-gold ring-gold absolute inset-0 rounded-xl" transition={{ type: "spring", stiffness: 400, damping: 34 }} /> : null}
                    <item.icon className="relative size-4" />
                    <span className="relative">{item.label}</span>
                </Link>
            ))}
            {isLoading ? Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-10 w-28 shrink-0 animate-pulse rounded-xl bg-fg/5" />) : null}
        </div>
    );
}
