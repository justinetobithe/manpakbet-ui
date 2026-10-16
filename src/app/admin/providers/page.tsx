"use client";

import { z } from "zod";
import { Crown } from "lucide-react";
import ResourceManager, { type ResourceConfig } from "@/components/admin/ResourceManager";
import { activeFilter, MediaCell, StatusCell } from "@/components/admin/cells";
import { formatNumber } from "@/lib/format";
import type { GameProvider } from "@/types/Casino";

const schema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    slug: z.string().trim().max(120),
    logo: z.string().max(500),
    sort_order: z.string().regex(/^\d*$/, "Must be a whole number"),
    is_active: z.boolean(),
});

const config: ResourceConfig<GameProvider> = {
    resource: "providers",
    title: "Game studios",
    singular: "Studio",
    description: "Content partners powering the lobby.",
    icon: <Crown />,
    permission: "games.manage",
    schema,
    defaults: { name: "", slug: "", logo: "", sort_order: "0", is_active: true },
    toForm: (provider) => ({ name: provider.name, slug: provider.slug, logo: provider.logo ?? "", sort_order: String(provider.sort_order ?? 0), is_active: provider.is_active }),
    toPayload: (values) => ({ ...values, slug: values.slug || null, logo: values.logo || null, sort_order: Number(values.sort_order || 0) }),
    filters: [activeFilter],
    defaultSort: { id: "sort_order", desc: false },
    dialogSize: "md",
    fields: [
        { name: "name", label: "Studio name", type: "text", span: 2 },
        { name: "slug", label: "Slug", type: "text", placeholder: "Auto-generated if empty" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "logo", label: "Logo", type: "image", folder: "providers" },
        { name: "is_active", label: "Visible", type: "switch", span: 2 },
    ],
    columns: [
        { accessorKey: "name", header: "Studio", cell: ({ row }) => <MediaCell image={row.original.logo} title={row.original.name} subtitle={row.original.slug} /> },
        { accessorKey: "games_count", header: "Games", enableSorting: false, meta: { align: "right" }, cell: ({ row }) => formatNumber(row.original.games_count) },
        { accessorKey: "sort_order", header: "Order", meta: { align: "right" } },
        { accessorKey: "is_active", header: "Status", enableSorting: false, cell: ({ row }) => <StatusCell active={row.original.is_active} /> },
    ],
};

export default function AdminProvidersPage() {
    return <ResourceManager config={config} />;
}
