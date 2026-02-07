export type AppMode = "user" | "admin";

export function getAppModeFromRole(role?: string | null): AppMode {
    return role === "admin" ? "admin" : "user";
}
