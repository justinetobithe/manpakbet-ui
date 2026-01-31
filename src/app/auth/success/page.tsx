"use client";

import { useEffect } from "react";
import { me } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthSuccessPage() {
    const setUser = useAuthStore((s) => s.setUser);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const u = await me();
            if (u) {
                setUser(u);
                toast.success("Logged in");
                router.replace("/dashboard");
            } else {
                toast.error("Session not found");
                router.replace("/auth");
            }
        })();
    }, [router, setUser]);

    return <div className="text-white/70">Finishing login…</div>;
}
