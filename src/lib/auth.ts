import type { User } from "@/types/user";
import { api, getCsrfCookie } from "@/lib/api";

export async function me(): Promise<User | null> {
    try {
        const res = await api.get("/api/me");
        return res.data ?? null;
    } catch {
        return null;
    }
}

export async function requestOtp(phone: string): Promise<{ dev_code?: string }> {
    await getCsrfCookie();
    const res = await api.post("/api/auth/otp/request", { phone });
    return res.data;
}

export async function verifyOtp(phone: string, code: string): Promise<User> {
    await getCsrfCookie();
    const res = await api.post("/api/auth/otp/verify", { phone, code });
    return res.data.user as User;
}

export async function logout(): Promise<void> {
    await getCsrfCookie();
    await api.post("/api/auth/logout");
}
