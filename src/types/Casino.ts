export type GameBadge = "hot" | "new" | "top" | "jackpot";

export type GameCategory = {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    sort_order: number;
    is_active: boolean;
    games_count?: number;
    games?: Game[];
};

export type GameProvider = {
    id: number;
    name: string;
    slug: string;
    logo?: string | null;
    sort_order: number;
    is_active: boolean;
    games_count?: number;
};

export type Game = {
    id: number;
    game_category_id: number;
    game_provider_id?: number | null;
    name: string;
    slug: string;
    provider?: string | null;
    thumbnail?: string | null;
    banner?: string | null;
    launch_url?: string | null;
    badge?: GameBadge | null;
    is_featured: boolean;
    plays_count: number;
    sort_order: number;
    is_active: boolean;
    category?: Pick<GameCategory, "id" | "name" | "slug"> | null;
    provider_ref?: Pick<GameProvider, "id" | "name" | "slug" | "logo"> | null;
};

export type GameSort = "default" | "popular" | "newest" | "name";

export type GameFilters = {
    category?: string;
    provider?: string;
    search?: string;
    sort?: GameSort;
    featured?: boolean;
    badge?: GameBadge;
    slugs?: string;
    per_page?: number;
};

export type GameLaunch = {
    game: Game;
    launch_url?: string | null;
    balance: number;
};
