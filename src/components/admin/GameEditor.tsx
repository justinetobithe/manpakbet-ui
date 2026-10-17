"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, BarChart3, Crown, ExternalLink, Gamepad2, Image as ImageIcon, Plug, Save, Trash2 } from "lucide-react";
import { AppAmount, AppBadge, AppButton, AppCard, AppConfirm, AppEmpty, AppImage, AppToast } from "@/components/app";
import { useAdminDetail, useAdminOptions, useDeleteAdminRecord, useSaveAdminRecord } from "@/lib/AdminAPI";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { toAssetUrl } from "@/lib/assets";
import { formatCompact, formatDateTime, formatNumber, fullName, timeAgo, titleCase } from "@/lib/format";
import type { AdminGameDetail } from "@/types/Admin";
import type { Game, GameCategory, GameProvider } from "@/types/Casino";
import { AdminField } from "./AdminFields";

const badgeOptions = ["hot", "new", "top", "jackpot"].map((value) => ({ label: titleCase(value), value }));

const schema = z.object({
    name: z.string().trim().min(1, "Name is required").max(150),
    slug: z.string().trim().max(160),
    game_category_id: z.string().min(1, "Choose a category"),
    game_provider_id: z.string(),
    thumbnail: z.string().max(500),
    banner: z.string().max(500),
    provider_game_code: z.string().max(120),
    has_demo: z.boolean(),
    badge: z.string(),
    sort_order: z.string().regex(/^\d*$/, "Must be a whole number"),
    is_featured: z.boolean(),
    is_active: z.boolean(),
});

type Values = z.infer<typeof schema>;

const defaults: Values = {
    name: "",
    slug: "",
    game_category_id: "",
    game_provider_id: "",
    thumbnail: "",
    banner: "",
    provider_game_code: "",
    has_demo: true,
    badge: "",
    sort_order: "0",
    is_featured: false,
    is_active: true,
};

const toValues = (game: Game): Values => ({
    name: game.name,
    slug: game.slug,
    game_category_id: String(game.game_category_id),
    game_provider_id: game.game_provider_id ? String(game.game_provider_id) : "",
    thumbnail: game.thumbnail ?? "",
    banner: game.banner ?? "",
    provider_game_code: game.provider_game_code ?? "",
    has_demo: game.has_demo ?? true,
    badge: game.badge ?? "",
    sort_order: String(game.sort_order ?? 0),
    is_featured: game.is_featured,
    is_active: game.is_active,
});

