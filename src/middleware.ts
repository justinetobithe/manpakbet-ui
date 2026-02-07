import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
    function middleware(req: NextRequest) {
        const path = req.nextUrl.pathname;
        const token: any = (req as any).nextauth?.token;

        const isUserRoute = path.startsWith("/user");
        const isAdminRoute = path.startsWith("/admin");

        if (!isUserRoute && !isAdminRoute) return NextResponse.next();

        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        if (isAdminRoute && token.role !== "admin") {
            const url = req.nextUrl.clone();
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    },
    {
        callbacks: { authorized: () => true },
    }
);

export const config = {
    matcher: ["/user/:path*", "/admin/:path*"],
};
