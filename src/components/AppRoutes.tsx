"use client";

import Link from "next/link";
import type { AppMode } from "@/lib/appMode";
import User from "@/types/User";

export default function AppRoutes({ user, mode }: { user: User; mode: AppMode }) {
    if (mode === "admin") {
        return (
            <div className="space-y-2 text-sm">
                <Link className="block underline" href="/admin/dashboard">Dashboard</Link>
                <Link className="block underline" href="/admin/users">Users</Link>
                <Link className="block underline" href="/admin/games">Games</Link>
            </div>
        );
    }

    return (
        <div className="space-y-2 text-sm">
            <Link className="block underline" href="/user/dashboard">Dashboard</Link>
            <Link className="block underline" href="/games">Games</Link>
            <Link className="block underline" href="/user/account">Account</Link>
        </div>
    );
}
