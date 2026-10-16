export const TOKEN_EXPIRY_SKEW_MS = 15 * 1000;

export const tokenExpiresIn = (expiresAt?: string | null) => {
    if (!expiresAt) return Number.POSITIVE_INFINITY;
    const time = Date.parse(expiresAt);
    return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time - Date.now() - TOKEN_EXPIRY_SKEW_MS;
};

export const isTokenExpired = (expiresAt?: string | null) => tokenExpiresIn(expiresAt) <= 0;
