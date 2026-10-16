import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { GameSort } from "@/types/Casino";

const RECENT_LIMIT = 24;

type GameState = {
    favorites: string[];
    recent: string[];
    sort: GameSort;
    provider: string;
};

type GameActions = {
    toggleFavorite: (slug: string) => boolean;
    isFavorite: (slug: string) => boolean;
    pushRecent: (slug: string) => void;
    clearRecent: () => void;
    setSort: (sort: GameSort) => void;
    setProvider: (provider: string) => void;
};

export const useGameStore = create<GameState & GameActions>()(
    persist(
        immer((set, get) => ({
            favorites: [],
            recent: [],
            sort: "default",
            provider: "",
            toggleFavorite: (slug) => {
                const exists = get().favorites.includes(slug);
                set((state) => {
                    state.favorites = exists ? state.favorites.filter((item) => item !== slug) : [slug, ...state.favorites];
                });
                return !exists;
            },
            isFavorite: (slug) => get().favorites.includes(slug),
            pushRecent: (slug) =>
                set((state) => {
                    state.recent = [slug, ...state.recent.filter((item) => item !== slug)].slice(0, RECENT_LIMIT);
                }),
            clearRecent: () =>
                set((state) => {
                    state.recent = [];
                }),
            setSort: (sort) =>
                set((state) => {
                    state.sort = sort;
                }),
            setProvider: (provider) =>
                set((state) => {
                    state.provider = provider;
                }),
        })),
        {
            name: "mpb-games",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
            partialize: (state) => ({ favorites: state.favorites, recent: state.recent, sort: state.sort }),
        }
    )
);
