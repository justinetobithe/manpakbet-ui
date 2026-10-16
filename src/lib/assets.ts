const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export const FALLBACK_IMAGE = "/banners/fallback.svg";

export const toAssetUrl = (path?: string | null): string => {
    if (!path) return FALLBACK_IMAGE;
    if (/^(https?:|data:|blob:)/i.test(path)) return path;

    const normalized = path.startsWith("/") ? path : `/${path}`;

    if (normalized.startsWith("/storage/")) return `${API_URL}${normalized}`;
    if (normalized.startsWith("/games/")) return `${API_URL}/storage${normalized}`;

    return normalized;
};

export const gameImage = (game: { banner?: string | null; thumbnail?: string | null }) =>
    toAssetUrl(game.banner || game.thumbnail);