export default function GameEditor({ id }: { id?: number }) {
    const router = useRouter();
    const editing = Boolean(id);
    const detail = useAdminDetail<AdminGameDetail>("games", id);
    const { data: categories = [] } = useAdminOptions<GameCategory>("categories");
    const { data: providers = [] } = useAdminOptions<GameProvider & { games_count?: number }>("providers");
    const save = useSaveAdminRecord<Game>("games");
    const remove = useDeleteAdminRecord("games");
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });
    const watched = useWatch({ control: form.control });

    React.useEffect(() => {
        if (detail.data?.game) form.reset(toValues(detail.data.game));
    }, [detail.data, form]);

    const categoryOptions = categories.map((item) => ({ label: item.name, value: String(item.id) }));
    const providerOptions = providers.map((item) => ({ label: item.name, value: String(item.id) }));
    const selectedProvider = providers.find((item) => String(item.id) === watched.game_provider_id) ?? null;
    const providerDetail = detail.data?.provider && String(detail.data.provider.id) === watched.game_provider_id ? detail.data.provider : selectedProvider;

    const submit = form.handleSubmit(async (values) => {
        const payload = {
            ...values,
            slug: values.slug || null,
            game_provider_id: values.game_provider_id || null,
            badge: values.badge || null,
            provider_game_code: values.provider_game_code || null,
            sort_order: Number(values.sort_order || 0),
        };

        try {
            const response = await save.mutateAsync({ payload, id });
            AppToast.success(response.message);
            if (!editing) router.replace(`/admin/games/${response.data.id}`);
            else void detail.refetch();
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => form.setError(key as keyof Values, { message }));
            AppToast.error("Could not save game", { description: apiError(err) });
        }
    });

    const destroy = async () => {
        if (!id) return;
        try {
            const response = await remove.mutateAsync(id);
            AppToast.success(response.message);
            router.replace("/admin/games");
        } catch (err) {
            AppToast.apiError(err, "Delete failed");
        }
    };

    if (editing && detail.isLoading) {
        return (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
                <div className="h-[600px] animate-pulse rounded-2xl bg-fg/5" />
                <div className="h-[600px] animate-pulse rounded-2xl bg-fg/5" />
            </div>
        );
    }

    if (editing && detail.isError) {
        return (
            <AppEmpty
                title="Game not found"
                action={
                    <AppButton asChild tone="surface">
                        <Link href="/admin/games">Back to games</Link>
                    </AppButton>
                }
            />
        );
    }

    const stats = detail.data?.stats;
    const preview = watched.banner || watched.thumbnail;

    return (
        <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <AppButton asChild tone="surface" size="icon">
                        <Link href="/admin/games" aria-label="Back to games">
                            <ArrowLeft />
                        </Link>
                    </AppButton>
                    <div>
                        <h1 className="font-display text-2xl font-extrabold">{editing ? watched.name || "Edit game" : "Add game"}</h1>
                        <p className="text-sm text-muted-foreground">{editing ? `/${detail.data?.game.slug}` : "Create a new title in the lobby"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {editing ? (
                        <>
                            <AppButton asChild tone="ghost">
                                <Link href={`/play/${detail.data?.game.slug}`} target="_blank">
                                    <ExternalLink /> View
                                </Link>
                            </AppButton>
                            <AppButton type="button" tone="danger" leftIcon={<Trash2 />} onClick={() => setConfirmDelete(true)}>
                                Delete
                            </AppButton>
                        </>
                    ) : null}
                    <AppButton type="submit" leftIcon={<Save />} loading={save.isPending}>
                        {editing ? "Save changes" : "Create game"}
                    </AppButton>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                    <AppCard title="Game details" icon={<Gamepad2 />}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <AdminField control={form.control} field={{ name: "name", label: "Game name", type: "text", placeholder: "Fortune Gems" }} />
                            <AdminField control={form.control} field={{ name: "slug", label: "Slug", type: "text", placeholder: "Auto-generated if empty" }} />
                            <AdminField control={form.control} field={{ name: "game_category_id", label: "Category", type: "select" }} options={categoryOptions} />
                            <AdminField control={form.control} field={{ name: "game_provider_id", label: "Provider", type: "select", allowEmpty: true }} options={providerOptions} />
                            <AdminField control={form.control} field={{ name: "badge", label: "Badge", type: "select", options: badgeOptions, allowEmpty: true }} />
                            <AdminField control={form.control} field={{ name: "sort_order", label: "Sort order", type: "number" }} />
                        </div>
                    </AppCard>

                    <AppCard title="Artwork" icon={<ImageIcon />}>
                        <div className="grid gap-4">
                            <AdminField control={form.control} field={{ name: "banner", label: "Cover art", type: "image", folder: "games" }} />
                            <AdminField control={form.control} field={{ name: "thumbnail", label: "Thumbnail", type: "image", folder: "games" }} />
                        </div>
                    </AppCard>

                    <AppCard title="Integration & visibility" icon={<Plug />}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <AdminField
                                    control={form.control}
                                    field={{ name: "provider_game_code", label: "Provider game code", type: "text", placeholder: "Defaults to the slug", hint: "The game ID your provider expects at launch" }}
                                />
                            </div>
                            <AdminField control={form.control} field={{ name: "has_demo", label: "Demo mode", type: "switch", hint: "Allow free play" }} />
                            <AdminField control={form.control} field={{ name: "is_featured", label: "Editor's pick", type: "switch", hint: "Show in featured rails" }} />
                            <AdminField control={form.control} field={{ name: "is_active", label: "Visible in lobby", type: "switch", hint: "Hidden games cannot be launched" }} />
                        </div>
                    </AppCard>
                </div>

                <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                    <AppCard title="Preview" padded>
                        <div className="mx-auto w-48 overflow-hidden rounded-2xl border border-border bg-plum-850">
                            <AppImage src={preview ? toAssetUrl(preview) : null} alt="" wrapperClassName="aspect-[4/5]" />
                            <div className="p-2.5">
                                <div className="truncate text-sm font-bold">{watched.name || "Game name"}</div>
                                <div className="truncate text-[10px] text-muted-foreground uppercase">{providerDetail?.name ?? "No provider"}</div>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                            {watched.badge ? <AppBadge tone="ember">{watched.badge}</AppBadge> : null}
                            <AppBadge tone={watched.is_active ? "success" : "neutral"}>{watched.is_active ? "Visible" : "Hidden"}</AppBadge>
                            {watched.has_demo ? <AppBadge tone="violet">Demo</AppBadge> : null}
                        </div>
                    </AppCard>

                    <AppCard
                        title="Provider"
                        icon={<Crown />}
                        actions={
                            providerDetail ? (
                                <AppButton asChild tone="ghost" size="sm">
                                    <Link href={`/admin/providers/${providerDetail.id}`}>Open</Link>
                                </AppButton>
                            ) : null
                        }
                    >
                        {providerDetail ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <AppImage src={providerDetail.logo} alt="" wrapperClassName="size-12 shrink-0 rounded-xl" />
                                    <div className="min-w-0">
                                        <div className="truncate font-bold">{providerDetail.name}</div>
                                        <div className="truncate text-xs text-muted-foreground">/{providerDetail.slug}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <Metric label="Games" value={formatNumber(providerDetail.games_count ?? 0)} />
                                    <Metric label="Status" value={providerDetail.is_active ? "Active" : "Hidden"} />
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No provider selected. Pick one in the details form.</p>
                        )}
                    </AppCard>

                    {editing && stats ? (
                        <AppCard title="Performance" icon={<BarChart3 />}>
                            <div className="grid grid-cols-2 gap-2">
                                <Metric label="Plays" value={formatCompact(stats.plays ?? 0)} />
                                <Metric label="Sessions" value={formatNumber(stats.sessions)} />
                                <Metric label="Rounds" value={formatNumber(stats.rounds)} />
                                <Metric label="RTP" value={stats.rtp !== null ? `${stats.rtp}%` : "—"} />
                                <Metric label="Bets" value={<AppAmount value={stats.total_bets} respectPrivacy={false} />} />
                                <Metric label="Wins" value={<AppAmount value={stats.total_wins} respectPrivacy={false} />} />
                            </div>
                            <div className="mt-2 rounded-xl border border-gold-400/30 bg-gold-400/10 p-3 text-center">
                                <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Gross gaming revenue</div>
                                <AppAmount value={stats.ggr} respectPrivacy={false} className="font-display text-xl font-extrabold text-gold-200" />
                            </div>
                            <div className="mt-2 text-center text-xs text-muted-foreground">Last played {stats.last_played_at ? timeAgo(stats.last_played_at) : "never"}</div>
                        </AppCard>
                    ) : null}

                    {editing && detail.data?.recent_rounds.length ? (
                        <AppCard title="Recent bets">
                            <div className="divide-y divide-border">
                                {detail.data.recent_rounds.map((round) => (
                                    <div key={round.id} className="flex items-center justify-between gap-2 py-2 text-sm first:pt-0 last:pb-0">
                                        <div className="min-w-0">
                                            <div className="truncate font-semibold">{fullName(round.user)}</div>
                                            <div className="text-[11px] text-muted-foreground">{formatDateTime(round.created_at)}</div>
                                        </div>
                                        <AppAmount value={Number(round.amount) * (round.type === "bet" ? -1 : 1)} signed respectPrivacy={false} className="shrink-0 font-bold" />
                                    </div>
                                ))}
                            </div>
                        </AppCard>
                    ) : null}
                </div>
            </div>

            <AppConfirm
                open={confirmDelete}
                onOpenChange={setConfirmDelete}
                title="Delete this game?"
                description={`"${watched.name}" will be removed from the lobby. Bet history is kept.`}
                confirmLabel="Delete game"
                loading={remove.isPending}
                onConfirm={destroy}
            />
        </form>
    );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-fg/3 p-2.5 text-center">
            <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{label}</div>
            <div className="mt-0.5 truncate text-sm font-bold">{value}</div>
        </div>
    );
}
