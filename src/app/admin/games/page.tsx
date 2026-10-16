"use client";

import * as React from "react";
import { z } from "zod";
import { Gamepad2 } from "lucide-react";
import { AppBadge } from "@/components/app";
import ResourceManager, { type ResourceConfig } from "@/components/admin/ResourceManager";
import { activeFilter, BoolCell, MediaCell, StatusCell } from "@/components/admin/cells";
import { useAdminOptions } from "@/lib/AdminAPI";
import { formatCompact, titleCase } from "@/lib/format";
import type { Game, GameCategory, GameProvider } from "@/types/Casino";

const badgeOptions = ["hot", "new", "top", "jackpot"].map((value) => ({ label: titleCase(value), value }));

const schema = z.object({
    name: z.string().trim().min(1, "Name is required").max(150),
    slug: z.string().trim().max(160),
    game_category_id: z.string().min(1, "Choose a category"),
    game_provider_id: z.string(),
    thumbnail: z.string().max(500),
    banner: z.string().max(500),
    launch_url: z.string().max(500),
    badge: z.string(),
    sort_order: z.string().regex(/^\d*$/, "Must be a whole number"),
    is_featured: z.boolean(),
    is_active: z.boolean(),
});

export default function AdminGamesPage() {
    const { data: categories = [] } = useAdminOptions<GameCategory>("categories");
    const { data: providers = [] } = useAdminOptions<GameProvider>("providers");

    const categoryOptions = categories.map((item) => ({ label: item.name, value: String(item.id) }));
    const providerOptions = providers.map((item) => ({ label: item.name, value: String(item.id) }));

    const config: ResourceConfig<Game> = {
        resource: "games",
        title: "Games",
        singular: "Game",
        description: "Curate the lobby: artwork, badges, ordering and visibility.",
        icon: <Gamepad2 />,
        permission: "games.manage",
        schema,
        defaults: { name: "", slug: "", game_category_id: "", game_provider_id: "", thumbnail: "", banner: "", launch_url: "", badge: "", sort_order: "0", is_featured: false, is_active: true },
        toForm: (game) => ({
            name: game.name,
            slug: game.slug,
            game_category_id: String(game.game_category_id),
            game_provider_id: game.game_provider_id ? String(game.game_provider_id) : "",
            thumbnail: game.thumbnail ?? "",
            banner: game.banner ?? "",
            launch_url: game.launch_url ?? "",
            badge: game.badge ?? "",
            sort_order: String(game.sort_order ?? 0),
            is_featured: game.is_featured,
            is_active: game.is_active,
        }),
        toPayload: (values) => ({
            ...values,
            slug: values.slug || null,
            game_provider_id: values.game_provider_id || null,
            badge: values.badge || null,
            sort_order: Number(values.sort_order || 0),
        }),
        optionSources: { categories: categoryOptions, providers: providerOptions },
        filters: [
            { key: "game_category_id", label: "Category", options: categoryOptions },
            { key: "game_provider_id", label: "Studio", options: providerOptions },
            { key: "badge", label: "Badge", options: badgeOptions },
            activeFilter,
        ],
        defaultSort: { id: "id", desc: true },
        fields: [
            { name: "name", label: "Game name", type: "text", placeholder: "Fortune Gems" },
            { name: "slug", label: "Slug", type: "text", placeholder: "Auto-generated if empty" },
            { name: "game_category_id", label: "Category", type: "select", optionsKey: "categories" },
            { name: "game_provider_id", label: "Studio", type: "select", optionsKey: "providers", allowEmpty: true },
            { name: "badge", label: "Badge", type: "select", options: badgeOptions, allowEmpty: true },
            { name: "sort_order", label: "Sort order", type: "number" },
            { name: "banner", label: "Cover art", type: "image", folder: "games" },
            { name: "thumbnail", label: "Thumbnail", type: "image", folder: "games" },
            { name: "launch_url", label: "Launch URL", type: "text", placeholder: "https://…", span: 2 },
            { name: "is_featured", label: "Editor's pick", type: "switch", hint: "Show in the featured rail" },
            { name: "is_active", label: "Visible in lobby", type: "switch" },
        ],
        columns: [
            {
                accessorKey: "name",
                header: "Game",
                cell: ({ row }) => <MediaCell image={row.original.banner || row.original.thumbnail} title={row.original.name} subtitle={row.original.slug} />,
            },
            { id: "category", header: "Category", enableSorting: false, cell: ({ row }) => row.original.category?.name ?? "—" },
            { id: "provider", header: "Studio", enableSorting: false, meta: { hideOnMobile: true }, cell: ({ row }) => row.original.provider_ref?.name ?? row.original.provider ?? "—" },
            {
                accessorKey: "badge",
                header: "Badge",
                enableSorting: false,
                cell: ({ row }) =>
                    row.original.badge ? (
                        <AppBadge size="sm" tone="ember">
                            {row.original.badge}
                        </AppBadge>
                    ) : (
                        <span className="text-muted-foreground">—</span>
                    ),
            },
            { accessorKey: "plays_count", header: "Plays", meta: { align: "right" }, cell: ({ row }) => <span className="tabular-nums">{formatCompact(row.original.plays_count)}</span> },
            { accessorKey: "sort_order", header: "Order", meta: { align: "right", hideOnMobile: true } },
            { accessorKey: "is_featured", header: "Pick", enableSorting: false, cell: ({ row }) => <BoolCell value={row.original.is_featured} /> },
            { accessorKey: "is_active", header: "Status", enableSorting: false, cell: ({ row }) => <StatusCell active={row.original.is_active} /> },
        ],
        renderMobileCard: (game) => (
            <div className="flex items-center justify-between gap-3">
                <MediaCell image={game.banner || game.thumbnail} title={game.name} subtitle={game.category?.name} />
                <StatusCell active={game.is_active} />
            </div>
        ),
    };

    return <ResourceManager config={config} />;
}
