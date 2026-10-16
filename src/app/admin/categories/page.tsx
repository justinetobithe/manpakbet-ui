"use client";

import { z } from "zod";
import { Gamepad2, Layers } from "lucide-react";
import ResourceManager, { type ResourceConfig } from "@/components/admin/ResourceManager";
import { activeFilter, StatusCell } from "@/components/admin/cells";
import { categoryIcons } from "@/config/site";
import { formatNumber, titleCase } from "@/lib/format";
import type { GameCategory } from "@/types/Casino";

const iconOptions = Object.keys(categoryIcons).map((value) => ({ label: titleCase(value), value }));

const schema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    slug: z.string().trim().max(120),
    icon: z.string(),
    sort_order: z.string().regex(/^\d*$/, "Must be a whole number"),
    is_active: z.boolean(),
});

const config: ResourceConfig<GameCategory> = {
    resource: "categories",
    title: "Categories",
    singular: "Category",
    description: "Lobby sections shown in navigation and on the home page.",
    icon: <Layers />,
    permission: "games.manage",
    schema,
    defaults: { name: "", slug: "", icon: "gamepad", sort_order: "0", is_active: true },
    toForm: (category) => ({ name: category.name, slug: category.slug, icon: category.icon ?? "", sort_order: String(category.sort_order ?? 0), is_active: category.is_active }),
    toPayload: (values) => ({ ...values, slug: values.slug || null, icon: values.icon || null, sort_order: Number(values.sort_order || 0) }),
    filters: [activeFilter],
    defaultSort: { id: "sort_order", desc: false },
    dialogSize: "md",
    fields: [
        { name: "name", label: "Name", type: "text", span: 2 },
        { name: "slug", label: "Slug", type: "text", placeholder: "Auto-generated if empty" },
        { name: "icon", label: "Icon", type: "select", options: iconOptions, allowEmpty: true },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Visible", type: "switch" },
    ],
    columns: [
        {
            accessorKey: "name",
            header: "Category",
            cell: ({ row }) => {
                const Icon = categoryIcons[row.original.icon ?? ""] ?? Gamepad2;
                return (
                    <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-lg bg-gold-400/12 text-gold-300 ring-1 ring-gold-400/20">
                            <Icon className="size-4" />
                        </span>
                        <div>
                            <div className="font-semibold">{row.original.name}</div>
                            <div className="text-xs text-muted-foreground">/{row.original.slug}</div>
                        </div>
                    </div>
                );
            },
        },
        { accessorKey: "games_count", header: "Games", enableSorting: false, meta: { align: "right" }, cell: ({ row }) => formatNumber(row.original.games_count) },
        { accessorKey: "sort_order", header: "Order", meta: { align: "right" } },
        { accessorKey: "is_active", header: "Status", enableSorting: false, cell: ({ row }) => <StatusCell active={row.original.is_active} /> },
    ],
    canDelete: (category) => !category.games_count,
};

export default function AdminCategoriesPage() {
    return <ResourceManager config={config} />;
}
