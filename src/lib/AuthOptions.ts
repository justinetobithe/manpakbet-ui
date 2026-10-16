import type { NextAuthOptions, User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { isTokenExpired } from "@/lib/tokenExpiry";
import type { Permission, Role } from "@/types/User";

type ApiUser = {
    id: number | string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    role?: Role | null;
    permissions?: Permission[];
};

type ApiAuthResponse = {
    status: "success" | "error";
    message: string;
    data: { token: string; expires_at?: string | null; user: ApiUser };
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID ?? process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? process.env.GOOGLE_SECRET;

async function callAuthApi(path: string, body: Record<string, string>): Promise<ApiAuthResponse> {
    if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not configured");

    const res = await fetch(`${API_URL}/api/v1/auth/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.data?.token) throw new Error(json?.message ?? "Authentication failed");

    return json as ApiAuthResponse;
}

const toSessionUser = ({ data }: ApiAuthResponse): AuthUser => ({
    id: String(data.user.id),
    name: data.user.name ?? "",
    email: data.user.email ?? null,
    phone: data.user.phone ?? null,
    first_name: data.user.first_name ?? "",
    last_name: data.user.last_name ?? "",
    role: data.user.role ?? "user",
    permissions: data.user.permissions ?? [],
    auth_token: data.token,
    token_expires_at: data.expires_at ?? null,
});

const providers: NextAuthOptions["providers"] = [
    CredentialsProvider({
        id: "credentials",
        name: "Email",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
            if (!credentials?.email || !credentials.password) throw new Error("Email and password are required");
            return toSessionUser(await callAuthApi("login", { email: credentials.email, password: credentials.password }));
        },
    }),
    CredentialsProvider({
        id: "otp",
        name: "Phone",
        credentials: {
            phone: { label: "Phone", type: "tel" },
            code: { label: "Code", type: "text" },
        },
        authorize: async (credentials) => {
            if (!credentials?.phone || !credentials.code) throw new Error("Phone number and code are required");
            return toSessionUser(await callAuthApi("otp/verify", { phone: credentials.phone, code: credentials.code }));
        },
    }),
];

if (GOOGLE_ID && GOOGLE_SECRET) {
    providers.push(GoogleProvider({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }));
}

const AuthOptions: NextAuthOptions = {
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
    pages: { signIn: "/login", error: "/login" },
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {
            if (account?.provider === "google" && account.access_token) {
                Object.assign(token, toSessionUser(await callAuthApi("google", { access_provider_token: account.access_token })));
                return token;
            }

            if (user) Object.assign(token, user);

            if (trigger === "update" && session?.user) {
                const { first_name, last_name, email, phone, name } = session.user;
                Object.assign(token, { first_name, last_name, email, phone, name });
            }

            if (token.auth_token && isTokenExpired(token.token_expires_at)) {
                token.auth_token = "";
                token.expired = true;
            }

            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id ?? "",
                name: token.name ?? "",
                email: token.email ?? null,
                phone: token.phone ?? null,
                first_name: token.first_name ?? "",
                last_name: token.last_name ?? "",
                role: token.role ?? "user",
                permissions: token.permissions ?? [],
                auth_token: token.auth_token ?? "",
                token_expires_at: token.token_expires_at ?? null,
            };
            return session;
        },
    },
};

export const googleEnabled = Boolean(GOOGLE_ID && GOOGLE_SECRET);

export default AuthOptions;
