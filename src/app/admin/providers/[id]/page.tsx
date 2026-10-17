"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, BarChart3, Crown, Gamepad2, Pencil, Plus, Trash2 } from "lucide-react";
import { AppAmount, AppBadge, AppButton, AppCard, AppConfirm, AppDialog, AppEmpty, AppImage, AppStatCard, AppToast } from "@/components/app";
import { AdminField } from "@/components/admin/AdminFields";
import { useAdminDetail, useDeleteAdminRecord, useSaveAdminRecord } from "@/lib/AdminAPI";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { gameImage } from "@/lib/assets";
import { formatCompact, formatNumber, timeAgo } from "@/lib/format";
import type { AdminProviderDetail } from "@/types/Admin";
import type { GameProvider } from "@/types/Casino";

const schema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    slug: z.string().trim().max(120),
    logo: z.string().max(500),
    sort_order: z.string().regex(/^\d*$/, "Must be a whole number"),
    is_active: z.boolean(),
});

type Values = z.infer<typeof schema>;

export default function ProviderDetailPage() {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const router = useRouter();
    const { data, isLoading, isError, refetch } = useAdminDetail<AdminProviderDetail>("providers", id);
    const save = useSaveAdminRecord<GameProvider>("providers");
    const remove = useDeleteAdminRecord("providers");
    const [editing, setEditing] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);
    const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", slug: "", logo: "", sort_order: "0", is_active: true } });

    const openEdit = () => {
        if (!data) return;
        form.reset({ name: data.provider.name, slug: data.provider.slug, logo: data.provider.logo ?? "", sort_order: String(data.provider.sort_order ?? 0), is_active: data.provider.is_active });
        setEditing(true);
    };

    const submit = form.handleSubmit(async (values) => {
        try {
            const response = await save.mutateAsync({ id, payload: { ...values, slug: values.slug || null, logo: values.logo || null, sort_order: Number(values.sort_order || 0) } });
            AppToast.success(response.message);
            setEditing(false);
            void refetch();
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => form.setError(key as keyof Values, { message }));
            AppToast.error("Could not save provider", { description: apiError(err) });
        }
    });

    const destroy = async () => {
        try {
            const response = await remove.mutateAsync(id);
            AppToast.success(response.message);
            router.replace("/admin/providers");
        } catch (err) {
            AppToast.apiError(err, "Delete failed");
        }
    };

    if (isLoading) return <div className="h-96 animate-pulse rounded-2xl bg-fg/5" />;

    if (isError || !data) {
        return (
            <AppEmpty
                title="Provider not found"
                action={
                    <AppButton asChild tone="surface">
                        <Link href="/admin/providers">Back to providers</Link>
                    </AppButton>
                }
            />
        );
    }

    const { provider, stats, top_games: games } = data;

    return (
        <div className="space-y-5">
            <div className="border-gradient relative overflow-hidden rounded-3xl bg-linear-to-br from-plum-700/70 via-plum-850 to-plum-900 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <AppButton asChild tone="surface" size="icon">
                            <Link href="/admin/providers" aria-label="Back">
                                <ArrowLeft />
                            </Link>
                        </AppButton>
                        <AppImage src={provider.logo} alt="" wrapperClassName="size-16 shrink-0 rounded-2xl ring-1 ring-border" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-display text-2xl font-extrabold">{provider.name}</h1>
                                <AppBadge tone={provider.is_active ? "success" : "neutral"} dot>
                                    {provider.is_active ? "Active" : "Hidden"}
                                </AppBadge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                /{provider.slug} · {formatNumber(provider.games_count)} games · {formatNumber(provider.active_games_count)} visible
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <AppButton tone="surface" leftIcon={<Pencil />} onClick={openEdit}>
                            Edit
                        </AppButton>
                        <AppButton tone="danger" leftIcon={<Trash2 />} onClick={() => setConfirm(true)}>
                            Delete
                        </AppButton>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <AppStatCard index={0} label="Total plays" value={formatCompact(stats.plays ?? 0)} icon={<Gamepad2 />} tone="gold" />
                <AppStatCard index={1} label="Sessions" value={formatNumber(stats.sessions)} hint={`${formatNumber(stats.demo_sessions)} demo`} icon={<Crown />} tone="violet" />
                <AppStatCard index={2} label="Total bets" value={<AppAmount value={stats.total_bets} respectPrivacy={false} />} icon={<BarChart3 />} tone="sky" />
                <AppStatCard index={3} label="GGR" value={<AppAmount value={stats.ggr} respectPrivacy={false} />} hint={stats.rtp !== null ? `RTP ${stats.rtp}%` : "No rounds yet"} icon={<BarChart3 />} tone="jade" />
            </div>

            <AppCard
                title="Top games"
                description={stats.last_played_at ? `Last played ${timeAgo(stats.last_played_at)}` : "Most played titles from this provider"}
                icon={<Gamepad2 />}
                actions={
                    <AppButton asChild size="sm">
                        <Link href="/admin/games/new">
                            <Plus /> Add game
                        </Link>
                    </AppButton>
                }
            >
                {games.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                        {games.map((game) => (
                            <Link key={game.id} href={`/admin/games/${game.id}`} className="group overflow-hidden rounded-2xl border border-border bg-plum-850 transition hover:border-gold-400/40">
                                <AppImage src={gameImage(game)} alt={game.name} wrapperClassName="aspect-[4/5]" />
                                <div className="p-2">
                                    <div className="truncate text-xs font-bold group-hover:text-gold-200">{game.name}</div>
                                    <div className="text-[10px] text-muted-foreground">{formatCompact(game.plays_count)} plays</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <AppEmpty compact title="No games yet" />
                )}
            </AppCard>

            <AppDialog
                open={editing}
                onOpenChange={setEditing}
                title="Edit provider"
                size="md"
                footer={
                    <>
                        <AppButton tone="ghost" onClick={() => setEditing(false)}>
                            Cancel
                        </AppButton>
                        <AppButton onClick={submit} loading={save.isPending}>
                            Save changes
                        </AppButton>
                    </>
                }
            >
                <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
                    <div className="sm:col-span-2">
                        <AdminField control={form.control} field={{ name: "name", label: "Provider name", type: "text" }} />
                    </div>
                    <AdminField control={form.control} field={{ name: "slug", label: "Slug", type: "text" }} />
                    <AdminField control={form.control} field={{ name: "sort_order", label: "Sort order", type: "number" }} />
                    <div className="sm:col-span-2">
                        <AdminField control={form.control} field={{ name: "logo", label: "Logo", type: "image", folder: "providers" }} />
                    </div>
                    <div className="sm:col-span-2">
                        <AdminField control={form.control} field={{ name: "is_active", label: "Visible", type: "switch" }} />
                    </div>
                </form>
            </AppDialog>

            <AppConfirm
                open={confirm}
                onOpenChange={setConfirm}
                title="Delete this provider?"
                description={`Its ${provider.games_count} games will be kept but unlinked from ${provider.name}.`}
                confirmLabel="Delete provider"
                loading={remove.isPending}
                onConfirm={destroy}
            />
        </div>
    );
}
