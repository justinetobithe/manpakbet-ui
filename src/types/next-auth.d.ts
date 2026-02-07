import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            role?: "user" | "admin";
            auth_token?: string;
            first_name?: string;
            last_name?: string;
            phone?: string | null;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        role?: "user" | "admin";
        auth_token?: string;
        first_name?: string;
        last_name?: string;
        phone?: string | null;
    }
}
