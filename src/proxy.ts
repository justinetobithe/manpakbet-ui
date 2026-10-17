import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { isTokenExpired } from "@/lib/tokenExpiry";

const AUTH_PAGES = ["/login", "/register"];
const PLAYER_PAGES = ["/account", "/pay"];
const ADMIN_PREFIX = "/admin";

const ADMIN_ROUTE_PERMISSIONS: Array<[string, string]> = [
    ["/admin/transactions", "transactions.view"],
    ["/admin/users", "users.view"],
    ["/admin/games", "games.manage"],
    ["/admin/categories", "games.manage"],
    ["/admin/providers", "games.manage"],
    ["/admin/banners", "content.manage"],
    ["/admin/promotions", "content.manage"],
    ["/admin/news", "content.manage"],
    ["/admin/roles", "roles.manage"],
    ["/admin/kyc", "kyc.review"],
    ["/admin/rounds", "transactions.view"],
    ["/admin/settings", "settings.manage"],
];

const startsWith = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

const redirectTo = (request: NextRequest, pathname: string, withCallback = false, expired = false) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";
    if (withCallback) url.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    if (expired) url.searchParams.set("expired", "1");
    return NextResponse.redirect(url);
};

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const rawToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const expired = Boolean(rawToken && (!rawToken.auth_token || isTokenExpired(rawToken.token_expires_at)));
    const token = expired ? null : rawToken;
    const permissions = (token?.permissions ?? []) as string[];
    const isBackoffice = token?.role === "admin" || token?.role === "staff" || permissions.length > 0;

    if (AUTH_PAGES.some((page) => startsWith(pathname, page))) {
        if (token) return redirectTo(request, isBackoffice ? ADMIN_PREFIX : "/account");
        return NextResponse.next();
    }

    if (PLAYER_PAGES.some((page) => startsWith(pathname, page)) || /^\/play\/[^/]+\/launch\/?$/.test(pathname)) {
        if (!token) return redirectTo(request, "/login", true, expired);
        if (isBackoffice && PLAYER_PAGES.some((page) => startsWith(pathname, page))) return redirectTo(request, "/admin/profile");
        return NextResponse.next();
    }

    if (startsWith(pathname, ADMIN_PREFIX)) {
        if (!token) return redirectTo(request, "/login", true, expired);
        if (!isBackoffice) return redirectTo(request, "/unauthorized");

        const required = ADMIN_ROUTE_PERMISSIONS.find(([prefix]) => startsWith(pathname, prefix))?.[1];
        if (required && !permissions.includes(required)) return redirectTo(request, "/unauthorized");

        if (pathname === ADMIN_PREFIX && !permissions.includes("dashboard.view")) {
            const fallback = ADMIN_ROUTE_PERMISSIONS.find(([, permission]) => permissions.includes(permission));
            return redirectTo(request, fallback ? fallback[0] : "/unauthorized");
        }
    }

    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|banners|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)"],
};
