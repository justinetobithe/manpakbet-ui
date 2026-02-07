import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

type ApiLoginResponse = {
    data: {
        token: string;
        user: {
            id: number | string;
            email: string | null;
            role?: "user" | "admin" | string;
            first_name?: string | null;
            last_name?: string | null;
            phone?: string | null;
        };
    };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiLogin(email: string, password: string): Promise<ApiLoginResponse> {
    const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.message ?? "Login failed");
    return json as ApiLoginResponse;
}

async function apiLoginWithGoogle(access_provider_token: string): Promise<ApiLoginResponse> {
    const res = await fetch(`${API_URL}/api/login/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ provider: "google", access_provider_token }),
        cache: "no-store",
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.message ?? "Google login failed");
    return json as ApiLoginResponse;
}

const AuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email or password is missing.");
                }

                const response = await apiLogin(credentials.email, credentials.password);
                const u = response.data.user;

                return {
                    id: String(u.id ?? ""),
                    email: u.email ?? credentials.email,
                    role: (u.role as any) ?? "user",
                    first_name: u.first_name ?? "",
                    last_name: u.last_name ?? "",
                    phone: u.phone ?? null,
                    auth_token: response.data.token,
                } as any;
            },
        }),

        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: { strategy: "jwt" },

    pages: {
        signIn: "/login",
        error: "/unauthenticated",
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (account?.provider === "google" && account.access_token) {
                const response = await apiLoginWithGoogle(account.access_token);
                const u = response.data.user;

                token.auth_token = response.data.token;
                token.role = (u.role as any) ?? "user";
                token.first_name = u.first_name ?? "";
                token.last_name = u.last_name ?? "";
                token.phone = u.phone ?? null;
                token.email = u.email ?? token.email;
                token.id = String(u.id ?? token.id ?? "");
                return token;
            }

            if (user) {
                token.auth_token = (user as any).auth_token;
                token.role = (user as any).role ?? "user";
                token.first_name = (user as any).first_name ?? "";
                token.last_name = (user as any).last_name ?? "";
                token.phone = (user as any).phone ?? null;
                token.email = (user as any).email ?? token.email;
                token.id = String((user as any).id ?? token.id ?? "");
            }

            return token;
        },

        async session({ session, token }) {
            (session.user as any).auth_token = (token as any).auth_token ?? "";
            (session.user as any).role = (token as any).role ?? "user";
            (session.user as any).first_name = (token as any).first_name ?? "";
            (session.user as any).last_name = (token as any).last_name ?? "";
            (session.user as any).phone = (token as any).phone ?? null;
            (session.user as any).id = (token as any).id ?? "";
            (session.user as any).email = token.email ?? null;

            return session;
        },
    },
};

export default AuthOptions;
