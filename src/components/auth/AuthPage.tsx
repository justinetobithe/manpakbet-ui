"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AppLogo } from "@/components/app";
import AppToast from "@/components/app/AppToast";
import type { AuthMode } from "@/stores/useUiStore";
import { AuthShowcase } from "./AuthDialog";
import AuthForm from "./AuthForm";

export default function AuthPage({ initialMode }: { initialMode: AuthMode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mode, setMode] = React.useState<AuthMode>(initialMode);

    React.useEffect(() => {
        if (searchParams.get("expired")) AppToast.warning("Your session expired", { description: "Please log in again." });
        const error = searchParams.get("error");
        if (error) AppToast.error("Sign-in failed", { description: error === "CredentialsSignin" ? "Invalid credentials" : error });
    }, [searchParams]);

    const changeMode = (next: AuthMode) => {
        setMode(next);
        const query = searchParams.toString();
        router.replace(`/${next === "login" ? "login" : "register"}${query ? `?${query}` : ""}`, { scroll: false });
    };

    return (
        <div className="flex min-h-dvh items-center justify-center p-3 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="surface-strong grid w-full max-w-[980px] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/60 md:grid-cols-[0.9fr_1.1fr]"
            >
                <AuthShowcase />
                <div className="p-5 sm:p-9">
                    <div className="mb-6 md:hidden">
                        <AppLogo />
                    </div>
                    <h1 className="font-display text-3xl font-extrabold">{mode === "login" ? "Welcome back" : "Join the table"}</h1>
                    <p className="mt-1 mb-6 text-sm text-muted-foreground">{mode === "login" ? "Log in to your ManpakBet account." : "Create your account in under a minute."}</p>
                    <AuthForm mode={mode} onModeChange={changeMode} redirectAfter />
                </div>
            </motion.div>
        </div>
    );
}
