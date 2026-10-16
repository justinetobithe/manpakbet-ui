"use client";

import { z } from "zod";
import { BadgePercent } from "lucide-react";
import { AppBadge } from "@/components/app";
import { fromDateTimeLocal, toDateTimeLocal } from "@/components/admin/AdminFields";
import ResourceManager, { type ResourceConfig } from "@/components/admin/ResourceManager";
import { activeFilter, DateCell, MediaCell, StatusCell } from "@/components/admin/cells";
import type { Promotion } from "@/types/Content";

const schema = z
    .object({
        title: z.string().trim().min(1, "Title is required").max(150),
        slug: z.string().trim().max(160),
        tag: z.string().max(40),
        summary: z.string().max(255),
        content: z.string(),
        image: z.string().max(500),
        cta_label: z.string().max(50),
        cta_url: z.string().max(500),
        starts_at: z.string(),
        ends_at: z.string(),
        sort_order: z.string().regex(/^\d*$/, "Must be a whole number"),
        is_active: z.boolean(),
    })
    .refine((value) => !value.starts_at || !value.ends_at || new Date(value.ends_at) >= new Date(value.starts_at), { path: ["ends_at"], message: "End must be after start" });

const config: ResourceConfig<Promotion> = {
    resource: "promotions",
    title: "Promotions",
    singular: "Promotion",
    description: "Bonuses and campaigns shown on the promotions page.",
    icon: <BadgePercent />,
    permission: "content.manage",
    schema,
    defaults: { title: "", slug: "", tag: "", summary: "", content: "", image: "", cta_label: "", cta_url: "", starts_at: "", ends_at: "", sort_order: "0", is_active: true },
    toForm: (promotion) => ({
        title: promotion.title,
        slug: promotion.slug,
        tag: promotion.tag ?? "",
        summary: promotion.summary ?? "",
        content: promotion.content ?? "",
        image: promotion.image ?? "",
        cta_label: promotion.cta_label ?? "",
        cta_url: promotion.cta_url ?? "",
        starts_at: toDateTimeLocal(promotion.starts_at),
        ends_at: toDateTimeLocal(promotion.ends_at),
        sort_order: String(promotion.sort_order ?? 0),
        is_active: promotion.is_active,
    }),
    toPayload: (values) => ({
        ...values,
        slug: values.slug || null,
        tag: values.tag || null,
        summary: values.summary || null,
        content: values.content || null,
        image: values.image || null,
        cta_label: values.cta_label || null,
        cta_url: values.cta_url || null,
        starts_at: fromDateTimeLocal(values.starts_at),
        ends_at: fromDateTimeLocal(values.ends_at),
        sort_order: Number(values.sort_order || 0),
    }),
    filters: [activeFilter],
    dialogSize: "xl",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text", placeholder: "Auto-generated if empty" },
        { name: "tag", label: "Tag", type: "text", placeholder: "Welcome, Cashback, VIP…" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "summary", label: "Summary", type: "textarea", rows: 2 },
        { name: "content", label: "Mechanics (HTML allowed)", type: "textarea", rows: 6 },
        { name: "image", label: "Artwork", type: "image", folder: "promotions" },
        { name: "starts_at", label: "Starts", type: "datetime" },
        { name: "ends_at", label: "Ends", type: "datetime" },
        { name: "cta_label", label: "Button label", type: "text" },
        { name: "cta_url", label: "Button link", type: "text" },
        { name: "is_active", label: "Active", type: "switch", span: 2 },
    ],
    columns: [
        { accessorKey: "title", header: "Promotion", cell: ({ row }) => <MediaCell wide image={row.original.image} title={row.original.title} subtitle={row.original.summary} /> },
        {
            accessorKey: "tag",
            header: "Tag",
            enableSorting: false,
            cell: ({ row }) =>
                row.original.tag ? (
                    <AppBadge size="sm" tone="gold">
                        {row.original.tag}
                    </AppBadge>
                ) : (
                    "—"
                ),
        },
        { accessorKey: "starts_at", header: "Starts", meta: { hideOnMobile: true }, cell: ({ row }) => <DateCell value={row.original.starts_at} /> },
        { accessorKey: "ends_at", header: "Ends", cell: ({ row }) => <DateCell value={row.original.ends_at} /> },
        { accessorKey: "is_active", header: "Status", enableSorting: false, cell: ({ row }) => <StatusCell active={row.original.is_active} /> },
    ],
};

export default function AdminPromotionsPage() {
    return <ResourceManager config={config} />;
}
