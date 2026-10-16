export type Role = "admin" | "staff" | "user" | (string & {});

export type Permission =
    | "dashboard.view"
    | "users.view"
    | "users.manage"
    | "users.balance"
    | "games.manage"
    | "content.manage"
    | "transactions.view"
    | "transactions.process"
    | "roles.manage";

export type User = {
    id: number;
    name: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
    role: Role;
    balance: string;
    is_active: boolean;
    last_login_at?: string | null;
    created_at: string;
    permissions?: Permission[];
};

export type ProfileInput = {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
};

export type PasswordInput = {
    current_password: string;
    password: string;
    password_confirmation: string;
};
