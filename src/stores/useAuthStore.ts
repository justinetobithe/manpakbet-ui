import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Session } from "next-auth";
import type { Permission, Role } from "@/types/User";

export type AuthUser = Omit<Session["user"], "auth_token">;

type AuthState = {
    user: AuthUser | null;
    status: "loading" | "authenticated" | "unauthenticated";
};

type AuthActions = {
    sync: (session: Session | null, status: AuthState["status"]) => void;
    can: (permission: Permission | Permission[]) => boolean;
    hasRole: (role: Role | Role[]) => boolean;
    isBackoffice: () => boolean;
};

export const useAuthStore = create<AuthState & AuthActions>()(
    immer((set, get) => ({
        user: null,
        status: "loading",
        sync: (session, status) =>
            set((state) => {
                state.status = status;
                if (!session?.user) {
                    state.user = null;
                    return;
                }
                const { auth_token: _token, ...user } = session.user;
                void _token;
                state.user = user;
            }),
        can: (permission) => {
            const granted = get().user?.permissions ?? [];
            const required = Array.isArray(permission) ? permission : [permission];
            return required.some((item) => granted.includes(item));
        },
        hasRole: (role) => {
            const current = get().user?.role;
            return Boolean(current && (Array.isArray(role) ? role.includes(current) : role === current));
        },
        isBackoffice: () => {
            const user = get().user;
            return Boolean(user && (user.role === "admin" || user.role === "staff" || user.permissions.length > 0));
        },
    }))
);
