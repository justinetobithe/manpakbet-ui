import type { Metadata } from "next";
import Link from "next/link";
import { ShieldX } from "lucide-react";
import { AppButton } from "@/components/app";

export const metadata: Metadata = { title: "Access denied" };

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-5 p-6 text-center">
            <div className="grid size-20 place-items-center rounded-3xl bg-destructive/15 text-red-300 ring-1 ring-destructive/30">
                <ShieldX className="size-10" />
            </div>
            <div className="space-y-2">
                <h1 className="font-display text-3xl font-extrabold">Access denied</h1>
                <p className="max-w-sm text-sm text-muted-foreground">Your account doesn&apos;t have permission to view this page. Contact an administrator if you think this is a mistake.</p>
            </div>
            <div className="flex gap-2">
                <AppButton asChild tone="surface">
                    <Link href="/">Back to lobby</Link>
                </AppButton>
                <AppButton asChild>
                    <Link href="/account">My account</Link>
                </AppButton>
            </div>
        </div>
    );
}
