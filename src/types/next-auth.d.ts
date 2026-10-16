import "next-auth";
import "next-auth/jwt";
import type { Permission, Role } from "@/types/User";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            first_name: string;
            last_name: string;
            role: Role;
            permissions: Permission[];
            auth_token: string;
            token_expires_at: string | null;
        };
    }

    interface User {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        first_name: string;
        last_name: string;
        role: Role;
        permissions: Permission[];
        auth_token: string;
        token_expires_at: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        name?: string;
        email?: string | null;
        phone?: string | null;
        first_name?: string;
        last_name?: string;
        role?: Role;
        permissions?: Permission[];
        auth_token?: string;
        token_expires_at?: string | null;
        expired?: boolean;
    }
}
