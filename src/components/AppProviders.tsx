"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qc = new QueryClient({
    defaultOptions: {
        queries: { retry: 1, refetchOnWindowFocus: false },
        mutations: { retry: 0 },
    },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <QueryClientProvider client={qc}>{children}</QueryClientProvider>
        </SessionProvider>
    );
}
