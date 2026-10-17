"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Clock3, Gamepad2, Heart, Loader2, SearchX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppButton, AppEmpty, AppPageHeader, AppSearchInput } from "@/components/app";
import { categoryIcons } from "@/config/site";
import { useCategory, useInfiniteGames, useProviders } from "@/lib/CasinoAPI";
import { formatNumber } from "@/lib/format";
import { useGameStore } from "@/stores";
import type { GameFilters, GameSort } from "@/types/Casino";
import CategoryBar from "./CategoryBar";
import GameGrid from "./GameGrid";

const sorts: Array<{ value: GameSort; label: string }> = [
    { value: "default", label: "Recommended" },
    { value: "popular", label: "Most played" },
    { value: "newest", label: "Newest" },
    { value: "name", label: "A – Z" },
];

export default function GamesExplorer({ category }: { category?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const view = searchParams.get("view");
    const search = searchParams.get("search") ?? "";
    const provider = searchParams.get("provider") ?? "";
    const sort = (searchParams.get("sort") as GameSort | null) ?? "default";

    const favorites = useGameStore((state) => state.favorites);
    const recent = useGameStore((state) => state.recent);
    const { data: providers } = useProviders();
    const { data: categoryData } = useCategory(category ?? "");

    const slugList = view === "favorites" ? favorites : view === "recent" ? recent : null;

    const filters: GameFilters = {
        category,
        search: search || undefined,
        provider: provider || undefined,
        sort,
        slugs: slugList ? slugList.slice(0, 60).join(",") : undefined,
        per_page: 32,
    };

    const enabled = !slugList || slugList.length > 0;
    const query = useInfiniteGames(filters, enabled);
    const games = React.useMemo(() => {
        const list = query.data?.pages.flatMap((page) => page.data) ?? [];
        if (!slugList || sort !== "default") return list;
        return list.slice().sort((a, b) => slugList.indexOf(a.slug) - slugList.indexOf(b.slug));
    }, [query.data, slugList, sort]);
    const total = query.data?.pages[0]?.meta.total ?? 0;

    const setParam = React.useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "default" && value !== "all") params.set(key, value);
            else params.delete(key);
            router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    const sentinel = React.useRef<HTMLDivElement>(null);
    const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;

    React.useEffect(() => {
        const el = sentinel.current;
        if (!el || !hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && !isFetchingNextPage) void fetchNextPage();
            },
            { rootMargin: "600px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const title = view === "favorites" ? "My Favorites" : view === "recent" ? "Recently Played" : (categoryData?.name ?? (category ? "Games" : "All Games"));
    const Icon = view === "favorites" ? Heart : view === "recent" ? Clock3 : (categoryIcons[categoryData?.icon ?? ""] ?? Gamepad2);

    return (
        <div className="space-y-5">
            <AppPageHeader
                eyebrow="Lobby"
                icon={<Icon />}
                title={title}
                description={enabled ? `${formatNumber(total)} ${total === 1 ? "game" : "games"} available` : "Nothing saved yet"}
            />

            <CategoryBar activeSlug={category} view={view} />

            <div className="flex flex-col gap-2 sm:flex-row">
                <AppSearchInput value={search} onChange={(value) => setParam("search", value)} placeholder={`Search ${title.toLowerCase()}…`} className="flex-1" />
                <div className="grid grid-cols-2 gap-2 sm:flex">
                    <Select value={provider || "all"} onValueChange={(value) => setParam("provider", value)}>
                        <SelectTrigger className="sm:w-44">
                            <SelectValue placeholder="All studios" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All studios</SelectItem>
                            {providers?.map((item) => (
                                <SelectItem key={item.id} value={item.slug}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={sort} onValueChange={(value) => setParam("sort", value)}>
                        <SelectTrigger className="sm:w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {sorts.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!enabled ? (
                <AppEmpty
                    icon={view === "favorites" ? <Heart /> : <Clock3 />}
                    title={view === "favorites" ? "No favorites yet" : "No recent games"}
                    description={view === "favorites" ? "Tap the heart on any game to keep it here." : "Games you open will show up here."}
                    action={
                        <AppButton tone="surface" onClick={() => router.push("/games")}>
                            Browse the lobby
                        </AppButton>
                    }
                />
            ) : query.isSuccess && games.length === 0 ? (
                <AppEmpty icon={<SearchX />} title="No games found" description="Try a different search, studio or category." />
            ) : (
                <GameGrid games={games} loading={query.isLoading} />
            )}

            <div ref={sentinel} />
            {isFetchingNextPage ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="size-6 animate-spin text-gold-300" />
                </div>
            ) : hasNextPage ? (
                <div className="flex justify-center">
                    <AppButton tone="surface" onClick={() => fetchNextPage()}>
                        Load more games
                    </AppButton>
                </div>
            ) : null}
        </div>
    );
}
