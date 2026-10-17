"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Gamepad2, LayoutGrid, List, Pencil, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppBadge, AppButton, AppConfirm, AppEmpty, AppImage, AppPageHeader, AppSearchInput, AppTable, AppToast, type AppTableSort } from "@/components/app";
import { BoolCell, MediaCell, StatusCell } from "@/components/admin/cells";
import { useAdminList, useAdminOptions, useDeleteAdminRecord } from "@/lib/AdminAPI";
import { gameImage } from "@/lib/assets";
import { formatCompact, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores";
import type { Game, GameCategory, GameProvider } from "@/types/Casino";

type Filters = { game_category_id: string; game_provider_id: string; badge: string; is_active: string };

const badgeOptions = ["hot", "new", "top", "jackpot"];

export default function AdminGamesPage() {
    const router = useRouter();
    const pageSize = useAdminStore((state) => state.pageSize);
    const setPageSize = useAdminStore((state) => state.setPageSize);
    const [view, setView] = React.useState<"grid" | "table">("grid");
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("");
    const [sort, setSort] = React.useState<AppTableSort>({ id: "id", desc: true });
    const [filters, setFilters] = React.useState<Filters>({ game_category_id: "", game_provider_id: "", badge: "", is_active: "" });
    const [deleting, setDeleting] = React.useState<Game | null>(null);

    const { data: categories = [] } = useAdminOptions<GameCategory>("categories");
    const { data: providers = [] } = useAdminOptions<GameProvider>("providers");
    const list = useAdminList<Game>("games", {
        page,
        per_page: view === "grid" ? 24 : pageSize,
        search: search || undefined,
        sort: sort?.id,
        direction: sort?.desc ? "desc" : "asc",
        ...filters,
    });
    const remove = useDeleteAdminRecord("games");

    const setFilter = (key: keyof Filters, value: string) => {
        setFilters((current) => ({ ...current, [key]: value === "all" ? "" : value }));
        setPage(1);
    };

    const confirmDelete = async () => {
        if (!deleting) return;
        try {
            const response = await remove.mutateAsync(deleting.id);
            AppToast.success(response.message);
            setDeleting(null);
        } catch (err) {
            AppToast.apiError(err, "Delete failed");
        }
    };

    const columns: ColumnDef<Game, unknown>[] = [
        { accessorKey: "name", header: "Game", cell: ({ row }) => <MediaCell image={row.original.banner || row.original.thumbnail} title={row.original.name} subtitle={row.original.slug} /> },
        { id: "category", header: "Category", enableSorting: false, cell: ({ row }) => row.original.category?.name ?? "—" },
        { id: "provider", header: "Provider", enableSorting: false, cell: ({ row }) => row.original.provider_ref?.name ?? row.original.provider ?? "—" },
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
        { accessorKey: "is_featured", header: "Pick", enableSorting: false, meta: { hideOnMobile: true }, cell: ({ row }) => <BoolCell value={row.original.is_featured} /> },
        { accessorKey: "is_active", header: "Status", enableSorting: false, cell: ({ row }) => <StatusCell active={row.original.is_active} /> },
        {
            id: "actions",
            header: "",
            enableSorting: false,
            meta: { align: "right" },
            cell: ({ row }) => (
                <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                    <AppButton asChild tone="ghost" size="icon-sm">
                        <Link href={`/admin/games/${row.original.id}`} aria-label="Edit">
                            <Pencil />
                        </Link>
                    </AppButton>
                    <AppButton tone="ghost" size="icon-sm" className="text-red-300 hover:bg-destructive/15" onClick={() => setDeleting(row.original)} aria-label="Delete">
                        <Trash2 />
                    </AppButton>
                </div>
            ),
        },
    ];

    const toolbar = (
        <>
            <AppSearchInput
                value={search}
                onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                placeholder="Search name, slug or provider…"
                className="w-full sm:max-w-xs sm:flex-1"
            />
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <FilterSelect value={filters.game_category_id} onChange={(value) => setFilter("game_category_id", value)} label="All categories" options={categories.map((item) => ({ value: String(item.id), label: item.name }))} />
                <FilterSelect value={filters.game_provider_id} onChange={(value) => setFilter("game_provider_id", value)} label="All providers" options={providers.map((item) => ({ value: String(item.id), label: item.name }))} />
                <FilterSelect value={filters.badge} onChange={(value) => setFilter("badge", value)} label="Any badge" options={badgeOptions.map((value) => ({ value, label: titleCase(value) }))} />
                <FilterSelect
                    value={filters.is_active}
                    onChange={(value) => setFilter("is_active", value)}
                    label="Any status"
                    options={[
                        { value: "1", label: "Visible" },
                        { value: "0", label: "Hidden" },
                    ]}
                />
            </div>
            <div className="flex rounded-xl border border-border bg-fg/5 p-1 sm:ml-auto">
                {(["grid", "table"] as const).map((mode) => (
                    <button
                        key={mode}
                        type="button"
                        onClick={() => {
                            setView(mode);
                            setPage(1);
                        }}
                        className={cn("grid size-8 place-items-center rounded-lg transition", view === mode ? "bg-gold text-[#2a1600]" : "text-muted-foreground hover:text-foreground")}
                        aria-label={mode === "grid" ? "Grid view" : "Table view"}
                    >
                        {mode === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
                    </button>
                ))}
            </div>
        </>
    );

    const meta = list.data?.meta;

    return (
        <div className="space-y-5">
            <AppPageHeader
                icon={<Gamepad2 />}
                title="Games"
                description={`${meta?.total ?? 0} titles in the lobby. Add, edit or remove games and their provider details.`}
                actions={
                    <AppButton asChild>
                        <Link href="/admin/games/new">
                            <Plus /> Add game
                        </Link>
                    </AppButton>
                }
            />

            {view === "table" ? (
                <AppTable
                    columns={columns}
                    data={list.data?.data}
                    meta={meta}
                    isLoading={list.isLoading}
                    isFetching={list.isFetching}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    sort={sort}
                    onSortChange={setSort}
                    onRowClick={(game) => router.push(`/admin/games/${game.id}`)}
                    toolbar={toolbar}
                    emptyTitle="No games found"
                />
            ) : (
                <div className="surface overflow-hidden rounded-2xl">
                    <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:flex-wrap sm:items-center sm:p-4">{toolbar}</div>
                    <div className="p-3 sm:p-4">
                        {list.isLoading ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-fg/5" />
                                ))}
                            </div>
                        ) : list.data?.data.length ? (
                            <div className={cn("grid grid-cols-2 gap-3 transition-opacity sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6", list.isFetching && "opacity-60")}>
                                {list.data.data.map((game) => (
                                    <div key={game.id} className="group relative overflow-hidden rounded-2xl border border-border bg-plum-850 transition hover:border-gold-400/40">
                                        <Link href={`/admin/games/${game.id}`} className="block">
                                            <AppImage src={gameImage(game)} alt={game.name} wrapperClassName="aspect-[4/5]" />
                                            <div className="space-y-1 p-2.5">
                                                <div className="truncate text-sm font-bold">{game.name}</div>
                                                <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground uppercase">
                                                    <span className="truncate">{game.provider_ref?.name ?? game.provider ?? "—"}</span>
                                                    <span>{formatCompact(game.plays_count)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="absolute top-2 left-2 flex gap-1">
                                            {game.badge ? (
                                                <AppBadge size="sm" tone="solidEmber">
                                                    {game.badge}
                                                </AppBadge>
                                            ) : null}
                                            {!game.is_active ? (
                                                <AppBadge size="sm" tone="neutral">
                                                    Hidden
                                                </AppBadge>
                                            ) : null}
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                                            <AppButton asChild tone="surface" size="icon-sm" className="glass">
                                                <Link href={`/admin/games/${game.id}`} aria-label="Edit">
                                                    <Pencil />
                                                </Link>
                                            </AppButton>
                                            <AppButton tone="surface" size="icon-sm" className="glass text-red-300" onClick={() => setDeleting(game)} aria-label="Delete">
                                                <Trash2 />
                                            </AppButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <AppEmpty icon={<Gamepad2 />} title="No games found" description="Try another filter or add a new game." />
                        )}
                    </div>
                    {meta && meta.last_page > 1 ? (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
                            <span>
                                Page {meta.current_page} of {meta.last_page}
                            </span>
                            <div className="flex gap-2">
                                <AppButton tone="surface" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                                    Previous
                                </AppButton>
                                <AppButton tone="surface" size="sm" disabled={page >= meta.last_page} onClick={() => setPage((value) => value + 1)}>
                                    Next
                                </AppButton>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            <AppConfirm
                open={Boolean(deleting)}
                onOpenChange={(open) => (!open ? setDeleting(null) : undefined)}
                title="Delete this game?"
                description={deleting ? `"${deleting.name}" will be removed from the lobby. Bet history is kept.` : undefined}
                confirmLabel="Delete game"
                loading={remove.isPending}
                onConfirm={confirmDelete}
            />
        </div>
    );
}

function FilterSelect({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: Array<{ value: string; label: string }> }) {
    return (
        <Select value={value || "all"} onValueChange={onChange}>
            <SelectTrigger className="sm:w-40">
                <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{label}</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
