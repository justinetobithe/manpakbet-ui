"use client";

import { z } from "zod";
import { Images } from "lucide-react";
import { AppBadge } from "@/components/app";
import ResourceManager, { type ResourceConfig } from "@/components/admin/ResourceManager";
import { activeFilter, MediaCell, StatusCell } from "@/components/admin/cells";
import { titleCase } from "@/lib/format";
import type { Banner } from "@/types/Content";

const placementOptions = [
    { label: "Hero carousel", value: "hero" },
    { label: "Side tiles", value: "side" },
    { label: "Promo strip", value: "promo" },
];

const schema = z.object({
    title: z.string().trim().min(1, "Title is required").max(150),
    subtitle: z.string().max(255),
    image: z.string().min(1, "Image is required").max(500),
    link_url: z.string().max(500),
    cta_label: z.string().max(50),
    placement: z.string().min(1),
    sort_order: z.string().regex(/^\d*$/, "Must be a whole number"),
    is_active: z.boolean(),
});

const config: ResourceConfig<Banner> = {
    resource: "banners",
    title: "Banners",
    singular: "Banner",
    description: "Hero slides and side tiles on the landing page.",
    icon: <Images />,
    permission: "content.manage",
    schema,
    defaults: { title: "", subtitle: "", image: "", link_url: "", cta_label: "", placement: "hero", sort_order: "0", is_active: true },
    toForm: (banner) => ({
        title: banner.title,
        subtitle: banner.subtitle ?? "",
        image: banner.image,
        link_url: banner.link_url ?? "",
        cta_label: banner.cta_label ?? "",
        placement: banner.placement,
        sort_order: String(banner.sort_order ?? 0),
        is_active: banner.is_active,
    }),
    toPayload: (values) => ({ ...values, subtitle: values.subtitle || null, link_url: values.link_url || null, cta_label: values.cta_label || null, sort_order: Number(values.sort_order || 0) }),
    filters: [{ key: "placement", label: "Placement", options: placementOptions }, activeFilter],
    defaultSort: { id: "sort_order", desc: false },
    fields: [
        { name: "title", label: "Headline", type: "text", span: 2 },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { name: "image", label: "Artwork", type: "image", folder: "banners", hint: "Recommended 1600×600 for hero, 800×400 for side tiles" },
        { name: "placement", label: "Placement", type: "select", options: placementOptions },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "cta_label", label: "Button label", type: "text", placeholder: "Play now" },
        { name: "link_url", label: "Button link", type: "text", placeholder: "/games/slot" },
        { name: "is_active", label: "Visible", type: "switch", span: 2 },
    ],
    columns: [
        { accessorKey: "title", header: "Banner", cell: ({ row }) => <MediaCell wide image={row.original.image} title={row.original.title} subtitle={row.original.subtitle} /> },
        {
            accessorKey: "placement",
            header: "Placement",
            enableSorting: false,
            cell: ({ row }) => (
                <AppBadge size="sm" tone="violet">
                    {titleCase(row.original.placement)}
                </AppBadge>
            ),
        },
        { accessorKey: "link_url", header: "Link", enableSorting: false, meta: { hideOnMobile: true }, cell: ({ row }) => <span className="text-muted-foreground">{row.original.link_url ?? "—"}</span> },
        { accessorKey: "sort_order", header: "Order", meta: { align: "right" } },
        { accessorKey: "is_active", header: "Status", enableSorting: false, cell: ({ row }) => <StatusCell active={row.original.is_active} /> },
    ],
};

export default function AdminBannersPage() {
    return <ResourceManager config={config} />;
}
