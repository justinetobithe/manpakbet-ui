"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { api, resetApiSession } from "@/lib/api";
import type { ApiEnvelope } from "@/types/Api";

export type RegisterInputs = {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
};

type OtpResponse = ApiEnvelope<{ expires_in: number; dev_code?: string | null }>;

export const register = async (inputs: RegisterInputs) => {
    const { data } = await api.post("/auth/register", inputs);
    return data;
};

export const requestOtp = async (phone: string) => {
    const { data } = await api.post<OtpResponse>("/auth/otp/request", { phone });
    return data;
};

export const logout = async () => {
    await api.post("/auth/logout");
};

export const useRegister = () => useMutation({ mutationFn: register });

export const useRequestOtp = () => useMutation({ mutationFn: requestOtp });

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await logout().catch(() => undefined);
        },
        onSettled: async () => {
            resetApiSession();
            queryClient.clear();
            await signOut({ callbackUrl: "/" });
        },
    });
};
