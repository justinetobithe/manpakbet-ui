"use client";

import * as React from "react";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { Toaster } from "sonner";
import { resetApiSession } from "@/lib/api";
import { rehydrateStores, useAuthStore } from "@/stores";

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

    React.useEffect(() => {
        resetApiSession();
    }, [token]);

    React.useEffect(() => {
        sync(data ?? null, status);
    }, [data, status, sync]);

    return null;
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
        <SessionProvider refetchOnWindowFocus={false}>
            <QueryClientProvider client={queryClient}>
                <StoreHydrator />
                <AuthSync />
                {children}
                <Toaster
                    theme="dark"
                    position="top-center"
                    richColors
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast: "!rounded-2xl !border !border-white/10 !bg-[#1a1029]/95 !backdrop-blur-xl !shadow-2xl !shadow-black/50 !font-sans",
                            description: "!text-white/65",
                        },
                    }}
                />
            </QueryClientProvider>
        </SessionProvider>
    );
}
