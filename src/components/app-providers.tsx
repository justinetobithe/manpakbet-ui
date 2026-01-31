"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const qc = new QueryClient({
    defaultOptions: {
        queries: { retry: 1, refetchOnWindowFocus: false },
        mutations: { retry: 0 },
    },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
