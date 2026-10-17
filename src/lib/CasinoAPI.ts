"use client";

import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiEnvelope, ApiPaginated } from "@/types/Api";
import type { Game, GameCategory, GameFilters, GameLaunch, GameMode, GameProvider, GameRound } from "@/types/Casino";

export const casinoKeys = {
    all: ["casino"] as const,
    categories: (withGames = false) => ["casino", "categories", { withGames }] as const,
    category: (slug: string) => ["casino", "category", slug] as const,
    providers: () => ["casino", "providers"] as const,
    games: (filters: GameFilters) => ["casino", "games", filters] as const,
    game: (slug: string) => ["casino", "game", slug] as const,
};

const clean = (params: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "default"));

export const getCategories = async (withGames = false, gamesLimit = 12) => {
    const { data } = await api.get<ApiEnvelope<GameCategory[]>>("/casino/categories", {
        params: withGames ? { with_games: 1, games_limit: gamesLimit } : undefined,
    });
    return data.data;
};

export const getCategory = async (slug: string) => {
    const { data } = await api.get<ApiEnvelope<GameCategory>>(`/casino/categories/${encodeURIComponent(slug)}`);
    return data.data;
};

export const getProviders = async () => {
    const { data } = await api.get<ApiEnvelope<GameProvider[]>>("/casino/providers");
    return data.data;
};

export const getGames = async (filters: GameFilters = {}, page = 1) => {
    const { data } = await api.get<ApiPaginated<Game>>("/casino/games", {
        params: clean({ ...filters, featured: filters.featured ? 1 : undefined, page }),
    });
    return data;
};

export const getGame = async (slug: string) => {
    const { data } = await api.get<ApiEnvelope<Game> & { related: Game[] }>(`/casino/games/${encodeURIComponent(slug)}`);
    return data;
};

export const launchGame = async ({ slug, mode }: { slug: string; mode: GameMode }) => {
    const { data } = await api.post<ApiEnvelope<GameLaunch>>(`/casino/games/${encodeURIComponent(slug)}/launch`, { mode });
    return data;
};

export const endGameSession = async (token: string) => {
    await api.post("/casino/sessions/end", { token });
};

export const getRounds = async (page = 1, perPage = 15) => {
    const { data } = await api.get<ApiPaginated<GameRound>>("/casino/rounds", { params: { page, per_page: perPage } });
    return data;
};

export const useCategories = (withGames = false) =>
    useQuery({
        queryKey: casinoKeys.categories(withGames),
        queryFn: () => getCategories(withGames),
        staleTime: 5 * 60 * 1000,
    });

export const useCategory = (slug: string) =>
    useQuery({
        queryKey: casinoKeys.category(slug),
        queryFn: () => getCategory(slug),
        enabled: Boolean(slug),
        staleTime: 5 * 60 * 1000,
    });

export const useProviders = () =>
    useQuery({
        queryKey: casinoKeys.providers(),
        queryFn: getProviders,
        staleTime: 10 * 60 * 1000,
    });

export const useGames = (filters: GameFilters, enabled = true) =>
    useQuery({
        queryKey: casinoKeys.games(filters),
        queryFn: () => getGames(filters),
        enabled,
        staleTime: 60 * 1000,
        placeholderData: keepPreviousData,
    });

export const useInfiniteGames = (filters: GameFilters, enabled = true) =>
    useInfiniteQuery({
        queryKey: [...casinoKeys.games(filters), "infinite"],
        queryFn: ({ pageParam }) => getGames(filters, pageParam),
        initialPageParam: 1,
        getNextPageParam: (last) => (last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined),
        enabled,
        staleTime: 60 * 1000,
    });

export const useGame = (slug: string) =>
    useQuery({
        queryKey: casinoKeys.game(slug),
        queryFn: () => getGame(slug),
        enabled: Boolean(slug),
    });

export const useLaunchGame = () => useMutation({ mutationFn: launchGame });

export const useEndGameSession = () => useMutation({ mutationFn: endGameSession });

export const useRounds = (page = 1, perPage = 15, enabled = true) =>
    useQuery({
        queryKey: ["casino", "rounds", page, perPage],
        enabled,
        queryFn: () => getRounds(page, perPage),
        placeholderData: keepPreviousData,
    });
