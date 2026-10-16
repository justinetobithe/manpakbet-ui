"use client";

import { z } from "zod";
import { Newspaper, Pin } from "lucide-react";
import { AppBadge } from "@/components/app";
import { fromDateTimeLocal, toDateTimeLocal } from "@/components/admin/AdminFields";
import ResourceManager, { type ResourceConfig } from "@/components/admin/ResourceManager";
import { DateCell, MediaCell, StatusCell } from "@/components/admin/cells";
import { titleCase } from "@/lib/format";
import type { Post } from "@/types/Content";

const categoryOptions = ["news", "announcement", "event", "guide"].map((value) => ({ label: titleCase(value), value }));

const schema = z.object({
    title: z.string().trim().min(1, "Title is required").max(180),
    slug: z.string().trim().max(190),
    category: z.string().min(1),
    excerpt: z.string().max(255),
    content: z.string(),
    image: z.string().max(500),
    published_at: z.string(),
    is_pinned: z.boolean(),
    is_published: z.boolean(),
});

const config: ResourceConfig<Post> = {
    resource: "posts",
    title: "News",
    singular: "Post",
    description: "Announcements, events and guides. Pinned posts also feed the ticker.",
    icon: <Newspaper />,
    permission: "content.manage",
    schema,
    defaults: { title: "", slug: "", category: "news", excerpt: "", content: "", image: "", published_at: "", is_pinned: false, is_published: true },
    toForm: (post) => ({
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt ?? "",
        content: post.content ?? "",
        image: post.image ?? "",
        published_at: toDateTimeLocal(post.published_at),
        is_pinned: post.is_pinned,
        is_published: post.is_published,
    }),
    toPayload: (values) => ({
        ...values,
        slug: values.slug || null,
        excerpt: values.excerpt || null,
        content: values.content || null,
        image: values.image || null,
        published_at: fromDateTimeLocal(values.published_at),
    }),
    filters: [
        { key: "category", label: "Category", options: categoryOptions },
        {
            key: "is_published",
            label: "Status",
            options: [
                { label: "Published", value: "1" },
                { label: "Draft", value: "0" },
            ],
        },
    ],
    dialogSize: "xl",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text", placeholder: "Auto-generated if empty" },
        { name: "category", label: "Category", type: "select", options: categoryOptions },
        { name: "published_at", label: "Publish at", type: "datetime", hint: "Leave empty to publish now" },
        { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2 },
        { name: "content", label: "Content (HTML allowed)", type: "textarea", rows: 8 },
        { name: "image", label: "Cover image", type: "image", folder: "posts" },
        { name: "is_pinned", label: "Pin to top", type: "switch" },
        { name: "is_published", label: "Published", type: "switch" },
    ],
    columns: [
        {
            accessorKey: "title",
            header: "Post",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <MediaCell wide image={row.original.image} title={row.original.title} subtitle={row.original.excerpt} />
                    {row.original.is_pinned ? <Pin className="size-3.5 shrink-0 text-gold-300" /> : null}
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: "Category",
            enableSorting: false,
            cell: ({ row }) => (
                <AppBadge size="sm" tone="info">
                    {row.original.category}
                </AppBadge>
            ),
        },
        { accessorKey: "published_at", header: "Published", cell: ({ row }) => <DateCell value={row.original.published_at} /> },
        { accessorKey: "is_published", header: "Status", enableSorting: false, cell: ({ row }) => <StatusCell active={row.original.is_published} on="Published" off="Draft" /> },
    ],
};

export default function AdminNewsPage() {
    return <ResourceManager config={config} />;
}
