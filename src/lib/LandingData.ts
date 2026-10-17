"use client";

import landing from "@/data/landing-games.json";
import { useCategories, useGames, useProviders } from "@/lib/CasinoAPI";
import type { Game, GameCategory, GameFilters, GameProvider } from "@/types/Casino";

export const STATIC_LANDING = process.env.NEXT_PUBLIC_STATIC_LANDING === "true";

type LandingList = "hot" | "popular" | "featured" | "newest";

const data = landing as unknown as {
    categories: GameCategory[];
    providers: GameProvider[];
} & Record<LandingList, Game[]>;

const page = (games: Game[], perPage: number) => ({
    data: games.slice(0, perPage),
    meta: { current_page: 1, last_page: 1, per_page: perPage, total: games.length },
});

export const useLandingGames = (list: LandingList, filters: GameFilters) => {
    const query = useGames(filters, !STATIC_LANDING);
    if (!STATIC_LANDING) return { data: query.data, isLoading: query.isLoading };
    return { data: page(data[list], filters.per_page ?? 18), isLoading: false };
};

export const useLandingCategories = (withGames = false) => {
    const query = useCategories(withGames, !STATIC_LANDING);
    if (!STATIC_LANDING) return { data: query.data, isLoading: query.isLoading };
    return { data: withGames ? data.categories : data.categories.map((category): GameCategory => ({ ...category, games: undefined })), isLoading: false };
};

export const useLandingProviders = () => {
    const query = useProviders(!STATIC_LANDING);
    if (!STATIC_LANDING) return { data: query.data, isLoading: query.isLoading };
    return { data: data.providers, isLoading: false };
};
