"use client";

import { RotateCcw } from "lucide-react";
import { AppButton } from "@/components/app";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-5 p-6 text-center">
            <div className="space-y-2">
                <h1 className="font-display text-2xl font-extrabold">Something went wrong</h1>
                <p className="max-w-sm text-sm text-muted-foreground">An unexpected error occurred. Please try again.</p>
            </div>
            <AppButton leftIcon={<RotateCcw />} onClick={reset}>
                Try again
            </AppButton>
        </div>
    );
}
