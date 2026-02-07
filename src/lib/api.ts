import { toast } from "@/lib/toast";
import axios from "axios";
import { Session, getServerSession } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import AuthOptions from "./AuthOptions";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
    baseURL,
    headers: { "X-Requested-With": "XMLHttpRequest" },
    withCredentials: true,
});

let lastSession: Session | null = null;

api.interceptors.request.use(async (request) => {
    if (typeof window === "undefined") {
        const session = await getServerSession(AuthOptions);

        const token = (session?.user as any)?.auth_token;
        request.headers.Authorization = token ? `Bearer ${token}` : undefined;

        return request;
    }

    if (!lastSession || Date.now() > Date.parse(lastSession.expires)) {
        lastSession = await getSession();
    }

    const token = (lastSession?.user as any)?.auth_token;
    request.headers.Authorization = token ? `Bearer ${token}` : undefined;

    return request;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                toast({ description: "Unauthenticated", variant: "destructive" });

                if (typeof window !== "undefined" && window.location.pathname !== "/login") {
                    await signOut({ callbackUrl: "/login" });
                }

                return Promise.reject(error);
            }

            toast({
                description: error.response?.data?.message ?? error.message,
                variant: "destructive",
            });
        }

        return Promise.reject(error);
    }
);
