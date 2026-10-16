import type { Game } from "./Casino";
import type { Permission, User } from "./User";
import type { Transaction } from "./Wallet";

export type AdminStats = {
    totals: {
        players: number;
        new_players_today: number;
        games: number;
        active_promotions: number;
        pending_transactions: number;
        total_deposits: number;
        total_withdrawals: number;
        player_balance: number;
    };
    series: Array<{ date: string; deposits: number; withdrawals: number }>;
    recent_users: User[];
    recent_transactions: Transaction[];
    top_games: Array<Pick<Game, "id" | "name" | "slug" | "thumbnail" | "plays_count" | "category">>;
};

export type AdminRole = {
    id: number;
    name: string;
    is_protected: boolean;
    users_count: number;
    permissions: Permission[];
};

export type PermissionDefinition = {
    name: Permission;
    description: string;
};

export type AdminResource = "users" | "games" | "categories" | "providers" | "banners" | "promotions" | "posts";
