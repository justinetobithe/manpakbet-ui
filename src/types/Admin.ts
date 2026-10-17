import type { Game, GameProvider, GameRound } from "./Casino";
import type { KycSubmission } from "./Kyc";
import type { Permission, User } from "./User";
import type { Transaction } from "./Wallet";

export type AdminStats = {
    totals: {
        players: number;
        new_players_today: number;
        games: number;
        active_promotions: number;
        pending_transactions: number;
        pending_kyc: number;
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

export type AdminResource = "users" | "games" | "categories" | "providers" | "banners" | "promotions" | "posts" | "transactions" | "rounds" | "kyc";

export type GameStats = {
    rounds: number;
    total_bets: number;
    total_wins: number;
    ggr: number;
    rtp: number | null;
    sessions: number;
    real_sessions: number;
    demo_sessions: number;
    last_played_at: string | null;
    plays?: number;
};

export type AdminRound = GameRound & {
    user?: { id: number; first_name?: string | null; last_name?: string | null; email?: string | null; phone?: string | null } | null;
};

export type AdminGameDetail = {
    game: Game;
    provider: (GameProvider & { games_count: number }) | null;
    stats: GameStats;
    recent_rounds: AdminRound[];
};

export type AdminProviderDetail = {
    provider: GameProvider & { games_count: number; active_games_count: number };
    stats: GameStats;
    top_games: Game[];
};

export type AdminUserDetail = {
    user: User & { kyc?: KycSubmission | null; permissions: Permission[] };
    stats: GameStats & { total_deposits: number; total_withdrawals: number; pending_transactions: number };
};

export type AppSettings = {
    general: {
        site_name: string;
        tagline: string;
        support_email: string;
        support_phone: string;
        announcement: string;
        maintenance_mode: boolean;
    };
    payments: {
        gcash_enabled: boolean;
        gcash_account_name: string;
        gcash_account_number: string;
        gcash_qr: string;
        maya_enabled: boolean;
        maya_account_name: string;
        maya_account_number: string;
        maya_qr: string;
        require_kyc_for_withdraw: boolean;
        min_deposit: number;
        max_deposit: number;
        min_withdraw: number;
        max_withdraw: number;
    };
    games: {
        demo_enabled: boolean;
        hot_badge_limit: number;
    };
};

export type SystemInfo = {
    game_provider: { driver: string; name: string; connected: boolean; callback_url: string; currency: string; session_ttl_minutes: number };
    security: { token_expiration_minutes: number; otp_dev_mode: boolean };
    app: { environment: string; debug: boolean; laravel: string; php: string };
};
