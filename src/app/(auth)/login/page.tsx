import { Suspense } from "react";
import type { Metadata } from "next";
import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
    return (
        <Suspense>
            <AuthPage initialMode="login" />
        </Suspense>
    );
}
