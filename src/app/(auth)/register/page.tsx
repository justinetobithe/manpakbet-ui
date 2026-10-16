import { Suspense } from "react";
import type { Metadata } from "next";
import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
    return (
        <Suspense>
            <AuthPage initialMode="register" />
        </Suspense>
    );
}
