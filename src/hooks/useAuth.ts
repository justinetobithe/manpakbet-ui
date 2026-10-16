"use client";

import { useCallback } from "react";
import { useAuthStore, useUiStore } from "@/stores";
import type { Permission } from "@/types/User";

export function useAuth() {
    const user = useAuthStore((state) => state.user);
    const status = useAuthStore((state) => state.status);
    const openAuth = useUiStore((state) => state.openAuth);

    const can = useCallback(
        (permission: Permission | Permission[]) => {
            const granted = user?.permissions ?? [];
            const required = Array.isArray(permission) ? permission : [permission];
            return required.some((item) => granted.includes(item));
        },
        [user]
    );

    const requireAuth = useCallback(
        (action?: () => void) => {
            if (user) {
                action?.();
                return true;
            }
            openAuth("login");
            return false;
        },
        [user, openAuth]
    );

    const isBackoffice = Boolean(user && (user.role === "admin" || user.role === "staff" || user.permissions.length > 0));

    return {
        user,
        status,
        isAuthenticated: status === "authenticated" && Boolean(user),
        isLoading: status === "loading",
        isBackoffice,
        can,
        requireAuth,
    };
}
