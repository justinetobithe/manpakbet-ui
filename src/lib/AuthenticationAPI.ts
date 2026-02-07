"use client";

import { api } from "./api";
import apiError from "@/lib/apiError";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import Response from "@/types/Response";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export type RegisterInputs = {
    email: string;
    password: string;
};

export const register = async (inputs: RegisterInputs): Promise<Response> => {
    try {
        const { data } = await api.post<Response>("/api/register", inputs);
        return data;
    } catch (err) {
        return { success: false, message: apiError(err) ?? "Registration failed" } as Response;
    }
};

export const useRegister = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async ({ inputs }: { inputs: RegisterInputs }): Promise<Response> => {
            return await register(inputs);
        },
        onSuccess: async (data: Response, { inputs }) => {
            if (!data.success) {
                toast({ description: data.message, variant: "destructive" });
                return;
            }

            toast({ description: data.message, variant: "success", duration: 800 });

            const res = await signIn("credentials", { ...inputs, redirect: false });
            if (res?.error) {
                toast({ description: res.error, variant: "destructive" });
                return;
            }

            router.refresh();
            router.push("/user/dashboard");
        },
    });
};

export const logout = async (): Promise<void> => {
    await api.post("/api/logout");
};

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            return await logout();
        },
        onSettled: () => {
            signOut({ callbackUrl: "/login" });
        },
    });
};
