"use client";

import * as React from "react";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { resetApiSession } from "@/lib/api";
import { isTokenExpired, tokenExpiresIn } from "@/lib/tokenExpiry";
import { rehydrateStores, useAuthStore } from "@/stores";
import RealtimeSync from "./RealtimeSync";

function makeQueryClient() {
    return new QueryClient({
        queryCache: new QueryCache(),
        mutationCache: new MutationCache(),
        defaultOptions: {
            queries: {
                retry: (count, error) => {
                    const status = (error as { response?: { status?: number } })?.response?.status;
                    if (status && status >= 400 && status < 500) return false;
                    return count < 2;
                },
                refetchOnWindowFocus: false,
                staleTime: 30 * 1000,
            },
            mutations: { retry: 0 },
        },
    });
}

function AuthSync() {
    const { data, status } = useSession();
    const sync = useAuthStore((state) => state.sync);
    const token = data?.user?.auth_token;
    const expiresAt = data?.user?.token_expires_at;
    const authenticated = status === "authenticated";

    React.useEffect(() => {
        resetApiSession();
    }, [token]);

    React.useEffect(() => {
        if (!authenticated) return;

        const expire = () => {
            resetApiSession();
            void signOut({ callbackUrl: "/login?expired=1" });
        };

        if (!token || isTokenExpired(expiresAt)) {
            expire();
            return;
        }

        const remaining = tokenExpiresIn(expiresAt);
        if (!Number.isFinite(remaining)) return;

        const timer = window.setTimeout(expire, Math.min(remaining, 2_147_483_000));
        const onFocus = () => {
            if (isTokenExpired(expiresAt)) expire();
        };
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onFocus);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onFocus);
        };
    }, [authenticated, token, expiresAt]);

    React.useEffect(() => {
        sync(data ?? null, status);
    }, [data, status, sync]);

    return null;
}

function ThemedToaster() {
    const { resolvedTheme } = useTheme();

    return (
        <Toaster
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            position="top-center"
            richColors
            closeButton
            toastOptions={{
                classNames: {
                    toast: "!rounded-2xl !border !border-border !bg-popover/95 !text-foreground !backdrop-blur-xl !shadow-2xl !shadow-black/20 !font-sans",
                    description: "!text-muted-foreground",
                },
            }}
        />
    );
}

function StoreHydrator() {
    React.useEffect(() => {
        void rehydrateStores();
    }, []);

    return null;
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(makeQueryClient);

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="mpb-theme" disableTransitionOnChange>
            <SessionProvider refetchOnWindowFocus={false}>
                <QueryClientProvider client={queryClient}>
                    <StoreHydrator />
                    <AuthSync />
                    <RealtimeSync />
                    {children}
                    <ThemedToaster />
                </QueryClientProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}
