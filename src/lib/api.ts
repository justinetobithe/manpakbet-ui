import axios from "axios";
import type { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
    timeout: 20000,
});

let cachedSession: Session | null = null;
let sessionPromise: Promise<Session | null> | null = null;

const resolveSession = async () => {
    if (cachedSession && Date.now() < Date.parse(cachedSession.expires)) return cachedSession;
    sessionPromise ??= getSession().finally(() => {
        sessionPromise = null;
    });
    cachedSession = await sessionPromise;
    return cachedSession;
};

export const resetApiSession = () => {
    cachedSession = null;
};

api.interceptors.request.use(async (config) => {
    if (typeof window === "undefined") return config;

    const session = await resolveSession();
    const token = session?.user?.auth_token;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401 && typeof window !== "undefined") {
            const hadToken = Boolean(error.config?.headers?.Authorization);
            resetApiSession();

            if (hadToken) await signOut({ callbackUrl: "/login?expired=1" });
        }

        return Promise.reject(error);
    }
);
